/**
 * @file scripts/lib/logger.js
 * 
 * 📜 Lightweight CommonJS Structured Logger for Node.js daemons and scrapers
 */

function formatLog(level, event, message, metadata) {
  const ts = new Date().toISOString();
  const metaStr = metadata ? ` | ${JSON.stringify(metadata)}` : '';
  return `[${ts}] [${level.toUpperCase()}] [${event}] ${message}${metaStr}`;
}

const logger = {
  info: (event, msg, meta) => console.log(formatLog('info', event, msg, meta)),
  warn: (event, msg, meta) => console.warn(formatLog('warn', event, msg, meta)),
  error: (event, msg, meta) => console.error(formatLog('error', event, msg, meta)),
  debug: (event, msg, meta) => console.debug(formatLog('debug', event, msg, meta)),
  
  trackLead: (name, category, channel) => logger.info('LEAD_INGESTED', `Lead discovered: ${name}`, { category, channel }),
  trackOutreach: (channel, recipient, status) => logger.info('OUTREACH_DISPATCH', `Dispatched via ${channel} to ${recipient}`, { status }),
  trackError: (moduleName, err) => logger.error('SYSTEM_ERROR', `Error in ${moduleName}: ${err.message || err}`, { stack: err.stack })
};

module.exports = logger;
