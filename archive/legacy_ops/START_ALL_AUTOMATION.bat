@echo off
title Bethelmind Analytics - 24/7 Unified Master Autopilot
color 0A
echo =================================================================
echo   BETHELMIND ANALYTICS: 24/7 UNIFIED MASTER AUTOPILOT
echo =================================================================
echo.
echo [1/3] Checking Node.js Environment...
node -v
echo.
echo [2/3] Initializing Traffic Engine, Google Indexing & Lead Pipelines...
echo.
echo [3/3] Launching Master Autopilot Supervisor...
echo.
node scripts/unified_master_autopilot.js
pause
