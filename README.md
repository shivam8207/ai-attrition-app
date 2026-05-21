# AI Attrition Prediction System

AI-powered employee attrition prediction application deployed using a complete GitOps workflow on Google Cloud Platform (GCP).

---

# Project Overview

The AI Attrition Prediction System is a web-based application designed to predict whether an employee or candidate is likely to leave an organization based on HR and performance-related parameters.

The application analyzes:

- Employee experience
- Salary increment history
- Promotion details
- Performance feedback
- Previous organization history

to predict employee attrition probability.

This project also demonstrates a complete End-to-End GitOps Deployment Pipeline using:

- GitLab CI/CD
- Docker
- ArgoCD
- Google Kubernetes Engine (GKE)
- Google Cloud SQL (MySQL)

---

# Purpose of This Application

The main purpose of this application is to help HR teams and organizations:

- Predict employee attrition risk
- Improve employee retention strategies
- Analyze workforce stability
- Identify employees likely to resign
- Reduce hiring and training costs
- Make proactive HR decisions using AI

The application provides a simple UI where HR users can:

- Enter employee details manually
- Upload employee records in bulk
- Predict attrition using AI/ML logic
- Analyze workforce trends

---

# Application Features

## Employee Attrition Prediction
Predict employee resignation probability using AI.

## Bulk Upload Support
Upload multiple employee records using CSV or Excel files.

## Secure Database Integration
Uses Google Cloud SQL MySQL securely with Kubernetes Secrets.

## GitOps Deployment
Fully automated Kubernetes deployment using ArgoCD.

## CI/CD Pipeline
GitLab CI automatically builds and deploys Docker images.
<img width="1718" height="689" alt="image" src="https://github.com/user-attachments/assets/d46da54c-d7c7-4623-b2df-82801a8434bc" />


## Kubernetes Deployment
Runs on Google Kubernetes Engine (GKE).

## Auto Sync Deployment
ArgoCD continuously syncs Git repository changes to Kubernetes cluster.
<img width="1890" height="950" alt="image" src="https://github.com/user-attachments/assets/9f834829-8b4c-4350-8305-48551b2394b4" />


---

# Application UI

The application contains the following input fields:

- Candidate Name
- Total Experience (Months)
- Last Pay Increment Band
- Number of Past Organizations
- Average Feedback Rating
- Time Since Last Promotion
- Bulk Upload Section

This information is processed to predict employee attrition trends.

---

# Architecture

```text
Developer
   ↓
GitLab Repository
   ↓
GitLab CI/CD Pipeline
   ↓
Docker Image Build
   ↓
Artifact Registry
   ↓
GitOps Repository
   ↓
ArgoCD
   ↓
GKE Cluster
   ↓
Cloud SQL MySQL
   ↓
Application UI
```

---

# Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML / CSS / JavaScript |
| Backend | Python / Flask |
| Database | MySQL (Cloud SQL) |
| Containerization | Docker |
| CI/CD | GitLab CI/CD |
| GitOps | ArgoCD |
| Kubernetes | GKE |
| Cloud Provider | Google Cloud Platform |

---

# GitOps Workflow

## Repository 1 — Application Repository

Contains:

- Application source code
- Dockerfile
- `.gitlab-ci.yml`

Purpose:

- Build Docker image
- Push image to Artifact Registry

---

## Repository 2 — Kubernetes GitOps Repository

Contains:

- deployment.yaml
- service.yaml
- configmap.yaml
- secret.yaml

Purpose:

- Store Kubernetes desired state
- Monitored continuously by ArgoCD

---

# End-to-End Deployment Setup

---

# Step 1 — Install ArgoCD on GKE

## Create Namespace

```bash
kubectl create namespace argocd
```

## Install ArgoCD

