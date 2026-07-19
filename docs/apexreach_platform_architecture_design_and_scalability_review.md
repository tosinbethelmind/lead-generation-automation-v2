# ApexReach Platform Architecture: Design & Scalability Review

This document provides a deep-dive design and scalability review of the **ApexReach B2B Lead Engine** platform. It analyzes the current software architecture, investigates potential system bottlenecks, and outlines a technical roadmap to transition the platform from a hybrid local/serverless prototype to an enterprise-grade, high-throughput SaaS product.

---

## 1. Executive Summary & Core Platform Purpose

ApexReach is an automated B2B lead generation, enrichment, and cold outreach platform. The system operates on a hybrid architecture designed to achieve three primary objectives:
1. **Low-latency client interactions**: Fast dashboard response times and instant, sub-second API feedback during setup claim processes.
2. **Heavy computational operations**: Running headless browser-based scrapers (Playwright) that crawl search engines, directory platforms, and maps without hitting Vercel's serverless request timeout limits (10s to 60s).
3. **Resilient data propagation**: Synchronizing lead data, claim events, and communication logs bi-directionally between a high-reliability Supabase database and user-friendly Google Sheets CRMs.

---

## 2. System Architecture Blueprint

The current platform is deployed across three environments: **Vercel** (for frontend UI and serverless API endpoints), **Supabase** (for relational database storage and webhook-to-job persistence), and a **Local/Persistent Server** running the scraper execution daemons.

```mermaid
graph TD
    subgraph Client Tier [Client Tier - Vercel Serverless]
        FE[Dashboard & Previews]
        API[Serverless API Routes]
    end

    subgraph Storage Tier [Storage Tier - Supabase Cloud]
        DB[(PostgreSQL Database)]
        QueueTable[Scrape Jobs Table]
    end

    subgraph Worker Tier [Worker Tier - Persistent/Local Host]
        Runner[Local Job Runner CLI]
        Playwright[Playwright Scraping Engine]
        Baileys[Self-Hosted Baileys Daemon]
    end

    subgraph Integration Tier [Integration Tier - External APIs]
        GS[Google Sheets CRM]
        Paystack[Paystack Payment Gateway]
        Gemini[Google Gemini API]
    end

    %% Flow lines
    FE -->|Read/Write UI State| DB
    API -->|Enriches Leads / Reads Config| DB
    API -->|Write webhook logs| DB
    
    %% Queue flow
    API -->|1. Enqueue Scrape Job| DB
    Runner -->|2. Poll Queued Jobs| DB
    Runner -->|3. Trigger Scraping| Playwright
    Playwright -->|4. Enrich Details| DB
    
    %% Sync flow
    Runner -->|5. Sync Data| GS
    DB -->|Trigger Event| GS
    
    %% Payment and AI
    API -->|Initialize Transaction| Paystack
    Paystack -->|Webhooks| API
    Playwright -->|Analyze Website / Generate Mockup| Gemini
    Baileys -->|WhatsApp Outreach| Runner
```

### Components and Responsibilities

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend / Agent customizer** | Next.js 15+ (App Router), TailwindCSS | Serving responsive CRM controls, custom visual overrides, interactive simulators (Quotes, E-commerce Checkout, Reservation Widget), and custom CSS dynamic mockup generation. |
| **Backend API** | Next.js Route Handlers | Exposing lightweight REST endpoints for Paystack hook verify, outreach initiation, dynamic claim fee generation, and scraper queue routing. |
| **Database & Auth** | Supabase (PostgreSQL) | Persistence of `leads`, `logs`, `dnc` rules, and job queue state. |
| **Background Queue Worker** | Node.js Daemon (`local_job_runner.ts`) | Continuous database polling loop to execute long-running browser tasks and bypass serverless boundaries. |
| **WhatsApp Client** | Baileys (WS Daemon on port 3006) | Lightweight WebSocket daemon enabling browser QR code-based WhatsApp authentication and message delivery. |
| **Spreadsheet Sync** | Google Apps Script (`Code.gs`) | Bi-directional, schedule-driven polling to keep non-technical sales agents working directly from Google Sheets without accessing SQL databases. |

---

## 3. Software Pipeline Analysis

