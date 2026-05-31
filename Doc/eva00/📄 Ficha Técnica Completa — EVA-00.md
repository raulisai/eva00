---
version: '1.0'
fecha: Mayo 2026
equipo: 3 devs
estado: arquitectura
duracion: 11 semanas
tipo: ficha-tecnica
proyecto: EVA-00
tags:
  - eva00
  - ficha-tecnica
  - arquitectura
  - langgraph
  - nextjs
  - supabase
---
# 📄 Ficha Técnica Completa — EVA-00

> Asistente Virtual Inteligente con Control de Servidor, Navegación Web Autónoma y Motor Agéntico

---

| Campo | Detalle |
|---|---|
| **Versión** | 1.0 — Arquitectura inicial |
| **Fecha** | Mayo 2026 |
| **Equipo** | 3 desarrolladores (Frontend, Backend, DevOps) |
| **Estado** | Fase de arquitectura y planificación |
| **Duración total** | 11 semanas — 4 fases |
| **Stack principal** | Next.js 14 · FastAPI · LangGraph · Supabase |

---

## 1. Resumen Ejecutivo

EVA-00 es una **asistente virtual de inteligencia artificial** con personalidad de avatar anime que vive en una interfaz web inmersiva. A diferencia de chatbots convencionales, EVA-00 tiene **control total del servidor donde está instalada**, puede navegar internet de forma autónoma e inyectar páginas web directamente en la interfaz del usuario, y ejecuta múltiples tareas en paralelo con memoria semántica persistente entre sesiones.

El proyecto combina un **avatar 2D animado con lip sync en tiempo real**, un **motor agéntico basado en LangGraph** (grafos de estado con loops de razonamiento), un **gateway de agentes** con guardianes de seguridad configurables, y un **panel de control administrativo** donde el usuario gestiona habilidades, herramientas MCP, preferencias y descarga de módulos adicionales.

> **Propósito central:** Crear el primer asistente personal de IA que no solo responde preguntas, sino que actúa: navega la web, administra el servidor, ejecuta tareas programadas y aprende de cada conversación. El usuario interactúa con EVA como si fuera una persona — con voz, expresiones y gestos — mientras EVA opera infraestructura real en segundo plano.

---

## 2. Descripción Detallada del Producto

### 2.1 El problema que resuelve

Los asistentes de IA actuales (ChatGPT, Claude, Gemini) presentan limitaciones críticas para usuarios técnicos y power users:

- No tienen memoria persistente entre sesiones sin configuración compleja.
- No pueden ejecutar acciones reales en el sistema operativo del usuario.
- No pueden navegar la web de forma autónoma e integrar el resultado visualmente.
- Requieren copiar/pegar contexto constantemente entre herramientas.
- No se pueden extender con módulos o herramientas externas de forma sencilla.
- Carecen de personalidad consistente y presencia visual que genere conexión.

### 2.2 La solución: EVA-00

EVA-00 aborda cada uno de estos puntos con una arquitectura modular y extensible. La asistente opera como un **agente autónomo con estado** que puede razonar, planear, ejecutar herramientas y corregirse a sí misma mediante bucles de revisión interna.

**Componentes principales:**

- **Avatar con alma** — Avatar animado (Rive) con expresiones faciales, lip sync fonético y gestos corporales. Interfaz visual minimalista: fondo neutro, sidebar funcional, burbuja de diálogo animada e input de voz/texto inferior.
- **Inteligencia real** — Motor Claude (Anthropic) orquestado por LangGraph — grafo de estados con nodos Planner, Executor, Reviewer y Memory que permite razonamiento multi-paso con reintentos automáticos.
- **Control del servidor** — EVA puede ejecutar comandos bash, administrar contenedores Docker, monitorear recursos en tiempo real y gestionar servicios del sistema operativo desde lenguaje natural.
- **Navegación autónoma** — Playwright headless permite a EVA navegar, hacer clic, extraer datos e inyectar páginas web completas dentro de la interfaz mediante un proxy Next.js.
- **Multitarea paralela** — Celery + Redis permite que EVA ejecute varias tareas simultáneamente y reporte los resultados vía Supabase Realtime.
- **Memoria semántica** — pgvector en Supabase almacena embeddings de conversaciones y hechos importantes. EVA recuerda preferencias, proyectos y contexto entre sesiones.
- **Panel de control** — Interfaz administrativa para configurar guardianes de seguridad, activar skill tokens, conectar servidores MCP externos y descargar módulos adicionales.

