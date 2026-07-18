# ☸️ Part 1 - Kubernetes Fundamentals

Before deploying applications, it's important to understand **what Kubernetes is**, **why it exists**, and **how its core components work together**.

By the end of this chapter, you'll have a solid understanding of the Kubernetes architecture and the terminology you'll use throughout the rest of this handbook.

---

# 📖 Table of Contents

1. What is Kubernetes?
2. Why Do We Need Kubernetes?
3. Problems Without Kubernetes
4. Kubernetes Architecture
5. Cluster
6. Node
7. Pod
8. ReplicaSet
9. Deployment
10. Service
11. Ingress
12. Ingress Controller
13. Labels & Selectors
14. Namespace
15. Kubernetes Object Relationship
16. Summary

---

# What is Kubernetes?

Kubernetes (often abbreviated as **K8s**) is an open-source container orchestration platform developed by Google and now maintained by the Cloud Native Computing Foundation (CNCF).

Its primary job is to **deploy, manage, scale, and monitor containerized applications automatically.**

Instead of manually starting Docker containers on different servers, Kubernetes continuously ensures that your application remains healthy and available.

Simply put:

> **Docker creates containers. Kubernetes manages them.**

---

# Why Do We Need Kubernetes?

Docker is excellent for packaging applications into containers, but managing hundreds or even thousands of containers manually quickly becomes difficult.

Imagine running an e-commerce website with multiple services:

- Authentication
- Products
- Orders
- Payments
- Notifications

Each service might require multiple container instances to handle user traffic.

Now imagine:

- One container crashes.
- Another server goes offline.
- Traffic suddenly increases.
- A new application version needs to be deployed.

Managing all of this manually is nearly impossible.

Kubernetes automates these tasks.

It can:

- Restart failed containers
- Replace unhealthy Pods
- Scale applications automatically
- Load balance traffic
- Perform rolling updates without downtime
- Manage networking between services

---

# Problems Without Kubernetes

Without Kubernetes, developers often face several challenges:

### Container Failure

If a Docker container crashes, someone must manually restart it.

---

### Scaling

During high traffic, additional containers must be started manually.

---

### Load Balancing

Incoming requests need to be distributed across multiple containers.

---

### Changing IP Addresses

Containers are temporary.

Whenever a container is recreated, its IP address changes.

Applications communicating directly with container IPs will eventually break.

---

### Deployments

Updating an application without downtime becomes difficult.

Stopping old containers before starting new ones can make the application temporarily unavailable.

---

Kubernetes solves all of these problems automatically.

---

# Kubernetes Architecture

A Kubernetes cluster consists of one or more machines working together.

```text
                 Kubernetes Cluster
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   Control Plane                    Worker Node
                                        │
                          ┌─────────────┴─────────────┐
                          │                           │
                        Pod                         Pod
                          │                           │
                     Container                  Container
```

Every component inside the cluster has a specific responsibility.

---

# Cluster

A **Cluster** is the complete Kubernetes environment.

It consists of:

- Control Plane
- One or more Worker Nodes

Think of the cluster as the entire system that runs your applications.

Without a cluster, Kubernetes cannot manage anything.

---

# Node

A Node is simply a machine inside the Kubernetes cluster.

It can be:

- Physical server
- Virtual machine
- Cloud instance

There are two types of nodes:

## Control Plane

The brain of Kubernetes.

It makes decisions such as:

- Scheduling Pods
- Monitoring Nodes
- Managing Deployments
- Handling API requests

---

## Worker Node

Worker Nodes actually run your applications.

Each Worker Node contains:

- Pods
- Containers
- kubelet
- kube-proxy
- Container Runtime

---

# Pod

A Pod is the **smallest deployable unit in Kubernetes**.

Instead of creating containers directly, Kubernetes creates Pods.

A Pod usually contains:

- One application container
- Shared Network
- Shared Storage

Example:

```text
Pod

├── Node.js Container
├── Shared IP
└── Shared Storage
```

Pods are temporary.

If a Pod crashes, Kubernetes replaces it with a new Pod.

---

# ReplicaSet

A ReplicaSet ensures that a specified number of Pods are always running.

Example:

Desired Pods = 3

Current Running = 2

ReplicaSet immediately creates one more Pod.

```text
Desired = 3

Pod 1 ✅

Pod 2 ✅

Pod 3 ❌

↓

ReplicaSet

↓

New Pod 3 ✅
```

---

# Deployment

A Deployment manages ReplicaSets and Pods.

Instead of creating Pods manually, developers create a Deployment.

The Deployment handles:

- Creating Pods
- Updating Pods
- Rolling Updates
- Rollbacks
- Scaling

Think of a Deployment as the manager responsible for maintaining your application's desired state.

---

# Service

Pods are temporary.

Whenever a Pod is recreated, it receives a new IP address.

A Service provides a **stable network endpoint** that never changes.

Instead of connecting directly to Pods, applications communicate through the Service.

The Service automatically discovers Pods using **Labels and Selectors** and distributes traffic among them.

```text
Service

↓

Pod 1

Pod 2

Pod 3
```

---

# Ingress

Ingress is a collection of HTTP and HTTPS routing rules.

It defines:

- Which domain to use
- Which URL path to match
- Which Service should receive the request

Example:

```text
example.com/products

↓

Product Service

example.com/orders

↓

Order Service
```

Ingress itself does nothing.

It only contains routing rules.

---

# Ingress Controller

The Ingress Controller is the component that actually reads Ingress rules and routes incoming traffic.

Without an Ingress Controller, Ingress resources have no effect.

A commonly used controller is:

- NGINX Ingress Controller

Flow:

```text
User

↓

Ingress Controller

↓

Service

↓

Pods
```

---

# Labels & Selectors

Labels are key-value pairs attached to Kubernetes resources.

Example:

```yaml
labels:
  app: express
```

Selectors use these labels to locate resources.

Example:

```yaml
selector:
  app: express
```

Services use selectors to discover Pods automatically.

---

# Namespace

Namespaces divide a Kubernetes cluster into logical sections.

Example:

- default
- kube-system
- ingress-nginx
- production
- development

Namespaces help organize applications and prevent naming conflicts.

---

# Kubernetes Object Relationship

```text
Cluster
    │
    ▼
Node
    │
    ▼
Deployment
    │
    ▼
ReplicaSet
    │
    ▼
Pods
    │
    ▼
Containers

Service
    │
    └────────────► Pods

Ingress
    │
    ▼
Ingress Controller
    │
    ▼
Service
```

---

# Summary

After completing this chapter, you should understand:

- What Kubernetes is
- Why Kubernetes is needed
- Kubernetes Architecture
- Cluster
- Node
- Pod
- ReplicaSet
- Deployment
- Service
- Ingress
- Ingress Controller
- Labels & Selectors
- Namespaces

In the next chapter, we'll deploy our first application on Kubernetes using:

- `deployment.yml`
- `service.yml`
- `ingress.yml`
- NGINX Ingress Controller