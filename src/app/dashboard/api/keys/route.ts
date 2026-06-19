import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * POST /dashboard/api/keys
 *
 * Expected JSON payload:
 * {
 *   "GEMINI_API_KEY": "<key>",
 *   "OPENAI_API_KEY": "<key>",
 *   "ANTHROPIC_API_KEY": "<key>"
 * }
 *
 * The handler updates the `.env.local` file (which is git‑ignored) with the provided keys.
 * Existing keys are replaced; omitted keys are left unchanged.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { GEMINI_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY } = data as {
      GEMINI_API_KEY?: string;
      OPENAI_API_KEY?: string;
      ANTHROPIC_API_KEY?: string;
    };

    const envPath = path.resolve(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    const setKey = (key: string, value?: string) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (value) {
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${key}=${value}`);
        } else {
          envContent += `\n${key}=${value}`;
        }
      } else {
        // If the value is undefined or empty, keep existing line unchanged.
        // No removal to avoid accidental deletion of other secrets.
      }
    };

    if (GEMINI_API_KEY) setKey('GEMINI_API_KEY', GEMINI_API_KEY);
    if (OPENAI_API_KEY) setKey('OPENAI_API_KEY', OPENAI_API_KEY);
    if (ANTHROPIC_API_KEY) setKey('ANTHROPIC_API_KEY', ANTHROPIC_API_KEY);

    // Ensure the file ends with a newline for consistency.
    fs.writeFileSync(envPath, envContent.trim() + '\n');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error updating API keys:', err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
