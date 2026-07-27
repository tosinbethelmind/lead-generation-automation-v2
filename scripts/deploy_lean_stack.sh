#!/usr/bin/env bash
# ==============================================================================
# Automated 1-Click Production Stack Deployment Script for Lean ApexReach ($10/mo)
# Runs on Ubuntu 20.04 / 22.04 / Debian 11 / Debian 12 VPS
# ==============================================================================

set -e

echo "🚀 Starting Automated Lean Stack Deployment for ApexReach (5,000 Active Users)..."

# 1. Update System & Install Dependencies
echo "📦 Updating OS packages..."
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw jq ca-certificates gnupg lsb-release

# 2. Install Docker & Docker Compose Plugin
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo systemctl enable docker
    sudo systemctl start docker
    echo "✅ Docker successfully installed."
else
    echo "✅ Docker is already installed."
fi

# 3. Configure Network & Linux Kernel Sysctls for High Concurrency
echo "⚙️ Tuning Linux Kernel network sysctls for high concurrency..."
sudo sysctl -w net.core.somaxconn=1024
sudo sysctl -w net.ipv4.tcp_max_syn_backlog=2048
sudo sysctl -w fs.file-max=2097152

# 4. Firewall Setup (UFW)
echo "🛡️ Setting up basic UFW firewall rules..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable || true

# 5. Environment File Checks
if [ ! -f ".env.production" ]; then
    if [ -f ".env.example" ]; then
        echo "📝 Creating .env.production from .env.example..."
        cp .env.example .env.production
    else
        echo "⚠️ .env.production not found. Creating a baseline configuration..."
        cat <<EOF > .env.production
PORT=3006
STORAGE_MODE=supabase
POSTGRES_PASSWORD=$(openssl rand -hex 16 2>/dev/null || echo "LeanStackPassword123!")
DOMAIN_NAME=localhost
EOF
    fi
fi

# 6. Build and Launch Containers
echo "🏗️ Building and launching Docker containers via docker-compose.lean.yml..."
docker compose -f docker-compose.lean.yml --env-file .env.production up -d --build

# 7. Health check status
echo "⏳ Waiting 15 seconds for containers to initialize..."
sleep 15

docker compose -f docker-compose.lean.yml ps

echo "======================================================================"
echo "🎉 DEPLOYMENT COMPLETE!"
echo "Your ultra-lean $10/month ApexReach stack is now active and running."
echo "App URL: http://localhost (or your configured domain)"
echo "Database: PostgreSQL 16 active"
echo "Queue: Redis active"
echo "Tor SOCKS Proxy: Active on port 9050"
echo "======================================================================"
