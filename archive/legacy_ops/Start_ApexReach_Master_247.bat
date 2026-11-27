@echo off
title ApexReach - MASTER 24/7 NON-STOP AUTOMATION
echo ========================================================
echo 🚀 LAUNCHING APEXREACH MASTER 24/7 AUTOMATION ENGINE
echo ========================================================
cd /d "%~dp0"

echo.
echo  Running non-stop background automation:
echo   1. Python 10K Lagos Continuous Harvester (15-min cycles)
echo   2. Local Scraping Queue Runner (Real-time job execution)
echo   3. Auto-recovery & crash resilience
echo.
echo ========================================================
echo.

node scripts/master_247_supervisor.js

pause
