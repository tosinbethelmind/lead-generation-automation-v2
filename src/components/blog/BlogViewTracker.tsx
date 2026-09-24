'use client';

import React, { useEffect, useState } from 'react';

interface BlogViewTrackerProps {
  slug: string;
  initialViews: number;
}

export function BlogViewTracker({ slug, initialViews }: BlogViewTrackerProps) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Session Identifier & Deduplication
    let sessionId = sessionStorage.getItem('bm_visitor_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      sessionStorage.setItem('bm_visitor_session_id', sessionId);
    }

    // Capture referrer and campaign tracking parameters
    const referrer = document.referrer || 'direct';
    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get('utm_source') || '';
    const utmMedium = searchParams.get('utm_medium') || '';
    const utmCampaign = searchParams.get('utm_campaign') || '';

    const sendTelemetry = (payload: Record<string, any>) => {
      fetch('/api/blog/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          referrer,
          utmSource,
          utmMedium,
          utmCampaign,
          sessionId,
          ...payload,
        }),
        keepalive: true,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && typeof data.views_count === 'number') {
            setViews(data.views_count);
          }
        })
        .catch(() => {});
    };

    // 2. Initial Page View (deduplicated per browser session)
    const viewSessionKey = `bm_real_view_${slug}`;
    if (!sessionStorage.getItem(viewSessionKey)) {
      sessionStorage.setItem(viewSessionKey, '1');
      sendTelemetry({ eventType: 'page_view' });
    }

    // 3. Automated Scroll Depth Tracking (25%, 50%, 75%, 100%)
    const trackedDepths = new Set<number>();
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const currentScroll = window.scrollY;
      const percentage = Math.round((currentScroll / docHeight) * 100);

      const milestones = [25, 50, 75, 100];
      for (const milestone of milestones) {
        if (percentage >= milestone && !trackedDepths.has(milestone)) {
          trackedDepths.add(milestone);
          sendTelemetry({
            eventType: 'scroll_depth',
            scrollDepth: milestone,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 4. Automated Dwell Time Reading Heartbeats (30s, 60s, 120s, 300s)
    let elapsedSeconds = 0;
    const dwellInterval = setInterval(() => {
      if (document.hidden) return; // Pause dwell timer when tab is hidden
      elapsedSeconds += 10;
      if ([30, 60, 120, 300].includes(elapsedSeconds)) {
        sendTelemetry({
          eventType: 'dwell_time',
          dwellSeconds: elapsedSeconds,
        });
      }
    }, 10000);

    // 5. Automated In-Article CTA Click Tracking
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href') || '';

      let ctaTarget = '';
      if (href.includes('selar.co') || href.includes('gumroad.com')) {
        ctaTarget = 'selar_digital_asset_click';
      } else if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        ctaTarget = 'whatsapp_closer_desk_click';
      } else if (href.includes('/preview/') || href.includes('prototype')) {
        ctaTarget = 'dfy_prototype_claim_click';
      }

      if (ctaTarget) {
        sendTelemetry({
          eventType: 'cta_click',
          ctaTarget,
        });
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(dwellInterval);
      document.removeEventListener('click', handleClick);
    };
  }, [slug]);

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-400"
      style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
      title="Verified Real Reader Views"
    >
      👁 {views.toLocaleString()} {views === 1 ? 'real view' : 'real views'}
    </span>
  );
}
