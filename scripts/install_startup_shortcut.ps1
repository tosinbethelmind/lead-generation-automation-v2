# Shortcut installer for Windows Startup
# Registers start_automation_on_boot.ps1 to execute silently on user logon.

$WshShell = New-Object -ComObject WScript.Shell
$ShortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\LeadGenAutomation.lnk"

try {
    $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = "powershell.exe"
    $Shortcut.Arguments = "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"c:\Users\HomePC\Desktop\website Projects\lead generation automation\scripts\start_automation_on_boot.ps1`""
    $Shortcut.WorkingDirectory = "c:\Users\HomePC\Desktop\website Projects\lead generation automation"
    $Shortcut.IconLocation = "powershell.exe,0"
    $Shortcut.Save()
    Write-Host "✅ Success: Created Windows startup shortcut at:"
    Write-Host "   $ShortcutPath"
} catch {
    Write-Error "❌ Failed to create Windows startup shortcut: $_"
    exit 1
}
