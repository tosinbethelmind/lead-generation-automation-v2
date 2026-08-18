/**
 * @file src/lib/whatsapp/baileys_gateway_client.ts
 * Gateway Adapter for local Baileys WhatsApp Service (`scripts/whatsapp_baileys.js`).
 *
 * Provides a clean interface for:
 * - Querying connection status / QR code / pairing code
 * - Checking if target phone numbers have active WhatsApp accounts
 * - Sending text messages with human-like typing simulation
 * - Sending native PTT Voice Notes
 * - Managing human-in-the-loop approval tickets
 */

export interface BaileysStatusResponse {
  status: 'connected' | 'qr' | 'connecting' | 'disconnected';
  qrCodeUrl?: string;
  qrRaw?: string;
  lastPairingCode?: string;
}

export interface CheckWhatsAppResult {
  phone: string;
  exists: boolean;
  jid?: string;
  verified_via: string;
  message?: string;
}

export interface SendMessageOptions {
  phone: string;
  message: string;
  simulateTyping?: boolean;
}

export class BaileysGatewayClient {
  private gatewayUrls: string[];

  constructor(gatewayUrls: string[] = ['http://localhost:3007', 'http://localhost:3009']) {
    this.gatewayUrls = gatewayUrls.map(u => u.replace(/\/$/, ''));
  }

  /**
   * Fetch WhatsApp connection status & QR/Pairing code (checks Line 1 then Line 2)
   */
  async getStatus(): Promise<BaileysStatusResponse> {
    for (const url of this.gatewayUrls) {
      try {
        const res = await fetch(`${url}/status`, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'connected') return data;
        }
      } catch (_) {}
    }

    // Try returning first response if neither is connected
    try {
      const res = await fetch(`${this.gatewayUrls[0]}/status`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (_) {}

    return { status: 'disconnected' };
  }

  /**
   * Verify if a phone number exists on WhatsApp
   */
  async checkWhatsAppNumber(phone: string): Promise<CheckWhatsAppResult> {
    for (const url of this.gatewayUrls) {
      try {
        const res = await fetch(`${url}/check-whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (_) {}
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const isValidNg = cleanDigits.startsWith('234') && cleanDigits.length === 13;
    return {
      phone,
      exists: isValidNg,
      verified_via: 'syntax_fallback',
      message: 'Baileys dual gateways offline, syntax check passed'
    };
  }

  /**
   * Request an 8-digit pairing code for linking phone
   */
  async requestPairingCode(phone: string): Promise<{ success: boolean; pairingCode?: string; error?: string }> {
    for (const url of this.gatewayUrls) {
      try {
        const res = await fetch(`${url}/request-pairing-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
          signal: AbortSignal.timeout(10000)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (_) {}
    }
    return { success: false, error: 'Both WhatsApp gateway ports (3007 & 3009) unreachable' };
  }

  /**
   * Dispatch text message to a lead with dual-line failover
   */
  async sendMessage(options: SendMessageOptions): Promise<{ success: boolean; message?: string; error?: string }> {
    let lastError = '';
    for (const url of this.gatewayUrls) {
      try {
        const res = await fetch(`${url}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options),
          signal: AbortSignal.timeout(15000)
        });
        if (res.ok) {
          return await res.json();
        }
        const errText = await res.text();
        lastError = `${url} error: ${errText}`;
      } catch (err: any) {
        lastError = `${url} unreachable: ${err.message}`;
      }
    }
    return { success: false, error: lastError || 'Dual-line dispatch failed' };
  }

  /**
   * Send PTT Voice Note to lead with dual-line failover
   */
  async sendVoiceNote(phone: string, text: string): Promise<{ success: boolean; message?: string; error?: string }> {
    let lastError = '';
    for (const url of this.gatewayUrls) {
      try {
        const res = await fetch(`${url}/send-voicenote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, text }),
          signal: AbortSignal.timeout(15000)
        });
        if (res.ok) {
          return await res.json();
        }
        const errText = await res.text();
        lastError = `${url} error: ${errText}`;
      } catch (err: any) {
        lastError = `${url} unreachable: ${err.message}`;
      }
    }
    return { success: false, error: lastError || 'Dual-line voice note dispatch failed' };
  }
}

export const baileysClient = new BaileysGatewayClient();
