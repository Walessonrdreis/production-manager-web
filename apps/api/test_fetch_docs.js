import https from 'https';
const baseUrl = process.env.API1_BASE_URL || 'https://production-manager-api.onrender.com';
https.get(`${baseUrl}/docs`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
