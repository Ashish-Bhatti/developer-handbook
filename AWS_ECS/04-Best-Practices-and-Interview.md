# Part 4 - Best Practices, Troubleshooting & Interview Preparation

---

# Common Deployment Errors

No matter how carefully you deploy your application, you'll eventually run into errors. Understanding **why** they happen is more important than memorizing the solution.

---

# Error 1 - exec format error

### Error

```text
exec /usr/local/bin/node: exec format error
```

## Why It Happens

Your Docker image was built for a different CPU architecture than AWS.

For example:

```text
Your Laptop

ARM64

↓

AWS ECS

AMD64
```

The operating system cannot execute the binary.

## Solution

Always build the image using:

```bash
docker buildx build --platform linux/amd64 -t app:latest . --load
```

---

# Error 2 - ECS Task Keeps Stopping

## Symptoms

```text
Task

Running

↓

Stopped

↓

Running

↓

Stopped
```

## Possible Reasons

* Application crashed
* Wrong environment variables
* Database connection failed
* Wrong PORT
* Missing dependency

## Solution

Open

```text
CloudWatch

↓

Logs

↓

Find Error
```

CloudWatch usually tells you the exact reason.

---

# Error 3 - Cannot Pull Image

Usually caused by:

* Wrong Image URL
* Wrong Image Tag
* Missing Task Execution Role permission
* Image not pushed to ECR

Always verify

```text
Task Execution Role

↓

Amazon ECR Access
```

---

# Error 4 - Website Doesn't Open

Check the following:

✅ Security Group

Is your application port open?

Example

```text
TCP

3000

Anywhere
```

---

✅ Target Group

Are your tasks healthy?

---

✅ ALB

Is the Load Balancer attached?

---

✅ ECS

Are your Tasks running?

---

# Error 5 - 503 Service Unavailable

Usually means

ALB cannot find a healthy container.

Possible reasons

* Health Check failed
* Wrong Port
* Container crashed

---

# Error 6 - Port Already in Use

Example

```text
EADDRINUSE
```

Another process is already using that port.

Either

* Stop the process

or

* Change your application port

---

# Production Best Practices

Deploying an application is one thing.

Deploying it safely is another.

---

## Never Use Root Account

Always create IAM Users.

```text
Root User

↓

Creates IAM User

↓

Developer uses IAM User
```

---

## Never Store Secrets in Code

Avoid

```javascript
const SECRET = "my-secret-key";
```

Use

* Environment Variables
* AWS Secrets Manager

instead.

---

## Never Push Credentials to GitHub

Always ignore

```text
.env
```

using

```text
.gitignore
```

---

## Use Least Privilege Principle

Only provide permissions that are actually required.

Instead of

```text
Administrator Access
```

prefer

```text
ECR

ECS
```

only.

---

## Always Use Version Tags

Avoid

```text
latest
```

for production deployments.

Better

```text
v1.0.0

v1.0.1

v1.1.0
```

This makes rollback much easier.

---

## Keep Multiple Tasks Running

Instead of

```text
Desired Tasks

1
```

Use

```text
Desired Tasks

2
```

or more.

This prevents downtime when a container crashes.

---

## Monitor Your Application

Always use

CloudWatch

to monitor

* CPU
* Memory
* Logs
* Errors

Monitoring should be part of every production deployment.

---

# Cost Optimization

AWS is pay-as-you-go.

If you forget to delete resources, AWS continues charging you.

After completing practice:

Delete

* ECS Services
* ECS Cluster
* Load Balancer
* Target Group
* ECR Repository

if you no longer need them.

This prevents unnecessary charges.

---

# AWS Services Revision

| Service         | Responsibility               |
| --------------- | ---------------------------- |
| IAM             | Authentication & Permissions |
| VPC             | Private Network              |
| Security Group  | Firewall                     |
| ECR             | Stores Docker Images         |
| ECS             | Runs Docker Containers       |
| Task Definition | Blueprint of Containers      |
| ECS Service     | Keeps Containers Running     |
| Target Group    | Stores Healthy Targets       |
| ALB             | Distributes Traffic          |
| CloudWatch      | Logs & Monitoring            |

---

# Complete Architecture

