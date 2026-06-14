# ApexReach B2B Lead Engine — Comprehensive Setup & Deployment Guide

This guide covers the end-to-end setup of the ApexReach Lead Engine. Using this architecture, you will have:
1. **Local Environment**: For development and testing.
2. **Vercel**: For a lightning-fast, free public-facing admin dashboard and client-facing AI landing pages.
3. **Railway**: For running background Playwright web scrapers without request timeouts.
4. **Supabase**: As the single source of truth database synchronizing all environments.

---

## Architecture Overview

```mermaid
graph TD
    A[Vercel: Dashboard & Landing Pages] -->|Reads & Writes| C(Supabase Postgres Database)
    B[Railway: Long-running Web Scrapers] -->|Writes Scraped Leads| C
    D[Local Machine: Development & Testing] -->|Reads & Writes| C
```

---

## Step 1: Local Setup & Database Automation

We have built an automated script that configures your local variables and deploys the Supabase database schema in one command.

1. Open your terminal in the project directory:
   ```bash
   npm run auto-setup
   ```
2. The wizard will ask for:
   * **Supabase URL & Keys**: Obtained from your Supabase Dashboard under **Project Settings > API**.
   * **Database Connection URI**: Copy the connection string from Supabase **Project Settings > Database > Connection String > URI**.
     * *Format: `postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres`*
   * **Gemini API Key**: Obtain your free API key from [Google AI Studio](https://aistudio.google.com/).
3. **What happens automatically**:
   * The script installs database drivers (`pg`), connects to Supabase, and runs `supabase_schema.sql` to create all tables (`leads`, `dnc`, `logs`) and performance indexes.
   * Your `.env.local` and `config.json` files are automatically generated and synchronized.

*(If you choose to skip the connection string step, you must copy the contents of `supabase_schema.sql` and paste them manually in the **SQL Editor** on your Supabase dashboard.)*

---

## Step 2: Push Code to GitHub

A GitHub repository is required to enable automatic builds and deployments on Vercel and Railway.

1. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "feat: setup automated environments for vercel and railway"
   ```
2. Create a new repository on your GitHub account.
3. Link and push your project:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy Frontend & Dashboard to Vercel

Vercel will host the Next.js frontend, lead directory page, configuration screens, and the AI-generated landing pages.

1. Log in to the [Vercel Dashboard](https://vercel.com).
2. Click **Add New... > Project** and import your GitHub repository.
3. Keep the framework preset as **Next.js**.
4. Expand **Environment Variables** and add the following keys from your `.env.local`:
   * `STORAGE_MODE` = `supabase`
   * `NEXT_PUBLIC_SUPABASE_URL` = *(Your Supabase URL)*
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY` = *(Your Supabase Anon Key)*
   * `SUPABASE_SERVICE_ROLE_KEY` = *(Your Supabase Service Role Key)*
   * `GEMINI_API_KEY` = *(Your Gemini Key)*
   * `DRY_RUN` = `true` (or `false` for live outreach)
   * `BUSINESS_SIGNATURE` = `ApexReach`
5. Click **Deploy**. Your frontend is now online.

---

## Step 4: Deploy Web Scrapers to Railway

Railway will run Next.js as a persistent Node server, allowing your free Playwright/Chromium scrapers to run continuously without Vercel's 10-second serverless timeout.

1. Install the Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
2. Log in in your terminal:
   ```bash
   railway login
   ```
3. Initialize the project:
   ```bash
   railway init
   ```
   *Choose "Create New Project" and select a project name.*
4. Deploy the service:
   ```bash
   railway up
   ```
   *Railway's build system (Nixpacks) will automatically detect the Next.js app and install all necessary Linux packages for running Chrome/Playwright.*
5. **Configure Environment Variables**:
   * Open the Railway Dashboard.
   * Go to **Variables** and add the same environment variables you put in Vercel.
6. **Generate Domain**:
   * Under **Settings > Networking**, click **Generate Domain** to get a public URL for your Railway API endpoints.
