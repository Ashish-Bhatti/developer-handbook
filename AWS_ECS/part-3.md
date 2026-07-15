# Part 3 - Networking, Load Balancing & Deploying to Production

---

# Why Do We Need Networking?

At this point our Docker Image is stored inside **Amazon ECR** and ECS is capable of running it.

But one problem still exists.

**How will users access our application?**

Currently our container is running inside AWS.

```
User

❌

Cannot directly access Container
```

AWS needs a way to safely expose our application to the internet.

This is where networking services come into the picture.

---

# Complete AWS Request Flow

Before learning each service, understand the complete flow.

```
                     Internet
                         │
                         ▼
          Application Load Balancer (ALB)
                         │
                         ▼
                  Target Group
                         │
         ┌───────────────┴──────────────┐
         ▼                              ▼
      ECS Task                      ECS Task
 (Container Running)          (Container Running)
         │                              │
         └──────────────┬───────────────┘
                        ▼
                  Your Application
```

Whenever a user opens your website, every request follows this path.

---

# Target Group

## What is a Target Group?

A Target Group is simply a **list of resources** where the Application Load Balancer can send traffic.

These resources can be:

* ECS Tasks
* EC2 Instances
* IP Addresses
* Lambda Functions

For our project, the Target Group contains our ECS Tasks.

---

## Why Do We Need Target Groups?

Suppose we have two running containers.

```
Container 1

Container 2
```

How does the Load Balancer know where to send requests?

It looks inside the Target Group.

```
Target Group

├── Task 1

└── Task 2
```

Now ALB knows exactly where traffic should go.

---

# Health Checks

A Target Group continuously checks whether a container is healthy.

Suppose:

```
Task 1

Running

Task 2

Crashed
```

Target Group marks Task 2 as unhealthy.

Now ALB automatically stops sending requests to it.

```
ALB

↓

Task 1

✅ Healthy

Task 2

❌ Ignored
```

This provides fault tolerance.

---

# Application Load Balancer (ALB)

## What is ALB?

Application Load Balancer distributes incoming traffic across multiple running containers.

Think of ALB as a traffic police officer.

Instead of allowing everyone to enter one server, it distributes traffic evenly.

---

## Why Do We Need ALB?

Imagine 10,000 users open your website at the same time.

Without ALB

```
10000 Users

↓

One Container

↓

💥 Server Crash
```

With ALB

```
10000 Users

↓

ALB

↓

Task 1

Task 2

Task 3

Task 4
```

Traffic is distributed equally.

---

# Benefits of ALB

* Load Balancing
* High Availability
* Health Checks
* Better Performance
* Automatic Traffic Distribution

---

# Round Robin

By default ALB distributes requests one by one.

Example

```
Request 1

↓

Task 1

Request 2

↓

Task 2

Request 3

↓

Task 3

Request 4

↓

Task 1
```

This algorithm is called **Round Robin**.

---

# Why Two ECS Tasks?

During deployment we selected

```
Desired Tasks

2
```

instead of

```
1
```

Why?

Suppose one container crashes.

```
Task 1

Running

Task 2

Stopped
```

The Target Group removes Task 2.

ALB continues sending traffic to Task 1.

Meanwhile ECS automatically starts another Task.

Users don't notice any downtime.

---

# CloudWatch

## What is CloudWatch?

CloudWatch is AWS's logging and monitoring service.

It helps us understand what is happening inside our application.

---

## Why Do We Need CloudWatch?

Suppose our application crashes.

```
ECS

↓

Task Stopped
```

Without logs we have no idea why.

CloudWatch stores:

* Application Logs
* Container Logs
* CPU Usage
* Memory Usage
* Network Usage

This makes debugging much easier.

---

## Example

Instead of

```
Application Crashed
```

CloudWatch might show

```
MongoDB Connection Failed

or

PORT already in use

or

Environment Variable Missing
```

Now fixing the issue becomes easy.

---

# Complete Deployment Guide

Now let's deploy our application from start to finish.

---

# Step 1 - Create IAM User

Open

```
AWS Console

↓

IAM

↓

Users

↓

Create User
```

Attach Policies

```
AmazonEC2ContainerRegistryFullAccess

AmazonECS_FullAccess
```

