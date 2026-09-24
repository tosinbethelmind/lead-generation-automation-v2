$killed = 0
Get-CimInstance Win32_Process | Where-Object { 
    ($_.Name -eq 'node.exe' -and ($_.CommandLine -like '*modelcontextprotocol*' -or $_.CommandLine -like '*chrome-devtools-mcp*')) -or
    ($_.Name -eq 'cmd.exe' -and ($_.CommandLine -like '*modelcontextprotocol*' -or $_.CommandLine -like '*chrome-devtools-mcp*'))
} | ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    $killed++
}
Write-Host "Killed $killed duplicate MCP processes."
$freeMB = [math]::Round(((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1KB), 2)
Write-Host "Current Free Physical RAM: $freeMB MB"
