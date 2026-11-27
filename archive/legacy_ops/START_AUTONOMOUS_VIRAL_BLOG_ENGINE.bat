@echo off
title BETHELMIND ANALYTICS AUTONOMOUS VIRAL BLOG ENGINE (30+ POSTS/DAY)
color 0A

echo ===============================================================================
echo   BETHELMIND ANALYTICS LAGOS DESK - AUTONOMOUS 30+ POSTS/DAY BLOG ENGINE
echo   High-Converting Monetization: Selar Products, VidRush Assets, DFY Prototypes
echo ===============================================================================
echo.
echo Starting 30-post batch generation and continuous publishing daemon...
echo Target: www.bethelmindanalytics.com/blog
echo.

cd /d "c:\Users\HomePC\Desktop\website Projects\lead generation automation"
call npx tsx scripts/run_autonomous_blog_engine.ts --batch=30 --daemon

pause
