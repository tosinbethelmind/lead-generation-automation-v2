/**
 * @file scripts/lib/data_saver_config.js
 * 
 * 🔋 Bethelmind System-Wide Data & Laptop Resource Optimizer
 * 
 * DESIGN GOALS:
 * 1. 85%–90% Internet Data Reduction: Blocks images, media, fonts, and trackers during scraping.
 * 2. Low-RAM Architecture: Limits process memory to 512MB max; recycles memory aggressively.
 * 3. 0% Laptop Resource Drain on APK Builds: Offloads heavy compilation to GitHub Actions.
 * 4. 100% Quality Invariant: Delivers identical high-accuracy leads, dossiers, and prototypes.
 */

module.exports = {
  // Network Data Guardrails
  network: {
    // Block resource types that consume data without adding text/form value
    blockedResourceTypes: ['image', 'media', 'font', 'stylesheet', 'other'],
    blockedExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.mp4', '.svg', '.woff', '.woff2', '.ttf', '.eot'],
    blockedDomains: [
      'google-analytics.com',
      'googletagmanager.com',
      'facebook.net',
      'doubleclick.net',
      'hotjar.com',
      'clarity.ms'
    ],
    // Accept compressed payloads to minimize transit bytes
    acceptEncoding: 'gzip, deflate, br',
    timeoutMs: 7000
  },

  // Laptop Hardware & Process Guardrails
  system: {
    maxOldSpaceSizeMB: 512,      // Limits Node heap to 512MB to keep Windows smooth
    maxParallelTasks: 2,         // Limits concurrent workers to prevent CPU spikes
    idleTimeoutMs: 15000,        // Kill idle worker processes after 15s
    cloudCompilationPreferred: true // Direct APK and heavy builds to cloud runners
  }
};