The data lifecycle within ApexReach is structured as a five-stage sequence:

```mermaid
flowchart LR
    Enqueue[1. Enqueue Job] --> Scrape[2. Scrape & Crawl]
    Scrape --> Score[3. AI Scoring]
    Score --> Sync[4. Two-Way CRM Sync]
    Sync --> Outreach[5. Outreach Cascade]
```

### 1. Job Queue Insertion
* When a user initiates a scrape request via the dashboard, `src/app/api/scrape/queue.ts` intercepts the payload.
* If `SCRAPER_EXECUTION_MODE` is set to `local`, it writes a job into the Supabase database with a status of `queued` and returns an immediate HTTP 200 response to the client. This decouples scraper initiation from the Vercel gateway, preventing client-side timeouts.

### 2. Scraping & Crawling
* The queue runner pulls the oldest `queued` job, marks it `running`, and spawns the scraper.
* **Tier 1 (Places API/OSM)**: Scrapes place entries, location coordinates, business hours, and phone numbers.
* **Tier 2 (Web Crawler - Cheerio)**: Fetches the company homepage, extracting emails, social media handles, and subpage contact links (crawling `/contact` or `/about` concurrently to find hidden details).
* **Tier 3 (Playwright Reveal)**: If direct maps phone number metadata is missing, Playwright drives a headless browser to simulate clicks on the business’s Google Maps profile phone button, waiting for the dynamic DOM node to render the phone string.

### 3. AI Scoring & Validation
* Before storing leads, the engine invokes **Gemini 1.5 Flash**.
* It passes the scraped metadata and crawls to classify:
  - Commercial viability (does this business present budget indications?).
  - Website quality/necessity (lacks a site, or current site is non-responsive/obsolete).
* Leads scoring below **5/10** are flagged or discarded to protect outbound marketing deliverability and limit API fees.

### 4. Two-Way CRM Sync
* Lead records are written to PostgreSQL.
* Google Sheets CRM executes a time-triggered polling script (`Code.gs`) to pull new leads.
* Agents can manually update lead statuses in the sheet (e.g. marking a lead as `claimed` or editing the domain); these updates are written back to PostgreSQL during the next synchronization loop.