### 2.3 Diseño visual y experiencia de usuario

La interfaz de EVA-00 está inspirada en aplicaciones de productividad con avatar virtual (estilo VTuber para escritorio).

| Elemento | Especificación |
|---|---|
| **Paleta** | Blanco / Gris neutro / Teal `#20B2AA` como accent principal |
| **Tipografía** | Inter o Geist Sans — sans-serif moderno |
| **Avatar** | Personaje anime femenino, cabello rosa, ojos azules — estilo kawaii profesional |
| **Sidebar** | 5 iconos verticales: Home, Notas, Explorador Web, Memoria, Configuración |
| **Input** | Barra inferior flotante con placeholder "Pregunta algo…", botón de micrófono y enviar |
| **Speech bubble** | Burbuja flotante junto al avatar con ondas de audio animadas |
| **Fondo** | Blanco/gris claro neutro — sin elementos decorativos agresivos |

---

## 3. Stack Tecnológico Completo

### 3.1 Tabla de tecnologías

| Capa | Tecnología | Descripción | Dev |
|---|---|---|---|
| Frontend | Next.js 14 (App Router) | UI principal, avatar canvas, panel de chat, browser frame inyectado, proxy de páginas | Dev 1 |
| Estado (FE) | Zustand 4 | Gestión de estado global: chat, avatar, browser, servidor | Dev 1 |
| Avatar | Rive / Live2D | Motor de animación 2D con State Machine: expresiones, lip sync, gestos corporales | Dev 1 |
| Voz — STT | Web Speech API / Deepgram | Reconocimiento de voz en tiempo real del usuario hacia texto | Dev 1 |
| Voz — TTS | ElevenLabs / Edge TTS | Síntesis de voz con clonación de voz personalizada para EVA | Dev 1 |
| Backend API | FastAPI (Python 3.11) | API REST + WebSocket, orquestación de agentes, streaming de tokens | Dev 2 |
| Motor agéntico | LangGraph + LangChain | Grafo de estados: Planner → Executor → Reviewer → Memory con loops condicionales | Dev 2 |
| LLM | Claude (Anthropic API) | Modelo de razonamiento principal: claude-opus / claude-sonnet | Dev 2 |
| Browser | Playwright (Python) | Navegador headless Chromium: navegar, clic, extraer DOM, tomar screenshots | Dev 2 |
| Servidor ctrl | subprocess + Paramiko | Ejecutar comandos bash, SSH remoto, monitoreo con psutil | Dev 2 |
| Tareas async | Celery + Redis | Cola de tareas background para multitask paralelo y tareas programadas | Dev 2 / Dev 3 |
| Protocolo | MCP (Model Context Protocol) | Conectar servidores externos (GitHub, filesystem, Postgres, custom) vía stdio | Dev 2 |
| Base de datos | Supabase (PostgreSQL) | Almacenamiento de conversaciones, memoria, logs, tareas, configuración | Dev 3 |
| Realtime | Supabase Realtime | Push de eventos al frontend: tareas completadas, métricas, notificaciones | Dev 3 |
| Memoria semán. | pgvector (extensión PG) | Embeddings vectoriales para búsqueda semántica en memoria de EVA | Dev 3 |
| Auth | Supabase Auth (JWT) | Autenticación con tokens JWT, Row Level Security en todas las tablas | Dev 3 |
| Storage | Supabase Storage | Screenshots de browser, assets del avatar, exportaciones del usuario | Dev 3 |
| Deploy | Docker + Docker Compose | Contenedores: frontend, backend, celery_worker, redis, nginx | Dev 3 |
| Proxy/SSL | Nginx + Certbot | Reverse proxy, SSL/TLS automático con Let's Encrypt | Dev 3 |
| Infra | VPS Linux (Hetzner/DO) | Servidor de producción Ubuntu 24 con acceso privilegiado | Dev 3 |

