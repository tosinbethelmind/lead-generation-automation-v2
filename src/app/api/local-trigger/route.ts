// src/app/api/local-trigger/route.ts
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

/**
 * Endpoint that starts the local job runner.
 * It only runs when the app is executed locally (development mode).
 * In production (Vercel) this endpoint will respond with a polite error
 * because Vercel serverless functions cannot spawn long‑running processes.
 */
export async function POST() {
  // Prevent execution on Vercel production builds.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Local runner cannot be started in production.' },
      { status: 400 }
    );
  }

  try {
    // Spawn the npm script defined in package.json (local-runner).
    const child = spawn('npm', ['run', 'local-runner'], {
      stdio: 'ignore',
      detached: true,
      shell: true,
    });
    // Detach so the process continues after the request ends.
    child.unref();
    return NextResponse.json({ message: 'Local runner started.' }, { status: 200 });
  } catch (err: any) {
    console.error('Failed to start local runner:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
