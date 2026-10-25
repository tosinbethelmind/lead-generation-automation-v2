import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import axios from 'axios';

async function checkBrevo() {
  const raw = process.env.BREVO_API_KEYS || process.env.BREVO_API_KEY || '';
  const keys = raw.split(',').map((k: string) => k.trim()).filter(Boolean);
  console.log('Total Brevo keys configured:', keys.length);

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    try {
      const res = await axios.get('https://api.brevo.com/v3/account', {
        headers: { 'api-key': k },
        timeout: 10000
      });
      console.log(`Key #${i + 1}: ${res.data.email} | Credits:`, JSON.stringify(res.data.plan));
    } catch (e: any) {
      console.log(`Key #${i + 1} error:`, e.response?.status, e.response?.data || e.message);
    }
  }
}

checkBrevo().catch(console.error);
