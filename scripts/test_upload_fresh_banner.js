const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function testUploadFreshBanner() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    viewport: { width: 1200, height: 1200 }
  });

  // Render a brand-new distinct 2D luxury banner for Shortlet Booking
  const renderPage = await context.newPage();
  await renderPage.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body {
          width: 1080px;
          height: 1080px;
          background: linear-gradient(135deg, #090e1a 0%, #0d1527 50%, #050811 100%);
          color: #ffffff;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          pointer-events: none;
        }
        .glow-1 { top: -100px; right: -100px; background: #38bdf8; }
        .glow-2 { bottom: -100px; left: -100px; background: #d4af37; }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .brand {
          font-size: 26px;
          font-weight: 800;
          color: #f8fafc;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #d4af37;
        }
        .badge {
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.4);
          color: #d4af37;
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .tagline {
          color: #38bdf8;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .title {
          font-size: 46px;
          font-weight: 900;
          line-height: 1.15;
          color: #ffffff;
        }
        .title span {
          color: #d4af37;
        }
        .features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 10px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px 22px;
          border-radius: 14px;
          font-size: 18px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .check {
          color: #10b981;
          font-size: 20px;
          font-weight: bold;
        }
        .footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 24px;
        }
        .sla {
          font-size: 16px;
          font-weight: 700;
          color: #94a3b8;
        }
        .cta-btn {
          background: linear-gradient(135deg, #d4af37 0%, #aa8620 100%);
          color: #070b14;
          font-size: 18px;
          font-weight: 900;
          padding: 14px 32px;
          border-radius: 12px;
        }
      </style>
    </head>
    <body>
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="header">
        <div class="brand"><div class="brand-dot"></div> Bethelmind Digital Solutions</div>
        <div class="badge">CAC REG: 9912717</div>
      </div>
      <div class="content">
        <div class="tagline">SHORTLET APARTMENTS & REAL ESTATE</div>
        <div class="title">DIRECT BOOKING ENGINE & <span>CAUTION FEE ESCROW</span></div>
        <div class="features">
          <div class="feature-item"><span class="check">✔</span> Direct guest booking calendar with 0% Airbnb commissions</div>
          <div class="feature-item"><span class="check">✔</span> Automatic electricity prepaid meter balance vs refund sizer</div>
          <div class="feature-item"><span class="check">✔</span> Digital passport verification & property check-in agreement</div>
          <div class="feature-item"><span class="check">✔</span> Instant WhatsApp gate pass access code for estate security</div>
        </div>
      </div>
      <div class="footer">
        <div class="sla">⚡ 24-HOUR EXPRESS SETUP • ZERO HIDDEN CHARGES</div>
        <div class="cta-btn">TEST LIVE DEMO</div>
      </div>
    </body>
    </html>
  `);

  const freshBannerPath = path.resolve(`public/jiji_ads/test_fresh_shortlet_${Date.now()}.png`);
  await renderPage.screenshot({ path: freshBannerPath, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  await renderPage.close();
  console.log('Fresh banner rendered:', freshBannerPath);

  // Now test uploading this banner to Ad 55797342!
  const config = JSON.parse(fs.readFileSync('local_db/jiji_account_config.json', 'utf8'));
  const validCookies = (config.cookiesJson || []).map(c => {
    const copy = { ...c };
    if (!['Strict', 'Lax', 'None'].includes(copy.sameSite)) delete copy.sameSite;
    return copy;
  });
  await context.addCookies(validCookies);

  const editPage = await context.newPage();
  editPage.on('response', async res => {
    if (res.url().includes('image-upload')) {
      console.log(`[UPLOAD API ${res.status()}]:`, await res.text());
    }
  });

  await editPage.goto('https://jiji.ng/edit-free-ad-55797342.html', {
    referer: 'https://jiji.ng/profile/adverts',
    waitUntil: 'domcontentloaded'
  });
  await editPage.waitForTimeout(3000);

  const fileInput = await editPage.$('input[type="file"]');
  if (fileInput) {
    console.log('Uploading fresh banner to Ad 55797342...');
    await fileInput.setInputFiles(freshBannerPath);
    await editPage.waitForTimeout(6000);
  }

  await browser.close();
}

testUploadFreshBanner().catch(console.error);
