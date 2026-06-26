-- ===========================================================================
-- Lead Pages Table for storing AI-generated landing page data per lead
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.lead_pages (
    lead_id UUID PRIMARY KEY REFERENCES public.leads(id) ON DELETE CASCADE,
    copy JSONB NOT NULL,
    theme JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for quick lookup by lead_id (already primary key)
CREATE INDEX IF NOT EXISTS idx_lead_pages_created_at ON public.lead_pages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.lead_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to lead_pages" ON public.lead_pages;
CREATE POLICY "Allow public access to lead_pages" ON public.lead_pages FOR ALL USING (true) WITH CHECK (true);
