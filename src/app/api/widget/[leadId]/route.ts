import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { findBundledLead, sanitizeDisplayName } from '@/lib/leadsBundle';


export const dynamic = 'force-dynamic';

/**
 * GET /api/widget/[leadId]
 * Returns dynamic, self-executing JavaScript bundle that injects the
 * 24/7 WhatsApp AI Chatbot & Quote Estimator directly onto any external client website (WordPress, Wix, Shopify, HTML).
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ leadId: string }> }
) {
  try {
    const params = await context.params;
    let leadId = params?.leadId || '';

    // Strip .js extension if requested (e.g. /api/widget/apex-solar-solutions.js)
    if (leadId.endsWith('.js')) {
      leadId = leadId.replace(/\.js$/, '');
    }

    let lead: any = findBundledLead(leadId);
    if (!lead) {
      try {
        const repo = getActiveLeadRepository();
        lead = await Promise.race([
          repo.getLeadById(leadId),
          new Promise((resolve) => setTimeout(() => resolve(null), 2500))
        ]) as any;
      } catch (_) {}
    }

    const businessName = sanitizeDisplayName(lead ? lead.name : leadId, lead?.category || 'B2B Services');
    const sector = lead ? lead.category || 'B2B Services' : 'General Business';

    let appOrigin = process.env.NEXT_PUBLIC_APP_URL || '';
    if (!appOrigin || appOrigin.includes('localhost') || appOrigin.includes('127.0.0.1')) {
      const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
      const proto = req.headers.get('x-forwarded-proto') || (req.url.startsWith('https') ? 'https' : 'http');
      if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
        appOrigin = `${proto}://${host}`;
      } else {
        appOrigin = 'https://www.bethelmindanalytics.com';
      }
    }

    const jsBundle = `
(function() {
  if (window.__BETHEL_AI_WIDGET_LOADED__) return;
  window.__BETHEL_AI_WIDGET_LOADED__ = true;

  var leadId = "${leadId}";
  var businessName = "${businessName.replace(/"/g, '\\"').replace(/\n/g, ' ')}";
  var sector = "${sector.replace(/"/g, '\\"').replace(/\n/g, ' ')}";
  var origin = "${appOrigin}";

  function mountWidget() {
    if (!document.body) {
      return setTimeout(mountWidget, 50);
    }
    if (document.getElementById('bethelmind-ai-widget-root')) return;

    // Create floating button container
    var container = document.createElement('div');
    container.id = 'bethelmind-ai-widget-root';
    container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;font-family:Inter,system-ui,-apple-system,sans-serif;display:flex;flex-direction:column;align-items:flex-end;pointer-events:none;';

    // Launcher Button
    var button = document.createElement('button');
    button.type = 'button';
    button.style.cssText = 'pointer-events:auto;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:30px;padding:14px 22px;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 10px 25px rgba(16,185,129,0.45);display:flex;align-items:center;gap:8px;transition:all 0.2s;outline:none;';
    button.innerHTML = '🤖 <span>Chat with ' + businessName + ' AI</span>';

    // Popup window reference
    var popupRef = null;
    var popupUrl = origin + '/preview/' + encodeURIComponent(leadId) + '?embed=true';
    var popupOpts = 'width=440,height=660,top=' + Math.max(0, (screen.height - 660) / 2) + ',left=' + Math.max(0, (screen.width - 440) / 2) + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no';

    button.onclick = function() {
      // If popup exists and is open, bring it to focus
      if (popupRef && !popupRef.closed) {
        popupRef.focus();
        button.innerHTML = '🤖 <span>Chat with ' + businessName + ' AI</span>';
        button.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        return;
      }
      // Open fresh popup — bypasses X-Frame-Options on all browsers
      popupRef = window.open(popupUrl, 'BethelmindAIChat_' + leadId, popupOpts);
      if (popupRef) {
        button.innerHTML = '✅ <span>Chat Opened</span>';
        button.style.background = 'linear-gradient(135deg,#059669,#047857)';
        // Reset button when popup is closed
        var checkClosed = setInterval(function() {
          if (!popupRef || popupRef.closed) {
            clearInterval(checkClosed);
            button.innerHTML = '🤖 <span>Chat with ' + businessName + ' AI</span>';
            button.style.background = 'linear-gradient(135deg,#10b981,#059669)';
            popupRef = null;
          }
        }, 800);
      } else {
        // Popup was blocked by browser — fallback: open in new tab
        window.open(popupUrl, '_blank', 'noopener');
      }
    };

    container.appendChild(button);
    document.body.appendChild(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountWidget);
  } else {
    mountWidget();
  }
})();
`;

    return new NextResponse(jsBundle, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
        'Content-Security-Policy': 'frame-ancestors *'
      }
    });

  } catch (err: any) {
    return new NextResponse(`console.error("Bethelmind AI Widget Error:", "${err.message}");`, {
      headers: { 
        'Content-Type': 'application/javascript; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
