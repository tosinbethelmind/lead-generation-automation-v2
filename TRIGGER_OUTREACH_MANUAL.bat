@echo off
title BETHELMIND MANUAL OUTREACH DISPATCH
color 0B

echo ========================================================================
echo   BETHELMIND ANALYTICS - MANUAL OUTREACH DISPATCH LAUNCHER
echo ========================================================================
echo.
echo  This script will ONLY dispatch cold SMS and Email outreach when you
echo  explicitly confirm below.
echo.
echo  Channels: Dual Carrier SMS (Tailscale Gateway) + Hostinger SMTP
echo  Target: Verified Lagos Commercial Leads (500 Leads / Day Max)
echo  Ban-Proof Policy: Zero Cold Outbound WhatsApp
echo.
echo ========================================================================
set /p confirm="Do you want to fire today's prepared outreach batch now? (Y/N): "
if /i "%confirm%" neq "Y" (
    echo.
    echo Outreach dispatch cancelled by user. No messages were sent.
    echo.
    pause
    exit /b
)

echo.
echo [1/2] Verifying Supabase sync and preflight checks...
echo [2/2] Firing Carrier SMS + B2B Email Outreach...
echo.

node scripts/dispatch_today_lagos_outreach.js

echo.
echo ========================================================================
echo   Outreach Dispatch Completed. Replies route to 0802 279 1227.
echo ========================================================================
pause
