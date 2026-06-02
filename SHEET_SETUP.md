# Google Sheets Structure & Configuration

## 1. Sheets (Tabs) Setup
Create a new Google Sheet and rename the tabs exactly as follows:
1. `Leads`
2. `Config`
3. `DNC`
4. `Logs`

---

## 2. Columns Setup

### Tab: `Leads`
Row 1 Headers (Freeze this row):
`lead_id`, `source`, `name`, `category`, `address`, `area`, `city`, `phone_e164`, `phone_raw`, `email`, `website`, `rating`, `reviews_count`, `verified`, `listings_count`, `profile_url`, `source_query_or_seed`, `collected_at`, `status`, `last_contacted_at`, `duplicate_of_lead_id`, `business_summary`, `notes`

### Tab: `Config`
This sheet is divided into sections. You can put these side-by-side or vertically.

**Section A: Global Settings (Columns A-B)**
| Key | Value | Description |
|-----|-------|-------------|
| `google_places_api_key` | `YOUR_API_KEY` | Enable Places API (New) or Places API in Cloud Console |
| `max_requests_per_minute` | `60` | Safety cap |
| `dry_run` | `TRUE` | Set to FALSE to actually send messages |
| `apify_token` | `YOUR_APIFY_API_TOKEN` | Token from Apify Console |
| `apify_dataset_id` | `YOUR_DATASET_ID` | Dataset ID containing scraped leads |

**Section B: WhatsApp Settings (Columns D-E)**
| Key | Value | Description |
|-----|-------|-------------|
| `whatsapp_enabled` | `TRUE` | Master switch |
| `whatsapp_daily_cap` | `1000` | As per your request |
| `whatsapp_phone_number_id` | `YOUR_PHONE_ID` | From Meta App Dashboard |
| `whatsapp_access_token_key` | `WHATSAPP_ACCESS_TOKEN` | Key name in Script Properties |
| `whatsapp_template_name` | `lead_intro_v1` | The exact name in Meta Manager |
| `whatsapp_template_language_code` | `en_US` | Language code |
| `whatsapp_opt_out_keyword` | `STOP` | |
| `business_signature` | `Bethelmind Analytics & Strategy` | |

**Section C: JIJI_SEARCH_SEEDS (Columns G-N)**
Headers: `jiji_seed_url`, `max_pages_per_seed`, `max_vendors_per_seed`, `max_listings_per_vendor`, `verified_only`, `min_listings_count`, `required_keywords`, `exclude_keywords`

*Example Row:*
`https://jiji.ng/ikeja/cars`, `5`, `20`, `0`, `TRUE`, `5`, ``, ``

**Section D: GOOGLE_MAPS_QUERIES (Columns P-U)**
Headers: `maps_query`, `min_rating`, `min_reviews`, `include_types`, `exclude_types`, `max_results_per_query`

*Example Row:*
`car dealer Ikeja Lagos`, `4.0`, `50`, ``, ``, `20`

### Tab: `DNC`
Headers: `phone_e164`, `email`, `domain`, `reason`, `added_at`

### Tab: `Logs`
Headers: `run_id`, `ts`, `step`, `url_or_id`, `result`, `error`

---

## 3. WhatsApp Template Guide
Create this template in your Meta WhatsApp Manager:

**Template Name:** `lead_intro_v1` (or whatever you set in Config)
**Category:** `MARKETING`
**Language:** `English (US)`

**Body Text:**
"Hello {{1}},

I noticed your {{2}} business in {{3}}.

{{4}}

We specialize in helping verified businesses like yours grow. Are you open to discussing better management tools?

{{5}}"

**Variable Mapping (for your reference):**
- `{{1}}` (Variable 1) -> `{{name}}`
- `{{2}}` (Variable 2) -> `{{category}}`
- `{{3}}` (Variable 3) -> `{{area}}`
- `{{4}}` (Variable 4) -> `{{business_summary}}` (This contains the generated sentence)
- `{{5}}` (Variable 5) -> `{{business_signature}}`

*(Note: We can map more variables if needed, but the business_summary is designed to be a dynamic sentence incorporating rating and listings count)*
