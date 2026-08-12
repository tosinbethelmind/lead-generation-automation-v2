/**
 * Customer Journey & Behavioral Analytics Tracker
 * Records user interactions, rage clicks, scroll depth, and navigation pathways.
 */

export interface JourneyEvent {
  leadId: string;
  eventType: 'page_view' | 'click' | 'scroll_depth' | 'rage_click' | 'form_focus' | 'form_submit';
  path: string;
  targetElement?: string;
  scrollPercentage?: number;
  timeOnPageSec?: number;
  metadata?: Record<string, any>;
  timestamp?: string;
}

export class CustomerJourneyTracker {
  private leadId: string;
  private startTime: number;
  private clickHistory: { time: number; target: string }[] = [];

  constructor(leadId: string) {
    this.leadId = leadId;
    this.startTime = Date.now();
  }

  public init() {
    if (typeof window === 'undefined') return;

    // 1. Log Initial Page View
    this.sendEvent({
      leadId: this.leadId,
      eventType: 'page_view',
      path: window.location.pathname,
      metadata: { referrer: document.referrer, screenWidth: window.innerWidth }
    });

    // 2. Click & Rage Click Detector
    window.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement)?.tagName || 'UNKNOWN';
      const targetId = (e.target as HTMLElement)?.id || (e.target as HTMLElement)?.className || target;
      const now = Date.now();

      this.clickHistory.push({ time: now, target: targetId });
      // Keep only clicks from the last 2 seconds
      this.clickHistory = this.clickHistory.filter(c => now - c.time < 2000);

      // Trigger Rage Click alert if user clicks the same element > 3 times in 2 seconds
      const rageClicks = this.clickHistory.filter(c => c.target === targetId).length;

      if (rageClicks >= 3) {
        this.sendEvent({
          leadId: this.leadId,
          eventType: 'rage_click',
          path: window.location.pathname,
          targetElement: targetId,
          metadata: { clickCount: rageClicks }
        });
      } else {
        this.sendEvent({
          leadId: this.leadId,
          eventType: 'click',
          path: window.location.pathname,
          targetElement: targetId
        });
      }
    });

    // 3. Scroll Depth Tracker
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );
      if (scrollPercent > maxScroll + 25) {
        maxScroll = scrollPercent;
        this.sendEvent({
          leadId: this.leadId,
          eventType: 'scroll_depth',
          path: window.location.pathname,
          scrollPercentage: maxScroll
        });
      }
    });
  }

  public async sendEvent(event: JourneyEvent) {
    const payload = {
      ...event,
      timestamp: new Date().toISOString(),
      timeOnPageSec: Math.round((Date.now() - this.startTime) / 1000)
    };

    try {
      if (typeof window !== 'undefined') {
        await fetch('/api/tracking/journey-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.warn('[Journey Tracker Warning]', err);
    }
  }
}
