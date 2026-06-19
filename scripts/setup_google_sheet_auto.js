const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Load credentials from clasp
const claspRcPath = path.join(process.env.USERPROFILE || process.env.HOME || '', '.clasprc.json');
if (!fs.existsSync(claspRcPath)) {
  console.error("Clasp credentials not found. Please run 'clasp login' first.");
  process.exit(1);
}

const claspRc = JSON.parse(fs.readFileSync(claspRcPath, 'utf8'));
const defaultToken = claspRc.tokens.default;

const oauth2Client = new google.auth.OAuth2(
  defaultToken.client_id,
  defaultToken.client_secret
);
oauth2Client.setCredentials({
  refresh_token: defaultToken.refresh_token,
  access_token: defaultToken.access_token
});

const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
const drive = google.drive({ version: 'v3', auth: oauth2Client });

async function main() {
  try {
    console.log("Creating Google Sheet...");
    // Create new spreadsheet
    const spreadsheetResponse = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: "ApexReach Leads"
        }
      }
    });
    const spreadsheetId = spreadsheetResponse.data.spreadsheetId;
    const spreadsheetUrl = spreadsheetResponse.data.spreadsheetUrl;
    console.log(`Spreadsheet created successfully: ${spreadsheetUrl}`);
    
    // Now, setup the sheets: Leads, Config, DNC, Logs
    // By default, a spreadsheet has 'Sheet1'. Let's rename it to 'Leads'.
    const sheet1Id = spreadsheetResponse.data.sheets[0].properties.sheetId;
    
    console.log("Creating worksheets and formatting columns...");
    // Let's add the other sheets
    const requests = [
      // Rename Sheet1 to Leads
      {
        updateSheetProperties: {
          properties: {
            sheetId: sheet1Id,
            title: "Leads"
          },
          fields: "title"
        }
      },
      // Add Config sheet
      {
        addSheet: {
          properties: {
            title: "Config"
          }
        }
      },
      // Add DNC sheet
      {
        addSheet: {
          properties: {
            title: "DNC"
          }
        }
      },
      // Add Logs sheet
      {
        addSheet: {
          properties: {
            title: "Logs"
          }
        }
      }
    ];
    
    const batchUpdateResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests }
    });
    
    const sheetIds = {};
    batchUpdateResponse.data.replies.forEach(reply => {
      if (reply.addSheet) {
        const prop = reply.addSheet.properties;
        sheetIds[prop.title] = prop.sheetId;
      }
    });
    sheetIds['Leads'] = sheet1Id;
    
    // Write headers and default config values
    const leadsHeaders = [
      'lead_id', 'source', 'name', 'category', 'address', 'area', 'city', 
      'phone_e164', 'phone_raw', 'email', 'website', 'rating', 'reviews_count', 
      'verified', 'listings_count', 'profile_url', 'source_query_or_seed', 
      'collected_at', 'status', 'last_contacted_at', 'duplicate_of_lead_id', 
      'business_summary', 'notes'
    ];
    
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
    
    const dncHeaders = ['phone_e164', 'email', 'domain', 'reason', 'added_at'];
    const logsHeaders = ['run_id', 'ts', 'step', 'url_or_id', 'result', 'error'];
    
    // Write data to Sheets
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      resource: {
        valueInputOption: "RAW",
        data: [
          { range: "Leads!A1", values: [leadsHeaders] },
          { range: "Config!A1", values: configData },
          { range: "DNC!A1", values: [dncHeaders] },
          { range: "Logs!A1", values: [logsHeaders] }
        ]
      }
    });
    console.log("Google Sheets columns and config initialized.");
    
    // 2. Setup clasp container-bound script
    console.log("Setting up Apps Script in a bound environment...");
    const scriptDir = path.join(__dirname, '..', 'apps_script_src');
    if (!fs.existsSync(scriptDir)) {
      fs.mkdirSync(scriptDir);
    }
    
    // Write Code.js
    const codeContent = fs.readFileSync(path.join(__dirname, '..', 'Code.gs'), 'utf8');
    fs.writeFileSync(path.join(scriptDir, 'Code.js'), codeContent);
    
    // Write appsscript.json
    const appsscriptJson = {
      "timeZone": "GMT",
      "exceptionLogging": "STACKDRIVER",
      "runtimeVersion": "V8",
      "webapp": {
        "executeAs": "USER_DEPLOYING",
        "access": "ANYONE"
      }
    };
    fs.writeFileSync(path.join(scriptDir, 'appsscript.json'), JSON.stringify(appsscriptJson, null, 2));
    
    // Delete existing .clasp.json if it exists to start fresh
    const claspJsonPath = path.join(scriptDir, '.clasp.json');
    if (fs.existsSync(claspJsonPath)) {
      fs.unlinkSync(claspJsonPath);
    }

    // Create clasp project
    console.log("Running clasp create...");
    execSync(`npx @google/clasp create --title "ApexReach Leads Script" --parentId "${spreadsheetId}"`, {
      cwd: scriptDir,
      stdio: 'inherit'
    });
    
    // Push the code
    console.log("Pushing code to Google Apps Script...");
    execSync(`npx @google/clasp push -f`, {
      cwd: scriptDir,
      stdio: 'inherit'
    });
    
    // Deploy webapp
    console.log("Deploying Web App...");
    // Let's first create a deployment
    const deployOutput = execSync(`npx @google/clasp deploy --description "ApexReach Leads Web App Deployment"`, {
      cwd: scriptDir,
      encoding: 'utf8'
    });
    console.log(deployOutput);
    
    // Find deployment URL from clasp deployments
    const listOutput = execSync(`npx @google/clasp deployments`, {
      cwd: scriptDir,
      encoding: 'utf8'
    });
    console.log("Deployments:\n", listOutput);
    
    // Extract Web App URL
    // Format: - <deploymentId> @<version> - web app URL: <url>
    const match = listOutput.match(/- ([A-Za-z0-9_-]+) @\d+ - web app URL: (https:\/\/script\.google\.com\/macros\/s\/[^\s]+)/);
    if (match) {
      const deploymentId = match[1];
      const webappUrl = match[2];
      console.log("\n==================================================");
      console.log("SUCCESSFULLY SETUP AUTOMATICALLY!");
      console.log(`Spreadsheet URL: ${spreadsheetUrl}`);
      console.log(`Web App URL: ${webappUrl}`);
      console.log("==================================================\n");
    } else {
      console.log("Could not find web app URL in deployments list output.");
    }
  } catch (error) {
    console.error("An error occurred during automatic setup:", error.message || error);
    if (error.stdout) console.error("Stdout:", error.stdout.toString());
    if (error.stderr) console.error("Stderr:", error.stderr.toString());
  }
}

main();
