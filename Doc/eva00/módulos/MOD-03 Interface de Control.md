---
dev:
  - Dev 1
  - Dev 2
fase:
  - 2
  - 3
  - 4
módulo: control-interface
tipo: arquitectura
---
# 🛡️ Interface de Control — Guardianes, Tokens, MCP y Apps (EVA-00)

> Panel de administración donde el usuario configura cómo funciona EVA  
> Ruta: `/control` en el frontend Next.js  
> Dev responsable: Dev 1 (UI) + Dev 2 (backend config API)

---

## 🗂️ Secciones del Panel

```
/control
├── /guardians       ← Reglas de seguridad y filtros
├── /skills          ← Token skills (qué puede hacer EVA)
├── /mcp             ← Servidores MCP conectados
├── /preferences     ← Personalidad, voz, idioma
└── /apps            ← Descargar módulos/apps de IA
```

---

## 🛡️ Guardianes (Guardians)

Los guardianes son **filtros que se ejecutan ANTES** de que EVA realice cualquier acción.

### Tipos de Guardianes:

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `ContentFilter` | Filtra temas prohibidos | Bloquear contenido adulto |
| `CommandFilter` | Filtra comandos del servidor | Bloquear `rm -rf` |
| `URLFilter` | Filtra URLs permitidas | Solo dominios en whitelist |
| `TimeFilter` | Limita horarios de uso | Solo 9am-6pm |
| `RateLimit` | Limita peticiones por minuto | Max 20 req/min |
| `ConfirmationRequired` | Pide confirmación explícita | Para borrar archivos |

### Schema en Supabase:
```sql
CREATE TABLE guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    type TEXT NOT NULL,           -- 'content', 'command', 'url', 'time', 'rate'
    name TEXT NOT NULL,
    config JSONB NOT NULL,        -- configuración específica del guardián
    priority INTEGER DEFAULT 10,  -- orden de evaluación (menor = primero)
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ejemplo de config:
-- ContentFilter: {"blocked_topics": ["violence", "adult"]}
-- CommandFilter: {"blocked_patterns": ["rm -rf", "mkfs"], "require_confirm": ["rm", "kill"]}
-- URLFilter:     {"whitelist": ["github.com", "google.com"], "mode": "whitelist"}
-- TimeFilter:    {"start": "09:00", "end": "18:00", "timezone": "America/Mexico_City"}
-- RateLimit:     {"max_requests": 20, "window_seconds": 60}
```

### UI del guardián:
```typescript
// Panel de guardianes — lista con toggle + config inline
const GuardianCard = ({ guardian }: { guardian: Guardian }) => (
  <div className="card">
    <div className="flex justify-between items-center">
      <div>
        <h3>{guardian.name}</h3>
        <p className="text-muted">{GUARDIAN_DESCRIPTIONS[guardian.type]}</p>
      </div>
      <Toggle checked={guardian.active} onChange={toggleGuardian} />
    </div>
    <GuardianConfigEditor type={guardian.type} config={guardian.config} />
  </div>
);
```

---

## 🎯 Token Skills (Habilidades)

Las skills determinan **qué puede hacer EVA**. Cada skill habilita un conjunto de tools.

### UI — Panel de Skills:
```
┌──────────────────────────────────────────────────────┐
│  🌐 Navegación Web                     [●  Activo]   │
│  Permite a EVA navegar y extraer info de internet    │
│  Herramientas: navigate, click, extract, screenshot  │
│  Uso este mes: 142 llamadas                          │
├──────────────────────────────────────────────────────┤
│  🖥️ Control de Servidor                [●  Activo]   │
│  Permite ejecutar comandos en el servidor            │
│  Herramientas: exec, status, processes, ssh          │
│  Uso este mes: 38 llamadas                           │
├──────────────────────────────────────────────────────┤
│  🧠 Memoria Larga                      [●  Activo]   │
│  EVA recuerda contexto entre conversaciones          │
│  Herramientas: remember, recall, forget              │
│  Uso este mes: 901 llamadas                          │
├──────────────────────────────────────────────────────┤
│  📅 Tareas Programadas                 [○  Inactivo] │
│  EVA puede ejecutar tareas en horarios específicos   │
│  [  Activar  ]                                       │
└──────────────────────────────────────────────────────┘
```

