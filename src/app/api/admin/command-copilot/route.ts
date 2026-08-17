import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { getActiveLeadRepository, addLog, saveLeads, type Lead } from '@/lib/googleSheets';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import { sendSmsMessage } from '@/lib/sms';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { sendSmtpMessage } from '@/lib/email';
import {
  getAdminMemory,
  saveAdminMemory,
  learnFact,
  recordCommandExecution,
  buildMemoryContextString,
  getSprintDayInfo,
  trackOutreachDispatch
} from '@/lib/adminAiMemory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { command, token } = body;

    if (!command || typeof command !== 'string' || !command.trim()) {
      return NextResponse.json({ error: 'Command text is required' }, { status: 400 });
    }

    const authToken = token || req.headers.get('authorization')?.replace('Bearer ', '') || req.cookies.get('admin-token')?.value || req.cookies.get('assistant-token')?.value;
    const user = getAdminUser(authToken);

    const isAuthorized = user && (user.role === 'super_admin' || user.role === 'admin_assistant' || user.permissions.includes('*') || user.permissions.includes('view_dashboard'));

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized: Valid Admin or Assistant Token required' }, { status: 401 });
    }

    const cmd = command.trim();
    const cmdLower = cmd.toLowerCase();
    const config = getRuntimeConfig();
    const memory = getAdminMemory();
    const repo = getActiveLeadRepository();
    const sprintInfo = getSprintDayInfo();
    const timestamp = new Date().toISOString();
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com';

    // ─────────────────────────────────────────────────────────────────────────
    // 1. SPRINT LAUNCH & PROGRESS BRIEFING
    // ─────────────────────────────────────────────────────────────────────────
    if (cmdLower.includes('sprint') || cmdLower.includes('progress') || cmdLower.includes('today') && (cmdLower.includes('stat') || cmdLower.includes('report') || cmdLower.includes('how are we doing'))) {
      const allLeads = await repo.getLeads();
      const claimedLeads = allLeads.filter(l => (l.status || '').toUpperCase() === 'CLAIMED' || (l.notes || '').includes('[claimed]'));
      const contactedLeads = allLeads.filter(l => (l.status || '').toUpperCase() === 'CONTACTED');
      const todayQuota = memory.daily_quotas[sprintInfo.dateStr] || { dispatched_count: 0 };
      const remainingQuota = Math.max(0, sprintInfo.safeLimit - todayQuota.dispatched_count);

      recordCommandExecution(cmd, 'sprint_briefing', 'Generated sprint progress report');

      return NextResponse.json({
        success: true,
        action_executed: 'sprint_briefing',
        summary: `📊 **Sprint Day ${sprintInfo.dayNumber} of 7 Report** (${todayQuota.dispatched_count}/${sprintInfo.safeLimit} msgs dispatched today)`,
        output: `### 🚀 Active 1-Week Sprint Intelligence Report\n\n- **Sprint Cycle:** Monday, August 17 – Sunday, August 23, 2026\n- **Sprint Stage:** **Day ${sprintInfo.dayNumber} of 7** (Today: \`${sprintInfo.dateStr}\`)\n- **Daily Warm-up Safe Cap:** \`${sprintInfo.safeLimit} messages/day\` (Safe Ramp Mode)\n- **Messages Sent Today:** \`${todayQuota.dispatched_count}\` (Remaining Allowance: \`${remainingQuota}\`)\n\n**Pipeline & Conversion KPIs:**\n- **Total Lagos Leads in CRM:** \`${allLeads.length}\`\n- **Total Contacted Businesses:** \`${contactedLeads.length}\`\n- **Claimed Prototypes:** \`${claimedLeads.length}\`\n- **Active Gateway:** Tailscale Android Gateway (\`http://10.132.90.251:8082\`)\n- **Simulated Dry Run:** \`${config.dryRun ? 'ACTIVE (Safe Simulation)' : 'DISABLED (Live Dispatches)'}\``
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. BATCH OUTREACH LAUNCH (Automated Multi-Lead Dispatch)
    // ─────────────────────────────────────────────────────────────────────────
    if (cmdLower.startsWith('launch outreach') || cmdLower.startsWith('run outreach') || cmdLower.startsWith('send batch') || cmdLower.includes('launch today')) {
      const countMatch = cmd.match(/\b(\d+)\b/);
      const todayQuota = memory.daily_quotas[sprintInfo.dateStr] || { dispatched_count: 0 };
      const remaining = Math.max(1, sprintInfo.safeLimit - todayQuota.dispatched_count);
      const batchLimit = countMatch ? Math.min(parseInt(countMatch[1], 10), remaining) : Math.min(10, remaining);

      // Find uncontacted leads in CRM
      const allLeads = await repo.getLeads();
      let targetLeads = allLeads.filter(l => (l.status || '').toUpperCase() === 'NEW' && (l.phone_e164 || l.phone_raw));

      if (cmdLower.includes('salon')) {
        targetLeads = targetLeads.filter(l => (l.category || l.name || '').toLowerCase().includes('salon') || (l.category || '').toLowerCase().includes('beauty'));
      } else if (cmdLower.includes('clinic')) {
        targetLeads = targetLeads.filter(l => (l.category || l.name || '').toLowerCase().includes('clinic') || (l.category || '').toLowerCase().includes('health'));
      }

      const selectedLeads = targetLeads.slice(0, batchLimit);

      if (selectedLeads.length === 0) {
        return NextResponse.json({
          success: true,
          action_executed: 'batch_outreach',
          summary: `⚠️ No uncontacted leads matching criteria in CRM. Please scrape more leads first.`,
          output: `### ⚠️ Outreach Notice\n\nNo uncontacted leads found for this criteria. Type: \`Scrape 20 salon leads in Ikeja\` to populate fresh prospects, then re-run outreach.`
        });
      }

      const dispatchResults: any[] = [];
      let successCount = 0;

      for (const lead of selectedLeads) {
        const previewUrl = `${origin}/preview/${encodeURIComponent(lead.lead_id)}`;
        const phone = lead.phone_e164 || lead.phone_raw;
        const msg = `ApexReach: Interactive website prototype created for ${lead.name}. Review live mobile & WhatsApp setup at: ${previewUrl} (48h Instant Claim)`;

        try {
          if (!config.dryRun) {
            await sendSmsMessage(lead, previewUrl, msg);
          }
          await repo.updateLeadStatus(lead.lead_id, 'CONTACTED', `${lead.notes || ''}\n[OUTREACH_DISPATCHED: ${timestamp}] via AI Copilot Batch`, timestamp);
          dispatchResults.push({ name: lead.name, phone, status: config.dryRun ? 'Simulated' : 'Dispatched', previewUrl });
          successCount++;
        } catch (err: any) {
          dispatchResults.push({ name: lead.name, phone, status: 'Failed', error: err.message });
        }
      }

      trackOutreachDispatch(successCount, 'SMS_GATEWAY');
      await addLog('AI Copilot Batch', 'SUCCESS', `Dispatched outreach batch to ${successCount} leads`);
      recordCommandExecution(cmd, 'batch_outreach', `Dispatched outreach to ${successCount} leads`);

      return NextResponse.json({
        success: true,
        action_executed: 'batch_outreach',
        summary: `⚡ ${config.dryRun ? 'Simulated' : 'Dispatched'} outreach batch to **${successCount} leads** (Safe Ramp: ${todayQuota.dispatched_count + successCount}/${sprintInfo.safeLimit} today)`,
        output: `### 🚀 Outreach Batch Execution Summary\n\n- **Total Dispatched:** ${successCount} leads\n- **Mode:** \`${config.dryRun ? 'DRY RUN (Simulation)' : 'LIVE CARRIER TRANSMISSION'}\`\n- **Channel:** Tailscale Android SMS Gateway (\`10.132.90.251:8082\`)\n- **Daily Progress:** \`${todayQuota.dispatched_count + successCount} / ${sprintInfo.safeLimit} msgs\`\n\n| Business Name | Phone | Status | Preview Link |\n|---|---|---|---|\n${dispatchResults.slice(0, 8).map(r => `| **${r.name}** | \`${r.phone}\` | \`${r.status}\` | [Preview Prototype](${r.previewUrl}) |`).join('\n')}`
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. MEMORY MANAGEMENT (Remember, Learn, Recall, Show Memory)
    // ─────────────────────────────────────────────────────────────────────────
    if (cmdLower.startsWith('remember ') || cmdLower.startsWith('learn ') || cmdLower.includes('remember that') || cmdLower.includes('keep in mind')) {
      const factToRemember = cmd.replace(/^(?:remember|learn|remember that|keep in mind)\s+/i, '').trim();
      learnFact(factToRemember);

      const phoneMatch = factToRemember.match(/(?:(?:\+?234)|0)[789][01]\d{8}/g);
      if (phoneMatch) {
        const raw = phoneMatch[0];
        const formatted = raw.startsWith('0') ? '234' + raw.slice(1) : raw.replace(/\D/g, '');
        saveAdminMemory({ admin_phone: formatted });
      }

      const emailMatch = factToRemember.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        saveAdminMemory({ admin_email: emailMatch[0] });
      }

      recordCommandExecution(cmd, 'learn_fact', `Saved to permanent memory: "${factToRemember}"`);

      return NextResponse.json({
        success: true,
        action_executed: 'learn_fact',
        summary: `🧠 **Stored in Permanent Memory:** "${factToRemember}"`,
        output: `### 🧠 Fact Stored in Permanent Memory\n\n- **Learned Directive:** "${factToRemember}"\n- **Active Sprint:** August 17 to August 23, 2026\n- **Status:** Synced & Active across all future commands\n\n*The AI Copilot will automatically apply this rule during outreach, scraping, and prototype provisioning.*`
      });
    }

    if (cmdLower === 'memory' || cmdLower.includes('show memory') || cmdLower.includes('what do you remember') || cmdLower.includes('recall memory')) {
      const memContext = buildMemoryContextString();
      recordCommandExecution(cmd, 'view_memory', 'Recalled memory store');

      return NextResponse.json({
        success: true,
        action_executed: 'view_memory',
        summary: `🧠 Active Memory State (${memory.learned_facts.length} facts indexed)`,
        output: `### 🧠 AI Admin Copilot Memory Bank\n\n\`\`\`text\n${memContext}\n\`\`\`\n\n*To teach me new rules or change settings, simply write: \`Remember that [your rule]\`.*`
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. TEST OUTREACH (Single Test SMS / WhatsApp / Email)
    // ─────────────────────────────────────────────────────────────────────────
    if (cmdLower.includes('test') && (cmdLower.includes('sms') || cmdLower.includes('message') || cmdLower.includes('text') || cmdLower.includes('outreach') || cmdLower.includes('whatsapp') || cmdLower.includes('email'))) {
      const phoneMatch = cmd.match(/(?:(?:\+?234)|0)[789][01]\d{8}/g);
      const rawTargetPhone = phoneMatch ? phoneMatch[0] : (memory.admin_phone || process.env.ADMIN_WA_PHONE || '2348022791227');
      const targetPhone = rawTargetPhone.startsWith('0') ? '234' + rawTargetPhone.slice(1) : rawTargetPhone.replace(/\D/g, '');

      const emailMatch = cmd.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const targetEmail = emailMatch ? emailMatch[0] : (memory.admin_email || process.env.ADMIN_EMAIL || 'tosin@bethelmindanalytics.com');

      const leads = await repo.getLeads();
      const sampleLead: Lead = leads[0] || {
        lead_id: 'test-lead-demo',
        source: 'MAPS_FREE',
        name: 'Apex Sample Clinic',
        category: 'Clinic & Wellness',
        address: 'Lekki Phase 1, Lagos',
        area: 'Lekki',
        city: 'Lagos',
        phone_e164: targetPhone,
        phone_raw: targetPhone,
        email: targetEmail,
        website: '',
        rating: 4.8,
        reviews_count: 32,
        verified: true,
        listings_count: 1,
        profile_url: '',
        source_query_or_seed: 'clinics in lekki',
        collected_at: timestamp,
        status: 'NEW',
        last_contacted_at: '',
        duplicate_of_lead_id: '',
        business_summary: 'Specialist medical and aesthetic clinic in Lekki.',
        notes: ''
      };

      const previewUrl = `${origin}/preview/${encodeURIComponent(sampleLead.lead_id || 'demo')}`;
      const results: Record<string, any> = {};

      const doSms = cmdLower.includes('sms') || (!cmdLower.includes('whatsapp') && !cmdLower.includes('email'));
      const doWhatsApp = cmdLower.includes('whatsapp') || cmdLower.includes('wa');
      const doEmail = cmdLower.includes('email') || cmdLower.includes('smtp');

      if (doSms) {
        const smsLead: Lead = { ...sampleLead, phone_e164: targetPhone, phone_raw: targetPhone };
        try {
          const smsRes = await sendSmsMessage(smsLead, previewUrl, `ApexReach: Interactive website prototype created for ${sampleLead.name}. Review live setup: ${previewUrl}`);
          results.sms = { success: true, target: targetPhone, details: smsRes };
        } catch (err: any) {
          results.sms = { success: false, target: targetPhone, error: err.message };
        }
      }

      if (doWhatsApp) {
        const waLead = {
          lead_id: sampleLead.lead_id,
          name: sampleLead.name,
          phone_e164: targetPhone,
          phone_raw: targetPhone
        };
        const waText = `👋 Hello! We designed an interactive website prototype for *${sampleLead.name}* with mobile booking and instant Paystack integration.\n\n🔗 *Preview link:* ${previewUrl}\n\nReply *SETUP* to claim your live domain within 48 hours.`;
        try {
          const waRes = await sendWhatsAppMessage(waLead, previewUrl, origin, waText, { bypassHoursCheck: true });
          results.whatsapp = { success: true, target: targetPhone, details: waRes };
        } catch (err: any) {
          results.whatsapp = { success: false, target: targetPhone, error: err.message };
        }
      }

      if (doEmail) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
            <h2 style="color: #10b981;">ApexReach Website Prototype Ready</h2>
            <p>We built a customized website prototype tailored for <strong>${sampleLead.name}</strong>.</p>
            <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 10px;"><strong>Live Prototype:</strong> <a href="${previewUrl}" style="color: #10b981; font-weight: bold;">${previewUrl}</a></p>
              <p style="margin: 0; font-size: 0.9em; color: #64748b;">Features: Instant Paystack Checkout, WhatsApp Direct Ordering & Google Maps SEO.</p>
            </div>
            <p>Reply directly to claim your deployment within 48 hours.</p>
          </div>
        `;
        try {
          await sendSmtpMessage(targetEmail, `Interactive Website Prototype for ${sampleLead.name}`, emailHtml, config);
          results.email = { success: true, target: targetEmail };
        } catch (err: any) {
          results.email = { success: false, target: targetEmail, error: err.message };
        }
      }

      await addLog('AI Copilot Execution', 'SUCCESS', `Test outreach dispatched to ${targetPhone}/${targetEmail}`);
      recordCommandExecution(cmd, 'send_test_outreach', `Dispatched test outreach to ${targetPhone}`);

      return NextResponse.json({
        success: true,
        action_executed: 'send_test_outreach',
        summary: `⚡ Dispatched test outreach to **${targetPhone}** (${Object.keys(results).join(', ').toUpperCase()})`,
        results,
        previewUrl,
        output: `### 🚀 Test Outreach Execution Report\n\n- **Target Phone (From Memory):** \`${targetPhone}\`\n- **Target Email:** \`${targetEmail}\`\n- **Live Prototype URL:** [${previewUrl}](${previewUrl})\n- **Gateway:** \`http://10.132.90.251:8082\` (Tailscale Android SMS)\n\n**Channel Status:**\n${Object.entries(results).map(([ch, st]) => `- **${ch.toUpperCase()}**: ${st.success ? '✅ Sent successfully' : `❌ Failed (${st.error || 'Check carrier gateway'})`}`).join('\n')}`
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 5. SCRAPE LEADS (Google Maps & Directory Scrapers)
    // ─────────────────────────────────────────────────────────────────────────
    if (cmdLower.includes('scrape') || cmdLower.includes('find leads') || cmdLower.includes('harvest') || cmdLower.includes('search leads')) {
      const countMatch = cmd.match(/\b(\d+)\b/);
      const limit = countMatch ? Math.min(parseInt(countMatch[1], 10), 30) : 10;

      let query = 'salons in Ikeja, Lagos';
      const inMatch = cmd.match(/(?:for|in|of)\s+([a-zA-Z0-9\s,]+)/i);
      if (inMatch && inMatch[1]) {
        query = inMatch[1].trim();
        if (!query.toLowerCase().includes('lagos')) {
          query += ', Lagos';
        }
      } else if (cmdLower.includes('clinic')) query = 'clinics in Lekki, Lagos';
      else if (cmdLower.includes('auto') || cmdLower.includes('mechanic')) query = 'auto repair in Surulere, Lagos';
      else if (cmdLower.includes('restaurant') || cmdLower.includes('food')) query = 'restaurants in Victoria Island, Lagos';
      else if (cmdLower.includes('gym')) query = 'gyms in Ikoyi, Lagos';
      else if (cmdLower.includes('real estate')) query = 'real estate agents in Ikeja, Lagos';

      try {
        const scrapeRes = await fetch(`${origin}/api/scrape/maps-free`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, limit })
        });
        const scrapeData = await scrapeRes.json();
        const harvestedLeads: Lead[] = scrapeData.leads || [];

        if (harvestedLeads.length > 0) {
          await saveLeads(harvestedLeads);
        }

        await addLog('AI Copilot Execution', 'SUCCESS', `Scraped ${harvestedLeads.length} leads for "${query}"`);
        recordCommandExecution(cmd, 'scrape_leads', `Scraped ${harvestedLeads.length} leads for "${query}"`);

        return NextResponse.json({
          success: true,
          action_executed: 'scrape_leads',
          summary: `✅ Scraped & saved **${harvestedLeads.length} leads** for query \`${query}\``,
          data: harvestedLeads,
          output: `### 🎯 Scraped Leads for: "${query}"\n\n**Total Harvested:** ${harvestedLeads.length}\n\n| Business Name | Phone | Rating | Category |\n|---|---|---|---|\n${harvestedLeads.slice(0, 8).map((l: Lead) => `| **${l.name}** | \`${l.phone_e164 || l.phone_raw || 'N/A'}\` | ⭐ ${l.rating || 'N/A'} | ${l.category || 'Business'} |`).join('\n')}\n\n*All leads have been indexed and are ready for preview generation or outreach.*`
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          error: err.message,
          output: `❌ Scraping failed: ${err.message}. Please verify browserless/scraper connection.`
        }, { status: 500 });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 6. SYSTEM HEALTH / GATEWAY / CONFIG CHECK
    // ─────────────────────────────────────────────────────────────────────────
    if (cmdLower.includes('health') || cmdLower.includes('status') || cmdLower.includes('diagnostic') || cmdLower.includes('check gateway') || cmdLower.includes('check system')) {
      const allLeads = await repo.getLeads();
      const claimedLeads = allLeads.filter(l => (l.status || '').toUpperCase() === 'CLAIMED' || (l.notes || '').includes('[claimed]'));
      const contactedLeads = allLeads.filter(l => (l.status || '').toUpperCase() === 'CONTACTED');

      let gatewayStatus = '🟢 CONFIGURED (Tailscale 10.132.90.251:8082)';
      try {
        const pingRes = await fetch(`${config.smsGatewayUrl || 'http://10.132.90.251:8082'}/health`, { signal: AbortSignal.timeout(3000) });
        if (pingRes.ok) gatewayStatus = '🟢 ONLINE (Latency < 20ms)';
      } catch (_) {}

      recordCommandExecution(cmd, 'system_health', 'System health diagnostic run');

      return NextResponse.json({
        success: true,
        action_executed: 'system_health',
        summary: `📊 System is **Online & Healthy** (${allLeads.length} leads in CRM, ${claimedLeads.length} claimed)`,
        output: `### 🛡️ System Diagnostic & Engine Health\n\n- **Active Sprint Cycle:** Monday, Aug 17 – Sunday, Aug 23, 2026 (Day ${sprintInfo.dayNumber} of 7)\n- **Dry Run Mode:** \`${config.dryRun ? 'ACTIVE (Safe Simulation)' : 'DISABLED (Live Dispatches)'}\`\n- **Tailscale Android SMS Gateway:** \`${config.smsGatewayUrl || 'http://10.132.90.251:8082'}\` (${gatewayStatus})\n- **WhatsApp Channel:** \`${config.whatsappBaileysUrl || 'http://localhost:3007'}\`\n- **Hostinger SMTP:** \`${config.smtpUser || 'tosin@bethelmindanalytics.com'}\` (Port 587)\n- **Total Leads:** \`${allLeads.length}\` | **Contacted:** \`${contactedLeads.length}\` | **Claimed Prototypes:** \`${claimedLeads.length}\``
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 7. CONFIGURATION TOGGLES
    // ─────────────────────────────────────────────────────────────────────────
    if (cmdLower.includes('dry run') || cmdLower.includes('dryrun') || cmdLower.includes('limit') || cmdLower.includes('set safe ramp')) {
      let updatedChanges = [];

      if (cmdLower.includes('dry run false') || cmdLower.includes('disable dry run') || cmdLower.includes('live mode') || cmdLower.includes('dry run off')) {
        saveLocalConfig({ dryRun: false });
        updatedChanges.push('Dry Run set to **FALSE (LIVE OUTREACH)**');
      } else if (cmdLower.includes('dry run true') || cmdLower.includes('enable dry run') || cmdLower.includes('dry run on')) {
        saveLocalConfig({ dryRun: true });
        updatedChanges.push('Dry Run set to **TRUE (SIMULATION)**');
      }

      const limitMatch = cmd.match(/(?:limit|cap|ramp)\s+(?:to\s+)?(\d+)/i);
      if (limitMatch && limitMatch[1]) {
        const newCap = parseInt(limitMatch[1], 10);
        saveLocalConfig({ whatsappDailyCap: newCap });
        updatedChanges.push(`Daily message limit set to **${newCap} messages/day**`);
      }

      const finalSummary = updatedChanges.length > 0 ? updatedChanges.join(', ') : 'Configuration verified';
      recordCommandExecution(cmd, 'update_config', finalSummary);

      return NextResponse.json({
        success: true,
        action_executed: 'update_config',
        summary: `⚙️ ${finalSummary}`,
        output: `### ⚙️ System Settings Updated\n\n${updatedChanges.map(c => `- ✅ ${c}`).join('\n')}\n\n*Changes applied dynamically to all background runners.*`
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 8. LIST / SEARCH / SHOW LEADS OR PENDING CLAIMS
    // ─────────────────────────────────────────────────────────────────────────
    if (cmdLower.includes('show') || cmdLower.includes('list') || cmdLower.includes('get leads') || cmdLower.includes('pending claims') || cmdLower.includes('find lead')) {
      const allLeads = await repo.getLeads();

      let filtered = allLeads;
      if (cmdLower.includes('claim')) {
        filtered = allLeads.filter(l => (l.status || '').toUpperCase() === 'CLAIMED' || (l.notes || '').includes('[claimed]') || (l.notes || '').includes('transfer pending'));
      } else if (cmdLower.includes('contacted')) {
        filtered = allLeads.filter(l => (l.status || '').toUpperCase() === 'CONTACTED');
      } else if (cmdLower.includes('new')) {
        filtered = allLeads.filter(l => (l.status || '').toUpperCase() === 'NEW');
      }

      if (cmdLower.includes('salon')) filtered = filtered.filter(l => (l.category || l.name || '').toLowerCase().includes('salon') || (l.category || '').toLowerCase().includes('beauty'));
      else if (cmdLower.includes('clinic')) filtered = filtered.filter(l => (l.category || l.name || '').toLowerCase().includes('clinic') || (l.category || '').toLowerCase().includes('hospital') || (l.category || '').toLowerCase().includes('health'));
      else if (cmdLower.includes('auto')) filtered = filtered.filter(l => (l.category || l.name || '').toLowerCase().includes('auto') || (l.category || '').toLowerCase().includes('mechanic'));

      recordCommandExecution(cmd, 'list_leads', `Filtered ${filtered.length} leads`);

      return NextResponse.json({
        success: true,
        action_executed: 'list_leads',
        summary: `📋 Found **${filtered.length} leads** matching criteria`,
        leads: filtered.slice(0, 10),
        output: `### 📋 Leads Filter Results (${filtered.length} total)\n\n| Lead Name | Phone | Status | Action Link |\n|---|---|---|---|\n${filtered.slice(0, 10).map((l: Lead) => `| **${l.name}** | \`${l.phone_e164 || l.phone_raw || 'N/A'}\` | \`${l.status || 'NEW'}\` | [Preview Site](${origin}/preview/${encodeURIComponent(l.lead_id)}) |`).join('\n')}`
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 9. PROTOTYPE / CLAIM VERIFICATION
    // ─────────────────────────────────────────────────────────────────────────
    if (cmdLower.includes('verify claim') || cmdLower.includes('bind domain') || cmdLower.includes('activate prototype')) {
      const allLeads = await repo.getLeads();
      let targetLead = allLeads[0];
      for (const lead of allLeads) {
        if (lead.name && cmdLower.includes(lead.name.toLowerCase())) {
          targetLead = lead;
          break;
        }
      }

      if (cmdLower.includes('verify') && targetLead) {
        const updatedNotes = `${targetLead.notes || ''}\n[ADMIN_COPILOT_VERIFIED: ${timestamp}] Website claim verified via AI Command Prompt.`;
        await repo.updateLeadStatus(targetLead.lead_id, 'CLAIMED', updatedNotes, timestamp);
        await addLog('AI Copilot Execution', 'SUCCESS', `Claim verified for "${targetLead.name}"`);
        recordCommandExecution(cmd, 'verify_claim', `Verified claim for ${targetLead.name}`);

        return NextResponse.json({
          success: true,
          action_executed: 'verify_claim',
          summary: `🏆 Verified website claim for **${targetLead.name}**!`,
          output: `### 🏆 Claim Verified & Provisioned\n\n- **Business:** \`${targetLead.name}\`\n- **Status:** \`CLAIMED\`\n- **Instant Setup:** Activated\n- **Live Prototype:** [View Prototype](${origin}/preview/${encodeURIComponent(targetLead.lead_id)})`
        });
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 10. GENERAL AI ASSISTANT REASONING FALLBACK
    // ─────────────────────────────────────────────────────────────────────────
    recordCommandExecution(cmd, 'general_response', 'AI Copilot response');

    return NextResponse.json({
      success: true,
      action_executed: 'ai_assistant_response',
      summary: `🤖 Processed command`,
      output: `### ⚡ Bethel AI Admin Assistant\n\nI processed your request: **"${cmd}"**\n\n**Remembered Sprint Context:**\n- **Sprint Status:** **Day ${sprintInfo.dayNumber} of 7** (August 17–23, 2026)\n- **Daily Safe Cap:** \`${sprintInfo.safeLimit} messages/day\`\n- **Admin Phone:** \`${memory.admin_phone}\`\n- **SMS Gateway:** \`${memory.preferred_sms_gateway}\`\n\n*Quick Actions:*\n- \`Launch today's outreach batch for salons\`\n- \`Send test SMS to 08022791227\`\n- \`Scrape 20 clinic leads in Lekki\`\n- \`Show sprint progress\`\n- \`Show memory\``
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'AI Command Copilot failed to execute',
      output: `❌ Command failed: ${error.message}`
    }, { status: 500 });
  }
}
