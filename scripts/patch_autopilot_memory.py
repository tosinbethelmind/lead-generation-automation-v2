import os

filePath = 'scripts/unified_master_autopilot.js'
with open(filePath, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace 128MB with 256MB in safeEnv
c = c.replace("NODE_OPTIONS: '--max-old-space-size=128'", "NODE_OPTIONS: '--max-old-space-size=256'")

# Set 512MB for Worker 6
old_w6 = "outreachProcess = spawn('node', ['--max-old-space-size=256', tsxCli, 'scripts/execute_today_300_emails_and_webforms.ts'], {\n    cwd: rootDir,\n    shell: false,\n    stdio: 'inherit',\n    windowsHide: true,\n    env: safeEnv\n  });"
new_w6 = "outreachProcess = spawn('node', ['--max-old-space-size=512', tsxCli, 'scripts/execute_today_300_emails_and_webforms.ts'], {\n    cwd: rootDir,\n    shell: false,\n    stdio: 'inherit',\n    windowsHide: true,\n    env: { ...safeEnv, NODE_OPTIONS: '--max-old-space-size=512' }\n  });"

if old_w6 in c:
    c = c.replace(old_w6, new_w6)
    print("Replaced Worker 6 block successfully")
else:
    # try crlf
    old_w6_crlf = old_w6.replace("\n", "\r\n")
    new_w6_crlf = new_w6.replace("\n", "\r\n")
    if old_w6_crlf in c:
        c = c.replace(old_w6_crlf, new_w6_crlf)
        print("Replaced Worker 6 block (CRLF) successfully")
    else:
        print("Warning: Worker 6 block exact match not found, checking alternatives...")

with open(filePath, 'w', encoding='utf-8') as f:
    f.write(c)

print("Patching complete.")
