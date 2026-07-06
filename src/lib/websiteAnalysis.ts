export type CMSPlatform =
  | 'wordpress'
  | 'shopify'
  | 'wix'
  | 'squarespace'
  | 'webflow'
  | 'joomla'
  | 'ghost'
  | 'weebly'
  | 'godaddy'
  | 'blogger'
  | 'drupal'
  | 'opencart'
  | 'custom';

export type UpgradeStrategy = 'plugin' | 'script_embed' | 'full_rebuild';

export function detectCMS(
  html: string,
  headers: Record<string, string>,
  url: string
): { cms: CMSPlatform; confidence: 'high' | 'medium' | 'low' } {
  const h = html.toLowerCase();
  const u = url.toLowerCase();
  const powered = (headers['x-powered-by'] || '').toLowerCase();
  const generatorTag = html.match(/<meta\s+name=["']generator["']\s+content=["']([^"']*)["']/i)?.[1] || '';
  const generator = generatorTag.toLowerCase();
  const serverHeader = (headers['server'] || '').toLowerCase();

  // WordPress
  if (
    h.includes('/wp-content/') ||
    h.includes('/wp-includes/') ||
    generator.includes('wordpress') ||
    h.includes('wp-json') ||
    h.includes('xmlrpc.php')
  ) return { cms: 'wordpress', confidence: 'high' };

  // Shopify
  if (
    h.includes('cdn.shopify.com') ||
    h.includes('shopify.com/s/files') ||
    h.includes('myshopify.com') ||
    powered.includes('shopify') ||
    h.includes('shopify.theme')
  ) return { cms: 'shopify', confidence: 'high' };

  // Wix
  if (
    h.includes('static.wixstatic.com') ||
    h.includes('wixsite.com') ||
    h.includes('wix.com') ||
    'x-wix-published-version' in headers
  ) return { cms: 'wix', confidence: 'high' };

  // Squarespace
  if (
    h.includes('static1.squarespace.com') ||
    h.includes('squarespace.com/universal') ||
    h.includes('squarespace-cdn.com') ||
    generator.includes('squarespace')
  ) return { cms: 'squarespace', confidence: 'high' };

  // Webflow
  if (
    h.includes('assets.website-files.com') ||
    h.includes('webflow.io') ||
    h.includes('webflow.com') ||
    generator.includes('webflow')
  ) return { cms: 'webflow', confidence: 'high' };

  // Joomla
  if (
    h.includes('/media/joomla_core/') ||
    h.includes('/media/com_') ||
    generator.includes('joomla') ||
    h.includes('joomla')
  ) return { cms: 'joomla', confidence: 'high' };

  // Ghost
  if (
    h.includes('content.ghost.org') ||
    h.includes('ghost.io') ||
    generator.includes('ghost')
  ) return { cms: 'ghost', confidence: 'high' };

  // Weebly
  if (
    h.includes('weebly.com') ||
    h.includes('editmysite.com') ||
    h.includes('weeblysite.com')
  ) return { cms: 'weebly', confidence: 'high' };

  // GoDaddy Website Builder
  if (
    h.includes('godaddy.com/websites') ||
    u.includes('godaddysites.com') ||
    serverHeader.includes('godaddy')
  ) return { cms: 'godaddy', confidence: 'medium' };

  // Blogger
  if (
    u.includes('blogspot.com') ||
    h.includes('blogger.com') ||
    generator.includes('blogger')
  ) return { cms: 'blogger', confidence: 'high' };

  // Drupal
  if (
    h.includes('/sites/default/files/') ||
    generator.includes('drupal') ||
    (headers['x-generator'] || '').toLowerCase().includes('drupal')
  ) return { cms: 'drupal', confidence: 'high' };

  // OpenCart
  if (
    h.includes('/catalog/view/theme/') ||
    h.includes('opencart')
  ) return { cms: 'opencart', confidence: 'medium' };

  return { cms: 'custom', confidence: 'low' };
}

export function resolveUpgradeStrategy(cms: CMSPlatform): {
  upgradeStrategy: UpgradeStrategy;
  pluginSuggestions: string[];
  embedNote: string;
} {
  switch (cms) {
    case 'wordpress':
      return {
        upgradeStrategy: 'plugin',
        pluginSuggestions: [
          'WooCommerce + Paystack/Flutterwave Gateway (online payments)',
          'Amelia or Booking Calendar (appointment scheduling)',
          'WP WhatsApp Chat (instant WhatsApp routing)',
          'FluentCRM or WP CRM (lead & customer management)',
          'Contact Form 7 + Zapier (automated CRM sync)',
        ],
        embedNote: 'No migration needed. All features are added by installing WordPress plugins — works with any existing theme or hosting.',
      };

    case 'shopify':
      return {
        upgradeStrategy: 'plugin',
        pluginSuggestions: [
          'Paystack / Flutterwave Shopify App (local Nigerian payments)',
          'WhatsApp Chat + Abandoned Cart Recovery (Shopify App Store)',
          'Booking App by Webkul (appointment + service scheduling)',
          'Shopify Flow (automated order and loyalty workflows)',
          'Klaviyo or Omnisend (automated email + SMS sequences)',
        ],
        embedNote: 'No migration needed. All features are installed directly from the Shopify App Store in minutes.',
      };

    case 'wix':
      return {
        upgradeStrategy: 'script_embed',
        pluginSuggestions: [
          'Wix Bookings (built-in scheduling — enable from dashboard)',
          'Paystack Checkout via Wix Custom Code embed',
          'WhatsApp Chat Widget via Wix HTML embed component',
          'Wix Automations + CRM (built-in lead management)',
          'Tidio Chat (script embed for live chat + AI bot)',
        ],
        embedNote: 'No rebuild needed. Features are added via the Wix App Market or by inserting a custom HTML embed block in the Wix Editor.',
      };

    case 'squarespace':
      return {
        upgradeStrategy: 'script_embed',
        pluginSuggestions: [
          'Squarespace Scheduling via Acuity (built-in add-on)',
          'Paystack Checkout via Code Block embed',
          'WhatsApp Floating Button via Settings → Advanced → Code Injection',
          'Tidio or Tawk.to Live Chat (script embed)',
          'Zapier Connection for automated Google Sheets CRM sync',
        ],
        embedNote: 'No rebuild needed. Features are added via Squarespace Code Blocks and the Settings → Advanced → Code Injection panel.',
      };

    case 'webflow':
      return {
        upgradeStrategy: 'script_embed',
        pluginSuggestions: [
          'Paystack Inline Checkout via Webflow Custom Code',
          'Calendly or Cal.com scheduling embed (iframe or script)',
          'WhatsApp Floating Chat (script injection in page settings)',
          'Memberstack or Outseta (user accounts + CRM)',
          'Zapier + Webflow Forms for automated CRM pipeline',
        ],
        embedNote: 'No rebuild needed. Webflow natively supports custom <script> injection in page settings, making all widget embeds straightforward.',
      };

    case 'joomla':
      return {
        upgradeStrategy: 'script_embed',
        pluginSuggestions: [
          'RS! Booking (Joomla appointment scheduling extension)',
          'Paystack via J2Store or HikaShop payment gateway plugin',
          'WhatsApp Chat via custom Joomla module (script)',
          'DPCalendar (event + booking management)',
          'Joomla! CRM extension (EasyCRM or CiviCRM)',
        ],
        embedNote: 'Features added via Joomla extensions from the JED directory or by injecting scripts into the Joomla template header.',
      };

    case 'drupal':
      return {
        upgradeStrategy: 'script_embed',
        pluginSuggestions: [
          'Drupal Commerce + Paystack module (payment processing)',
          'Webform + CRM module (lead capture and routing)',
          'WhatsApp Chat module (Drupal.org)',
          'Drupal Booking and Scheduling module',
          'Zapier webhook integration via Drupal Rules module',
        ],
        embedNote: 'Features added via Drupal modules from drupal.org. Some developer involvement may be needed for module configuration.',
      };

    case 'opencart':
      return {
        upgradeStrategy: 'plugin',
        pluginSuggestions: [
          'Paystack OpenCart Payment Extension',
          'WhatsApp Order Notification extension (OpenCart marketplace)',
          'OpenCart CRM integration via Zapier webhook',
          'Tawk.to Live Chat extension',
          'Booking & Rental extension (OpenCart marketplace)',
        ],
        embedNote: 'Features added via OpenCart Marketplace extensions — no rebuild needed for most automation features.',
      };

    case 'ghost':
    case 'blogger':
    case 'weebly':
    case 'godaddy':
      return {
        upgradeStrategy: 'full_rebuild',
        pluginSuggestions: [
          'Full Next.js rebuild with integrated Paystack checkout',
          'Built-in online booking and appointment scheduling system',
          'Native WhatsApp automation and CRM lead sync',
          'Custom domain + SSL certificate migration included',
          'All existing pages and content migrated to new platform',
        ],
        embedNote: `Your current platform (${cms}) has significant limitations around payment processing, custom automation, and CRM integration. A full rebuild on a modern stack is the recommended path — and all existing content will be migrated at no extra cost.`,
      };

    case 'custom':
    default:
      return {
        upgradeStrategy: 'script_embed',
        pluginSuggestions: [
          'Paystack Inline Checkout JS (single script tag — works on any site)',
          'WhatsApp Floating Chat Widget (one-line script embed)',
          'Calendly or Cal.com booking iframe embed',
          'Tawk.to Live Chat (paste one script in site header)',
          'Zapier Webhook from contact forms for automatic CRM sync',
        ],
        embedNote: 'Custom-built sites support all widget embeds via a simple <script> tag in the site header. No rebuild or source code migration required — just one line added to the existing site.',
      };
  }
}
