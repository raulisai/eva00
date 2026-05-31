---
módulo: arquitectura
prioridad: alta
tipo: arquitectura
---
# 🏗️ Arquitectura General — EVA-00

## Diagrama de Flujo General

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                        │
│                                                                 │
│  ┌──────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │  Avatar UI   │  │   Chat Panel    │  │  Browser Frame   │  │
│  │  (Live2D/    │  │   (mensajes,    │  │  (páginas web    │  │
│  │   Three.js)  │  │    voz, tareas) │  │   inyectadas)    │  │
│  └──────────────┘  └─────────────────┘  └──────────────────┘  │
│         │                  │                      │             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Next.js App Router (Frontend)              │  │
│  │   WebSocket Client | API Routes | State Management      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP/WS
┌─────────────────────────────────────────────────────────────────┐
│                      SERVIDOR (VPS Linux)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  FastAPI (Python)                         │  │
│  │   /api/chat  /api/browser  /api/server  /api/tasks       │  │
│  └──────────────────────────────────────────────────────────┘  │
│         │              │              │              │           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ LLM Core │  │ Browser  │  │  Server  │  │   Task       │  │
│  │ (Claude  │  │ Control  │  │  Manager │  │  Scheduler   │  │
│  │ +LangChn)│  │(Playwright│  │(Paramiko │  │  (Celery)    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
│         │              │              │              │           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Supabase                               │  │
│  │  PostgreSQL | Auth | Realtime | Storage | Edge Func.    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Comunicación entre Capas

### Frontend → Backend
- **REST API** para acciones puntuales (chat, comandos)
- **WebSocket** para streaming de respuestas y eventos en tiempo real
- **Supabase Realtime** para sync de estado y notificaciones

### Backend → Sistema
- **subprocess / Paramiko** para ejecutar comandos en el servidor
- **Playwright** para control del navegador headless
- **Celery + Redis** para tareas en background y multitask

### Backend → DB
- **Supabase Python Client** para CRUD
- **Supabase Realtime** para push de eventos al frontend

---

## Seguridad

- Todas las acciones de servidor pasan por una **capa de permisos** validada
- El browser headless corre en **sandbox aislado**
- Auth con **JWT de Supabase** en cada request
- Variables sensibles en **`.env` + Vault** (nunca en código)
- Rate limiting en FastAPI con **slowapi**
- CORS configurado solo para el dominio del frontend
