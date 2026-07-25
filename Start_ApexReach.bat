@echo off
title ApexReach Launcher
echo ========================================================
echo Launching ApexReach Lead Engine Stack...
echo ========================================================
cd /d "c:\Users\HomePC\Desktop\website Projects\lead generation automation"

echo [1/4] Starting Next.js Dev Server on port 3006 (minimized)...
start /min cmd /k "title ApexReach-DevServer && npm run dev"

echo [2/4] Starting WhatsApp Baileys Service on port 3007 (minimized)...
start /min cmd /k "title ApexReach-WhatsAppService && node scripts/whatsapp_baileys.js"

echo Waiting 5 seconds for local services to initialize...
timeout /t 5 /nobreak >nul

echo [3/4] Starting Local Job Runner (keep-alive, auto-restart)...
start /min cmd /k "title ApexReach-LocalRunner && node scripts/keep_alive_runner.js"

echo [4/4] Opening Dashboard in default web browser...
start http://localhost:3006

echo.
echo ========================================================
echo Stack is live!
echo  - Dev Server:       localhost:3006
echo  - WhatsApp Service: localhost:3007 (QR Pairing UI)
echo  - Local Runner:     running in background (auto-restarts)
echo  - Dashboard:        opening in browser...
echo.
echo TIP: Background windows are minimized. Check taskbar to monitor.
echo ========================================================
timeout /t 3 /nobreak >nul
exit
