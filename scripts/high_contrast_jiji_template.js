/**
 * ⚡ HIGH-CONTRAST STREET-SMART JIJI BANNER TEMPLATE
 * Designed specifically for Nigerian mobile classifieds psychology:
 * - Bright, crisp background (White / Light Studio Gray with deep Royal Navy accents)
 * - MASSIVE 4-6 word headline legible from 3 feet away on a 1.5-inch smartphone thumbnail
 * - Clear, high-contrast device mockup showing authentic Nigerian business UI (products, Naira, WhatsApp)
 * - 3 High-Impact Trust Chips (24h Delivery, Test Free on Phone, No Tech Skills Needed)
 * - ZERO Phone Numbers & ZERO Prices (100% Jiji policy safe)
 */

function generateHighContrastHtml(ad) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Space+Grotesk:wght@700;800;900&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      width: 1200px;
      height: 1200px;
      background: #ffffff;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #0f172a;
      padding: 50px 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    /* Subtle background grid & top accent bar */
    .top-accent-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 14px;
      background: linear-gradient(90deg, #1d4ed8 0%, ${ad.accentColor} 50%, #d97706 100%);
    }

    .bg-light-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(#e2e8f0 1.2px, transparent 1.2px),
        radial-gradient(#f1f5f9 1.2px, #ffffff 1.2px);
      background-size: 30px 30px;
      background-position: 0 0, 15px 15px;
      opacity: 0.7;
      z-index: 1;
    }

    /* Header Bar */
    .header-bar {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #f1f5f9;
    }

    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .brand-badge {
      width: 48px;
      height: 48px;
      background: #0f172a;
      color: #ffffff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 900;
      font-size: 26px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-company {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 21px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.4px;
    }

    .brand-tagline {
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .cac-verified-badge {
      background: #f0fdf4;
      border: 2px solid #86efac;
      padding: 8px 18px;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 800;
      color: #15803d;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(21, 128, 61, 0.1);
    }

    /* Main Showcase Stage */
    .main-stage {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
      height: 790px;
    }

    /* Left Copy Column */
    .left-col {
      flex: 1.15;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .sector-badge {
      align-self: flex-start;
      background: ${ad.accentColor}18;
      border: 2px solid ${ad.accentColor};
      color: ${ad.accentColor};
      padding: 7px 18px;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 1.2px;
      text-transform: uppercase;
    }

    /* THE MASSIVE BILLBOARD HEADLINE */
    .billboard-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 54px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -1.5px;
      color: #0f172a;
    }

    .highlight-span {
      color: ${ad.accentColor};
      background: linear-gradient(180deg, transparent 65%, ${ad.accentColor}25 65%);
    }

    .plain-subtext {
      font-size: 22px;
      font-weight: 700;
      color: #334155;
      line-height: 1.4;
      max-width: 550px;
    }

    /* High-Impact Benefit Cards */
    .benefits-box {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 6px;
    }

    .benefit-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      padding: 14px 18px;
      border-radius: 14px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }

    .benefit-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #10b981;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 15px;
      flex-shrink: 0;
    }

    .benefit-text {
      font-size: 18px;
      font-weight: 800;
      color: #1e293b;
    }

    /* Right Column: Clean, Bright Device Frame */
    .right-col {
      flex: 0.95;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .device-shell {
      width: 370px;
      height: 700px;
      background: #0f172a;
      border-radius: 46px;
      padding: 12px;
      box-shadow: 
        0 25px 60px -15px rgba(15, 23, 42, 0.4),
        0 0 0 1px rgba(15, 23, 42, 0.1);
      position: relative;
    }

    .screen-inner {
      width: 100%;
      height: 100%;
      background: #f8fafc;
      border-radius: 36px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 2px solid #e2e8f0;
    }

    /* Mobile Browser Top Bar */
    .browser-header {
      background: #ffffff;
      padding: 14px 18px 10px 18px;
      border-bottom: 1.5px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .browser-status-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
    }

    .browser-url-pill {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Mobile Page Content Inside Phone */
    .screen-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
      background: #ffffff;
    }

    .merchant-banner {
      background: linear-gradient(135deg, ${ad.accentColor} 0%, #1e293b 100%);
      color: #ffffff;
      padding: 16px;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .merchant-name {
      font-size: 15px;
      font-weight: 900;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .merchant-subtitle {
      font-size: 11px;
      color: #e2e8f0;
      font-weight: 600;
    }

    /* Sector Specific Interactive Widget in Screen */
    .screen-widget {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .widget-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .widget-tag {
      background: #e0f2fe;
      color: #0369a1;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 11px;
    }

    .widget-highlight {
      background: #dcfce7;
      color: #15803d;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Green WhatsApp Action Bar */
    .whatsapp-strip {
      background: #25d366;
      color: #ffffff;
      padding: 14px;
      border-radius: 12px;
      text-align: center;
      font-weight: 900;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);
      margin-top: auto;
    }

    /* Floating Trust Badges Outside Phone */
    .chip-top {
      position: absolute;
      top: 40px;
      right: -25px;
      background: #ffffff;
      border: 2px solid #f59e0b;
      padding: 12px 18px;
      border-radius: 16px;
      box-shadow: 0 12px 30px rgba(245, 158, 11, 0.2);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .chip-bottom {
      position: absolute;
      bottom: 50px;
      left: -30px;
      background: #ffffff;
      border: 2px solid #10b981;
      padding: 12px 18px;
      border-radius: 16px;
      box-shadow: 0 12px 30px rgba(16, 185, 129, 0.2);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .chip-title {
      font-size: 14px;
      font-weight: 900;
      color: #0f172a;
    }

    .chip-sub {
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
    }

    /* Bottom High-Impact Conversion Strip */
    .bottom-cta-strip {
      position: relative;
      z-index: 10;
      background: #0f172a;
      color: #ffffff;
      border-radius: 20px;
      padding: 22px 34px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
    }

    .cta-text-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .cta-heading {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 25px;
      font-weight: 900;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cta-body {
      font-size: 16px;
      font-weight: 700;
      color: #cbd5e1;
    }

    .cta-button {
      background: #22c55e;
      color: #ffffff;
      padding: 16px 30px;
      border-radius: 14px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 17px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Trust Footer */
    .trust-row {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      font-size: 14px;
      font-weight: 800;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="top-accent-bar"></div>
  <div class="bg-light-pattern"></div>

  <!-- Header Bar -->
  <div class="header-bar">
    <div class="brand-wrap">
      <div class="brand-badge">B</div>
      <div class="brand-text">
        <div class="brand-company">Bethelmind Digital Solutions</div>
        <div class="brand-tagline">Verified Nigerian Web & Tech Agency</div>
      </div>
    </div>
    <div class="cac-verified-badge">
      <span>🛡️</span> CAC Certified Enterprise (Reg: 9912717)
    </div>
  </div>

  <!-- Main Stage -->
  <div class="main-stage">
    
    <!-- Left Column: High-Impact Billboard Headline -->
    <div class="left-col">
      <div class="sector-badge">
        ${ad.badgeText}
      </div>

      <h1 class="billboard-title">
        ${ad.headline1} <br/>
        <span class="highlight-span">${ad.headlineHighlight}</span>
      </h1>

      <p class="plain-subtext">
        ${ad.subtext}
      </p>

      <div class="benefits-box">
        ${ad.benefits.map(b => `
          <div class="benefit-item">
            <div class="benefit-icon">✓</div>
            <div class="benefit-text">${b}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Right Column: Bright Smartphone Showcase -->
    <div class="right-col">
      <div class="device-shell">
        <div class="screen-inner">
          <div class="browser-header">
            <div class="browser-status-row">
              <span>9:41</span>
              <span>● 4G LTE</span>
            </div>
            <div class="browser-url-pill">
              <span>🔒</span> yourbusiness.com.ng
            </div>
          </div>

          <div class="screen-body">
            <div class="merchant-banner">
              <div class="merchant-name">
                <span>⭐</span> ${ad.mockShopName}
              </div>
              <div class="merchant-subtitle">${ad.mockShopSubtitle}</div>
            </div>

            <div class="screen-widget">
              <div class="widget-row">
                <span>Google Search Status:</span>
                <span class="widget-tag">Page 1 Verified</span>
              </div>
              <div class="widget-row">
                <span>36-State Delivery Fee:</span>
                <span class="widget-tag">Automatic Sizer</span>
              </div>
              <div class="widget-highlight">
                <span>⚡</span> ${ad.mockWidgetHighlight}
              </div>
            </div>

            <div class="whatsapp-strip">
              <span>💬</span> 24/7 WhatsApp AI Closer Active
            </div>
          </div>
        </div>
      </div>

      <!-- Floating High-Trust Chips -->
      <div class="chip-top">
        <span style="font-size: 22px;">⚡</span>
        <div>
          <div class="chip-title">Ready in 24 Hours</div>
          <div class="chip-sub">Live on Google Fast</div>
        </div>
      </div>

      <div class="chip-bottom">
        <span style="font-size: 22px;">📱</span>
        <div>
          <div class="chip-title">Test Free on Phone</div>
          <div class="chip-sub">Zero Tech Skills Needed</div>
        </div>
      </div>
    </div>

  </div>

  <!-- Bottom CTA Strip (100% Policy Clean: NO Phone, NO Price) -->
  <div class="bottom-cta-strip">
    <div class="cta-text-wrap">
      <div class="cta-heading">
        <span>⚡</span> Want to See a Free Live Demo for Your Business?
      </div>
      <div class="cta-body">
        Test your working mobile website prototype on your phone before paying anything!
      </div>
    </div>
    <div class="cta-button">
      <span>💬</span> TAP "START CHAT" ON JIJI
    </div>
  </div>

  <!-- Trust Footer -->
  <div class="trust-row">
    <div>✓ <strong>Official CAC Certified Enterprise</strong> (Reg: 9912717)</div>
    <div>✓ <strong>Direct Moniepoint Bank Integration</strong></div>
    <div>✓ <strong>Works on MTN, Airtel, Glo & 9mobile</strong></div>
  </div>

</body>
</html>`;
}

module.exports = { generateHighContrastHtml };
