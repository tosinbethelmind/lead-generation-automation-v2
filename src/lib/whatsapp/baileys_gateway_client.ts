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
  private gatewayUrl: string;

  constructor(gatewayUrl: string = process.env.WHATSAPP_GATEWAY_URL || 'http://localhost:3005') {
    this.gatewayUrl = gatewayUrl.replace(/\/$/, '');
  }

  /**
   * Fetch WhatsApp connection status & QR/Pairing code
   */
  async getStatus(): Promise<BaileysStatusResponse> {
    try {
      const res = await fetch(`${this.gatewayUrl}/status`, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) {
        return { status: 'disconnected' };
      }
      return await res.json();
    } catch (err: any) {
      console.warn(`[BaileysClient] Unreachable on ${this.gatewayUrl}: ${err.message}`);
      return { status: 'disconnected' };
    }
  }

  /**
   * Verify if a phone number exists on WhatsApp
   */
  async checkWhatsAppNumber(phone: string): Promise<CheckWhatsAppResult> {
    try {
      const res = await fetch(`${this.gatewayUrl}/check-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
        signal: AbortSignal.timeout(6000)
      });
      if (!res.ok) {
        return { phone, exists: false, verified_via: 'error' };
      }
      return await res.json();
    } catch (err: any) {
      const cleanDigits = phone.replace(/\D/g, '');
      const isValidNg = cleanDigits.startsWith('234') && cleanDigits.length === 13;
      return {
        phone,
        exists: isValidNg,
        verified_via: 'syntax_fallback',
        message: err.message
      };
    }
  }

  /**
   * Request an 8-digit pairing code for linking phone
   */
  async requestPairingCode(phone: string): Promise<{ success: boolean; pairingCode?: string; error?: string }> {
    try {
      const res = await fetch(`${this.gatewayUrl}/request-pairing-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
        signal: AbortSignal.timeout(10000)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Dispatch text message to a lead
   */
  async sendMessage(options: SendMessageOptions): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`${this.gatewayUrl}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
        signal: AbortSignal.timeout(15000)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Send PTT Voice Note to lead
   */
  async sendVoiceNote(phone: string, text: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`${this.gatewayUrl}/send-voicenote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, text }),
        signal: AbortSignal.timeout(15000)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

export const baileysClient = new BaileysGatewayClient();
