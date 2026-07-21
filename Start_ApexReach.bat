@echo off
title ApexReach Launcher
echo ========================================================
echo Launching ApexReach Lead Engine Stack...
echo ========================================================
cd /d "c:\Users\HomePC\Desktop\website Projects\lead generation automation"

echo [1/3] Starting Next.js Dev Server on port 3006 (minimized)...
start /min cmd /k "title ApexReach-DevServer && npm run dev"

echo Waiting 8 seconds for server to initialize...
timeout /t 8 /nobreak >nul

echo [2/3] Starting Local Job Runner (keep-alive, auto-restart)...
start /min cmd /k "title ApexReach-LocalRunner && node scripts/keep_alive_runner.js"

echo [3/3] Opening Dashboard in default web browser...
start http://localhost:3006

echo.
echo ========================================================
echo Stack is live!
echo  - Dev Server:    localhost:3006
echo  - Local Runner:  running in background (auto-restarts)
echo  - Dashboard:     opening in browser...
echo.
echo TIP: Both windows are minimized. Check taskbar to monitor.
echo ========================================================
timeout /t 3 /nobreak >nul
exit
