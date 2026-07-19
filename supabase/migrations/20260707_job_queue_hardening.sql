-- 1. Add retries column if it doesn't exist
ALTER TABLE scrape_jobs ADD COLUMN IF NOT EXISTS retries INTEGER DEFAULT 0;

-- 2. Create atomic dequeue function using SELECT FOR UPDATE SKIP LOCKED
CREATE OR REPLACE FUNCTION dequeue_next_scrape_job()
RETURNS TABLE (
  id UUID,
  type TEXT,
  status TEXT,
  payload JSONB,
  result JSONB,
  error_message TEXT,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  retries INTEGER
) AS $$
DECLARE
  v_job_id UUID;
BEGIN
  -- Atomically find and lock the next queued job
  SELECT j.id INTO v_job_id
  FROM scrape_jobs j
  WHERE j.status = 'queued'
  ORDER BY j.created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  -- If a job was found, update its status to 'running'
  IF v_job_id IS NOT NULL THEN
    UPDATE scrape_jobs
    SET 
      status = 'running',
      updated_at = now()
    WHERE scrape_jobs.id = v_job_id;

    -- Return the selected row
    RETURN QUERY
    SELECT 
      j.id,
      j.type,
      j.status,
      j.payload,
      j.result,
      j.error_message,
      j.user_id,
      j.created_at,
      j.updated_at,
      j.retries
    FROM scrape_jobs j
    WHERE j.id = v_job_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Create stale job recovery function
CREATE OR REPLACE FUNCTION recover_stuck_jobs(
  p_timeout_minutes INTEGER,
  p_max_retries INTEGER
)
RETURNS TABLE (
  recovered_count INTEGER
) AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Mark jobs as failed if they exceed max_retries and have been running too long
  UPDATE scrape_jobs
  SET 
    status = 'failed',
    error_message = 'Job timed out and exceeded maximum retries.',
    updated_at = now()
  WHERE status = 'running'
    AND updated_at < (now() - (p_timeout_minutes || ' minutes')::interval)
    AND retries >= p_max_retries;

  -- Reset jobs back to queued if they have been running too long but have retries left
  WITH updated AS (
    UPDATE scrape_jobs
    SET 
      status = 'queued',
      retries = retries + 1,
      updated_at = now()
    WHERE status = 'running'
      AND updated_at < (now() - (p_timeout_minutes || ' minutes')::interval)
      AND retries < p_max_retries
    RETURNING id
  )
  SELECT count(*) INTO v_count FROM updated;

  RETURN QUERY SELECT v_count;
END;
$$ LANGUAGE plpgsql;
