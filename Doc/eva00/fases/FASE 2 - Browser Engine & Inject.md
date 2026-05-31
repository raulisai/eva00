---
duración: 3 semanas
estado: pendiente
fase: 2
prerequisito: Fase 1
tipo: plan-trabajo
---
# 🌐 FASE 2 — Browser Engine & Page Injector (EVA-00)

> **Duración estimada:** 3 semanas  
> **Prerequisito:** Fase 1 completada  
> **Objetivo:** EVA puede navegar internet e inyectar páginas en la UI

---

## ✅ Entregables de Fase 2

### Frontend (Dev 1)
- [ ] BrowserFrame component (iframe + proxy)
- [ ] Barra de URL con historial (back/forward)
- [ ] Vista dividida: Avatar + Browser side-by-side
- [ ] Indicador visual de "EVA está navegando..."
- [ ] Historial de páginas visitadas (sidebar)
- [ ] Screenshots de páginas en el chat

### Backend (Dev 2)
- [ ] BrowserController con Playwright (headless Chromium)
- [ ] Endpoints: `/browser/navigate`, `/browser/click`, `/browser/type`, `/browser/screenshot`
- [ ] Tool de browser para el agente LangChain
- [ ] Proxy HTTP en Next.js para evitar CORS
- [ ] Extracción de texto/datos de páginas (BeautifulSoup)
- [ ] WebSocket events para acciones del browser

### Infra (Dev 3)
- [ ] Tabla `browser_sessions` en Supabase
- [ ] Storage bucket para screenshots
- [ ] Playwright instalado en contenedor Docker
- [ ] Rate limiting en endpoints de browser

---

## 🔄 Flujo de Navegación

```
Usuario: "EVA, abre YouTube y busca música lo-fi"
    ↓
EVA (LLM) detecta intención → usa BrowserNavigateTool
    ↓
Backend: Playwright navega a youtube.com
    ↓
Screenshot capturado → enviado a frontend via WS
    ↓
Frontend: BrowserFrame muestra la página via proxy
    ↓
EVA: "Encontré esto, ¿quieres que reproduzca algo?" [con screenshot]
    ↓
Usuario: "Sí, el primero"
    ↓
EVA → BrowserClickTool → hace clic en el primer resultado
```

---

## 🔌 Proxy de Páginas (Next.js)

```typescript
// app/api/proxy/route.ts
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  // EVA ya tiene el HTML procesado en el backend
  // Este endpoint sirve el HTML con assets reescritos
  const response = await fetch(`${BACKEND_URL}/browser/content?url=${url}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  
  const html = await response.text();
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
```

---

## 📸 Modo Screenshot vs Modo Live

| Modo | Cuándo usar | Cómo funciona |
|------|-------------|---------------|
| **Screenshot** | Mostrar a EVA lo que hay en la página | Playwright screenshot → imagen en chat |
| **Live Proxy** | Usuario quiere interactuar con la página | HTML procesado → iframe en UI |
| **Data Extract** | EVA necesita leer datos | BeautifulSoup → texto estructurado al LLM |

---

## 📋 Tareas Detalladas

### Semana 4 — Playwright Setup
| Tarea | Dev | Días |
|-------|-----|------|
| BrowserController básico (navigate + screenshot) | Dev 2 | 3 |
| Tool de browser para LangChain | Dev 2 | 2 |
| Docker con Playwright instalado | Dev 3 | 1 |

### Semana 5 — Frontend Integration  
| Tarea | Dev | Días |
|-------|-----|------|
| BrowserFrame + proxy Next.js | Dev 1 | 3 |
| Vista dividida avatar+browser | Dev 1 | 2 |
| WebSocket events browser | Dev 2 | 2 |

### Semana 6 — Polish & Storage
| Tarea | Dev | Días |
|-------|-----|------|
| Historial browser en Supabase | Dev 2+3 | 2 |
| Screenshots en Storage | Dev 3 | 1 |
| Click y type desde chat | Dev 1+2 | 2 |
| QA y ajustes | Todos | 2 |
