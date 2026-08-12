@echo off
title Stop All ApexReach Runners & Protect Resources
echo ========================================================
echo 🛑 STOPPING ALL LOCAL RUNNERS, SCRAPERS & POPUPS
echo ========================================================
echo.

powershell -Command "Stop-Process -Name comet, tor -Force -ErrorAction SilentlyContinue; Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*keep_alive*' -or $_.CommandLine -like '*local_job_runner*' -or $_.CommandLine -like '*master_247*' } | Stop-Process -Force -ErrorAction SilentlyContinue"

echo.
echo ✅ All local runners, Tor daemons, and Comet popups have been stopped.
echo 🔋 Your laptop resources are now protected.
echo ========================================================
pause
