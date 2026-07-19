import { createClient } from '@supabase/supabase-js';

const url = process.env.SOLARQUOTEPRO_SUPABASE_URL || 'https://pnsrjsyiygxdcxkpgbzx.supabase.co';
const key = process.env.SOLARQUOTEPRO_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc3Jqc3lpeWd4ZGN4a3BnYnp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDM1NDUxNywiZXhwIjoyMDk1OTMwNTE3fQ.uNuu3YwMOGS2uZR4S8mayKX_wivIXnDyOrf2vROhna8';

export const solarQuoteProSupabase = createClient(url, key, {
  auth: {
    persistSession: false,
  },
});
