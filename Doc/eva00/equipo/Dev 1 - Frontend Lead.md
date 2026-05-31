---
dev: Dev 1
fases:
  - 1
  - 2
  - 3
  - 4
rol: Frontend Lead
tipo: equipo
---
# 👩‍💻 Dev 1 — Frontend Lead (EVA-00)

> **Rol:** Frontend Lead  
> **Stack:** Next.js 14, TypeScript, TailwindCSS, Zustand, Rive/Three.js

---

## 📋 Responsabilidades

- Toda la UI de la aplicación
- Sistema de Avatar (canvas, animaciones, emociones)
- Chat Panel (mensajes, streaming, voz)
- Browser Frame (inyección de páginas)
- Panels de servidor, tareas, memoria
- WebSocket client
- Estado global con Zustand

---

## 📅 Timeline por Fase

### FASE 1 (Semanas 1-3)
- [ ] Setup Next.js 14 + TypeScript + TailwindCSS
- [ ] Layout base + Sidebar con íconos
- [ ] ChatPanel con MessageBubble streaming
- [ ] VoiceInput (Web Speech API)
- [ ] AvatarCanvas con animación idle (placeholder)
- [ ] SpeechBubble animada
- [ ] WebSocket client (`lib/websocket.ts`)
- [ ] Auth UI (login/logout)

### FASE 2 (Semanas 4-6)
- [ ] BrowserFrame component
- [ ] Proxy de páginas via Next.js API route
- [ ] Vista split: Avatar + Browser
- [ ] Barra de URL con historial
- [ ] Screenshots en chat
- [ ] Indicador "EVA navegando..."

### FASE 3 (Semanas 7-8)
- [ ] ServerPanel en sidebar
- [ ] TerminalView (output en tiempo real)
- [ ] Gráficas de recursos (CPU/RAM/Disk)
- [ ] Lista de procesos
- [ ] Dialogo de confirmación para comandos peligrosos
- [ ] Panel Docker básico

### FASE 4 (Semanas 9-11)
- [ ] TaskList (cola de tareas activas)
- [ ] Notificaciones (Supabase Realtime)
- [ ] Panel de Memoria de EVA
- [ ] Búsqueda de historial
- [ ] Polish final y animaciones

---

## 🎨 Guía de Diseño

```
Colores:
  Primary: #20B2AA (teal — accent principal)
  Background: #F8F9FA (gris muy claro)
  Surface: #FFFFFF (cards, panels)
  Text: #1A1A2E (casi negro)
  Sidebar: #FFFFFF con border derecho sutil

Tipografía:
  UI: Inter o Geist Sans
  Mono (terminal): JetBrains Mono

Radios: rounded-xl (12px) para cards, rounded-full para botones
Sombras: shadow-sm, sin sombras dramáticas
Espaciado: gap-4, p-4 estándar
```

---

## 🔗 Interfaces con Backend

```typescript
// Tipos de mensajes WebSocket que recibe el frontend
type WSMessage =
  | { type: 'token'; content: string }           // Streaming LLM
  | { type: 'action'; action: string; data: any } // Acción de EVA
  | { type: 'browser_screenshot'; b64: string }   // Screenshot
  | { type: 'browser_navigate'; url: string }     // Navegar
  | { type: 'server_output'; line: string }       // Terminal output
  | { type: 'server_metrics'; cpu: number; ram: object } // Métricas
  | { type: 'task_update'; task: Task }           // Update de tarea
  | { type: 'emotion'; emotion: AvatarEmotion }   // Emoción del avatar
```
