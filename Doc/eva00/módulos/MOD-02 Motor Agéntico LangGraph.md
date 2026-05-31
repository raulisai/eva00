---
dev: Dev 2
framework: LangGraph
fase:
  - 1
  - 2
  - 3
  - 4
módulo: agentic-engine
tipo: arquitectura
---
# 🧠 Motor Agéntico — LangGraph (EVA-00)

> Framework: **LangGraph** (sobre LangChain)  
> Dev responsable: Dev 2  
> Reemplaza: AgentExecutor simple → Grafo de estados con loops y sub-agentes

---

## ¿Por qué LangGraph y no LangChain AgentExecutor?

| Feature | AgentExecutor (viejo) | LangGraph |
|---------|----------------------|-----------|
| Control de flujo | Lineal | Grafo arbitrario |
| Loops | Limitado | Nativo (con condiciones) |
| Sub-agentes | Manual | Nativo (sub-graphs) |
| Estado persistente | No | Sí (State schema) |
| Interrupciones humanas | Difícil | Human-in-the-loop nativo |
| Multitask / paralelo | No | Sí (parallel branches) |
| Debug/tracing | Básico | LangSmith nativo |

---

## 🗺️ Grafo Principal de EVA

```python
# core/llm/eva_graph.py
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.supabase import SupabaseSaver
from typing import TypedDict, Annotated
import operator

class EVAState(TypedDict):
    # Input
    messages: Annotated[list, operator.add]
    user_input: str
    user_id: str
    
    # Contexto
    emotion: str
    memory_context: list[str]
    
    # Control de flujo
    plan: list[str]           # Pasos planeados
    current_step: int
    tool_calls: list[dict]
    tool_results: list[dict]
    retry_count: int
    
    # Output
    final_response: str
    avatar_actions: list[dict]  # Para el frontend


def build_eva_graph():
    workflow = StateGraph(EVAState)
    
    # Nodos
    workflow.add_node("recall_memory", recall_memory_node)
    workflow.add_node("planner", planner_node)
    workflow.add_node("executor", executor_node)
    workflow.add_node("reviewer", reviewer_node)
    workflow.add_node("responder", responder_node)
    
    # Edges
    workflow.set_entry_point("recall_memory")
    workflow.add_edge("recall_memory", "planner")
    workflow.add_edge("planner", "executor")
    workflow.add_edge("executor", "reviewer")
    
    # Condicional: reviewer decide si hacer retry o responder
    workflow.add_conditional_edges(
        "reviewer",
        should_retry,
        {
            "retry": "executor",      # Volver a intentar
            "done": "responder",      # Responder al usuario
            "replan": "planner",      # Replanear completamente
        }
    )
    workflow.add_edge("responder", END)
    
    # Checkpointer → Supabase para persistir estado entre mensajes
    checkpointer = SupabaseSaver.from_conn_string(SUPABASE_URL)
    
    return workflow.compile(checkpointer=checkpointer)
```

---

## 🔧 Nodos del Grafo

### 1. `recall_memory` — Recuperar contexto
```python
async def recall_memory_node(state: EVAState) -> EVAState:
    """Busca en memoria semántica antes de planear"""
    memories = await memory.recall(
        query=state["user_input"],
        user_id=state["user_id"],
        top_k=5
    )
    return {"memory_context": memories}
```

### 2. `planner` — Descomponer intención
```python
async def planner_node(state: EVAState) -> EVAState:
    """EVA descompone la petición en pasos ejecutables"""
    planner_prompt = f"""
    Usuario dijo: {state['user_input']}
    Memoria relevante: {state['memory_context']}
    
    Descompón esto en pasos específicos usando las tools disponibles.
    Responde SOLO con JSON: {{"steps": ["paso1", "paso2", ...]}}
    """
    response = await llm.ainvoke(planner_prompt)
    plan = json.loads(response.content)["steps"]
    return {"plan": plan, "current_step": 0}
```

### 3. `executor` — Ejecutar herramientas
```python
async def executor_node(state: EVAState) -> EVAState:
    """Ejecuta el paso actual del plan usando tools o sub-agentes"""
    current_step = state["plan"][state["current_step"]]
    
    # El LLM decide qué tool usar para este paso
    result = await agent_with_tools.ainvoke({
        "input": current_step,
        "context": state["tool_results"]
    })
    
    return {
        "tool_calls": state["tool_calls"] + [result.tool_calls],
        "tool_results": state["tool_results"] + [result.output],
        "current_step": state["current_step"] + 1
    }
```

