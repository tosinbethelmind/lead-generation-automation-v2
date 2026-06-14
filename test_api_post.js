async function test() {
  const url = 'http://localhost:3005/api/scrape/jiji';
  console.log('Sending POST request to:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://jiji.ng/lagos/cars',
        limit: 2
      })
    });
    console.log('API Response status:', res.status);
    const text = await res.text();
    console.log('API Response body:', text.substring(0, 1000));
  } catch (err) {
    console.error('Error contacting API:', err);
  }
}
test();
