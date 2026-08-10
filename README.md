# Bethelmind Analytics & Strategy — Website

AI-assisted WhatsApp enquiry handling, lead qualification, simple CRM, and sector workflow tools for Lagos businesses.

**Live URL:** [https://www.bethelmindanalytics.com](https://www.bethelmindanalytics.com)

## Quick Start

```bash
npm ci
cp .env.example .env.local   # then fill in your real values
npm run dev
```

For full deployment instructions see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Configuration Guide

### 1. Set Your OPay Account Details

Open `.env.local` and set:

```env
NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME="Bethelmind Analytics & Strategy"
NEXT_PUBLIC_PAYMENT_BANK_NAME="OPay"
NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER=YOUR_10_DIGIT_OPAY_NUMBER
NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER=2348022791227
```

> ⚠ The payment section shows a "not configured" warning until `NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER` is set. Do **not** hard-code account numbers in JSX — always use the env var.

### 2. Change Plan Prices

Edit `src/config/plans.ts`. Each plan object has:

```ts
{
  monthlyNGN: 15_000,   // monthly subscription fee
  setupFeeNGN: 25_000,  // one-time setup/onboarding fee
}
```

Save the file — pricing UI and WhatsApp messages update automatically.

### 3. Change WhatsApp Business Number

Update `NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER` in `.env.local`. Format: digits only, no `+` or spaces (e.g. `2348022791227`). All WhatsApp links across the site use this single env var via `src/config/payment.ts`.

### 4. Switch to Paystack or OPay API (future)

When you are ready for an automated payment gateway:

1. Open `src/config/payment.ts`
2. Change `paymentMode` to `"paystack"` or `"opay_api"`
3. Add the secret key to `.env.local` (server-side only — no `NEXT_PUBLIC_` prefix)
4. Implement the gateway handler in `src/app/api/payment/`

The current `manual_opay_transfer` flow in `PaymentSection.tsx` checks `paymentConfig.paymentMode` and can be extended with an `if` branch.

### 5. Demo / Sample Content to Replace Before Heavy Marketing

The following sections contain illustrative data that must be replaced with real content:

| Section | File | What to Replace |
|---|---|---|
| CRM Preview | `src/components/home/CrmPreviewSection.tsx` | Generic sample business names — replace with real anonymised case examples once available |
| Trust Section | `src/components/home/TrustSection.tsx` | "Customer stories coming soon" placeholder — replace with real, documented client stories |
| Sector tool descriptions | `src/config/sectors.ts` | Tool descriptions are accurate; update if tool scope changes |
| Company credibility card | `src/components/home/TrustSection.tsx` | Add real contact email once confirmed |
| Legal pages | `src/app/legal/*/page.tsx` | All legal pages begin with a "template" warning — review with a qualified Nigerian lawyer |

---

## Project Structure (Homepage)

```
src/
  config/
    payment.ts          # OPay config, WhatsApp number, reference generator
    plans.ts            # Pricing tiers (monthly + setup fee)
    sectors.ts          # Sector profiles, tools, Lagos districts
  components/home/
    Navbar.tsx
    HeroSection.tsx
    HowItWorksSection.tsx
    SolutionsSection.tsx
    SectorToolsSection.tsx
    CrmPreviewSection.tsx
    TrustSection.tsx
    PricingSection.tsx  # Pricing CTA bug fixed — each plan uses its own data
    PaymentSection.tsx  # Manual OPay transfer, env-var-driven
    FaqSection.tsx
    Footer.tsx
  app/
    home/page.tsx       # Orchestrates all sections above
    legal/              # Privacy, Terms, Acceptable Use, Refund, Responsible Outreach
```

---

*Built and maintained by Bethelmind Analytics & Strategy, Lagos, Nigeria.*
