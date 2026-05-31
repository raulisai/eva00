---
dev: Dev 2
fase:
  - 1
  - 2
  - 3
módulo: backend
tipo: arquitectura
---
# 🐍 Backend — Python FastAPI (EVA-00)

> **Dev responsable:** Dev 2 — Backend Lead  
> **Stack:** FastAPI, Python 3.11+, LangChain, Playwright, Celery, Redis

---

## 📁 Estructura de Carpetas

```
backend/
├── main.py                     # Entry point FastAPI
├── config.py                   # Settings (Pydantic BaseSettings)
├── requirements.txt
├── Dockerfile
│
├── api/
│   ├── routes/
│   │   ├── chat.py             # POST /chat, WS /ws/chat
│   │   ├── browser.py          # POST /browser/navigate, /click, /type
│   │   ├── server.py           # POST /server/exec, GET /server/status
│   │   ├── tasks.py            # GET/POST /tasks
│   │   └── memory.py           # GET/POST /memory
│   └── dependencies.py         # Auth, rate limiting
│
├── core/
│   ├── llm/
│   │   ├── eva_brain.py        # Agente principal LangChain
│   │   ├── prompts.py          # System prompts de EVA-00
│   │   ├── tools.py            # Tools del agente (browser, server, web)
│   │   └── memory.py           # ConversationBufferMemory + Supabase
│   ├── browser/
│   │   ├── controller.py       # Playwright manager
│   │   ├── navigator.py        # Navegar, screenshot, extraer DOM
│   │   └── injector.py         # Inyectar scripts/CSS en páginas
│   ├── server/
│   │   ├── manager.py          # Control del sistema (subprocess)
│   │   ├── ssh_client.py       # Paramiko para SSH remoto
│   │   └── monitor.py          # CPU, RAM, disco, procesos
│   └── tasks/
│       ├── scheduler.py        # Celery app + tasks
│       └── workers.py          # Workers por tipo de tarea
│
├── db/
│   ├── supabase_client.py      # Cliente Supabase Python
│   ├── models.py               # Modelos Pydantic
│   └── crud.py                 # Operaciones DB
│
└── utils/
    ├── streaming.py            # Generator para SSE/WS streaming
    ├── security.py             # Validación de comandos peligrosos
    └── screenshot.py           # Captura de pantalla a base64
```

---

## 🤖 EVA Brain — Agente LangChain

```python
# core/llm/eva_brain.py
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-opus-4-5", streaming=True)

# Tools disponibles para EVA
tools = [
    BrowserNavigateTool(),    # Navegar a URL
    BrowserClickTool(),       # Hacer clic en elemento
    BrowserExtractTool(),     # Extraer texto/datos de página
    ServerExecTool(),         # Ejecutar comandos en servidor
    ServerStatusTool(),       # Ver estado del sistema
    WebSearchTool(),          # Buscar en internet
    MemoryStoreTool(),        # Guardar en memoria larga
    MemoryRecallTool(),       # Recuperar de memoria
    CreateTaskTool(),         # Crear tarea en background
]

agent = create_openai_tools_agent(llm, tools, EVA_SYSTEM_PROMPT)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
```

---

## 🌐 Browser Controller (Playwright)

```python
# core/browser/controller.py
from playwright.async_api import async_playwright

class BrowserController:
    def __init__(self):
        self.browser = None
        self.page = None
    
    async def start(self):
        pw = await async_playwright().start()
        self.browser = await pw.chromium.launch(headless=True)
        self.context = await self.browser.new_context()
        self.page = await self.context.new_page()
    
    async def navigate(self, url: str) -> dict:
        await self.page.goto(url)
        screenshot = await self.page.screenshot()
        html = await self.page.content()
        return {"url": url, "screenshot_b64": b64(screenshot), "html": html}
    
    async def click(self, selector: str):
        await self.page.click(selector)
    
    async def type_text(self, selector: str, text: str):
        await self.page.fill(selector, text)
    
    async def inject_script(self, js: str):
        return await self.page.evaluate(js)
    
    async def get_page_as_proxy(self, url: str) -> str:
        """Retorna HTML procesado para inyectar en frontend"""
        await self.navigate(url)
        return await self.page.content()
```

---

## 🖥️ Server Manager

```python
# core/server/manager.py
import subprocess
import psutil

class ServerManager:
    BLOCKED_COMMANDS = ["rm -rf /", "mkfs", "dd if=/dev/zero"]
    
    def execute(self, command: str, timeout: int = 30) -> dict:
        # Validar comando contra lista negra
        self._validate(command)
        result = subprocess.run(
            command, shell=True, capture_output=True,
            text=True, timeout=timeout
        )
        return {"stdout": result.stdout, "stderr": result.stderr, "code": result.returncode}
    
    def get_status(self) -> dict:
        return {
            "cpu_percent": psutil.cpu_percent(),
            "ram": psutil.virtual_memory()._asdict(),
            "disk": psutil.disk_usage('/')._asdict(),
            "processes": len(psutil.pids()),
            "uptime": uptime()
        }
    
    def _validate(self, command: str):
        for blocked in self.BLOCKED_COMMANDS:
            if blocked in command:
                raise PermissionError(f"Comando bloqueado: {blocked}")
```

---

## ⚡ WebSocket Streaming (Chat)

```python
# api/routes/chat.py
@router.websocket("/ws/chat")
async def chat_ws(websocket: WebSocket, token: str):
    await websocket.accept()
    
    async for token_chunk in agent_executor.astream(
        {"input": user_message}
    ):
        await websocket.send_json({
            "type": "token",
            "content": token_chunk
        })
    
    # Cuando EVA ejecuta una acción:
    await websocket.send_json({
        "type": "action",
        "action": "browser_navigate",
        "url": "https://example.com"
    })
```

---

## 📦 Dependencias Principales

```txt
fastapi==0.111.0
uvicorn[standard]==0.30.0
langchain==0.2.0
langchain-anthropic==0.1.15
playwright==1.44.0
supabase==2.4.0
celery[redis]==5.4.0
paramiko==3.4.0
psutil==5.9.8
python-jose[cryptography]==3.3.0
slowapi==0.1.9
pydantic-settings==2.3.0
```
