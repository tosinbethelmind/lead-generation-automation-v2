/**
 * @file src/lib/integrations/brevoClient.ts
 * 
 * Brevo Multi-Account Rotator & Automated API Client (2026 Edition)
 * Bethelmind Analytics Commercial Growth Engine
 * 
 * Features:
 * 1. Multi-Account Rotation: Supports multiple Brevo API keys & sender emails for combined daily quotas (300 + 300 + 300... = 1,000+ free emails/day).
 * 2. Transactional Email Dispatch (SMTP API v3) with HTML/Text support, attachments & tags.
 * 3. Contact Management: Auto-sync commercial leads to Brevo lists with custom attributes.
 * 4. Account & Quota Monitoring: Check remaining credits and verified senders across all accounts.
 */

import { getRuntimeConfig, rotateKey } from '../localConfig';

export interface BrevoSender {
  name: string;
  email: string;
}

export interface BrevoRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: BrevoRecipient[];
  subject: string;
  textContent?: string;
  htmlContent?: string;
  sender?: BrevoSender;
  replyTo?: BrevoSender;
  tags?: string[];
  params?: Record<string, any>;
  attachment?: Array<{ name: string; content: string; url?: string }>;
}

export interface BrevoContactAttributes {
  FIRSTNAME?: string;
  LASTNAME?: string;
  SMS?: string;
  CATEGORY?: string;
  AREA?: string;
  PREVIEW_URL?: string;
  CONFIDENCE_SCORE?: number;
  [key: string]: any;
}

export interface BrevoContactPayload {
  email: string;
  attributes?: BrevoContactAttributes;
  listIds?: number[];
  updateEnabled?: boolean;
}

export interface BrevoAccountCredentials {
  apiKey: string;
  senderEmail: string;
  senderName: string;
}

export class BrevoClient {
  private accounts: BrevoAccountCredentials[] = [];
  private currentAccountIndex = 0;
  private baseUrl = 'https://api.brevo.com/v3';

  constructor(apiKey?: string, senderEmail?: string, senderName?: string) {
    const config = getRuntimeConfig();
    
    // Parse single or comma-separated API keys
    const rawKeys = apiKey || process.env.BREVO_API_KEYS || process.env.BREVO_API_KEY || config.brevoApiKey || '';
    const rawEmails = senderEmail || process.env.BREVO_SENDER_EMAILS || process.env.BREVO_SENDER_EMAIL || config.brevoSenderEmail || 'tosin@bethelmindanalytics.com';
    const rawNames = senderName || process.env.BREVO_SENDER_NAMES || process.env.BREVO_SENDER_NAME || config.brevoSenderName || 'Bethelmind Analytics & Strategy';

    const keysList = rawKeys.split(',').map(k => k.trim()).filter(Boolean);
    const emailsList = rawEmails.split(',').map(e => e.trim()).filter(Boolean);
    const namesList = rawNames.split(',').map(n => n.trim()).filter(Boolean);

    if (keysList.length > 0) {
      this.accounts = keysList.map((k, i) => ({
        apiKey: k,
        senderEmail: emailsList[i] || emailsList[0] || 'tosin@bethelmindanalytics.com',
        senderName: namesList[i] || namesList[0] || 'Bethelmind Analytics & Strategy'
      }));
    } else {
      this.accounts = [{
        apiKey: '',
        senderEmail: 'tosin@bethelmindanalytics.com',
        senderName: 'Bethelmind Analytics & Strategy'
      }];
    }
  }

  /**
   * Add an additional Brevo account for automated rotation
   */
  public addAccount(apiKey: string, senderEmail: string, senderName = 'Bethelmind Analytics & Strategy') {
    if (apiKey && senderEmail) {
      this.accounts.push({ apiKey: apiKey.trim(), senderEmail: senderEmail.trim(), senderName: senderName.trim() });
    }
  }

  /**
   * Get current active account credentials with round-robin rotation
   */
  private getActiveAccount(): BrevoAccountCredentials {
    if (this.accounts.length === 0) {
      throw new Error('[BrevoClient] No Brevo accounts configured.');
    }
    const acc = this.accounts[this.currentAccountIndex % this.accounts.length];
    this.currentAccountIndex = (this.currentAccountIndex + 1) % this.accounts.length;
    return acc;
  }

