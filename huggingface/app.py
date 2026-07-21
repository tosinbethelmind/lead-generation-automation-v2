import os
import time
import json
import threading
import requests
import gradio as gr
from datetime import datetime

# Read environment variables
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")
SCRAPER_API_BASE_URL = os.environ.get("SCRAPER_API_BASE_URL")

# Global state for UI dashboard
logs = []
status_message = "Starting..."
active_jobs_cache = []
completed_jobs_cache = []
current_job = None
is_running = True

def log(msg):
    timestamp = datetime.now().isoformat()
    formatted = f"[{timestamp}] {msg}"
    print(formatted)
    logs.append(formatted)
    if len(logs) > 200:
        logs.pop(0)

# Helper for API requests to Supabase PostgREST
def supabase_request(method, endpoint, json_data=None, params=None, headers=None):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    default_headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    if headers:
        default_headers.update(headers)
    
    try:
        if method == "GET":
            res = requests.get(url, headers=default_headers, params=params, timeout=10)
        elif method == "POST":
            res = requests.post(url, headers=default_headers, json=json_data, params=params, timeout=10)
        elif method == "PATCH":
            res = requests.patch(url, headers=default_headers, json=json_data, params=params, timeout=10)
        elif method == "DELETE":
            res = requests.delete(url, headers=default_headers, params=params, timeout=10)
        else:
            return None
        res.raise_for_status()
        if res.status_code == 204:
            return True
        return res.json()
    except Exception as e:
        log(f"Supabase request error ({method} {endpoint}): {e}")
        return None

# endpointMap equivalent
ENDPOINT_MAP = {
    "jiji": "jiji",
    "osm": "osm",
    "maps-free": "maps-free",
    "social": "social",
    "duckduckgo": "duckduckgo",
    "maps": "maps",
    "google": "maps"
}

def update_job_status(job_id, status, error_message=None, result=None):
    payload = {"status": status, "updated_at": datetime.utcnow().isoformat() + "Z"}
    if error_message:
        payload["error_message"] = error_message
    if result:
        payload["result"] = result
    
    supabase_request("PATCH", f"scrape_jobs?id=eq.{job_id}", json_data=payload)

def process_job(job):
    global current_job
    job_id = job.get("id")
    job_type = job.get("type")
    payload = job.get("payload", {})
    
    current_job = {
        "id": job_id,
        "type": job_type,
        "payload": payload,
        "startedAt": datetime.now().isoformat()
    }
    
    log(f"Processing Job: {job_id} (Type: {job_type})")
    
    # 1. Optimistic Lock status to 'running'
    # Match standard local runner by PATCHing only if status was queued
    res = supabase_request(
        "PATCH", 
        f"scrape_jobs?id=eq.{job_id}&status=eq.queued", 
        json_data={"status": "running", "updated_at": datetime.utcnow().isoformat() + "Z"},
        headers={"Prefer": "return=representation"}
    )
    
    # If returned rows list is empty, job was already claimed
    if not res:
        log(f"Job {job_id} already running or picked up elsewhere.")
        current_job = None
        return

    # 2. Forward request to Vercel/Render Scraper API BASE URL
    path_name = ENDPOINT_MAP.get(job_type)
    if not path_name:
        err = f"Unsupported job type: {job_type}"
        log(f"Error: {err}")
        update_job_status(job_id, "failed", error_message=err)
        current_job = None
        return

    if not SCRAPER_API_BASE_URL:
        err = "SCRAPER_API_BASE_URL is not configured."
        log(f"Error: {err}")
        update_job_status(job_id, "failed", error_message=err)
        current_job = None
        return

    endpoint_url = f"{SCRAPER_API_BASE_URL.rstrip('/')}/api/scrape/{path_name}"
    log(f"Forwarding job {job_id} payload to Vercel API: {endpoint_url}")
    
    try:
        # Triggering Vercel scraping pipeline with 10 minutes timeout
        response = requests.post(
            endpoint_url,
            headers={
                "Content-Type": "application/json",
                "x-bypass-queue": "true"
            },
            json={**payload, "bypassQueue": True},
            timeout=600  # 10 minutes
        )
        
        if response.status_code != 200:
            raise Exception(f"HTTP {response.status_code}: {response.text}")
            
        result_data = response.json()
        if result_data.get("error"):
            raise Exception(result_data.get("error"))
            
        added = result_data.get("added", 0)
        skipped = result_data.get("skipped", 0)
        leads = result_data.get("leads", [])
        leads_count = len(leads) if isinstance(leads, list) else 0
        
        result_payload = {"added": added, "skipped": skipped, "leadsCount": leads_count}
        
        update_job_status(job_id, "completed", result=result_payload)
        log(f"Completed Job: {job_id}. Added: {added}, Skipped: {skipped}")
        
    except Exception as e:
        log(f"Job execution failed for {job_id}: {e}")
        update_job_status(job_id, "failed", error_message=str(e))
        
    current_job = None

