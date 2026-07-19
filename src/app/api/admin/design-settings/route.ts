import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/session';
import { getAdminUser, checkPermission } from '@/lib/auth';

const TOKENS_PATH = path.join(process.cwd(), 'src', 'styles', 'tokens.css');

// Fallback defaults
const DEFAULTS = {
  primary: '#06b6d4',
  secondary: '#8b5cf6',
  accent: '#f59e0b',
  font: 'Inter'
};

export async function GET(req: NextRequest) {
  try {
    // Verify admin token and permission
    const tokenCookie = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(tokenCookie);
    const adminUser = getAdminUser(session?.token);

    if (!adminUser || (!checkPermission(adminUser, 'view_dashboard') && !checkPermission(adminUser, 'edit_design'))) {
      return NextResponse.json({ error: 'Forbidden. view_dashboard or edit_design permission required.' }, { status: 403 });
    }

    try {
      const content = await fs.readFile(TOKENS_PATH, 'utf8');

      // Regular expressions to extract values
      const primaryMatch = content.match(/--color-primary:\s*([^;/*\s]+)/);
      const secondaryMatch = content.match(/--color-secondary:\s*([^;/*\s]+)/);
      const accentMatch = content.match(/--color-accent:\s*([^;/*\s]+)/);
      const fontMatch = content.match(/--font-base:\s*['"]?([^'",\s]+)/);

      return NextResponse.json({
        primary: primaryMatch ? primaryMatch[1] : DEFAULTS.primary,
        secondary: secondaryMatch ? secondaryMatch[1] : DEFAULTS.secondary,
        accent: accentMatch ? accentMatch[1] : DEFAULTS.accent,
        font: fontMatch ? fontMatch[1] : DEFAULTS.font,
      });
    } catch (fileErr) {
      // File doesn't exist yet, return defaults
      return NextResponse.json(DEFAULTS);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin token and permission
    const tokenCookie = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(tokenCookie);
    const adminUser = getAdminUser(session?.token);

    if (!adminUser || !checkPermission(adminUser, 'edit_design')) {
      return NextResponse.json({ error: 'Forbidden. edit_design permission required.' }, { status: 403 });
    }

    const { primary, secondary, accent, font } = await req.json();

    if (!primary || !secondary || !accent || !font) {
      return NextResponse.json({ error: 'Missing design tokens' }, { status: 400 });
    }

    // Clean font input (remove single/double quotes)
    const cleanFont = font.replace(/['"]/g, '');

    const cssContent = `:root {
  --color-primary: ${primary};
  --color-secondary: ${secondary};
  --color-accent: ${accent};
  --font-base: '${cleanFont}', system-ui, sans-serif;
  --spacing-unit: 0.5rem;
}
`;

    // Ensure directory exists
    const dir = path.dirname(TOKENS_PATH);
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(TOKENS_PATH, cssContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Design tokens updated successfully in src/styles/tokens.css'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
