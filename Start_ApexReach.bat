@echo off
title ApexReach Launcher
echo ========================================================
echo Launching ApexReach Lead Engine & Control Center Stack...
echo ========================================================
cd /d "c:\Users\HomePC\Desktop\website Projects\lead generation automation"

echo [1/5] Starting Next.js Dev Server on port 3006 (minimized)...
start /min cmd /k "title ApexReach-DevServer && npm run dev"

echo [2/5] Starting WhatsApp Baileys Gateway on port 3007 (minimized)...
start /min cmd /k "title ApexReach-WhatsAppService && node scripts/whatsapp_baileys.js"

echo [3/5] Starting Unified Multi-Channel Command Center on port 3008 (minimized)...
start /min cmd /k "title ApexReach-CommandCenter && node scripts/unified_whatsapp_command_center.js"

echo Waiting 5 seconds for local services to initialize...
timeout /t 5 /nobreak >nul

echo [4/5] Starting Local Job Runner (keep-alive, auto-restart)...
start /min cmd /k "title ApexReach-LocalRunner && node scripts/keep_alive_runner.js"

echo [5/5] Opening Central Approval Dashboard in default web browser...
start http://localhost:3006/admin/approvals

echo.
echo ========================================================
echo Stack is live!
echo  - Next.js App & Approval UI: localhost:3006/admin/approvals
echo  - WhatsApp Baileys Gateway: localhost:3007 (QR Pairing UI)
echo  - Unified Command Center:    localhost:3008 (Multi-Channel Bridge)
echo  - Local Job Runner:          running in background (auto-restarts)
echo.
echo TIP: Background windows are minimized. Check taskbar to monitor.
echo ========================================================
timeout /t 3 /nobreak >nul
exit
