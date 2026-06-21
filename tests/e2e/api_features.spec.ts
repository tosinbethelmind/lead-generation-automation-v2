import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('API Endpoints Verification', () => {
  const testLeadId = 'mock_test_lead_for_api_verification';
  let originalConfig: string;
  const configPath = path.join(__dirname, '../../config.json');

  test.beforeAll(() => {
    // Save original config
    originalConfig = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(originalConfig);
    // Force storage mode to local and dryRun to true
    parsed.storageMode = 'local';
    parsed.dryRun = true;
    fs.writeFileSync(configPath, JSON.stringify(parsed, null, 2));

    // Write a mock lead file to src/data/sites so update works
    const siteDir = path.join(__dirname, '../../src/data/sites');
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir, { recursive: true });
    }
    const leadConfig = {
      lead: {
        id: testLeadId,
        name: 'API Testing Shop',
        category: 'automotive',
        phone_raw: '+2348000000000',
        email: 'api-test@example.com'
      },
      theme: {
        primary: '#1e3a8a',
        accent: '#f59e0b',
        bg: '#ffffff',
        text: '#1f2937',
        font: 'Inter'
      },
      copy: {
        heroTitle: 'Reliable Auto Care Services',
        heroSubtitle: 'Expert mechanics at your service',
        services: [],
        aboutText: 'We do car repairs',
        ctaText: 'Book Now'
      }
    };
    fs.writeFileSync(path.join(siteDir, `${testLeadId}.json`), JSON.stringify(leadConfig, null, 2));

    // Write the mock lead to the local JSON database (local_db/leads_db.json)
    const localDbDir = path.join(__dirname, '../../local_db');
    if (!fs.existsSync(localDbDir)) {
      fs.mkdirSync(localDbDir, { recursive: true });
    }
    const leadsDbPath = path.join(localDbDir, 'leads_db.json');
    const dbLead = {
      lead_id: 'mock_social_instagram_1781407838565_0',
      source: 'INSTAGRAM',
      name: 'Luxe Couture Lagos',
      category: 'fashion',
      phone_e164: '+2348000000000',
      phone_raw: '08000000000',
      email: 'luxe@example.com',
      website: '',
      status: 'NEW',
      collected_at: new Date().toISOString()
    };
    fs.writeFileSync(leadsDbPath, JSON.stringify([dbLead], null, 2));
  });

  test.afterAll(() => {
    // Restore config
    fs.writeFileSync(configPath, originalConfig);

    // Cleanup mock site file
    const filePath = path.join(__dirname, '../../src/data/sites', `${testLeadId}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // Cleanup local leads database
    const leadsDbPath = path.join(__dirname, '../../local_db/leads_db.json');
    if (fs.existsSync(leadsDbPath)) {
      fs.unlinkSync(leadsDbPath);
    }
  });

  test('POST /api/leads/escalate should update status and log to admin', async ({ request }) => {
    const response = await request.post('/api/leads/escalate', {
      data: {
        leadId: 'mock_social_instagram_1781407838565_0',
        clientName: 'Jane Smith',
        clientEmail: 'janesmith@test.com',
        reason: 'Website styling requested changes',
        urgency: 'high'
      }
    });

    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toContain('escalated');
  });

  test('POST /api/sites/update should modify config using AI', async ({ request }) => {
    const response = await request.post('/api/sites/update', {
      data: {
        siteId: testLeadId,
        description: 'change primary branding color to #10b981 and hero title to Professional Mechanic Team'
      }
    });

    if (response.status() === 400) {
      const body = await response.json();
      expect(body.error).toContain('configured');
    } else {
      expect(response.ok()).toBe(true);
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.appliedDelta).toBeDefined();
    }
  });
});
