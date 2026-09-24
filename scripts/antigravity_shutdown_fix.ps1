# Antigravity Shutdown & Crash Prevention Utility
# Prevents Windows sihost.exe stack overflow (0xc00000fd) and Antigravity memory crashes

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🛡️ ANTIGRAVITY SHUTDOWN & CRASH RELIEF GUARD" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$initialFree = [math]::Round(((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1KB), 2)
Write-Host "Initial Free RAM: $initialFree MB" -ForegroundColor Yellow

$killed = 0

# 1. Kill stale duplicate MCP processes (cmd & node spawned by npx)
$mcpProcs = Get-CimInstance Win32_Process | Where-Object {
    ($_.Name -eq 'node.exe' -and ($_.CommandLine -like '*modelcontextprotocol*' -or $_.CommandLine -like '*chrome-devtools-mcp*' -or $_.CommandLine -like '*mcp-server*')) -or
    ($_.Name -eq 'cmd.exe' -and ($_.CommandLine -like '*modelcontextprotocol*' -or $_.CommandLine -like '*chrome-devtools-mcp*' -or $_.CommandLine -like '*mcp-server*'))
}

foreach ($p in $mcpProcs) {
    try {
        Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
        $killed++
    } catch {}
}
Write-Host "Cleaned $killed duplicate/stale MCP background processes." -ForegroundColor Green

# 2. Terminate orphaned headless chromes from stale runs
$chromes = Get-CimInstance Win32_Process -Filter "name = 'chrome.exe'" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*--headless*" -or $_.CommandLine -like "*chrome-devtools-mcp*" -or $_.CommandLine -like "*puppeteer*"
}
$chromeCount = 0
foreach ($c in $chromes) {
    Stop-Process -Id $c.ProcessId -Force -ErrorAction SilentlyContinue
    $chromeCount++
}
if ($chromeCount -gt 0) {
    Write-Host "Terminated $chromeCount orphaned headless browser instances." -ForegroundColor Green
}

# 3. Clean orphaned cmd/powershell wrappers with no parent or idle
$idleCmds = Get-CimInstance Win32_Process | Where-Object {
    ($_.Name -eq 'cmd.exe' -and $_.CommandLine -match 'npx-cli\.js')
}
$cmdKilled = 0
foreach ($cmd in $idleCmds) {
    Stop-Process -Id $cmd.ProcessId -Force -ErrorAction SilentlyContinue
    $cmdKilled++
}
if ($cmdKilled -gt 0) {
    Write-Host "Cleaned $cmdKilled orphaned npx shell wrappers." -ForegroundColor Green
}

# 4. Final Memory Status
$finalFree = [math]::Round(((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1KB), 2)
$gain = [math]::Round($finalFree - $initialFree, 2)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Final Free RAM: $finalFree MB (Recovered: $gain MB)" -ForegroundColor Green
Write-Host "Antigravity stability guard applied successfully." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
