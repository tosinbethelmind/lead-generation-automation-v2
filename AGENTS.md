<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# PERMANENT AGENT MEMORY & OPERATING RULES

## 1. SCOPE & ENGINE
- **EXCLUDE SolarQuotePro.ng**: Do NOT include `solarquotepro.ng` or SolarQuotePro pitches in outreach campaigns. All outreach is dedicated solely to **Bethelmind Analytics B2B Website Prototype & Instant Setup Claims**.
- **STRICT BRANDING (BETHELMIND ANALYTICS ONLY)**: All outreach messages, signatures, SMS, and emails MUST strictly use **Bethelmind Analytics** (e.g. `*Bethelmind Analytics Lagos Team*` or `*Bethelmind Analytics B2B Engine*`). NEVER use `ApexReach` anywhere in outreach, templates, or signatures.

## 2. OUTREACH STRATEGY (100% REGULAR LAGOS BUSINESSES)
- Target sectors: Salons, Clinics, Auto Repair, Restaurants, Retail, Professional Services, Real Estate, Gyms, Consultancies in Lagos.
- Core value proposition:
  1. Custom-tailored interactive website prototype (`preview_url`).
  2. Mobile responsiveness & Google Maps SEO integration.
  3. WhatsApp direct customer ordering & contact integration.
  4. Paystack instant setup claim & online payments.
- Outreach channels: WhatsApp (Baileys / Rotator), B2B Email (Hostinger SMTP), Automated Web Contact Forms, and SMS via **Tailscale Android SMS Gateway** (`http://10.132.90.251:8082`).
- **NO Termii**: Termii is NOT used. All SMS dispatches route through the Tailscale Android SMS Gateway.
- Safe Warm-up Limits: Day 1-2: 30 msgs/day -> Day 3-5: 45 msgs/day -> Day 6-7: 60 msgs/day.

## 3. SCHEDULE CYCLE
- Active 1-week campaign runs from **Monday, August 17, 2026 to Sunday, August 23, 2026**.

## 4. PHONE LINE ARCHITECTURE & ADMIN NOTIFICATIONS
- **ADMIN LINE (ALERTS & APPROVALS ONLY):** `0802 279 1227` (`ADMIN_WA_PHONE`) & Email (`bethelmindrecruit@gmail.com`). NEVER dispatch cold outreach from this number.
- **COLD OUTREACH LINE 1 (PRIMARY OUTREACH):** `0702 626 6946` / `+234 702 626 6946` (`OUTREACH_WA_PHONE_1`, Port `3007`, Name: `Tosin 1`, Primary Auth: `local_db/baileys_auth`, Solidified Backup: `local_db/baileys_auth_solidified_backup` & `local_db/baileys_auth_permanent_master`).
- **COLD OUTREACH LINE 2 (ROTATOR OUTREACH):** `0904 605 0469` / `+234 904 605 0469` (`OUTREACH_WA_PHONE_2`, Port `3009`, Name: `TOSIN New`, Primary Auth: `local_db/baileys_auth_line2`, Solidified Backup: `local_db/baileys_auth_line2_solidified_backup`).
- **PERMANENT SESSION SOLIDIFICATION & SELF-HEALING:**
  - Both WhatsApp Lines (1 & 2) are 100% paired, authenticated, and cryptographically solidified.
  - NEVER delete, reset, or purge auth session directories.
  - In the event of system restart or missing creds, automatic self-healing immediately restores authentication from `baileys_auth_solidified_backup` and `baileys_auth_line2_solidified_backup`.
  - Both services run simultaneously on Ports `3007` (Line 1) and `3009` (Line 2) for round-robin outreach load balancing.
- **NO Admin SMS:** Do NOT send admin alerts or status updates via SMS (preserves carrier airtime).

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





