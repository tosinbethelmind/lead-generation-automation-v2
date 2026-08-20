<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PERMANENT AGENT MEMORY & OPERATING RULES

## 1. SCOPE & ENGINE
- **EXCLUDE SolarQuotePro.ng**: Do NOT include `solarquotepro.ng` or SolarQuotePro pitches in outreach campaigns. All outreach is dedicated solely to **Bethelmind Analytics B2B Website Prototype & Instant Setup Claims**.
- **STRICT BRANDING (BETHELMIND ANALYTICS ONLY)**: All outreach messages, signatures, SMS, and emails MUST strictly use **Bethelmind Analytics** (e.g. `*Bethelmind Analytics Lagos Team*` or `*Bethelmind Analytics B2B Engine*`). NEVER use `ApexReach` anywhere in outreach, templates, or signatures.

## 2. OUTREACH STRATEGY (100% BAN-PROOF HIGH-VOLUME LAGOS BUSINESS DISCOVERY)
- **High-Volume Daily Capacity**: **500 verified Lagos commercial leads contacted per day** via dual Carrier SMS + B2B Email.
- **Abortion of Previous Sprint**: All previous cold WhatsApp sprint queues are aborted and reset. The fresh 7-day cycle commences **Thursday, August 20, 2026 to Wednesday, August 26, 2026**.
- Target sectors: Salons & Spas, Dental & Healthcare Clinics, Auto Repair & Detailing, Restaurants, Logistics, Real Estate, Retail, Professional Services in Lagos.
- Core value proposition:
  1. Custom-tailored interactive website prototype (`preview_url`).
  2. Mobile responsiveness & Google Maps SEO discovery.
  3. 24/7 WhatsApp AI Customer Intake & Ordering Closer.
  4. Instant Moniepoint & Paystack 48h setup claim.
- Outreach channels & Ban-Proof Strategy:
  - **Carrier SMS (Primary Wave - 500/day)**: Dispatched via **Tailscale Android SMS Gateway** (`http://10.132.90.251:8082`) using GSM airtime (4–7s throttle delay to prevent SIM burst blocks).
  - **B2B Email (Hostinger SMTP)**: 4-Pillar Executive Proposals + 35s Audio Voice Note Teaser dispatched to all verified business inboxes.
  - **Inbound-Only WhatsApp Conversion Bridge**: Zero cold outbound WhatsApp. Inbound inquiries route directly to CEO / Admin Desk (`0802 279 1227` / `+234 802 279 1227`) with 0% ban penalty.
- **NO Termii**: Termii is NOT used. All SMS dispatches route through the Tailscale Android SMS Gateway.

## 3. SCHEDULE CYCLE
- Active 7-day high-volume campaign runs from **Thursday, August 20, 2026 to Wednesday, August 26, 2026** (500 leads/day).

## 4. PHONE LINE ARCHITECTURE & ADMIN NOTIFICATIONS
- **ADMIN & CLOSER DESK (INBOUND INQUIRIES ONLY):** `0802 279 1227` (`ADMIN_WA_PHONE`) & Email (`bethelmindrecruit@gmail.com`). All SMS & Email CTA links connect directly to this desk (`wa.me/2348022791227`). NEVER dispatch cold outbound outreach from this number.
- **COLD OUTREACH LINES 1 & 2:** Standby / Warm follow-ups only for prospects who actively click/engage on prototypes. Cold spam blasting is strictly disabled.

## 5. ZERO-TOLERANCE SYNTHETIC / MOCK LEAD POLICY
- **NEVER generate, seed, or dispatch synthetic, template, or placeholder phone numbers or leads.**
- **Strict Phone Number Validation Before Any Dispatch:**
  - Phone MUST be a genuine 10-14 digit Nigerian number (MTN, Airtel, Glo, 9mobile).
  - REJECT any number containing sequential zeros (`0000`, `0001`), repeating digit quads (`1111`, `8888`), consecutive triplets (`666777`), or sequential runs (`123456`).
  - REJECT template business names (e.g. `[Area] Premium [Sector] [Number]`, `Lead [slug]`, `mock_`, `synthetic_`).
  - REJECT placeholder email domains (`@example.com`, `@test.com`, `@testlead.com`, `@*premiumsalon.com`).
- **All outreach MUST be dispatched to 100% genuine, verified Nigerian commercial businesses.**
- **Day 2+ Outreach Dispatches Require Explicit User Approval Before Firing.**

## 6. HIGH-CONVERSION LANDING PAGE & OUTREACH ARCHITECTURE
- **Zero-Latency Landing Page**: No blocking preloader overlays. Prototypes must paint instantaneously on mobile devices.
- **1-Tap WhatsApp Conversion Hook**: Primary CTA on all client prototypes must be low-friction 1-Tap WhatsApp claim (`₦0 Upfront Preview`), connecting the business owner directly to our desk.
- **Cognitive Simplicity**: Advanced developer features (DNS, CNAME, Source code IP buyout) are progressively disclosed in accordions to avoid overwhelming prospects.
- **2-Step Permission Outreach**: Cold outreach should leverage the 2-step permission loop (short icebreaker question first -> send prototype link upon reply) to maintain maximum conversion velocity.

