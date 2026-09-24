const { execSync } = require('child_process');

try {
  const output = execSync('wmic process where "name=\'node.exe\'" get ProcessId,CommandLine,WorkingSetSize /format:csv', { encoding: 'utf-8' });
  const lines = output.trim().split('\n').filter(l => l.trim().length > 0);
  console.log(`Total node processes: ${lines.length - 1}`);
  lines.slice(1).forEach(line => {
    const parts = line.split(',');
    if (parts.length >= 4) {
      const pid = parts[parts.length - 2];
      const ws = Math.round(parseInt(parts[parts.length - 1], 10) / (1024 * 1024));
      const cmd = parts.slice(1, parts.length - 2).join(',').slice(0, 100);
      console.log(`[PID ${pid}] ${ws}MB -> ${cmd}`);
    }
  });
} catch (err) {
  console.error('Error querying processes:', err.message);
}
