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
    Log-Msg "Port 3006 is already in use. Automation stack is likely already running."
    exit 0
}

# Run the concurrent services and log outputs
npm run start-all >> "$WorkDir\services_output.log" 2>&1