```bash
kubectl apply -n argocd \
-f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

## Check Pods

```bash
kubectl get pods -n argocd
```

### Purpose
ArgoCD is deployed inside the Kubernetes cluster to manage Kubernetes resources.

---

# Step 2 — Expose ArgoCD UI

```bash
kubectl patch svc argocd-server -n argocd \
-p '{"spec": {"type": "LoadBalancer"}}'
```

## Get External IP

```bash
kubectl get svc argocd-server -n argocd
```

## Open Browser

```text
https://EXTERNAL-IP
```

### Purpose
Expose ArgoCD dashboard externally for browser access.

---

# Step 3 — Get ArgoCD Admin Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
-o jsonpath="{.data.password}" | base64 -d
```

## Default Username

```text
admin
```

### Purpose
Retrieve ArgoCD admin credentials stored in Kubernetes secret.

---

# Step 4 — GitLab Repositories

## Application Repository

Contains:

- Source code
- Dockerfile
- GitLab CI/CD pipeline

### Purpose
Build and push Docker image.

---

## GitOps Repository

Contains Kubernetes manifests:

- Deployment
- Service
- ConfigMap
- Secret

### Purpose
ArgoCD continuously monitors this repository for deployment changes.

---

# Step 5 — Kubernetes YAML Configuration

## deployment.yaml

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ai-attrition

---

apiVersion: v1
kind: ResourceQuota
metadata:
  name: ai-attrition-resourcequota
  namespace: ai-attrition

spec:
  hard:
    requests.cpu: "2"
    requests.memory: 4Gi
    limits.cpu: "4"
    limits.memory: 8Gi
    pods: "10"

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-attrition
  namespace: ai-attrition

spec:
  replicas: 2

  selector:
    matchLabels:
      app: ai-attrition

  template:
    metadata:
      labels:
        app: ai-attrition

    spec:
      containers:
      - name: ai-attrition

        image: asia-south1-docker.pkg.dev/devopsmar26/ai-attrition/ai-attrition:e6be21bc

        ports:
        - containerPort: 5000

        envFrom:
        - configMapRef:
            name: ai-attrition-config

        - secretRef:
            name: ai-attrition-secret

        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"

          limits:
            memory: "1Gi"
            cpu: "500m"

        readinessProbe:
          httpGet:
            path: /
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 5

        livenessProbe:
          httpGet:
            path: /
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10

---

apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-attrition-hpa
  namespace: ai-attrition

spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-attrition

  minReplicas: 2
  maxReplicas: 5

  metrics:
  - type: Resource
    resource:
      name: cpu

      target:
        type: Utilization
        averageUtilization: 70

---

apiVersion: v1
kind: Service
metadata:
  name: ai-attrition
  namespace: ai-attrition

spec:
  type: LoadBalancer

  selector:
    app: ai-attrition

  ports:
    - port: 80
      targetPort: 5000
```

---

# secret.yaml

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ai-attrition-secret
  namespace: ai-attrition

type: Opaque

stringData:
  MYSQL_PASSWORD: "Kanha@#"
```

---

# configmap.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ai-attrition-config
  namespace: ai-attrition

data:
  MYSQL_HOST: "172.29.64.xx"
  MYSQL_USER: "vms"
  MYSQL_DB: "daily-task"
