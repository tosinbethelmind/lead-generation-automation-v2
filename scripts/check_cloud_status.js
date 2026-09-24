async function checkHF() {
  const hfToken = process.env.HF_TOKEN || '';
  try {
    const res = await fetch('https://huggingface.co/api/spaces/tosinbethelmind/bethelmind-lead-engine', {
      headers: { Authorization: `Bearer ${hfToken}` }
    });
    const data = await res.json();
    console.log('Hugging Face Space Runtime:', data.runtime?.stage || data.message || 'Unknown');
  } catch (err) {
    console.error('HF Check Error:', err.message);
  }
}

checkHF();
