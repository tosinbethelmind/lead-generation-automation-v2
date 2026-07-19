@echo off
title ApexReach Launcher
echo ========================================================
echo Launching ApexReach Lead Engine Stack...
echo ========================================================
cd /d "c:\Users\HomePC\Desktop\website Projects\lead generation automation"

echo [1/2] Starting Next.js Dev Server on port 3006 (minimized)...
start /min cmd /c "npm run dev"

echo Waiting for server to initialize...
timeout /t 5 /nobreak >nul

echo [2/2] Opening Dashboard in default web browser...
start http://localhost:3006

echo.
echo ========================================================
echo Done! Stacks are now initializing in the background.
echo You can close this window now.
echo ========================================================
timeout /t 3 >nul
exit
