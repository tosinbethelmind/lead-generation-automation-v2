-- Add generated_copy, design_theme, overrides, and email_verified columns to public.leads table if they do not exist
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS generated_copy JSONB;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS design_theme JSONB;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS overrides JSONB;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT NULL;
