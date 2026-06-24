import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository, addLog } from '@/lib/googleSheets';
import { getRuntimeConfig } from '@/lib/localConfig';

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

    // Live Puppeteer Outreach Mode
    await addLog('Jiji Outreach', 'START', `Starting live Jiji Puppeteer outreach campaign for ${targetLeads.length} leads.`);
    
    let browser;
    try {
      const { launchBrowser } = await import('@/lib/playwrightLauncher');
      browser = await launchBrowser();
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1280, height: 800 });

      // Go to Jiji sign in
      await page.goto('https://jiji.ng/login.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));

      // Automated Authentication
      try {
        await page.waitForSelector('input[type="email"], input[name="email"], input[placeholder*="email"]', { timeout: 5000 });
        
        await page.evaluate((email, pass) => {
          const emailInput = document.querySelector('input[type="email"], input[name="email"], input[placeholder*="email"]') as HTMLInputElement;
          const passInput = document.querySelector('input[type="password"], input[name="password"]') as HTMLInputElement;
          if (emailInput && passInput) {
            emailInput.value = email;
            passInput.value = pass;
            
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            passInput.dispatchEvent(new Event('input', { bubbles: true }));
            
            const submitBtn = document.querySelector('button[type="submit"]') || 
                              Array.from(document.querySelectorAll('button')).find(btn => {
                                const t = btn.textContent?.toLowerCase() || '';
                                return t.includes('log in') || t.includes('sign in');
                              });
            if (submitBtn) {
              (submitBtn as HTMLElement).click();
            }
          } else {
            throw new Error('Email or password input fields not found');
          }
        }, config.jijiEmail || '', config.jijiPassword || '');

        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
      } catch (authErr: any) {
        console.error("Jiji Authentication failed:", authErr);
        await addLog('Jiji Outreach', 'WARN', `Live login failed: ${authErr.message}.`);
        throw new Error(`Jiji Authentication Failed: ${authErr.message}`);
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
          await new Promise(r => setTimeout(r, 2000));

          // Click Chat button
          const chatBtnClicked = await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button, a')).find(el => {
              const text = el.textContent?.toLowerCase() || '';
              return text.includes('chat') || text.includes('start chat') || text.includes('message');
            });
            if (btn) {
              (btn as HTMLElement).click();
              return true;
            }
            return false;
          });

          if (chatBtnClicked) {
            await new Promise(r => setTimeout(r, 2000));

            // Enter chat text
            const textEntered = await page.evaluate((msg) => {
              const textarea = document.querySelector('textarea, textarea[placeholder*="message"]') as HTMLTextAreaElement;
              if (textarea) {
                textarea.value = msg;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
              }
              return false;
            }, finalMessage);

            if (!textEntered) {
              throw new Error("Chat message input textarea not found.");
            }

            await new Promise(r => setTimeout(r, 1000));

            // Send message
            const sendBtnClicked = await page.evaluate(() => {
              const btn = document.querySelector('button[type="submit"], svg[class*="send"]') || 
                          Array.from(document.querySelectorAll('button')).find(b => {
                            const t = b.textContent?.toLowerCase() || '';
                            return t.includes('send');
                          });
              if (btn) {
                (btn as HTMLElement).click();
                return true;
              }
              return false;
            });

            if (!sendBtnClicked) {
              throw new Error("Send button not found.");
            }

            await new Promise(r => setTimeout(r, 2000)); // Wait for dispatch

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
        await new Promise(r => setTimeout(r, 3000));
      }

    } catch (browserErr: any) {
      console.error("Live Jiji outreach failed:", browserErr.message);
      await addLog('Jiji Outreach', 'ERROR', `Live outreach failed: ${browserErr.message}`);
      return NextResponse.json({
        success: false,
        error: `Live outreach failed: ${browserErr.message}`
      }, { status: 500 });
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          console.error("Error closing browser:", e);
        }
      }
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
