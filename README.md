# CCTV M3U8 Dashboard

Real-time CCTV monitoring dashboard with HLS (M3U8) streaming support.

## Features
- Real-time HLS video streaming
- Responsive grid/list view
- Kubernetes-ready deployment
- Production-grade architecture

## Quick Start

### Local Development
```bash
docker-compose up
```

### Kubernetes Deployment
```bash
./scripts/build-images.sh
./scripts/deploy.sh
```

## Architecture
- Frontend: React + Vite + HLS.js + Tailwind
- Backend: Node.js + Express
- Container: Docker
- Orchestration: Kubernetes