  /**
   * Helper to perform authenticated requests to Brevo API using active rotated account
   */
  private async request<T = any>(endpoint: string, options: RequestInit = {}, specificApiKey?: string): Promise<T> {
    const acc = this.getActiveAccount();
    const apiKey = specificApiKey || acc.apiKey;

    if (!apiKey) {
      throw new Error('[BrevoClient] Brevo API Key is missing. Set BREVO_API_KEY or BREVO_API_KEYS in .env.local.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: any;
      try { errorJson = JSON.parse(errorText); } catch (_) {}
      const msg = errorJson?.message || errorText || response.statusText;
      throw new Error(`[Brevo API Error ${response.status}] ${msg}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * Get account details and credit balances for ALL configured Brevo accounts
   */
  public async getAllAccountsInfo(): Promise<Array<{ account: BrevoAccountCredentials; info: any }>> {
    const results: Array<{ account: BrevoAccountCredentials; info: any }> = [];
    for (const acc of this.accounts) {
      if (acc.apiKey) {
        try {
          const info = await this.request('/account', {}, acc.apiKey);
          results.push({ account: acc, info });
        } catch (err: any) {
          results.push({ account: acc, info: { error: err.message } });
        }
      }
    }
    return results;
  }

  /**
   * Get single account details
   */
  public async getAccountInfo(): Promise<any> {
    return this.request('/account');
  }

  /**
   * List verified senders
   */
  public async getSenders(): Promise<any> {
    return this.request('/senders');
  }

  /**
   * Send a transactional email via Brevo API v3 with automatic account rotation and quota failover
   */
  public async sendEmail(options: SendEmailOptions): Promise<{ messageId?: string }> {
    if (this.accounts.length === 0) {
      throw new Error('[BrevoClient] No Brevo accounts configured.');
    }

    let lastError: Error | null = null;
    const startIndex = this.currentAccountIndex;

    // Attempt sending through available accounts in the pool
    for (let i = 0; i < this.accounts.length; i++) {
      const acc = this.getActiveAccount();
      const sender = options.sender || { name: acc.senderName, email: acc.senderEmail };

      const payload = {
        sender,
        to: options.to,
        subject: options.subject,
        textContent: options.textContent,
        htmlContent: options.htmlContent,
        replyTo: options.replyTo,
        tags: options.tags || ['B2B_OUTREACH'],
        params: options.params,
        attachment: options.attachment
      };

      try {
        const result = await this.request('/smtp/email', {
          method: 'POST',
          body: JSON.stringify(payload)
        }, acc.apiKey);
        return result;
      } catch (err: any) {
        lastError = err;
        const msg = (err.message || '').toLowerCase();
        // If error indicates daily limit or quota exhausted, auto-try next account in pool
        if (msg.includes('daily limit') || msg.includes('quota') || msg.includes('credit') || msg.includes('400')) {
          console.warn(`[BrevoClient] Account quota exhausted for ${acc.senderEmail || 'active key'}. Auto-failing over to next account...`);
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error('[BrevoClient] All configured Brevo accounts exhausted daily quota.');
  }

  /**
   * Create or update a contact in Brevo CRM
   */
  public async createOrUpdateContact(payload: BrevoContactPayload): Promise<any> {
    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        updateEnabled: payload.updateEnabled !== false
      })
    });
  }

  /**
   * Sync a commercial lead directly into Brevo Contacts
   */
  public async syncLead(lead: {
    email: string;
    name?: string;
    phone?: string;
    category?: string;
    area?: string;
    previewUrl?: string;
    confidenceScore?: number;
    listIds?: number[];
  }): Promise<boolean> {
    if (!lead.email) return false;

    try {
      const nameParts = (lead.name || '').split(' ');
      const firstName = nameParts[0] || 'Business Owner';
      const lastName = nameParts.slice(1).join(' ') || '';

      await this.createOrUpdateContact({
        email: lead.email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          SMS: lead.phone ? (lead.phone.startsWith('+') ? lead.phone : `+234${lead.phone.replace(/\D/g, '').substring(1)}`) : undefined,
          CATEGORY: lead.category || 'Commercial SME',
          AREA: lead.area || 'Lagos',
          PREVIEW_URL: lead.previewUrl,
          CONFIDENCE_SCORE: lead.confidenceScore || 85
        },
        listIds: lead.listIds || [3]
      });
      return true;
    } catch (err: any) {
      console.warn(`[BrevoClient] Note syncing lead ${lead.email}:`, err.message);
      return false;
    }
  }

  /**
   * Get all contact lists in Brevo
   */
  public async getContactLists(): Promise<any> {
    return this.request('/contacts/lists');
  }

  /**
   * Ensure a specific Brevo contact list exists (creates it if missing)
   */
  public async ensureContactList(listName = 'Bethelmind Commercial Importers', folderId = 1): Promise<number> {
    try {
      const listsData = await this.getContactLists();
      const existing = (listsData.lists || []).find((l: any) => l.name.toLowerCase() === listName.toLowerCase());
      if (existing) {
        return existing.id;
      }
    } catch (_) {}

    try {
      const created = await this.request('/contacts/lists', {
        method: 'POST',
        body: JSON.stringify({ name: listName, folderId })
      });
      return created.id;
    } catch (_) {
      return 3;
    }
  }
}

export const brevoClient = new BrevoClient();
