import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

/**
 * GET /api/widget/[leadId]
 * Returns dynamic, self-executing JavaScript bundle that injects the
 * 24/7 WhatsApp AI Chatbot & Quote Estimator directly onto the client's existing website.
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

    let lead = null;
    try {
      const repo = getActiveLeadRepository();
      lead = await Promise.race([
        repo.getLeadById(leadId),
        new Promise((resolve) => setTimeout(() => resolve(null), 500))
      ]) as any;
    } catch (_) {}

    const businessName = lead ? lead.name : leadId.replace(/[^a-zA-Z0-9]+/g, ' ').toUpperCase();
    const sector = lead ? lead.category || 'B2B Services' : 'General Business';
    const appOrigin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';

    const jsBundle = `
(function() {
  if (window.__BETHEL_AI_WIDGET_LOADED__) return;
  window.__BETHEL_AI_WIDGET_LOADED__ = true;

  var leadId = "${leadId}";
  var businessName = "${businessName.replace(/"/g, '\\"')}";
  var sector = "${sector.replace(/"/g, '\\"')}";
  var origin = "${appOrigin}";

  // Create floating button container
  var container = document.createElement('div');
  container.id = 'bethelmind-ai-widget-root';
  container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;font-family:Inter,system-ui,sans-serif;';

  // Launcher Button
  var button = document.createElement('button');
  button.style.cssText = 'background:linear-gradient(135deg,#06b6d4,#8b5cf6);color:#fff;border:none;border-radius:30px;padding:12px 20px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 10px 25px rgba(6,182,212,0.4);display:flex;align-items:center;gap:8px;transition:all 0.2s;';
  button.innerHTML = '🤖 <span>Chat with ' + businessName + ' AI</span>';

  // Modal Frame
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'display:none;width:380px;height:520px;border:1px solid rgba(255,255,255,0.15);border-radius:20px;box-shadow:0 25px 50px rgba(0,0,0,0.5);background:#0f172a;margin-bottom:12px;';
  iframe.src = origin + '/preview/' + encodeURIComponent(leadId) + '?embed=true';

  button.onclick = function() {
    if (iframe.style.display === 'none') {
      iframe.style.display = 'block';
      button.innerHTML = '❌ <span>Close Chat</span>';
    } else {
      iframe.style.display = 'none';
      button.innerHTML = '🤖 <span>Chat with ' + businessName + ' AI</span>';
    }
  };

  container.appendChild(iframe);
  container.appendChild(button);
  document.body.appendChild(container);
})();
`;

    return new NextResponse(jsBundle, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err: any) {
    return new NextResponse(`console.error("Bethelmind AI Widget Error:", "${err.message}");`, {
      headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
    });
  }
}