# Background Daemon: Heartbeat Thread
def heartbeat_loop():
    while is_running:
        if not SUPABASE_URL or not SUPABASE_KEY:
            time.sleep(3)
            continue
            
        heartbeat_data = {
            "last_seen": int(time.time() * 1000),
            "pid": 1,
            "currentJob": current_job,
            "port": None
        }
        
        try:
            # 1. Clean old heartbeats
            supabase_request("DELETE", "logs?run_id=eq.huggingface_runner&step=eq.heartbeat")
            # 2. Insert new heartbeat log
            supabase_request(
                "POST", 
                "logs", 
                json_data=[{
                    "run_id": "huggingface_runner",
                    "step": "heartbeat",
                    "status": "INFO",
                    "message": json.dumps(heartbeat_data)
                }]
            )
        except Exception as e:
            pass # Silent fail on temporary connection issues
            
        time.sleep(3)

# Background Daemon: Poller Thread
def poller_loop():
    global active_jobs_cache, completed_jobs_cache
    
    last_cron_time = 0
    last_5min_time = 0
    
    log("Cloud Poller background daemon initiated.")
    
    while is_running:
        now = time.time()
        
        # 1. Poll queue (every 3 seconds)
        if SUPABASE_URL and SUPABASE_KEY:
            # Query standard non-atomic queue check
            # equivalent to .select('*').eq('status','queued').order('created_at').limit(1)
            params = {
                "status": "eq.queued",
                "order": "created_at.asc",
                "limit": 1
            }
            jobs = supabase_request("GET", "scrape_jobs", params=params)
            
            if jobs and len(jobs) > 0:
                process_job(jobs[0])
                
            # Update cache for Gradio dashboard UI
            try:
                active_res = supabase_request("GET", "scrape_jobs", params={
                    "status": "in.(running,queued)",
                    "order": "created_at.asc",
                    "limit": 10
                })
                if active_res is not None:
                    active_jobs_cache = active_res
                    
                completed_res = supabase_request("GET", "scrape_jobs", params={
                    "status": "in.(completed,failed)",
                    "order": "updated_at.desc",
                    "limit": 10
                })
                if completed_res is not None:
                    completed_jobs_cache = completed_res
            except Exception:
                pass
                
        # 2. Batch deploy sync check cron (every 60 seconds)
        if SCRAPER_API_BASE_URL and (now - last_cron_time >= 60):
            last_cron_time = now
            try:
                cron_secret = os.environ.get("CRON_SECRET", "apexreach_sync_secret")
                sync_url = f"{SCRAPER_API_BASE_URL.rstrip('/')}/api/deploy/batch-sync?secret={cron_secret}"
                res = requests.get(sync_url, timeout=15)
                if res.status_code == 200:
                    data = res.json()
                    if data.get("success") and data.get("results"):
                        res_dat = data["results"]
                        log(f"Cron: Batch sync completed: Redesigns: {len(res_dat.get('redesignsProcessed', []))} success, Git: {len(res_dat.get('gitDeploysProcessed', []))} success.")
            except Exception as e:
                pass
                
        # 3. Scheduled Campaign/Lagos Scraper Queue Trigger (every 5 minutes)
        if SCRAPER_API_BASE_URL and (now - last_5min_time >= 300):
            last_5min_time = now
            
            # Scheduled Campaigns
            try:
                sched_url = f"{SCRAPER_API_BASE_URL.rstrip('/')}/api/schedule"
                requests.post(sched_url, json={"action": "trigger-next", "force": False}, timeout=15)
            except Exception:
                pass
                
            # Lagos Daily Scraper
            try:
                lagos_url = f"{SCRAPER_API_BASE_URL.rstrip('/')}/api/schedule/lagos-10k"
                requests.post(lagos_url, json={"autoQueue": True}, timeout=15)
            except Exception:
                pass
            
            # Stuck jobs check (clean up jobs running over 15 minutes)
            try:
                stuck_res = supabase_request("GET", "scrape_jobs", params={
                    "status": "eq.running",
                    "updated_at": f"lt.{datetime.utcnow().isoformat()[:-7] + 'Z'}" # needs simple comparison logic or just fetch and filter
                })
                # simple logic: fetch running and filter in python
                running_jobs = supabase_request("GET", "scrape_jobs", params={"status": "eq.running"})
                if running_jobs:
                    for j in running_jobs:
                        # parse updated_at
                        try:
                            # format: '2026-07-21T07:33:39.123Z' or similar
                            up_str = j.get("updated_at", "").replace("Z", "")
                            if "." in up_str:
                                up_str = up_str.split(".")[0]
                            dt = datetime.fromisoformat(up_str)
                            diff = (datetime.utcnow() - dt).total_seconds()
                            if diff > 900: # 15 minutes
                                log(f"Stuck Job Found: {j.get('id')} has been running for {diff/60:.1f} mins. Failing it.")
                                update_job_status(j.get("id"), "failed", error_message="Job execution timed out (running > 15m).")
                        except Exception:
                            pass
            except Exception:
                pass
                
        time.sleep(3)

