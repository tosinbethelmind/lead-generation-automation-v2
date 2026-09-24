async function run() {
  const apiKey = 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
  try {
    const res = await fetch(`https://api.ng.termii.com/api/sender-id?api_key=${apiKey}`);
    const data = await res.json();
    console.log('Termii Senders:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
run();
