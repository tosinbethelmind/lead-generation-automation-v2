/**
 * BethelMind Analytics - Autonomous Monetization & Viral Loop Engine 2026
 * 100% Client-Side, Zero External Remote Dependencies, Bandwidth-Safe.
 */
(function() {
  if (window.__BETHELMIND_MONETIZATION_INITIALIZED__) return;
  window.__BETHELMIND_MONETIZATION_INITIALIZED__ = true;

  const pathname = window.location.pathname.toLowerCase();

  // Niche & Offer Detection
  let niche = 'general';
  let selarUrl = 'https://selar.com/showlove/bethelmind?product=da-aitools';
  let selarTitle = '2026 Solopreneur & Autonomous Digital Blueprint';
  let selarDesc = 'Unlock complete editable spreadsheets, automation workflows, and monetization playbooks.';
  let selarPrice = '₦15,000 / $19';
  let b2bText = 'Want this custom interactive calculator or engine deployed on your brand website?';

  if (pathname.includes('solar')) {
    niche = 'solar';
    selarUrl = 'https://selar.com/showlove/bethelmind?currency=NGN&item=solar-buster&amount=10000';
    selarTitle = 'Solar Master Procurement & BOQ Sizer Blueprint';
    selarDesc = 'NERC Band A tariff avoidance tables, battery inverter sizing models, and supplier contracts.';
    selarPrice = '₦10,000 / $12';
    b2bText = 'Want a branded Solar BOQ load sizer & WhatsApp proposal generator for your solar company?';
  } else if (pathname.includes('deal') || pathname.includes('cashflow') || pathname.includes('mortgage') || pathname.includes('wholesaling')) {
    niche = 'realestate';
    selarUrl = 'https://selar.com/showlove/bethelmind?currency=NGN&item=land-dossier&amount=25000';
    selarTitle = 'Institutional Real Estate & Land Dossier Underwriting Bundle';
    selarDesc = 'Underwrite rental properties with Cap Rate, DSCR, cash-on-cash ROI, and formal LOI templates.';
    selarPrice = '₦25,000 / $30';
    b2bText = 'Want a branded property ROI or deal underwriting calculator on your agency website?';
  } else if (pathname.includes('kids')) {
    niche = 'kids';
    selarUrl = 'https://selar.com/showlove/bethelmind?product=da-kids';
    selarTitle = 'Early Childhood STEM Curriculum & 3D Phonics Studio Pack';
    selarDesc = 'Printable milestone reward certificates, spelling drills, and zero screen distractions.';
    selarPrice = '₦7,500 / $9';
    b2bText = 'Want a custom interactive learning portal or student assessment suite for your school?';
  } else if (pathname.includes('typing') || pathname.includes('focus')) {
    niche = 'productivity';
    selarUrl = 'https://selar.com/showlove/bethelmind?product=da-aitools';
    selarTitle = 'Remote Work, Typing Mastery & Deep Work Notion OS';
    selarDesc = 'Unlock 500+ Notion productivity templates, speed typing drills, and USD remote outreach scripts.';
    selarPrice = '₦15,000 / $19';
    b2bText = 'Want a branded typing speed test or focus suite for your recruitment agency or company?';
  } else if (pathname.includes('runway') || pathname.includes('wealth') || pathname.includes('salary') || pathname.includes('crypto')) {
    niche = 'finance';
    selarUrl = 'https://selar.com/showlove/bethelmind?product=da-finance';
    selarTitle = 'Financial Freedom, DCA Engine & 12-Month Runway Operating System';
    selarDesc = 'Model your survival runway, emergency savings, safe withdrawal rate, and compound yield.';
    selarPrice = '₦15,000 / $19';
    b2bText = 'Want a branded financial health or runway calculator on your advisory or coaching website?';
  } else if (pathname.includes('goal-grid') || pathname.includes('wordle') || pathname.includes('sure-score') || pathname.includes('sports')) {
    niche = 'sports';
    selarUrl = 'https://selar.com/showlove/bethelmind?product=da-sports';
    selarTitle = 'Quantitative Football Analytics & Bankroll Matrix';
    selarDesc = 'Expected value (+EV) calculations, Kelly criterion stake sizing, and 3-match probability models.';
    selarPrice = '₦15,000 / $19';
    b2bText = 'Want a custom sports trivia game or predictive odds widget for your fan club or blog?';
  } else if (pathname.includes('drama')) {
    niche = 'entertainment';
    selarUrl = 'https://selar.com/showlove/bethelmind?product=da-reddit';
    selarTitle = 'Viral Faceless Storytelling & TikTok Creator Blueprint';
    selarDesc = 'Discover viral script templates, automated text-to-speech workflows, and multi-platform monetization.';
    selarPrice = '₦15,000 / $19';
    b2bText = 'Want a viral confession or interactive storytelling radar for your media brand?';
  }

  // Inject CSS Styles
  const style = document.createElement('style');
  style.textContent = `
    .bm-monetize-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: linear-gradient(90deg, rgba(15, 23, 42, 0.98), rgba(12, 18, 34, 0.98));
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 12px;
      padding: 8px 14px;
      margin-bottom: 12px;
      font-size: 0.75rem;
      color: #cbd5e1;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }
    .bm-monetize-topbar strong { color: #d4af37; }
    .bm-topbar-cta {
      background: linear-gradient(135deg, #d4af37 0%, #aa8620 100%);
      color: #080d19;
      padding: 6px 14px;
      border-radius: 8px;
      font-weight: 800;
      text-decoration: none;
      white-space: nowrap;
      font-size: 0.72rem;
      transition: opacity 0.2s, transform 0.1s;
    }
    .bm-topbar-cta:hover { opacity: 0.95; transform: translateY(-1px); }

    .bm-bottom-actions {
      margin-top: 18px;
      padding: 16px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .bm-bottom-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    @media (min-width: 640px) {
      .bm-bottom-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    .bm-btn-wa {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #10b981;
      color: #040711;
      padding: 10px 16px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 0.78rem;
      text-decoration: none;
      transition: background 0.2s;
    }
    .bm-btn-wa:hover { background: #059669; color: #fff; }

    .bm-btn-b2b {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      padding: 10px 16px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 0.78rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .bm-btn-b2b:hover { background: rgba(56, 189, 248, 0.2); }

    .bm-trust-footer {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.68rem;
      color: #64748b;
    }
    .bm-trust-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #94a3b8;
    }
  `;
  document.head.appendChild(style);

  // Injects components once DOM is loaded
  function initMonetization() {
    const container = document.querySelector('.container') || document.body;
    if (!container) return;

    // 1. Top Announcement Sponsor Bar
    if (!document.querySelector('.bm-monetize-topbar')) {
      const topbar = document.createElement('div');
      topbar.className = 'bm-monetize-topbar';
      topbar.innerHTML = `
        <div>
          <span><strong>Verified 2026 Engine:</strong> 100% Free Client-Side Tool</span>
        </div>
        <a href="${selarUrl}" target="_blank" rel="noopener noreferrer" class="bm-topbar-cta">
          Unlock Master Blueprint (${selarPrice}) →
        </a>
      `;
      container.insertBefore(topbar, container.firstChild);
    }

    // 2. Bottom Viral Share & B2B Turnkey Action Box
    if (!document.querySelector('.bm-bottom-actions')) {
      const toolName = document.title || 'Interactive Calculator';
      const cleanUrl = 'https://www.bethelmindanalytics.com' + pathname.replace(/\.html$/, '');
      const waShareText = encodeURIComponent(
        `⚡ *${toolName} — 2026 Breakdown (Nigeria)*\n\n` +
        `Calculate your exact numbers free on your phone:\n` +
        `${cleanUrl}\n\n` +
        `_Verified by Bethelmind Digital Solutions (CAC Certified RC 7034297)_`
      );
      const waB2bText = encodeURIComponent(
        `Hello Bethelmind Digital Solutions! I am using the *${toolName}* on your website. I want to deploy this branded calculator + 24/7 AI WhatsApp closer for my own company (₦35,000 SME Starter Package).`
      );

      const bottomBox = document.createElement('div');
      bottomBox.className = 'bm-bottom-actions';
      bottomBox.innerHTML = `
        <div class="bm-bottom-grid">
          <a href="https://wa.me/?text=${waShareText}" target="_blank" rel="noopener noreferrer" class="bm-btn-wa">
            <span>📲 Share Result on WhatsApp →</span>
          </a>
          <a href="https://wa.me/2348022791227?text=${waB2bText}" target="_blank" rel="noopener noreferrer" class="bm-btn-b2b">
            <span>🚀 Deploy on My Website (₦35,000 Setup) →</span>
          </a>
        </div>

        <div class="bm-trust-footer">
          <span class="bm-trust-badge">
            🔒 Bank-Grade Settlement: Moniepoint MFB (6805375225)
          </span>
          <span class="bm-trust-badge">
            🏛️ CAC Certified Enterprise: RC 7034297
          </span>
          <span>© 2026 Bethelmind Digital Solutions</span>
        </div>
      `;
      container.appendChild(bottomBox);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMonetization);
  } else {
    initMonetization();
  }
})();
