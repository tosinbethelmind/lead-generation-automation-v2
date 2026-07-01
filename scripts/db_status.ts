import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

function loadConfig() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const urlMatch = content.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)/);
    const keyMatch = content.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']?([^"'\r\n]+)/);
    if (urlMatch && !supabaseUrl) supabaseUrl = urlMatch[1];
    if (keyMatch && !supabaseKey) supabaseKey = keyMatch[1];
  }

  const configPath = path.resolve(process.cwd(), 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (!supabaseUrl) supabaseUrl = config.supabaseUrl || '';
      if (!supabaseKey) supabaseKey = config.supabaseKey || '';
    } catch (e) {}
  }

  return { supabaseUrl, supabaseKey };
}

const { supabaseUrl, supabaseKey } = loadConfig();
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkJobs() {
  const { data: jobs, error } = await supabase
    .from('scrape_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching jobs:', error.message);
    return;
  }

  console.log('=========================================');
  console.log('📊 RECENT SCRAPE JOBS IN DATABASE');
  console.log('=========================================');
  jobs.forEach(job => {
    console.log(`ID: ${job.id} | Type: ${job.type} | Status: ${job.status} | Created: ${job.created_at}`);
  });
  console.log('=========================================');
}

checkJobs();
