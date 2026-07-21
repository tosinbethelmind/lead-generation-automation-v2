# Lead Generation Automation Boot Handler
# Spawns services automatically and ensures a stable internet connection before running.

$WorkDir = "c:\Users\HomePC\Desktop\website Projects\lead generation automation"

function Log-Msg($msg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] $msg"
    Add-Content -Path "$WorkDir\startup_log.txt" -Value $logLine
    Write-Host $logLine
}

Log-Msg "System startup detected. Initiating connection check..."

# 1. Loop until internet connection is available
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
            Log-Msg "Offline. Retrying connection check (Attempt $retryCount) in 5 seconds..."
            Start-Sleep -Seconds 5
        }
    } catch {
        $retryCount++
        Log-Msg "Network interface not ready. Retrying (Attempt $retryCount) in 5 seconds..."
        Start-Sleep -Seconds 5
    }
}

# 2. Launch automation stack
Log-Msg "Starting pipeline dev server and local queue runner..."
cd $WorkDir

# Check if process is already running to prevent duplicate spawns
$portInUse = Get-NetTCPConnection -LocalPort 3006 -ErrorAction SilentlyContinue
if ($portInUse) {
    Log-Msg "Port 3006 is already in use. Dev server is already running."
} else {
    # Start Next.js dev server in a minimized window
    Start-Process -FilePath "cmd.exe" -ArgumentList "/k title ApexReach-DevServer && npm run dev" -WorkingDirectory $WorkDir -WindowStyle Minimized
    Log-Msg "Dev server launched on port 3006."
    Start-Sleep -Seconds 8
}

# Check if local runner is already running (look for keep_alive_runner in node processes)
$runnerRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*keep_alive_runner*"
}

if ($runnerRunning) {
    Log-Msg "Local runner is already running. Skipping duplicate launch."
} else {
    # Start local job runner in a separate minimized window
    Start-Process -FilePath "cmd.exe" -ArgumentList "/k title ApexReach-LocalRunner && node scripts/keep_alive_runner.js" -WorkingDirectory $WorkDir -WindowStyle Minimized
    Log-Msg "Local job runner launched."
}

Log-Msg "ApexReach stack started successfully. Dev server: port 3006. Runner: active."