Generate

* Access Key
* Secret Access Key

---

# Step 2 - Configure AWS CLI

Install AWS CLI.

Verify installation.

```bash
aws --version
```

Configure AWS.

```bash
aws configure
```

Provide

* Access Key
* Secret Key
* Region
* Output Format

Example

```
Region

ap-south-1

Output

json
```

---

# Step 3 - Create ECR Repository

Open

```
Amazon ECR

↓

Create Repository

↓

cohort-demo
```

---

# Step 4 - Login Docker

```bash
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin YOUR_ECR_URL
```

---

# Step 5 - Build Docker Image

```bash
docker buildx build --platform linux/amd64 -t cohort-demo:latest . --load
```

---

# Step 6 - Tag Image

```bash
docker tag cohort-demo:latest YOUR_ECR_URL/cohort-demo:latest
```

---

# Step 7 - Push Image

```bash
docker push YOUR_ECR_URL/cohort-demo:latest
```

Your Docker Image is now available inside Amazon ECR.

---

# Step 8 - Create VPC

Open

```
VPC

↓

Create VPC

↓

VPC and More
```

AWS automatically creates

* VPC
* Public Subnets
* Private Subnets
* Internet Gateway
* Route Tables

---

# Step 9 - Create ECS Cluster

Open

```
Amazon ECS

↓

Clusters

↓

Create Cluster
```

Choose

```
Fargate
```

Name

```
cohort-cluster
```

---

# Step 10 - Create Task Role

Open

```
IAM

↓

Roles

↓

Create Role

↓

Elastic Container Service

↓

Task Execution Role
```

Create

```
cohort-task-role
```

---

# Step 11 - Create Task Definition

Open

```
Task Definition

↓

Create

↓

Fargate
```

Provide

* Task Name
* CPU
* Memory
* Task Role
* Task Execution Role

Container Details

* Image from ECR
* Port 3000
* Environment Variables

Create.

---

# Step 12 - Create ECS Service

Inside Cluster

```
Create Service
```

Select

```
Task Definition

↓

Desired Count

↓

2
```

Networking

Select

* VPC
* Public Subnets

Enable

```
Application Load Balancer
```

Provide

```
ALB Name

Target Group Name
```

Create Service.

---

# Step 13 - Configure Security Group

Open

```
EC2

↓

Security Groups
```

Add inbound rule.

```
Custom TCP

Port

3000

Source

Anywhere
```

This allows users to access your application.

---

# Step 14 - Access Your Application

Option 1

```
ECS

↓

Cluster

↓

Service

↓

Networking

↓

DNS
```

Option 2 (Recommended)

```
EC2

↓

Load Balancers

↓

DNS Name
```

Open the DNS inside your browser.

Your application is now live.

---

# Complete Deployment Flow

```
Node.js Project

↓

Dockerfile

↓

Docker Image

↓

Amazon ECR

↓

Task Definition

↓

ECS Cluster

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

# How ECS Deploys New Versions

Suppose you update your application.

```
Bug Fixed

↓

New Docker Image

↓

Push to ECR
```

Now create a new Task Definition Revision.

```
Task Definition v1

↓

Task Definition v2
```

Update your ECS Service.

ECS will

* Start New Containers
* Wait until Healthy
* Stop Old Containers

Users experience almost zero downtime.

---

# High Availability

Suppose you run

```
Desired Tasks = 2
```

```
ALB

↓

Task 1

Task 2
```

Task 2 crashes.

```
ALB

↓

Task 1

✅

Task 2

❌
```

Target Group removes Task 2.

ECS automatically creates another Task.

```
Task 3

Running
```

Your application stays online.

---

# Summary

Congratulations!

You now understand the complete deployment workflow.

```
Build Docker Image

↓

Push Image to ECR

↓

Create Task Definition

↓

Run Tasks using ECS

↓

Keep Tasks Alive with ECS Service

↓

Register Tasks inside Target Group

↓

Distribute Requests using ALB

↓

Monitor Everything with CloudWatch

↓

Users Access Your Application
```

In the next and final part we'll cover:

* Common Deployment Errors
* Best Practices
* Cost Optimization
* Production Tips
* Interview Questions
* AWS Service Comparison
* Complete Revision Notes
