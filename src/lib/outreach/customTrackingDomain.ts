/**
 * @file src/lib/outreach/customTrackingDomain.ts
 * 
 * 2026 CUSTOM TRACKING DOMAIN (CTD) LINK ALIGNMENT MODULE
 * 
 * Aligns outbound link domains with sender domain (bethelmindanalytics.com)
 * to eliminate third-party domain mismatch flags in Gmail, Yahoo, and Outlook.
 */

export const CUSTOM_TRACKING_DOMAIN = process.env.CUSTOM_TRACKING_DOMAIN || 'https://track.bethelmindanalytics.com';
export const MAIN_PRODUCTION_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';

/**
 * Wraps a target destination URL with custom domain click-tracking parameter alignment.
 */
export function wrapTrackingLink(
  targetUrl: string,
  leadId: string = 'generic',
  channel: string = 'email'
): string {
  if (!targetUrl) return MAIN_PRODUCTION_DOMAIN;

  // Ensure absolute URL
  let dest = targetUrl;
  if (dest.startsWith('/')) {
    dest = `${MAIN_PRODUCTION_DOMAIN}${dest}`;
  }

  // Generate clean tracking URL using production custom tracking domain
  const encodedDest = encodeURIComponent(dest);
  const encodedLead = encodeURIComponent(leadId);
  const encodedChan = encodeURIComponent(channel);

  return `${CUSTOM_TRACKING_DOMAIN}/r?dest=${encodedDest}&lid=${encodedLead}&chn=${encodedChan}`;
}

/**
 * Rewrites all anchor href links inside HTML email content to use the Custom Tracking Domain.
 */
export function wrapAllHtmlLinks(html: string, leadId: string = 'generic', channel: string = 'email'): string {
  if (!html) return '';

  const hrefRegex = /href=["'](https?:\/\/[^"']+)["']/gi;
  return html.replace(hrefRegex, (match, url) => {
    // Skip unsubscribe and asset links
    if (url.includes('/api/dnc') || url.includes('/assets/') || url.includes('.png') || url.includes('.jpg')) {
      return match;
    }
    const wrapped = wrapTrackingLink(url, leadId, channel);
    return `href="${wrapped}"`;
  });
}
