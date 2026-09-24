'use client';

/**
 * @file src/components/ChatwootWidget.tsx
 * Lightweight asynchronous Chatwoot Live Chat SDK Loader
 *
 * Only initializes if NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN is present in env.
 * Guarantees 0ms main thread blocking and zero layout shift.
 */

import { useEffect } from 'react';

interface ChatwootWidgetProps {
  businessName?: string;
  leadId?: string;
}

export default function ChatwootWidget({ businessName, leadId }: ChatwootWidgetProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;
    const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || 'https://app.chatwoot.com';

    if (!websiteToken) return;

    // Initialize Chatwoot SDK
    (function(d: Document, t: string) {
      const g = d.createElement(t) as HTMLScriptElement;
      const s = d.getElementsByTagName(t)[0];
      g.src = `${baseUrl.replace(/\/$/, '')}/packs/js/sdk.js`;
      g.defer = true;
      g.async = true;
      s.parentNode?.insertBefore(g, s);
      g.onload = function() {
        if ((window as any).chatwootSDK) {
          (window as any).chatwootSDK.run({
            websiteToken,
            baseUrl
          });

          // Set custom lead attributes if available
          if (businessName || leadId) {
            window.addEventListener('chatwoot:ready', function () {
              if ((window as any).$chatwoot) {
                (window as any).$chatwoot.setCustomAttributes({
                  businessName: businessName || '',
                  leadId: leadId || '',
                  previewUrl: window.location.href
                });
              }
            });
          }
        }
      };
    })(document, 'script');
  }, [businessName, leadId]);

  return null;
}
