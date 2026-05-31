---
dev: Dev 1
fase:
  - 1
  - 2
módulo: frontend
tipo: arquitectura
---
# 🖥️ Frontend — Next.js 14 (EVA-00)

> **Dev responsable:** Dev 1 — Frontend Lead  
> **Stack:** Next.js 14 (App Router), TypeScript, TailwindCSS, Zustand, Socket.io-client

---

## 📁 Estructura de Carpetas

```
frontend/
├── app/
│   ├── layout.tsx              # Layout raíz + providers
│   ├── page.tsx                # Pantalla principal (home de EVA)
│   ├── api/
│   │   └── proxy/route.ts      # Proxy para páginas inyectadas (CORS)
│   └── (panels)/
│       ├── chat/page.tsx
│       ├── browser/page.tsx
│       └── server/page.tsx
├── components/
│   ├── avatar/
│   │   ├── AvatarCanvas.tsx    # Canvas 3D/2D del avatar
│   │   ├── AvatarController.tsx # Controla expresiones/animaciones
│   │   └── SpeechBubble.tsx    # Burbuja de diálogo animada
│   ├── chat/
│   │   ├── ChatPanel.tsx       # Panel de mensajes
│   │   ├── MessageBubble.tsx   # Burbuja de mensaje individual
│   │   ├── VoiceInput.tsx      # Micrófono / STT
│   │   └── TextInput.tsx       # Input de texto
│   ├── browser/
│   │   ├── BrowserFrame.tsx    # iFrame / proxy de página web
│   │   ├── BrowserControls.tsx # Barra de URL, back/forward
│   │   └── PageInjector.tsx    # Inyecta contenido/scripts
│   ├── server/
│   │   ├── ServerPanel.tsx     # Monitor de recursos
│   │   ├── TerminalView.tsx    # Terminal en tiempo real
│   │   └── TaskList.tsx        # Tareas activas del servidor
│   ├── sidebar/
│   │   └── Sidebar.tsx         # Barra lateral (como en el diseño)
│   └── ui/
│       ├── Modal.tsx
│       ├── Toast.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── websocket.ts            # Cliente WebSocket centralizado
│   ├── supabase.ts             # Cliente Supabase frontend
│   ├── api.ts                  # Fetch wrapper para FastAPI
│   └── avatar-animations.ts   # Mapa de emociones → animaciones
├── store/
│   ├── chatStore.ts            # Estado del chat (Zustand)
│   ├── browserStore.ts         # Estado del browser inyectado
│   ├── serverStore.ts          # Estado del servidor
│   └── avatarStore.ts          # Estado emocional del avatar
├── hooks/
│   ├── useWebSocket.ts
│   ├── useVoice.ts             # Web Speech API
│   ├── useBrowserControl.ts
│   └── useServerStatus.ts
└── types/
    ├── chat.ts
    ├── browser.ts
    └── server.ts
```

---

## 🧩 Módulos Clave del Frontend

### 1. Avatar Engine
- **Tecnología:** Rive o Live2D (WebGL) embebido en `<canvas>`
- Expresiones activadas por emociones detectadas en respuesta del LLM
- Sincronización labial con TTS (Text-to-Speech del browser / ElevenLabs)
- Estados: idle, talking, thinking, happy, alert

### 2. Chat Panel
- Streaming de tokens en tiempo real via WebSocket
- Soporte Markdown en respuestas
- Historial persistido en Supabase
- Input de texto + botón de voz (Web Speech API)

### 3. Browser Frame (Page Injector)
```tsx
// BrowserFrame.tsx — renderiza páginas controladas por EVA
<iframe
  src={`/api/proxy?url=${encodedUrl}`}
  sandbox="allow-scripts allow-same-origin"
  className="w-full h-full rounded-xl"
/>
```
- Proxy interno en Next.js `/api/proxy` para evitar CORS
- EVA puede navegar, hacer clic, llenar forms via comandos al backend
- Pantalla dividida: avatar + browser side-by-side

### 4. Sidebar (como en el diseño)
- Home, Notas, Explorador, Memoria, Configuración
- Indicador de Gemini/IA activa (punto inferior)
- Estado de conexión al servidor

---

## 🔌 Comunicación con Backend

```typescript
// lib/websocket.ts
const ws = new WebSocket(`wss://${SERVER}/ws/chat`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // { type: 'token' | 'action' | 'browser_event' | 'server_event' }
};
```

```typescript
// lib/api.ts — llamadas REST
export const sendMessage = (msg: string) =>
  fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: msg }) });

export const navigateTo = (url: string) =>
  fetch('/api/browser/navigate', { method: 'POST', body: JSON.stringify({ url }) });
```

---

## 🎨 UI/UX (basada en el diseño de referencia)

- Fondo: blanco/gris muy claro, minimalista
- Avatar centrado, grande, ocupa ~60% del área principal
- Panel de chat flotante a la izquierda del avatar
- Browser frame deslizable desde la derecha
- Input inferior con micrófono y enviar
- Sidebar izquierda con íconos (Home, Notas, Web, Memoria, Settings)
- Color accent: teal/verde azulado (#20B2AA)

---

## 📦 Dependencias Principales

```json
{
  "next": "14.x",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "zustand": "4.x",
  "@supabase/supabase-js": "2.x",
  "socket.io-client": "4.x",
  "@rive-app/react-canvas": "latest",
  "framer-motion": "11.x",
  "react-markdown": "9.x"
}
```
