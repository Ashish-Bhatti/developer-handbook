# Part 2 - Amazon ECR, ECS & Running Docker Containers

---

# Amazon ECR (Elastic Container Registry)

## What is ECR?

Amazon **Elastic Container Registry (ECR)** is a private Docker image registry provided by AWS.

Think of ECR as **GitHub, but for Docker Images instead of source code.**

Instead of storing your application code, ECR stores Docker Images that can later be downloaded and executed by AWS services like ECS.

---

## Why Do We Need ECR?

Suppose you've built your application locally.

```
Node.js Project

↓

Docker Image

↓

Your Laptop
```

AWS cannot directly access your laptop.

So first we upload the Docker Image to a location that AWS can access.

That location is **Amazon ECR.**

```
Local Docker Image

↓

Amazon ECR

↓

Amazon ECS

↓

Running Container
```

Without ECR there would be no place for ECS to download your application.

---

## What Does ECR Store?

ECR stores:

* Docker Images
* Multiple Image Versions
* Tags
* Image Metadata

Example:

```
cohort-demo

├── latest

├── v1.0

├── v1.1

└── v2.0
```

This allows us to deploy different versions whenever required.

---

## Docker Hub vs Amazon ECR

| Docker Hub              | Amazon ECR             |
| ----------------------- | ---------------------- |
| Public by default       | Private by default     |
| Stores Docker Images    | Stores Docker Images   |
| Used everywhere         | Mainly used inside AWS |
| Limited anonymous pulls | Integrated with ECS    |
| Community registry      | Enterprise registry    |

---

# Building Docker Images for AWS

During development we usually build Docker Images using:

```bash
docker build -t my-app .
```

However, when deploying to AWS we use:

```bash
docker buildx build --platform linux/amd64 -t cohort-demo:latest . --load
```

---

## Why buildx?

Different computers have different CPU architectures.

For example:

| Device           | Architecture |
| ---------------- | ------------ |
| Apple Silicon    | ARM64        |
| Raspberry Pi     | ARM64        |
| Most Windows PCs | AMD64        |
| AWS Fargate      | AMD64        |

If we build the image for ARM and try to run it on AMD64, the container will fail.

To solve this we build a compatible image.

```bash
docker buildx build --platform linux/amd64
```

This creates an image compatible with AWS.

---

## Why --load?

Without:

```bash
docker buildx build
```

The image is created inside BuildKit but isn't loaded into your local Docker Images.

Using

```bash
--load
```

imports the image into Docker Desktop so it can be tagged and pushed.

---

# Complete Image Upload Process

```
Project

↓

Dockerfile

↓

docker buildx

↓

Docker Image

↓

docker tag

↓

Amazon ECR

↓

docker push
```

---

# Authenticating Docker with ECR

Before Docker can push images to ECR it must authenticate.

AWS CLI generates a temporary login token.

```bash
aws ecr get-login-password \
--region ap-south-1 |
docker login \
--username AWS \
--password-stdin YOUR_ECR_URL
```

After successful authentication Docker can communicate with ECR.

---

# Image Upload Commands

Step 1

Login

```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin YOUR_ECR_URL
```

---

Step 2

Build Image

```bash
docker buildx build --platform linux/amd64 -t cohort-demo:latest . --load
```

---

Step 3

Tag Image

```bash
docker tag cohort-demo:latest YOUR_ECR_URL/cohort-demo:latest
```

---

Step 4

Push Image

```bash
docker push YOUR_ECR_URL/cohort-demo:latest
```

Once uploaded, the image becomes available inside Amazon ECR.

---

# Amazon ECS (Elastic Container Service)

## What is ECS?

Amazon ECS is a **Container Orchestration Service.**

It is responsible for running Docker Containers inside AWS.

Think of it as the manager responsible for starting, stopping, monitoring and restarting containers.

---

## Why Do We Need ECS?

Suppose your Docker Image exists in ECR.

```
Docker Image

↓

Amazon ECR
```

The image is only stored.

It is **not running**.

Someone must download that image and execute it.

That is the job of ECS.

```
Amazon ECR

↓

Amazon ECS

↓

Running Container
```

---

## ECS Responsibilities

ECS is responsible for:

