import axios from 'axios';

async function check() {
  const url = 'https://www.bethelmindanalytics.com/_next/static/chunks/2m1ppfe34xi_w.css';
  const res = await axios.get(url);
  console.log('CSS length:', res.data.length);
  console.log('Has .bg-slate:', res.data.includes('bg-slate'));
  console.log('Has .flex:', res.data.includes('.flex'));
  console.log('Has .grid:', res.data.includes('.grid'));
  console.log('Sample start:', res.data.slice(0, 300));
}

check().catch(console.error);
