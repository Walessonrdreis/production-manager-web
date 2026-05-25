import https from 'https';
https.get('https://production-manager-api.onrender.com/v1/admin/orders/stage20?page=1&pageSize=5', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(res.statusCode, data.slice(0, 200)));
});
