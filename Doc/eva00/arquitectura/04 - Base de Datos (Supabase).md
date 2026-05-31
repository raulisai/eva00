---
dev: Dev 3
fase:
  - 1
  - 2
  - 3
  - 4
módulo: database
tipo: arquitectura
---
# 🗄️ Base de Datos — Supabase (EVA-00)

> **Dev responsable:** Dev 3 — DevOps & Infra  
> **Stack:** Supabase (PostgreSQL), Supabase Auth, Supabase Realtime, Supabase Storage

---

## 📊 Esquema de Tablas

```sql
-- ========================
-- USUARIOS Y SESIONES
-- ========================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users,
    username TEXT,
    avatar_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- CONVERSACIONES
-- ========================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',  -- { tokens, model, action_type }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- MEMORIA LARGA DE EVA
-- ========================
CREATE TABLE eva_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    key TEXT NOT NULL,            -- nombre del recuerdo
    value TEXT NOT NULL,          -- contenido
    embedding VECTOR(1536),       -- para búsqueda semántica (pgvector)
    source TEXT,                  -- 'conversation', 'user_input', 'auto'
    importance INTEGER DEFAULT 5, -- 1-10
    last_accessed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- HISTORIAL DE BROWSER
-- ========================
CREATE TABLE browser_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    url TEXT NOT NULL,
    title TEXT,
    screenshot_url TEXT,          -- Supabase Storage
    html_snapshot TEXT,
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- TAREAS EN BACKGROUND
-- ========================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    type TEXT,                    -- 'browse', 'server_exec', 'analysis'
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','running','done','failed')),
    payload JSONB DEFAULT '{}',
    result JSONB DEFAULT '{}',
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ========================
-- LOGS DE SERVIDOR
-- ========================
CREATE TABLE server_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    command TEXT NOT NULL,
    stdout TEXT,
    stderr TEXT,
    exit_code INTEGER,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================
-- CONFIGURACIÓN DE EVA
-- ========================
CREATE TABLE eva_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) UNIQUE,
    personality JSONB DEFAULT '{}',   -- tono, idioma, nombre
    voice_config JSONB DEFAULT '{}',  -- voz ElevenLabs, velocidad
    permissions JSONB DEFAULT '{}',   -- qué puede hacer EVA
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔄 Supabase Realtime (Eventos en Vivo)

```typescript
// frontend — escucha eventos de tareas
const channel = supabase
  .channel('task-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'tasks',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Notificar al avatar cuando una tarea termina
    avatarStore.setEmotion('happy');
    chatStore.addSystemMessage(`✅ Tarea completada: ${payload.new.type}`);
  })
  .subscribe();
```

---

## 🔒 Row Level Security (RLS)

```sql
-- Cada usuario solo ve sus propios datos
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_messages" ON messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_tasks" ON tasks
  FOR ALL USING (user_id = auth.uid());

ALTER TABLE server_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_logs" ON server_logs
  FOR ALL USING (user_id = auth.uid());
```

---

## 📦 Extensiones Supabase

```sql
CREATE EXTENSION IF NOT EXISTS vector;      -- pgvector para memoria semántica
CREATE EXTENSION IF NOT EXISTS pg_cron;     -- Jobs programados
CREATE EXTENSION IF NOT EXISTS pg_net;      -- HTTP desde Supabase (webhooks)
```

---

## 🔍 Búsqueda Semántica en Memoria

```sql
-- Función para buscar recuerdos similares
CREATE OR REPLACE FUNCTION search_eva_memory(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (id UUID, key TEXT, value TEXT, similarity FLOAT)
LANGUAGE sql STABLE AS $$
  SELECT id, key, value,
    1 - (embedding <=> query_embedding) AS similarity
  FROM eva_memory
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
```

---

## 📁 Supabase Storage Buckets

| Bucket | Contenido | Acceso |
|--------|-----------|--------|
| `screenshots` | Capturas de browser | Privado por usuario |
| `avatar-assets` | Archivos Live2D/Rive | Público |
| `exports` | Exportaciones de usuario | Privado |
