// scripts/fully_automated_setup.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

function ensurePgInstalled() {
  try {
    require('pg');
  } catch (e) {
    console.log(colors.cyan + 'pg (PostgreSQL client) is missing. Installing pg dependency...' + colors.reset);
    execSync('npm install pg', { stdio: 'inherit' });
  }
}

async function runFullyAutomatedSetup() {
  console.log(colors.cyan + colors.bright);
  console.log('====================================================');
  console.log('      ApexReach Headless Setup & Migration          ');
  console.log('====================================================' + colors.reset);
  console.log('Running fully automated headless configuration setup...\n');

  const isDryRun = process.argv.includes('--dry-run');

  const envExamplePath = path.join(process.cwd(), '.env.example');
  const envLocalPath = path.join(process.cwd(), '.env.local');

  // Copy .env.example to .env.local if not present
  if (!fs.existsSync(envLocalPath)) {
    if (fs.existsSync(envExamplePath)) {
      console.log(colors.yellow + 'No .env.local found. Creating .env.local from .env.example template...' + colors.reset);
      fs.copyFileSync(envExamplePath, envLocalPath);
    } else {
      console.log(colors.yellow + 'No .env.example found. Creating empty .env.local file...' + colors.reset);
      fs.writeFileSync(envLocalPath, '# Environment Variables\n');
    }
  }

  // Load and parse env variables
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join('=').trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.substring(1, value.length - 1);
        envVars[key] = value;
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });

  // Ensure default environment values are set to prevent errors
  process.env.STORAGE_MODE = process.env.STORAGE_MODE || envVars.STORAGE_MODE || 'supabase';
  process.env.DRY_RUN = process.env.DRY_RUN || envVars.DRY_RUN || 'true';
  process.env.BUSINESS_SIGNATURE = process.env.BUSINESS_SIGNATURE || envVars.BUSINESS_SIGNATURE || 'ApexReach';

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  console.log(`- STORAGE_MODE: ${process.env.STORAGE_MODE}`);
  console.log(`- DRY_RUN: ${process.env.DRY_RUN}`);
  console.log(`- BUSINESS_SIGNATURE: ${process.env.BUSINESS_SIGNATURE}`);
  console.log(`- SUPABASE_URL: ${supabaseUrl ? 'Configured' : 'Missing'}`);

  // Run database migrations if SUPABASE_URL is configured
  if (supabaseUrl) {
    if (isDryRun) {
      console.log(colors.yellow + '[dry-run] Database migration step would execute.' + colors.reset);
    } else {
      ensurePgInstalled();
      const { runAllMigrations } = require('./run_all_migrations');
      console.log(colors.cyan + 'Starting database table migrations automatically...' + colors.reset);
      const migrationRes = await runAllMigrations();
      if (!migrationRes) {
        console.warn(colors.red + 'Warning: Database tables migration failed. Verify connection variables.' + colors.reset);
      }
    }
  } else {
    console.log(colors.yellow + 'Skipping database migration: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL is empty.' + colors.reset);
  }

  // Update / Generate config.json based on resolved environment
  const configPath = path.join(process.cwd(), 'config.json');
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      config = {};
    }
  }

  config.storageMode = process.env.STORAGE_MODE;
  config.supabaseUrl = supabaseUrl;
  config.supabaseKey = supabaseKey;
  config.dryRun = process.env.DRY_RUN === 'true';
  config.businessSignature = process.env.BUSINESS_SIGNATURE;
  config.geminiApiKey = process.env.GEMINI_API_KEY || envVars.GEMINI_API_KEY || '';

  if (isDryRun) {
    console.log(colors.yellow + '[dry-run] Config file update step would execute.' + colors.reset);
  } else {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log(colors.green + '✔ Generated/synchronized config.json configuration parameters successfully!' + colors.reset);
  }

  console.log(colors.green + colors.bright + '\n====================================================');
  console.log('      HEADLESS AUTOMATED SETUP COMPLETED!           ');
  console.log('====================================================' + colors.reset + '\n');
}

runFullyAutomatedSetup();
