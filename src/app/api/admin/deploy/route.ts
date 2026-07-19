import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { verifySessionToken } from '@/lib/session';
import { getAdminUser, checkPermission } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify admin token and permission
    const tokenCookie = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(tokenCookie);
    const adminUser = getAdminUser(session?.token);

    if (!adminUser || !checkPermission(adminUser, 'trigger_deploy')) {
      return NextResponse.json({ error: 'Forbidden. trigger_deploy permission required.' }, { status: 403 });
    }

    const projectRoot = process.cwd();

    // Trigger deployment asynchronously to avoid timing out the API response
    // Vercel serverless runs have write limitations but running locally or in supported CLI runners works
    const isWindows = process.platform === 'win32';
    const deployCmd = isWindows ? 'cmd.exe /c npm run redeploy' : 'npm run redeploy';

    console.log(`[Deploy API] Running command "${deployCmd}" in ${projectRoot}`);

    const child = exec(deployCmd, { cwd: projectRoot }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[Deploy API Error] Failed to run redeploy: ${error.message}`);
        console.error(`[Deploy API Error] Stderr: ${stderr}`);
        return;
      }
      console.log(`[Deploy API Success] Deployment finished.`);
      console.log(`[Deploy API Success] Stdout: ${stdout}`);
    });

    return NextResponse.json({
      success: true,
      message: 'Deployment triggered successfully. This will run in the background (typically takes 1-3 minutes).',
      pid: child.pid
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
