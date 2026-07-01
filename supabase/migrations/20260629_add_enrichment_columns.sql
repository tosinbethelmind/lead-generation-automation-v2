-- Add enrichment columns to public.leads table if they do not exist
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS business_hours TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS reviews_data TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS photos_data TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS social_links TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS services_data TEXT;
