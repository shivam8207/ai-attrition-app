
# =========================
# Stage 1 - Builder
# =========================
FROM python:3.11-slim AS builder

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY backend/requirements.txt .

# Install Python packages into custom folder
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# =========================
# Stage 2 - Final Image
# =========================
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Copy application code
COPY backend/ .

# Security best practice
RUN useradd -m appuser
USER appuser

EXPOSE 8005

CMD ["gunicorn", "--bind", "0.0.0.0:8005", "--worker-class", "uvicorn.workers.UvicornWorker", "app:app"]
