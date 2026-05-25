import https from 'https';
const baseUrl = process.env.API1_BASE_URL || 'https://production-manager-api.onrender.com';
const testEndpoint = async (path) => {
  return new Promise((resolve) => {
    https.get(`${baseUrl}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, data: data.slice(0,100) }));
    }).on('error', (err) => resolve({ path, err: err.message }));
  });
};
async function main() {
  const paths = [
    '/v1/admin/clientes', '/v1/clientes', '/api/clientes',
    '/v1/catalog/clientes', '/v1/catalog/clients', '/v1/catalog/customers',
    '/admin/clients', '/admin/clientes',
    '/v1/admin/catalog/clients', '/v1/admin/catalog/clientes',
    '/v1/customers'
  ];
  for (const path of paths) {
    console.log(await testEndpoint(path));
  }
}
main();
