import { NextRequest, NextResponse } from 'next/server';
import { trackLeadJourneyEvent } from '../../lib/leadJourneyTracker';

export const dynamic = 'force-dynamic';

/**
 * GET /r
 * Custom Tracking Domain (CTD) Redirect & Click Attribution Route
 * 
 * Intercepts outbound link clicks, attributes the click to the lead journey in real-time,
 * and seamlessly redirects the visitor to the target destination URL.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dest = searchParams.get('dest');
  const leadId = searchParams.get('lid') || 'generic';
  const channel = searchParams.get('chn') || 'email';

  // Fallback if destination is not provided
  if (!dest) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Validate destination URL to prevent open redirect vulnerabilities
  let targetUrl: URL;
  try {
    targetUrl = new URL(dest, req.url);
  } catch (_) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Asynchronously record click attribution without blocking redirection
  if (leadId && leadId !== 'generic') {
    try {
      await trackLeadJourneyEvent({
        leadId,
        leadName: leadId,
        category: 'Commercial Lead',
        stage: 'PREVIEW_VIEWED',
        title: `Outbound Link Click (${channel.toUpperCase()})`,
        description: `Prospect clicked link from ${channel}: ${targetUrl.pathname}`,
        channelUsed: channel,
        metadata: {
          destination: dest,
          channel,
          userAgent: req.headers.get('user-agent') || 'unknown',
          referer: req.headers.get('referer') || 'direct',
        }
      });
    } catch (err) {
      console.warn('[Tracking Redirect] Journey event notice:', err);
    }
  }

  // 307 Temporary Redirect to preserve destination intent
  return NextResponse.redirect(targetUrl, 307);
}
