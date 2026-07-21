// local_trigger.js
// Opens the Vercel live site and then starts the local job runner.
// Works on Windows by spawning the default browser via the `start` command.
const { spawn } = require('child_process');

(async () => {
  try {
    const vercelUrl = 'https://lead-generation-automation-e0oitxcsi.vercel.app';
    console.log(`Opening Vercel site: ${vercelUrl}`);
    // Use the Windows `start` command to open the URL in the default browser.
    spawn('cmd', ['/c', 'start', '', vercelUrl], { stdio: 'ignore', detached: true });
    console.log('Vercel site opened in default browser.');

    // Start the local runner (uses npm script "local-runner")
    console.log('Starting local runner...');
    const runner = spawn('npm', ['run', 'local-runner'], {
      stdio: 'inherit',
      shell: true
    });
    runner.on('close', code => {
      console.log(`Local runner exited with code ${code}`);
    });
  } catch (err) {
    console.error('Error in local_trigger:', err);
  }
})();