```text
                    Internet
                        │
                        ▼
         Application Load Balancer
                        │
                        ▼
                Target Group
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
      ECS Task                   ECS Task
          │                           │
          └─────────────┬─────────────┘
                        ▼
                  Docker Image
                     Amazon ECR

--------------------------------------------

Infrastructure

IAM
VPC
Security Groups
CloudWatch
```

---

# Complete Deployment Pipeline

```text
Write Code

↓

Dockerfile

↓

Docker Compose

↓

Docker Image

↓

Amazon ECR

↓

Task Definition

↓

ECS Service

↓

Running Tasks

↓

Target Group

↓

Application Load Balancer

↓

Internet Users
```

---

# Interview Questions

## What is AWS?

AWS (Amazon Web Services) is a cloud platform that provides on-demand computing resources like servers, databases, networking, storage, and managed services.

---

## Why do we need Docker before AWS?

Docker packages our application along with all its dependencies into a portable image, ensuring it runs consistently across different environments.

---

## What is ECR?

Amazon Elastic Container Registry is a managed Docker image registry where Docker images are stored before deployment.

---

## What is ECS?

Amazon Elastic Container Service is a container orchestration service that runs and manages Docker containers.

---

## Difference between ECR and ECS?

| ECR                           | ECS                       |
| ----------------------------- | ------------------------- |
| Stores Images                 | Runs Images               |
| Like GitHub for Docker Images | Like Docker Engine in AWS |

---

## What is Task Definition?

A Task Definition is a blueprint describing how a container should run, including image, CPU, RAM, ports, environment variables, and IAM roles.

---

## Difference between Task Role and Task Execution Role?

| Task Role                | Task Execution Role     |
| ------------------------ | ----------------------- |
| Used by your application | Used by ECS             |
| Access AWS Services      | Pull Images & Send Logs |

---

## What is VPC?

A Virtual Private Cloud is a private network inside AWS where resources are securely deployed.

---

## Why do we need Security Groups?

Security Groups act as virtual firewalls controlling which traffic can enter or leave AWS resources.

---

## Why do we need an ALB?

Application Load Balancer distributes incoming requests across multiple healthy containers to improve availability and scalability.

---

## What is a Target Group?

A Target Group keeps track of healthy resources and allows the Load Balancer to route traffic only to healthy targets.

---

## Why use CloudWatch?

CloudWatch collects logs and metrics, making it easier to monitor and debug production applications.

---

## Why use buildx?

Docker Buildx allows us to build images for different CPU architectures.

We used

```bash
docker buildx build --platform linux/amd64
```

because AWS Fargate runs on AMD64 architecture.

---

## Why did we use Docker Compose?

Docker Compose helped us develop and test multiple containers locally.

Before deploying to AWS, each service was built as a Docker image and pushed to Amazon ECR.

---

# Quick Revision

```text
AWS

Cloud Platform

--------------------------------

IAM

Permissions

--------------------------------

VPC

Private Network

--------------------------------

Security Group

Firewall

--------------------------------

ECR

Stores Images

--------------------------------

ECS

Runs Containers

--------------------------------

Task Definition

Container Blueprint

--------------------------------

Service

Maintains Running Tasks

--------------------------------

Target Group

Healthy Containers

--------------------------------

ALB

Traffic Distribution

--------------------------------

CloudWatch

Logs
```

---

# Final Summary

Deploying a Dockerized application on AWS is a sequence of services working together.

Each service has a single responsibility:

* **IAM** secures access.
* **VPC** provides an isolated network.
* **Security Groups** control incoming and outgoing traffic.
* **ECR** stores Docker images.
* **ECS** runs containers.
* **Task Definitions** describe how containers should run.
* **ECS Services** maintain the desired number of running tasks.
* **Target Groups** monitor container health.
* **Application Load Balancers** distribute incoming traffic.
* **CloudWatch** collects logs and monitors the application.

Understanding **why each service exists** is far more valuable than simply memorizing the deployment steps. Once you understand the responsibilities of each component, deploying any containerized application on AWS becomes much easier.

---

> **Key Takeaway:** AWS isn't a single service—it's an ecosystem of specialized services working together. Learning the role of each service and how they interact is the foundation of building scalable, secure, and production-ready applications.
