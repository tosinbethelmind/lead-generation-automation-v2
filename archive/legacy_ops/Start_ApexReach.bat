@echo off
title ApexReach Launcher
echo ========================================================
echo Launching ApexReach Lead Engine & Control Center Stack...
echo ========================================================
cd /d "c:\Users\HomePC\Desktop\website Projects\lead generation automation"

echo [1/5] Starting Next.js Dev Server on port 3006 (minimized)...
start /min cmd /k "title ApexReach-DevServer && npm run dev"

echo [2/6] Starting WhatsApp Baileys Line 1 (+234 702 626 6946) on port 3007 (minimized)...
start /min cmd /k "title Bethelmind-WhatsApp-Line1 && node scripts/whatsapp_baileys.js"

echo [3/6] Starting WhatsApp Baileys Line 2 (+234 904 605 0469) on port 3009 (minimized)...
start /min cmd /k "title Bethelmind-WhatsApp-Line2 && node scripts/whatsapp_baileys_line2.js"

echo [4/6] Starting Unified Multi-Channel Command Center on port 3008 (minimized)...
start /min cmd /k "title Bethelmind-CommandCenter && node scripts/unified_whatsapp_command_center.js"

echo Waiting 5 seconds for local services to initialize...
timeout /t 5 /nobreak >nul

echo [5/6] Starting Local Job Runner (keep-alive, auto-restart)...
start /min cmd /k "title Bethelmind-LocalRunner && node scripts/keep_alive_runner.js"

echo [6/6] Opening Central Approval Dashboard in default web browser...
start http://localhost:3006/admin/approvals

echo.
echo ========================================================
echo Stack is live!
echo  - Next.js App & Approval UI: localhost:3006/admin/approvals
echo  - WhatsApp Line 1 (+234 702 626 6946): localhost:3007
echo  - WhatsApp Line 2 (+234 904 605 0469): localhost:3009
echo  - Unified Command Center:              localhost:3008 (Multi-Channel Bridge)
echo  - Local Job Runner:                    running in background (auto-restarts)
echo.
echo TIP: Background windows are minimized. Check taskbar to monitor.
echo ========================================================
timeout /t 3 /nobreak >nul
exit