### 5. Multi-channel Outreach Cascade
* The `OutreachManager` runs a priority-based dispatch:
  - **WhatsApp**: Triggers first if mobile number is active.
  - **Email**: Triggers as a fallback or secondary channel (via Gmail OAuth, SMTP, Resend, or Brevo).
  - **SMS**: Dispatches a text message (via Termii or Africa's Talking) if instant contact is required.
* **DNC Verification**: Before dispatch, phone numbers are validated against the `dnc` (Do Not Call) database to prevent spam compliance violations.

---

## 4. Concurrency & Scaling Design Review

ApexReach has implemented custom strategies to ensure stability during concurrent operations.

### A. Atomic Filesystem I/O (`atomicIo.ts`)
When executing automated E2E tests or running local services, concurrent file reads/writes on local databases or configuration files (like `config.json` or local JSON mock databases) can cause read corruptions or write collisions.

* **Atomic Renaming Pattern**: To write configurations safely, the `writeJsonFileSyncAtomic` function writes contents to a temporary random file first:
  ```typescript
  const tempPath = `${filePath}.tmp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  ```
  Once the write is fully completed and flushed, it performs an atomic filesystem rename `fs.renameSync(tempPath, filePath)`. The operating system guarantees that rename operations are atomic, eliminating the risk of partial writes.
* **Retry Loop Reader**: Reads use exponential backoffs with retry loops. If JSON parsing fails (indicating a write was mid-flight or locked), the reader pauses (50ms) and retries up to 5 times.

### B. Decoupled `git-batch` Preview Engine
When a prospective lead claims their upgraded website, the server must compile custom themes, construct custom components, and push the updated branch to GitHub to trigger Vercel rebuilds.

* **Sub-second Feedback**: The system utilizes the `git-batch` queue to handle Vercel deployments. It immediately registers the claim in the DB, sends a confirmation, and hands off the build task to a background worker queue, avoiding standard server timeouts.

---

## 5. Architectural Bottlenecks & Production-Grade Mitigations

While the current architecture is resilient, scaling to hundreds of thousands of operations per day exposes specific bottlenecks:

### Bottleneck 1: Database Connection Depletion
> [!WARNING]
> Serverless Next.js API endpoints establish direct PostgreSQL connections (port 5432) on every request. High-concurrency operations can rapidly exhaust Supabase's database connection pool limit (typically 60-100 on free/hobby tiers), throwing `too many clients already` errors.

```
[Serverless Routes] ------(Direct Port 5432)------> [PostgreSQL] (Connection Limits Exhausted)
```

#### Mitigation: Pointing to Supabase PgBouncer Pooler
Configure all serverless connection strings to use Supabase's connection pooler on **port 6543** utilizing **Transaction Mode** (e.g. PgBouncer or Supabase Supavisor). This allows hundreds of serverless functions to share a small, pre-allocated pool of persistent database connections.

```diff
- DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
+ DATABASE_URL="postgresql://postgres.pooler:password@db.supabase.co:6543/postgres?pgbouncer=true"
```

---

### Bottleneck 2: IP-Based Scraper Blocking & Captchas
> [!CAUTION]
> Playwright scraping Google Maps and Jiji from a single static IP address (such as a local machine or single Railway VM) will trigger automated Captchas and rate blocks within 100-300 consecutive requests.

#### Mitigation: Rotating Proxies & Search API Aggregation
1. **Dynamic Proxy Pools**: Implement a proxy rotation provider (e.g. Bright Data, Oxylabs, or ZenRows) inside the headless browser configuration (`src/lib/browserLauncher.ts`):
   ```typescript
   const browser = await playwright.chromium.launch({
     proxy: {
       server: process.env.PROXY_ROTATOR_URL!, // http://username:password@proxy.provider.com:8000
     }
   });
   ```
2. **SerpApi / Apify Fallback**: If scraping Google Places directly becomes too fragile due to changing search markup, route place detail lookups through an API aggregator that handles scaling, rotating proxies, and captcha resolution out of the box.

---

### Bottleneck 3: Paystack Webhook Spoofing
> [!WARNING]
> The system has public API endpoints for receiving Paystack payment confirmation webhooks (`/api/paystack/verify`). If these routes do not verify payload authenticity, malicious users can send mock success payloads and claim premium websites without making a payment.

#### Mitigation: HMAC SHA512 Signature Checks
Enforce signature validation inside the webhook route handler. Paystack signs all webhook requests with an `x-paystack-signature` header containing an HMAC SHA512 hash of the request body, using the shared `PAYSTACK_SECRET_KEY` as the secret key.

```typescript
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  const expectedSignature = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(bodyText)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid cryptographic signature" }, { status: 401 });
  }
  
  const payload = JSON.parse(bodyText);
  // Proceed with processing claim...
}
```

---

### Bottleneck 4: Worker Job Stalling
> [!IMPORTANT]
> If a local queue runner crashes or restarts mid-execution, active jobs are left in the `running` state permanently. Subsequent runs will bypass these jobs, leaving them stuck in limbo.

#### Mitigation: Database-Level Stale Recovery
1. **Runner Reset Routine**: The runner already calls `resetStuckJobs` on boot. For production, deploy a cron job or a Supabase Database Webhook that checks for jobs that have been in the `running` state for more than 15 minutes and resets them to `queued` with an incremented retry counter:
   ```sql
   UPDATE scrape_jobs 
   SET status = 'queued', retries = retries + 1, updated_at = NOW() 
   WHERE status = 'running' AND updated_at < NOW() - INTERVAL '15 minutes' AND retries < 3;
   ```
2. **Dead Letter Queue (DLQ)**: If a job fails or runs 3 times unsuccessfully, update its status to `failed` and log details in the `logs` database for system administrator diagnostics.

---

### Bottleneck 5: Horizontal Queue Worker Concurrency Conflicts
> [!CAUTION]
> If multiple queue runners poll the Supabase jobs table concurrently, they may pick up and execute the same `queued` job simultaneously, causing duplicate browser launches, duplicate scraping costs, and database write conflicts.

#### Mitigation: SELECT FOR UPDATE with SKIP LOCKED
Replace basic selection queries in the polling worker with an atomic transactional checkout query using Postgres **SELECT FOR UPDATE SKIP LOCKED**. This query locks the target row and skips over any rows already locked by other runners, allowing multiple workers to poll the same database table safely.

```sql
-- Atomic checkout query executed by runners
UPDATE scrape_jobs
SET status = 'running', updated_at = NOW()
WHERE id = (
  SELECT id 
  FROM scrape_jobs 
  WHERE status = 'queued' 
  ORDER BY created_at ASC 
  LIMIT 1 
  FOR UPDATE SKIP LOCKED
)
RETURNING *;
```

---

## 6. Enterprise SaaS Architecture Roadmap

To scale ApexReach to handle enterprise-level volumes (millions of leads, thousands of concurrent campaigns), the application should migrate from a hybrid local/serverless configuration to a fully decoupled, message-driven cloud architecture.

### Recommended Enterprise Architecture

```mermaid
graph TD
    Client[Dashboard UI / CRM] -->|HTTP Request| API[Next.js API Gateway]
    API -->|1. Enqueue Job| Redis[(Redis Broker)]
    
    subgraph Cluster [Distributed Worker Cluster]
        Worker1[BullMQ Worker 1]
        Worker2[BullMQ Worker 2]
        Worker3[BullMQ Worker 3]
    end

    Redis -->|2. Pull Tasks| Worker1
    Redis -->|2. Pull Tasks| Worker2
    Redis -->|2. Pull Tasks| Worker3

    subgraph ServicePool [Containerized Browser instances]
        Chrome1[Browserless.io Instance 1]
        Chrome2[Browserless.io Instance 2]
        Chrome3[Browserless.io Instance 3]
    end

    Worker1 -->|Launch browser connection| Chrome1
    Worker2 -->|Launch browser connection| Chrome2
    Worker3 -->|Launch browser connection| Chrome3

    Worker1 -->|3. Persist Output| DB[(Supabase Relational DB)]
    Worker2 -->|3. Persist Output| DB
    Worker3 -->|3. Persist Output| DB
