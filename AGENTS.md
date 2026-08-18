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

