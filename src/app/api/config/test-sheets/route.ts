import { NextRequest, NextResponse } from 'next/server';
import { getSheetsInstance } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';

const REQUIRED_SHEETS = [
  { name: 'Leads', headers: ['lead_id', 'source', 'name', 'category', 'address', 'area', 'city', 'phone_e164', 'phone_raw', 'email', 'website', 'rating', 'reviews_count', 'verified', 'listings_count', 'profile_url', 'source_query_or_seed', 'collected_at', 'status', 'last_contacted_at', 'duplicate_of_lead_id', 'business_summary', 'notes'] },
  { name: 'DNC', headers: ['phone_e164', 'added_at', 'reason'] },
  { name: 'Logs', headers: ['run_id', 'timestamp', 'step', 'status', 'message'] },
  { name: 'Outreach Log', headers: ['lead_id', 'name', 'channel', 'provider', 'recipient', 'subject', 'message', 'status', 'timestamp'] },
  { name: 'Campaign Stats', headers: ['campaign_name', 'leads_count', 'contacted_count', 'success_rate', 'last_run_at'] }
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { initialize = false } = body;
    
    const config = getRuntimeConfig();
    const spreadsheetId = config.googleSpreadsheetId;

    if (!spreadsheetId) {
      return NextResponse.json({ 
        success: false, 
        status: 'red', 
        error: "Google Spreadsheet ID is not configured in settings." 
      });
    }

    let sheets;
    try {
      sheets = await getSheetsInstance();
    } catch (authErr: any) {
      return NextResponse.json({ 
        success: false, 
        status: 'red', 
        error: `Authentication failed: ${authErr.message}` 
      });
    }

    let spreadsheetMeta;
    try {
      spreadsheetMeta = await sheets.spreadsheets.get({
        spreadsheetId,
      });
    } catch (connectionErr: any) {
      return NextResponse.json({ 
        success: false, 
        status: 'red', 
        error: `Could not connect to Google Spreadsheet: ${connectionErr.message}. Make sure the sheet exists and sharing permissions allow access.` 
      });
    }

    const sheetsInDoc = spreadsheetMeta.data.sheets || [];
    const existingTitles = new Set(sheetsInDoc.map(s => s.properties?.title).filter(Boolean));
    
    const missingSheets = REQUIRED_SHEETS.filter(r => !existingTitles.has(r.name));

    if (missingSheets.length > 0) {
      if (initialize) {
        // Create missing sheets via batchUpdate
        const requests = missingSheets.map(m => ({
          addSheet: {
            properties: {
              title: m.name
            }
          }
        }));

        try {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests
            }
          });

          // Wait a bit and write headers for each new sheet
          for (const m of missingSheets) {
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `${m.name}!A1`,
              valueInputOption: 'RAW',
              requestBody: {
                values: [m.headers]
              }
            });
          }

          return NextResponse.json({
            success: true,
            status: 'green',
            message: `Successfully initialized ${missingSheets.length} sheets: ${missingSheets.map(m => m.name).join(', ')}.`
          });
        } catch (initErr: any) {
          return NextResponse.json({
            success: false,
            status: 'yellow',
            error: `Failed to initialize missing sheets: ${initErr.message}`
          });
        }
      } else {
        return NextResponse.json({
          success: false,
          status: 'yellow',
          error: `Spreadsheet connected, but missing required tabs: ${missingSheets.map(m => m.name).join(', ')}.`,
          missingSheets: missingSheets.map(m => m.name)
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      status: 'green',
      message: "Fully synced: Connected to Spreadsheet and all required sheets are present." 
    });

  } catch (e: any) {
    return NextResponse.json({ success: false, status: 'red', error: e.message }, { status: 500 });
  }
}
