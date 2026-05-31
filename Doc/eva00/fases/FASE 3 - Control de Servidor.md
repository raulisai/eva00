---
duración: 2 semanas
estado: pendiente
fase: 3
prerequisito: Fase 1
tipo: plan-trabajo
---
# 🖥️ FASE 3 — Control de Servidor (EVA-00)

> **Duración estimada:** 2 semanas  
> **Prerequisito:** Fase 1 completada  
> **Objetivo:** EVA tiene control total del servidor donde está instalada

---

## ✅ Entregables de Fase 3

### Frontend (Dev 1)
- [ ] Panel "Servidor" en sidebar (ícono de servidor)
- [ ] TerminalView en tiempo real (output de comandos)
- [ ] Monitor de recursos (CPU, RAM, Disco — gráficas en vivo)
- [ ] Lista de procesos activos
- [ ] Confirmación visual para comandos peligrosos
- [ ] Panel Docker (contenedores, logs)

### Backend (Dev 2)
- [ ] ServerManager con subprocess + validación
- [ ] Endpoint `/server/exec` (ejecutar comandos)
- [ ] Endpoint `/server/status` (métricas del sistema)
- [ ] Endpoint `/server/processes` (lista de procesos)
- [ ] Tool de servidor para agente LangChain
- [ ] Stream de output en tiempo real via WebSocket
- [ ] Lista blanca/negra de comandos

### Infra (Dev 3)
- [ ] Tabla `server_logs` en Supabase
- [ ] Configurar permisos correctos del contenedor (privileged/capabilities)
- [ ] SSH client (Paramiko) para servidores remotos opcionales
- [ ] Alertas automáticas si CPU/RAM > 90%

---

## 🗣️ Comandos de Lenguaje Natural

```
"EVA, ¿cuánta RAM está usando el servidor?"
→ ServerStatusTool → psutil → respuesta formateada

"EVA, reinicia el servidor de Nginx"
→ ServerExecTool → "systemctl restart nginx" → output en terminal

"EVA, muéstrame los logs de error de hoy"
→ ServerExecTool → "journalctl -p err --since today" → stream output

"EVA, ¿qué procesos están usando más CPU?"
→ ServerStatusTool → ps aux sort → tabla formateada

"EVA, lista los contenedores Docker activos"
→ ServerExecTool → "docker ps" → tabla en chat

"EVA, detén el contenedor de staging"
→ [EVA pide confirmación] → "docker stop staging_container"
```

---

## ⚠️ Sistema de Confirmaciones

```
Comandos VERDES (ejecutar sin preguntar):
  ls, cat, ps, df, free, uptime, docker ps, docker logs

Comandos AMARILLOS (preguntar antes):
  rm, mv, docker stop, systemctl stop, kill

Comandos ROJOS (bloquear siempre):
  rm -rf /, mkfs, dd if=/dev/zero, :(){ :|:& };:
```

---

## 📊 Dashboard de Servidor

```
┌─────────────────────────────────────────┐
│  🖥️ Estado del Servidor                 │
│                                         │
│  CPU  ████████░░  78%                   │
│  RAM  █████░░░░░  52% (4.2/8 GB)       │
│  Disk ███░░░░░░░  34% (68/200 GB)      │
│  Net  ↑ 1.2 MB/s  ↓ 4.5 MB/s          │
│                                         │
│  Procesos: 142    Uptime: 12d 4h       │
├─────────────────────────────────────────┤
│  Terminal                               │
│  $ systemctl status nginx               │
│  ● nginx.service - A high performance.. │
│     Active: active (running)            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📋 Tareas Detalladas

### Semana 7
| Tarea | Dev | Días |
|-------|-----|------|
| ServerManager + validación | Dev 2 | 3 |
| Tool de servidor LangChain | Dev 2 | 2 |
| TerminalView WebSocket | Dev 1 | 2 |
| Monitor recursos frontend | Dev 1 | 2 |

### Semana 8
| Tarea | Dev | Días |
|-------|-----|------|
| Permisos Docker container | Dev 3 | 2 |
| Logs en Supabase | Dev 3 | 1 |
| Panel Docker en UI | Dev 1 | 2 |
| Alertas automáticas | Dev 3 | 1 |
| QA + pruebas de seguridad | Todos | 2 |