### Schema en Supabase:
```sql
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    skill_id TEXT NOT NULL,          -- "web-browsing", "server-control"
    active BOOLEAN DEFAULT false,
    config JSONB DEFAULT '{}',
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMPTZ,
    installed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 MCP Servers (Protocolo Model Context Protocol)

El panel MCP permite **conectar servidores externos** que añaden tools a EVA.

### UI — Panel MCP:
```
┌──────────────────────────────────────────────────────┐
│  MCP Servers conectados                [+ Añadir]    │
├──────────────────────────────────────────────────────┤
│  📁 filesystem                         [● Activo]    │
│  npx @modelcontextprotocol/server-filesystem         │
│  Tools: read_file, write_file, list_dir (3 tools)    │
│  [Configurar]  [Desconectar]                         │
├──────────────────────────────────────────────────────┤
│  🐙 GitHub                             [● Activo]    │
│  npx @modelcontextprotocol/server-github             │
│  Tools: create_issue, list_repos, get_pr (12 tools)  │
│  [Configurar]  [Desconectar]                         │
└──────────────────────────────────────────────────────┘

[ + Añadir servidor MCP ]
  Comando: [npx @modelcontextprotocol/server-______ ]
  Nombre:  [mi-servidor                             ]
  [ Conectar ]
```

### Schema en Supabase:
```sql
CREATE TABLE mcp_servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    name TEXT NOT NULL,
    command TEXT NOT NULL,         -- "npx @mcp/server-github"
    args JSONB DEFAULT '[]',
    env_vars JSONB DEFAULT '{}',   -- Variables de entorno (encriptadas)
    active BOOLEAN DEFAULT false,
    tools_count INTEGER DEFAULT 0,
    last_ping TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚙️ Preferencias de EVA

```
┌──────────────────────────────────────────────────────┐
│  Personalidad de EVA                                 │
│                                                      │
│  Nombre:     [EVA-00          ]                      │
│  Idioma:     [● Español  ○ Inglés  ○ Auto]           │
│  Tono:       [○ Formal  ● Amigable  ○ Casual]        │
│  Proactividad: ────────●─────── (7/10)               │
│                                                      │
│  Voz                                                 │
│  TTS Engine: [● ElevenLabs  ○ Edge TTS  ○ Local]    │
│  Voice ID:   [Mia - Latina, warm    ▾]               │
│  Velocidad:  ──────●──────── (1.0x)                  │
│  [Preview voz]                                       │
│                                                      │
│  Memoria                                             │
│  Retención: [● 30 días  ○ 90 días  ○ Siempre]       │
│  Auto-recordar cosas importantes: [●]                │
│                                                      │
│  [  Guardar cambios  ]                               │
└──────────────────────────────────────────────────────┘
```

---

## 📦 App Store — Descargar Módulos de IA

EVA puede **descargar módulos adicionales** que extienden sus capacidades.

### UI — Store:
```
┌──────────────────────────────────────────────────────┐
│  📦 Módulos disponibles          [Mis módulos]        │
├──────────────────────────────────────────────────────┤
│  🎨 Image Generator              [Instalar]          │
│  Genera imágenes con Stable Diffusion                │
│  Requiere: GPU / Replicate API                       │
│                                                      │
│  📊 Data Analyst                 [Instalar]          │
│  Analiza CSVs, crea gráficas, detecta patrones       │
│  Requiere: pandas, matplotlib                        │
│                                                      │
│  🔐 Password Manager             [✓ Instalado]       │
│  Gestiona credenciales con Bitwarden API             │
│                                                      │
│  📧 Email Assistant              [Instalar]          │
│  Lee y redacta emails con Gmail/Outlook              │
└──────────────────────────────────────────────────────┘
```

### Schema en Supabase:
```sql
CREATE TABLE installed_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    app_id TEXT NOT NULL,             -- "image-generator", "data-analyst"
    version TEXT,
    config JSONB DEFAULT '{}',
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    active BOOLEAN DEFAULT true
);

CREATE TABLE app_registry (
    id TEXT PRIMARY KEY,              -- "image-generator"
    name TEXT,
    description TEXT,
    version TEXT,
    requirements JSONB,               -- dependencias Python/npm
    skills_provided JSONB,            -- qué skills añade
    mcp_server TEXT,                  -- MCP server que instala (si aplica)
    install_script TEXT,              -- script de instalación
    published_by TEXT,
    downloads INTEGER DEFAULT 0
);
```

### Backend — Instalador de Apps:
```python
# core/apps/installer.py
class AppInstaller:
    async def install(self, app_id: str, user_id: str):
        app = await get_app_registry(app_id)
        
        # 1. Instalar dependencias
        if app.requirements.get("pip"):
            subprocess.run(["pip", "install"] + app.requirements["pip"])
        
        # 2. Registrar MCP server si aplica
        if app.mcp_server:
            await mcp_registry.register(
                name=app_id,
                command=app.mcp_server["command"],
                args=app.mcp_server["args"]
            )
        
        # 3. Activar skills que provee
        for skill in app.skills_provided:
            await activate_skill(user_id, skill)
        
        # 4. Guardar en DB
        await save_installed_app(user_id, app_id)
        
        return {"status": "installed", "skills_added": app.skills_provided}
```