```

---

# Kubernetes Components Explanation

| Component | Purpose |
|---|---|
| Namespace | Creates isolated environment for application |
| Deployment | Deploys application pods |
| Service | Exposes application externally |
| ConfigMap | Stores non-sensitive environment variables |
| Secret | Stores sensitive credentials securely |
| ResourceQuota | Controls namespace resource usage |
| HPA | Automatically scales pods based on CPU usage |
| Readiness Probe | Checks whether app is ready for traffic |
| Liveness Probe | Restarts unhealthy containers |

---

# Step 6 — Connect GitLab Repository to ArgoCD

Open ArgoCD UI:

```text
Settings → Repositories → Connect Repo
```

Fill:

```text
Repository URL
Username: oauth2
Password: GitLab Access Token
```

Enable:

```text
Force HTTP Basic Auth
```

### Purpose
Allow ArgoCD to access private GitLab repository securely.

---

# Step 7 — Create ArgoCD Application

Navigate:

```text
Applications → New App
```

## Configuration

```text
Application Name: ai-attrition
Project: default
Sync Policy: Automatic
Repository: ai-attrition-k8s
Revision: main
Path: .
Cluster URL: https://kubernetes.default.svc
Namespace: ai-attrition
```

### Purpose
Define deployment source and deployment destination.

---

# Step 8 — Sync Application

Click:

```text
SYNC → SYNCHRONIZE
```

ArgoCD deploys:

- Namespace
- ConfigMap
- Secret
- Deployment
- Service
- HPA
- ResourceQuota

### Purpose
Apply Git repository configuration to Kubernetes cluster.

---

# Step 9 — Verify Deployment

## Check Pods

```bash
kubectl get pods -n ai-attrition
```

## Check Services

```bash
kubectl get svc -n ai-attrition
```

## Check HPA

```bash
kubectl get hpa -n ai-attrition
```

## Check ResourceQuota

```bash
kubectl get resourcequota -n ai-attrition
```

## Access Application

```text
http://EXTERNAL-IP
```

### Purpose
Verify successful deployment.

---

# Step 10 — Cloud SQL Integration

Application uses:

```text
MYSQL_HOST
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DB
```

Configuration comes from:

- ConfigMap
- Secret

### Purpose
Provide secure database connectivity.

---

# Test Cloud SQL Connectivity

```bash
kubectl run mysql-test \
--image=mysql:8.4 \
--rm -it \
--restart=Never \
--namespace ai-attrition \
-- mysql -h DB_IP -u USER -p
```

### Purpose
Verify GKE to Cloud SQL connectivity.

---

# Apply Kubernetes YAML Files

## Create Resources

```bash
kubectl apply -f deployment.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
```

---

# Final Deployment Flow

```text
Developer pushes code
        ↓
GitLab CI/CD pipeline starts
        ↓
Docker image built
        ↓
Image pushed to Artifact Registry
        ↓
GitOps repo updated
        ↓
ArgoCD detects changes
        ↓
ArgoCD syncs GKE cluster
        ↓
Application deployed
        ↓
Service exposes UI
        ↓
Users access application
```

---

# Useful Kubernetes Commands

## Check All Pods

```bash
kubectl get pods -A
```

## Check All Services

```bash
kubectl get svc -A
```

## Check ArgoCD Applications

```bash
kubectl get applications -n argocd
```

## View Logs

```bash
kubectl logs POD_NAME -n ai-attrition
```

## Describe Pods

```bash
kubectl describe pod POD_NAME -n ai-attrition
```

---

# Production Improvements Added

- Horizontal Pod Autoscaler (HPA)
- Resource Requests & Limits
- ResourceQuota
- Liveness Probe
- Readiness Probe
- Namespace Isolation
- Secure Secret Management
- Auto Sync Deployment
- Cloud-Native Architecture

---

# Benefits of This Architecture

- Fully automated deployment
- Git-based infrastructure management
- Easy rollback capability
- Secure secret management
- Scalable Kubernetes infrastructure
- Continuous deployment using ArgoCD
- Production-ready deployment workflow

---

# Future Improvements

- Add trained AI/ML prediction model
- Add authentication and authorization
- Add Prometheus & Grafana monitoring
- Add HTTPS Ingress Controller
- Add Helm charts
- Add Terraform automation
- Add CI/CD security scanning
- Add Backup & Disaster Recovery

---

# Author

## Shivam

GCP DevOps Engineer

### Skills

- Google Cloud Platform (GCP)
- GitLab CI/CD
- Docker
- Kubernetes (GKE)
- ArgoCD
- Cloud SQL
- DevOps Automation

---
