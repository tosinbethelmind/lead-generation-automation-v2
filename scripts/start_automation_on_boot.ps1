# Lead Generation Automation Boot Handler
# Spawns services automatically with strict Memory-Safe (<=512MB) and Data-Saver protection.

$WorkDir = "c:\Users\HomePC\Desktop\website Projects\lead generation automation"

function Log-Msg($msg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] $msg"
    Add-Content -Path "$WorkDir\startup_log.txt" -Value $logLine
    Write-Host $logLine
}

Log-Msg "System startup detected. Performing pre-flight memory and resource safety check..."

# 0. Pre-flight Cleanup & Memory Check
try {
    # Terminate any orphaned node processes consuming excessive memory (>600MB) from past crashed sessions
    Get-CimInstance Win32_Process -Filter "name = 'node.exe'" -ErrorAction SilentlyContinue | Where-Object {
        $_.WS -gt 600MB -and $_.CommandLine -notlike "*antigravity*"
    } | ForEach-Object {
        Log-Msg "Terminating orphaned high-memory node process (PID $($_.ProcessId), WS: $($_.WS / 1MB) MB)"
        Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }
} catch {
    Log-Msg "Warning during pre-flight memory cleanup: $($_.Exception.Message)"
}

# 1. Loop until internet connection is available (using relaxed 20s backoff to save bandwidth)
$online = $false
$retryCount = 0
while (-not $online) {
    try {
        # Ping Google DNS (8.8.8.8) to check if we can reach the internet
        $ping = Test-Connection -ComputerName 8.8.8.8 -Count 1 -Quiet
        if ($ping) {
            $online = $true
            Log-Msg "Internet connection active!"
        } else {
            $retryCount++
            Log-Msg "Offline. Retrying connection check (Attempt $retryCount) in 20 seconds (Data-Saver mode)..."
            Start-Sleep -Seconds 20
        }
    } catch {
        $retryCount++
        Log-Msg "Network interface not ready. Retrying (Attempt $retryCount) in 20 seconds..."
        Start-Sleep -Seconds 20
    }
}

# 2. Launch automation stack in Silent Background Mode with BelowNormal CPU Priority
Log-Msg "Starting pipeline dev server and master autopilot in background..."
cd $WorkDir

$NodeExe = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $NodeExe) { $NodeExe = "node.exe" }
$NpmCmd = (Get-Command npm -ErrorAction SilentlyContinue).Source
if (-not $NpmCmd) { $NpmCmd = "npm.cmd" }

# Check if port 3006 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 3006 -ErrorAction SilentlyContinue
if ($portInUse) {
    Log-Msg "Port 3006 is already in use. Dev server is already running."
} else {
    # Start Next.js dev server with capped 384MB memory in hidden background window
    $devProc = Start-Process -FilePath $NodeExe -ArgumentList "--max-old-space-size=384", "node_modules\next\dist\bin\next", "dev", "-p", "3006" -WorkingDirectory $WorkDir -WindowStyle Hidden -PassThru
    try { $devProc.PriorityClass = 'BelowNormal' } catch {}
    Log-Msg "Dev server launched in silent background mode on port 3006 (RAM capped at 384MB, CPU: BelowNormal)."
    Start-Sleep -Seconds 4
}

# Check if master autopilot is already running
$autopilotRunning = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*unified_master_autopilot*"
}

if ($autopilotRunning) {
    Log-Msg "Unified Master Autopilot is already running. Skipping duplicate launch."
} else {
    # Launch Master Autopilot using detached rock-solid Node launcher
    & $NodeExe "$WorkDir\scripts\launch_background_autopilot.js"
    Log-Msg "Unified Master Autopilot launched via detached background launcher (RAM capped <= 384MB, CPU: BelowNormal)."
}

Log-Msg "Bethelmind Analytics Autopilot stack started successfully with strict Anti-Crash and Data-Saver protection active."
