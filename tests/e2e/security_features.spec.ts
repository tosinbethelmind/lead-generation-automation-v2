import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Security & Secrets Hardening Verification', () => {
  let originalConfig: string;
  const configPath = path.join(__dirname, '../../config.json');

  test.beforeAll(() => {
    // Save original config
    originalConfig = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(originalConfig);
    // Initialize with mock values for testing masking
    parsed.storageMode = 'local';
    parsed.dryRun = true;
    parsed.googleClientSecret = 'super_secret_client_secret_value_123456';
    parsed.resendApiKey = 're_123456789012345678901234567890';
    parsed.jijiPassword = 'secure_jiji_password';
    fs.writeFileSync(configPath, JSON.stringify(parsed, null, 2));
  });

  test.afterAll(() => {
    // Restore config
    fs.writeFileSync(configPath, originalConfig);
  });

  test('GET /api/config and /api/settings should mask secrets', async ({ request }) => {
    // Test /api/config
    const responseConfig = await request.get('/api/config', { timeout: 60000 });
    expect(responseConfig.ok()).toBe(true);
    const configData = await responseConfig.json();
    expect(configData.googleClientSecret).toBe('••••••••');
    expect(configData.resendApiKey).toBe('••••••••');
    expect(configData.jijiPassword).toBe('••••••••');

    // Test /api/settings
    const responseSettings = await request.get('/api/settings', { timeout: 60000 });
    expect(responseSettings.ok()).toBe(true);
    const settingsData = await responseSettings.json();
    expect(settingsData.googleClientSecret).toBe('••••••••');
    expect(settingsData.resendApiKey).toBe('••••••••');
    expect(settingsData.jijiPassword).toBe('••••••••');
  });

  test('POST /api/config should block invalid inputs and potential injection', async ({ request }) => {
    // Too short Resend API Key
    const responseShort = await request.post('/api/config', {
      data: {
        resendApiKey: 're_short'
      },
      timeout: 60000
    });
    expect(responseShort.status()).toBe(400);
    const bodyShort = await responseShort.json();
    expect(bodyShort.error).toContain('Resend API Key must be at least 20 characters long.');

    // XSS Script injection
    const responseInjection = await request.post('/api/config', {
      data: {
        googleClientSecret: '<script>alert("hack")</script>'
      },
      timeout: 60000
    });
    expect(responseInjection.status()).toBe(400);
    const bodyInjection = await responseInjection.json();
    expect(bodyInjection.error).toContain('Security Validation Failed: Potential injection pattern detected');
  });

  test('POST /api/settings should update settings and keep existing if masked value is submitted', async ({ request }) => {
    // First, verify we can update with a new valid value
    const responseUpdate = await request.post('/api/settings', {
      data: {
        resendApiKey: 're_new_api_key_for_testing_length_greater_than_twenty'
      },
      timeout: 60000
    });
    expect(responseUpdate.ok()).toBe(true);
    const bodyUpdate = await responseUpdate.json();
    expect(bodyUpdate.resendApiKey).toBe('••••••••');

    // Check the actual file config value is updated
    const configOnDisk = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    expect(configOnDisk.resendApiKey).toBe('re_new_api_key_for_testing_length_greater_than_twenty');

    // Submit mask value and check that it retains the current value
    const responseRetain = await request.post('/api/settings', {
      data: {
        resendApiKey: '••••••••'
      },
      timeout: 60000
    });
    expect(responseRetain.ok()).toBe(true);
    const configOnDisk2 = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    expect(configOnDisk2.resendApiKey).toBe('re_new_api_key_for_testing_length_greater_than_twenty');
  });

  test('UI should contain Jiji credentials warning and Google Client Secret eye toggle', async ({ page }) => {
    // Set localStorage onboarding_complete to true before the page loads to skip setup wizard
    await page.addInitScript(() => {
      window.localStorage.setItem('onboarding_complete', 'true');
    });

    // Navigate to dashboard
    await page.goto('http://localhost:3005/');
    
    // Check Google Client Secret input type is password initially in sidebar
    const clientSecretInput = page.locator('input[placeholder="Paste Client Secret..."]');
    await expect(clientSecretInput).toHaveAttribute('type', 'password');

    // Click toggle show button
    const toggleButton = page.locator('button[title="Show Client Secret"]');
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    // Verify it is now type text
    await expect(clientSecretInput).toHaveAttribute('type', 'text');

    // Click toggle hide button
    const hideButton = page.locator('button[title="Hide Client Secret"]');
    await expect(hideButton).toBeVisible();
    await hideButton.click();

    // Verify it is password again
    await expect(clientSecretInput).toHaveAttribute('type', 'password');

    // Click the Settings tab to render settings panels
    const settingsTabButton = page.locator('button[data-testid="settings-tab"]');
    await expect(settingsTabButton).toBeVisible();
    await settingsTabButton.click();

    // Check that Jiji warning is displayed
    const jijiWarning = page.locator('text=Credentials are stored in your database. Use a dedicated account, not your personal login.');
    await expect(jijiWarning).toBeVisible();
  });
});