## 7. CHANNEL-SPECIFIC PITCHING PROTOCOLS (WHATSAPP VS. EMAIL)
- **WhatsApp Channel (Short, High-Engagement, 2-Step)**:
  - NEVER send links or walls of text in Message #1.
  - Step 1: Send 1-sentence permission icebreaker (*"Good day! Is this the management team at [Business Name] in [Area]?"*).
  - Step 2: Upon reply, send the punchy 3-tool teaser (24/7 WhatsApp Closer + Sector Tool/Intake + Moniepoint/Paystack verification) + `preview_url`.
- **Email Channel (Complete 4-Pillar Executive Breakdown)**:
  - Subject: `Automating 24/7 Inquiries & Online Bookings for [Business Name]`
  - Pillar 1: 24/7 AI Conversational WhatsApp Agent (< 3s reply, Nigerian tone).
  - Pillar 2: Dynamic Sector Intake / Quote Engine (automated pricing & PDF quotes).
  - Pillar 3: Automated Bank Transfer & Paystack/Moniepoint Verification.
  - Pillar 4: Google Sheets CRM & Instant Lead Push Alerts.
  - Clear Risk-Reversal CTA + Direct WhatsApp Desk Link (`+234 802 279 1227`).

## 8. DUAL AUDIENCE VALUE PROPOSITION DIFFERENTIATION
- **Existing Website Leads (`hasWebsite === true`)**:
  - Position as a 10-minute **1-Line Script Embed / WordPress Plugin Upgrade (₦35,000 / ₦65,000)**.
  - Reassure that current hosting, domain, and SEO rankings remain 100% untouched.
- **No-Website Leads (`hasWebsite === false`)**:
  - Position as a **100% Done-For-You Turnkey Online Deployment (₦75,000 50% deposit / ₦150,000)** with `.com.ng` domain, Google Maps SEO discovery, and instant cloud deployment.

## 9. MANDATORY SUPABASE LINK SYNC & PRE-DISPATCH VERIFICATION (PREVENTS BROKEN/MISMATCHED LINKS)
- **Supabase Cloud Sync First**: Every generated prototype, theme, copy, and custom `preview_url` MUST be confirmed as fully synced and persisted to **Supabase Cloud** (`leads` / `preview_data` / `crm_leads`) BEFORE any outreach message is dispatched.
- **Root Cause Prevention**: Resolves the previous issue where local-only preview links failed to sync to Supabase, causing broken, default, or mismatched links to be sent to leads.
- **Pre-Dispatch Link Health Check**: Before firing any WhatsApp, SMS, or Email outreach, the engine must verify that the `preview_url` resolves with the exact business name, rating, address, and sector configuration in production.

## 10. ULTRA-FAST LOADING SPEED & EDGE CACHING ARCHITECTURE
- **0ms In-Memory Client Hydration**: Client prototypes use `previewCache` to render the business identity, sector styling, and CTAs instantaneously on frame 1 without waiting for network roundtrips.
- **Edge & Browser SWR Caching**: `/api/preview/generate` utilizes `public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400` caching headers for sub-15ms edge delivery on repeated visits.
- **Zero Render-Blocking Font Links**: All Google Fonts (Outfit, Plus Jakarta Sans, Inter) are preloaded and preconnected in the root layout `<head>`, eliminating duplicate in-body `<link>` stylesheet parse pauses.
- **Deferred Telemetry**: Non-critical analytics and Meta CAPI tracking execute on `requestIdleCallback` to maintain 0ms blocking on the prospect's mobile main thread.

## 11. AUTONOMOUS VIRAL WHATSAPP CHANNEL & CLIENT CONVERSION ENGINE
- **Automated 7-Day Content Rotation Matrix**:
  - **Monday:** Industry Teardown & Leak Audit (High Group Forwards).
  - **Tuesday:** Plug-and-Play Swipe File & Scripts (High Saves & Shares).
  - **Wednesday:** Live Case Studies & ROI Breakdown (Authority Proof).
  - **Thursday:** Interactive Polls & Reaction Spikes (Boosts Directory Rank).
  - **Friday:** 1-Tap DM Conversion Offers (3 DFY Slots, ₦0 Upfront Preview).
  - **Saturday:** Behind-The-Scenes Tech Architecture (Build In Public).
  - **Sunday:** Weekly Master Asset Pack & Strategy Recap.
- **Hands-Off Execution**: The autonomous engine automatically generates and queues daily broadcasts at **10:00 AM WAT** with matching WhatsApp Status teasers, X (Twitter) threads, and LinkedIn posts.
- **Direct 1-Tap DM Bridges**: All conversion CTAs embed pre-filled `wa.me` links pointing to the CEO/Admin Desk (`0802 279 1227`).

## 12. PERMANENT 24/7 CLOUD RUNNING (GOOGLE COLAB & KOYEB ACTIVATED)
- **Google Colab Continuous Harvester (`colab_lagos_10k_runner.py`)**: Activated for continuous, high-throughput cloud lead harvesting and automated deduplication against Supabase Cloud.
- **Koyeb 24/7 Cloud Runner & Microservices**: Activated as the permanent cloud infrastructure host for continuous background tasks, webhook receivers, and API schedulers with zero sleep/downtime.
- **Persistent Local Daemon (`autonomous_growth_engine.js`)**: Runs 24/7 as a background watchdog overseeing lead queues, daily WhatsApp Channel broadcasts, and real-time Google Indexing pings.

