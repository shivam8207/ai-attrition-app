Complete Step‑by‑Step GitOps Deployment 
(GitLab → ArgoCD → GKE → Cloud SQL→grafana)

 Description
This project is an AI-based Employee Attrition Prediction application that helps organizations identify employees who are at risk of leaving the company. It is designed for HR teams, managers, and business decision-makers to enable proactive retention strategies, improve workforce planning, and make data-driven decisions.
________________________________________
1.	How To Create GKE Cluster 
gcloud container clusters create dev \
--region asia-south1 \
--node-locations asia-south1-a \
--machine-type e2-medium \
--num-nodes 1 \
--disk-size 100 \
--enable-autoscaling \
--min-nodes 1 \
--max-nodes 3 \
--labels env=dev \
--network vpc-08 \
--subnetwork sub01
_____________________________________________________________________
#  Connect Cluster
gcloud container clusters get-credentials dev \ 
--region asia-south1

Verify:
kubectl get nodes
Purpose: The GKE cluster where the application will be deployed.
📦 Step 3: Create Artifact Registry
gcloud artifacts repositories create ai-attrition \
--repository-format=docker \
--location=asia-south1 \
--description="AI Attrition Docker Repo"
#Configure Docker Auth
gcloud auth configure-docker asia-south1-docker.pkg.dev
________________________________________
2. Install ArgoCD on GKE
Create namespace:
kubectl create namespace argocd
Install ArgoCD:
kubectl apply -n argocd \
-f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
Check pods:
kubectl get pods -n argocd
Purpose: Argo CD will manage the Kubernetes resources.
________________________________________
3. Expose ArgoCD UI
kubectl patch svc argocd-server -n argocd \
-p '{"spec": {"type": "LoadBalancer"}}'
Get IP:
kubectl get svc argocd-server -n argocd
Open browser:
https://EXTERNAL-IP
________________________________________
4. Get ArgoCD Admin Password
kubectl -n argocd get secret argocd-initial-admin-secret \
-o jsonpath="{.data.password}" | base64 -d
Login:
Username:
admin
Password:
(command output)
________________________________________
5. GitLab Repositories Created
We use two repositories to follow GitOps best practices.
Repo 1 (Application Code)
ai-attrition-app
Contains:
Dockerfile
app.py
requirements.txt
.gitlab-ci.yml
Purpose: Build Docker image
________________________________________
Repo 2 (GitOps repo)
ai-attrition-k8s
Repo URL used:
https://gitlab.com/gitops3330217/ai-attrition-k8s.git
Files inside repo:
deployment.yaml
configmap.yaml
secret.yaml
Purpose: ArgoCD reads this repo
________________________________________
6. configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ai-attrition-config
  namespace: ai-attrition
data:
  MYSQL_HOST: "172.29.64.3"
  MYSQL_USER: "xyz"
  MYSQL_DB: "abc"
Purpose: Database config store
________________________________________
7. secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: ai-attrition-secret
  namespace: ai-attrition
type: Opaque
stringData:
  MYSQL_PASSWORD: "password"
Purpose: Secure password store
________________________________________
8. deployment.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ai-attrition
---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-attrition
  namespace: ai-attrition
spec:
  replicas: 5
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
________________________________________
9. Create GitLab Access Token (Repo 2 (GitOps repo)
ai-attrition-k8s)

GitLab → Profile → Access Tokens
Scopes:
read_repository
read_api
Copy token.
________________________________________
10. Connect GitLab Repo to ArgoCD
ArgoCD UI → Settings → Repositories → Connect Repo
Fill:
Repository URL:
https://gitlab.com/gitops3330217/ai-attrition-k8s.git
Username:
oauth2
Password:
<GITLAB TOKEN>
Enable:
Force HTTP Basic Auth
Click Connect
Status:
Connection Successful
________________________________________
11. Create Application in ArgoCD
ArgoCD → Applications → NEW APP
GENERAL
Application Name:
daily-task
Project:
default
Enable:
✔ Auto Sync ✔ Self Heal ✔ Prune ✔ Auto Create Namespace
________________________________________
SOURCE
Repository URL:
https://gitlab.com/gitops3330217/ai-attrition-k8s.git
Revision:
main
Path:
.
________________________________________
DESTINATION
Cluster URL:
https://kubernetes.default.svc
Namespace:
ai-attrition
Click CREATE
________________________________________
12. Sync Application
Click:
SYNC
Then:
SYNCHRONIZE
ArgoCD deploys:
Namespace ConfigMap Secret Deployment Service
________________________________________
13. Verify Deployment
Check pods:
kubectl get pods -n ai-attrition
Check service:
kubectl get svc -n ai-attrition
Get external IP
Open browser:
http://EXTERNAL-IP
Application running
________________________________________
14. Test Cloud SQL Connection
kubectl run mysql-test \
--image=mysql:8.4 \
--rm -it \
--restart=Never \
--namespace ai-attrition \
-- mysql -h 172.29.xx.xx -u vms -p
Purpose: Test GKE → MySQL connectivity
________________________________________
Final Architecture
GitLab (k8s repo)
↓
ArgoCD
↓
GKE Cluster
↓
Deployment
↓
Pods
↓
Service LoadBalancer
↓
Application UI
________________________________________
 
______________________________________________________________________
GitOps Flow
DevOps eng. push YAML → GitLab
ArgoCD detects change
ArgoCD sync cluster
New pods created
Old pods removed
Application updated
________________________________________
Result
Application deployed using GitOps
ArgoCD connected to GitLab
GKE deployment working
Cloud SQL connected
UI accessible
_________________________________________________________________________________________________________


<img width="1800" height="962" alt="image" src="https://github.com/user-attachments/assets/4aa386dd-a97d-4394-ae97-ed4d622da5b0" />

________________________________________________________________________________________________________



 
Step 1 — Install Prometheus + Grafana (Helm)
Install Helm (if not installed)

curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
Add repo:
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

Install kube-prometheus-stack:
helm install monitoring prometheus-community/kube-prometheus-stack \
-n monitoring --create-namespace

👉 Isme automatically install hota hai:
•	Prometheus 
•	Grafana 
•	Alertmanager
🔓 Access Grafana

Step 1 — Grafana ko NodePort me convert karo
kubectl patch svc monitoring-grafana -n monitoring \
-p '{"spec": {"type": " "}}'

Or 
🚀 OPTION 2 — LoadBalancer (Recommended on GKE)
 Grafana expose 
kubectl patch svc monitoring-grafana -n monitoring \
-p '{"spec": {"type": "LoadBalancer"}}'

kubectl get svc -n monitoring


Prometheus (optional)

kubectl patch svc monitoring-kube-prometheus-prometheus -n monitoring \
-p '{"spec": {"type": "LoadBalancer"}}'

Or 
kubectl patch svc monitoring-kube-prometheus-prometheus -n monitoring \
-p '{"spec": {"type": " NodePort "}}'


