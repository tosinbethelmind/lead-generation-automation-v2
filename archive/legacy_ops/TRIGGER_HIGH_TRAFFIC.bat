@echo off
title BETHELMIND HIGH-VELOCITY TRAFFIC TRIGGER
color 0A

echo ========================================================================
echo   BETHELMIND ANALYTICS - HIGH-VELOCITY TRAFFIC & SELAR DISPATCH
echo ========================================================================
echo.
echo [1/3] Triggering Multi-Channel Asset Generation...
echo [2/3] Updating Master Action Plan (DAILY_TRAFFIC_ACTION_PLAN.md)...
echo [3/3] Syncing Selar URLs and Inbound WhatsApp Conversions...
echo.

npx tsx scripts/trigger_high_traffic_engine.js

echo.
echo ========================================================================
echo   High Traffic Assets Generated in: data\traffic-queue\
echo ========================================================================
pause
