-- Add index on profile_url for deduplication performance under load
CREATE INDEX IF NOT EXISTS idx_leads_profile_url ON public.leads(profile_url);
