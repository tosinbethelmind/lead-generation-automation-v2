import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 12 * 60 * 1000, // 12 minutes for the full walkthrough
  expect: { timeout: 10000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',

  webServer: {
    command: 'npx next dev -p 3009',
    url: 'http://127.0.0.1:3009',
    reuseExistingServer: true,
    timeout: 300000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      STORAGE_MODE: 'local',
      DRY_RUN: 'true',
      MOCK_SCRAPER: 'true',
      NODE_OPTIONS: '--max-old-space-size=4096',
      META_APP_SECRET: 'solar-quote-pro-test-app-secret-2026'
    }
  },

  use: {
    baseURL: 'http://127.0.0.1:3009',
    trace: 'off',
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 120000,
    launchOptions: {
      slowMo: 80,
    },
  },

  projects: [
    {
      name: 'apexreach-demo',
      use: {
        ...devices['Desktop Chrome'],
        // executablePath: 'C:\\Users\\HomePC\\AppData\\Local\\Perplexity\\Comet\\Application\\comet.exe'
      },
    },
  ],
});
