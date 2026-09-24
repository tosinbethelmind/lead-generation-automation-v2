const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const binDir = path.join(process.cwd(), 'bin');
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

const katanaExePath = path.join(binDir, 'katana.exe');
if (fs.existsSync(katanaExePath)) {
  console.log('✅ katana.exe already exists at:', katanaExePath);
  process.exit(0);
}

const zipPath = path.join(binDir, 'katana.zip');
const url = 'https://github.com/projectdiscovery/katana/releases/download/v1.7.0/katana_1.7.0_windows_amd64.zip';

console.log('⬇️ Downloading Katana Windows binary from:', url);

function download(url, dest, cb) {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    if (response.statusCode === 302 || response.statusCode === 301) {
      file.close();
      fs.unlinkSync(dest);
      return download(response.headers.location, dest, cb);
    }
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  }).on('error', (err) => {
    fs.unlinkSync(dest);
    cb(err);
  });
}

download(url, zipPath, (err) => {
  if (err) {
    console.error('❌ Download error:', err.message);
    process.exit(1);
  }
  console.log('📦 Katana zip downloaded. Extracting via tar/powershell...');
  try {
    // Windows 10/11 built-in tar can extract zips directly!
    execSync(`tar -xf "${zipPath}" -C "${binDir}"`, { stdio: 'inherit' });
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    console.log('🎉 Extracted katana successfully!');
    if (fs.existsSync(katanaExePath)) {
      console.log('✅ Verified katana.exe exists at:', katanaExePath);
    }
  } catch (tarErr) {
    console.log('Tar failed, using powershell Expand-Archive...');
    execSync(`powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${binDir}' -Force"`, { stdio: 'inherit' });
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  }
});
