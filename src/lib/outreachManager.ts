import { getRuntimeConfig } from './localConfig';
import { Lead, LeadStatus, updateLeadStatus, updateLeadFields, addLog, isPhoneOnDnc } from './googleSheets';
import { sendWhatsAppMessage } from './whatsapp';
import { sendSmsMessage } from './sms';
import { sendNotificationEmail } from './email';
import { getPitchDetails, formatPitchTemplate } from './pitchHelper';

export type ErrorCategory = 'AUTH_FAILED' | 'IP_BLOCKED' | 'SERVICE_DOWN' | 'INPUT_INVALID' | 'GENERIC_ERROR';

export interface ActionableError {
  category: ErrorCategory;
  message: string;
  fixAction: string;
}

export function classifyError(channel: string, errorMsg: string): ActionableError {
  const lowerMsg = errorMsg.toLowerCase();
  
  // Specific WhatsApp Disconnect Check
  if (channel === 'whatsapp' && (
    lowerMsg.includes('disconnect') ||
    lowerMsg.includes('expired') ||
    lowerMsg.includes('logout') ||
    lowerMsg.includes('logged out') ||
    lowerMsg.includes('qr') ||
    lowerMsg.includes('session')
  )) {
    return {
      category: 'AUTH_FAILED',
      message: errorMsg,
      fixAction: 'WhatsApp session disconnected/expired. Scan the QR code or pair your session in WhatsApp settings.'
    };
  }

  // Specific Proxy Block Check
  if (
    lowerMsg.includes('proxy') ||
    lowerMsg.includes('tunnel') ||
    lowerMsg.includes('ip blocked') ||
    lowerMsg.includes('rate-limit') ||
    lowerMsg.includes('429') ||
    lowerMsg.includes('blocked')
  ) {
    return {
      category: 'IP_BLOCKED',
      message: errorMsg,
      fixAction: 'Proxy blocked or offline. Please configure your proxies in Scraper settings.'
    };
  }

  // Specific Email Credentials Invalid Check
  if (channel === 'email' && (
    lowerMsg.includes('credentials') ||
    lowerMsg.includes('auth') ||
    lowerMsg.includes('unauthorized') ||
    lowerMsg.includes('key') ||
    lowerMsg.includes('apikey') ||
    lowerMsg.includes('smtp') ||
    lowerMsg.includes('535')
  )) {
    return {
      category: 'AUTH_FAILED',
      message: errorMsg,
      fixAction: 'Email credentials invalid. Check Resend or custom SMTP credentials in Email settings.'
    };
  }

  if (
    lowerMsg.includes('unauthorized') ||
    lowerMsg.includes('auth') ||
    lowerMsg.includes('apikey') ||
    lowerMsg.includes('access token') ||
    lowerMsg.includes('token') ||
    lowerMsg.includes('401') ||
    lowerMsg.includes('403') ||
    lowerMsg.includes('invalid credentials')
  ) {
    let fixAction = '';
    if (channel === 'whatsapp') {
      fixAction = 'Update WhatsApp Access Token / API Key in Settings.';
    } else if (channel === 'sms') {
      fixAction = 'Verify Twilio Sid and Token in Settings.';
    } else if (channel === 'email') {
      fixAction = 'Check Resend or custom SMTP API keys/credentials in Settings.';
    } else {
      fixAction = 'Review connection credentials in Settings.';
    }
    return {
      category: 'AUTH_FAILED',
      message: errorMsg,
      fixAction
    };
  }

  if (
    lowerMsg.includes('block') ||
    lowerMsg.includes('rate-limit') ||
    lowerMsg.includes('spam') ||
    lowerMsg.includes('blacklisted') ||
    lowerMsg.includes('429') ||
    lowerMsg.includes('temp') ||
    lowerMsg.includes('suspend')
  ) {
    let fixAction = '';
    if (channel === 'whatsapp') {
      fixAction = 'Rotate WhatsApp sender number or dynamic IP proxy.';
    } else if (channel === 'sms') {
      fixAction = 'Switch Twilio messaging service sender pool.';
    } else if (channel === 'email') {
      fixAction = 'Warm up sending domain or rotate outreach emails.';
    } else {
      fixAction = 'Rotate proxies or pause outreach pipeline temporarily.';
    }
    return {
      category: 'IP_BLOCKED',
      message: errorMsg,
      fixAction
    };
  }

  if (
    lowerMsg.includes('refused') ||
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('fetch failed') ||
    lowerMsg.includes('502') ||
    lowerMsg.includes('503') ||
    lowerMsg.includes('504') ||
    lowerMsg.includes('network') ||
    lowerMsg.includes('connect')
  ) {
    let fixAction = '';
    if (channel === 'whatsapp') {
      fixAction = 'Ensure Baileys/Evolution API local docker service is running.';
    } else {
      fixAction = 'Verify outbound internet access and target endpoint status.';
    }
    return {
      category: 'SERVICE_DOWN',
      message: errorMsg,
      fixAction
    };
  }

  if (
    lowerMsg.includes('invalid email') ||
    lowerMsg.includes('phone') ||
    lowerMsg.includes('format') ||
    lowerMsg.includes('no phone') ||
    lowerMsg.includes('no email') ||
    lowerMsg.includes('400')
  ) {
    return {
      category: 'INPUT_INVALID',
      message: errorMsg,
      fixAction: 'Verify lead contact data is correct and formatted properly.'
    };
  }

  return {
    category: 'GENERIC_ERROR',
    message: errorMsg,
    fixAction: 'Check system logs for raw provider details.'
  };
}

