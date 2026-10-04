@echo off
title Stop All ApexReach & Bethelmind Runners - Protect Local Resources
echo ========================================================
echo 🛑 STOPPING ALL LOCAL RUNNERS, SCRAPERS & BACKGROUND LOOPS
echo ========================================================
echo.

powershell -Command "Stop-Process -Name comet, tor -Force -ErrorAction SilentlyContinue; Get-CimInstance Win32_Process | Where-Object { ($_.Name -eq 'node.exe' -or $_.Name -eq 'python.exe') -and ($_.CommandLine -match 'keep_alive|local_job_runner|master_247|harvester|scraper|traffic_daemon|autopilot|colab|social_inbox') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"

echo.
echo ✅ All heavy local scraping & loop processes terminated.
echo 🔋 Local CPU and RAM resources are 100%% freed and protected.
echo ☁️ Heavy lead discovery and arbitrage tasks are delegated to Google Colab Cloud.
echo ========================================================
pause
