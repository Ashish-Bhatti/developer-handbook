# ☸️ Kubernetes Quick Notes

A quick reference for deploying applications on Kubernetes, enabling Ingress, monitoring resources, viewing logs, and configuring autoscaling.

---

# 📁 Project Structure

Create a separate folder for all Kubernetes files.

```text
project/
└── k8s/
    ├── deployment.yml
    ├── service.yml
    └── ingress.yml
```

> **VS Code Shortcut:** Use `deployment_simple` to generate a Deployment manifest.

---

# 🚀 Deployment Steps

### 1. Create a Kubernetes Cluster

Enable or create your Kubernetes cluster.

---

### 2. Deploy the Application

```bash
kubectl apply -f deployment.yml
```

---

### 3. Create the Service

```bash
kubectl apply -f service.yml
```

---

### 4. Install NGINX Ingress Controller

**PowerShell**

```powershell
kubectl apply -f `
https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

**Bash**

```bash
kubectl apply -f \
https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

Verify installation:

```bash
kubectl get pods -n ingress-nginx
```

---

### 5. Apply Ingress

```bash
kubectl apply -f ingress.yml
```

---

# 📊 Metrics Server

The Metrics Server collects CPU and Memory usage from Pods and Nodes. It is required for **Horizontal Pod Autoscaler (HPA)**.

Useful commands:

```bash
kubectl top nodes
kubectl top pods
```

---

# 📜 Logs

View Deployment logs:

```bash
kubectl logs deployment/express-deployment --tail=100 -f
```

Useful log commands:

```bash
kubectl logs <pod-name>
kubectl logs -f <pod-name>
kubectl logs --tail=20 <pod-name>
kubectl logs --since=10m <pod-name>
kubectl logs -p <pod-name>
kubectl logs -f -l app=express
```

Show Pod labels:

```bash
kubectl get pods --show-labels
```

---

# 🔥 Load Testing

Install **HEY**:

https://github.com/rakyll/hey

Generate traffic:

```bash
hey -z 2m -c 100 http://localhost
```

---

# 📈 Horizontal Pod Autoscaler (HPA)

Create an autoscaler:

```powershell
kubectl autoscale deployment express-deployment `
    --min=2 `
    --max=10 `
    --cpu=50%
```

This configuration:

* Minimum Pods: **2**
* Maximum Pods: **10**
* Target CPU Usage: **50%**

---

# 👀 Watch Resource Usage

PowerShell:

```powershell
while ($true) {
    Clear-Host
    kubectl top pods
    Start-Sleep -Seconds 5
}
```

Stop monitoring with:

```text
Ctrl + C
```

---

# 📄 Kubernetes Manifest Files

### deployment.yml

Manages Pods and defines:

* Docker Image
* Replicas
* CPU & Memory
* Labels
* Container Port

---

### service.yml

Provides a stable endpoint for Pods.

* Finds Pods using Label Selectors
* Load balances requests
* Hides changing Pod IPs

---

### ingress.yml

Defines HTTP/HTTPS routing rules.

> **Note:** It only contains rules. An **Ingress Controller** is required to process them.

---

# 🏗️ Request Flow

```text
User
   │
   ▼
Ingress
   │
   ▼
Ingress Controller
   │
   ▼
Service
   │
   ▼
Deployment
   │
   ▼
Pods
```

---

# 🗑️ Useful Commands

Delete Deployment:

```bash
kubectl delete deployment express-deployment
```

Delete Pods using labels:

```bash
kubectl delete pod -l app=express
```
