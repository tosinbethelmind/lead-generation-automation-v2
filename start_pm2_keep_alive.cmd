@echo off
TITLE ApexReach 24/7 PM2 Local Keep-Alive Daemon
echo ========================================================
echo   ApexReach Scraper System - 24/7 PM2 Local Keep-Alive
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking PM2 installation...
call npx pm2 --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installing PM2 globally...
    call npm install -g pm2
)

echo [2/3] Starting keep_alive_runner.js via PM2...
call npx pm2 start scripts/keep_alive_runner.js --name "apexreach-scraper-daemon"

echo [3/3] Saving PM2 process list...
call npx pm2 save

echo.
echo ========================================================
echo   SUCCESS: ApexReach Local Daemon is running in PM2!
echo   To view status:  npx pm2 status
echo   To view logs:    npx pm2 logs apexreach-scraper-daemon
echo   To stop daemon:  npx pm2 stop apexreach-scraper-daemon
echo ========================================================
pause
