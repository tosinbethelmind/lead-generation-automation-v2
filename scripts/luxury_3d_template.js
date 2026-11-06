const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

function generate3DLuxuryHtml(ad) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=Space+Grotesk:wght@600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      width: 1200px;
      height: 1200px;
      background: #030712;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #ffffff;
      padding: 55px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      perspective: 1600px;
    }

    /* 3D Atmospheric Studio Lighting */
    .studio-bg {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 85% 15%, ${ad.accentColor}33 0%, transparent 45%),
        radial-gradient(circle at 15% 85%, #d4af3728 0%, transparent 45%),
        radial-gradient(circle at 50% 50%, #0c1527 0%, #030712 100%);
      z-index: 1;
    }

    .ambient-glow {
      position: absolute;
      width: 700px;
      height: 700px;
      border-radius: 50%;
      background: radial-gradient(circle, ${ad.accentColor}25 0%, transparent 70%);
      filter: blur(100px);
      top: 20%;
      left: 25%;
      z-index: 2;
      pointer-events: none;
    }

    /* 3D Floor Perspective Grid */
    .perspective-grid {
      position: absolute;
      bottom: -150px;
      left: -200px;
      width: 1600px;
      height: 600px;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 50px 50px;
      transform: rotateX(75deg);
      transform-origin: bottom center;
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 75%);
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 75%);
      z-index: 2;
    }

    /* Header Bar */
    .header-bar {
      position: relative;
      z-index: 20;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 25px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .brand-cluster {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-emblem {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #FFF2A3 0%, #D4AF37 50%, #8C6A15 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 800;
      font-size: 28px;
      color: #050811;
      box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4), inset 0 1px 2px rgba(255,255,255,0.8);
      position: relative;
    }

    .brand-titles {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-sub {
      font-size: 13px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .cac-shield {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%);
      border: 1.5px solid rgba(212, 175, 55, 0.45);
      border-radius: 100px;
      padding: 10px 22px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }

    .cac-shield-icon {
      color: #d4af37;
      font-size: 18px;
    }

    .cac-shield-text {
      font-size: 14px;
      font-weight: 800;
      color: #f1f5f9;
      letter-spacing: 0.5px;
    }

    .cac-shield-reg {
      color: #d4af37;
      font-weight: 900;
    }

    /* Main Showcase Stage (Split Layout) */
    .showcase-stage {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
      margin: 15px 0;
      height: 780px;
    }

    /* Left Copy Column */
    .copy-column {
      flex: 1.1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .sector-pill {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: ${ad.accentColor}18;
      border: 1.5px solid ${ad.accentColor}55;
      padding: 8px 18px;
      border-radius: 100px;
      color: ${ad.accentColor};
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .sector-pill-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${ad.accentColor};
      box-shadow: 0 0 10px ${ad.accentColor};
    }

    .headline-3d {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 46px;
      font-weight: 900;
      line-height: 1.12;
      letter-spacing: -1.2px;
      color: #ffffff;
      text-shadow: 0 4px 20px rgba(0,0,0,0.6);
    }

    .headline-highlight {
      background: linear-gradient(135deg, #FFF5C0 0%, #D4AF37 50%, ${ad.accentColor} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subheadline {
      font-size: 19px;
      font-weight: 600;
      line-height: 1.45;
      color: #94a3b8;
      max-width: 530px;
    }

    /* 2D/3D Glassmorphic Feature Deck */
    .feature-deck {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 5px;
    }

    .feature-row {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      padding: 13px 18px;
      border-radius: 14px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }

    .feature-check {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${ad.accentColor}33 0%, ${ad.accentColor}11 100%);
      border: 1.5px solid ${ad.accentColor};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${ad.accentColor};
      font-size: 14px;
      font-weight: 900;
      flex-shrink: 0;
    }

    .feature-text {
      font-size: 17px;
      font-weight: 700;
      color: #e2e8f0;
      line-height: 1.3;
    }

    /* Right 3D Device Showcase Column */
    .device-column {
      flex: 0.95;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    /* 3D Smartphone Chassis */
    .phone-container {
      position: relative;
      width: 360px;
      height: 690px;
      border-radius: 48px;
      background: linear-gradient(135deg, #2d3748 0%, #1a202c 50%, #0f172a 100%);
      padding: 12px;
      box-shadow: 
        -25px 35px 70px rgba(0, 0, 0, 0.8),
        0 0 50px ${ad.accentColor}22,
        inset 0 1px 3px rgba(255, 255, 255, 0.3),
        inset 0 -2px 5px rgba(0, 0, 0, 0.5);
      transform: rotateY(-16deg) rotateX(8deg) rotateZ(-2deg);
      transform-style: preserve-3d;
      transition: all 0.3s ease;
    }

    /* Phone Metallic Bezel Reflection */
    .phone-bezel {
      width: 100%;
      height: 100%;
      border-radius: 38px;
      background: #090d16;
      border: 2px solid rgba(255, 255, 255, 0.12);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Dynamic Island */
    .dynamic-island {
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 24px;
      background: #000000;
      border-radius: 20px;
      z-index: 30;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
    }

    .island-lens {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #0f172a;
      border: 1px solid #1e293b;
    }

    .island-sensor {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #0284c733;
    }

    /* Mock Screen UI Content */
    .screen-content {
      width: 100%;
      height: 100%;
      background: #070c18;
      display: flex;
      flex-direction: column;
      padding: 50px 18px 20px 18px;
      gap: 14px;
    }

    .screen-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .screen-brand {
      font-size: 14px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .screen-live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .screen-status-badge {
      font-size: 11px;
      font-weight: 800;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 3px 10px;
      border-radius: 100px;
    }

    /* Mock Sector UI Card */
    .screen-hero-card {
      background: linear-gradient(135deg, ${ad.accentColor}22 0%, rgba(15, 23, 42, 0.8) 100%);
      border: 1px solid ${ad.accentColor}44;
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    }

    .screen-card-tag {
      font-size: 11px;
      font-weight: 800;
      color: ${ad.accentColor};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .screen-card-title {
      font-size: 17px;
      font-weight: 800;
      line-height: 1.25;
      color: #ffffff;
    }

    .screen-card-metric {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
      color: #10b981;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 6px 12px;
      border-radius: 8px;
    }

    /* Screen Interactive Elements */
    .screen-action-box {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .screen-action-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      font-weight: 700;
      color: #cbd5e1;
    }

    .screen-toggle {
      width: 36px;
      height: 20px;
      background: #10b981;
      border-radius: 20px;
      position: relative;
    }

    .screen-toggle::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      background: #ffffff;
      border-radius: 50%;
      top: 2px;
      right: 2px;
    }

    /* WhatsApp Simulated Chat Bubble */
    .screen-chat-bubble {
      background: #005c4b;
      color: #e9edef;
      border-radius: 14px 14px 2px 14px;
      padding: 12px 14px;
      font-size: 12px;
      line-height: 1.35;
      font-weight: 600;
      margin-top: auto;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      position: relative;
    }

    .screen-chat-sender {
      font-weight: 800;
      color: #25d366;
      font-size: 11px;
      margin-bottom: 2px;
    }

    .screen-cta-button {
      background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
      color: #ffffff;
      text-align: center;
      font-weight: 800;
      font-size: 14px;
      padding: 12px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
    }

    /* 3D Floating Overlays around Phone */
    .float-badge-1 {
      position: absolute;
      top: 50px;
      right: -30px;
      background: rgba(15, 23, 42, 0.9);
      border: 1.5px solid rgba(212, 175, 55, 0.5);
      border-radius: 18px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.7);
      transform: translateZ(50px);
      backdrop-filter: blur(20px);
    }

    .float-badge-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #FFF099 0%, #D4AF37 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #050811;
      font-weight: 900;
      font-size: 20px;
    }

    .float-badge-title {
      font-size: 15px;
      font-weight: 800;
      color: #ffffff;
    }

    .float-badge-sub {
      font-size: 12px;
      font-weight: 600;
      color: #d4af37;
    }

    .float-badge-2 {
      position: absolute;
      bottom: 70px;
      left: -40px;
      background: rgba(15, 23, 42, 0.9);
      border: 1.5px solid ${ad.accentColor}66;
      border-radius: 18px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.7);
      transform: translateZ(60px);
      backdrop-filter: blur(20px);
    }

    .float-badge-icon-blue {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, ${ad.accentColor} 0%, #0369a1 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 900;
      font-size: 20px;
    }

    /* Bottom High-Converting Conversion Banner */
    .conversion-footer {
      position: relative;
      z-index: 20;
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%);
      border: 1.5px solid rgba(212, 175, 55, 0.45);
      border-radius: 24px;
      padding: 24px 34px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
    }

    .conversion-left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .conversion-headline {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #34d399;
      letter-spacing: -0.3px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .conversion-subtext {
      font-size: 15px;
      font-weight: 600;
      color: #cbd5e1;
    }

    .conversion-btn {
      background: linear-gradient(135deg, #FFE27A 0%, #D4AF37 50%, #9E7412 100%);
      color: #030712;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 17px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 18px 36px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.45), inset 0 1px 2px rgba(255,255,255,0.7);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Bottom Trust Line */
    .trust-footer {
      position: relative;
      z-index: 20;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      font-size: 14px;
      font-weight: 700;
      color: #64748b;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .trust-highlight {
      color: #cbd5e1;
    }
  </style>
</head>
<body>
  <div class="studio-bg"></div>
  <div class="ambient-glow"></div>
  <div class="perspective-grid"></div>

  <!-- Header Bar -->
  <div class="header-bar">
    <div class="brand-cluster">
      <div class="brand-emblem">B</div>
      <div class="brand-titles">
        <div class="brand-name">Bethelmind Digital Solutions</div>
        <div class="brand-sub">Enterprise Web & Automation Systems</div>
      </div>
    </div>
    <div class="cac-shield">
      <span class="cac-shield-icon">🛡️</span>
      <span class="cac-shield-text">CAC Certified Enterprise <span class="cac-shield-reg">(Reg: 9912717)</span></span>
    </div>
  </div>

  <!-- Main Showcase Stage -->
  <div class="showcase-stage">
    
    <!-- Left Column: Copy & Value Proposition -->
    <div class="copy-column">
      <div class="sector-pill">
        <span class="sector-pill-dot"></span>
        ${ad.tag}
      </div>

      <h1 class="headline-3d">
        ${ad.titleLine1} <br/>
        <span class="headline-highlight">${ad.titleLine2}</span>
      </h1>

      <p class="subheadline">
        ${ad.subtitle}
      </p>

      <div class="feature-deck">
        ${ad.features.map(f => `
          <div class="feature-row">
            <div class="feature-check">✓</div>
            <div class="feature-text">${f}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Right Column: 3D Smartphone Device Mockup with Live UI -->
    <div class="device-column">
      <div class="phone-container">
        <div class="phone-bezel">
          <div class="dynamic-island">
            <div class="island-lens"></div>
            <div class="island-sensor"></div>
          </div>
          
          <div class="screen-content">
            <div class="screen-header">
              <div class="screen-brand">
                <span class="screen-live-dot"></span>
                Official Mobile Website
              </div>
              <div class="screen-status-badge">LIVE DEMO</div>
            </div>

            <div class="screen-hero-card">
              <div class="screen-card-tag">${ad.screenTag}</div>
              <div class="screen-card-title">${ad.screenTitle}</div>
              <div class="screen-card-metric">
                <span>⚡</span> ${ad.screenMetric}
              </div>
            </div>

            <div class="screen-action-box">
              <div class="screen-action-row">
                <span>Google Maps SEO</span>
                <span class="screen-toggle"></span>
              </div>
              <div class="screen-action-row">
                <span>36-State Delivery Sizer</span>
                <span class="screen-toggle"></span>
              </div>
            </div>

            <div class="screen-chat-bubble">
              <div class="screen-chat-sender">24/7 WhatsApp AI Closer</div>
              ${ad.screenChatText}
            </div>

            <div class="screen-cta-button">
              <span>💬</span> Test Free On Your Phone
            </div>
          </div>
        </div>
      </div>

      <!-- 3D Floating Badges -->
      <div class="float-badge-1">
        <div class="float-badge-icon">★</div>
        <div>
          <div class="float-badge-title">100% Turnkey Handover</div>
          <div class="float-badge-sub">Domain + Cloud CDN Included</div>
        </div>
      </div>

      <div class="float-badge-2">
        <div class="float-badge-icon-blue">⚡</div>
        <div>
          <div class="float-badge-title">24-Hour Deployment</div>
          <div class="float-badge-sub">Ready Before Final Handover</div>
        </div>
      </div>
    </div>

  </div>

  <!-- Bottom Conversion Banner (100% NO PRICE, NO PHONE NUMBER) -->
  <div class="conversion-footer">
    <div class="conversion-left">
      <div class="conversion-headline">
        <span>⚡</span> Guaranteed 24-Hour Express Launch
      </div>
      <div class="conversion-subtext">
        Test your live working mobile website prototype on your phone before paying 1 Kobo!
      </div>
    </div>
    <div class="conversion-btn">
      <span>💬</span> TAP "START CHAT" ON JIJI
    </div>
  </div>

  <!-- Bottom Trust Line -->
  <div class="trust-footer">
    <div class="trust-item">🔒 <span class="trust-highlight">CAC Certified Nigerian Enterprise</span> (Reg: 9912717)</div>
    <div class="trust-item">⚡ <span class="trust-highlight">24-Hour Express Delivery</span></div>
    <div class="trust-item">📱 <span class="trust-highlight">Zero Tech Skills Needed</span></div>
  </div>

</body>
</html>`;
}

module.exports = { generate3DLuxuryHtml };
