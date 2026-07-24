import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const MAIN_SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const MAIN_SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

const supabase = createClient(MAIN_SUPABASE_URL, MAIN_SUPABASE_KEY, { auth: { persistSession: false } });

export async function GET() {
  try {
    // 1. Fetch total scraped solar installers in Nigeria
    const { count: totalScraped, error: countErr } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('category', 'solar_installer');

    // 2. Fetch contacted installer outreach count
    const { count: totalContacted } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('category', 'solar_installer')
      .eq('status', 'CONTACTED');

    // 3. Count scraped public installer group links
    let groupLinksCount = 0;
    const groupLinksPath = path.join(process.cwd(), 'local_db', 'scraped_group_links.json');
    if (fs.existsSync(groupLinksPath)) {
      try {
        const groups = JSON.parse(fs.readFileSync(groupLinksPath, 'utf8'));
        groupLinksCount = Array.isArray(groups) ? groups.length : 0;
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalScrapedInstallers: totalScraped || 0,
        totalContactedOutreach: totalContacted || 0,
        groupLinksDiscovered: groupLinksCount,
        dualSyncStatus: 'online',
        targetMarket: 'Nigeria (36 States + FCT)',
        targetDomain: 'www.solarquotepro.ng'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const dryRun = body.dryRun ?? false;
    const count = body.count || 2500;
    const channels = body.channels || ['groups', 'web_forms', 'email', 'jiji'];

    const scriptPath = path.join(process.cwd(), 'scripts', 'solarquotepro_multi_channel_outreach.js');
    const args = ['--count', String(count), '--channels', channels.join(',')];
    if (dryRun) args.push('--dry-run');

    console.log(`[API] Launching SolarQuotePro Outreach Arm: node ${scriptPath} ${args.join(' ')}`);

    const child = spawn('node', [scriptPath, ...args], {
      detached: true,
      stdio: 'ignore',
      shell: true
    });

    child.unref();

    return NextResponse.json({
      success: true,
      message: 'SolarQuotePro Multi-Channel Outreach Pipeline launched successfully in background.',
      config: {
        targetCount: count,
        dryRun: dryRun,
        channels: channels
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
