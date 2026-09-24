import axios from 'axios';

async function test() {
  const url = 'http://192.168.0.153:8082';
  try {
    const res = await axios.get(url, { timeout: 2000 });
    console.log('GATEWAY ROOT RES:', res.status, typeof res.data === 'string' ? res.data.slice(0, 100) : res.data);
  } catch (e: any) {
    console.log('GET ERROR:', e.message);
  }

  try {
    const resPost = await axios.post(`${url}/message`, {
      to: '+2348022791227',
      message: 'Test ping from Bethelmind'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'f34af5ea-f657-41b1-b83e-4a59eb786e57'
      },
      timeout: 3000
    });
    console.log('POST /message RES:', resPost.status, resPost.data);
  } catch (e: any) {
    console.log('POST ERROR:', e.response ? { status: e.response.status, data: e.response.data } : e.message);
  }
}

test().catch(console.error);
