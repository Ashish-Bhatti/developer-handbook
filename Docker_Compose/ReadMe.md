# 🚀 MERN Docker Development Environment

A Dockerized MERN development setup that provides a consistent development environment across different operating systems without requiring Node.js or project dependencies to be installed locally.

---

# 📚 Table of Contents

* [Why Docker?](#-why-docker)
* [Why Docker Compose?](#-why-docker-compose)
* [Project Structure](#-project-structure)
* [Prerequisites](#-prerequisites)
* [How to Run the Project](#-how-to-run-the-project)
* [Docker Concepts Used](#-docker-concepts-used)
* [Dockerfile Explained](#-dockerfile-explained)
* [Docker Compose Explained](#-docker-compose-explained)
* [Development Workflow](#-development-workflow)
* [Images vs Containers vs Volumes](#-images-vs-containers-vs-volumes)
* [Bind Mount vs Named Volume](#-bind-mount-vs-named-volume)
* [Docker Commands Cheat Sheet](#-docker-commands-cheat-sheet)
* [When to Rebuild / Restart / Remove Volumes](#-when-to-rebuild--restart--remove-volumes)
* [Common Errors & Fixes](#-common-errors--fixes)
* [Useful Docker Commands](#-useful-docker-commands)

---

# 🐳 Why Docker?

Docker packages an application together with its runtime environment.

Instead of saying:

* Install Node.js
* Install npm
* Install MongoDB
* Install Redis
* Install project dependencies

we simply run:

```bash
docker compose up
```

Every developer gets exactly the same environment.

This eliminates the famous problem:

> "It works on my machine."

---

## Without Docker

Developer A

```
Windows
Node 22
```

Developer B

```
MacOS
Node 18
```

Developer C

```
Ubuntu
Node 20
```

Different operating systems.

Different Node versions.

Different npm versions.

Different bugs.

---

## With Docker

Everyone runs

```
Node 20
Alpine Linux
Same npm version
Same dependencies
Same environment
```

regardless of their local machine.

---

# 📦 Why Docker Compose?

Docker Compose allows us to manage multiple containers with one command.

Instead of starting everything manually:

```
Backend
Frontend
Database
Redis
```

we simply run:

```bash
docker compose up
```

Compose automatically:

* Builds images
* Creates containers
* Creates networks
* Creates volumes
* Starts every service

---

# 📁 Project Structure

```
Project
│
├── Backend
│   ├── Dockerfile
│   └── ...
│
├── Frontend
│   ├── Dockerfile
│   └── ...
│
├── docker-compose.yml
└── README.md
```

---

# 💻 Prerequisites

Install:

* Docker Desktop

That's it.

Node.js is **not required** to run this project because Docker provides Node inside the container.

---

# 🚀 How to Run the Project

Build images and start all services

```bash
docker compose up --build
```

Run in detached mode

```bash
docker compose up -d
```

Stop containers

```bash
docker compose down
```

Stop containers and remove volumes

```bash
docker compose down -v
```

---

# 🧠 Docker Concepts Used

This project uses

* Docker Images
* Docker Containers
* Docker Volumes
* Bind Mounts
* Named Volumes
* Docker Compose
* Port Mapping

---

# 📄 Dockerfile Explained

Example

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","run","dev"]
```

---

## FROM

```dockerfile
FROM node:20-alpine
```

Starts from an official Node 20 image running Alpine Linux.

---

## WORKDIR

```dockerfile
WORKDIR /app
```

Creates `/app` if it doesn't exist.

Every command after this runs inside `/app`.

Example

```dockerfile
COPY . .
```

actually means

```
COPY . /app
```

---

## COPY package*.json

Copies

```
package.json
package-lock.json
```

first.

This allows Docker to cache `npm install`.

---

## RUN npm install

Installs dependencies inside the image.

---

## COPY . .

Copies the remaining project files.

---

## CMD

Runs when the container starts.

Example

```dockerfile
CMD ["node","server.js"]
```

---

# 📄 Docker Compose Explained

Example

```yaml
services:

  backend:

    build: ./Backend

    ports:
      - "8080:3000"

    volumes:
      - ./Backend:/app
      - backend_node_modules:/app/node_modules

    command: npx nodemon -L server.js
```

---

## build

Builds an image using

```
Backend/Dockerfile
```

---

## ports

```
HOST_PORT : CONTAINER_PORT
```

Example

```
8080:3000
```

Browser

```
localhost:8080
```

Container

```
3000
```

---

## volumes

Two types are used.

### Bind Mount

```
./Backend:/app
```

Synchronizes source code.

Changing

```
server.js
```

updates immediately inside the container.

---

### Named Volume

```
backend_node_modules:/app/node_modules
```

Stores Linux node_modules separately.

Prevents Windows node_modules from replacing Linux node_modules.

---

## command

Overrides Dockerfile CMD.

Example

```
npx nodemon -L server.js
```

---

# 🖼 Images vs Containers vs Volumes

## Image

Blueprint.

Read-only.

Immutable.

Built using

```bash
docker build
```

---

## Container

Running instance of an image.

Can start

Stop

Restart

Delete

without affecting the image.

---

## Volume

Persistent storage.

Data survives even after containers are removed.

---

# 📂 Bind Mount vs Named Volume

## Bind Mount

```
Host PC
│
└── Backend
      │
      ▼
Container
/app
```

Purpose

* Live code changes
* Hot reload
* Nodemon
* Vite

---

## Named Volume

```
Docker
│
└── backend_node_modules
         │
         ▼
Container
/app/node_modules
```

Purpose

Store dependencies separately.

---

# 🔄 Development Workflow

## Backend

```
Edit file

↓

Bind Mount updates container

↓

Nodemon restarts server
```

---

## Frontend

```
Edit React component

↓

Bind Mount updates container

↓

Vite Hot Module Reload
```

---

# 🔨 Images and Build Cache

Docker builds layer by layer.

```
FROM

↓

WORKDIR

↓

COPY package.json

↓

RUN npm install

↓

COPY source code
```

If only

```
server.js
```

changes,

Docker reuses cached layers and rebuilds only the last layers.

Images are immutable.

Docker creates a **new image** and reuses cached layers where possible.

---

# 🔄 When to Rebuild / Restart / Remove Volumes

## Only source code changed

Examples

```
server.js

App.jsx

routes/

controllers/
```

✅ Nothing

Hot reload handles it.

---

## package.json changed

Examples

```
npm install dotenv

npm install axios
```

Run

```bash
docker compose up --build
```

If dependencies still don't update

```bash
docker compose down -v

docker compose up --build
```

because the existing `node_modules` volume may still contain the old dependencies.

---

## Dockerfile changed

Run

```bash
docker compose up --build
```

---

## docker-compose.yml command changed

Restart

```bash
docker compose restart
```

---

## Port mapping changed

Recreate containers

```bash
docker compose down

docker compose up
```

---

# 🛠 Docker Commands Cheat Sheet

Build image

```bash
docker build -t image-name .
```

Build and start project

```bash
docker compose up --build
```

Start

```bash
docker compose up
```

Detached mode

```bash
docker compose up -d
```

Stop

```bash
docker compose down
```

Stop and remove volumes

```bash
docker compose down -v
```

Restart service

```bash
docker compose restart backend
```

View logs

```bash
docker compose logs
```

Follow logs

```bash
docker compose logs -f
```

List containers

```bash
docker ps
```

List all containers

```bash
docker ps -a
```

List images

```bash
docker images
```

Remove container

```bash
docker rm -f container-name
```

Remove image

```bash
docker rmi image-name
```

Enter container

```bash
docker exec -it container-name sh
```

---

# ❌ Common Errors & Fixes

## Port already in use

```
bind: Only one usage of each socket address...
```

Cause

Port already occupied.

Fix

* Stop the process using that port
* Or change the host port

---

## Frontend not accessible

Cause

Vite not listening outside the container.

Fix

```json
"dev": "vite --host"
```

---

## API proxy not working

Use

```
http://backend:3000
```

instead of

```
localhost
```

or

```
8080
```

Containers communicate using:

```
service-name:container-port
```

---

## New package not found

Example

```
dotenv
axios
```

Cause

Old node_modules volume.

Fix

```bash
docker compose down -v

docker compose up --build
```

---

## Hot Reload not working

Check

* Bind mount exists
* Vite running with `--host`
* Nodemon running
* Volume mounted correctly

---

# 💡 Best Practices

✅ Copy package.json before source code

```
COPY package*.json ./

RUN npm install

COPY . .
```

This maximizes Docker cache usage.

---

✅ Use bind mounts for source code.

---

✅ Use named volumes for node_modules.

---

✅ Use Docker Compose for multi-container projects.

---

✅ Never commit `.env` files.

---

# 🎯 Key Takeaways

* Docker images are immutable.
* Containers are running instances of images.
* Docker rebuilds create new images instead of modifying old ones.
* Bind mounts synchronize source code.
* Named volumes persist data and dependencies.
* Containers communicate using **service-name:container-port**.
* `docker compose up --build` rebuilds images when needed.
* `docker compose down -v` removes containers and named volumes.
* Docker provides a consistent environment across all developers.

---

# 📖 Learning Outcome

After completing this setup, you should understand:

* Docker fundamentals
* Docker images
* Docker containers
* Docker volumes
* Bind mounts
* Named volumes
* Docker Compose
* Docker build cache
* Image immutability
* Port mapping
* Container networking
* Hot reloading with Docker
* Common Docker debugging techniques

Happy Coding! 🚀