### 3.2 Decisiones técnicas clave

#### ¿Por qué LangGraph y no LangChain AgentExecutor?

LangChain AgentExecutor es lineal: `tool → respuesta`. LangGraph es un **grafo de estados arbitrario**: permite que el agente planee, ejecute, revise su resultado y decida si reintentar o replanear. Esto es esencial para tareas complejas como "navega a esta URL, extrae los datos, guárdalos en un archivo y dame un resumen" — que requieren múltiples herramientas con contexto compartido y posibles fallos intermedios.

#### ¿Por qué Rive para el avatar?

Rive ejecuta animaciones con **State Machines nativas en WebAssembly**, lo que permite transiciones fluidas entre estados (idle → talking → thinking) sin escribir lógica de animación manual. El editor Rive permite al diseñador definir las transiciones visualmente y el código solo necesita cambiar inputs (`emotion: 'happy'`, `isTalking: true`).

#### ¿Por qué Supabase en lugar de una DB propia?

Supabase provee en un solo servicio: PostgreSQL + Auth con JWT + Realtime (WebSockets sobre PG) + Storage + pgvector para embeddings. Elimina la necesidad de configurar Redis para Realtime, Auth0 para autenticación, y un servidor de embeddings separado. Para un equipo de 3 desarrolladores, la **reducción de complejidad operacional es crítica**.

---

## 4. Arquitectura del Sistema

### 4.1 Capas del sistema

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPA 1 — Interfaz de Usuario (Next.js)                         │
│  Avatar canvas · Chat streaming · BrowserFrame · TerminalView   │
│  WebSocket client · Zustand state · Supabase Realtime listener  │
└────────────────────────────┬────────────────────────────────────┘
                             │ WebSocket / REST
┌────────────────────────────▼────────────────────────────────────┐
│  CAPA 2 — Motor Agéntico (LangGraph + FastAPI)                  │
│  recall_memory → planner → executor → reviewer → responder      │
│  Estado persistido en Supabase entre mensajes (SupabaseSaver)   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  CAPA 3 — Agent Gateway                                         │
│  Aplica guardianes · Verifica skill tokens · Registra uso       │
│  Enruta a: browser / server / MCP / Celery task                 │
└──────┬──────────┬──────────┬──────────┬──────────┬─────────────┘
       │          │          │          │          │
   Browser    Server     MCP Tools  Skill Tkns  App Store
  (Playwright)(subprocess)(stdio)   (registry)  (installer)
       │          │          │          │          │
┌──────▼──────────▼──────────▼──────────▼──────────▼─────────────┐
│  CAPA 5 — Supabase                                              │
│  PostgreSQL · Auth · Realtime · Storage · pgvector              │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Módulos del sistema

| Módulo | Función | Tecnologías | Fase |
|---|---|---|---|
| Avatar Engine | Renderizar avatar, expresiones, lip sync y gestos | Rive, Web Audio API, WebGL | F1 |
| Voz Engine | STT: voz a texto. TTS: texto a voz con lip sync | Web Speech API, ElevenLabs, Rhubarb | F1 |
| Chat Core | Mensajes en tiempo real con streaming token a token | WebSocket, FastAPI, LangGraph | F1 |
| LLM Brain | Razonamiento, planificación y generación de respuestas | Claude API, LangGraph, LangChain | F1 |
| Memory Manager | Memoria corto y largo plazo con búsqueda semántica | pgvector, Supabase, Embeddings | F1, F4 |
| Browser Ctrl | Navegar internet, clic, extraer datos, screenshots | Playwright, BeautifulSoup, Next.js proxy | F2 |
| Page Injector | Mostrar páginas web dentro de la interfaz de EVA | iframe, Next.js API route proxy | F2 |
| Server Manager | Ejecutar comandos, monitorear recursos, gestionar servicios | subprocess, psutil, Paramiko, systemd | F3 |
| MCP Registry | Conectar y gestionar servidores MCP externos | MCP Protocol, stdio, ClientSession | F3 |
| Task Scheduler | Tareas paralelas y programadas en background | Celery, Redis, Celery Beat | F4 |
| Agent Gateway | Enrutar, filtrar y registrar todas las llamadas agénticas | FastAPI middleware, Python | F2+ |
| Skill Tokens | Sistema de permisos y capacidades activables por módulo | Supabase, Python registry | F2+ |
| Control Panel | UI admin: guardianes, skills, MCP, preferencias, apps | Next.js, Supabase, FastAPI config API | F3+ |
| App Store | Descargar e instalar módulos adicionales de IA | pip install, MCP registration, Supabase | F4 |

