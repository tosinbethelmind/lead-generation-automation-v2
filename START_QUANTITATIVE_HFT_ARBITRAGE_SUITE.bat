@echo off
TITLE Bethelmind Institutional Quantitative Crypto Arbitrage & HFT Suite
COLOR 0B
cd /d "%~dp0"

echo ===============================================================================
echo   BETHELMIND INSTITUTIONAL QUANTITATIVE CRYPTO ARBITRAGE & HFT SUITE
echo ===============================================================================
echo [1] Running Multi-RPC Auto-Failover & Sub-15ms Latency Optimizer...
echo [2] Activating CEX-DEX Latency Backrunner (Base L2 & Arbitrum vs Binance)...
echo [3] Initializing Delta-Neutral Perp Basis Harvester (Hyperliquid/dYdX)...
echo [4] Ingesting Intent-Based Private Order Flow (CoW Swap / UniswapX Solver)...
echo [5] Packing Solana Jito Shredstream Bundles (Sub-25ms TPU Swaps)...
echo [6] Direct Settlement: OPay Digital Services - 7034297995 (Oyelakin Tosin Matthew)
echo ===============================================================================
echo.

npx tsx scripts/test_quantitative_arbitrage_suite.ts

echo.
echo ===============================================================================
echo   LAUNCHING 24/7 AUTONOMOUS CONTINUOUS REVENUE DAEMON WITH WATCHDOG
echo ===============================================================================
echo.

npx tsx scripts/autonomous_golden_crypto_daemon.ts

pause
