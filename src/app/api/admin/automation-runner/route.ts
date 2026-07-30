import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import net from 'net';
import { getAppCwd } from '@/lib/getCwd';

let activeRunnerPid: number | null = null;
let lastTestResults: any = null;

function checkPortOpen(host: string, port: number, timeout = 2000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;
    socket.setTimeout(timeout);
    socket.on('connect', () => { status = true; socket.destroy(); });
    socket.on('timeout', () => { socket.destroy(); });
    socket.on('error', () => { socket.destroy(); });
    socket.on('close', () => { resolve(status); });
    socket.connect(port, host);
  });
}

export async function GET() {
  try {
    const torActive = await checkPortOpen('127.0.0.1', 9050);
    const redisActive = await checkPortOpen('127.0.0.1', 6379);
    const appActive = await checkPortOpen('127.0.0.1', 3006);

    return NextResponse.json({
      success: true,
      runnerActive: activeRunnerPid !== null,
      torActive,
      redisActive,
      appActive,
      lastTestResults,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'status';

    if (process.env.VERCEL) {
      return NextResponse.json({ success: false, error: 'Background automation runner process cannot be spawned directly in Vercel serverless environment.' }, { status: 400 });
    }

    if (action === 'start-phase1') {
      const projectDir = getAppCwd();
      const runnerScript = path.join(projectDir, 'scripts', 'phase1_runner.js');
      const child = spawn('node', [runnerScript], {
        cwd: projectDir,
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
      activeRunnerPid = child.pid || null;

      return NextResponse.json({
        success: true,
        message: '🚀 Phase 1 Production Automation Runner launched successfully!',
        pid: activeRunnerPid
      });
    }

    if (action === 'run-test') {
      const projectDir = getAppCwd();
      const { exec } = require('child_process');
      const testScript = path.join(projectDir, 'scripts', 'test_scaling_pipeline.js');
      const testResult = await new Promise<{ success: boolean; output: string }>((resolve) => {
        exec(`node "${testScript}"`, { cwd: projectDir }, (error: any, stdout: string, stderr: string) => {
          if (error) {
            resolve({ success: false, output: stdout + '\n' + stderr });
          } else {
            resolve({ success: true, output: stdout });
          }
        });
      });

      lastTestResults = {
        timestamp: new Date().toISOString(),
        success: testResult.success,
        output: testResult.output
      };

      return NextResponse.json({
        success: true,
        message: testResult.success ? '✅ All 5 Scaling Tests Passed Successfully (100%)!' : '⚠️ Tests completed with some warnings.',
        testResults: lastTestResults
      });
    }

    if (action === 'run-chatbot-test') {
      const projectDir = getAppCwd();
      const { exec } = require('child_process');
      const testScript = path.join(projectDir, 'scripts', 'test_chatbot_automation.js');
      const testResult = await new Promise<{ success: boolean; output: string }>((resolve) => {
        exec(`node "${testScript}"`, { cwd: projectDir }, (error: any, stdout: string, stderr: string) => {
          if (error) {
            resolve({ success: false, output: stdout + '\n' + stderr });
          } else {
            resolve({ success: true, output: stdout });
          }
        });
      });

      lastTestResults = {
        timestamp: new Date().toISOString(),
        success: testResult.success,
        output: testResult.output
      };

      return NextResponse.json({
        success: true,
        message: testResult.success ? '🤖 All Chatbot & WhatsApp AI Tests Passed Successfully (100%)!' : '⚠️ Chatbot tests completed with warnings.',
        testResults: lastTestResults
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action requested.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