# Expose Gradio interface dashboard
def get_dashboard_html():
    status = "ONLINE" if SUPABASE_URL and SUPABASE_KEY else "CONFIGURATION REQUIRED"
    
    html = f"""
    <div style='font-family: sans-serif; padding: 20px; border-radius: 8px; background-color: #1e1e2e; color: #cdd6f4;'>
        <h2 style='color: #89b4fa; margin-top: 0;'>ApexReach Cloud Runner (HF Python Space)</h2>
        <div style='display: flex; gap: 20px; margin-bottom: 20px;'>
            <div style='background: #313244; padding: 15px; border-radius: 6px; flex: 1;'>
                <strong>Runner Status:</strong> <span style='color: #a6e3a1;'>{status}</span>
            </div>
            <div style='background: #313244; padding: 15px; border-radius: 6px; flex: 1;'>
                <strong>Current Active Job:</strong> <span>{current_job["id"] if current_job else "None"}</span>
            </div>
        </div>
        
        <h3>Active Queue (Next 10)</h3>
        <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
            <thead>
                <tr style='border-bottom: 2px solid #45475a; text-align: left;'>
                    <th style='padding: 8px;'>ID</th>
                    <th style='padding: 8px;'>Type</th>
                    <th style='padding: 8px;'>Status</th>
                    <th style='padding: 8px;'>Created At</th>
                </tr>
            </thead>
            <tbody>
    """
    if active_jobs_cache:
        for j in active_jobs_cache:
            html += f"""
                <tr style='border-bottom: 1px solid #313244;'>
                    <td style='padding: 8px; font-family: monospace;'>{j.get("id", "")}</td>
                    <td style='padding: 8px;'>{j.get("type", "")}</td>
                    <td style='padding: 8px;'>{j.get("status", "")}</td>
                    <td style='padding: 8px;'>{j.get("created_at", "")}</td>
                </tr>
            """
    else:
        html += "<tr><td colspan='4' style='padding: 8px; text-align: center;'>No active/queued jobs.</td></tr>"
        
    html += """
            </tbody>
        </table>
        
        <h3>Completed Jobs (Recent 10)</h3>
        <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
            <thead>
                <tr style='border-bottom: 2px solid #45475a; text-align: left;'>
                    <th style='padding: 8px;'>ID</th>
                    <th style='padding: 8px;'>Type</th>
                    <th style='padding: 8px;'>Status</th>
                    <th style='padding: 8px;'>Result / Error</th>
                </tr>
            </thead>
            <tbody>
    """
    if completed_jobs_cache:
        for j in completed_jobs_cache:
            res_val = ""
            if j.get("status") == "completed":
                r = j.get("result", {}) or {}
                res_val = f"Added: {r.get('added', 0)}, Skipped: {r.get('skipped', 0)}"
            else:
                res_val = f"<span style='color: #f38ba8;'>{j.get('error_message', 'Failed')}</span>"
                
            html += f"""
                <tr style='border-bottom: 1px solid #313244;'>
                    <td style='padding: 8px; font-family: monospace;'>{j.get("id", "")}</td>
                    <td style='padding: 8px;'>{j.get("type", "")}</td>
                    <td style='padding: 8px;'>{j.get("status", "")}</td>
                    <td style='padding: 8px;'>{res_val}</td>
                </tr>
            """
    else:
        html += "<tr><td colspan='4' style='padding: 8px; text-align: center;'>No completed jobs.</td></tr>"
        
    html += """
            </tbody>
        </table>
    </div>
    """
    return html

def get_logs():
    return "\n".join(logs)

# Start Gradio App
with gr.Blocks(title="ApexReach Cloud Runner") as demo:
    gr.Markdown("# 🚀 ApexReach Lead Generation Cloud Runner")
    
    with gr.Tab("Dashboard"):
        dashboard = gr.HTML(value=get_dashboard_html)
        refresh_btn = gr.Button("Refresh Dashboard")
        refresh_btn.click(fn=get_dashboard_html, outputs=dashboard)
        
    with gr.Tab("Logs"):
        logs_view = gr.TextArea(value=get_logs, label="Console Logs", interactive=False)
        refresh_logs = gr.Button("Refresh Logs")
        refresh_logs.click(fn=get_logs, outputs=logs_view)

# Launch daemon threads
t1 = threading.Thread(target=heartbeat_loop, daemon=True)
t1.start()

t2 = threading.Thread(target=poller_loop, daemon=True)
t2.start()

demo.launch(server_name="0.0.0.0", server_port=7860)
