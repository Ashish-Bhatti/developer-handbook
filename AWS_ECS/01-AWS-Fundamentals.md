# ☁️ AWS (Amazon Web Services)

> A beginner-friendly guide to understanding AWS and deploying Dockerized applications using **Docker Compose, ECR, ECS, IAM, VPC, Application Load Balancer, Security Groups, and CloudWatch**.

This guide explains not only **how** to deploy an application on AWS but also **why** each AWS service exists and how they work together.

---

# Table of Contents

- Introduction
- What is Cloud Computing?
- Why AWS?
- AWS Deployment Workflow
- Core AWS Services
- IAM
- VPC
- Security Groups
- ECR
- ECS
- Task Definition
- Task Role
- Task Execution Role
- ECS Service
- Target Group
- Application Load Balancer
- CloudWatch
- Deploying Docker Compose Applications
- Complete Deployment Guide
- Common Errors
- Interview Questions
- Best Practices

---

# What is Cloud Computing?

Cloud Computing means **renting computing resources over the internet instead of buying physical hardware.**

Instead of purchasing your own servers, networking equipment, storage devices, and maintaining them yourself, companies rent these resources from cloud providers like AWS.

Think of AWS as a company that owns millions of servers across the world. You simply rent the resources you need and pay only for what you use.

---

## Traditional Deployment

```
Your Application

↓

Your Own Server

↓

Your Own Network

↓

Your Responsibility
```

You are responsible for:

- Buying hardware
- Maintaining servers
- Replacing failed hardware
- Network configuration
- Security
- Scaling

---

## Cloud Deployment

```
Your Application

↓

AWS Cloud

↓

AWS manages infrastructure
```

You only focus on your application.

AWS handles:

- Physical servers
- Networking
- Hardware failures
- Power
- Cooling
- Data Centers

---

# Why AWS?

AWS is currently one of the world's largest cloud providers.

It provides hundreds of managed services that help developers build scalable and reliable applications without managing physical infrastructure.

Some of its advantages include:

- Pay only for what you use
- Highly scalable
- Highly available
- Secure
- Global infrastructure
- Easy deployment
- Managed services

---

# AWS Deployment Journey

When deploying our Dockerized application, we don't directly upload our source code.

Instead, the deployment pipeline looks like this.

```
Write Code

↓

Docker Compose

↓

Docker Image

↓

Amazon ECR

↓

Amazon ECS

↓

Application Load Balancer

↓

Internet Users
```

Every AWS service in this pipeline has a specific responsibility.

---

# How Everything Works Together

```
                    Internet
                        │
                        ▼
            Application Load Balancer
                        │
                 Target Group
                        │
        ┌───────────────┴───────────────┐
        ▼                               ▼
   ECS Task                       ECS Task
(Container Running)          (Container Running)
        │                               │
        └──────────────┬────────────────┘
                       │
                  Docker Image
                      (ECR)

------------------------------------------------

Infrastructure

VPC
│
├── Public Subnet
├── Security Group
└── Internet Gateway

------------------------------------------------

Permissions

IAM User

↓

AWS CLI

↓

ECR / ECS

------------------------------------------------

Monitoring

CloudWatch
```

Every request follows this flow:

```
User

↓

ALB

↓

Target Group

↓

ECS Task

↓

Your Application
```

---

# Core AWS Services

| Service | Purpose |
|----------|----------|
| IAM | Authentication & Permissions |
| VPC | Private Network |
| Security Group | Firewall |
| ECR | Stores Docker Images |
| ECS | Runs Docker Containers |
| Task Definition | Blueprint of a Container |
| ECS Service | Keeps Containers Running |
| Target Group | Maintains Healthy Containers |
| ALB | Distributes Traffic |
| CloudWatch | Logs & Monitoring |

---

# IAM (Identity and Access Management)

## What is IAM?

IAM is the service responsible for controlling **who can access AWS resources and what they are allowed to do.**

Imagine AWS as a company building.

Not everyone should have access to every room.

IAM allows you to create different users with different permissions.

For example:

- Developer
- Tester
- DevOps Engineer
- Administrator

Each user receives only the permissions they need.

---

## Why Do We Need IAM?

Suppose you're using the AWS Root Account.

The Root Account can:

- Delete the AWS account
- Delete every server
- Delete databases
- Access billing
- Change security settings

Giving everyone root access is dangerous.

Instead, we create IAM Users.

Example:

```
Developer

↓

IAM User

↓

Only ECS + ECR Access
```

Now the developer cannot accidentally modify unrelated AWS resources.

---

## IAM User

An IAM User represents a real person.

It is generally used by developers or CI/CD systems.

Example:

```
Ashish

↓

IAM User

↓

AWS CLI
```

The AWS CLI uses the Access Key and Secret Key generated for the IAM User.

---

## IAM Role

IAM Roles are different.

They are **not assigned to people.**

They are assigned to AWS Services.

Example:

```
ECS Task

↓

IAM Role

↓

Access S3
```

Instead of storing AWS credentials inside your application, AWS automatically provides temporary credentials through IAM Roles.

This is much more secure.

---

## Access Key vs Secret Key

When configuring AWS CLI you'll receive:

```
Access Key

Secret Access Key
```

Think of them like:

```
Username

Password
```

Never commit these credentials to GitHub.

Always store them securely.

---

# VPC (Virtual Private Cloud)

## What is VPC?

A VPC is your **private network inside AWS.**

Every server, container, or database you create lives inside a VPC.

Think of it as your own private office inside AWS's huge building.

No one can directly access it unless you explicitly allow them.

---

## Why Do We Need VPC?

Without a VPC:

```
Internet

↓

Everyone can reach your server
```

With a VPC:

```
Internet

↓

Firewall

↓

Private Network

↓

Your Resources
```

Everything is isolated.

---

## VPC Components

A VPC usually contains:

- Public Subnets
- Private Subnets
- Route Tables
- Internet Gateway
- Security Groups

AWS can automatically create these resources using **VPC and More**.

---

## Public vs Private Subnet

### Public Subnet

Accessible from the internet.

Usually contains:

- Load Balancers
- Web Servers

---

### Private Subnet

Not accessible from the internet.

Usually contains:

- Databases
- Internal Services

---

Example:

```
VPC

│

├── Public Subnet

│      ALB

│      ECS

│

└── Private Subnet

       Database
```

---

# Security Group

## What is a Security Group?

A Security Group is a **virtual firewall**.

It controls which traffic is allowed to enter or leave your AWS resources.

Example:

```
Internet

↓

Security Group

↓

ECS Task
```

---

## Why Do We Need Security Groups?

Imagine someone tries to access your server.

Without Security Groups:

```
Everyone

↓

Server
```

With Security Groups:

```
Everyone

↓

Security Group

↓

Allowed Ports Only
```

---

## Example Rules

Allow:

- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 3000 (Express)

Block:

Everything else

---

## Common Example

During our deployment we allowed:

```
Custom TCP

Port

3000

Source

Anywhere
```

This allowed internet users to access our Express server.

Later in production we should restrict unnecessary ports.

---

# Summary

By now you should understand:

- What Cloud Computing is
- Why AWS exists
- How applications are deployed
- What IAM does
- Why VPC is important
- Why Security Groups are required

In the next section we'll learn about the services that actually run our Docker containers:

- Amazon ECR
- Amazon ECS
- Task Definitions
- Task Roles
- ECS Services