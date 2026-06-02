import { createClient } from '@supabase/supabase-js';
import { getRuntimeConfig } from './localConfig';

export function getSupabaseClient() {
  const config = getRuntimeConfig();
  const supabaseUrl = config.supabaseUrl;
  const supabaseKey = config.supabaseKey;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase storage mode requires both supabaseUrl and supabaseKey parameters. Please configure them in your settings or environment.');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  });
}
