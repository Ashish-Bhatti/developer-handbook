# ☸️ Part 4 - Commands, Troubleshooting & Best Practices

In this final chapter, we'll cover the most commonly used Kubernetes commands, learn how to troubleshoot issues, follow best practices, and review frequently asked interview questions.

By the end of this chapter, you'll be able to confidently debug Kubernetes applications and understand the complete deployment workflow.

---

# 📖 Table of Contents

1. Common kubectl Commands
2. Troubleshooting
3. Kubernetes Best Practices
4. Kubernetes Interview Questions
5. Kubernetes Cheat Sheet
6. Complete Kubernetes Workflow
7. Summary

---

# Common kubectl Commands

## Cluster Information

Check cluster information:

```bash
kubectl cluster-info
```

View all nodes:

```bash
kubectl get nodes
```

Describe a node:

```bash
kubectl describe node <node-name>
```

---

## Pods

View Pods:

```bash
kubectl get pods
```

Watch Pods in real time:

```bash
kubectl get pods -w
```

Show Pod labels:

```bash
kubectl get pods --show-labels
```

Describe a Pod:

```bash
kubectl describe pod <pod-name>
```

Delete a Pod:

```bash
kubectl delete pod <pod-name>
```

Delete Pods using labels:

```bash
kubectl delete pod -l app=express
```

---

## Deployments

View Deployments:

```bash
kubectl get deployments
```

Describe a Deployment:

```bash
kubectl describe deployment express-deployment
```

Delete a Deployment:

```bash
kubectl delete deployment express-deployment
```

Restart a Deployment:

```bash
kubectl rollout restart deployment express-deployment
```

Check rollout status:

```bash
kubectl rollout status deployment express-deployment
```

---

## Services

View Services:

```bash
kubectl get svc
```

Describe a Service:

```bash
kubectl describe svc express-service
```

---

## Ingress

View Ingress:

```bash
kubectl get ingress
```

Describe Ingress:

```bash
kubectl describe ingress express-ingress
```

---

## Apply & Delete YAML

Apply a manifest:

```bash
kubectl apply -f deployment.yml
```

Delete resources:

```bash
kubectl delete -f deployment.yml
```

Apply an entire directory:

```bash
kubectl apply -f k8s/
```

---

## Logs

View logs:

```bash
kubectl logs <pod-name>
```

Follow logs:

```bash
kubectl logs -f <pod-name>
```

View Deployment logs:

```bash
kubectl logs deployment/express-deployment -f
```

View logs using labels:

```bash
kubectl logs -f -l app=express
```

---

## Resource Usage

View Node usage:

```bash
kubectl top nodes
```

View Pod usage:

```bash
kubectl top pods
```

---

## Everything

View all resources:

```bash
kubectl get all
```

---

# Troubleshooting

## Pods are stuck in Pending

Possible reasons:

- Cluster has insufficient resources
- Image cannot be pulled
- Incorrect resource requests
- Node is unavailable

Useful commands:

```bash
kubectl describe pod <pod-name>
```

---

## ImagePullBackOff

Reason:

Kubernetes cannot download the Docker image.

Check:

- Image name
- Image tag
- Registry authentication
- Image exists

---

## CrashLoopBackOff

Reason:

The application starts but immediately crashes.

Debug:

```bash
kubectl logs <pod-name>
```

---

## Service Not Working

Check:

```bash
kubectl get svc
```

Verify:

- Labels
- Selectors
- Target Port
- Container Port

---

## Ingress Not Working

Verify:

```bash
kubectl get ingress
```

Check:

```bash
kubectl get pods -n ingress-nginx
```

If the Ingress Controller isn't running, Ingress rules won't work.

---

## kubectl top not working

Reason:

Metrics Server is missing or not running.

Verify:

```bash
kubectl top pods
```

If it fails, install or restart the Metrics Server.

---

# Kubernetes Best Practices

## Use Labels

Always label your resources.

Example:

```yaml
labels:
  app: express
```

---

## Keep YAML Files Organized

Example:

```text
k8s/

deployment.yml

service.yml

ingress.yml

hpa.yml
```

---

## Use Resource Limits

Always define CPU and Memory requests and limits.

This prevents one container from consuming all available resources.

---

## Use Deployments Instead of Pods

Never create Pods directly in production.

Deployments automatically recreate failed Pods and support rolling updates.

---

## Keep Replica Count Greater Than One

Running multiple replicas improves availability.

If one Pod fails, traffic is automatically routed to the remaining Pods.

---

## Monitor Your Applications

Frequently check:

```bash
kubectl top pods
```

and

```bash
kubectl logs
```

to detect issues before they become serious.

---

# Kubernetes Interview Questions

## What is Kubernetes?

Kubernetes is a container orchestration platform that automates deployment, scaling, networking, and management of containerized applications.

---

## Difference between Docker and Kubernetes?

Docker builds and runs containers.

Kubernetes manages those containers across one or more machines.

---

## What is a Pod?

A Pod is the smallest deployable unit in Kubernetes and usually contains one application container.

---

## What is a Deployment?

A Deployment manages Pods and ReplicaSets while supporting rolling updates and rollbacks.

---

## What is a Service?

A Service provides a stable network endpoint for a group of Pods.

---

## Why is Ingress needed?

Ingress routes HTTP and HTTPS traffic to different Services based on rules.

---

## Why do we need an Ingress Controller?

Ingress only defines routing rules.

An Ingress Controller reads those rules and actually forwards the traffic.

---

## What is the Metrics Server?

The Metrics Server collects CPU and Memory usage for Nodes and Pods.

It is required for Horizontal Pod Autoscaling.

---

## What is HPA?

Horizontal Pod Autoscaler automatically adjusts the number of Pods based on resource usage.

---

## Difference between Deployment and ReplicaSet?

ReplicaSet ensures the required number of Pods are running.

Deployment manages ReplicaSets and provides rolling updates, rollbacks, and scaling.

---

# Kubernetes Cheat Sheet

## Deploy

```bash
kubectl apply -f deployment.yml
```

---

## Delete

```bash
kubectl delete -f deployment.yml
```

---

## Pods

```bash
kubectl get pods
```

---

## Services

```bash
kubectl get svc
```

---

## Ingress

```bash
kubectl get ingress
```

---

## Logs

```bash
kubectl logs -f deployment/express-deployment
```

---

## Resource Usage

```bash
kubectl top pods
```

---

## Watch Pods

```bash
kubectl get pods -w
```

---

## Everything

```bash
kubectl get all
```

---

# Complete Kubernetes Workflow

```text
Write Application
        │
        ▼
Create Docker Image
        │
        ▼
Create Deployment
        │
        ▼
Deploy Pods
        │
        ▼
Create Service
        │
        ▼
Install Ingress Controller
        │
        ▼
Configure Ingress
        │
        ▼
Monitor Pods
        │
        ▼
Generate Traffic
        │
        ▼
Autoscale Pods
        │
        ▼
Monitor & Troubleshoot
```

---

# 🎉 Congratulations!

You have completed the Kubernetes Handbook.

You should now understand:

- Kubernetes Fundamentals
- Cluster Architecture
- Pods, Deployments & Services
- Ingress & Networking
- Metrics Server
- Horizontal Pod Autoscaler
- Logging & Monitoring
- Common Commands
- Troubleshooting
- Best Practices
- Interview Concepts

You now have a solid foundation for deploying and managing containerized applications with Kubernetes.