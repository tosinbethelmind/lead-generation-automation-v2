import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SCRATCH_DIR = path.join(process.cwd(), 'scratch');
const TASKS_FILE = path.join(SCRATCH_DIR, 'modification_tasks.json');

// Ensure scratch directory exists
if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

// Ensure tasks file exists
if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(TASKS_FILE, '[]', 'utf8');
}

export async function GET() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);
    return NextResponse.json(tasks);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { leadId, prompt } = await req.json();

    if (!leadId || !prompt) {
      return NextResponse.json({ error: 'leadId and prompt are required' }, { status: 400 });
    }

    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    const tasks = JSON.parse(data);

    const newTask = {
      id: `task_${Date.now()}`,
      leadId,
      prompt,
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    tasks.push(newTask);
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');

    return NextResponse.json({ success: true, task: newTask });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