* Running Containers
* Restarting Failed Containers
* Scaling Containers
* Updating Containers
* Health Checks
* Networking

---

## ECS Components

When using ECS we mainly work with:

```
Cluster

↓

Task Definition

↓

Service

↓

Running Tasks
```

Understanding these four concepts makes ECS much easier.

---

# ECS Cluster

A Cluster is simply a logical group of running containers.

Think of it like a folder.

Example:

```
Production Cluster

├── User Service

├── Product Service

├── Payment Service

└── Notification Service
```

Every application belongs to some cluster.

---

# Task Definition

## What is Task Definition?

A Task Definition is the **blueprint** for running a container.

It tells ECS everything required to start your application.

Think of it as Docker's equivalent of:

```
docker run
```

but saved as a reusable configuration.

---

## Information Stored

Task Definition stores:

* Docker Image
* CPU
* RAM
* Port
* Environment Variables
* Logging
* IAM Roles

Example:

```
Image

↓

cohort-demo:latest

CPU

↓

256

Memory

↓

512 MB

Container Port

↓

3000
```

Whenever ECS needs another container, it simply reads this blueprint.

---

# ECS Task

A Task is an actual running container created from the Task Definition.

```
Task Definition

↓

Task

↓

Running Container
```

Example:

Task Definition

```
Image

Node.js

Port

3000
```

Running Tasks

```
Task 1

Running

Task 2

Running

Task 3

Running
```

One Task Definition can create many Tasks.

---

# ECS Service

## What is ECS Service?

An ECS Service ensures the required number of Tasks are always running.

Suppose you configure:

```
Desired Tasks

2
```

If one crashes,

```
Task 1

Running

Task 2

Stopped
```

ECS automatically starts another container.

```
Task 1

Running

Task 3

Running
```

This provides high availability.

---

## Desired Count

Desired Count tells ECS:

> "Always keep this many containers running."

Example

Desired Count = 3

```
Container 1

Running

Container 2

Running

Container 3

Running
```

If Container 2 crashes,

ECS automatically creates another one.

---

# Task Role

Task Role provides permissions **to your application.**

Example

Suppose your Node.js server wants to upload files to S3.

```
Node.js

↓

S3
```

Instead of storing AWS credentials inside your project,

AWS automatically provides temporary credentials using the Task Role.

Your application simply uses those permissions.

---

## Examples

Task Role can allow access to:

* S3
* DynamoDB
* Secrets Manager
* SES
* SNS

---

# Task Execution Role

Task Execution Role is different.

It is **not used by your application.**

Instead, it is used by ECS itself.

Before your container starts,

ECS needs permission to:

* Pull Images from ECR
* Send Logs to CloudWatch

Task Execution Role provides those permissions.

---

## Difference Between Roles

| Task Role                | Task Execution Role   |
| ------------------------ | --------------------- |
| Used by your application | Used by ECS           |
| Access S3                | Pull Images           |
| Access DynamoDB          | Send Logs             |
| Access Secrets           | Authenticate with ECR |

Remember:

Task Role → Your Code

Task Execution Role → ECS

---

# Complete ECS Flow

```
Task Definition

↓

ECS Service

↓

Creates Tasks

↓

Downloads Image from ECR

↓

Starts Docker Container

↓

Application Running
```

---

# Docker Compose & AWS

During development we use Docker Compose.

```
docker compose up
```

Docker Compose starts:

* Backend
* Frontend
* MongoDB
* Redis

all together on our local machine.

---

## Why Can't We Deploy docker-compose Directly?

Docker Compose is designed primarily for **local development.**

AWS ECS does not execute docker-compose files directly.

Instead, we convert our compose setup into Task Definitions.

Each service becomes its own container.

Example

```
docker-compose.yml

↓

Frontend Container

↓

Backend Container

↓

Redis Container

↓

MongoDB Container
```

Each container is uploaded separately to Amazon ECR.

ECS then runs those containers according to their Task Definitions.

---

# Summary

At this point we understand the entire container deployment pipeline.

```
Project

↓

Dockerfile

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
```

In the next part we'll connect these running containers to the internet using:

* Target Groups
* Application Load Balancer (ALB)
* CloudWatch
* Security Groups
* Complete Production Deployment
