/**
 * Dedicated Runner for WhatsApp Line 3 (0904 605 0469)
 * Proxies seamlessly to the Unified 7-Line WhatsApp Command Center on Port 8080.
 */
const express = require('express');
const app = express();
const PORT = 5008;

app.get('*', (req, res) => {
  res.redirect('http://localhost:8080/pair/3');
});

app.listen(PORT, () => {
  console.log(`\n========================================================================`);
  console.log(`🌐 OUTREACH LINE 3 GATEWAY ACTIVE AT: http://localhost:${PORT}`);
  console.log(`👉 Directly access live pairing room: http://localhost:8080/pair/3`);
  console.log(`========================================================================\n`);
});
