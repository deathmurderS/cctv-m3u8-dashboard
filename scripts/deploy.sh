#!/bin/bash
set -e

echo "Deploying CCTV Dashboard to Kubernetes..."

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress/

echo "✅ Deployment complete!"
echo "Check status: kubectl get pods -n cctv-system"