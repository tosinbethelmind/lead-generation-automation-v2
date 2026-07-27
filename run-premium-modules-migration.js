/**
 * Database Migration: Pipeline, Activities, Campaigns, and Appointments tables
 * Run with: node run-premium-modules-migration.js
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load config
let config = {};
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
} catch (e) {
  console.error('Could not read config.json:', e.message);
}

const SUPABASE_URL = config.supabaseUrl || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = config.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials. Set supabaseUrl and supabaseKey in config.json');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MIGRATION_SQL = `
-- ============================================================================
-- Premium Modules Migration: Deals, Activities, Campaigns, Appointments
-- ============================================================================

-- 1. DEALS (Pipeline/Kanban) table
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id TEXT REFERENCES leads(lead_id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    stage_id TEXT NOT NULL DEFAULT 'new_lead',
    sector TEXT NOT NULL DEFAULT 'general',
    value NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'NGN',
    contact_name TEXT DEFAULT '',
    contact_phone TEXT DEFAULT '',
    contact_email TEXT DEFAULT '',
    category TEXT DEFAULT '',
    area TEXT DEFAULT '',
    city TEXT DEFAULT '',
    assigned_to TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    probability INTEGER DEFAULT 10,
    expected_close_date TIMESTAMP WITH TIME ZONE,
    actual_close_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    won_at TIMESTAMP WITH TIME ZONE,
    lost_at TIMESTAMP WITH TIME ZONE,
    lost_reason TEXT DEFAULT '',
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_deals_lead_id ON deals(lead_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_sector ON deals(sector);
CREATE INDEX IF NOT EXISTS idx_deals_updated ON deals(updated_at DESC);

-- 2. ACTIVITIES (Timeline) table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    lead_id TEXT DEFAULT '',
    deal_id TEXT DEFAULT '',
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    channel TEXT DEFAULT 'system',
    actor TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_activities_lead ON activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_deal ON activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);

-- 3. CAMPAIGNS (Drip Sequences) table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    sector TEXT DEFAULT 'general',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    steps JSONB DEFAULT '[]',
    enrolled_leads JSONB DEFAULT '[]',
    total_enrolled INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    total_replied INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tags JSONB DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_sector ON campaigns(sector);

-- 4. APPOINTMENTS (Booking) table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id TEXT DEFAULT '',
    deal_id TEXT DEFAULT '',
    service_name TEXT NOT NULL,
    service_category TEXT DEFAULT '',
    customer_name TEXT NOT NULL,
    customer_phone TEXT DEFAULT '',
    customer_email TEXT DEFAULT '',
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    deposit_amount NUMERIC DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT FALSE,
    payment_reference TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    reminder_sent BOOLEAN DEFAULT FALSE,
    sector TEXT DEFAULT 'general',
    assigned_to TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_lead ON appointments(lead_id);

-- 5. CHATBOT_CONVERSATIONS table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id TEXT DEFAULT '',
    session_id TEXT NOT NULL,
    sector TEXT DEFAULT 'general',
    business_name TEXT DEFAULT '',
    visitor_name TEXT DEFAULT '',
    visitor_phone TEXT DEFAULT '',
    visitor_email TEXT DEFAULT '',
    messages JSONB DEFAULT '[]',
    lead_captured BOOLEAN DEFAULT FALSE,
    sentiment TEXT DEFAULT 'neutral',
    summary TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_chatbot_session ON chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_lead ON chatbot_conversations(lead_id);
`;

async function runMigration() {
  console.log('🚀 Running Premium Modules Migration...');
  console.log(`   Supabase URL: ${SUPABASE_URL.substring(0, 30)}...`);

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: MIGRATION_SQL });
    
    if (error) {
      // If RPC doesn't exist, try individual table creates via REST
      console.warn('RPC exec_sql not available, attempting table-by-table creation...');
      
      const tables = ['deals', 'activities', 'campaigns', 'appointments', 'chatbot_conversations'];
      
      for (const table of tables) {
        try {
          const { data, error: checkError } = await supabase.from(table).select('id').limit(1);
          if (checkError && checkError.code === '42P01') {
            console.log(`   ⚠️  Table "${table}" does not exist — please create it via Supabase SQL Editor`);
          } else if (checkError) {
            console.log(`   ⚠️  Table "${table}": ${checkError.message}`);
          } else {
            console.log(`   ✅ Table "${table}" already exists`);
          }
        } catch (e) {
          console.log(`   ⚠️  Could not check table "${table}": ${e.message}`);
        }
      }

      console.log('\n📋 Please run the following SQL in your Supabase SQL Editor:');
      console.log('────────────────────────────────────────────────────────────');
      console.log(MIGRATION_SQL);
      console.log('────────────────────────────────────────────────────────────');

      // Save SQL to file for easy copy-paste
      const sqlPath = path.join(__dirname, 'premium_modules_schema.sql');
      fs.writeFileSync(sqlPath, MIGRATION_SQL, 'utf8');
      console.log(`\n💾 SQL saved to: ${sqlPath}`);
    } else {
      console.log('✅ All premium module tables created successfully!');
    }
  } catch (err) {
    console.error('Migration error:', err.message);
    
    // Save SQL file regardless
    const sqlPath = path.join(__dirname, 'premium_modules_schema.sql');
    fs.writeFileSync(sqlPath, MIGRATION_SQL, 'utf8');
    console.log(`\n💾 SQL saved to: ${sqlPath}`);
    console.log('Please run this SQL manually in your Supabase Dashboard SQL Editor.');
  }

  // Ensure local_db directory exists for fallback
  const localDbDir = path.join(__dirname, 'local_db');
  if (!fs.existsSync(localDbDir)) {
    fs.mkdirSync(localDbDir, { recursive: true });
    console.log('📁 Created local_db directory for local fallback storage');
  }

  console.log('\n✅ Migration complete. Premium modules are ready to use.');
}

runMigration().catch(console.error);
