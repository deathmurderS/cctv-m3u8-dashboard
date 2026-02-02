# 🎥 CCTV M3U8 Dashboard

Real-time CCTV monitoring dashboard with HLS (M3U8) streaming support, built with React, Node.js, and designed for production deployment.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)
![Kubernetes](https://img.shields.io/badge/kubernetes-ready-blue.svg)

## ✨ Features

- 🎬 **HLS (M3U8) Video Streaming** - Real-time CCTV stream playback
- 📊 **Real-time Monitoring** - Live uptime/downtime tracking with statistics
- 🔐 **Role-Based Access Control** - Admin, Operator, and Viewer roles
- 📱 **Responsive Design** - Mobile-friendly interface
- 🕐 **WIB Timezone Support** - Indonesian time (Asia/Jakarta)
- 📈 **Analytics Dashboard** - Interactive charts (Pie, Bar, Line)
- 🐳 **Docker Ready** - Containerized for easy deployment
- ☸️ **Kubernetes Ready** - Production-grade orchestration
- 🔄 **Auto-Reload** - Stream reload on error (for authorized users)
- 🎨 **Modern UI** - Dark theme with Tailwind CSS

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Deployment Options](#deployment-options)
  - [Option 1: Local Development with Docker Compose](#option-1-local-development-with-docker-compose)
  - [Option 2: Production Deployment with Kubernetes](#option-2-production-deployment-with-kubernetes)
- [Configuration](#configuration)
- [Default Accounts](#default-accounts)
- [Features by Role](#features-by-role)
- [Adding New CCTV Streams](#adding-new-cctv-streams)
- [Troubleshooting](#troubleshooting)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## 🔧 Prerequisites

### For Local Deployment:
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### For Kubernetes Deployment:
- [kubectl](https://kubernetes.io/docs/tasks/tools/) (v1.25+)
- Kubernetes cluster (Minikube, GKE, EKS, or AKS)
- [Docker](https://docs.docker.com/get-docker/) (for building images)
- Container registry (Docker Hub, GCR, ECR, or ACR)

---

## 📁 Project Structure
```
cctv-m3u8-dashboard/
├── frontend/                 # React + Vite dashboard
│   ├── src/
│   │   ├── App.jsx          # Main application
│   │   ├── main.jsx         # Entry point
│   │   └── styles/          # CSS styles
│   ├── Dockerfile
│   ├── nginx.conf           # Nginx configuration
│   └── package.json
│
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── server.js        # Express server
│   │   ├── config/
│   │   │   └── users.js     # User & role configuration
│   │   ├── routes/
│   │   │   ├── auth.js      # Authentication routes
│   │   │   └── streams.js   # Stream management routes
│   │   ├── services/
│   │   │   └── streamService.js  # Stream tracking logic
│   │   └── middleware/
│   │       └── auth.js      # JWT authentication
│   ├── Dockerfile
│   └── package.json
│
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap/
│   ├── frontend/
│   ├── backend/
│   └── ingress/
│
├── scripts/                  # Deployment scripts
│   ├── build-images.sh
│   └── deploy.sh
│
├── docker-compose.yml        # Local development
├── .gitignore
└── README.md
```

---

## 🚀 Deployment Options

Choose your deployment method:

### **Option 1: Local Development with Docker Compose** 
*(Recommended for testing and development)*

### **Option 2: Production Deployment with Kubernetes**
*(Recommended for production)*

---

## 🐳 Option 1: Local Development with Docker Compose

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/cctv-m3u8-dashboard.git
cd cctv-m3u8-dashboard
```

### Step 2: Configure CCTV Streams (Optional)

Edit `backend/src/services/streamService.js` to add your CCTV streams:
```javascript
let streams = [
  {
    id: 'cctv1',
    name: 'Your CCTV Name',
    url: 'https://your-stream-url.com/stream.m3u8',
    location: 'Location Name',
    status: 'active',
    // ... other fields
  }
];
```

### Step 3: Start Services
```bash
docker-compose up --build
```

### Step 4: Access Dashboard

Open your browser:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/health

### Step 5: Login

Use default accounts (see [Default Accounts](#default-accounts) section)

### Step 6: Stop Services
```bash
# Press Ctrl+C, then:
docker-compose down
```

---

## ☸️ Option 2: Production Deployment with Kubernetes

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/cctv-m3u8-dashboard.git
cd cctv-m3u8-dashboard
```

### Step 2: Configure Environment

Edit `k8s/configmap/streams-config.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: streams-config
  namespace: cctv-system
data:
  STREAM_URL_1: "https://your-stream-1.m3u8"
  STREAM_URL_2: "https://your-stream-2.m3u8"
```

### Step 3: Build and Push Docker Images
```bash
# Set your Docker registry
export DOCKER_REGISTRY=your-dockerhub-username

# Make scripts executable
chmod +x scripts/*.sh

# Build and push images
./scripts/build-images.sh
```

This will build and push:
- `your-registry/cctv-frontend:latest`
- `your-registry/cctv-backend:latest`

### Step 4: Update Kubernetes Manifests

Edit image references in:
- `k8s/frontend/deployment.yaml`
- `k8s/backend/deployment.yaml`

Change `image:` to your registry:
```yaml
image: your-dockerhub-username/cctv-frontend:latest
```

### Step 5: Deploy to Kubernetes
```bash
# Deploy all resources
./scripts/deploy.sh

# Or manually:
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress/
```

### Step 6: Verify Deployment
```bash
# Check pods status
kubectl get pods -n cctv-system

# Check services
kubectl get svc -n cctv-system

# Check logs
kubectl logs -f deployment/cctv-frontend -n cctv-system
kubectl logs -f deployment/cctv-backend -n cctv-system
```

### Step 7: Access Dashboard

#### Option A: Port Forward (Testing)
```bash
kubectl port-forward -n cctv-system svc/cctv-frontend 3001:80
```
Access: http://localhost:3001

#### Option B: Ingress (Production)

Update `k8s/ingress/ingress.yaml` with your domain:
```yaml
spec:
  rules:
  - host: cctv.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: cctv-frontend
            port:
              number: 80
```

Access: https://cctv.yourdomain.com

### Step 8: Update Deployment
```bash
# Rebuild images with new tag
export TAG=v1.1.0
./scripts/build-images.sh

# Update deployment
kubectl set image deployment/cctv-frontend \
  frontend=your-registry/cctv-frontend:$TAG \
  -n cctv-system

kubectl set image deployment/cctv-backend \
  backend=your-registry/cctv-backend:$TAG \
  -n cctv-system
```

### Step 9: Scale Deployment
```bash
# Scale frontend
kubectl scale deployment cctv-frontend --replicas=3 -n cctv-system

# Scale backend
kubectl scale deployment cctv-backend --replicas=2 -n cctv-system
```

### Step 10: Cleanup
```bash
# Delete all resources
kubectl delete namespace cctv-system
```

---

## ⚙️ Configuration

### Environment Variables

**Backend** (`docker-compose.yml` or ConfigMap):
```yaml
PORT: 3000
JWT_SECRET: your-secret-key-here
STREAM_URL_1: https://stream1.m3u8
STREAM_URL_2: https://stream2.m3u8
```

### User Management

Edit `backend/src/config/users.js` to add/modify users:
```javascript
const USERS = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator'
  },
  {
    username: 'newuser',
    password: 'password123',
    role: 'viewer',
    name: 'New User'
  }
];
```

**Rebuild after changes:**
```bash
docker-compose up --build
# or for K8s:
./scripts/build-images.sh && kubectl rollout restart deployment -n cctv-system
```

---

## 👥 Default Accounts

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| `admin` | `admin123` | Administrator | Full access (View, Reload, Analytics, Edit) |
| `operator` | `operator123` | Operator | View + Reload + Analytics |
| `zaky` | `zaky2024` | Viewer | View only |
| `korlantas` | `korlantas@2024` | Viewer | View only |

**⚠️ Important:** Change default passwords in production!

---

## 🎭 Features by Role

### 👑 Administrator
- ✅ View all CCTV streams
- ✅ Reload streams on error
- ✅ View analytics dashboard
- ✅ Access statistics (uptime/downtime)
- ✅ Edit stream configuration
- ✅ Manage users

### 🔧 Operator
- ✅ View all CCTV streams
- ✅ Reload streams on error
- ✅ View analytics dashboard
- ✅ Access statistics
- ❌ Edit configuration
- ❌ Manage users

### 👁️ Viewer
- ✅ View all CCTV streams
- ❌ Reload streams
- ❌ View analytics
- ❌ Access statistics
- ❌ Edit configuration
- ❌ Manage users

---

## 📹 Adding New CCTV Streams

### Method 1: Edit Source Code

Edit `backend/src/services/streamService.js`:
```javascript
let streams = [
  // Existing streams...
  {
    id: 'cctv_new',
    name: 'New CCTV Camera',
    url: 'https://your-stream.com/camera.m3u8',
    location: 'Location Name',
    status: 'active',
    region: 'METRO',
    code: '123',
    startTime: new Date().toISOString(),
    lastOnline: new Date().toISOString(),
    lastOffline: null,
    totalUptime: 0,
    totalDowntime: 0,
    uptimeHistory: [],
    downtimeHistory: [],
    currentStatus: 'online',
    errorCount: 0,
    lastError: null
  }
];
```

Rebuild and restart:
```bash
# Docker Compose
docker-compose down
docker-compose up --build

# Kubernetes
./scripts/build-images.sh
kubectl rollout restart deployment -n cctv-system
```

### Method 2: Environment Variables (Kubernetes)

Update `k8s/configmap/streams-config.yaml`:
```yaml
data:
  STREAM_URL_3: "https://new-stream.m3u8"
```

Apply changes:
```bash
kubectl apply -f k8s/configmap/streams-config.yaml
kubectl rollout restart deployment/cctv-backend -n cctv-system
```

---

## 🐛 Troubleshooting

### Issue: Docker build fails

**Solution:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
docker-compose up
```

### Issue: Stream not loading

**Causes:**
1. Invalid M3U8 URL
2. CORS restrictions
3. Network firewall

**Solution:**
```bash
# Test stream URL
curl -I https://your-stream-url.m3u8

# Check backend logs
docker-compose logs backend

# For K8s:
kubectl logs -f deployment/cctv-backend -n cctv-system
```

### Issue: Login fails

**Solution:**
```bash
# Check backend is running
curl http://localhost:3000/health

# Check credentials in backend/src/config/users.js
# Verify you're using correct username/password
```

### Issue: Kubernetes pods not starting

**Solution:**
```bash
# Check pod status
kubectl describe pod <pod-name> -n cctv-system

# Check logs
kubectl logs <pod-name> -n cctv-system

# Common fixes:
# 1. Check image pull policy
# 2. Verify image exists in registry
# 3. Check resource limits
```

### Issue: Port already in use

**Solution:**
```bash
# Find process using port
sudo lsof -i :3001
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Or change ports in docker-compose.yml
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **HLS.js** - HLS video streaming
- **Recharts** - Data visualization
- **Nginx** - Web server

### Backend
- **Node.js 20** - Runtime
- **Express** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **Nginx** - Reverse proxy

---

## 📊 Monitoring & Analytics

The dashboard provides real-time monitoring:

- **Current Session Timer** - Live duration counter
- **Uptime Percentage** - Total online time percentage
- **Downtime Percentage** - Total offline time percentage
- **Average Uptime** - Mean time between failures
- **Average Downtime** - Mean time to recovery
- **Error Count** - Total error occurrences
- **Interactive Charts** - Pie, Bar, and Line charts

---

## 🌐 Exposing to Internet

### Option 1: Ngrok (Quick Testing)
```bash
# Install ngrok
# Linux:
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/

# Setup authtoken (from ngrok.com)
ngrok config add-authtoken YOUR_TOKEN

# Expose port
ngrok http 3001
```

### Option 2: Nginx Reverse Proxy (Production)

See nginx configuration in `frontend/nginx.conf`

### Option 3: Kubernetes Ingress (Production)

Already configured in `k8s/ingress/ingress.yaml`

---

## 🔒 Security Recommendations

### For Production:

1. **Change default passwords** in `backend/src/config/users.js`
2. **Use HTTPS** with valid SSL certificates
3. **Set strong JWT_SECRET** environment variable
4. **Enable firewall** rules
5. **Regular security updates**
6. **Use secrets management** (Kubernetes Secrets, AWS Secrets Manager)
7. **Implement rate limiting**
8. **Enable audit logging**

Example Kubernetes Secret:
```bash
kubectl create secret generic cctv-secrets \
  --from-literal=jwt-secret=your-super-secret-key \
  -n cctv-system
```

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📧 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/deathmurderS/cctv-m3u8-dashboard/issues)
- Email: zakychen558@gmail.com

---

## 🙏 Acknowledgments

- HLS.js for video streaming
- Recharts for data visualization
- Tailwind CSS for styling
- React community

---

**Built with ❤️ for CCTV monitoring**
