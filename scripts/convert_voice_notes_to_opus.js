const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

console.log('Using ffmpeg binary:', ffmpegPath);

const audioDir = path.join(__dirname, '../public/assets/audio');
const files = fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'));

console.log(`Found ${files.length} MP3 files to convert to native WhatsApp Opus OGG...`);

for (const file of files) {
  const mp3Path = path.join(audioDir, file);
  const oggPath = path.join(audioDir, file.replace(/\.mp3$/, '.ogg'));
  
  // Convert MP3 to WhatsApp compliant Opus audio inside OGG container
  // Settings: -c:a libopus -b:a 32k -vbr on -compression_level 10 -application voip -ar 48000 -ac 1
  const cmd = `"${ffmpegPath}" -y -i "${mp3Path}" -c:a libopus -b:a 32k -vbr on -ar 48000 -ac 1 "${oggPath}"`;
  
  try {
    execSync(cmd, { stdio: 'pipe' });
    const size = Math.round(fs.statSync(oggPath).size / 1024);
    console.log(`✅ Converted ${file} -> ${path.basename(oggPath)} (${size} KB Opus OGG)`);
  } catch (err) {
    console.error(`❌ Failed to convert ${file}:`, err.message);
  }
}

console.log('\n🎉 ALL AUDIO FILES CONVERTED TO NATIVE WHATSAPP OPUS FORMAT!');
