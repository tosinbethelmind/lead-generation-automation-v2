const XLSX = require('xlsx');
const path = require('path');

const wb = XLSX.utils.book_new();

// Sheet 1: Leads
const leadsHeaders = [
  'lead_id', 'source', 'name', 'category', 'address', 'area', 'city', 
  'phone_e164', 'phone_raw', 'email', 'website', 'rating', 'reviews_count', 
  'verified', 'listings_count', 'profile_url', 'source_query_or_seed', 
  'collected_at', 'status', 'last_contacted_at', 'duplicate_of_lead_id', 
  'business_summary', 'notes'
];
const wsLeads = XLSX.utils.aoa_to_sheet([leadsHeaders]);
XLSX.utils.book_append_sheet(wb, wsLeads, 'Leads');

// Sheet 2: Config
const configData = [
  ['Key', 'Value', 'Description', '', 'Key', 'Value', 'Description'],
  ['google_places_api_key', '', 'Enable Places API (New) or Places API in Cloud Console', '', 'whatsapp_enabled', 'TRUE', 'Master switch'],
  ['max_requests_per_minute', 60, 'Safety cap', '', 'whatsapp_daily_cap', 1000, 'As per your request'],
  ['dry_run', 'TRUE', 'Set to FALSE to actually send messages', '', 'whatsapp_phone_number_id', '', 'From Meta App Dashboard'],
  ['apify_token', '', 'Token from Apify Console', '', 'whatsapp_access_token_key', 'WHATSAPP_ACCESS_TOKEN', 'Key name in Script Properties'],
  ['apify_dataset_id', '', 'Dataset ID containing scraped leads', '', 'whatsapp_template_name', 'lead_intro_v1', 'The exact name in Meta Manager'],
  ['', '', '', '', 'whatsapp_template_language_code', 'en_US', 'Language code'],
  ['', '', '', '', 'whatsapp_opt_out_keyword', 'STOP', ''],
  ['', '', '', '', 'business_signature', 'Bethelmind Analytics & Strategy', ''],
  [],
  ['jiji_seed_url', 'max_pages_per_seed', 'max_vendors_per_seed', 'max_listings_per_vendor', 'verified_only', 'min_listings_count', 'required_keywords', 'exclude_keywords'],
  ['https://jiji.ng/ikeja/cars', 5, 20, 0, 'TRUE', 5, '', ''],
  [],
  ['maps_query', 'min_rating', 'min_reviews', 'include_types', 'exclude_types', 'max_results_per_query'],
  ['car dealer Ikeja Lagos', 4.0, 50, '', '', 20]
];
const wsConfig = XLSX.utils.aoa_to_sheet(configData);
XLSX.utils.book_append_sheet(wb, wsConfig, 'Config');

// Sheet 3: DNC
const dncHeaders = ['phone_e164', 'email', 'domain', 'reason', 'added_at'];
const wsDnc = XLSX.utils.aoa_to_sheet([dncHeaders]);
XLSX.utils.book_append_sheet(wb, wsDnc, 'DNC');

// Sheet 4: Logs
const logsHeaders = ['run_id', 'ts', 'step', 'url_or_id', 'result', 'error'];
const wsLogs = XLSX.utils.aoa_to_sheet([logsHeaders]);
XLSX.utils.book_append_sheet(wb, wsLogs, 'Logs');

const outputPath = path.join(__dirname, '..', 'ApexReach_Leads_Template.xlsx');
XLSX.writeFile(wb, outputPath);
console.log('Template created successfully at ' + outputPath);
