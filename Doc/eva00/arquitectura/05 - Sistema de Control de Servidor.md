---
dev:
  - Dev 2
  - Dev 3
fase:
  - 3
  - 4
módulo: server-control
tipo: arquitectura
---
# 🖥️ Control de Servidor — EVA-00

> **Dev responsable:** Dev 3 (Infra) + Dev 2 (Backend)  
> **Capacidad:** EVA tiene control total del servidor donde está instalada

---

## 🏗️ Arquitectura de Control

```
Usuario → EVA (LLM) → Tool: ServerExecTool
                           ↓
                    ServerManager (Python)
                           ↓
                    Validación de Seguridad
                           ↓
                    subprocess / Paramiko
                           ↓
                    Sistema Operativo (Linux VPS)
                           ↓
                    Resultado → WebSocket → Frontend
```

---

## 🔧 Capacidades de Control

### Nivel 1 — Sistema Local
- Ejecutar comandos bash
- Leer/escribir archivos
- Gestionar procesos (ps, kill, start)
- Ver recursos (CPU, RAM, disco, red)
- Gestionar servicios systemd
- Ver logs del sistema

### Nivel 2 — Contenedores Docker
- Listar contenedores (`docker ps`)
- Start/stop/restart contenedores
- Ver logs de contenedores
- Construir imágenes
- Gestionar volúmenes y redes

### Nivel 3 — Servidor Web
- Recargar Nginx/Caddy
- Gestionar certificados SSL (certbot)
- Ver tráfico y conexiones
- Gestionar dominios virtuales

### Nivel 4 — Base de Datos
- Ejecutar queries en Supabase vía API
- Backup y restore
- Ver tablas y estadísticas

---

## 🛡️ Capa de Seguridad

```python
# utils/security.py
COMMAND_PERMISSIONS = {
    "read": ["ls", "cat", "ps", "df", "free", "uptime", "who", "netstat"],
    "write": ["mkdir", "touch", "echo", "cp", "mv"],
    "service": ["systemctl start", "systemctl stop", "systemctl restart"],
    "docker": ["docker ps", "docker logs", "docker restart", "docker stop"],
    "dangerous": ["rm", "chmod 777", "dd", "mkfs", "format"],
    "blocked": ["rm -rf /", "> /dev/sda", ":(){ :|:& };:"]  # Fork bomb etc
}

class CommandValidator:
    def validate(self, command: str, user_level: str) -> bool:
        # Bloquear absolutamente
        for blocked in COMMAND_PERMISSIONS["blocked"]:
            if blocked in command:
                raise PermissionError(f"BLOQUEADO: {blocked}")
        
        # Requiere confirmación explícita del usuario
        for dangerous in COMMAND_PERMISSIONS["dangerous"]:
            if dangerous in command:
                return self._request_confirmation(command)
        
        return True
    
    def _request_confirmation(self, command: str) -> bool:
        # Envia evento al frontend pidiendo confirmación
        # EVA pregunta: "¿Estás seguro de ejecutar: `{command}`?"
        pass
```

---

## 📺 Terminal en Tiempo Real (Frontend)

```typescript
// components/server/TerminalView.tsx
// Muestra output de comandos en tiempo real via WebSocket

const TerminalView = () => {
  const [lines, setLines] = useState<string[]>([]);
  const { ws } = useWebSocket();
  
  useEffect(() => {
    ws.on('server_output', (data) => {
      setLines(prev => [...prev, data.line]);
    });
  }, []);
  
  return (
    <div className="bg-black text-green-400 font-mono p-4 rounded-xl h-64 overflow-y-auto">
      {lines.map((line, i) => (
        <div key={i} className="text-sm">{line}</div>
      ))}
    </div>
  );
};
```

---

## 📊 Monitor de Recursos en Vivo

```python
# core/server/monitor.py
import asyncio
import psutil

async def stream_metrics(websocket):
    """Envía métricas cada 2 segundos al frontend"""
    while True:
        metrics = {
            "type": "server_metrics",
            "cpu": psutil.cpu_percent(interval=1),
            "ram": {
                "used": psutil.virtual_memory().used,
                "total": psutil.virtual_memory().total,
                "percent": psutil.virtual_memory().percent
            },
            "disk": {
                "used": psutil.disk_usage('/').used,
                "total": psutil.disk_usage('/').total,
            },
            "network": {
                "sent": psutil.net_io_counters().bytes_sent,
                "recv": psutil.net_io_counters().bytes_recv
            }
        }
        await websocket.send_json(metrics)
        await asyncio.sleep(2)
```

---

## 🐳 Docker Compose del Proyecto Completo

```yaml
# docker-compose.yml
version: '3.9'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - REDIS_URL=redis://redis:6379
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock  # Para control Docker
    depends_on:
      - redis
    privileged: true  # Para control del sistema

  celery_worker:
    build: ./backend
    command: celery -A core.tasks.scheduler worker --loglevel=info
    depends_on:
      - redis
      - backend

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - certbot_certs:/etc/letsencrypt
```
