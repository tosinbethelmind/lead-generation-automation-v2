const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://szyuterncawfxwzhvwcf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eXV0ZXJuY2F3Znh3emh2d2NmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM5ODIwOSwiZXhwIjoyMDk3OTc0MjA5fQ._SzfC4NE4KCwWkK_GFQAyQjgkFrQLhbpz1w9R3FIUBY";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Querying scrape_jobs table via REST API...");
  const { data, error } = await supabase
    .from('scrape_jobs')
    .select('id')
    .limit(1);

  if (error) {
    console.error("REST API Query Failed:", error);
  } else {
    console.log("REST API Query Succeeded! Data:", data);
  }
}

run();
