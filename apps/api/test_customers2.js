import https from 'https';
const testEndpoint = async (path) => {
  return new Promise((resolve) => {
    https.get(`https://production-manager-api.onrender.com${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, data: data.slice(0, 100) }));
    }).on('error', (err) => resolve({ path, err: err.message }));
  });
};
async function main() {
  const paths = [
    '/v1/admin/customers',
    '/api/customers',
    '/v1/admin/omie/customers',
    '/api/catalog/customers'
  ];
  for (const path of paths) {
    console.log(await testEndpoint(path));
  }
}
main();
