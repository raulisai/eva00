---
duración: 3 semanas
estado: pendiente
fase: 1
tipo: plan-trabajo
---
# 🚀 FASE 1 — Core & Avatar (EVA-00)

> **Duración estimada:** 3 semanas  
> **Objetivo:** EVA funciona, habla, y tiene interfaz base

---

## ✅ Entregables de Fase 1

### Frontend (Dev 1)
- [ ] Proyecto Next.js 14 inicializado con TypeScript + Tailwind
- [ ] Layout base con Sidebar (Home, Notas, Explorador, Memoria, Config)
- [ ] Avatar canvas con animación idle (Rive o Three.js placeholder)
- [ ] Chat Panel con input de texto y burbujas de mensajes
- [ ] Conexión WebSocket al backend (streaming de tokens)
- [ ] SpeechBubble animada sobre el avatar
- [ ] Responsive básico (desktop first)

### Backend (Dev 2)
- [ ] Proyecto FastAPI inicializado
- [ ] Endpoint WebSocket `/ws/chat` con streaming
- [ ] Integración Claude API (langchain-anthropic)
- [ ] System prompt base de EVA-00
- [ ] Endpoint REST `/api/health`
- [ ] Logging básico

### Infra (Dev 3)
- [ ] Supabase proyecto creado y configurado
- [ ] Tablas: `profiles`, `conversations`, `messages`
- [ ] Auth configurada (email/password)
- [ ] Docker Compose local (frontend + backend + redis)
- [ ] Variables de entorno documentadas
- [ ] README de setup

---

## 📋 Tareas Detalladas

### Semana 1 — Setup & Scaffolding
| Tarea | Dev | Días |
|-------|-----|------|
| Init Next.js + configurar ESLint/Prettier | Dev 1 | 1 |
| Diseñar layout base + Sidebar | Dev 1 | 2 |
| Init FastAPI + estructura de carpetas | Dev 2 | 1 |
| Setup Supabase + tablas base | Dev 3 | 2 |
| Docker Compose básico | Dev 3 | 1 |

### Semana 2 — Core Features
| Tarea | Dev | Días |
|-------|-----|------|
| WebSocket chat (frontend) | Dev 1 | 2 |
| WebSocket chat + streaming (backend) | Dev 2 | 2 |
| Integración Claude API | Dev 2 | 1 |
| Guardar mensajes en Supabase | Dev 2+3 | 1 |
| Input de voz (Web Speech API) | Dev 1 | 1 |

### Semana 3 — Avatar & Polish
| Tarea | Dev | Días |
|-------|-----|------|
| Avatar canvas (animación idle) | Dev 1 | 3 |
| Sistema de emociones en respuestas | Dev 1+2 | 2 |
| Auth (login/logout) | Dev 1+3 | 1 |
| Testing E2E básico | Todos | 1 |

---

## 🎯 Definition of Done — Fase 1
- Usuario puede chatear con EVA en tiempo real
- Respuestas aparecen con streaming (token a token)
- Avatar está en pantalla con animación idle
- Mensajes se guardan en Supabase
- Auth funciona
- Docker Compose levanta todo el stack
