/**
 * @file pageSpeed.ts
 * Google PageSpeed Insights API Integration (100% Free - 25,000 queries/day)
 * Auto-audits scraped lead websites to generate high-converting performance pitches.
 */

export interface PageSpeedMetrics {
  score: number; // 0 - 100
  fcpSeconds: string; // First Contentful Paint
  lcpSeconds: string; // Largest Contentful Paint
  speedPitchHook: string;
  diagnostics: string[];
  auditedAt: string;
}

/**
 * Queries Google PageSpeed Insights API (mobile strategy)
 */
export async function fetchPageSpeedMetrics(websiteUrl: string): Promise<PageSpeedMetrics | null> {
  if (!websiteUrl || !websiteUrl.startsWith('http')) {
    return null;
  }

  try {
    const encodedUrl = encodeURIComponent(websiteUrl);
    const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&strategy=mobile`;

    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000) // 8 second timeout
    });

    if (!response.ok) {
      console.warn(`[PageSpeed API] Failed for ${websiteUrl}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) {
      return null;
    }

    const scoreCategory = lighthouse.categories?.performance?.score;
    const score = Math.round((scoreCategory ?? 0.5) * 100);

    const fcpMetric = lighthouse.audits?.['first-contentful-paint']?.displayValue || '3.5 s';
    const lcpMetric = lighthouse.audits?.['largest-contentful-paint']?.displayValue || '5.2 s';

    const diagnostics: string[] = [];
    if (lighthouse.audits?.['render-blocking-resources']?.details?.items?.length) {
      diagnostics.push('Render-blocking CSS/JS slowing initial load');
    }
    if (lighthouse.audits?.['offscreen-images']?.score < 0.9) {
      diagnostics.push('Unoptimized oversized images');
    }
    if (lighthouse.audits?.['uses-optimized-images']?.score < 0.9) {
      diagnostics.push('Missing WebP image compression');
    }

    // Generate high-converting cold pitch hook
    let speedPitchHook = '';
    if (score < 50) {
      speedPitchHook = `⚡ Your website mobile performance scores ${score}/100 and takes ${lcpMetric} to load. Studies show you lose over 40% of Lagos mobile visitors before the page opens.`;
    } else if (score < 80) {
      speedPitchHook = `⚡ Your website mobile speed scores ${score}/100. We can optimize your page load time from ${lcpMetric} down to sub-1.5s to increase customer inquiries.`;
    } else {
      speedPitchHook = `⚡ Your website scores a healthy ${score}/100 on Google Mobile Speed test.`;
    }

    return {
      score,
      fcpSeconds: fcpMetric,
      lcpSeconds: lcpMetric,
      speedPitchHook,
      diagnostics: diagnostics.length ? diagnostics : ['General mobile speed optimization recommended'],
      auditedAt: new Date().toISOString()
    };
  } catch (err: any) {
    console.warn(`[PageSpeed API Error] ${websiteUrl}: ${err.message}`);
    return null;
  }
}
