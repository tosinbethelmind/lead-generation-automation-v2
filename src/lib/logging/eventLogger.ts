/**
 * @file src/lib/logging/eventLogger.ts
 * 
 * 📜 High-Performance Structured Revenue & Operation Event Logger
 * Inspired by dahlia/logtape design principles:
 * - Zero external runtime dependencies
 * - Isomorphic: works seamlessly in Node.js, Next.js Edge, and browser
 * - Structured audit trails for commercial events (dispatches, views, quotes, payments)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type RevenueEventType = 
  | 'LEAD_INGESTED'
  | 'SMS_DISPATCHED'
  | 'WEB_FORM_SUBMITTED'
  | 'PROTOTYPE_VIEWED'
  | 'WHATSAPP_CLOSER_ENGAGED'
  | 'INVOICE_GENERATED'
  | 'OPAY_PAYMENT_CONFIRMED'
  | 'MOBILE_APK_REQUESTED';

export interface LogEvent {
  timestamp: string;
  level: LogLevel;
  event: RevenueEventType | string;
  message: string;
  metadata?: Record<string, any>;
}

class EventLogger {
  private formatLog(entry: LogEvent): string {
    const metaStr = entry.metadata ? ` | ${JSON.stringify(entry.metadata)}` : '';
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.event}] ${entry.message}${metaStr}`;
  }

  log(level: LogLevel, event: RevenueEventType | string, message: string, metadata?: Record<string, any>) {
    const entry: LogEvent = {
      timestamp: new Date().toISOString(),
      level,
      event,
      message,
      metadata
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
      default:
        console.log(formatted);
        break;
    }

    return entry;
  }

  info(event: RevenueEventType | string, message: string, metadata?: Record<string, any>) {
    return this.log('info', event, message, metadata);
  }

  warn(event: RevenueEventType | string, message: string, metadata?: Record<string, any>) {
    return this.log('warn', event, message, metadata);
  }

  error(event: RevenueEventType | string, message: string, metadata?: Record<string, any>) {
    return this.log('error', event, message, metadata);
  }

  // Specialized commercial shortcuts
  trackLead(leadName: string, category: string, channel: string) {
    return this.info('LEAD_INGESTED', `Lead discovered: ${leadName}`, { category, channel });
  }

  trackPrototypeView(leadSlug: string, isMobile: boolean) {
    return this.info('PROTOTYPE_VIEWED', `Client viewed prototype: ${leadSlug}`, { leadSlug, isMobile });
  }

  trackPayment(reference: string, amountNGN: number, planName: string) {
    return this.info('OPAY_PAYMENT_CONFIRMED', `Payment received: ₦${amountNGN.toLocaleString()} for ${planName}`, { reference, amountNGN, planName });
  }
}

export const logger = new EventLogger();
