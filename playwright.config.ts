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

  use: {
    baseURL: 'http://localhost:3005',
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
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
