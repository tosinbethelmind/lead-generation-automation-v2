@echo off
title Stop All ApexReach & Bethelmind Runners - Protect Local Resources
echo ========================================================
echo 🛑 STOPPING ALL LOCAL RUNNERS, SCRAPERS & BACKGROUND LOOPS
echo ========================================================
echo.

powershell -Command "Stop-Process -Name comet, tor -Force -ErrorAction SilentlyContinue; Get-Process -Name node, python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*keep_alive*' -or $_.CommandLine -like '*local_job_runner*' -or $_.CommandLine -like '*master_247*' -or $_.CommandLine -like '*harvester*' -or $_.CommandLine -like '*scraper*' } | Stop-Process -Force -ErrorAction SilentlyContinue"

echo.
echo ✅ All heavy local scraping & loop processes terminated.
echo 🔋 Local CPU and RAM resources are 100%% freed and protected.
echo ☁️ Heavy lead discovery and arbitrage tasks are delegated to Google Colab Cloud.
echo ========================================================
pause
