const { Client } = require('ssh2');

const c = new Client();
c.on('ready', () => {
  c.exec('curl -i -X POST http://127.0.0.1:8080/send -H "Content-Type: application/json" -H "apikey: evolution_bethelmind_secret_2026" -d \'{"phone":"2348022791227","message":"test","isColdOutreach":false,"lineId":1}\'', (err, stream) => {
    let out = '';
    stream.on('data', d => out += d);
    stream.on('close', () => {
      console.log('--- CURL RESULT ---:\n', out);
      c.end();
    });
  });
}).connect({ host: '169.58.182.92', port: 22, username: 'root', password: 'bethelmind2026', readyTimeout: 30000 });
