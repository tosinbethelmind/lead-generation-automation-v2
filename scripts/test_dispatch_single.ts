import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { multiSmtpPooler } from '../src/lib/email/multiSmtpPooler';

async function main() {
  console.log('Testing multiSmtpPooler.dispatch...');
  try {
    const res = await multiSmtpPooler.dispatch({
      email: 'bethelmindrecruit@gmail.com',
      name: 'Admin Desk',
      business_name: 'Bethelmind Digital Solutions',
      category: 'solar',
      area: 'Lagos'
    });
    console.log('Dispatch result:', res);
  } catch (err: any) {
    console.error('Dispatch threw error:', err);
  }
  process.exit(0);
}

main();
