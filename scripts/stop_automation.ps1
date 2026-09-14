# Stop all Bethelmind 24/7 background automation processes cleanly

$WorkDir = "c:\Users\HomePC\Desktop\website Projects\lead generation automation"
Write-Host "Stopping all Bethelmind automation background workers..." -ForegroundColor Yellow

$procs = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*$WorkDir*" -or $_.CommandLine -like "*unified_master_autopilot*"
}

$count = 0
foreach ($p in $procs) {
    Write-Host "Stopping process [PID $($p.ProcessId)]: $($p.CommandLine.Substring(0, [Math]::Min(80, $p.CommandLine.Length)))..." -ForegroundColor Gray
    Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
    $count++
}

Write-Host "Stopped $count Bethelmind background worker(s). Ports cleared." -ForegroundColor Green
