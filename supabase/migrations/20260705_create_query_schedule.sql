-- Create query_schedule table in Supabase
CREATE TABLE IF NOT EXISTS public.query_schedule (
    id TEXT PRIMARY KEY,
    month_year TEXT NOT NULL,
    auto_queue_enabled BOOLEAN DEFAULT TRUE,
    schedule JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and create policy for public access
ALTER TABLE public.query_schedule ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to query_schedule" ON public.query_schedule;
CREATE POLICY "Allow public access to query_schedule" ON public.query_schedule FOR ALL USING (true) WITH CHECK (true);
