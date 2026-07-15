# 🏗️ Microservice Architecture

> A comprehensive guide to understanding Monolithic Architecture, Microservices, Distributed Systems, Synchronous & Asynchronous Communication, and the core concepts behind modern backend applications.

---

# Table of Contents

* [What is Software Architecture?](#what-is-software-architecture)
* [Monolithic Architecture](#monolithic-architecture)
* [Microservice Architecture](#microservice-architecture)
* [Distributed Monolith](#distributed-monolith)
* [Monolith vs Microservices](#monolith-vs-microservices)
* [What is a Distributed System?](#what-is-a-distributed-system)
* [Communication Between Services](#communication-between-services)
* [Synchronous Communication](#synchronous-communication)
* [Asynchronous Communication](#asynchronous-communication)
* [Key Concepts of Microservices](#key-concepts-of-microservices)
* [Advantages](#advantages)
* [Disadvantages](#disadvantages)
* [When Should You Use Microservices?](#when-should-you-use-microservices)
* [Common Technologies](#common-technologies)
* [Interview Questions](#interview-questions)
* [Summary](#summary)

---

# What is Software Architecture?

Software architecture is the **high-level structure** of an application. It defines:

* How components are organized
* How they communicate
* How data flows
* How the application scales
* How failures are handled

Think of architecture as the **blueprint of a building**.

---

# Monolithic Architecture

A **Monolithic Application** is an application where every feature exists inside a **single codebase** and is deployed as one application.

Example:

```text
E-commerce Application

├── Authentication
├── Products
├── Cart
├── Orders
├── Payments
├── Admin
└── Notifications
```

Everything runs inside one server.

## How It Works

```text
            Client
               │
               ▼
      ┌─────────────────┐
      │  Monolith App   │
      │                 │
      │ Auth            │
      │ Products        │
      │ Cart            │
      │ Orders          │
      │ Payments        │
      └─────────────────┘
               │
               ▼
           Database
```

---

## Advantages

* Easy to build
* Easy to deploy
* Easy debugging
* Simple local development
* Less infrastructure

---

## Disadvantages

* Entire application must be deployed together
* Scaling one feature means scaling everything
* Large codebase becomes difficult to maintain
* Small bugs can affect the entire application
* Slower development as the team grows

---

# Microservice Architecture

Microservices divide a large application into **multiple small independent services**.

Each service:

* Has its own responsibility
* Has its own codebase
* Can be deployed independently
* Can be scaled independently

Example:

```text
Authentication Service

Product Service

Order Service

Payment Service

Notification Service
```

Each service behaves like its own application.

---

## Architecture

```text
                Client
                   │
                   ▼
             API Gateway
                   │
 ┌───────────┬─────────────┬────────────┐
 ▼           ▼             ▼            ▼
Auth      Product       Order      Payment
Service    Service      Service     Service
 │            │             │            │
 ▼            ▼             ▼            ▼
 DB          DB            DB           DB
```

Every service owns its own database.

---

# Distributed Monolith

A **Distributed Monolith** is an architecture that sits between a traditional monolith and a true microservice architecture.

Instead of running the entire application as a single process, the application is split into multiple services or applications. However, **all of these services share the same database**, making them tightly coupled.

It provides better separation of code and allows teams to split responsibilities, but it does not offer the full independence of microservices.

---

## Architecture

```text
                Client
                   │
                   ▼
             API Gateway
                   │
     ┌─────────┬─────────┬─────────┐
     ▼         ▼         ▼
 Auth Service Product   Order
              Service   Service
     │         │         │
     └─────────┴─────────┘
              │
              ▼
        Shared Database
```

---

## Characteristics

- Multiple independent services
- Separate codebases (optional)
- Separate deployments (possible)
- Shared database
- Services communicate over the network
- Better modularity than a monolith
- Tightly coupled because of the shared database

---

## Advantages

- Easier to split a large application
- Better separation of business domains
- Teams can work on different services
- Can scale services independently to some extent
- Good stepping stone toward microservices

---

## Disadvantages

- Shared database creates tight coupling
- Database schema changes can affect multiple services
- Difficult to maintain service independence
- Hard to adopt different databases for different services
- Not considered a true microservice architecture

---

## When Should You Use It?

A distributed monolith is often used when:

- A monolithic application has become too large
- Teams want to separate responsibilities
- The organization is gradually migrating toward microservices
- A complete migration is too costly or risky

Many companies adopt a **Distributed Monolith** as an intermediate step before moving to a fully decoupled microservice architecture.

---

# Monolith vs Microservices

| Feature           | Monolith            | Microservices      |
| ----------------- | ------------------- | ------------------ |
| Deployment        | Single              | Independent        |
| Scaling           | Whole Application   | Individual Service |
| Database          | Shared              | Per Service        |
| Development       | Easier              | More Complex       |
| Team Size         | Small               | Medium/Large       |
| Failure Isolation | Poor                | Better             |
| Maintenance       | Difficult over time | Easier             |

---

# What is a Distributed System?

A **Distributed System** is a system where multiple computers work together to behave like a single application.

Instead of one large server:

```text
One Computer

Runs Everything
```

You have

```text
Computer A

Authentication


Computer B

Products


Computer C

Orders


Computer D

Payments
```

Users don't notice the difference.

Microservices are usually distributed systems.

---

# Communication Between Services

Since services are separate applications, they need a way to communicate.

Two primary approaches exist.

* Synchronous Communication
* Asynchronous Communication

---

# Synchronous Communication

In synchronous communication, one service **waits** for another service to respond.

Example:

```text
Client

   │

Order Service

   │

Payment Service

   │

Response

   │

Order Service

   │

Client
```

The Order Service cannot continue until Payment Service replies.

Common protocols:

* HTTP
* REST APIs
* GraphQL
* gRPC

### Advantages

* Easy to understand
* Immediate response
* Simple implementation

### Disadvantages

* Tight coupling
* Slower overall response
* One slow service delays others
* Failures can cascade

---

# Asynchronous Communication

In asynchronous communication, services do **not wait** for each other.

Instead they communicate through a **Message Broker**.

Example:

```text
Order Service

      │

Publishes Event

      │

Message Broker

      │

───────────────
│      │      │
▼      ▼      ▼

Payment Notification Inventory
Service   Service     Service
```

Order Service finishes immediately.

Other services process the event later.

Common message brokers:

* RabbitMQ
* Apache Kafka
* Redis Streams
* Amazon SQS

---

## Advantages

* Better scalability
* Faster response
* Loose coupling
* Better fault tolerance

---

## Disadvantages

* Harder debugging
* Eventual consistency
* Retry mechanisms required
* Duplicate message handling

---

# Key Concepts of Microservices

## 1. Single Responsibility

Each service should perform one business function.

Example:

* User Service
* Order Service
* Product Service

---

## 2. Independent Deployment

Deploy one service without affecting others.

---

## 3. Independent Database

Avoid sharing databases.

Instead of:

```text
One Database
```

Prefer:

```text
Order Service
      │
 Order Database

Product Service
      │
Product Database
```

---

## 4. API Gateway

Acts as a single entry point.

Responsibilities:

* Authentication
* Routing
* Rate limiting
* Load balancing
* Logging

---

## 5. Service Discovery

Services need to discover each other's addresses.

Popular tools:

* Consul
* Eureka
* Kubernetes DNS

---

## 6. Load Balancer

Distributes requests across multiple service instances.

```text
        Client

          │

     Load Balancer

    ┌────┼────┐
    ▼    ▼    ▼

 Service Service Service
    1      2      3
```

---

## 7. Fault Tolerance

If one service fails, the application should continue working whenever possible.

Techniques:

* Retry
* Circuit Breaker
* Timeout
* Fallback

---

## 8. Event-Driven Architecture

Instead of calling services directly:

```text
User Registered

↓

Publish Event

↓

Email Service

Analytics

Notification

Recommendation
```

---

## 9. Scalability

Scale only the service experiencing heavy traffic.

Instead of:

```text
Scale Entire Application
```

Scale only:

```text
Product Service
```

---

## 10. Observability

Since requests travel across multiple services, monitoring becomes essential.

Includes:

* Logging
* Metrics
* Distributed Tracing

Popular tools:

* Prometheus
* Grafana
* Jaeger
* OpenTelemetry

---

# Advantages

* Independent deployment
* Better scalability
* Technology flexibility
* Easier maintenance
* Smaller codebases
* Better fault isolation
* Faster development for large teams

---

# Disadvantages

* Higher infrastructure cost
* Increased operational complexity
* Distributed debugging
* Network latency
* Data consistency challenges
* Complex testing
* Requires DevOps knowledge

---

# When Should You Use Microservices?

Choose **Monolith** when:

* Building an MVP
* Small team
* Simple application
* Startup stage

Choose **Microservices** when:

* Large engineering team
* Millions of users
* Independent deployments
* Different scaling requirements
* Multiple business domains

> **Tip:** Many successful companies (including Amazon, Netflix, Uber, and Spotify) started with a monolith and gradually evolved into microservices as their systems and teams grew.

---

# Common Technologies

## API Communication

* REST API
* GraphQL
* gRPC

## Message Brokers

* RabbitMQ
* Apache Kafka
* Redis Streams
* Amazon SQS

## API Gateway

* NGINX
* Kong
* Traefik

## Containerization

* Docker
* Docker Compose
* Kubernetes

## Monitoring

* Prometheus
* Grafana
* Jaeger
* OpenTelemetry

---

# Interview Questions

### What is the difference between a Monolith and Microservices?

A monolith is a single deployable application, whereas microservices split the application into independent services that can be developed, deployed, and scaled separately.

---

### What is a Distributed System?

A distributed system consists of multiple independent computers or services working together as one unified application.

---

### What is synchronous communication?

The caller waits for the receiver to process the request and return a response before continuing.

---

### What is asynchronous communication?

The caller sends a message or event and continues processing without waiting. Other services consume and process the message later.

---

### Why does each microservice have its own database?

To reduce coupling, maintain service independence, and allow each service to evolve without affecting others.

---

### What is an API Gateway?

An API Gateway is the single entry point for client requests. It routes traffic to the appropriate services while handling concerns like authentication, logging, and rate limiting.

---

### Why are message brokers used?

They enable asynchronous communication, improve reliability, decouple services, and support event-driven architectures.

---

# Summary

Microservices are **not just about splitting an application into smaller services**. They are a way of designing systems that can evolve, scale, and be maintained independently.

While they provide flexibility and scalability, they also introduce challenges such as distributed communication, monitoring, and data consistency. For many projects, starting with a well-structured monolith and transitioning to microservices only when necessary is the most practical approach.

> **Remember:** *Use microservices because your system needs them—not because they are popular.*