```

### Transition Steps

1. **Migrate Queue Engine to BullMQ/Redis**:
   * Replace PostgreSQL polling with **BullMQ** or **Inngest** running on **Redis**. Redis memory queues offer sub-millisecond locking speeds, built-in retry backoffs, dynamic rate limiting, and parent-child task chaining.
2. **Containerize Scraper Workers (Docker & AWS ECS)**:
   * Bundle the worker scripts into a lightweight Docker image containing Chrome dependencies.
   * Host workers on **AWS ECS Fargate** or **Google Cloud Run**. Configure auto-scaling rules to spin up additional containers as the queue length increases.
3. **Decouple Headless Browsers via Browserless**:
   * Running Chromium inside scraping workers consumes heavy CPU and memory. Offload browser rendering to a dedicated cluster of **Browserless.io** containers, connecting scraping workers to them via WebSockets (`playwright.chromium.connectOverCDP`).
4. **Implement Global Rate Limit Controllers**:
   * Leverage Redis-based rate limiters to throttle outbound campaigns dynamically. Ensure that email providers do not trigger spam rules and WhatsApp messages comply with hourly messaging limits.

---

## 7. Security and Governance Assessment

1. **API Keys Isolation**:
   * *Risk*: The client-facing customization panel reads system variables.
   * *Audit*: Verify that `SUPABASE_SERVICE_ROLE_KEY` is not present in `.env` configurations accessible by client browsers. Restricted admin-level actions (e.g. deleting leads, clearing the DNC list) must be processed entirely server-side using cryptographically verified user JWTs.
2. **Cheerio Crawl Timeout Safeguards**:
   * Crawling third-party web domains is highly unpredictable; servers can hang on non-responsive sockets. Ensure all cheerio HTTP fetches continue to enforce the 6000ms `AbortController` timeout to prevent exhaustion of serverless execution resources.
3. **PostgreSQL Row-Level Security (RLS)**:
   * Enforce RLS on the `leads` table in Supabase. Authenticated users (agents) should only read leads matching their organization identifier, while public access is restricted to landing page previews for matching lead tokens.

---
*Review compiled and structured by Antigravity.*