export interface ChannelResult {
  channel: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  errorCategory?: ErrorCategory;
  fixAction?: string;
}

export interface OutreachFallbackResult {
  success: boolean;
  attemptedChannels: string[];
  channelResults: ChannelResult[];
  finalStatus: LeadStatus;
  logs: string[];
}

export class OutreachManager {
  /**
   * Dispatches outreach for a single lead, routing through channels sequentially
   * based on failover priority until one succeeds.
   */
  static async dispatchWithFallback(
    lead: Lead,
    origin: string,
    options: {
      customSubject?: string;
      customMessage?: string;
      isDryRun?: boolean;
      channelsOverride?: string[];
    } = {}
  ): Promise<OutreachFallbackResult> {
    const config = getRuntimeConfig();
    const priorityStr = options.channelsOverride?.join(',') || config.failoverPriority || 'whatsapp,sms,email';
    const channels = priorityStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    
    const logs: string[] = [];
    const channelResults: ChannelResult[] = [];
    const attemptedChannels: string[] = [];
    
    const leadId = lead.lead_id;
    const phone = lead.phone_e164 || lead.phone_raw;
    const email = lead.email;
    const isDryRun = options.isDryRun ?? !!config.dryRun;

    const previewUrl = `${origin}/preview/${leadId}`;
    const pitch = getPitchDetails(lead, origin, config.businessSignature || '');

    logs.push(`[OutreachManager] Starting cascade for lead: ${lead.name} (${leadId})`);
    
    // Proactive health status pre-filtering
    let healthStatusMap: any = {};
    if (config.serviceHealthStatus) {
      try {
        healthStatusMap = JSON.parse(config.serviceHealthStatus);
      } catch (e) {
        console.error('[OutreachManager] Failed to parse serviceHealthStatus config', e);
      }
    }

    const healthyChannels = channels.filter(channel => {
      const channelHealth = healthStatusMap[channel];
      if (!channelHealth) return true;
      return channelHealth.status !== 'unhealthy' && channelHealth.status !== 'unconfigured';
    });

    const activeChannels = healthyChannels.length > 0 ? healthyChannels : channels;
    const bypassed = channels.filter(c => !activeChannels.includes(c));

    if (bypassed.length > 0) {
      logs.push(`[OutreachManager] Proactively bypassing unhealthy/unconfigured channels: ${bypassed.join(', ').toUpperCase()}`);
      for (const skipped of bypassed) {
        channelResults.push({
          channel: skipped,
          status: 'skipped',
          error: `Proactive failover: Channel health status is ${healthStatusMap[skipped]?.status || 'unknown'}`
        });
      }
    }

    logs.push(`[OutreachManager] Cascade path: ${activeChannels.join(' -> ')}`);

    let success = false;
    let successfulChannel = '';

    for (const channel of activeChannels) {
      if (success) break;

      attemptedChannels.push(channel);
      logs.push(`[OutreachManager] Attempting channel: ${channel.toUpperCase()}`);

      try {
        if (channel === 'whatsapp') {
          // Check phone & DNC
          if (!phone) {
            logs.push(`[WhatsApp] Skipped: Lead has no phone number`);
            channelResults.push({ channel, status: 'skipped', error: 'No phone number' });
            continue;
          }
          const dnc = await isPhoneOnDnc(phone);
          if (dnc) {
            logs.push(`[WhatsApp] Skipped: Phone is on Do Not Contact (DNC) list`);
            channelResults.push({ channel, status: 'skipped', error: 'Phone is on DNC list' });
            continue;
          }

          const messageText = options.customMessage
            ? formatPitchTemplate(options.customMessage, lead, previewUrl, config.businessSignature || '')
            : pitch.whatsappBody;

          if (isDryRun) {
            logs.push(`[WhatsApp] [DRY RUN] Simulated message sent to ${phone}`);
            channelResults.push({ channel, status: 'success' });
            success = true;
            successfulChannel = 'whatsapp';
          } else {
            // Call WhatsApp sender
            const resultMsg = await sendWhatsAppMessage(lead, previewUrl, origin, options.customMessage);
            logs.push(`[WhatsApp] Success: ${resultMsg}`);
            channelResults.push({ channel, status: 'success' });
            success = true;
            successfulChannel = 'whatsapp';
          }
        } 
        
        else if (channel === 'sms') {
          // Check phone & DNC
          if (!phone) {
            logs.push(`[SMS] Skipped: Lead has no phone number`);
            channelResults.push({ channel, status: 'skipped', error: 'No phone number' });
            continue;
          }
          const dnc = await isPhoneOnDnc(phone);
          if (dnc) {
            logs.push(`[SMS] Skipped: Phone is on Do Not Contact (DNC) list`);
            channelResults.push({ channel, status: 'skipped', error: 'Phone is on DNC list' });
            continue;
          }

          if (isDryRun) {
            logs.push(`[SMS] [DRY RUN] Simulated SMS sent to ${phone}`);
            channelResults.push({ channel, status: 'success' });
            success = true;
            successfulChannel = 'sms';
          } else {
            // Call SMS sender
            const resultMsg = await sendSmsMessage(lead, previewUrl, options.customMessage);
            logs.push(`[SMS] Success: ${resultMsg}`);
            channelResults.push({ channel, status: 'success' });
            success = true;
            successfulChannel = 'sms';
          }
        } 
        
        else if (channel === 'email') {
          // Check email
          if (!email) {
            logs.push(`[Email] Skipped: Lead has no email address`);
            channelResults.push({ channel, status: 'skipped', error: 'No email address' });
            continue;
          }
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            logs.push(`[Email] Skipped: Invalid email format (${email})`);
            channelResults.push({ channel, status: 'skipped', error: 'Invalid email format' });
            continue;
          }

          const subject = options.customSubject 
            ? formatPitchTemplate(options.customSubject, lead, previewUrl, config.businessSignature || '')
            : pitch.emailSubject;

          const body = options.customMessage
            ? formatPitchTemplate(options.customMessage, lead, previewUrl, config.businessSignature || '')
            : pitch.emailBody;

          if (isDryRun) {
            logs.push(`[Email] [DRY RUN] Simulated Email sent to ${email}`);
            channelResults.push({ channel, status: 'success' });
            success = true;
            successfulChannel = 'email';
          } else {
            // Call Email sender
            const sent = await sendNotificationEmail(email, subject, body);
            if (!sent) {
              throw new Error('Email provider API returned failure status');
            }
            logs.push(`[Email] Success: Sent email via configured provider`);
            channelResults.push({ channel, status: 'success' });
            success = true;
            successfulChannel = 'email';
          }
        } else if (channel === 'jiji') {
          if (lead.source !== 'JIJI') {
            logs.push(`[Jiji] Skipped: Lead is not from Jiji source`);
            channelResults.push({ channel, status: 'skipped', error: 'Not Jiji source' });
            continue;
          }
          if (isDryRun) {
            logs.push(`[Jiji] [DRY RUN] Simulated Jiji chat sent to ${lead.profile_url || 'No Profile'}`);
            channelResults.push({ channel, status: 'success' });
            success = true;
            successfulChannel = 'jiji';
          } else {
            const jijiResp = await fetch(`${origin}/api/jiji`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ leadIds: [leadId], dryRun: false })
            });
            const jijiData = await jijiResp.json().catch(() => ({}));
            const resObj = jijiData.results?.find((r: any) => r.leadId === leadId);
            if (jijiResp.ok && jijiData.success && resObj?.status === 'SUCCESS') {
              logs.push(`[Jiji] Success: Jiji chat message sent`);
              channelResults.push({ channel, status: 'success' });
              success = true;
              successfulChannel = 'jiji';
            } else {
              throw new Error(resObj?.error || jijiData.error || 'Jiji Chat API failed');
            }
          }
        } else if (channel === 'contact_form') {
          const website = lead.website;
          if (!website || !website.startsWith('http')) {
            logs.push(`[Contact Form] Skipped: Lead has no website URL`);
            channelResults.push({ channel, status: 'skipped', error: 'No website URL' });
            continue;
          }
          if (isDryRun) {
            logs.push(`[Contact Form] [DRY RUN] Would submit contact form on ${website}`);
            channelResults.push({ channel, status: 'success' });
            success = true;
            successfulChannel = 'contact_form';
          } else {
            const { submitContactForm } = await import('./contactFormSubmitter');
            const res = await submitContactForm(lead, origin, config.businessSignature || '');
            if (res.success) {
              logs.push(`[Contact Form] Success: ${res.notes}`);
              channelResults.push({ channel, status: 'success' });
              success = true;
              successfulChannel = 'contact_form';
            } else {
              throw new Error(res.notes || 'Contact form submission failed');
            }
          }
        } else if (channel === 'social_dm') {
          const socialsStr = lead.social_links;
          let socialsParsed: Record<string, string> = {};
          if (socialsStr) {
            try {
              socialsParsed = typeof socialsStr === 'string' ? JSON.parse(socialsStr) : socialsStr;
            } catch (_) {}
          }
          const hasSocial = Object.keys(socialsParsed || {}).some(k => socialsParsed[k]);
          
          if (!hasSocial && !lead.profile_url) {
            logs.push(`[Social DM] Skipped: Lead has no social links`);
            channelResults.push({ channel, status: 'skipped', error: 'No social links' });
            continue;
          }

          // Generate DM helper links
          const dmLinks: string[] = [];
          if (lead.profile_url) {
            if (lead.profile_url.includes('facebook.com')) {
              const parts = lead.profile_url.replace(/\/$/, '').split('/');
              const lastPart = parts[parts.length - 1];
              dmLinks.push(`Facebook Messenger: https://m.me/${lastPart}`);
            } else if (lead.profile_url.includes('instagram.com')) {
              dmLinks.push(`Instagram DM: ${lead.profile_url.replace(/\/$/, '')}/direct/inbox/`);
            } else {
              dmLinks.push(`Profile DM: ${lead.profile_url}`);
            }
          }
          
          Object.entries(socialsParsed).forEach(([platform, link]) => {
            if (!link) return;
            if (platform === 'facebook') {
              const parts = link.replace(/\/$/, '').split('/');
              const lastPart = parts[parts.length - 1];
              dmLinks.push(`Facebook Messenger: https://m.me/${lastPart}`);
            } else if (platform === 'instagram') {
              dmLinks.push(`Instagram DM: ${link.replace(/\/$/, '')}/direct/inbox/`);
            } else if (platform === 'twitter' || platform === 'x') {
              dmLinks.push(`Twitter DM: ${link}`);
            } else if (platform === 'linkedin') {
              dmLinks.push(`LinkedIn Profile: ${link}`);
            }
          });

          const notesMsg = `Generated click-to-chat helper DM links:\n${dmLinks.join('\n')}`;
          logs.push(`[Social DM] Generated ${dmLinks.length} click-to-chat messaging links.`);
          
          if (!isDryRun) {
            await updateLeadFields(leadId, {
              status: 'CONTACTED',
              notes: (lead.notes || '') + ` | [Social DM Helper] ${notesMsg}`
            });
          }
          
          channelResults.push({ channel, status: 'success' });
          success = true;
          successfulChannel = 'social_dm';
        }
      } catch (err: any) {
        const errorMsg = err.message || String(err);
        const classification = classifyError(channel, errorMsg);
        logs.push(`[${channel.toUpperCase()} Blocked/Failed] Category: ${classification.category} - ${classification.message} (Fix: ${classification.fixAction})`);
        
        channelResults.push({
          channel,
          status: 'failed',
          error: errorMsg,
          errorCategory: classification.category,
          fixAction: classification.fixAction
        });
        
        // Notify of fallback transitions
        const nextChannelIdx = activeChannels.indexOf(channel) + 1;
        if (nextChannelIdx < activeChannels.length) {
          logs.push(`[Fallback Active] ${channel.toUpperCase()} failed. Cascading to: ${activeChannels[nextChannelIdx].toUpperCase()}`);
        }
      }
    }

    const timestamp = new Date().toISOString();
    let finalStatus: LeadStatus = 'ERROR';
    let notesMsg = '';

    if (success) {
      finalStatus = 'CONTACTED';
      notesMsg = `Outreach succeeded via ${successfulChannel.toUpperCase()}. Details:\n` + 
                 channelResults.map(r => `- ${r.channel}: ${r.status}${r.error ? ` (${r.error})` : ''}`).join('\n');
      
      logs.push(`[OutreachManager] Succeeded via ${successfulChannel.toUpperCase()}`);
      
      await updateLeadStatus(leadId, finalStatus, notesMsg, timestamp);
      await addLog('Outreach Cascade', 'SUCCESS', `Lead ${leadId} contacted successfully via ${successfulChannel.toUpperCase()}`);
    } else {
      finalStatus = 'ERROR';
      notesMsg = `Outreach Cascade Failed completely. Details:\n` +
                 channelResults.map(r => `- ${r.channel}: ${r.status}${r.error ? ` (${r.error})` : ''}`).join('\n');
      
      logs.push(`[OutreachManager] Failed completely for lead: ${leadId}`);
      
      await updateLeadStatus(leadId, finalStatus, notesMsg);
      await addLog('Outreach Cascade', 'ERROR', `Lead ${leadId} cascade failed. No channel succeeded.`);
    }

    return {
      success,
      attemptedChannels,
      channelResults,
      finalStatus,
      logs
    };
  }
}
