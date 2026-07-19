const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawn, execSync } = require('child_process');

const TOR_VERSION = '15.0.18';
const TOR_URL = `https://archive.torproject.org/tor-package-archive/torbrowser/${TOR_VERSION}/tor-expert-bundle-windows-x86_64-${TOR_VERSION}.tar.gz`;
const TOOLS_DIR = path.resolve(__dirname, '../tools');
const TOR_DIR = path.join(TOOLS_DIR, 'tor');
const DOWNLOAD_PATH = path.join(TOOLS_DIR, `tor-expert-bundle.tar.gz`);

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading Tor from: ${url}`);
    console.log(`Saving to: ${destPath}`);
    
    const file = fs.createWriteStream(destPath);
    
    function makeRequest(requestUrl) {
      https.get(requestUrl, (response) => {
        // Handle redirect
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          console.log(`Redirect encountered. Following to: ${redirectUrl}`);
          makeRequest(redirectUrl);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download Tor. Status code: ${response.statusCode}`));
          return;
        }

        const contentLength = parseInt(response.headers['content-length'], 10);
        console.log(`Content-Length: ${contentLength} bytes`);
        
        let downloadedBytes = 0;
        response.on('data', (chunk) => {
          downloadedBytes += chunk.length;
        });

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          if (contentLength && downloadedBytes !== contentLength) {
            fs.unlink(destPath, () => {});
            reject(new Error(`Download truncated: expected ${contentLength} bytes but got ${downloadedBytes}`));
          } else {
            console.log('Download complete.');
            resolve();
          }
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }

    makeRequest(url);
  });
}

function extractTarGz(tarPath, targetDir) {
  console.log(`Extracting ${tarPath} to ${targetDir}...`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Windows 10/11 has native 'tar.exe'
  try {
    execSync(`tar -xzf "${tarPath}" -C "${targetDir}"`, { stdio: 'inherit' });
    console.log('Extraction complete.');
  } catch (err) {
    console.error('Failed to extract via tar command:', err.message);
    console.log('Attempting extract using PowerShell fallback...');
    // Fallback: PowerShell Expand-Archive (requires .zip, but tar command should work)
    throw new Error('Please ensure Command Prompt / PowerShell has "tar" utility available (built-in on Windows 10/11).');
  }
}

function configureTor(torDir) {
  console.log('Creating torrc configuration file...');
  const torrcContent = `SocksPort 9050
ControlPort 9051
CookieAuthentication 0
`;
  const torrcPath = path.join(torDir, 'torrc');
  fs.writeFileSync(torrcPath, torrcContent, 'utf8');
  console.log(`torrc created at: ${torrcPath}`);
  return torrcPath;
}

function findTorExecutable(torDir) {
  const possiblePaths = [
    path.join(torDir, 'tor.exe'),
    path.join(torDir, 'tor', 'tor.exe'),
    path.join(torDir, 'tor-expert-bundle', 'tor.exe'),
    path.join(torDir, 'tor-expert-bundle', 'tor', 'tor.exe')
  ];

  // Also do a quick recursive files scan if not found in standard paths
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log(`Found Tor executable at: ${p}`);
      return p;
    }
  }

  // Fallback scan
  console.log('Scanning directories for tor.exe...');
  const scanDir = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        const found = scanDir(fullPath);
        if (found) return found;
      } else if (file === 'tor.exe') {
        return fullPath;
      }
    }
    return null;
  };
  
  const found = scanDir(torDir);
  if (found) {
    console.log(`Found Tor executable at scan location: ${found}`);
    return found;
  }
  
  throw new Error('Could not find tor.exe in the extracted folder.');
}

async function isTorRunning() {
  return new Promise((resolve) => {
    const net = require('net');
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.connect(9050, '127.0.0.1', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function main() {
  try {
    if (!fs.existsSync(TOOLS_DIR)) {
      fs.mkdirSync(TOOLS_DIR, { recursive: true });
    }

    const running = await isTorRunning();
    if (running) {
      console.log('✅ Tor is already running on port 9050!');
      return;
    }

    if (fs.existsSync(DOWNLOAD_PATH)) {
      const stats = fs.statSync(DOWNLOAD_PATH);
      if (stats.size < 2 * 1024 * 1024) { // Less than 2MB is probably a 404 page
        console.log('Existing archive is suspiciously small (<2MB). Deleting and redownloading...');
        fs.unlinkSync(DOWNLOAD_PATH);
      }
    }

    if (!fs.existsSync(DOWNLOAD_PATH)) {
      await downloadFile(TOR_URL, DOWNLOAD_PATH);
    } else {
      console.log('Tor archive already downloaded. Skipping fetch.');
    }

    // Always clear target extractor folder if executable missing
    let hasTor = false;
    try {
      if (fs.existsSync(TOR_DIR)) {
        findTorExecutable(TOR_DIR);
        hasTor = true;
      }
    } catch (e) {}

    if (!hasTor) {
      console.log('Tor executable missing. Cleaning target directory and extracting...');
      if (fs.existsSync(TOR_DIR)) {
        fs.rmSync(TOR_DIR, { recursive: true, force: true });
      }
      extractTarGz(DOWNLOAD_PATH, TOR_DIR);
    } else {
      console.log('Tor already extracted. Skipping extraction.');
    }

    const torExe = findTorExecutable(TOR_DIR);
    const torrcPath = configureTor(TOR_DIR);

    console.log('Starting Tor daemon in the background...');
    const logFile = fs.openSync(path.join(TOR_DIR, 'tor.log'), 'w');
    const torProcess = spawn(torExe, ['-f', torrcPath], {
      detached: true,
      stdio: ['ignore', logFile, logFile]
    });
    
    torProcess.unref();
    console.log('Tor daemon started. Waiting to verify interface...');
    
    // Poll port 9050 for 10 seconds to confirm startup success
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (await isTorRunning()) {
        console.log('🚀 Tor started successfully in the background and is listening on socks5://127.0.0.1:9050!');
        return;
      }
    }
    
    console.error('❌ Timeout: Tor process spawned but is not listening on port 9050. Check logs at: tools/tor/tor.log');
  } catch (err) {
    console.error('❌ Error setting up Tor:', err.message);
  }
}

main();
