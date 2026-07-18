# ☸️ Part 3 - Monitoring, Logging & Autoscaling

Deploying an application is only the beginning. In a production environment, you also need to monitor resource usage, inspect logs, simulate traffic, and automatically scale your application as demand increases.

In this chapter, you'll learn how to:

- Install the Metrics Server
- Monitor CPU & Memory usage
- View logs from Pods and Deployments
- Perform load testing using HEY
- Configure Horizontal Pod Autoscaler (HPA)
- Watch Pods scale in real time

---

# 📖 Table of Contents

1. Why Monitoring Matters
2. Installing the Metrics Server
3. Verify Metrics Server
4. Monitor CPU & Memory Usage
5. Viewing Application Logs
6. Watching Logs from Multiple Pods
7. Load Testing with HEY
8. Horizontal Pod Autoscaler (HPA)
9. Watching Pods Scale
10. Summary

---

# Why Monitoring Matters

Running an application isn't enough.

You should always know:

- Is the application healthy?
- How much CPU is it using?
- How much Memory is it consuming?
- Are Pods crashing?
- Should Kubernetes create more Pods?

Kubernetes provides tools to answer all these questions.

---

# Install the Metrics Server

The Metrics Server collects CPU and Memory usage from Nodes and Pods.

Without it, Kubernetes cannot:

- Display CPU usage
- Display Memory usage
- Perform Horizontal Pod Autoscaling (HPA)

> **Note:** Docker Desktop Kubernetes does not include the Metrics Server by default.

---

## PowerShell (Windows)

```powershell
# Install Metrics Server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Patch for Docker Desktop
$patch = @'
[
  {
    "op":"add",
    "path":"/spec/template/spec/containers/0/args/-",
    "value":"--kubelet-insecure-tls"
  }
]
'@

kubectl patch deployment metrics-server `
-n kube-system `
--type=json `
--patch $patch

# Wait until deployment is ready
kubectl rollout status deployment/metrics-server -n kube-system
```

---

## Bash (Linux/macOS/Git Bash)

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl patch deployment metrics-server -n kube-system \
--type=json \
-p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

kubectl rollout status deployment/metrics-server -n kube-system
```

---

# Verify Installation

Check Node usage:

```bash
kubectl top nodes
```

Check Pod usage:

```bash
kubectl top pods
```

Example:

```text
NAME                     CPU(cores)   MEMORY(bytes)

express-6d7f9d8c5f      15m          62Mi
express-6d7f9d8c5g      18m          60Mi
```

---

# Monitor CPU & Memory Usage

The following command displays real-time resource usage for every Pod.

```bash
kubectl top pods
```

To view Node resource usage:

```bash
kubectl top nodes
```

These metrics are used by the Horizontal Pod Autoscaler.

---

# Viewing Application Logs

Logs help you debug applications running inside Pods.

## View logs from a Deployment

Instead of finding Pod names manually, Kubernetes lets you view logs directly from a Deployment.

```powershell
kubectl logs deployment/express-deployment --tail=100 -f
```

### What this command does

- `deployment/express-deployment` → Selects Pods managed by the Deployment
- `--tail=100` → Displays the last 100 log lines
- `-f` → Streams new logs in real time

Example:

```text
GET / 200 3.45 ms
GET /users 200 8.12 ms
GET /health 200 1.02 ms
```

If you're using Morgan in your Express application, all HTTP request logs automatically appear here because Kubernetes captures everything written to `stdout` and `stderr`.

---

# Viewing Logs from Individual Pods

View logs:

```bash
kubectl logs <pod-name>
```

Stream logs:

```bash
kubectl logs -f <pod-name>
```

Last 20 lines:

```bash
kubectl logs --tail=20 <pod-name>
```

Logs from the last 10 minutes:

```bash
kubectl logs --since=10m <pod-name>
```

Previous container logs (after a restart):

```bash
kubectl logs -p <pod-name>
```

---

# Viewing Logs from Multiple Pods

First, check Pod labels:

```bash
kubectl get pods --show-labels
```

View logs using a label selector:

```bash
kubectl logs -l app=express
```

Stream logs from every matching Pod:

```bash
kubectl logs -f -l app=express
```

This is especially useful after autoscaling because multiple Pods may be handling requests simultaneously.

---

# Load Testing with HEY

To test autoscaling, generate traffic using **HEY**.

Install HEY:

https://github.com/rakyll/hey

Example:

```bash
hey -z 2m -c 100 http://localhost
```

### Command Explanation

- `-z 2m` → Run the test for 2 minutes
- `-c 100` → Simulate 100 concurrent users

This increases CPU usage and allows you to observe Kubernetes automatically creating additional Pods.

---

# Horizontal Pod Autoscaler (HPA)

The Horizontal Pod Autoscaler automatically increases or decreases the number of Pods based on CPU usage.

Create an HPA:

```powershell
kubectl autoscale deployment express-deployment `
--min=2 `
--max=10 `
--cpu=50%
```

This configuration means:

- Minimum Pods: **2**
- Maximum Pods: **10**
- Target CPU Utilization: **50%**

If average CPU usage rises above 50%, Kubernetes creates additional Pods.

If CPU usage decreases, Kubernetes removes unnecessary Pods.

---

# Watching Pods Scale

Open another terminal and run:

```bash
kubectl get pods -w
```

As traffic increases, you'll see new Pods being created automatically.

You can also monitor resource usage continuously.

### PowerShell

```powershell
while ($true) {
    Clear-Host
    kubectl top pods
    Start-Sleep -Seconds 5
}
```

Stop monitoring using:

```text
Ctrl + C
```

---

# Complete Autoscaling Flow

```text
User Traffic
      │
      ▼
Application
      │
      ▼
High CPU Usage
      │
      ▼
Metrics Server
      │
      ▼
Horizontal Pod Autoscaler
      │
      ▼
Deployment
      │
      ▼
Create More Pods
```

---

# Summary

In this chapter, you learned how to:

- Install the Metrics Server
- Monitor CPU & Memory usage
- View application logs
- Stream logs from Deployments and Pods
- Monitor multiple Pods using label selectors
- Perform load testing with HEY
- Configure Horizontal Pod Autoscaler (HPA)
- Watch Pods scale in real time

In the next chapter, we'll cover Kubernetes commands, troubleshooting, best practices, and interview questions.