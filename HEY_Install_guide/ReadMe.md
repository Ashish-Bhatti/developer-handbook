# 🚀 HEY - HTTP Load Testing Tool

`hey` is a lightweight HTTP load generator used to benchmark APIs and web applications.

It's commonly used to:

- Test REST APIs
- Benchmark application performance
- Generate concurrent traffic
- Test Docker containers
- Test Kubernetes Deployments & Services
- Trigger Horizontal Pod Autoscaler (HPA)

---

# 📖 Table of Contents

1. Installation
2. Verify Installation
3. Basic Usage
4. Common Examples
5. Kubernetes Example
6. Understanding the Output
7. Useful Options
8. Why Use HEY?

---

# Installation (Windows)

## Step 1 - Download HEY

Download the latest Windows binary from the official GitHub repository:

https://github.com/rakyll/hey

Move the executable to a folder where you'll keep your CLI tools.

Example:

```text
C:\Users\<YourUsername>\Tools\
```

Rename it to:

```text
hey.exe
```

Example:

```text
C:\Users\Ashu\Tools\
└── hey.exe
```

---

## Step 2 - Add the Folder to PATH

Open PowerShell and run:

```powershell
[Environment]::SetEnvironmentVariable(
    "Path",
    $env:Path + ";C:\Users\Ashu\Tools",
    "User"
)
```

> Replace the path with your own folder if necessary.

---

## Step 3 - Restart PowerShell

Close all PowerShell windows and open a new one.

---

## Step 4 - Verify Installation

Locate the executable:

```powershell
where.exe hey
```

Example:

```text
C:\Users\Ashu\Tools\hey.exe
```

Run:

```powershell
hey
```

Expected output:

```text
Usage: hey [options...] <url>
```

🎉 HEY is now installed successfully.

---

# Basic Usage

## Send 100 Requests

```bash
hey -n 100 http://localhost
```

---

## Send 1000 Requests

```bash
hey -n 1000 http://localhost
```

---

## Send 1000 Requests with 100 Concurrent Users

```bash
hey -n 1000 -c 100 http://localhost
```

---

## Generate Traffic for 30 Seconds

```bash
hey -z 30s http://localhost
```

---

## Generate Traffic for 2 Minutes

```bash
hey -z 2m http://localhost
```

---

## Generate Traffic for 2 Minutes with 50 Concurrent Users

```bash
hey -z 2m -c 50 http://localhost
```

---

## Send a POST Request

```powershell
hey -m POST `
    -d "{\"name\":\"Ashu\"}" `
    -T "application/json" `
    http://localhost/api/users
```

---

# Kubernetes Example

Generate heavy traffic:

```bash
hey -z 2m -c 100 http://localhost
```

Watch Pod resource usage:

```powershell
while ($true) {
    Clear-Host
    kubectl top pods
    Start-Sleep -Seconds 5
}
```

Watch Node resource usage:

```powershell
while ($true) {
    Clear-Host
    kubectl top nodes
    Start-Sleep -Seconds 5
}
```

If Horizontal Pod Autoscaler (HPA) is configured, you should see new Pods being created automatically as CPU usage increases.

---

# Understanding the Output

Example:

```text
Summary:
  Total:        30.0154 secs
  Slowest:      0.2215 secs
  Fastest:      0.0041 secs
  Average:      0.0283 secs
  Requests/sec: 352.47
```

Meaning:

| Metric | Description |
|---------|-------------|
| Total | Total duration of the test |
| Slowest | Slowest response time |
| Fastest | Fastest response time |
| Average | Average response time |
| Requests/sec | Number of requests processed every second |

---

# Useful Options

| Option | Description |
|----------|-------------|
| `-n` | Total number of requests |
| `-c` | Concurrent users (workers) |
| `-z` | Run for a specific duration |
| `-m` | HTTP method |
| `-d` | Request body |
| `-T` | Content-Type header |
| `-H` | Add custom headers |

---

# Why Use HEY?

- ✅ Lightweight and fast
- ✅ Easy to install
- ✅ Benchmark REST APIs
- ✅ Stress test web applications
- ✅ Test Docker containers
- ✅ Observe Kubernetes Autoscaling
- ✅ Measure application performance under concurrent traffic

---

# Official Repository

https://github.com/rakyll/hey