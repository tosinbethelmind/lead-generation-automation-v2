# Bethelmind Digital Solutions: Permanent Operating Memory & VPS Directives

## 1. VPS-FIRST OFFLOAD ARCHITECTURE (STRICT ZERO-LAPTOP-RESOURCE DRAIN)
- **100% Remote Offload on Contabo VPS (`169.58.182.92`)**:
  - The user operates a dedicated Contabo VPS (`169.58.182.92`, root auth configured) running 24/7 with unlimited high-speed data.
  - **All continuous, heavy, or automated outreach daemons MUST execute on the VPS or GitHub Actions Cloud**:
    - **Multi-Line WhatsApp Outreach**: PM2 process `bethelmind-wa-outreach` on VPS.
    - **Evolution API WhatsApp Instance Manager**: PM2 process `bethelmind-evolution` on VPS (port 8080).
    - **Airtel Android GSM SMS Gateway**: PM2 process `bethelmind-airtel-sms` on VPS.
    - **Heavy Nigeria-Wide Lead Scraping**: GitHub Actions Cloud (`.github/workflows/autonomous_247_cloud_engine.yml`) running 24/7 every 30 minutes.
- **Strict Local Laptop Resource & Cellular Data Guard**:
  - **The user's laptop runs on metered mobile cellular broadband**. Uncontrolled data consumption or continuous background polling is **STRICTLY PROHIBITED**.
  - **Zero local runaway scrapers or daemons**: Local laptop must NEVER run 24/7 background scraping loops, heavy Playwright/Chromium instances, or rapid database pollers.
  - **Laptop Worker Memory Cap**: Memory strictly capped at `< 120MB per worker` (`--max-old-space-size=128`), CPU `< 5%`.
  - **No Zombie Processes**: Stale node instances, zombie dev servers, or orphaned headless browsers must be immediately terminated.
  - **Data-Saver Test Probes**: All local test suites (e.g. `npm run test:qa`) must run lightweight, bounded, on-demand micro-requests ($\le 64$ KB per probe) and drop heavy binary media.

## 2. STRICT BRANDING & CAC CORPORATE SETTLEMENT INVARIANT
- **Sole Corporate Identity**: Strictly **Bethelmind Digital Solutions (CAC Certified Nigerian Enterprise)**.
- **Zero-Crypto Invariant**: Cold customer outreach is 100% commercial B2B. Zero crypto terms, zero wallet references, zero escrow jargon.
- **Settlement Account**: All client setup fees, deposits, and retainers route 100% to our verified corporate bank account:
  - **Bank**: `Moniepoint Microfinance Bank`
  - **Account Number**: `6805375225`
  - **Account Name**: `Bethelmind Digital Solutions`
- **Admin & Closer Desk**: `0802 279 1227` (`ADMIN_WA_PHONE`) / `bethelmindrecruit@gmail.com`. Cold outreach CTA links route directly to `wa.me/2348022791227`. Never dispatch cold outbound bulk outreach from the admin phone.

## 3. STRICT NON-WEBSITE COMMERCIAL FOCUS (`hasWebsite === false`)
- **Target Audience**: 100% verified Nigerian commercial businesses that do NOT have a standalone website (directory-only profiles on Jiji, BusinessList, Finelib, VConnect, Google Maps).
- **Core Hook**: *"When prospective customers search for [Business Name] on Google, only third-party directories show up alongside ads for direct competitors. We already built your live Official Mobile Website + 24/7 WhatsApp Booking & Quoting Assistant to test free: https://www.bethelmindanalytics.com/preview/[slug]"*.
- **2-Tier Pricing**:
  - **Starter Go-Live**: `₦35,000` one-time (or `₦25,000/month` Pay-Small-Small).
  - **Full Turnkey Custom Domain Suite**: `₦75,000` 50% deposit (`₦150,000` total).

## 4. SMS & OUTREACH BOUNDS
- **Single Credit Constraint**: Exactly 1 SMS ($\le 158$ characters, zero links) per lead to prevent multi-credit airtime drain.
- **Caps**: Exactly 120 SMS/day, 600 verified emails/day (Dual Hostinger pool), 30 WhatsApp msgs/line/day.
- **Real Metrics Only**: Zero simulated or fake reporting. All metrics must reflect confirmed network events.
