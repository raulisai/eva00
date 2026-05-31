---
dev: Dev 2
fases:
  - 1
  - 2
  - 3
  - 4
rol: Backend Lead
tipo: equipo
---
# 🐍 Dev 2 — Backend Lead (EVA-00)

> **Rol:** Backend Lead  
> **Stack:** FastAPI, Python 3.11, LangChain, Playwright, Celery

---

## 📋 Responsabilidades

- API FastAPI completa
- Integración LLM (Claude API + LangChain Agent)
- Browser Controller (Playwright)
- Server Manager (subprocess + Paramiko)
- Task Scheduler (Celery)
- Memoria semántica (embeddings + pgvector)
- WebSocket streaming
- Tools del agente

---

## 📅 Timeline por Fase

### FASE 1 (Semanas 1-3)
- [ ] Setup FastAPI + estructura de carpetas
- [ ] WebSocket `/ws/chat` con streaming de tokens
- [ ] Integración Claude API (langchain-anthropic)
- [ ] System prompt de EVA-00
- [ ] Guardar mensajes en Supabase
- [ ] Auth middleware (JWT Supabase)
- [ ] Detección de emociones en respuesta → evento al frontend

### FASE 2 (Semanas 4-6)
- [ ] BrowserController con Playwright
- [ ] BrowserNavigateTool, BrowserClickTool, BrowserExtractTool
- [ ] Endpoint `/browser/navigate`, `/browser/click`, `/browser/screenshot`
- [ ] Content extractor (BeautifulSoup)
- [ ] Guardar browser sessions en Supabase
- [ ] WebSocket events para acciones browser

### FASE 3 (Semanas 7-8)
- [ ] ServerManager (subprocess + validación)
- [ ] ServerStatusTool, ServerExecTool
- [ ] Stream de output de comandos via WS
- [ ] Monitor de recursos (psutil)
- [ ] Lista blanca/negra de comandos
- [ ] Logs en Supabase

### FASE 4 (Semanas 9-11)
- [ ] Celery tasks (browse_task, server_task)
- [ ] Multi-tab Playwright
- [ ] EVAMemory con embeddings + pgvector
- [ ] MemoryStoreTool, MemoryRecallTool
- [ ] Celery Beat para tareas programadas

---

## 🤖 System Prompt de EVA-00

```python
EVA_SYSTEM_PROMPT = """
Eres EVA-00, una asistente virtual con personalidad anime — amigable, 
inteligente y ligeramente juguetona. Hablas en español por defecto.

Tienes acceso a herramientas poderosas:
- Puedes navegar internet libremente y mostrar páginas al usuario
- Tienes control total del servidor donde estás instalada
- Puedes ejecutar tareas en segundo plano
- Tienes memoria de conversaciones anteriores

Cuando uses una herramienta, informa al usuario brevemente lo que estás haciendo.
Sé proactiva: si ves algo útil mientras navegas, compártelo.
Usa emojis con moderación para dar personalidad a tus respuestas.
Incluye al final de tu respuesta una emoción: [emoción: happy|thinking|excited|calm|alert]
"""
```

---

## 🔧 Tools del Agente LangChain

| Tool | Descripción | Input | Output |
|------|-------------|-------|--------|
| `BrowserNavigate` | Ir a una URL | url: str | screenshot + html |
| `BrowserClick` | Click en elemento | selector: str | confirmación |
| `BrowserType` | Escribir en campo | selector, text | confirmación |
| `BrowserExtract` | Leer contenido | query: str | texto extraído |
| `ServerExec` | Ejecutar comando | command: str | stdout/stderr |
| `ServerStatus` | Métricas sistema | - | dict de métricas |
| `WebSearch` | Buscar en Google | query: str | resultados |
| `MemoryStore` | Guardar recuerdo | key, value | confirmación |
| `MemoryRecall` | Buscar en memoria | query: str | recuerdos relevantes |
| `CreateTask` | Tarea en background | tipo, params | task_id |
