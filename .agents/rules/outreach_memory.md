# Antigravity Persistent Memory: Outreach & Engine Directives

1. **Engine Scope**: Exclusively **10K Lagos Engine** (Bethelmind Analytics).
2. **Exclusion**: **`solarquotepro.ng` is strictly excluded** from active outreach.
3. **SMS Architecture**: Strictly **Tailscale Android SMS Gateway** (`http://10.132.90.251:8082` with token `f34af5ea-f657-41b1-b83e-4a59eb786e57`). **Termii is completely excluded / NOT used**.
4. **Product Offer**: **Bethelmind Analytics B2B Website Prototype, WhatsApp Automation & Paystack Instant Setup Claim Portal** for Lagos businesses.
5. **Strict Branding**: Exclusively **Bethelmind Analytics**. NEVER use `ApexReach` in templates, signatures, SMS, or emails.
6. **WhatsApp Line Architecture & Solidification**:
   - **Admin Line (Approvals & Alerts ONLY):** `+234 802 279 1227` (`ADMIN_WA_PHONE`). Never dispatch cold messages from this number.
   - **Line 1 (Primary Cold Outreach):** `+234 702 626 6946` (`OUTREACH_WA_PHONE_1`, Port `3007`, Name: `Tosin 1`). Primary Auth: `local_db/baileys_auth`, Solidified Backup: `local_db/baileys_auth_solidified_backup`.
   - **Line 2 (Rotator Cold Outreach):** `+234 904 605 0469` (`OUTREACH_WA_PHONE_2`, Port `3009`, Name: `TOSIN New`). Primary Auth: `local_db/baileys_auth_line2`, Solidified Backup: `local_db/baileys_auth_line2_solidified_backup`.
   - **Self-Healing Persistence**: Both sessions are locked into memory and persistent disk. Any missing keys auto-restore from the solidified backups on boot without requiring re-pairing.
7. **Current Campaign Cycle**: Monday, Aug 17, 2026 to Sunday, Aug 23, 2026.
8. **Strict Manual Gate for Engines 1 & 3**:
   - **No active outreach** is allowed for Engine 1 (GMB Rescue) and Engine 3 (Expired Domains).
   - The scraping and accumulation processes for both engines must run continuously in the background.
   - Outreach execution for these segments remains paused until manually authorized by the user once a sufficient quantity is accumulated.
9. **Autonomous Customer Friction & Optimization Watchdog**:
   - The AI agent will continuously monitor user movements on the landing page and website templates (clicks, scrolls, time spent, widget interactions, rage clicks).
   - Telemetry must be audited periodically by the `autonomous_customer_friction_tracker.ts` background daemon and stored in `local_db/landing_page_friction_audit.json`.
   - This data is locked in memory and must be used as intelligence for programmatic upgrades, optimizing call-to-actions, reducing mobile input friction, and boosting conversion velocity over time.