---

## 5. Plan de Trabajo por Fases

### 5.1 Resumen de fases

| Fase | Nombre | Objetivo | Entregables clave | Duración |
|---|---|---|---|---|
| F1 | Core & Avatar | EVA habla, tiene avatar animado y chat funcional | WebSocket, streaming LLM, avatar Rive, Auth, DB base | 3 semanas |
| F2 | Browser & Inject | EVA navega internet e inyecta páginas en la UI | Playwright, proxy Next.js, screenshots en chat, historial browser | 3 semanas |
| F3 | Server Control | EVA controla el servidor con terminal en tiempo real | ServerManager, TerminalView, monitor recursos, Docker panel, deploy VPS | 2 semanas |
| F4 | Multitask & Autonomía | EVA hace múltiples tareas en paralelo y recuerda | Celery, pgvector, memoria semántica, tareas programadas, App Store, MCP panel | 3 semanas |

### 5.2 Cronograma (11 semanas)

```
        S1    S2    S3    S4    S5    S6    S7    S8    S9   S10   S11
Dev 1   [F1 ──────────] [F2 ──────────] [F3 ──────] [F4 ──────────]
Dev 2   [F1 ──────────] [F2 ──────────] [F3 ──────] [F4 ──────────]
Dev 3   [F1 ──────────] [F2 ──────────] [F3 ──────] [F4 ──────────]
```

**Milestones:**

| Semana | Hito |
|---|---|
| S3 | 🎉 EVA habla y tiene avatar animado |
| S6 | 🌐 EVA navega internet e inyecta páginas |
| S8 | 🖥️ EVA controla el servidor + deploy en VPS |
| S11 | ⚡ EVA multitask + memoria semántica + autonomía |

### 5.3 Equipo y responsabilidades

| Dev | Rol | Responsabilidades principales | Fases |
|---|---|---|---|
| Dev 1 | Frontend Lead | UI/UX completa, Avatar Engine (Rive), Chat streaming, BrowserFrame, TerminalView, Panel de tareas, Panel de memoria, WebSocket client | F1 → F4 |
| Dev 2 | Backend Lead | FastAPI, LangGraph agent, Claude API, Playwright browser, ServerManager, Celery tasks, EVAMemory con pgvector, MCP Registry, Tool suite completa | F1 → F4 |
| Dev 3 | DevOps & Infra | Supabase setup (DB, Auth, Storage, Realtime, pgvector), Docker Compose, VPS Linux, Nginx + SSL, Redis, Celery workers, CI/CD, backups, monitoreo | F1, F3, F4 |

---

## 6. Capacidades y Diferenciadores

### 6.1 Lo que puede hacer EVA-00 (versión final)

| Capacidad | Descripción técnica |
|---|---|
| **Conversar con voz y texto** | Entrada por voz (STT) y texto. Respuesta por voz (TTS con ElevenLabs) y texto con streaming. El avatar sincroniza labios con el audio en tiempo real. |
| **Expresar emociones** | El LLM añade una etiqueta de emoción al final de cada respuesta. El avatar cambia de estado automáticamente. Los gestos corporales se activan según el contexto. |
| **Navegar internet** | Playwright controla Chromium headless. EVA puede ir a una URL, hacer clic, llenar formularios, extraer texto o tablas, y mostrar la página dentro de la UI via proxy Next.js. |
| **Controlar el servidor** | Ejecuta comandos bash con validación de seguridad. Muestra output en tiempo real en TerminalView. Monitorea CPU/RAM/Disco. Gestiona contenedores Docker y servicios systemd. |
| **Multitask paralelo** | Celery ejecuta múltiples tareas simultáneamente. EVA puede navegar + ejecutar un comando + analizar datos al mismo tiempo. Los resultados llegan via Supabase Realtime. |
| **Recordar entre sesiones** | pgvector almacena embeddings de conversaciones y hechos importantes. EVA busca recuerdos relevantes semánticamente antes de responder. Retención configurable. |
| **Tareas programadas** | Celery Beat permite programar tareas automáticas ("cada mañana dame el resumen del clima y noticias tech"). Aparecen como notificaciones al abrir la app. |
| **Usar herramientas MCP** | Protocolo MCP (stdio) permite conectar servidores externos: GitHub, filesystem, Postgres, APIs custom. El usuario configura servidores MCP desde el panel de control. |
| **Instalar módulos** | App Store permite descargar módulos adicionales. Cada módulo instala sus dependencias Python/npm, activa sus skills y registra sus MCPs automáticamente. |

