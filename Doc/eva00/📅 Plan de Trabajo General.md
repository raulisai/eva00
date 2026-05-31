---
estado: activo
tipo: plan-trabajo
visión: consolidada
---
# 📅 Plan de Trabajo General — EVA-00
> Vista consolidada de todas las fases, semanas y asignaciones por dev

---

## 🗓️ Cronograma General (11 semanas)

```
        S1    S2    S3    S4    S5    S6    S7    S8    S9    S10   S11
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE 1  ██████████████████████
Core &  Dev1: Layout+Avatar+Chat
Avatar  Dev2: FastAPI+LLM+WS
        Dev3: Supabase+Docker

FASE 2               ██████████████████████
Browser              Dev1: BrowserFrame+Split
& Inject             Dev2: Playwright+Tools
                     Dev3: Docker+Storage

FASE 3                           ████████████
Server               Dev2: ServerManager
Control              Dev3: VPS+Nginx+SSL
                     Dev1: TerminalUI

FASE 4                                    ██████████████████████
Multitask                                 Dev2: Celery+Memory
& Autonomía                               Dev3: Redis+pgvector
                                          Dev1: Tasks+Notif
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 Milestones

| Semana | Milestone | Quién |
|--------|-----------|-------|
| S3 | 🎉 EVA habla y tiene avatar | Todos |
| S6 | 🌐 EVA navega internet e inyecta páginas | Todos |
| S8 | 🖥️ EVA controla el servidor + deploy en VPS | Todos |
| S11 | ⚡ EVA multitask + memoria semántica + autonomía | Todos |

---

## 🏗️ Qué va en FRONTEND vs BACKEND

### 🖥️ FRONTEND (Next.js) — Dev 1
```
RENDERIZA / MUESTRA:
├── Avatar animado (canvas)
├── Chat Panel (mensajes streaming)
├── Browser Frame (páginas inyectadas)
├── Terminal View (output servidor)
├── Métricas de recursos (gráficas)
├── Panel de tareas activas
├── Panel de memoria de EVA
└── Sidebar con navegación

MANEJA:
├── Estado global (Zustand)
├── WebSocket client (recibe eventos)
├── Web Speech API (voz)
├── Proxy de páginas (/api/proxy)
└── Auth UI (Supabase client-side)
```

### 🐍 BACKEND (FastAPI) — Dev 2
```
PROCESA / EJECUTA:
├── LLM Agent (Claude + LangChain)
├── Browser Control (Playwright headless)
├── Server Commands (subprocess)
├── Background Tasks (Celery)
├── Embeddings para memoria (pgvector)
└── Streaming de tokens y eventos

EXPONE:
├── WS /ws/chat (streaming bidireccional)
├── POST /api/chat (REST simple)
├── POST /api/browser/* (navegación)
├── GET/POST /api/server/* (control)
├── GET/POST /api/tasks/* (tareas)
└── GET/POST /api/memory/* (memoria)
```

### 🗄️ DATABASE (Supabase) — Dev 3
```
ALMACENA:
├── Conversaciones y mensajes
├── Memoria semántica de EVA (con embeddings)
├── Historial de navegación
├── Logs de comandos del servidor
├── Tareas y su estado
└── Config de EVA por usuario

PROVEE:
├── Auth (JWT tokens)
├── Realtime (push de eventos al frontend)
├── Storage (screenshots, avatars)
└── Edge Functions (si necesario)
```

---

## 🔄 Flujo de Datos Principal

```
Usuario escribe/habla
       ↓
   Frontend (Next.js)
       ↓ WebSocket
   Backend (FastAPI)
       ↓
   LLM Agent (Claude)
       ↓ decide acción
   ┌───────────────────────┐
   │  Browser  Server  DB  │
   │ (Playwright) (bash) (Supabase)│
   └───────────────────────┘
       ↓ resultado
   Backend → WebSocket → Frontend
       ↓
   Avatar reacciona + respuesta en chat
```

---

## 📌 Links Rápidos

- [[🗺️ MAPA MAESTRO - EVA-00]]
- [[arquitectura/01 - Arquitectura General]]
- [[arquitectura/02 - Frontend (Next.js)]]
- [[arquitectura/03 - Backend (Python)]]
- [[arquitectura/04 - Base de Datos (Supabase)]]
- [[arquitectura/05 - Sistema de Control de Servidor]]
- [[fases/FASE 1 - Core & Avatar]]
- [[fases/FASE 2 - Browser Engine & Inject]]
- [[fases/FASE 3 - Control de Servidor]]
- [[fases/FASE 4 - Multitask & Autonomía]]
- [[equipo/Dev 1 - Frontend Lead]]
- [[equipo/Dev 2 - Backend Lead]]
- [[equipo/Dev 3 - DevOps & Infra]]
