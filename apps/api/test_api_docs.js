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
    '/api-docs', '/swagger', '/swagger-ui.html', '/docs', '/v1/api-docs', '/api/docs',
    '/api/swagger', '/v1/docs'
  ];
  for (const path of paths) {
    console.log(await testEndpoint(path));
  }
}
main();