### 6.2 Guardianes de seguridad

Los guardianes son filtros configurables que se ejecutan **antes de cualquier acción de EVA**:

| Tipo | Función | Configuración |
|---|---|---|
| `ContentFilter` | Bloquea temas o palabras configurables | `{"blocked_topics": ["violence", "adult"]}` |
| `CommandFilter` | Whitelist/blacklist de comandos del servidor | `{"blocked_patterns": ["rm -rf"], "require_confirm": ["rm", "kill"]}` |
| `URLFilter` | Modo whitelist o blacklist de dominios | `{"whitelist": ["github.com"], "mode": "whitelist"}` |
| `TimeFilter` | Limita el horario de operación de EVA | `{"start": "09:00", "end": "18:00", "timezone": "America/Mexico_City"}` |
| `RateLimit` | Máximo de peticiones por ventana de tiempo | `{"max_requests": 20, "window_seconds": 60}` |
| `ConfirmationRequired` | Categorías que siempre piden confirmación | `{"categories": ["file_delete", "service_stop"]}` |

---

## 7. Esquema de Base de Datos

### 7.1 Tablas principales (Supabase / PostgreSQL)

| Tabla | Contenido | Notas técnicas |
|---|---|---|
| `profiles` | Perfil del usuario, configuración del avatar | Vinculada a auth.users de Supabase |
| `conversations` | Sesiones de chat con título y timestamps | RLS: solo el dueño puede ver sus conversaciones |
| `messages` | Mensajes individuales (user/assistant/tool) con metadata de tokens | Cascade delete al borrar conversación |
| `eva_memory` | Memoria semántica de EVA con embeddings vectoriales, importancia y timestamp de acceso | pgvector para búsqueda semántica. Función RPC `search_eva_memory` |
| `browser_sessions` | Historial de URLs visitadas por EVA con screenshot y snapshot HTML | Screenshots en Supabase Storage bucket privado |
| `tasks` | Cola de tareas Celery: tipo, estado (pending/running/done/failed), payload y resultado | Realtime notifica al frontend cuando cambia el estado |
| `server_logs` | Log auditado de todos los comandos ejecutados en el servidor | `stdout`, `stderr` y `exit_code` por entrada |
| `eva_config` | Configuración personalizada de EVA: personalidad, voz, idioma, permisos por usuario | Una fila por usuario (UNIQUE constraint) |
| `guardians` | Reglas de seguridad configurables: tipo, config JSON, prioridad, activo/inactivo | Evaluados en orden de prioridad ascendente |
| `user_skills` | Skill tokens activos por usuario con contador de uso y fecha de último uso | Validado por Agent Gateway antes de cada acción |
| `mcp_servers` | Servidores MCP registrados: comando, args, env vars encriptadas, estado de conexión | Env vars almacenadas encriptadas, nunca en texto plano |
| `installed_apps` | Módulos del App Store instalados por usuario con versión y configuración | Linked a `app_registry` para metadatos del módulo |

### 7.2 Extensiones requeridas

```sql
CREATE EXTENSION IF NOT EXISTS vector;    -- pgvector: búsqueda semántica
CREATE EXTENSION IF NOT EXISTS pg_cron;   -- Jobs programados nativos
CREATE EXTENSION IF NOT EXISTS pg_net;    -- HTTP desde Supabase (webhooks)
```

