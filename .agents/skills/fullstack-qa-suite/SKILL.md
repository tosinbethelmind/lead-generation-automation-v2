---
name: fullstack-qa-suite
description: >-
  Run deep automated full-stack QA, conversion friction audits, and route reliability verification
  across public landing pages, standalone sector tools, dynamic client preview engines (/preview/[lead_id]),
  and calculation APIs (/api/sector-tools) for Bethelmind Digital Solutions. Use when auditing site reliability,
  verifying pre-deployment health, testing conversion funnels, or checking for 404s, NaN/null UI artifacts,
  and payment consistency.
---

# Full-Stack QA & Conversion Verification Suite

This skill equips the agent with automated testing runbooks, conversion friction heuristic audits, and route reliability verification for Bethelmind Digital Solutions.

## When to Run

Execute this test suite:
1. **Pre-Deployment**: Before pushing any frontend or API commit to `origin/main` or deploying to Vercel.
2. **Post-Deployment**: Immediately after a production deploy to verify live HTTP status, latency, and assets.
3. **Weekly Health Check**: To ensure zero 404s or stale payment configurations are served to prospects.
4. **Before High-Volume Outreach**: Prior to dispatching daily SMS/WhatsApp campaigns to prevent wasting outreach on broken links.

---

## 34-Point Automated Verification Engine

The automated test runner is located at [`scripts/deep_landing_page_and_tool_tester.js`](file:///c:/Users/HomePC/Desktop/website%20Projects/lead%20generation%20automation/scripts/deep_landing_page_and_tool_tester.js).

### Executing the Suite

#### 1. Test Live Production (`https://www.bethelmindanalytics.com`)
```bash
node scripts/deep_landing_page_and_tool_tester.js
# or via npm
npm run test:qa
```

#### 2. Test Localhost Development Server (`http://localhost:3006`)
```bash
node scripts/deep_landing_page_and_tool_tester.js --local
# or custom target URL
node scripts/deep_landing_page_and_tool_tester.js --url=https://your-custom-preview.vercel.app
```

---

## The 5 Verification Tiers

### Tier 1: Public Core Routes & Standalone Tools (HTTP 200 & Sub-Second Latency)
Every public route must return `HTTP 200` without redirect loops or 404s:
- `/` (Home Hero & Platform Engine)
- `/preview/[lead_id]` (Dynamic SME Prototype with fallback)
- `/preview/locvilla-salon` (Beauty/Luxury Salon Theme)
- `/preview/solar-wizard-nigeria` (Solar Sizing Theme)
- `/sites/[lead_id]` (Client Live Site)
- `/handover/[lead_id]` (Client Handover Portal)
- `/solutions` (Solutions Catalog)
- `/marketplace` (Digital Storefront)
- `/walkthrough` (System Demo & Video Guide)
- `/tools/solar-boq` (Standalone Solar Calculator)
- `/tools/salon-booking` (Salon Booking & Deposit Lock)
- `/tools/tokunbo-duty` (Tokunbo Customs Duty & Port Clearing)
- `/tools/integrations` (Fast Webhook Blueprint)

### Tier 2: Dynamic Preview API & Sanitization (`/api/preview/generate`)
- Confirms valid JSON response.
- Verifies lead name is strictly Title-Cased and free of directory tags, raw hex, or phone numbers as names.
- Asserts corporate settlement account is strictly **Moniepoint Microfinance Bank (`6805375225` — Bethelmind Digital Solutions)**.

### Tier 3: Sector Calculation Engines (`/api/sector-tools`)
Simulates user submissions across all 8 sector tools:
1. `solar_boq`: Validates kVA sizing, lithium battery calculations, and 50% deposit amounts.
2. `tokunbo_port_clearing`: Validates 2026 NCS valuation, terminal demurrage, and clearance fees across Lagos ports.
3. `beauty_salon_booking`: Validates stylist tier, hair length pricing, and 25% no-show deposit lock code.
4. `shortlet_booking`: Validates nightly rate, electricity allowance, and caution fee escrow.
5. `school_tuition`: Validates termly tuition ledger, boarding split, and scratch PIN generator.
6. `mortgage_amortization`: Validates down payment, monthly installments, and total repayment.
7. `logistics_delivery`: Validates interstate waybill sizing and intra-city dispatch courier pricing.
8. `cac_filing`: Validates statutory CAC registration and FIRS stamp duty.

### Tier 4: Edge Cases & Error Resilience
- **Empty Payloads**: Asserts API returns clean `400 Bad Request` rather than unhandled `500` server crashes.
- **Negative & Zero Inputs**: Verifies input clamps (e.g. negative kVA auto-clamps to minimum 1kVA).
- **Malformed JSON**: Asserts graceful error recovery.

### Tier 5: Conversion Trust & CTA Integrity
- **1-Tap WhatsApp Closer Link**: Must link to `wa.me/2348022791227` (`0802 279 1227`).
- **CAC Certification & Payment Trust**: Displays Moniepoint MFB corporate details (`6805375225`).
- **Mobile Viewport Meta**: Enforces `width=device-width, initial-scale=1` for Android/iOS responsive layout.
- **Pricing Clarity**: Confirms presence of low-friction `₦35,000` Starter Activation option.
- **Anti-Pattern Scrubbing**: Zero visible `NaN`, `undefined`, `null`, or `[object Object]` artifacts in rendered HTML.

---

## Known Failure Modes & How to Fix Them

1. **`/tools/*` 404 on Vercel**:
   - Check `.vercelignore`: Ensure rule is `/tools/` (with a leading slash) to avoid ignoring `src/app/tools/`.
   - Check `src/app/tools/[slug]/page.tsx`: Verify `generateStaticParams()` includes the slug.
2. **Stale Bank Account in Preview API**:
   - Check `config.json` in the root: Ensure `moniepointAccountNumber` is `6805375225`.
   - Check `src/lib/localConfig.ts`: Ensure `DEFAULT_CONFIG` has `6805375225`.
3. **Vercel Build Cache Conflicts**:
   - Run `node scripts/deploy_vercel.js` to trigger a clean deployment.
