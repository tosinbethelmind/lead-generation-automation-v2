@echo off
title ApexReach - Local Runner Only
echo ========================================================
echo Starting ApexReach Local Scraping Runner...
echo ========================================================
cd /d "c:\Users\HomePC\Desktop\website Projects\lead generation automation"

echo.
echo  This runner connects to your Vercel app on the cloud.
echo  Leave this window open while the laptop is awake.
echo  It will auto-restart if it crashes, and recover
echo  automatically after the laptop wakes from sleep.
echo.
echo ========================================================
echo.

node scripts/keep_alive_runner.js
