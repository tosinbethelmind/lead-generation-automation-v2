# Dockerfile for general VPS hosting (e.g. Oracle Cloud VPS Always Free)
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build Next.js
COPY . .
RUN npm run build

# Production image
FROM node:20-slim

WORKDIR /app

# Install Google Chrome stable and fonts for local headless scraping
RUN apt-get update && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy built application and production dependencies
COPY --from=builder /app /app

EXPOSE 3006

# Start Next.js API server, local scraping runner, and WhatsApp automation in parallel
CMD ["npx", "concurrently", "\"next start -p 3006\"", "\"node scripts/keep_alive_runner.js\"", "\"node scripts/whatsapp_baileys.js\""]
