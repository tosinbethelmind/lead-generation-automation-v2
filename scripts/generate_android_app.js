/**
 * @file scripts/generate_android_app.js
 * 
 * Instant Android APK Project Generator for Nigerian Businesses
 * Turns ANY business website or client prototype into an installable Android App (.apk) in seconds.
 * 
 * Usage:
 *   node scripts/generate_android_app.js --name="Lekki Luxe Boutique" --url="https://lekkiluxe.com"
 *   node scripts/generate_android_app.js --name="Solar Pro" --url="https://bethelmindanalytics.com/preview/lead_123" --accent="#f59e0b"
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Helper to parse CLI arguments
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, ...rest] = arg.slice(2).split('=');
      args[key] = rest.join('=') || true;
    }
  });
  return args;
}

const args = parseArgs();
const appName = args.name || 'Sample Business App';
const targetUrl = args.url || 'https://www.bethelmindanalytics.com';
const iconPath = args.icon || null;
const primaryColor = args.primary || '#070b14';
const primaryDark = args.primaryDark || '#03050a';
const accentColor = args.accent || '#d4af37';
const backgroundColor = args.bg || '#070b14';

const slug = appName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 25);
const packageId = `com.bethelmind.app.${slug}`;
const outputDir = path.resolve(__dirname, `../android_apps/${slug}`);

console.log('============================================================');
console.log('🚀 BETHELMIND ANDROID APP (.APK) PROJECT GENERATOR');
console.log('============================================================');
console.log(`App Name:      "${appName}"`);
console.log(`Target URL:    ${targetUrl}`);
console.log(`Package ID:    ${packageId}`);
console.log(`Accent Color:  ${accentColor}`);
console.log(`Output Path:   ${outputDir}`);
console.log('============================================================\n');

// 1. Copy Template Directory Recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      let content = fs.readFileSync(srcPath);
      // If it's a text/code file, replace placeholders
      if (/\.(java|xml|gradle|html|json)$/i.test(entry.name)) {
        let str = content.toString('utf8');
        str = str.replace(/\{\{TARGET_URL\}\}/g, targetUrl);
        str = str.replace(/\{\{APP_NAME\}\}/g, appName);
        str = str.replace(/\{\{PACKAGE_ID\}\}/g, packageId);
        str = str.replace(/\{\{COLOR_PRIMARY\}\}/g, primaryColor);
        str = str.replace(/\{\{COLOR_PRIMARY_DARK\}\}/g, primaryDark);
        str = str.replace(/\{\{COLOR_ACCENT\}\}/g, accentColor);
        str = str.replace(/\{\{COLOR_BACKGROUND\}\}/g, backgroundColor);
        fs.writeFileSync(destPath, str, 'utf8');
      } else {
        fs.writeFileSync(destPath, content);
      }
    }
  }
}

const templateDir = path.resolve(__dirname, '../templates/android_webview');
if (!fs.existsSync(templateDir)) {
  console.error(`❌ Template directory not found at ${templateDir}`);
  process.exit(1);
}

console.log('1. Scaffolding Android Project Structure from Template...');
copyDirSync(templateDir, outputDir);
console.log('   ✔ Scaffolding complete.');

// 2. Generate Brand App Icons (192x192, 144x144, 96x96, 72x72, 48x48)
async function generateAppIcons() {
  console.log('\n2. Generating High-Definition Luxury App Icons...');

  const letter = (appName.trim()[0] || 'B').toUpperCase();
  const iconHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 512px;
      height: 512px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-badge {
      width: 480px;
      height: 480px;
      border-radius: 110px;
      background: radial-gradient(circle at 30% 30%, #1e293b 0%, #070b14 100%);
      border: 8px solid ${accentColor};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(212, 175, 55, 0.2);
      position: relative;
    }
    .letter {
      font-family: 'Playfair Display', serif;
      font-size: 270px;
      font-weight: 900;
      color: ${accentColor};
      text-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
      line-height: 1;
      margin-top: -10px;
    }
    .sub-dot {
      position: absolute;
      bottom: 40px;
      width: 24px;
      height: 24px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 15px #10b981;
    }
  </style>
</head>
<body>
  <div class="icon-badge">
    <div class="letter">${letter}</div>
    <div class="sub-dot"></div>
  </div>
</body>
</html>`;

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } });

  if (iconPath && fs.existsSync(iconPath)) {
    console.log(`   Using custom icon from: ${iconPath}`);
    // If custom image provided, load it
    const base64 = fs.readFileSync(iconPath).toString('base64');
    const mime = iconPath.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    await page.setContent(`<body style="margin:0;display:flex;align-items:center;justify-content:center;background:transparent;"><img src="data:${mime};base64,${base64}" style="width:512px;height:512px;object-fit:cover;border-radius:110px;"></body>`);
  } else {
    console.log(`   Auto-rendering 2D luxury emblem badge for "${letter}"...`);
    await page.setContent(iconHtml, { waitUntil: 'networkidle' });
  }

  const iconSizes = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 }
  ];

  const resBaseDir = path.join(outputDir, 'app/src/main/res');

  for (const { dir, size } of iconSizes) {
    const targetFolder = path.join(resBaseDir, dir);
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

    // Resize viewport and capture
    await page.setViewportSize({ width: size, height: size });
    await page.screenshot({
      path: path.join(targetFolder, 'ic_launcher.png'),
      omitBackground: true
    });
    // Also save round icon
    await page.screenshot({
      path: path.join(targetFolder, 'ic_launcher_round.png'),
      omitBackground: true
    });
    console.log(`   ✔ Generated ${dir}/ic_launcher.png (${size}x${size})`);
  }

  // Also save a large 512x512 preview icon in project root
  await page.setViewportSize({ width: 512, height: 512 });
  await page.screenshot({
    path: path.join(outputDir, 'app_icon_512.png'),
    omitBackground: true
  });
  console.log(`   ✔ Saved high-res 512x512 app icon at app_icon_512.png`);

  await browser.close();
}

// 3. Generate README and Build Instructions
function generateDocs() {
  const readmeContent = `# 📱 ${appName} — Official Android App (.apk) Project

**Generated by:** Bethelmind Digital Solutions (CAC Reg: 9912717)  
**Target URL:** [${targetUrl}](${targetUrl})  
**Package Identifier:** \`${packageId}\`  

---

## 🚀 How to Build the Standalone .APK File (3 Zero-Friction Methods)

### Method 1: 1-Click Free Cloud Build (GitHub Actions — 0MB Local Data Drain)
1. Push this project folder or repository to GitHub.
2. Trigger the \`.github/workflows/build_android_apk.yml\` action.
3. Download the compiled, signed \`app-release.apk\` directly from GitHub Artifacts in under 90 seconds!

### Method 2: Android Studio (Local One-Click Build)
1. Open **Android Studio**.
2. Select **Open an Existing Project** and choose this directory:
   \`${outputDir}\`
3. Click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Your \`${appName}.apk\` file will be ready in \`app/build/outputs/apk/debug/\`!

### Method 3: Command Line (Gradle)
If Gradle is installed on your server or PC:
\`\`\`bash
cd "${outputDir}"
./gradlew assembleDebug
\`\`\`
The APK will appear at: \`app/build/outputs/apk/debug/app-debug.apk\`.

---

## 💎 Features Built Into This App
* **Fullscreen Standalone View:** Zero browser tabs or address bars.
* **Instant WhatsApp Integration:** Clicking any WhatsApp link (\`wa.me\`) automatically opens the real WhatsApp app on the user's phone.
* **Nigerian Payment Intercept:** Seamlessly supports Paystack, Moniepoint, and OPay transfer redirects.
* **Offline Protection:** Automatically displays a sleek, branded *"Connection Interrupted - Tap to Reconnect"* screen if the network drops.
* **Receipt Upload Support:** Staff or customers can take photos or upload images from their gallery directly through the app.
`;

  fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent, 'utf8');
}

// Run the full sequence
(async () => {
  await generateAppIcons();
  generateDocs();

  console.log('\n============================================================');
  console.log('🎉 ANDROID APP PROJECT GENERATED SUCCESSFULLY!');
  console.log(`Directory: ${outputDir}`);
  console.log(`To inspect the project: open ${outputDir}`);
  console.log('============================================================\n');
})();
