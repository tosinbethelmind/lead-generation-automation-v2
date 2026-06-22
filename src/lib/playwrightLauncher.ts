import { chromium as playwright } from 'playwright-core';

export async function launchBrowser() {
  const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);
  if (isServerless) {
    try {
      const chromium = (await import('@sparticuz/chromium')).default;
      return await playwright.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } catch (e: any) {
      console.error('Failed to launch Playwright with @sparticuz/chromium:', e.message);
      throw e;
    }
  } else {
    return await playwright.launch({ headless: true });
  }
}
