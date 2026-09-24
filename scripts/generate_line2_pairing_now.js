/**
 * Dedicated Runner for WhatsApp Line 2 (0702 626 6946)
 * Proxies seamlessly to the Unified 7-Line WhatsApp Command Center on Port 8080.
 */
const express = require('express');
const app = express();
const PORT = 5007;

app.get('*', (req, res) => {
  res.redirect('http://localhost:8080/pair/2');
});

app.listen(PORT, () => {
  console.log(`\n========================================================================`);
  console.log(`🌐 OUTREACH LINE 2 GATEWAY ACTIVE AT: http://localhost:${PORT}`);
  console.log(`👉 Directly access live pairing room: http://localhost:8080/pair/2`);
  console.log(`========================================================================\n`);
});
