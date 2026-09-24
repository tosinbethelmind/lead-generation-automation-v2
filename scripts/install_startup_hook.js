const fs = require('fs');
const path = require('path');

const startupDir = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');

const vbsContent = [
  'Set WshShell = CreateObject("WScript.Shell")',
  'WshShell.CurrentDirectory = "c:\\Users\\HomePC\\Desktop\\website Projects\\lead generation automation"',
  'WshShell.Run "powershell.exe -ExecutionPolicy Bypass -File ""c:\\Users\\HomePC\\Desktop\\website Projects\\lead generation automation\\scripts\\start_automation_on_boot.ps1""", 0, False'
].join('\r\n') + '\r\n';

const targetFile = path.join(startupDir, 'Bethelmind_LeadGen_247_AutoStart.vbs');
fs.writeFileSync(targetFile, vbsContent, 'utf8');
console.log('✅ Bethelmind 24/7 AutoStart hook successfully installed at:');
console.log('  ', targetFile);
