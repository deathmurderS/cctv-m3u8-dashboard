#!/bin/bash
set -e

REGISTRY="${DOCKER_REGISTRY:-your-registry}"
TAG="${TAG:-latest}"

echo "Building frontend..."
docker build -t $REGISTRY/cctv-frontend:$TAG ./frontend

echo "Building backend..."
docker build -t $REGISTRY/cctv-backend:$TAG ./backend

echo "Pushing images..."
docker push $REGISTRY/cctv-frontend:$TAG
docker push $REGISTRY/cctv-backend:$TAG

echo "✅ Build complete!"