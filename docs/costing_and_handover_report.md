# ApexReach Lead Engine — Costing & Handover Report

This report outlines the **total costing breakdown** for running, deploying, and operating the ApexReach B2B Lead Engine web application, along with instructions for the final client handover. 

---

## 1. Project Costing Analysis
The platform has been designed to operate on a **fully optimized, low-cost micro-service architecture**. Depending on the operational volume, the system can run on a **Zero-Cost Model (Free Tiers)** or scale to a **Paid / Scaled Model** for large-scale cold outreach.

### A. Zero-Cost Model (Hobby Tiers)
Ideal for testing, initial launching, and low-volume local lead generation (< 1,000 leads/month).

| Service | Provider | Cost (Monthly) | Limits / Specifications |
| :--- | :--- | :--- | :--- |
| **Frontend & Dashboard** | Vercel (Hobby) | **$0.00** | Unlimited deployments, 100GB bandwidth, SSL included. |
| **Database & CRM** | Supabase (Free Tier) | **$0.00** | 500MB PostgreSQL storage, 50,000 monthly active users. |
| **AI Processing & Redesign** | Google AI Studio (Gemini 1.5 Flash) | **$0.00** | Free tier: 15 Requests Per Minute (RPM), 1,500 Requests Per Day. |
| **Google Maps Scraper** | Google Places API (via GCP) | **$0.00** | GCP offers $200 free monthly credit (covers ~10k Place searches). |
| **Email Outreach** | Gmail (OAuth) / SendGrid (Free) / SMTP | **$0.00** | SendGrid Free: 100 emails/day. SMTP: Unlimited via generic host. |
| **WhatsApp Outreach** | Custom Baileys Daemon (Self-Hosted) | **$0.00** | Uses paired personal phone number (runs locally on port 3006). |
| **Local Playwright Scrapers** | Local Dev Server | **$0.00** | Run long scrapers locally using the terminal. |
| **Payment Collection** | Paystack Gateway | **$0.00** | No setup or monthly fees. Pay-per-transaction only (1.5% local). |
| **Total Monthly Cost** | | **$0.00** | **Fully functional dashboard, database, landing pages, and outreach.** |

---

### B. Paid / Scaled Model (Production Infrastructure)
Recommended for high-volume automated operations (> 10,000 outreach targets/month).

| Service | Provider | Cost (Monthly) | Description / Scale Capability |
| :--- | :--- | :--- | :--- |
| **Persistent Web Scrapers** | Railway.app | **~$5.00 - $10.00** | Runs scrapers 24/7 in the cloud without serverless timeouts. |
| **Database & Logs** | Supabase (Pro Plan) | **$25.00** | Uncapped storage, daily backups, and database point-in-time recovery. |
| **AI Personalization** | Gemini 1.5 Flash (Paid API) | **~$0.10 - $0.50** | Pay-as-you-go pricing: $0.075 per 1M input tokens. *Extremely cheap*. |
| **Email Outreach (Bulk)** | Resend (Pro) / SendGrid Paid | **$15.00 - $20.00** | SendGrid Essentials: $19.95/mo (40k emails/mo). Resend: $20.00 (50k). |
| **WhatsApp Marketing** | Meta API / Evolution API | **Pay-per-msg** | Marketing messages: ~₦10.50 to ₦14.00 per conversation. |
| **SMS Notifications** | Termii / AfricasTalking | **Pay-per-msg** | Local African SMS: ~₦2.50 to ₦4.00 per message sent. |
| **Cold Calling (Automated)** | Twilio Voice | **~$1.15 + usage** | $1.15/mo for virtual phone number, $0.014/min for outbound calls. |
| **Setup Claim Payments** | Paystack Gateway | **1.5% per tx** | local cards fee capped at ₦2,000 per transaction. |
| **Total Estimated Operating Cost**| | **~$35.00 - $65.00** | **Supports fully automated, scalable B2B outbound campaign engine.** |

---

### C. Fixed Annual Costs (Mandatory)
These are mandatory fixed costs paid annually to third-party domain registrars:

- **Custom Domain Name (.com / .com.ng):** ~₦15,000 - ₦25,000 / year (approx. **$10.00 - $15.00 / year**).
- **SSL Certificates:** **$0.00** (auto-provisioned for free by Vercel/Netlify).

---

## 2. Final Web App Implementation Status
The ApexReach B2B Lead Engine code is complete, tested, and compiles with zero errors:
- **Build Status:** Compiles successfully (`Next.js 16.2.7` utilizing Next.js App Router Turbopack).
- **Database Schema:** Defined in `supabase_schema.sql` (includes custom triggers, indexes, and full support for `leads`, `dnc` (Do Not Call), and operational `logs`).
- **Interactive Scrapers:** Google Places API, OSM, DuckDuckGo, Jiji.ng Crawler, and Social Scrapers (Facebook, Instagram, LinkedIn, TikTok) are integrated.
- **Outreach Pipelines:** Email (Gmail, Resend, Brevo, SMTP, SendGrid), SMS (Termii, AfricasTalking, Gateway), WhatsApp (Cloud API, Evolution API, Whapi, Baileys), and Twilio Cold Calling are implemented.
- **Paystack Payment Gateway:** Fully integrated with custom `/api/paystack/initialize` and `/api/paystack/verify` endpoints for online claiming of generated sites.

---

## 3. Step-by-Step Handover Guide for Client

To transfer complete ownership to the client, execute the following steps:

### Step 1: Forking & GitHub Handover
1. Invite the client's GitHub account to the private repository.
2. In the repository **Settings > General**, select **Transfer ownership** and input the client's GitHub username.
3. Once the client accepts, the code is fully in their possession.

### Step 2: Database Handover (Supabase)
1. Instruct the client to sign up for a free account at [Supabase](https://supabase.com/).
2. Create a new database project named `apexreach-crm` in their account.
3. Go to the **SQL Editor**, click **New Query**, paste the contents of `supabase_schema.sql` from this repository, and click **Run**.
4. Retrieve the **Supabase URL**, **Anon Public Key**, **Service Role Key**, and **Database Connection URI** from **Project Settings > API**.

### Step 3: Frontend Handover (Vercel)
1. Instruct the client to sign up for a free account at [Vercel](https://vercel.com).
2. Click **Add New... > Project** and import the freshly forked GitHub repository.
3. Add the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY` (obtained for free from Google AI Studio)
   - `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` (obtained from Paystack Dashboard)
   - `CLAIM_FEE_NGN` (set to your preferred setup claim fee, e.g., `150000`)
4. Click **Deploy**. Vercel will host the dashboard and landing pages online.

### Step 4: Run the Configuration Sync Wizard
1. On the client's local system (or server), run:
   ```bash
   npm run auto-setup
   ```
2. Follow the prompt questions to input their keys. This synchronizes their local `.env.local` and `config.json` configuration variables with the Supabase PostgreSQL database.

### Step 5: Start Local Self-Hosted WhatsApp Service (Baileys)
To use the free, self-hosted WhatsApp outreach service (Option 3):
1. In the project directory, start the background connection manager script:
   ```bash
   npm run whatsapp-service
   ```
2. Open the browser administrative dashboard, navigate to the **Settings** tab, choose **Custom Baileys Service (Free / QR Code)** as the WhatsApp Outreach Provider.
3. Scan the generated QR code directly from the screen with any WhatsApp-enabled phone (Linked Devices scan).

---
*Deliverable compiled and finalized by Antigravity.*
