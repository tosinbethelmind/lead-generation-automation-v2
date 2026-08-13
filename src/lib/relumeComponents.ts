/**
 * @file relumeComponents.ts
 * Relume UI Component Library & Layout Engine
 * Provides modern, high-converting Relume design system components (Hero, Features, Stats, Testimonials, CTAs, Footer)
 * to upgrade all generated website redesign previews in ApexReach.
 */

export interface RelumeComponentParams {
  businessName: string;
  category?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  heroImageUrl?: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  services?: Array<{ title: string; description: string }>;
  speedScore?: number;
}

/**
 * Generates Relume Navbar 1 Component HTML
 */
export function renderRelumeNavbar(params: RelumeComponentParams): string {
  const { businessName, logoUrl, phone = '2348022791227' } = params;

  return `
  <!-- RELUME NAVBAR 1 -->
  <header style="position: sticky; top: 0; z-index: 1000; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 16px 32px; display: flex; justify-content: space-between; align-items: center;">
    <div style="display: flex; align-items: center; gap: 12px;">
      ${logoUrl ? `<img src="${logoUrl}" alt="${businessName}" style="height: 36px; border-radius: 6px;">` : `<div style="width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #ffffff;">${businessName.charAt(0)}</div>`}
      <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">${businessName}</span>
    </div>
    <nav style="display: flex; align-items: center; gap: 24px;">
      <a href="#services" style="color: #cbd5e1; text-decoration: none; font-size: 14px; font-weight: 500;">Services</a>
      <a href="#about" style="color: #cbd5e1; text-decoration: none; font-size: 14px; font-weight: 500;">About Us</a>
      <a href="#reviews" style="color: #cbd5e1; text-decoration: none; font-size: 14px; font-weight: 500;">Reviews</a>
      <a href="https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${businessName}, I am reaching out from your website.`)}" target="_blank" style="background: #25d366; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px; display: inline-flex; align-items: center; gap: 8px;">
        💬 Chat on WhatsApp
      </a>
    </nav>
  </header>`;
}

/**
 * Generates Relume Header 5 (Hero Split Layout) Component HTML
 */
export function renderRelumeHero(params: RelumeComponentParams): string {
  const { businessName, tagline, heroImageUrl, phone = '2348022791227', speedScore } = params;

  const bgImage = heroImageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80';
  const displayTagline = tagline || `Lagos & Nigeria's Leading Partner for High-Quality Commercial Solutions.`;

  return `
  <!-- RELUME HEADER 5 (HERO SPLIT) -->
  <section style="padding: 80px 32px; max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;">
    <div>
      ${speedScore ? `<div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(37, 99, 235, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px;">⚡ Verified Google Speed Score: ${speedScore}/100</div>` : ''}
      <h1 style="font-size: 48px; font-weight: 800; line-height: 1.15; color: #ffffff; letter-spacing: -1px; margin-bottom: 20px;">
        Experience Premium Excellence with <span style="background: linear-gradient(135deg, #60a5fa, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${businessName}</span>
      </h1>
      <p style="font-size: 18px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px;">
        ${displayTagline} Engineered for maximum reliability, speed, and customer satisfaction.
      </p>
      <div style="display: flex; gap: 16px; align-items: center;">
        <a href="https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${businessName}, I would like to make an inquiry.`)}" target="_blank" style="background: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
          Get Instant Quote
        </a>
        <a href="tel:${phone}" style="border: 1px solid #475569; color: #e2e8f0; padding: 14px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 16px;">
          📞 Call Direct
        </a>
      </div>
    </div>
    <div style="position: relative;">
      <div style="border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);">
        <img src="${bgImage}" alt="${businessName}" style="width: 100%; height: 420px; object-fit: cover; display: block;">
      </div>
    </div>
  </section>`;
}

/**
 * Generates Relume Feature Grid (Feature 1) Component HTML
 */
export function renderRelumeFeatureGrid(params: RelumeComponentParams): string {
  const { services } = params;

  const defaultServices = [
    { title: 'Turnkey Service Delivery', description: 'Fast, professional execution backed by certified industry standards.' },
    { title: '24/7 Priority Support', description: 'Dedicated customer hotline and instant WhatsApp support channel.' },
    { title: 'Transparent Pricing Guarantee', description: 'Upfront competitive pricing with no hidden charges or unexpected fees.' }
  ];

  const items = services && services.length > 0 ? services : defaultServices;

  const cardsHtml = items.map(s => `
    <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); padding: 32px; border-radius: 12px; transition: transform 0.2s;">
      <div style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #60a5fa; margin-bottom: 20px;">✨</div>
      <h3 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">${s.title}</h3>
      <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">${s.description}</p>
    </div>
  `).join('');

  return `
  <!-- RELUME FEATURE GRID 1 -->
  <section id="services" style="padding: 80px 32px; max-width: 1280px; margin: 0 auto;">
    <div style="text-align: center; max-width: 640px; margin: 0 auto 56px auto;">
      <h2 style="font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 16px;">Our Core Deliverables & Solutions</h2>
      <p style="font-size: 16px; color: #94a3b8;">Designed to deliver top-tier value and long-term results for our clients.</p>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
      ${cardsHtml}
    </div>
  </section>`;
}

/**
 * Generates Relume Stats Section (Stats 2) Component HTML
 */
export function renderRelumeStats(): string {
  return `
  <!-- RELUME STATS 2 -->
  <section style="background: rgba(15, 23, 42, 0.8); border-y: 1px solid rgba(255, 255, 255, 0.08); padding: 64px 32px;">
    <div style="max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center;">
      <div>
        <div style="font-size: 44px; font-weight: 800; color: #60a5fa; margin-bottom: 8px;">99.8%</div>
        <div style="font-size: 14px; color: #94a3b8; font-weight: 500;">Satisfaction Rate</div>
      </div>
      <div>
        <div style="font-size: 44px; font-weight: 800; color: #60a5fa; margin-bottom: 8px;">500+</div>
        <div style="font-size: 14px; color: #94a3b8; font-weight: 500;">Clients Served</div>
      </div>
      <div>
        <div style="font-size: 44px; font-weight: 800; color: #60a5fa; margin-bottom: 8px;">&lt; 1.5s</div>
        <div style="font-size: 14px; color: #94a3b8; font-weight: 500;">Page Load Time</div>
      </div>
      <div>
        <div style="font-size: 44px; font-weight: 800; color: #60a5fa; margin-bottom: 8px;">24/7</div>
        <div style="font-size: 14px; color: #94a3b8; font-weight: 500;">Customer Support</div>
      </div>
    </div>
  </section>`;
}

/**
 * Generates Relume CTA 3 Banner Component HTML
 */
export function renderRelumeCTA(params: RelumeComponentParams): string {
  const { businessName, phone = '2348022791227' } = params;

  return `
  <!-- RELUME CTA 3 BANNER -->
  <section style="padding: 80px 32px; max-width: 1280px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #1e3a8a, #1d4ed8); border-radius: 20px; padding: 64px; text-align: center; box-shadow: 0 20px 40px rgba(29, 78, 216, 0.3);">
      <h2 style="font-size: 40px; font-weight: 800; color: #ffffff; margin-bottom: 16px;">Ready to Elevate Your Business with ${businessName}?</h2>
      <p style="font-size: 18px; color: #bfdbfe; max-width: 600px; margin: 0 auto 32px auto;">Get in touch with our team today for a free consultation and instant quote.</p>
      <a href="https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${businessName}, I would like to get started.`)}" target="_blank" style="background: #ffffff; color: #1e3a8a; padding: 16px 36px; border-radius: 10px; font-weight: 800; text-decoration: none; font-size: 18px; display: inline-block;">
        💬 Contact Us on WhatsApp Now
      </a>
    </div>
  </section>`;
}

/**
 * Generates Relume Footer 1 Component HTML
 */
export function renderRelumeFooter(params: RelumeComponentParams): string {
  const { businessName } = params;

  return `
  <!-- RELUME FOOTER 1 -->
  <footer style="background: #090d16; border-top: 1px solid rgba(255, 255, 255, 0.08); padding: 48px 32px; text-align: center; color: #64748b; font-size: 14px;">
    <div style="max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <div>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</div>
      <div style="display: flex; gap: 24px;">
        <a href="#" style="color: #64748b; text-decoration: none;">Privacy Policy</a>
        <a href="#" style="color: #64748b; text-decoration: none;">Terms of Service</a>
      </div>
    </div>
  </footer>`;
}
