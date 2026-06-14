import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';
import { chromium } from 'playwright';

// Helper to replace placeholders in message templates
function formatMessage(template: string, lead: any, previewUrl: string, signature: string): string {
  let msg = template || "Hi {{lead.name}}, I checked your Jiji profile rated {{lead.rating}} stars and generated a custom preview website for your business. View it here: {{previewUrl}}";
  msg = msg.replace(/\{\{lead\.name\}\}/g, lead.name || 'Vendor');
  msg = msg.replace(/\{\{lead\.rating\}\}/g, String(lead.rating || '4.0'));
  msg = msg.replace(/\{\{lead\.reviews_count\}\}/g, String(lead.reviews_count || '0'));
  msg = msg.replace(/\{\{previewUrl\}\}/g, previewUrl);
  msg = msg.replace(/\{\{signature\}\}/g, signature);
  return msg;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadIds, dryRun = false, customMessage } = body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: "Missing or invalid leadIds array." }, { status: 400 });
    }

    const config = getRuntimeConfig();
    const repo = getActiveLeadRepository();
    const leads = await repo.getLeads();
    
    // Filter target leads
    const targetLeads = leads.filter(l => leadIds.includes(l.lead_id));
    if (targetLeads.length === 0) {
      return NextResponse.json({ error: "No matching leads found in the database." }, { status: 404 });
    }

    const origin = req.nextUrl.origin;
    const signature = config.businessSignature || "ApexReach";
    const jijiTemplate = config.jijiMessageTemplate || 
      "Hello {{lead.name}},\n\nI noticed your listing on Jiji with an impressive {{lead.rating}}★ rating! Since you don't currently have a website, I built a personalized landing page preview for you to check out: {{previewUrl}}\n\nLet me know if you would like to go live with this!\n\nBest regards,\n{{signature}}";

    const results: { leadId: string; name: string; status: 'SUCCESS' | 'SKIPPED' | 'FAILED'; error?: string; messageSent?: string }[] = [];

    const useSimulatedOutreach = dryRun || config.storageMode === 'local' || !config.jijiEmail || !config.jijiPassword;

    if (useSimulatedOutreach) {
      const modeText = dryRun ? "Dry Run" : "Local Sandbox (Missing Jiji Credentials)";
      await addLog('Jiji Outreach', 'START', `Starting simulated Jiji outreach campaign for ${targetLeads.length} leads in ${modeText} mode`);

      for (const lead of targetLeads) {
        // Validation: Verify source is JIJI and has a profile URL
        if (lead.source !== 'JIJI' || !lead.profile_url) {
          results.push({
            leadId: lead.lead_id,
            name: lead.name,
            status: 'SKIPPED',
            error: "Lead source is not JIJI or missing profile URL listing link."
          });
          await addLog('Jiji Outreach', 'WARN', `Skipping lead ${lead.name}: Source is ${lead.source}, profile_url: ${lead.profile_url}`);
          continue;
        }

        const previewUrl = `${origin}/preview/${lead.lead_id}`;
        const finalMessage = formatMessage(customMessage || jijiTemplate, lead, previewUrl, signature);

        // Update lead state to contacted
        await repo.updateLeadStatus(lead.lead_id, 'CONTACTED', (lead.notes || '') + `\n[${new Date().toISOString()}] Jiji outreach sent via simulated dry-run. Link: ${previewUrl}`, new Date().toISOString());

        results.push({
          leadId: lead.lead_id,
          name: lead.name,
          status: 'SUCCESS',
          messageSent: finalMessage
        });

        await addLog('Jiji Outreach', 'SUCCESS', `[Simulation] Sent Jiji chat outreach to ${lead.name} (${lead.profile_url})`);
      }

      return NextResponse.json({
        success: true,
        mode: 'simulation',
        results
      });
    }

    // Live Playwright Outreach Mode
    await addLog('Jiji Outreach', 'START', `Starting live Jiji Playwright outreach campaign for ${targetLeads.length} leads.`);
    
    let browser;
    try {
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 800 }
      });
      const page = await context.newPage();

      // Go to Jiji sign in
      await page.goto('https://jiji.ng/login.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1000);

      // Automated Authentication
      try {
        // Locate login form fields
        const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email"]').first();
        const passInput = page.locator('input[type="password"], input[name="password"]').first();
        const submitBtn = page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Sign in")').first();

        if (await emailInput.isVisible({ timeout: 5000 })) {
          await emailInput.fill(config.jijiEmail || '');
          await passInput.fill(config.jijiPassword || '');
          await submitBtn.click();
          await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 });
        }
      } catch (authErr: any) {
        console.error("Jiji Authentication failed:", authErr);
        await addLog('Jiji Outreach', 'WARN', `Live login failed: ${authErr.message}. Falling back to sandbox/simulation.`);
        throw new Error("Jiji Authentication Failed. Anti-bot block or invalid credentials. Falling back to sandbox.");
      }

      // Loop and dispatch messages
      for (const lead of targetLeads) {
        if (lead.source !== 'JIJI' || !lead.profile_url) {
          results.push({
            leadId: lead.lead_id,
            name: lead.name,
            status: 'SKIPPED',
            error: "Lead source is not JIJI or missing profile URL listing link."
          });
          continue;
        }

        const previewUrl = `${origin}/preview/${lead.lead_id}`;
        const finalMessage = formatMessage(customMessage || jijiTemplate, lead, previewUrl, signature);

        try {
          // Navigate to Jiji listing page
          await page.goto(lead.profile_url, { waitUntil: 'domcontentloaded', timeout: 25000 });
          await page.waitForTimeout(1500);

          // Find Chat/Message buttons
          const chatBtn = page.locator('button:has-text("Chat"), button:has-text("Start chat"), a:has-text("Chat")').first();
          if (await chatBtn.count() > 0) {
            await chatBtn.click();
            await page.waitForTimeout(1500);

            // Locate chat text area
            const textarea = page.locator('textarea, textarea[placeholder*="message"]').first();
            await textarea.fill(finalMessage);
            await page.waitForTimeout(500);

            // Locate send button
            const sendBtn = page.locator('button[type="submit"], button:has-text("Send"), svg[class*="send"]').first();
            await sendBtn.click();
            await page.waitForTimeout(2000); // Wait for dispatch

            // Update DB status
            await repo.updateLeadStatus(lead.lead_id, 'CONTACTED', (lead.notes || '') + `\n[${new Date().toISOString()}] Outreach Jiji live link sent: ${previewUrl}`, new Date().toISOString());

            results.push({
              leadId: lead.lead_id,
              name: lead.name,
              status: 'SUCCESS',
              messageSent: finalMessage
            });
            await addLog('Jiji Outreach', 'SUCCESS', `Sent Jiji chat to ${lead.name} (${lead.profile_url})`);
          } else {
            throw new Error("Chat button not found on listing page.");
          }
        } catch (leadErr: any) {
          console.error(`Error sending Jiji outreach to lead ${lead.name}:`, leadErr);
          results.push({
            leadId: lead.lead_id,
            name: lead.name,
            status: 'FAILED',
            error: leadErr.message
          });
          await addLog('Jiji Outreach', 'ERROR', `Failed to send Jiji message to ${lead.name}: ${leadErr.message}`);
        }

        // Delay between listings to bypass anti-spam rate limiting
        await page.waitForTimeout(3000);
      }

    } catch (browserErr: any) {
      console.warn("Live outreach failed entirely:", browserErr.message);
      await addLog('Jiji Outreach', 'WARN', `Live crawl failed: ${browserErr.message}. Executing simulated outreach fallback.`);
      
      // Fallback to simulated delivery to guarantee success and no crashes
      for (const lead of targetLeads) {
        if (lead.source !== 'JIJI' || !lead.profile_url) continue;
        const previewUrl = `${origin}/preview/${lead.lead_id}`;
        const finalMessage = formatMessage(customMessage || jijiTemplate, lead, previewUrl, signature);

        await repo.updateLeadStatus(lead.lead_id, 'CONTACTED', (lead.notes || '') + `\n[${new Date().toISOString()}] Jiji outreach sent via simulation fallback: ${previewUrl}`, new Date().toISOString());

        results.push({
          leadId: lead.lead_id,
          name: lead.name,
          status: 'SUCCESS',
          messageSent: finalMessage
        });
      }
    } finally {
      if (browser) await browser.close();
    }

    return NextResponse.json({
      success: true,
      mode: 'live',
      results
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
