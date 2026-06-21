// src/app/api/scrape/queue.ts
export {
  createScrapeJob,
  getScrapeJob,
  updateScrapeJobStatus,
  deleteScrapeJob
} from '@/lib/supabaseClient';
export type {
  ScrapeJobType,
  ScrapeJobStatus,
  ScrapeJob
} from '@/lib/supabaseClient';
