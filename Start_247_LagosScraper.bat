@echo off
title 10K Lagos B2B Engine - 24/7 Continuous Scraper
echo ========================================================
echo 🚀 Launching 10K Lagos Scraper (24/7 Continuous Loop)...
echo ========================================================
cd /d "%~dp0"

echo.
echo  This scraper runs continuous 15-minute harvest cycles.
echo  It auto-syncs extracted leads to Supabase & local DB.
echo  Keep this window open for continuous 24/7 operation.
echo.
echo ========================================================
echo.

python scripts/colab_lagos_10k_runner.py --loop

pause
