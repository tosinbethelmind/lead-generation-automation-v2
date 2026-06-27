# ApexReach B2B Lead Automation — Vercel Deployment Guide

This guide describes how to deploy the ApexReach B2B Lead Sequencer to **Vercel** and connect it to your new **Supabase PostgreSQL** database.

---

## 1. Step-by-Step Vercel Deployment

1.  **Push your repository to GitHub:**
    *   Create a new blank repository in GitHub (e.g. `apexreach-lead-engine`).
    *   Run these commands inside your local directory to link and push your code:
        ```bash
        git remote add origin https://github.com/YOUR_GITHUB_USERNAME/apexreach-lead-engine.git
        git branch -M main
        git add .
        git commit -m "feat: integrate Git, Supabase storage, and Vercel environment presets"
        git push -u origin main
        ```

2.  **Import to Vercel:**
    *   Log in to the [Vercel Dashboard](https://vercel.com).
    *   Click **Add New...** > **Project**.
    *   Select your newly pushed `apexreach-lead-engine` repository.
    *   Leave the default **Framework Preset** as **Next.js**.

3.  **Configure Environment Variables:**
    *   Expand the **Environment Variables** section and insert the keys below.

---

## 2. Environment Variables Checklist

Add these variables to **Vercel Project Settings > Environment Variables**:

| Variable Name | Description | Value Example / Recommendation |
| :--- | :--- | :--- |
| **`STORAGE_MODE`** | Instructs active driver selections | `supabase` |
| **`NEXT_PUBLIC_SUPABASE_URL`** | Your Supabase Project API URL | `https://your-proj-id.supabase.co` |
| **`SUPABASE_SERVICE_ROLE_KEY`** | Secret Service Key (bypasses RLS limits) | `eyJhbG...` (Find in Supabase settings > API) |
| **`DRY_RUN`** | Enable simulation mode to prevent real costs | `true` (change to `false` to live dispatch) |
| **`GOOGLE_PLACES_API_KEY`** | Google Cloud Console Maps/Places key | `AIzaSy...` (Optional, for Places ingestion) |
| **`APIFY_TOKEN`** | Apify platform authorization key | `apify_api_...` (Optional, for Apify scraping) |
| **`APIFY_DATASET_ID`** | Target Apify B2B Dataset ID | `your-dataset-id` (Optional) |
| **`WHATSAPP_PHONE_NUMBER_ID`** | Meta Business Developer Phone ID | `1029384756...` (Optional, for outreach) |
| **`WHATSAPP_ACCESS_TOKEN`** | Meta Cloud API Permanent Token | `EAAG...` (Optional) |
| **`WHATSAPP_TEMPLATE_NAME`** | Target Template Name registered in Meta | `lead_outreach_1` (Optional) |
| **`WHATSAPP_TEMPLATE_LANGUAGE_CODE`** | Language code of registration template | `en_US` |
| **`WHATSAPP_DAILY_CAP`** | Daily safety budget ceiling limit | `50` |
| **`WHATSAPP_ENABLED`** | Turn outreach sequencer ON/OFF | `false` (change to `true` to active) |
| **`BUSINESS_SIGNATURE`** | Custom signature for dynamic templates | `Bethelmind Analytics` |
| **`REMOTE_BROWSER_WS`** | Remote Chrome browser WebSocket URL (e.g. Browserless.io) | `wss://chrome.browserless.io?token=YOUR_API_KEY` (Required for serverless Puppeteer scraping) |

---

## 3. Playwright & Puppeteer Serverless Behavior

Standard Vercel ephemeral serverless function runtime restricts local Chrome binary executions due to package limits (50MB) and missing system dependencies (like `libnss3.so`).
*   **Remote Browser Support**: To run live Puppeteer/Chromium scrapers (like `Maps-Free`) in production on Vercel, set the **`REMOTE_BROWSER_WS`** environment variable to a remote browser endpoint (e.g., Browserless.io). The launcher will automatically connect via WebSockets, bypassing all local library dependencies and CPU/memory constraints.
*   **Sandbox Fallback:** If `REMOTE_BROWSER_WS` is not configured, running local chromium in the serverless environment may fail due to runtime limitations. In these cases, the engine logs the limitation and triggers the sandboxed mockup lead provider engine or fails cleanly depending on the execution policy.
*   **Unrestricted APIs:** The Google Places Ingest pipeline, Apify B2B Platform Scraping, and WhatsApp dispatch sequences run at 100% capacity in serverless functions because they are pure web request API operations.

