---
dev: Dev 3
fases:
  - 1
  - 3
  - 4
rol: DevOps & Infra
tipo: equipo
---
# 🛠️ Dev 3 — DevOps & Infra (EVA-00)

> **Rol:** DevOps & Infra Lead  
> **Stack:** Docker, Supabase, Redis, Linux VPS, Nginx, CI/CD

---

## 📋 Responsabilidades

- Setup y mantenimiento de Supabase (DB, Auth, Storage, Realtime)
- Docker Compose y contenedores de producción
- VPS Linux configuración y hardening
- Redis para Celery broker
- Nginx / proxy reverso
- SSL/TLS (Let's Encrypt)
- Variables de entorno y secretos
- Monitoring (Flower para Celery)
- CI/CD básico (GitHub Actions)

---

## 📅 Timeline por Fase

### FASE 1 (Semanas 1-3)
- [ ] Crear proyecto Supabase
- [ ] Crear tablas: `profiles`, `conversations`, `messages`
- [ ] Configurar RLS en todas las tablas
- [ ] Supabase Auth configurada
- [ ] Docker Compose local (frontend + backend + redis)
- [ ] Documentar variables de entorno `.env.example`
- [ ] README de setup completo

### FASE 2 (Semanas 4-6)
- [ ] Tabla `browser_sessions` + RLS
- [ ] Storage bucket `screenshots` (privado)
- [ ] Playwright en contenedor Docker (con dependencias Chromium)
- [ ] Rate limiting en endpoints browser

### FASE 3 (Semanas 7-8)
- [ ] Tabla `server_logs` + RLS
- [ ] Configurar permisos Docker container (privileged o capabilities mínimas)
- [ ] Deploy en VPS Linux real (Hetzner/DigitalOcean)
- [ ] Nginx como proxy reverso
- [ ] SSL con Certbot

### FASE 4 (Semanas 9-11)
- [ ] Celery workers en Docker
- [ ] Redis configurado y persistente
- [ ] pgvector activado en Supabase (extensión)
- [ ] Flower para monitoring de workers
- [ ] GitHub Actions CI/CD básico
- [ ] Backup automatizado de Supabase

---

## 🐳 Docker Setup por Servicio

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

# Playwright necesita estas dependencias del sistema
RUN apt-get update && apt-get install -y \
    wget chromium chromium-driver \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN playwright install chromium

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🔑 Variables de Entorno

```bash
# .env.example

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Redis
REDIS_URL=redis://redis:6379/0

# Next.js (públicas)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=http://localhost:8000

# App
SECRET_KEY=super-secret-key-change-in-production
ENVIRONMENT=development
```

---

## 🌐 Nginx Config

```nginx
server {
    listen 80;
    server_name eva.tudominio.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name eva.tudominio.com;
    
    ssl_certificate /etc/letsencrypt/live/eva.tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eva.tudominio.com/privkey.pem;
    
    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
    }
    
    # WebSocket
    location /ws/ {
        proxy_pass http://localhost:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

---

## 📊 Checklist de Producción

- [ ] SSL activo y renovación automática
- [ ] Backups diarios de Supabase
- [ ] Logs centralizados
- [ ] Alertas de uso de recursos
- [ ] Secrets en variables de entorno (nunca en código)
- [ ] RLS activo en TODAS las tablas
- [ ] Rate limiting activo
- [ ] CORS configurado solo para dominio propio
- [ ] Docker sin imágenes innecesarias (imagen slim)
