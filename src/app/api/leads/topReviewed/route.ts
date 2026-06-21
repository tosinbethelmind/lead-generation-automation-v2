// src/app/api/leads/topReviewed/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getActiveLeadRepository } from '@/lib/googleSheets';

/**
 * GET /api/leads/topReviewed?limit=20
 * Returns the top reviewed leads sorted by rating then reviews count.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 20;
  const repo = getActiveLeadRepository();
  // The repository now implements getTopReviewedLeads
  // @ts-ignore - method exists on both implementations
  const leads = await (repo as any).getTopReviewedLeads(limit);
  return NextResponse.json({ leads });
}