### 4. `reviewer` — Validar y decidir
```python
async def reviewer_node(state: EVAState) -> EVAState:
    """Revisa si el resultado es suficiente o hay que reintentar"""
    # Si ya terminamos todos los pasos
    if state["current_step"] >= len(state["plan"]):
        return {"review": "done"}
    
    # Si hay un error en el último resultado
    last_result = state["tool_results"][-1]
    if "error" in last_result and state["retry_count"] < 3:
        return {"review": "retry", "retry_count": state["retry_count"] + 1}
    
    # Si los resultados no responden la pregunta original
    quality = await check_quality(state)
    if quality < 0.7:
        return {"review": "replan"}
    
    return {"review": "done"}
```

---

## 🌐 Agent Gateway

```python
# core/llm/gateway.py

class AgentGateway:
    """
    Punto de entrada central para todos los agentes y tools.
    Aplica guardianes, controla tokens, registra uso.
    """
    
    def __init__(self):
        self.guardians = GuardianManager()
        self.token_tracker = TokenTracker()
        self.skill_registry = SkillRegistry()
        self.mcp_registry = MCPRegistry()
    
    async def route(self, request: AgentRequest) -> AgentResponse:
        # 1. Aplicar guardianes (filtros de seguridad/permisos)
        if not await self.guardians.check(request):
            raise PermissionError("Guardián bloqueó la solicitud")
        
        # 2. Verificar token skill disponible
        skill = self.skill_registry.get(request.skill_id)
        if not skill or not skill.is_active:
            raise ValueError(f"Skill {request.skill_id} no disponible")
        
        # 3. Registrar inicio
        session = await self.token_tracker.start_session(request)
        
        # 4. Rutear al agente/tool correcto
        if request.type == "mcp":
            result = await self.mcp_registry.call(request)
        elif request.type == "browser":
            result = await browser_agent.run(request)
        elif request.type == "server":
            result = await server_agent.run(request)
        else:
            result = await eva_graph.ainvoke(request.input)
        
        # 5. Registrar fin y consumo de tokens
        await self.token_tracker.end_session(session, result)
        
        return result
```

---

## 🔌 Protocolo MCP (Model Context Protocol)

EVA puede cargar **servidores MCP externos** que exponen tools adicionales:

```python
# core/mcp/registry.py
from mcp import ClientSession, StdioServerParameters

class MCPRegistry:
    def __init__(self):
        self.servers: dict[str, MCPServer] = {}
    
    async def register(self, name: str, command: str, args: list):
        """Registra un servidor MCP externo"""
        params = StdioServerParameters(command=command, args=args)
        session = await ClientSession.create(params)
        tools = await session.list_tools()
        
        self.servers[name] = MCPServer(
            name=name,
            session=session,
            tools=tools,
            active=True
        )
    
    async def call(self, server: str, tool: str, params: dict):
        """Llama a un tool de un servidor MCP"""
        server_obj = self.servers[server]
        return await server_obj.session.call_tool(tool, params)
```

**MCPs que puede usar EVA:**
- `filesystem` — leer/escribir archivos del servidor
- `github` — gestionar repos
- `postgres` — queries SQL directas
- `puppeteer` — browser alternativo
- Custom MCPs del usuario

---

## 🎯 Skill Tokens

Los **Skill Tokens** son módulos de habilidad que se activan/desactivan:

```python
# core/skills/registry.py
class SkillToken:
    id: str               # "web-browsing", "server-control"
    name: str             # Nombre display
    description: str      # Qué hace
    tools: list[str]      # Tools que habilita
    cost_per_use: int     # Tokens que consume (para billing)
    active: bool          # Si está habilitado
    permissions: list[str] # Qué permisos necesita

BUILT_IN_SKILLS = [
    SkillToken("web-browsing", "Navegación web", tools=["navigate","click","extract"]),
    SkillToken("server-control", "Control servidor", tools=["exec","status","ssh"]),
    SkillToken("memory", "Memoria larga", tools=["remember","recall"]),
    SkillToken("scheduler", "Tareas programadas", tools=["schedule","cancel"]),
    SkillToken("file-manager", "Gestión de archivos", tools=["read","write","delete"]),
]
```
