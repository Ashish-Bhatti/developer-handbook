# ☸️ Part 2 - Deploying Applications on Kubernetes

In this chapter, we'll deploy our first application on Kubernetes.

You'll learn how to:

- Create a Kubernetes cluster
- Create a Deployment
- Expose the application using a Service
- Configure Ingress
- Install the NGINX Ingress Controller
- Deploy multiple applications

By the end of this chapter, you'll have a fully working Kubernetes application accessible through an Ingress.

---

# 📖 Table of Contents

1. Project Structure
2. Files Required
3. Step 1 - Create a Kubernetes Cluster
4. Step 2 - Create deployment.yml
5. Step 3 - Apply the Deployment
6. Step 4 - Create service.yml
7. Step 5 - Apply the Service
8. Step 6 - Install NGINX Ingress Controller
9. Step 7 - Verify Installation
10. Step 8 - Create ingress.yml
11. Step 9 - Apply Ingress
12. Deploying Multiple Applications
13. Complete Request Flow
14. Summary

---

# Project Structure

Create a separate folder for all Kubernetes configuration files.

```text
project/

├── src/
├── Dockerfile
├── package.json
└── k8s/
    ├── deployment.yml
    ├── service.yml
    └── ingress.yml
```

Keeping all Kubernetes manifests inside a dedicated **k8s** folder makes the project easier to manage.

---

# Files Required

To deploy a basic application, we need three YAML files.

## deployment.yml

Responsible for managing Pods.

It defines:

- Docker Image
- Number of Replicas
- CPU & Memory Limits
- Environment Variables
- Labels
- Container Port

---

## service.yml

Provides a stable network endpoint for Pods.

It:

- Finds Pods using Label Selectors
- Load balances traffic
- Hides changing Pod IP addresses

---

## ingress.yml

Contains HTTP/HTTPS routing rules.

It decides:

- Which domain should be matched
- Which path should be matched
- Which Service should receive the request

> **Important:** Ingress only contains routing rules. It does **not** process traffic itself. An Ingress Controller is required.

---

# Step 1 - Create a Kubernetes Cluster

Before deploying anything, create a Kubernetes cluster.

If you're using Docker Desktop:

1. Open Docker Desktop.
2. Go to **Settings → Kubernetes**.
3. Enable **Kubernetes**.
4. Click **Apply & Restart**.
5. Wait until Kubernetes starts.

Verify the cluster is running:

```bash
kubectl get nodes
```

Expected output:

```text
NAME                     STATUS   ROLES           AGE
docker-desktop           Ready    control-plane
```

---

# Step 2 - Create deployment.yml

Inside the **k8s** folder, create:

```text
deployment.yml
```

If you're using VS Code, you can use the **deployment_simple** snippet to generate the basic Deployment YAML.

This file defines:

- Docker Image
- Replica Count
- Labels
- CPU/Memory Resources
- Container Port

---

# Step 3 - Apply the Deployment

Deploy it using:

```bash
kubectl apply -f deployment.yml
```

Verify:

```bash
kubectl get deployments
```

View running Pods:

```bash
kubectl get pods
```

---

# Step 4 - Create service.yml

Create:

```text
service.yml
```

This Service exposes the Pods through a stable endpoint.

The Service automatically discovers Pods using Label Selectors.

---

# Step 5 - Apply the Service

```bash
kubectl apply -f service.yml
```

Verify:

```bash
kubectl get services
```

---

# Step 6 - Install the NGINX Ingress Controller

Ingress resources don't work until an Ingress Controller is installed.

## PowerShell

```powershell
kubectl apply -f `
https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

---

## Bash

```bash
kubectl apply -f \
https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

---

# Step 7 - Verify Installation

Check whether the controller is running.

```bash
kubectl get pods -n ingress-nginx
```

Example:

```text
ingress-nginx-controller
Running
```

---

# Step 8 - Create ingress.yml

Create:

```text
ingress.yml
```

The Ingress contains routing rules for incoming HTTP requests.

Example:

```text
localhost/

↓

Express Service

localhost/products

↓

Product Service
```

---

# Step 9 - Apply Ingress

```bash
kubectl apply -f ingress.yml
```

Verify:

```bash
kubectl get ingress
```

---

# Deploying Multiple Applications

Suppose we now want to deploy another service.

Example:

- Express API
- Product API

Create another Deployment and Service.

```text
deployment-product.yml

service-product.yml
```

Instead of creating another Ingress, simply add another rule to the existing **ingress.yml**.

Example:

```text
/

↓

Express Service

/products

↓

Product Service
```

One Ingress can route traffic to multiple Services.

---

# Complete Request Flow

```text
Browser

↓

Ingress

↓

NGINX Ingress Controller

↓

Service

↓

Deployment

↓

Pods

↓

Docker Container
```

---

# Summary

In this chapter, you learned how to:

- Create a Kubernetes Cluster
- Organize Kubernetes Files
- Create a Deployment
- Apply a Deployment
- Create a Service
- Apply a Service
- Install the NGINX Ingress Controller
- Configure Ingress
- Deploy Multiple Applications
- Understand the complete request flow

In the next chapter, we'll learn how to:

- Install the Metrics Server
- Monitor CPU & Memory Usage
- Scale Pods Automatically
- Load Test Applications with HEY
- View Logs from Multiple Pods