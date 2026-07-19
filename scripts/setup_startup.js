// scripts/setup_startup.js
const fs = require('fs');
const path = require('path');

function setupWindowsStartup() {
  console.log('🤖 Starting Windows Startup integration...');
  
  if (process.platform !== 'win32') {
    console.error('❌ This script only supports Windows operating systems.');
    process.exit(1);
  }

  const appData = process.env.APPDATA;
  if (!appData) {
    console.error('❌ Could not resolve %APPDATA% directory from environment variables.');
    process.exit(1);
  }

  const startupDir = path.join(appData, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
  if (!fs.existsSync(startupDir)) {
    console.error(`❌ Windows Startup directory not found at: ${startupDir}`);
    process.exit(1);
  }

  const projectDir = path.resolve(__dirname, '..');
  const batFilePath = path.join(startupDir, 'run_apexreach_runner.bat');

  const batContent = `@echo off
title ApexReach Background Runner
echo ========================================================
echo 🚀 ApexReach Automated Startup Runner
echo Project Directory: ${projectDir}
echo ========================================================
cd /d "${projectDir}"

echo.
echo [1/3] Setting up Tor Proxy Daemon...
node scripts/setup_tor.js

echo.
echo [2/3] Verifying dependencies...
call npm install --no-audit --no-fund

echo.
echo [3/3] Starting ApexReach Services (Dev, Runner, WhatsApp)...
npm run start-all

pause
`;

  try {
    fs.writeFileSync(batFilePath, batContent, 'utf8');
    console.log('========================================================');
    console.log(`✅ Success! Startup script registered at:\n   ${batFilePath}`);
    console.log('========================================================');
    console.log('This runner will now trigger automatically whenever your PC starts up and you log in!');
  } catch (err) {
    console.error('❌ Failed to write Windows startup batch file:', err.message);
    process.exit(1);
  }
}

setupWindowsStartup();
