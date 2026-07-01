const fs = require('fs');
const path = require('path');
const readline = require('readline');
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Ensure pg is installed
function ensurePgInstalled() {
  try {
    require('pg');
  } catch (e) {
    console.log(colors.cyan + 'Installing pg (PostgreSQL client) to automate database setup...' + colors.reset);
    execSync('npm install pg', { stdio: 'inherit' });
  }
}

async function runAutoSetup() {
  console.log(colors.cyan + colors.bright);
  console.log('====================================================');
  console.log('      ApexReach Fully Automated Setup Wizard        ');
  console.log('====================================================' + colors.reset);
  console.log('This wizard will automate your Supabase database schema setup and sync your environment variables.\n');

  // Load existing config.json if it exists
  const configPath = path.join(process.cwd(), 'config.json');
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      config = {};
    }
  }

  // Load existing .env.local if it exists
  const envPath = path.join(process.cwd(), '.env.local');
  let envVars = {};
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2 && !line.startsWith('#')) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    });
  }

  // --- Step 1: Collect Supabase URL & Keys ---
  console.log(colors.cyan + '\n--- Step 1: Supabase Configuration ---' + colors.reset);
  
  const defaultSupaUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || config.supabaseUrl || '';
  const supabaseUrl = (await question(`Supabase URL [${defaultSupaUrl}]: `)).trim() || defaultSupaUrl;

  const defaultSupaAnon = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabaseAnonKey = (await question(`Supabase Anon Public Key [${defaultSupaAnon}]: `)).trim() || defaultSupaAnon;

  const defaultSupaService = envVars.SUPABASE_SERVICE_ROLE_KEY || config.supabaseKey || '';
  const supabaseServiceKey = (await question(`Supabase Service Role Secret Key [${defaultSupaService}]: `)).trim() || defaultSupaService;

  // --- Step 2: Database Schema Automation ---
  console.log(colors.cyan + '\n--- Step 2: Automatic Database Setup ---' + colors.reset);
  console.log(colors.gray + 'You can find the connection string in Supabase Dashboard -> Project Settings -> Database -> Connection String -> URI' + colors.reset);
  console.log(colors.gray + 'Format: postgresql://postgres:[password]@db.[project-id].supabase.co:6543/postgres?pgbouncer=true (recommended for pooling) or port 5432' + colors.reset);
  
  const dbConnectionString = (await question('\nEnter Supabase Database Connection URI (press Enter to skip manual SQL setup): ')).trim();

  if (dbConnectionString) {
    ensurePgInstalled();
    const { Client } = require('pg');
    const client = new Client({ connectionString: dbConnectionString });

    console.log(colors.cyan + 'Connecting to Supabase Database...' + colors.reset);
    try {
      await client.connect();
      console.log(colors.green + '✔ Connected to database.' + colors.reset);

      const schemaSqlPath = path.join(process.cwd(), 'supabase_schema.sql');
      if (fs.existsSync(schemaSqlPath)) {
        console.log(colors.cyan + 'Reading supabase_schema.sql...' + colors.reset);
        const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');

        console.log(colors.cyan + 'Executing database schema setup...' + colors.reset);
        await client.query(schemaSql);
        console.log(colors.green + '✔ Database tables (leads, dnc, logs) and indexes successfully created!' + colors.reset);
      } else {
        console.warn(colors.yellow + 'Warning: supabase_schema.sql not found in the root directory!' + colors.reset);
      }
    } catch (err) {
      console.error(colors.red + 'Database setup failed: ' + err.message + colors.reset);
      console.log('You can still copy and paste the contents of `supabase_schema.sql` manually in the Supabase SQL editor.');
    } finally {
      await client.end();
    }
  } else {
    console.log(colors.yellow + 'Skipped database automation. Remember to copy/paste `supabase_schema.sql` statements manually in your Supabase SQL editor.' + colors.reset);
  }

  // --- Step 3: Collect Gemini Key & Other Configurations ---
  console.log(colors.cyan + '\n--- Step 3: Other Configurations ---' + colors.reset);
  
  const defaultGemini = envVars.GEMINI_API_KEY || config.geminiApiKey || '';
  const geminiApiKey = (await question(`Gemini API Key [${defaultGemini}]: `)).trim() || defaultGemini;

  const defaultSignature = envVars.BUSINESS_SIGNATURE || config.businessSignature || 'ApexReach';
  const businessSignature = (await question(`Business Signature [${defaultSignature}]: `)).trim() || defaultSignature;

  const defaultDryRun = envVars.DRY_RUN || (config.dryRun !== undefined ? String(config.dryRun) : 'true');
  const dryRun = (await question(`Dry-Run Mode (true/false) [${defaultDryRun}]: `)).trim().toLowerCase() || defaultDryRun;

  // --- Step 4: Write & Synchronize Settings ---
  console.log(colors.cyan + '\n--- Step 4: Writing Configurations ---' + colors.reset);

  // Update .env.local
  const envContent = `# Auto-generated Environment Variables by Setup Script
STORAGE_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}
GEMINI_API_KEY=${geminiApiKey}
DRY_RUN=${dryRun}
BUSINESS_SIGNATURE="${businessSignature}"
`;
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(colors.green + '✔ Environment variables updated in .env.local' + colors.reset);

  // Update config.json
  config.storageMode = 'supabase';
  config.supabaseUrl = supabaseUrl;
  config.supabaseKey = supabaseServiceKey;
  config.geminiApiKey = geminiApiKey;
  config.businessSignature = businessSignature;
  config.dryRun = dryRun === 'true';
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  console.log(colors.green + '✔ Local configuration updated in config.json' + colors.reset);

  console.log(colors.green + colors.bright + '\n====================================================');
  console.log('      AUTOMATED CONFIGURATION SETUP COMPLETE!       ');
  console.log('====================================================' + colors.reset);
  console.log('\nDeploying checklist:');
  console.log(`1. ${colors.bright}Git Repo${colors.reset}: Create a GitHub repository and push your project code:`);
  console.log('   git init');
  console.log('   git add .');
  console.log('   git commit -m "initial commit"');
  console.log('   git remote add origin <your-repo-url>');
  console.log('   git push -u origin main');
  console.log(`2. ${colors.bright}Vercel${colors.reset}: Deploy your repository on Vercel. In Vercel Environment Variables, configure:`);
  console.log(`   - NEXT_PUBLIC_SUPABASE_URL`);
  console.log(`   - NEXT_PUBLIC_SUPABASE_ANON_KEY`);
  console.log(`   - SUPABASE_SERVICE_ROLE_KEY`);
  console.log(`   - GEMINI_API_KEY`);
  console.log(`   - DRY_RUN`);
  console.log(`   - BUSINESS_SIGNATURE`);
  console.log(`3. ${colors.bright}Railway${colors.reset}: Run "railway init" and "railway up" to host your background worker.`);
  console.log('   Configure the same environment variables on Railway.');

  rl.close();
}

runAutoSetup();
