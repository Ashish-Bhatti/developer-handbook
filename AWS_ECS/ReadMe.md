# 🚀 AWS ECS Deployment — Complete Guide

> **A comprehensive guide to deploying Dockerized applications on AWS using ECS, ECR, VPC, ALB, and IAM.**
>
> Created by — Sheryians Coding School Cohort

---

## 📑 Table of Contents

- [Why This Guide Exists](#why-this-guide-exists)
- [The Big Picture: How Everything Fits Together](#the-big-picture-how-everything-fits-together)
- [Core Concepts (Deep Dive)](#core-concepts-deep-dive)
  - [1. VPC — Virtual Private Cloud](#1-vpc--virtual-private-cloud)
  - [2. Subnets — Public vs Private](#2-subnets--public-vs-private)
  - [3. Security Group — Virtual Firewall](#3-security-group--virtual-firewall)
  - [4. Internet Gateway — The Door to the Internet](#4-internet-gateway--the-door-to-the-internet)
  - [5. Target Group — The Traffic Router](#5-target-group--the-traffic-router)
  - [6. ALB — Application Load Balancer](#6-alb--application-load-balancer)
  - [7. IAM — Identity and Access Management](#7-iam--identity-and-access-management)
  - [8. ECR — Elastic Container Registry](#8-ecr--elastic-container-registry)
  - [9. ECS — Elastic Container Service](#9-ecs--elastic-container-service)
  - [10. CloudWatch — Logging & Monitoring](#10-cloudwatch--logging--monitoring)
- [Key Differences: IAM User vs Role vs ECS Roles](#key-differences-iam-user-vs-role-vs-ecs-roles)
- [Step-by-Step Deployment Guide](#step-by-step-deployment-guide)
  - [Phase 1: IAM Setup](#phase-1-iam-setup)
  - [Phase 2: ECR Setup & Image Push](#phase-2-ecr-setup--image-push)
  - [Phase 3: VPC Setup](#phase-3-vpc-setup)
  - [Phase 4: ECS Setup](#phase-4-ecs-setup)
  - [Phase 5: Network Configuration](#phase-5-network-configuration)
  - [Phase 6: Accessing Your Application](#phase-6-accessing-your-application)
- [Real Project Example: Deploying a Node.js Express API](#real-project-example-deploying-a-nodejs-express-api)
- [When to Use Each Service](#when-to-use-each-service)
- [Common Pitfalls & Troubleshooting](#common-pitfalls--troubleshooting)
- [Interview Questions](#interview-questions)
- [References](#references)

---

## Why This Guide Exists

### ❌ The Problem

Deploying a Dockerized application to production is **not trivial**. In development, you run `docker-compose up` and everything works locally. But in production:

- How do you handle **traffic spikes** (50 users → 50,000 users)?
- How do you ensure **zero downtime** during updates?
- How do you keep your database **private** and secure?
- How do you **scale** containers automatically?
- How do you **monitor** logs when things crash?

Without a proper system, you'd be manually SSHing into servers, restarting containers, and praying nothing breaks.

### ✅ The Solution

AWS provides a **managed ecosystem** of services that solve all these problems:

| Problem | AWS Solution |
|---------|-------------|
| Store container images | **ECR** — Secure image registry |
| Run containers at scale | **ECS** — Orchestra conductor for containers |
| Distribute traffic | **ALB + Target Group** — Smart traffic cop |
| Secure networking | **VPC + Subnets + Security Groups** — Private fortress |
| Manage permissions | **IAM** — Locked-down access cards |
| Monitor everything | **CloudWatch** — Security cameras & logs |

---

## The Big Picture: How Everything Fits Together

```
                           🌐 INTERNET
                               |
                               v
                     ┌─────────────────┐
                     │       ALB       │  Layer 7 Load Balancer
                     │  (Application   │  - Receives requests
                     │   Load Balancer)│  - Routes to healthy targets
                     └────────┬────────┘
                              |
                              v
                     ┌─────────────────┐
                     │  Target Group   │  List of healthy containers
                     │  (cohort-tg)    │  - Health checks every 30s
                     └────────┬────────┘
                              |
                    ┌─────────┴──────────┐
                    v                    v
             ┌──────────┐        ┌──────────┐
             │  ECS     │        │  ECS     │
             │  Task 1  │        │  Task 2  │  (Fargate - serverless)
             │  :3000   │        │  :3000   │
             └────┬─────┘        └────┬─────┘
                  │                    │
              ┌───┴────────────────────┴───┐
              │         VPC (10.0.0.0/16)   │
              │  ┌──────────────────────┐   │
              │  │  Public Subnet A     │   │
              │  │  (10.0.1.0/24)      │   │
              │  └──────────────────────┘   │
              │  ┌──────────────────────┐   │
              │  │  Public Subnet B     │   │
              │  │  (10.0.2.0/24)      │   │
              │  └──────────────────────┘   │
              └─────────────────────────────┘
                         |
              ┌──────────┴──────────┐
              v                     v
        ┌──────────┐         ┌──────────┐
        │   ECR    │         │CloudWatch│
        │ (Images) │         │ (Logs)   │
        └──────────┘         └──────────┘
```

### 🔄 Request Flow

```
User → ALB → Target Group → ECS Task (Container) → Your App
                                                       │
                                              ┌────────┴────────┐
                                              v                 v
                                         Task Role        Task Execution Role
                                         (App perms)       (Image pull, logs)
```

---

## Core Concepts (Deep Dive)

### 1. VPC — Virtual Private Cloud

#### ❓ What Problem Does It Solve?

Without a VPC, every server you create would be **publicly accessible** by default — like putting every room in your house on the street. A VPC creates a **private, isolated network** inside AWS where you control who can enter and exit.

#### 🧠 How It Works Internally

- VPC defines an **IP address range** (CIDR block), e.g., `10.0.0.0/16`
- This gives you **65,536 possible IP addresses** (2^(32-16))
- Everything inside this range is **private** by default
- You can split this range into **subnets** (smaller networks)

#### 📊 At a Glance

| Aspect | Details |
|--------|---------|
| **What** | Your private network inside AWS |
| **Why needed** | Isolation, security, control |
| **Scope** | Regional (one VPC spans multiple AZs) |
| **CIDR example** | `10.0.0.0/16` = 65,536 IPs |
| **Cost** | Free (you pay for resources inside it) |

#### ✅ When to Use

- **Always** — Every AWS project needs a VPC
- When you need to isolate production vs staging environments

#### ❌ When NOT to Use

- AWS Lambda (serverless) can use a VPC but doesn't require one
- Simple static websites on S3 don't need a VPC

#### ⚖️ Pros & Cons

| Advantages | Disadvantages |
|------------|---------------|
| Complete network isolation | Requires understanding of networking |
| Full control over IP ranges | Can be complex to configure |
| Can connect to on-premise data centers | Limits apply (5 VPCs per region default) |
| Free of charge | — |

---

### 2. Subnets — Public vs Private

#### ❓ What Problem Does It Solve?

A VPC without subnets is like a house without rooms — everything is mixed together. Subnets let you **organize resources** into different zones. Public subnets can talk to the internet; private subnets cannot.

#### 🧠 How It Works Internally

```
VPC: 10.0.0.0/16
│
├── Public Subnet A:  10.0.1.0/24  (AZ: ap-south-1a)
│   ├── 10.0.1.1  → Reserved by AWS
│   ├── 10.0.1.2  → Reserved by AWS
│   ├── 10.0.1.3  → Reserved by AWS
│   ├── 10.0.1.4  → First available IP
│   └── 10.0.1.255 → Broadcast (reserved)
│
└── Private Subnet B: 10.0.2.0/24  (AZ: ap-south-1b)
    └── Database goes here (no internet access)
```

**Key rule:** AWS reserves the first 4 IPs and the last IP in each subnet.

#### ✅ When to Use

- **Public subnet:** Load balancers, web servers that need internet access
- **Private subnet:** Databases, backend services that should NOT be exposed

#### ❌ When NOT to Use

- For simple single-server setups, subnets add unnecessary complexity

#### ⚖️ Pros & Cons

| Advantages | Disadvantages |
|------------|---------------|
| Logical separation of resources | Need at least 2 AZs for high availability |
| Improves security (defense in depth) | Takes time to plan IP ranges |
| Supports high availability across AZs | Wastes IPs (AWS reserves 5 per subnet) |

---

### 3. Security Group — Virtual Firewall

#### ❓ What Problem Does It Solve?

If VPC is your house, Security Groups are the **locks on each door**. They control **who can enter** each resource (EC2, ECS, ALB, etc.) and on **which ports**.

#### 🧠 How It Works Internally

- **Stateful:** If you allow inbound traffic on port 3000, the response is automatically allowed outbound. You don't need a separate outbound rule.
- **Default deny:** All traffic is denied unless you explicitly allow it.
- **Instance-level:** Each resource can have its own security group.

```
Security Group: "Allow Express App"
─────────────────────────────────────
Inbound Rules:
  ✓ Port 3000 → allowed (0.0.0.0/0)
  ✓ Port 443  → allowed (0.0.0.0/0)  [HTTPS]
  ✗ Port 22   → denied               [SSH blocked]
  ✗ All other → denied

Outbound Rules:
  ✓ All traffic → allowed (default)
```

#### ✅ When to Use

- Every single resource that needs network access
- When you need granular control over traffic

#### ❌ When NOT to Use

- For network-level rules (use **Network ACLs** instead — less common)
- Security Groups cannot **deny** specific IPs (use Network ACLs for that)

#### ⚖️ Pros & Cons

| Advantages | Disadvantages |
|------------|---------------|
| Easy to manage (add/remove rules) | Cannot explicitly deny traffic |
| Stateful (responses auto-allowed) | Limit of 60 inbound + 60 outbound rules |
| Works across instances | Changes take effect immediately (can cause accidental exposure) |

---

### 4. Internet Gateway — The Door to the Internet

#### 🧠 What It Does

An Internet Gateway (IGW) is a **horizontally scaled, redundant, managed component** that allows communication between your VPC and the internet.

```
Without IGW:  VPC ←─→ [No Internet]
With IGW:     VPC ←─→ IGW ←─→ Internet
```

**Key points:**
- Must be attached to a VPC
- Resources in **public subnets** need a **route table** pointing to the IGW
- It's **NAT-capable** (translates private IPs to public IPs)

---

### 5. Target Group — The Traffic Router

#### ❓ What Problem Does It Solve?

You can't send traffic to a container that might be **down or unhealthy**. The Target Group acts as a **smart address book** that:
1. Keeps a list of all running containers
2. **Pings them every 30 seconds** (health checks)
3. Removes unhealthy ones automatically
4. Only routes traffic to **healthy** targets

#### 🧠 How It Works Internally

```
Target Group: "cohort-tg"
────────────────────────────
Health Check:
  Path:     /health
  Port:     3000
  Interval: 30 seconds
  Timeout:  5 seconds
  Healthy:  2 consecutive successes
  Unhealthy: 10 consecutive failures

Registered Targets:
  ✓ 10.0.1.5:3000  (ECS Task 1)  → Healthy
  ✓ 10.0.2.5:3000  (ECS Task 2)  → Healthy
  ✗ 10.0.1.6:3000  (ECS Task 3)  → Unhealthy (removed from rotation)
```

#### ✅ When to Use

- When you have **multiple instances** of your app
- When you want **automatic failover** (one goes down, traffic goes to others)

#### ❌ When NOT to Use

- Simple single-server setups — you can directly access the server's IP
- Internal services that don't need load balancing

---

### 6. ALB — Application Load Balancer

#### ❓ What Problem Does It Solve?

Imagine your app goes viral overnight. Without ALB:
- Your single server crashes under the load
- Users get "Connection Refused" errors
- You lose customers and revenue

ALB **distributes incoming traffic** across multiple targets, handles failures, and scales with your app.

#### 🧠 How It Works Internally

ALB works at **Layer 7 (Application Layer)** — it understands HTTP/HTTPS, not just TCP packets.

```
Request: GET /api/users
                     │
              ┌──────┴──────┐
              │    ALB      │
              │  Listener   │  (:80 or :443)
              └──────┬──────┘
                     │
              ┌──────┴──────┐
              │    Rule     │
              │  path: /api*│  → target-group-api
              │  path: /app*│  → target-group-app
              └──────┬──────┘
                     │
              ┌──────┴──────┐
              │  Target     │
              │  Group      │  → ECS Tasks
              └─────────────┘
```

**Features:**
- **Path-based routing:** `/api/*` → API servers, `/app/*` → frontend servers
- **Host-based routing:** `api.example.com` → API servers
- **Sticky sessions:** Same user always goes to same server (optional)
- **TLS termination:** Handles HTTPS certificates
- **Slow start:** Gradually increases traffic to newly launched targets

#### 📊 ALB vs Other Load Balancers

| Feature | ALB (Layer 7) | NLB (Layer 4) | CLB (Classic) |
|---------|---------------|---------------|----------------|
| Protocol | HTTP/HTTPS/gRPC | TCP/UDP | HTTP/TCP |
| Path routing | ✅ Yes | ❌ No | ❌ No |
| Host routing | ✅ Yes | ❌ No | ❌ No |
| Sticky sessions | ✅ Yes | ❌ No | ✅ Yes |
| Static IP | ❌ No | ✅ Yes | ❌ No |
| Speed | Slower (reads headers) | Faster (raw packets) | Slowest |

#### ✅ When to Use

- **ALB:** When you need HTTP-level routing (most web apps)
- **NLB:** When you need ultra-fast TCP/UDP performance (gaming, streaming)
- **CLB:** Legacy applications (AWS recommends migrating to ALB/NLB)

#### ❌ When NOT to Use

- When you need a **static IP** (use NLB instead)
- When you're routing **raw TCP/UDP** traffic (use NLB)
- For very simple apps where a single instance is sufficient

---

### 7. IAM — Identity and Access Management

#### ❓ What Problem Does It Solve?

The **root user** (the email you signed up with) has **unlimited power** — it can delete everything, see everything, and do anything. If someone steals root credentials, your entire AWS account is compromised.

IAM lets you create **individually locked-down users and roles** with exactly the permissions needed.

#### 🧠 How It Works Internally

```
                    ┌─────────────────┐
                    │   Root User     │  (Ashish@gmail.com)
                    │  ❌ Do NOT use  │
                    │     daily       │
                    └────────┬────────┘
                             │ Creates
                             v
                    ┌─────────────────┐
                    │   IAM User      │  (ci-cd-user)
                    │  ╻ Permissions: │
                    │  │ ECR: Full    │  → Can push/pull images
                    │  │ ECS: Full    │  → Can create/update services
                    │  │ EC2: ❌ None │  → Cannot touch servers
                    │  │ S3: ❌ None  │  → Cannot access storage
                    └────────┬────────┘
                             │ Has
                             v
                    ┌─────────────────┐
                    │  Access Keys    │
                    │  AKIA...2SAXT   │  → Used by AWS CLI
                    │  + Secret Key   │
                    └─────────────────┘
```

#### IAM User vs IAM Role

| Aspect | IAM User | IAM Role |
|--------|----------|----------|
| **Identity** | Long-term (person) | Temporary (service/CI) |
| **Credentials** | Access key + Secret (permanent) | Temporary credentials (STS) |
| **Used by** | Humans, CI/CD pipelines | AWS services (EC2, ECS, Lambda) |
| **Example** | Developer pushing to ECR | ECS Task pulling images from ECR |

#### ✅ When to Use

- **IAM Users:** For developers, admins, CI/CD systems
- **IAM Roles:** For AWS services (EC2, ECS, Lambda) to access other services

#### ❌ When NOT to Use

- Don't use IAM Users for AWS services — use Roles (more secure, auto-rotating credentials)
- Don't create unnecessary users — each user increases security surface

#### 🛡️ Least Privilege Principle

```
✅ Good:  "Allow ECR: PushImage"  → User can only push images
❌ Bad:   "Allow AdministratorAccess" → User can do everything

✅ Better: Create separate roles for different tasks
  - deploy-role:     ECR + ECS access only
  - dev-role:        Read-only access to logs
  - admin-role:      Full access (use rarely)
```

---

### 8. ECR — Elastic Container Registry

#### ❓ What Problem Does It Solve?

Your Docker images need a **home** before they can run. You could use Docker Hub, but:
- Docker Hub has **rate limits** (100 pulls per 6 hours for anonymous users)
- Dock Hub is **public** by default — anyone can pull your image
- No **native integration** with AWS services

ECR is a **private, secure** container registry that integrates seamlessly with ECS.

#### 🧠 How It Works Internally

```
┌──────────┐     docker push     ┌──────────────────┐
│ Docker   │ ──────────────────→ │      ECR         │
│ Desktop  │                     │  cohort-demo     │
│ (Local)  │                     │  ├─ latest       │
└──────────┘                     │  ├─ v1.0.0       │
                                 │  └─ v1.0.1       │
                                 └────────┬─────────┘
                                          │
                                    docker pull
                                          │
                                          v
                                 ┌──────────────────┐
                                 │   ECS Task       │
                                 │  (Fargate)       │
                                 └──────────────────┘
```

**Key features:**
- **Private by default:** No one can pull your images without permission
- **Image scanning:** Automatic vulnerability scanning
- **Tag immutability:** Prevent overwriting tags
- **Cross-region replication:** Copy images to other regions
- **Lifecycle policies:** Auto-delete old images

#### 📊 ECR vs Docker Hub

| Feature | ECR | Docker Hub |
|---------|-----|------------|
| Cost | Pay for storage + data transfer | Free tier with limits |
| Privacy | Private by default | Public by default |
| Rate limits | None (pay per use) | 100 pulls/6hr (anonymous) |
| Integration | Native with ECS, EKS | Third-party |
| Security | IAM policies | Access tokens |
| Speed | Fast (same region) | Variable |

#### ✅ When to Use

- When deploying containers on **AWS** (ECS, EKS, Fargate)
- When you need **private** image storage
- When you want **automatic scanning** for vulnerabilities

#### ❌ When NOT to Use

- When deploying on other clouds (GCP, Azure) — use their registries
- For truly public images (open-source) — Docker Hub is better

---

### 9. ECS — Elastic Container Service

#### ❓ What Problem Does It Solve?

Running Docker containers in production requires:
- **Orchestration:** Where to run each container
- **Scheduling:** When to start/stop containers
- **Scaling:** How many containers to run
- **Health monitoring:** What to do when a container crashes
- **Networking:** How containers talk to each other

ECS solves all this **without you managing servers** (with Fargate).

#### 🧠 How It Works Internally

```
                    ┌──────────────────┐
                    │   ECS Cluster    │
                    │  (cohort-cluster)│
                    └────────┬─────────┘
                             │ Contains
                    ┌────────┴─────────┐
                    │  Task Definition │
                    │  (cohort-task)   │
                    │  ──────────────  │
                    │  Image:          │
                    │   cohort-demo:   │
                    │   latest         │
                    │  CPU: 256 (.25)  │
                    │  RAM: 512 MB     │
                    │  Port: 3000      │
                    │  Env vars: {...} │
                    └────────┬─────────┘
                             │ Creates
                    ┌────────┴─────────┐
                    │  ECS Service     │
                    │  ──────────────  │
                    │  Tasks: 2        │  → Runs 2 copies
                    │  ALB: cohort-ALB │  → Attached to load balancer
                    │  Auto-scaling    │  → Scale on CPU > 70%
                    └────────┬─────────┘
                             │ Runs
                    ┌────────┴─────────┐
                    │  ECS Tasks       │
                    │  (Containers)    │
                    │  ├── Task 1      │
                    │  └── Task 2      │
                    └──────────────────┘
```

#### Fargate vs EC2 Launch Type

| Feature | Fargate (Serverless) | EC2 (You Manage) |
|---------|---------------------|------------------|
| **Server management** | AWS handles it | You manage EC2 instances |
| **Scaling** | Automatic | Manual or Auto Scaling Group |
| **Cost** | Pay per task (CPU + RAM) | Pay for EC2 instances (even idle) |
| **Cold start** | Seconds | Minutes (need to launch EC2) |
| **Customization** | Limited (no SSH) | Full control (can SSH) |
| **Best for** | Most apps, startups | Specialized workloads, GPUs |

#### Task Definition Deep Dive

```json
{
  "family": "cohort-task",
  "containerDefinitions": [
    {
      "name": "cohort-demo-server",
      "image": "567768660766.dkr.ecr.ap-south-1.amazonaws.com/cohort-demo:latest",
      "cpu": 256,
      "memory": 512,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp",
          "name": "express-server"
        }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cohort-task",
          "awslogs-region": "ap-south-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ],
  "taskRoleArn": "arn:aws:iam::567768660766:role/cohort-task-role",
  "executionRoleArn": "arn:aws:iam::567768660766:role/cohort-task-role"
}
```

#### ✅ When to Use

- Running Docker containers in production
- Microservices architecture
- When you want **auto-scaling** without managing servers (Fargate)
- Batch processing jobs

#### ❌ When NOT to Use

- Running a single container on a single server (use EC2 + Docker directly)
- When you need Kubernetes-specific features (use EKS)
- Very simple apps where Elastic Beanstalk would suffice

#### ⚖️ Pros & Cons

| Advantages | Disadvantages |
|------------|---------------|
| No server management (Fargate) | Cold start latency |
| Deep AWS integration | Locked into AWS ecosystem |
| Auto-scaling built-in | Less control than Kubernetes |
| Pay per task (cost-effective) | Limited to Docker containers |
| IAM integration | Debugging can be tricky |

---

### 10. CloudWatch — Logging & Monitoring

#### ❓ What Problem Does It Solve?

Your containers are running somewhere in AWS. When they crash:
- Where are the error logs?
- How do you know CPU is at 100%?
- How do you get an alert when things break?

CloudWatch is the **centralized monitoring service** that collects logs, metrics, and events from all your AWS resources.

#### 🧠 How It Works Internally

```
Your App (ECS)
    │
    │  stdout / stderr
    v
CloudWatch Logs ─→ Log Groups ─→ Log Streams
    │                │              │
    │                v              v
    │           /ecs/cohort-task  ecs/app/xxx...
    │
    │  Metrics (CPU, Memory)
    v
CloudWatch Metrics ─→ Alarms ─→ SNS → Email/SMS
```

#### ✅ When to Use

- **Always** — Every production app needs monitoring
- When you need to debug production issues
- When you want to set up alerts

---

## Key Differences: IAM User vs Role vs ECS Roles

This is a **very common area of confusion**. Let's clarify:

```
┌─────────────────────────────────────────────────────────────────┐
│                     WHO NEEDS WHAT?                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Root User (you@email.com)                                      │
│  ├── Has absolute power → DON'T USE for daily work              │
│  │                                                              │
│  ├── IAM User (ci-cd-user)                                     │
│  │   ├── Used by: YOU / CI-CD pipeline                          │
│  │   ├── Permissions: ECR+ECS Full                             │
│  │   ├── Has: Permanent access keys                             │
│  │   └── Purpose: Push images, deploy to ECS                   │
│  │                                                              │
│  └── IAM Role (cohort-task-role)                               │
│      ├── Has TWO jobs in ECS:                                   │
│      │                                                          │
│      │  1. Task Execution Role (ECS Agent → ECR)               │
│      │     ├── Who uses it: ECS Agent (AWS system)              │
│      │     ├── What it does: Pull image from ECR               │
│      │     │                    Send logs to CloudWatch          │
│      │     └── Not your app's concern                           │
│      │                                                          │
│      │  2. Task Role (Container → AWS Services)                │
│      │     ├── Who uses it: Your application code              │
│      │     ├── What it does: Access S3, DynamoDB, etc.         │
│      │     └── Your app assumes this role                      │
│      │                                                          │
│      └── Key: Both can be the SAME IAM Role or DIFFERENT roles │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Deployment Guide

### Phase 1: IAM Setup

**Goal:** Create a user with permission to push images to ECR and manage ECS.

#### Step 1: Create IAM User

```
AWS Console → IAM → Users → Create user
├── Name: ci-cd-user
├── Attach policies directly:
│   ├── ✅ AmazonEC2ContainerRegistryFullAccess
│   └── ✅ AmazonECS_FullAccess
└── Create user
```

#### Step 2: Generate Access Keys

```
Open user → Security credentials → Create access key
├── Use case: Command Line Interface (CLI)
└── Save the following:
    ✅ Access Key ID:     avc
    ✅ Secret Access Key: abc
```

#### Step 3: Install & Configure AWS CLI

```bash
# Check installation
aws --version
# Output: aws-cli/2.35.22 Python/3.14.6 Windows/11 exe/AMD64

# Configure credentials
aws configure
# AWS Access Key ID [None]: avc
# AWS Secret Access Key [None]: abc
# Default region name [None]: ap-south-1      # Mumbai
# Default output format [None]: json
```

> ⚠️ **Security Warning:** Never commit these keys to Git! Use `.gitignore` with `.env` file.

---

### Phase 2: ECR Setup & Image Push

**Goal:** Create a Docker image repository and push your app's image.

#### Step 1: Create ECR Repository

```
AWS Console → ECR → Create repository
├── Visibility: Private
├── Repository name: cohort-demo
└── Create
```

#### Step 2: Push Image to ECR (4 Commands)

```bash
# Use GitBash (supports macOS/Linux commands)

# ────────────────────────────────────
# COMMAND 1: Authenticate Docker with ECR
# ────────────────────────────────────
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 567768660766.dkr.ecr.ap-south-1.amazonaws.com

# ────────────────────────────────────
# COMMAND 2: Build Docker Image (Cross-platform)
# ────────────────────────────────────
# Why --platform linux/amd64?
#   Your PC may be ARM-based (Apple Silicon / newer Windows)
#   AWS EC2 runs on AMD64 architecture
#   This flag builds an image compatible with both
#
# Why --load?
#   Saves the built image to your local Docker daemon
#   Without it, the image is built but not saved locally

docker buildx build --platform linux/amd64 -t cohort-demo:latest . --load

# ────────────────────────────────────
# COMMAND 3: Tag Image for ECR
# ────────────────────────────────────
docker tag cohort-demo:latest 567768660766.dkr.ecr.ap-south-1.amazonaws.com/cohort-demo:latest

# ────────────────────────────────────
# COMMAND 4: Push to ECR
# ────────────────────────────────────
docker push 567768660766.dkr.ecr.ap-south-1.amazonaws.com/cohort-demo:latest
```

**What happens during push:**
```
Local Image:         ECR Repository:
cohort-demo:latest ─→ 56776866.../cohort-demo
                       ├── image layers (uploaded in parallel)
                       ├── manifest (recipe for image)
                       └── tags: latest
```

---

### Phase 3: VPC Setup

**Goal:** Create a private network for your services.

```
AWS Console → VPC → Create VPC
├── Resources: VPC and more    (auto-creates subnets, IGW, route tables)
├── Name: cohort-vpc
└── Create
```

**What gets created automatically:**
```
cohort-vpc (10.0.0.0/16)
├── Internet Gateway        → Allows internet access
├── Public Subnet A         → 10.0.1.0/24 (AZ: ap-south-1a)
├── Public Subnet B         → 10.0.2.0/24 (AZ: ap-south-1b)
├── Private Subnet A        → 10.0.3.0/24 (AZ: ap-south-1a)
├── Private Subnet B        → 10.0.4.0/24 (AZ: ap-south-1b)
├── Route Table (Public)    → Routes traffic to IGW
└── Route Table (Private)   → No direct internet
```

---

### Phase 4: ECS Setup

#### Step A: Create IAM Role for ECS

```
AWS Console → IAM → Roles → Create role
├── Trusted entity type: AWS service
├── Use case: Elastic Container Service → Task Execution Role for ECS
├── Permissions: (auto-selected by AWS)
├── Name: cohort-task-role
└── Create role
```

#### Step B: Create Task Definition

```
AWS Console → ECS → Task Definitions → Create new
├── Family: cohort-task
├── Infrastructure: Fargate
├── CPU: 256 (0.25 vCPU)
├── Memory: 512 MB
├── Task role: cohort-task-role    ← Your app uses this
├── Task execution role: cohort-task-role  ← ECS agent uses this
│
├── Container:
│   ├── Name: cohort-demo-server
│   ├── Image: (Browse ECR → cohort-demo → latest)
│   ├── Port mapping:
│   │   ├── Container port: 3000
│   │   └── Port name: express-server
│   └── Environment variables: (if any)
│
└── Create
```

#### Step C: Create Cluster & Service

```
AWS Console → ECS → Clusters → Create cluster
├── Name: cohort-cluster
├── Infrastructure: Fargate (Serverless)
└── Create

┌────────────────────────────────────────────────────────────┐
│ Click on cohort-cluster → Services tab → Create service   │
├────────────────────────────────────────────────────────────┤
│ ├── Task definition: cohort-task (latest version)         │
│ ├── Service name: cohort-service                          │
│ ├── Desired tasks: 2            ← Run 2 copies for HA     │
│ │                                                          │
│ ├── Networking:                                            │
│ │   ├── VPC: cohort-vpc                                    │
│ │   └── Subnets: (select ONLY public subnets)             │
│ │          ✅ 10.0.1.0/24  (Public)                        │
│ │          ✅ 10.0.2.0/24  (Public)                        │
│ │          ❌ 10.0.3.0/24  (Private - remove)              │
│ │          ❌ 10.0.4.0/24  (Private - remove)              │
│ │                                                          │
│ │ ├── Load balancing:                                      │
│ │ │   ✅ Use load balancing                                │
│ │ │   ├── Load balancer name: cohort-ALB                   │
│ │ │   └── Target group name: cohort-tg                     │
│ │ │                                                         │
│ │ └── Service auto scaling: (optional)                      │
│ │     ├── Min tasks: 2                                     │
│ │     ├── Max tasks: 10                                    │
│ │     └── Scale when: CPU > 70%                            │
│ │                                                           │
│ └── Create                                                 │
└────────────────────────────────────────────────────────────┘
```

---

### Phase 5: Network Configuration

**Goal:** Allow traffic to reach your containers.

```
AWS Console → EC2 → Security Groups
├── Find the SG created by ECS (look for "cohort-ALB" or similar)
│
├── Edit inbound rules → Add rule:
│   ├── Type: Custom TCP
│   ├── Port: 3000
│   ├── Source: 0.0.0.0/0   (Anywhere — for testing)
│   └── Description: Express app port
│
└── Save rules
```

> 🔒 **Production Tip:** Restrict source to your domain's IP range or use CloudFront.

---

### Phase 6: Accessing Your Application

#### Option A: Via Service DNS (ECS)

```
ECS → cluster → service → Configure & Network → Network config → DNS
```

#### Option B: Via ALB DNS (Recommended)

```
EC2 → Load Balancers → cohort-ALB → DNS name
```

**Copy the DNS name and visit:** `http://<alb-dns-name>:3000`

---

## Real Project Example: Deploying a Node.js Express API

### Project Structure

```
my-express-api/
├── src/
│   ├── index.js          # Express server (port 3000)
│   ├── routes/
│   │   └── users.js
│   └── middleware/
│       └── auth.js
├── Dockerfile
├── .dockerignore
├── package.json
└── .env                  # ⚠️ Add to .gitignore!
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
```

### Deployment Script (deploy.sh)

```bash
#!/bin/bash
# deploy.sh — Build & Push to ECR

set -e  # Exit on any error

# Configuration
REGION="ap-south-1"
ACCOUNT_ID="567768660766"
REPO_NAME="cohort-demo"
ECR_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME"

echo "🔧 Building image for linux/amd64..."
docker buildx build --platform linux/amd64 -t $REPO_NAME:latest . --load

echo "🏷️  Tagging image..."
docker tag $REPO_NAME:latest $ECR_URI:latest

echo "📤 Pushing to ECR..."
docker push $ECR_URI:latest

echo "✅ Done! Image pushed to $ECR_URI:latest"
```

### GitHub Actions CI/CD (Optional)

```yaml
name: Deploy to ECS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: cohort-demo
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```

---

## When to Use Each Service

| Service | Use When | Don't Use When |
|---------|----------|----------------|
| **VPC** | Building any AWS infrastructure | Static S3 sites, Lambda alone |
| **ALB** | Multiple instances, HTTP routing | Single server, TCP/UDP traffic |
| **ECR** | Deploying containers on AWS | Public images, other clouds |
| **ECS** | Docker containers in production | Single container on one VM |
| **IAM** | Managing access & permissions | Root-only setups |
| **CloudWatch** | Production monitoring | Development only |

---

## Common Pitfalls & Troubleshooting

### 🔴 Problem: "Cannot pull image" error in ECS

```
Cause: Task Execution Role doesn't have ECR permissions.
Fix:   Ensure the task execution role has
       AmazonECR_ReadOnly access (or similar).
```

### 🔴 Problem: Application is unreachable (timeout)

```
1. Check Security Group → Is port 3000 open to 0.0.0.0/0?
2. Check Target Group → Are targets healthy? (Status: healthy)
3. Check ALB Listener → Is port 3000 configured?
4. Check ECS Task logs → Is the app actually starting?
```

### 🔴 Problem: Wrong architecture error

```
Cause: You built image for ARM (Apple Silicon) but
       AWS is AMD64.
Fix:   Use --platform linux/amd64 when building.
       docker buildx build --platform linux/amd64 -t my-image . --load
```

### 🔴 Problem: Tasks keep stopping (restart loop)

```
Cause: Application crashes on startup.
Fix:   Check CloudWatch logs:
       1. Go to ECS → Task → Logs tab
       2. Look for startup errors
       3. Common: Missing env variables, wrong port, dependency issues
```

### 🔴 Problem: Can't SSH into container

```
Fact: You CANNOT SSH into Fargate containers.
      This is by design (more secure).
Fix:  Debug via CloudWatch logs.
      If you truly need shell access, use ECS Exec feature.
```

### 🔴 Problem: ALB returns 503 (Unhealthy targets)

```
1. Check Target Group health check path
   → Does /health exist in your app?
2. Check health check port
   → Should match your container port (3000)
3. Check Security Group
   → Does ALB SG allow traffic to ECS tasks?
```

---

## Interview Questions

### 🟢 Basic Level

**Q1: What is the difference between a public subnet and a private subnet?**

A public subnet has a route to the Internet Gateway, so resources in it can receive traffic from the internet (like a web server). A private subnet does NOT have a route to the IGW, so resources in it cannot be accessed from the internet (like a database).

---

**Q2: What is the difference between Security Group and Network ACL?**

| Feature | Security Group | Network ACL |
|---------|---------------|-------------|
| Level | Instance-level | Subnet-level |
| State | Stateful (return traffic auto-allowed) | Stateless (must allow both directions) |
| Rules | Allow only | Allow + Deny |
| Order | All rules evaluated | Ordered (lower number = higher priority) |

---

**Q3: What is the difference between ECS and ECR?**

ECR stores Docker images (like a warehouse). ECS runs those images as containers (like a factory worker using the warehouse materials).

---

### 🟡 Intermediate Level

**Q4: What happens when an ECS task crashes?**

1. ECS detects the task is stopped
2. ECS service (if configured) starts a new task to replace it
3. Target Group health check detects the old task is unhealthy
4. ALB stops routing traffic to the old task
5. Once the new task passes health checks, ALB routes traffic to it
6. **Result:** Zero downtime (if at least 2 tasks running)

---

**Q5: Can you use the same IAM Role for both Task Role and Task Execution Role?**

Yes! Many setups use a single role for both. The Task Execution Role needs permissions to pull images (ECR) and send logs (CloudWatch). The Task Role needs permissions for your app to access AWS services (S3, DynamoDB, etc.). If both sets of permissions are needed, a single role works fine.

---

**Q6: Why use an ALB instead of directly accessing ECS tasks?**

1. **Load distribution:** Spread traffic across multiple tasks
2. **Health checks:** Don't route to unhealthy tasks
3. **DNS name:** Stable endpoint even when tasks change
4. **SSL termination:** Handle HTTPS certificates at the ALB
5. **Path routing:** Route /api/* to one service, /app/* to another

---

**Q7: What is `--platform linux/amd64` when building Docker images?**

Your local machine might have a different CPU architecture (e.g., Apple M1/M2 is ARM64, newer Windows on ARM). AWS EC2/Fargate uses AMD64 architecture. Without specifying the platform, Docker builds for your local architecture, and the image **might not run** on AWS. The `--load` flag then saves this cross-platform image locally.

---

### 🔴 Advanced Level

**Q8: Explain the difference between Fargate and EC2 launch types in ECS.**

| Aspect | Fargate | EC2 |
|--------|---------|-----|
| **Who manages servers?** | AWS (fully managed) | You manage EC2 instances |
| **Scaling** | Instant (seconds) | Slower (minutes) |
| **Pricing** | Per-task (CPU + RAM) | Per-instance (even if idle) |
| **Customization** | Limited (no SSH) | Full control (SSH, install software) |
| **Cold start** | Low (seconds) | High (minutes if new EC2 needed) |
| **Use case** | Most web apps | GPU workloads, specialized needs |

---

**Q9: How does auto-scaling work in ECS?**

1. CloudWatch monitors metrics (CPU, memory, request count)
2. When CPU exceeds 70% for 5 minutes, CloudWatch Alarm triggers
3. Application Auto Scaling receives the alarm
4. Auto Scaling increases desired task count (e.g., 2 → 4)
5. ECS launches new tasks
6. When CPU drops below 30%, Auto Scaling decreases tasks
7. **Result:** Your app scales with demand, you only pay for what you use

---

**Q10: If you have a Node.js app running on ECS, and it needs to access S3, which IAM role should give it permission?**

The **Task Role** (not the Task Execution Role). The Task Execution Role is used by ECS agent to pull images and send logs. The Task Role is assumed by your app code. So your Node.js app would use the Task Role's permissions to call S3 APIs.

---

**Q11: How does the ALB know which ECS task to send a request to?**

1. When an ECS task starts, it registers itself with the Target Group
2. The Target Group performs health checks (e.g., GET /health every 30s)
3. If the task responds with HTTP 200, it's marked **Healthy**
4. ALB uses a **round-robin** algorithm to distribute requests
5. If a task becomes unhealthy, ALB stops sending requests to it
6. ALB uses **sticky sessions** (optional) to send same user to same task

---

**Q12: What is the difference between a "replica" service and a "daemon" service in ECS?**

- **Replica Service (most common):** ECS maintains the desired number of tasks (e.g., always 2 running). ECS decides which instances/availability zones to place them in. Used for web apps.
- **Daemon Service:** Runs one task on **each** container instance. Used for logging agents, monitoring, etc. Only meaningful with EC2 launch type.

---

## References

- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Docker Multi-Architecture Builds](https://docs.docker.com/build/building/multi-platform/)

---

> 📝 **Note:** This guide was created as part of Sheryians Coding School Cohort.
> The AWS account ID and resource names used are examples — replace with your own.
>
> ⚠️ **Security Reminder:** The credentials in `.env` are examples from a demo account.
> Never commit real credentials to Git. Always use `.gitignore` to exclude `.env` files.