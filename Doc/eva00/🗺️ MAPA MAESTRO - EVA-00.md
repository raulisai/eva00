---
proyecto: EVA-00
tipo: índice
estado: activo
equipo: 3 devs
stack:
  - Next.js
  - Python
  - Supabase
---
# 🗺️ MAPA MAESTRO — EVA-00
> Asistente virtual con avatar anime, control total de servidor, navegación web inyectada y arquitectura modular multitask.

---

## 📁 Estructura de Notas del Proyecto

```
eva00/
├── 🗺️ MAPA MAESTRO - EVA-00.md          ← estás aquí
├── arquitectura/
│   ├── 01 - Arquitectura General.md
│   ├── 02 - Frontend (Next.js).md
│   ├── 03 - Backend (Python).md
│   ├── 04 - Base de Datos (Supabase).md
│   └── 05 - Sistema de Control de Servidor.md
├── fases/
│   ├── FASE 1 - Core & Avatar.md
│   ├── FASE 2 - Browser Engine & Inject.md
│   ├── FASE 3 - Control de Servidor.md
│   └── FASE 4 - Multitask & Autonomía.md
├── equipo/
│   ├── Dev 1 - Frontend Lead.md
│   ├── Dev 2 - Backend Lead.md
│   └── Dev 3 - DevOps & Infra.md
└── módulos/
    ├── MOD-01 Avatar Engine.md
    ├── MOD-02 Chat & LLM Core.md
    ├── MOD-03 Browser Controller.md
    ├── MOD-04 Page Injector.md
    ├── MOD-05 Server Manager.md
    ├── MOD-06 Memory & Context.md
    └── MOD-07 Task Scheduler.md
```

---

## 🎯 Visión del Producto

EVA-00 es una **asistente virtual tipo VTuber/anime** que:
- Vive en una interfaz web elegante con avatar 3D/2D animado
- Tiene **control total del servidor** donde está instalada
- Puede **navegar internet libremente** y mostrar páginas dentro de la UI
- **Inyecta contenido web** en la interfaz sin salir de la app
- Soporta **multitask** — hace varias cosas en paralelo
- Usa voz, texto, y acciones autónomas

---

## 🧠 Stack Tecnológico

| Capa | Tecnología | Rol |
|------|-----------|-----|
| Frontend | Next.js 14 (App Router) | UI, avatar, inyección de páginas |
| Backend API | FastAPI (Python) | Lógica, LLM, orquestación |
| AI/LLM | Claude API + LangChain | Cerebro de EVA |
| DB | Supabase (PostgreSQL) | Memoria, sesiones, logs |
| Realtime | Supabase Realtime + WebSockets | Sync en vivo |
| Browser | Playwright (Python) | Control de navegador headless |
| Server Control | Paramiko / subprocess / Shell API | Control SSH y sistema |
| Avatar | Live2D / Three.js / Rive | Animación del personaje |
| Auth | Supabase Auth | Acceso seguro |
| Deploy | Docker + VPS (Linux) | Contenedores modulares |

---

## 🚦 Estado de Fases

- [ ] **FASE 1** — Core, Avatar, Chat básico
- [ ] **FASE 2** — Browser Engine + Page Injector
- [ ] **FASE 3** — Control de Servidor completo
- [ ] **FASE 4** — Multitask, autonomía, memoria larga

---

## 👥 Asignación de Equipo

| Dev | Rol Principal | Fases |
|-----|--------------|-------|
| Dev 1 | Frontend Lead (Next.js, Avatar, UI) | F1, F2 |
| Dev 2 | Backend Lead (Python, LLM, Browser) | F1, F2, F3 |
| Dev 3 | DevOps & Infra (Docker, VPS, Supabase) | F1, F3, F4 |
