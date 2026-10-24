'use client';

import Script from 'next/script';

/**
 * Microsoft Clarity CX & Behavioral Telemetry Integration
 * 
 * Provides:
 * - Real user session replays
 * - Heatmaps (click, scroll, area)
 * - Rage-click & dead-click detection
 * - JavaScript client-side error telemetry
 * - Core Web Vitals telemetry
 * 
 * Activates seamlessly when NEXT_PUBLIC_CLARITY_PROJECT_ID is defined in .env
 */
export default function MicrosoftClarity() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!clarityId) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  );
}