---

## 8. Dirección y Visión del Proyecto

### 8.1 Visión a mediano plazo (post v1.0)

EVA-00 v1.0 establece la base: un agente funcional con avatar, control de servidor, navegación y multitask. Las siguientes iteraciones apuntan a convertir EVA en una **plataforma extensible para asistentes personales de IA** que cualquier persona técnica pueda instalar en su propio servidor.

#### v1.1 — Ecosistema de módulos
Abrir el App Store a desarrolladores externos. Definir un SDK para crear módulos compatibles con EVA. Primer marketplace de módulos: clima, calendario, gestor de archivos, asistente de código, monitor de redes sociales.

#### v1.2 — Multi-agente y colaboración
Permitir múltiples instancias de EVA trabajando en paralelo con roles distintos (EVA-Researcher, EVA-Coder, EVA-Monitor). Un agente orquestador asigna tareas a los sub-agentes especializados. Los usuarios pueden crear y nombrar sus propias instancias.

#### v1.3 — Avatar personalizable y marketplace
Sistema de personalización del avatar: cambiar apariencia, voz, nombre y personalidad. Marketplace de avatares y voces creados por la comunidad. Soporte para avatares 3D con Three.js/VRM además de Rive 2D.

#### v2.0 — EVA como sistema operativo personal
EVA como interfaz principal de trabajo: reemplaza el escritorio para tareas de IA. Integración nativa con VSCode, terminal, navegador y comunicaciones. Modo "autopilot" donde EVA actúa proactivamente sin que el usuario lo solicite, basada en patrones de uso aprendidos.

### 8.2 Principios de diseño del proyecto

- **Modularidad ante todo** — cada componente (avatar, brain, browser, server, skills) es independiente y reemplazable. Se puede actualizar el LLM de Claude a otro sin tocar el frontend.
- **El servidor es del usuario** — EVA se instala en infraestructura propia del usuario. No hay datos en servidores de terceros salvo el LLM API y el TTS. Privacidad por diseño.
- **Extensibilidad via estándares** — MCP es un protocolo abierto. Cualquier herramienta MCP existente funciona con EVA sin modificación.
- **Seguridad configurable** — los guardianes permiten adaptar EVA a cualquier contexto de uso (personal, empresarial, educativo) sin cambiar código.
- **La interfaz humana importa** — el avatar y la voz no son decoración: son la capa de confianza y engagement que hace que el usuario use EVA diariamente en lugar de una CLI o chat genérico.

### 8.3 Métricas de éxito del proyecto

| Métrica | Target v1.0 | Cómo medirlo |
|---|---|---|
| Latencia de respuesta chat | < 800ms primer token | Tiempo desde envío hasta primer token en WebSocket |
| Latencia lip sync | < 100ms desfase | Diferencia entre audio y morph target en canvas |
| Éxito en tareas de browser | > 90% en sitios comunes | Tasks completadas / tasks intentadas en pruebas |
| Éxito en comandos servidor | 100% comandos en whitelist | Comandos ejecutados sin error de validación |
| Uptime del stack | > 99.5% mensual | Monitor de disponibilidad en producción |
| Precisión de memoria semántica | > 85% relevancia | Evaluación manual de recall en conversaciones de prueba |

### 8.4 Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Playwright bloqueado por sitios con anti-bot | Alta | Fingerprinting realista, rotación de User-Agent, Playwright Stealth. Fallback a extracción via requests + BS4. |
| Costo de API de Claude demasiado alto en producción | Media | Rate limiting por usuario, cache de respuestas similares, usar claude-haiku para tareas simples. |
| Comando peligroso ejecutado en servidor | Baja | CommandFilter con blacklist y confirmación obligatoria. Logs de auditoría en Supabase. Alertas inmediatas al usuario. |
| Avatar no carga o tiene glitches en browser | Media | Fallback a avatar estático SVG. WASM de Rive es estable pero puede fallar en browsers viejos — polyfill + detección de capacidades. |
| Latencia alta de TTS rompe lip sync | Media | Buffer de audio con pre-carga. Edge TTS como fallback local. Modo "texto puro" sin voz si latencia > 2s. |

---

