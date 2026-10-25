import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import axios from 'axios';

async function checkSenders() {
  const raw = process.env.BREVO_API_KEYS || process.env.BREVO_API_KEY || '';
  const keys = raw.split(',').map((k: string) => k.trim()).filter(Boolean);

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    try {
      const res = await axios.get('https://api.brevo.com/v3/senders', {
        headers: { 'api-key': k },
        timeout: 10000
      });
      console.log(`Key #${i + 1} Senders:`, res.data.senders?.map((s: any) => ({ email: s.email, active: s.active })));
    } catch (e: any) {
      console.log(`Key #${i + 1} senders error:`, e.response?.status, e.response?.data || e.message);
    }
  }
}

checkSenders().catch(console.error);
