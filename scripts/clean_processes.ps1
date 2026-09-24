# Clean up runaway Node.js workers to protect laptop CPU and RAM
$myPid = $PID
$processes = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -or $_.Name -eq 'python.exe' }

$killed = 0
foreach ($p in $processes) {
    if ($p.ProcessId -eq $myPid) { continue }
    $cmd = $p.CommandLine
    if (-not $cmd) { continue }
    
    # Identify background heavy workers, loops, and runaway scrapers
    if ($cmd -match 'keep_alive' -or 
        $cmd -match 'local_job_runner' -or 
        $cmd -match 'master_247' -or 
        $cmd -match 'harvester' -or 
        $cmd -match 'scraper' -or 
        $cmd -match 'traffic_daemon' -or 
        $cmd -match 'autopilot' -or
        $cmd -match 'social_inbox') {
        
        Write-Host "Terminating runaway worker PID $($p.ProcessId)..."
        Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
        $killed++
    }
}

Write-Host "Done! Successfully terminated $killed runaway background processes."