## 9. Glosario de Términos Técnicos

| Término | Definición |
|---|---|
| **LangGraph** | Framework sobre LangChain que representa flujos de agentes como grafos de estados con nodos y edges condicionales, permitiendo bucles de razonamiento y ramas paralelas. |
| **Agent Gateway** | Middleware central que intercepta y enruta todas las llamadas a agentes. Aplica guardianes, verifica skill tokens y registra el consumo de recursos. |
| **Skill Token** | Módulo de habilidad que activa un conjunto de tools en EVA. Funciona como sistema de permisos granular — se puede activar/desactivar por usuario. |
| **MCP** | Model Context Protocol — protocolo abierto de Anthropic para conectar LLMs con herramientas externas via stdin/stdout. Permite añadir cualquier servidor MCP sin modificar el código de EVA. |
| **Guardián** | Filtro de seguridad configurable que se evalúa antes de cualquier acción de EVA. Tipos: ContentFilter, CommandFilter, URLFilter, TimeFilter, RateLimit, ConfirmationRequired. |
| **pgvector** | Extensión de PostgreSQL que añade tipos de dato y operadores para vectores de alta dimensión, permitiendo búsqueda por similitud coseno (búsqueda semántica). |
| **LangSmith** | Plataforma de observabilidad para LangGraph — registra trazas de ejecución del agente, tokens usados y latencia de cada nodo. Útil para depuración. |
| **Rive** | Framework de animación interactiva con State Machines que corre en WebAssembly. Permite al avatar cambiar de estado con inputs desde JavaScript. |
| **Playwright** | Biblioteca de Microsoft para automatización de navegadores (Chromium, Firefox, Safari). Permite control headless programático: navegar, clic, extraer DOM, tomar screenshots. |
| **Lip Sync** | Sincronización de los movimientos de la boca del avatar con el audio de voz generado. Se implementa mapeando la energía frecuencial del audio a morph targets del modelo 2D. |
| **Celery** | Sistema de cola de tareas distribuidas para Python. Permite ejecutar funciones en background workers de forma asíncrona y programada. |
| **STT / TTS** | Speech-to-Text (voz a texto) y Text-to-Speech (texto a voz). STT convierte el micrófono del usuario en texto. TTS convierte la respuesta de EVA en audio. |
| **Supabase Realtime** | Sistema de subscripción a cambios en tablas de PostgreSQL via WebSockets. Permite que el frontend reciba notificaciones en tiempo real sin polling. |
| **ElevenLabs** | API de síntesis de voz de alta calidad con clonación de voz. Permite crear una voz personalizada para EVA a partir de muestras de audio. |
| **Row Level Security (RLS)** | Característica de PostgreSQL que restringe qué filas puede ver/modificar cada usuario basándose en políticas SQL. Garantiza aislamiento total entre usuarios en Supabase. |

---

## 10. Links internos del proyecto

- [[🗺️ MAPA MAESTRO - EVA-00]]
- [[📅 Plan de Trabajo General]]
- [[arquitectura/01 - Arquitectura General]]
- [[arquitectura/02 - Frontend (Next.js)]]
- [[arquitectura/03 - Backend (Python)]]
- [[arquitectura/04 - Base de Datos (Supabase)]]
- [[arquitectura/05 - Sistema de Control de Servidor]]
- [[módulos/MOD-01 Avatar Engine]]
- [[módulos/MOD-02 Motor Agéntico LangGraph]]
- [[módulos/MOD-03 Interface de Control]]
- [[fases/FASE 1 - Core & Avatar]]
- [[fases/FASE 2 - Browser Engine & Inject]]
- [[fases/FASE 3 - Control de Servidor]]
- [[fases/FASE 4 - Multitask & Autonomía]]
- [[equipo/Dev 1 - Frontend Lead]]
- [[equipo/Dev 2 - Backend Lead]]
- [[equipo/Dev 3 - DevOps & Infra]]

---

> *Este documento es una ficha técnica viva — se actualiza al final de cada fase con los cambios de arquitectura, decisiones técnicas tomadas y lecciones aprendidas.*
>
> **Proyecto EVA-00 · Equipo de 3 desarrolladores · 2026**
