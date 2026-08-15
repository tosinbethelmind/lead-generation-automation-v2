import { NextRequest, NextResponse } from 'next/server';
import { SECTOR_PROFILES } from '@/config/sectors';

export const dynamic = 'force-dynamic';

/**
 * GET /api/widget/calculator
 * Returns dynamic, self-executing JavaScript bundle that allows ANY external
 * third-party website (WordPress, Shopify, Webflow, Wix, HTML, React) to embed
 * live Bethelmind Analytics / ApexReach sector calculators.
 *
 * Usage on external site:
 * <script src="https://www.bethelmindanalytics.com/api/widget/calculator.js" data-sector="solar" data-color="#06b6d4"></script>
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectorQuery = searchParams.get('sector') || 'solar';

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

    const defaultSector = SECTOR_PROFILES[sectorQuery] || SECTOR_PROFILES.solar;

    const jsBundle = `
(function() {
  if (window.__BETHEL_SECTOR_CALCULATOR_LOADED__) return;
  window.__BETHEL_SECTOR_CALCULATOR_LOADED__ = true;

  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var targetSector = (currentScript && currentScript.getAttribute('data-sector')) || "${sectorQuery}";
  var customColor = (currentScript && currentScript.getAttribute('data-color')) || "${defaultSector.color}";
  var buttonText = (currentScript && currentScript.getAttribute('data-button-text')) || "⚡ Open 2026 Calculator";
  var origin = "${appOrigin}";

  function mountCalculatorWidget() {
    if (!document.body) return setTimeout(mountCalculatorWidget, 50);
    if (document.getElementById('bethelmind-calculator-widget-root')) return;

    var container = document.createElement('div');
    container.id = 'bethelmind-calculator-widget-root';
    container.style.cssText = 'position:fixed;bottom:24px;left:24px;z-index:999990;font-family:Inter,system-ui,-apple-system,sans-serif;pointer-events:none;';

    var button = document.createElement('button');
    button.type = 'button';
    button.style.cssText = 'pointer-events:auto;background:linear-gradient(135deg, ' + customColor + ', #7c3aed);color:#fff;border:none;border-radius:100px;padding:12px 20px;font-weight:800;font-size:13px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,0.35);display:flex;align-items:center;gap:8px;transition:transform 0.2s;outline:none;';
    button.innerHTML = '<span>⚡</span> <span>' + buttonText + '</span>';

    var popupRef = null;
    var popupUrl = origin + '/#sector-tools';
    var popupOpts = 'width=620,height=750,top=' + Math.max(0, (screen.height - 750) / 2) + ',left=' + Math.max(0, (screen.width - 620) / 2) + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no';

    button.onclick = function() {
      if (popupRef && !popupRef.closed) {
        popupRef.focus();
        return;
      }
      popupRef = window.open(popupUrl, 'BethelmindCalculator_' + targetSector, popupOpts);
      if (!popupRef) {
        window.open(popupUrl, '_blank', 'noopener');
      }
    };

    container.appendChild(button);
    document.body.appendChild(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCalculatorWidget);
  } else {
    mountCalculatorWidget();
  }
})();
`;

    return new NextResponse(jsBundle, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
        'Content-Security-Policy': 'frame-ancestors *',
      },
    });
  } catch (err: any) {
    return new NextResponse(`console.error("Bethelmind Calculator Widget Error:", "${err.message}");`, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
