#!/bin/bash
# ==============================================================================
# Bethelmind Digital Solutions — Production VPS Deployment Script
# Target: Ubuntu 22.04 / 24.04 LTS (Contabo Cloud VPS 4)
# ==============================================================================

set -e

echo "🚀 [1/6] Updating system packages and installing base dependencies..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y && apt-get upgrade -y
apt-get install -y curl wget git build-essential ufw ffmpeg python3 python3-pip

echo "📦 [2/6] Installing Node.js 20 LTS & PM2 Process Manager..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

echo "📂 [3/6] Cloning Bethelmind Production Repository..."
cd /root
if [ -d "lead-generation-automation-v2" ]; then
  echo "Updating existing repository..."
  cd lead-generation-automation-v2
  git pull origin main
else
  git clone https://github.com/tosinbethelmind/lead-generation-automation-v2.git
  cd lead-generation-automation-v2
fi

echo "📦 [4/6] Installing project dependencies..."
npm install --omit=dev --ignore-scripts

echo "🛡️ [5/6] Configuring Firewall (UFW)..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8080/tcp
ufw --force enable

echo "⚡ [6/6] Launching 24/7 Evolution API & Closer Engine via PM2..."
pm2 delete bethelmind-evolution 2>/dev/null || true
pm2 start scripts/evolution_api_server.js --name "bethelmind-evolution" --time
pm2 save
pm2 startup systemd -u root --hp /root

echo ""
echo "=============================================================================="
echo "🎉 BETHELMIND 24/7 CLOUD VPS AUTOMATION DEPLOYED SUCCESSFULLY!"
echo "   Server IP  : $(curl -s ifconfig.me)"
echo "   Dashboard  : http://$(curl -s ifconfig.me):8080/"
echo "   Scan Link  : http://$(curl -s ifconfig.me):8080/scan/1"
echo "=============================================================================="
