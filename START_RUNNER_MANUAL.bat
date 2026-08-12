@echo off
title ApexReach - Manual Job Runner
echo ========================================================
echo 🚀 STARTING LOCAL RUNNER (MANUAL MODE)
echo ========================================================
echo  Note: This runner will ONLY run while this window is open.
echo  Close this window at any time to stop the runner and free resources.
echo ========================================================
echo.
cd /d "c:\Users\HomePC\Desktop\website Projects\lead generation automation"

node scripts/keep_alive_runner.js

pause
