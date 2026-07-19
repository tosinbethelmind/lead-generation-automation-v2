import { NextRequest } from 'next/server';
import { getScrapeJob } from '@/lib/supabaseClient';
import { getActiveLogRepository } from '@/lib/googleSheets';

// Allow up to 5 minutes for a streaming response in Vercel
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/**
 * GET /api/logs/stream?jobIds=id1,id2
 *
 * Establishes a Server-Sent Events (SSE) stream.
 * Streams two event types:
 *  • `event: status` — { jobId, status } on every job state transition
 *  • `event: log`    — array of new log lines since the last poll
 *
 * The stream closes automatically when all tracked jobs reach a terminal
 * state (completed / failed), or when the client disconnects.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('jobIds') || searchParams.get('runId') || '';
  const jobIds: string[] = raw.split(',').map(s => s.trim()).filter(Boolean);

  const encoder = new TextEncoder();

  // Helper: format a single SSE message with optional event name
  function sseMessage(eventName: string, data: unknown): Uint8Array {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    return encoder.encode(payload);
  }

  // Helper: send a heartbeat comment keep-alive
  function sseComment(): Uint8Array {
    return encoder.encode(': heartbeat\n\n');
  }

  const stream = new ReadableStream({
    async start(controller) {
      // State we track across poll iterations
      const jobStatuses: Record<string, string> = {};
      let logCursor = 0;       // index of the last processed log row
      let closed = false;

      // Graceful close helper
      function close() {
        if (closed) return;
        closed = true;
        try { controller.close(); } catch (_) {}
      }

      // Listen for client disconnect via the AbortSignal
      request.signal.addEventListener('abort', close);

      // Seed known statuses so we only emit *changes*
      for (const id of jobIds) {
        try {
          const job = await getScrapeJob(id);
          if (job) jobStatuses[id] = job.status;
        } catch (_) {
          jobStatuses[id] = 'queued';
        }
      }

      // Send initial status snapshot so client gets immediate feedback
      for (const [jobId, status] of Object.entries(jobStatuses)) {
        controller.enqueue(sseMessage('status', { jobId, status }));
      }

      // Determine initial log cursor (we do not replay historical logs)
      try {
        const logRepo = getActiveLogRepository();
        const initialLogs = await logRepo.getLogs();
        logCursor = initialLogs.length;
      } catch (_) {}

      // Poll loop — runs every 1.2 s
      const POLL_MS = 1200;
      const MAX_LOOPS = 250; // ~5 min safety cap

      for (let loop = 0; loop < MAX_LOOPS && !closed; loop++) {
        await sleep(POLL_MS);
        if (closed) break;

        // ─── 1. Check job statuses ──────────────────────────────────────────
        let allTerminal = jobIds.length > 0;
        for (const id of jobIds) {
          try {
            const job = await getScrapeJob(id);
            if (!job) continue;

            // Emit if status changed
            if (jobStatuses[id] !== job.status) {
              jobStatuses[id] = job.status;
              controller.enqueue(sseMessage('status', {
                jobId: id,
                status: job.status,
                result: job.result ?? null,
                error: job.error_message ?? null,
              }));
            }

            if (job.status !== 'completed' && job.status !== 'failed') {
              allTerminal = false;
            }
          } catch (_) {
            allTerminal = false; // keep going on transient errors
          }
        }

        // ─── 2. Stream new log lines ────────────────────────────────────────
        try {
          const logRepo = getActiveLogRepository();
          const allLogs = await logRepo.getLogs();
          if (allLogs.length > logCursor) {
            const newLines = allLogs.slice(logCursor);
            logCursor = allLogs.length;
            controller.enqueue(sseMessage('log', newLines));
          }
        } catch (_) {}

        // ─── 3. Keep-alive heartbeat (every 5 loops ≈ 6 s) ─────────────────
        if (loop % 5 === 4) {
          controller.enqueue(sseComment());
        }

        // ─── 4. Close when all jobs are done ────────────────────────────────
        if (jobIds.length > 0 && allTerminal) {
          controller.enqueue(sseMessage('done', { message: 'All jobs finished.' }));
          break;
        }
      }

      close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
