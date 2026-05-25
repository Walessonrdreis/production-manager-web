import https from 'https';
const baseUrl = process.env.API1_BASE_URL || 'https://production-manager-api.onrender.com';
const testEndpoint = async (path) => {
  return new Promise((resolve) => {
    https.get(`${baseUrl}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, data: data.slice(0, 100) }));
    }).on('error', (err) => resolve({ path, err: err.message }));
  });
};
async function main() {
  const paths = [
    '/v1/admin/omie/clientes',
    '/v1/admin/omie/clients',
    '/v1/admin/omie/customers',
    '/v1/admin/omie/cliente',
    '/v1/admin/omie/client',
    '/v1/admin/omie/customer'
  ];
  for (const path of paths) {
    console.log(await testEndpoint(path));
  }
}
main();
