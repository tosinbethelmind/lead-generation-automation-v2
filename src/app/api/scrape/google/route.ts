// src/app/api/scrape/google/route.ts
import { NextRequest } from 'next/server';
import { POST as mapsPOST } from '../maps/route';

/**
 * POST /api/scrape/google
 * Alias for the main Google Places API scraper.
 */
export async function POST(req: NextRequest) {
  return mapsPOST(req);
}
