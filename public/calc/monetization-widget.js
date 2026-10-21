/**
 * BethelMind Analytics - Autonomous Monetization & Viral Loop Engine 2026
 * 100% Client-Side, Zero External Remote Dependencies, Bandwidth-Safe.
 */
(function() {
  if (window.__BETHELMIND_MONETIZATION_INITIALIZED__) return;
  window.__BETHELMIND_MONETIZATION_INITIALIZED__ = true;

  const pathname = window.location.pathname.toLowerCase();

  // Niche detection
  let niche = 'general';
  let selarProduct = 'da-aitools';
  let selarTitle = '💎 2026 Solopreneur & Autonomous Digital Blueprint';
  let selarDesc = 'Unlock complete editable spreadsheets, automation workflows, and monetization playbooks.';
  let selarPrice = '₦15,000 / $19';
  let b2bText = 'Want this custom interactive calculator or engine deployed on your brand website?';

  if (pathname.includes('typing') || pathname.includes('focus')) {
    niche = 'productivity';
    selarProduct = 'da-aitools';
    selarTitle = '🚀 2026 Remote Work, Typing Mastery & Deep Work Notion OS';
    selarDesc = 'Unlock 500+ Notion productivity templates, speed typing drills, and USD remote client outreach scripts.';
    selarPrice = '₦15,000 / $19';
    b2bText = 'Want a branded typing speed test or focus suite for your recruitment agency or company?';
  } else if (pathname.includes('runway') || pathname.includes('wealth') || pathname.includes('salary') || pathname.includes('cashflow') || pathname.includes('crypto')) {
    niche = 'finance';
    selarProduct = 'da-finance';
    selarTitle = '💎 2026 Financial Freedom & 12-Month Runway Operating System';
    selarDesc = 'Model your survival runway, emergency savings, safe withdrawal rate, and tax shield blueprint.';
    selarPrice = '₦15,000 / $19';
    b2bText = 'Want a branded financial health or runway calculator on your advisory or coaching website?';
  } else if (pathname.includes('goal-grid') || pathname.includes('wordle') || pathname.includes('sure-score') || pathname.includes('sports')) {
    niche = 'sports';
    selarProduct = 'da-sports';
    selarTitle = '⚽ 2026 Quantitative Football Analytics & Bankroll Matrix';
    selarDesc = 'Expected value (+EV) calculations, Kelly criterion stake sizing, and 3-match probability models.';
    selarPrice = '₦15,000 / $19';
    b2bText = 'Want a custom sports trivia game or predictive odds widget for your fan club or blog?';
  } else if (pathname.includes('drama')) {
    niche = 'entertainment';
    selarProduct = 'da-reddit';
    selarTitle = '🔥 Viral Faceless Storytelling & TikTok Creator Blueprint';
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
      background: linear-gradient(90deg, rgba(30, 27, 75, 0.95), rgba(15, 23, 42, 0.95));
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 12px;
      padding: 8px 14px;
      margin-bottom: 12px;
      font-size: 0.75rem;
      color: #cbd5e1;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .bm-monetize-topbar strong { color: #38bdf8; }
    .bm-topbar-cta {
      background: #38bdf8;
      color: #040711;
      padding: 5px 12px;
      border-radius: 8px;
      font-weight: 800;
      text-decoration: none;
      white-space: nowrap;
      font-size: 0.72rem;
      transition: opacity 0.2s;
    }
    .bm-topbar-cta:hover { opacity: 0.9; }
    
    .bm-ad-container {
      margin: 14px 0;
      padding: 12px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      border-radius: 14px;
      text-align: center;
    }
    .bm-ad-label {
      font-size: 0.62rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
      margin-bottom: 6px;
    }
    .bm-ad-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .bm-ad-title {
      font-size: 0.82rem;
      font-weight: 900;
      color: #f8fafc;
      text-align: left;
    }
    .bm-ad-desc {
      font-size: 0.7rem;
      color: #94a3b8;
      text-align: left;
      margin-top: 2px;
    }
    .bm-ad-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #fff;
      padding: 8px 14px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 0.74rem;
      text-decoration: none;
      white-space: nowrap;
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
          <span>⚡ <strong>Verified 2026 Engine:</strong> 100% Free Client-Side Tool</span>
        </div>
        <a href="https://selar.com/showlove/bethelmind?product=${selarProduct}" target="_blank" rel="noopener noreferrer" class="bm-topbar-cta">
          Unlock Master Blueprint (${selarPrice}) →
        </a>
      `;
      container.insertBefore(topbar, container.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMonetization);
  } else {
    initMonetization();
  }
})();
