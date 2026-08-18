@echo off
title Bethelmind Dual-Line WhatsApp Stack
echo ========================================================
echo Launching Bethelmind Dual-Line WhatsApp Engine...
echo ========================================================
cd /d "%~dp0"

echo [1/2] Starting WhatsApp Line 1 (+234 702 626 6946) on port 3007...
start cmd /k "title Bethelmind-WA-Line1 && node scripts/whatsapp_baileys.js"

echo [2/2] Starting WhatsApp Line 2 (+234 904 605 0469) on port 3009...
start cmd /k "title Bethelmind-WA-Line2 && node scripts/whatsapp_baileys_line2.js"

echo.
echo ========================================================
echo Both WhatsApp Lines are active:
echo  - Line 1 (+234 702 626 6946): http://localhost:3007
echo  - Line 2 (+234 904 605 0469): http://localhost:3009
echo ========================================================
timeout /t 5 /nobreak >nul
