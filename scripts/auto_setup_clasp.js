const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Directory for the clasp project (temporary)
const claspDir = path.join(__dirname, '..', 'clasp_project');
if (fs.existsSync(claspDir)) {
  // Remove previous project directory
  fs.rmSync(claspDir, { recursive: true, force: true });
}
fs.mkdirSync(claspDir);

// 1. Create a container‑bound spreadsheet project via clasp
console.log('Creating Google Sheet with clasp...');
execSync('npx @google/clasp create --type sheets --title "ApexReach Leads"', {
  cwd: claspDir,
  stdio: 'inherit'
});

// 2. Write the setup function (setupSheet) that will configure tabs & headers
const setupCode = `
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Rename default sheet to Leads
  const sheet1 = ss.getSheets()[0];
  sheet1.setName('Leads');
  // Add other sheets
  const config = ss.insertSheet('Config');
  const dnc = ss.insertSheet('DNC');
  const logs = ss.insertSheet('Logs');

  // Write headers
  const leadsHeaders = [
    'lead_id','source','name','category','address','area','city',
    'phone_e164','phone_raw','email','website','rating','reviews_count',
    'verified','listings_count','profile_url','source_query_or_seed',
    'collected_at','status','last_contacted_at','duplicate_of_lead_id',
    'business_summary','notes'
  ];
  ss.getSheetByName('Leads').getRange('A1').offset(0,0,1,leadsHeaders.length).setValues([leadsHeaders]);

  const configData = [
    ['Key','Value','Description','', 'Key','Value','Description'],
    ['google_places_api_key','',"Enable Places API (New) or Places API in Cloud Console",'','whatsapp_enabled','TRUE','Master switch'],
    ['max_requests_per_minute',60,'Safety cap','', 'whatsapp_daily_cap',1000,'As per your request'],
    ['dry_run','TRUE','Set to FALSE to actually send messages','', 'whatsapp_phone_number_id','', 'From Meta App Dashboard'],
    ['apify_token','',"Token from Apify Console",'','whatsapp_access_token_key','WHATSAPP_ACCESS_TOKEN','Key name in Script Properties'],
    ['apify_dataset_id','',"Dataset ID containing scraped leads",'','whatsapp_template_name','lead_intro_v1','The exact name in Meta Manager'],
    ['', '', '', '', 'whatsapp_template_language_code','en_US','Language code'],
    ['', '', '', '', 'whatsapp_opt_out_keyword','STOP',''],
    ['', '', '', '', 'business_signature','Bethelmind Analytics & Strategy',''],
    [],
    ['jiji_seed_url','max_pages_per_seed','max_vendors_per_seed','max_listings_per_vendor','verified_only','min_listings_count','required_keywords','exclude_keywords'],
    ['https://jiji.ng/ikeja/cars',5,20,0,'TRUE',5,'',''],
    [],
    ['maps_query','min_rating','min_reviews','include_types','exclude_types','max_results_per_query'],
    ['car dealer Ikeja Lagos',4.0,50,'','',20]
  ];
  ss.getSheetByName('Config').getRange('A1').offset(0,0,configData.length,configData[0].length).setValues(configData);

  const dncHeaders = ['phone_e164','email','domain','reason','added_at'];
  ss.getSheetByName('DNC').getRange('A1').setValues([dncHeaders]);

  const logsHeaders = ['run_id','ts','step','url_or_id','result','error'];
  ss.getSheetByName('Logs').getRange('A1').setValues([logsHeaders]);
}
`;
fs.writeFileSync(path.join(claspDir, 'setup_sheet.gs'), setupCode);

// 3. Include Code.gs (your main script) in the project
const mainCode = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
fs.writeFileSync(path.join(claspDir, 'Code.gs'), mainCode);

// 4. appsscript.json for web app deployment
const appsscript = {
  timeZone: "GMT",
  exceptionLogging: "STACKDRIVER",
  runtimeVersion: "V8",
  webapp: {
    executeAs: "USER_DEPLOYING",
    access: "ANYONE"
  }
};
fs.writeFileSync(path.join(claspDir, 'appsscript.json'), JSON.stringify(appsscript, null, 2));

// 5. Push files to Google Apps Script
console.log('Pushing files via clasp...');
execSync('npx @google/clasp push -f', { cwd: claspDir, stdio: 'inherit' });

// 6. Run setupSheet to generate tabs/headers
console.log('Running setupSheet function...');
execSync('npx @google/clasp run setupSheet', { cwd: claspDir, stdio: 'inherit' });

// 7. Deploy as Web App
console.log('Deploying as Web App...');
execSync('npx @google/clasp deploy --description "ApexReach Leads Web App"', { cwd: claspDir, stdio: 'inherit' });

// 8. List deployments to retrieve URL
const listOutput = execSync('npx @google/clasp deployments', { cwd: claspDir, encoding: 'utf8' });
console.log('Deployments:\n', listOutput);
const match = listOutput.match(/- ([A-Za-z0-9_-]+) @\d+ - web app URL: (https:\/\/script\.googleusercontent\.com\/macros\/s\/[^\s]+)/);
if (match) {
  const webappUrl = match[2];
  console.log('\nWeb App URL:', webappUrl);
} else {
  console.log('Could not parse web app URL from deployments list.');
}
