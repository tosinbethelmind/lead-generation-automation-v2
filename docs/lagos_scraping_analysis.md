# Lagos daily 10K Scraping Infrastructure — Engineering & Diagnostic Report

This report analyzes the recurring bottlenecks and infrastructure failures within the 10,000-lead daily scrapers for the Lagos market, detailing immediate remedies and strategic recommendations.

---

## 1. Identified Issues & Diagnostic Log Analysis

### A. Runner Communication Mismatch (Fetch Failed)
- **Problem**: Analysis of `check_runners.js` diagnostic checks revealed consecutive scraping job terminations with `error_message: "fetch failed"`.
- **Root Cause**: The runner process resolves its target URL via `LOCAL_BASE_URL` using `process.env.PORT || '3006'`. However, when test runners or other shells execute, they set or propagate `PORT=3009` (configured for Playwright tests in `playwright.config.ts`).
- **Effect**: The runner targets `http://localhost:3009/api/scrape/...`, while the Next.js development server is actually listening on `http://localhost:3006`. This port mismatch forces the fetch library to throw a connection-refused (`ECONNREFUSED`) exception.

### B. Stale Worker Process Execution
- **Problem**: When modifications are deployed to the background runner script (`local_job_runner.ts`), the running daemon does not automatically reload custom edits (such as the heartbeat payload improvements).
- **Root Cause**: The orchestrator is managed using `scripts/keep_alive_runner.js` which only restarts the runner process in case of an unhandled crash or code 1 exit. It does not possess a watch or hot-reload mechanism.

### C. Degraded Lead Yields (Low-Yield Fallbacks)
- **Problem**: Successful scraping operations frequently only yield 0 to 2 leads.
- **Root Cause**: The `maps-free` route uses a hybrid strategy:
  1. OpenStreetMap (OSM)
  2. DuckDuckGo (DDG)
  3. Puppeteer Browser (via Google Maps Place scraper)
- If the browser fails to initialize (due to missing/invalid API keys like `"invalid-token"` or network blocks), it falls back to OSM + DDG. Since OSM has extremely sparse business nodes for Lagos and DDG is limited to text snippets, the job yields very few leads.

---

## 2. Implemented & Proposed Immediate Fixes

1. **Dynamic Local Port Auto-Discovery**:
   Upgrade `local_job_runner.ts` to query potential ports (`3006`, `3005`, `3009`, etc.) on start to locate the active Next.js server, resolving mismatch issues.
2. **Process Restart Daemon**:
   Ensure keep-alive runners are restarted via a clean process refresh when codebase alterations are registered.

---

## 3. High-Volume Scaling Recommendations

- **Rotate API Keys**: Maintain a robust rotatable list of browserless.io keys in `config.json` to prevent key exhaustion.
- **Enhanced Local Browser Fallback**: Implement a automatic local fallback to a headless Chromium binary if cloud-based browser platforms fail.
- **Parallel Dispatching & Concurrency Tune-Ups**: Increase `maxJobsToQueue` limits and partition runs to prevent database concurrency limits from stalling the pipeline.