## 13. AUTONOMOUS 24/7 INBOUND ENGINE VS. USER-CONTROLLED OUTREACH DISPATCH
- **100% Fully Automated Inbound & Infrastructure**:
  - Lead scraping, phone verification, and deduplication into Supabase Cloud run 24/7.
  - Multi-channel traffic packages and daily action plans (`DAILY_TRAFFIC_ACTION_PLAN.md`) generate automatically.
  - Google Indexing API submissions execute automatically.
  - Selar Webhooks (`/api/webhooks/selar`) process 24/7 and dispatch instant digital asset access via Tailscale SMS + Email.
- **Strict Manual Trigger for Outbound Cold Outreach**:
  - Outbound Carrier SMS and B2B Cold Email campaigns are NEVER dispatched automatically without explicit user trigger.
  - Leads remain in a verified `STAGED_FOR_DISPATCH` queue awaiting manual confirmation via `TRIGGER_OUTREACH_MANUAL.bat`.

## 14. ZERO-FAILURE QUALITY ASSURANCE & PREFLIGHT WATCHDOG
- **Preflight Infrastructure Health Check**: Before any batch execution or outreach dispatch, `scripts/qa_traffic_and_outreach_watchdog.js` must verify:
  1. Supabase Cloud read/write connectivity (`leads`, `preview_data`, `crm_leads`).
  2. Selar checkout URL integrity across all 16 digital products.
  3. Tailscale Android SMS Gateway status (`http://10.132.90.251:8082`).
  4. Hostinger SMTP credentials & port availability (465/587).
  5. 0% synthetic/placeholder lead compliance (strictly enforcing Section 5).
- **Automated Fallback**: If SMS Gateway is offline, the system safely queues the batch without dropping leads and alerts the Admin Desk (`0802 279 1227`).

## 15. HIGH-INTELLIGENCE STRATEGIC AI DECISION & EXECUTIVE BRIEFING LAYER
- **Autonomous Intelligence Formulation (`src/lib/executiveAiDecisionEngine.ts`)**:
  - Continuously evaluates Supabase lead volume, high-intent commercial corridors (Lekki Phase 1, Victoria Island, Ikeja GRA), and Selar checkout conversion metrics.
  - Automatically synthesizes actionable strategic directives (revenue maximization, optimal outreach timing windows, post-purchase up-sell tuning).
- **Automated Twice-Daily Executive Email Briefings**:
  - Dispatches high-level strategic intelligence and 1-click action recommendations to **`bethelmindrecruit@gmail.com`** twice daily:
    - **Morning Briefing:** 08:00 AM WAT (Daily priority focus products & staged lead review).
    - **Evening Briefing:** 08:00 PM WAT (Daily traffic digest, Selar orders & next-day directives).
- **On-Demand Execution**:
  - Leadership can trigger an instant strategic decision analysis at any time via `npx tsx scripts/dispatch_ai_decision_briefing.js`.

## 16. THE 8-PILLAR ALGORITHMIC MONETIZATION & ARBITRAGE ARCHITECTURE
- **Pillar 1: Expired .com.ng Domain Sniping & 301 Redirects (`expiredDomainMonitor.ts`)**: Snipes expired commercial domains for 301 traffic hijacking or ₦150k–₦350k buyback flips.
- **Pillar 2: Unclaimed GMB Security Rescue Engine (`gmbRescueEngine.ts`)**: Alerts high-rated Lagos businesses with unclaimed Google Maps listings to claim & lock their profile for ₦35k–₦65k.
- **Pillar 3: B2B Verified Lead Data Bundler (`leadBundlePackager.ts`)**: Packages verified sector databases into downloadable Selar packs (₦15k–₦30k).
- **Pillar 4: Brand Shield & Trademark Squatting Alert (`trademarkShieldEngine.ts`)**: Scrapes unprotected Instagram brands and secures CAC/trademark filings (₦65k).
- **Pillar 5: Programmatic Micro-SaaS Paywalls (`/api/tools/micro-paywall`)**: ₦2,500 impulse unlocks for PDF calculations (Solar Sizer, Land Cadastral, SCUML).
- **Pillar 6: Shadow B2B Pay-Per-Appointment Lead Router (`appointmentLeadRouter.ts`)**: Routes high-budget commercial quote leads to vetted installers/clinics for ₦35k–₦50k/appointment.
- **Pillar 7: Diaspora Milestone Escrow & 4K Verification Protocol (`diasporaEscrowEngine.ts`)**: Collects 2.5%–5% transaction verification royalty on ₦20M–₦100M Diaspora construction builds.
- **Pillar 8: Turnkey White-Label Agency Licensing (`whitelabelLicensingEngine.ts`)**: Licenses the Bethelmind growth engine to third-party agencies (₦150k setup + ₦35k/mo MRR).


