---
duración: 3 semanas
estado: pendiente
fase: 4
prerequisito: 'Fases 1, 2, 3'
tipo: plan-trabajo
---
# ⚡ FASE 4 — Multitask & Autonomía (EVA-00)

> **Duración estimada:** 3 semanas  
> **Prerequisito:** Fases 1, 2 y 3  
> **Objetivo:** EVA puede hacer múltiples cosas en paralelo y actuar de forma autónoma

---

## ✅ Entregables de Fase 4

### Frontend (Dev 1)
- [ ] Panel de Tareas activas (lista con progreso)
- [ ] Notificaciones cuando una tarea termina
- [ ] Cola visual de tareas pendientes
- [ ] Modo "EVA trabajando" (avatar en estado concentrado)
- [ ] Panel de Memoria (qué recuerda EVA del usuario)
- [ ] Búsqueda en historial de conversaciones

### Backend (Dev 2)
- [ ] Celery + Redis para background tasks
- [ ] Task types: browse_task, server_task, analysis_task, scheduled_task
- [ ] Multi-tab browser (varias páginas en paralelo)
- [ ] Memoria semántica con pgvector (embeddings)
- [ ] Tareas programadas (cron-style) — "EVA, avísame a las 9am"
- [ ] Auto-reporting: EVA puede enviar resúmenes sin que se lo pidan

### Infra (Dev 3)
- [ ] Celery workers escalables
- [ ] Redis para message broker
- [ ] pgvector activado en Supabase
- [ ] Monitoring de workers (Flower)
- [ ] WebSockets con reconnect automático
- [ ] Rate limiting por usuario

---

## 🔀 Arquitectura Multitask

```
Usuario: "EVA, mientras buscas información sobre X, 
         también reinicia el backend y dime el clima de CDMX"

EVA (LLM) descompone en 3 tareas paralelas:
  ├── Task 1: BrowseTask("información sobre X") → Playwright
  ├── Task 2: ServerTask("systemctl restart backend")
  └── Task 3: BrowseTask("clima Ciudad de México") → Weather API

Celery ejecuta las 3 en paralelo con workers diferentes

Resultados llegan via Supabase Realtime al frontend:
  ✅ Task 2 completada: "Backend reiniciado exitosamente"
  ✅ Task 3 completada: "26°C, parcialmente nublado"
  ✅ Task 1 completada: "Aquí está lo que encontré sobre X..."

EVA consolida y responde con todo
```

---

## 🧠 Memoria Semántica

```python
# core/llm/memory.py
from langchain.memory import VectorStoreRetrieverMemory
from supabase import create_client

class EVAMemory:
    def save(self, key: str, value: str, importance: int = 5):
        # Generar embedding del valor
        embedding = self.embed(value)
        
        # Guardar en Supabase eva_memory
        self.db.table('eva_memory').insert({
            'user_id': self.user_id,
            'key': key,
            'value': value,
            'embedding': embedding,
            'importance': importance
        }).execute()
    
    def recall(self, query: str, top_k: int = 5) -> list[str]:
        # Buscar recuerdos similares via pgvector
        query_embedding = self.embed(query)
        results = self.db.rpc('search_eva_memory', {
            'query_embedding': query_embedding,
            'match_count': top_k
        }).execute()
        return [r['value'] for r in results.data]
```

---

## ⏰ Tareas Programadas

```
"EVA, cada mañana a las 8am dame el resumen del clima y noticias tech"
→ Crea una ScheduledTask en Supabase
→ Celery Beat ejecuta a las 8am
→ EVA navega, recopila, genera resumen
→ Aparece como notificación al abrir la app
```

---

## 📋 Tareas Detalladas

### Semana 9 — Celery + Tasks
| Tarea | Dev | Días |
|-------|-----|------|
| Setup Celery + Redis | Dev 3 | 2 |
| Task types base (browse, server) | Dev 2 | 3 |
| Panel de tareas frontend | Dev 1 | 2 |

### Semana 10 — Memoria & Parallelismo
| Tarea | Dev | Días |
|-------|-----|------|
| pgvector + embeddings | Dev 3 | 2 |
| EVAMemory class | Dev 2 | 2 |
| Multi-tab Playwright | Dev 2 | 2 |
| Panel memoria frontend | Dev 1 | 2 |

### Semana 11 — Tareas Programadas & QA
| Tarea | Dev | Días |
|-------|-----|------|
| Celery Beat (scheduled tasks) | Dev 2+3 | 3 |
| Notificaciones Realtime | Dev 1+3 | 2 |
| QA completo del sistema | Todos | 3 |
| Demo y documentación | Todos | 2 |
