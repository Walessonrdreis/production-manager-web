import { externalClient } from '../apps/api/src/shared/integrations/external/external.client.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const targetUrl = 'https://production-manager-api.onrender.com/v1/products';
  const firstResponse = await externalClient.get(targetUrl, { params: { page: 1 } });
  const { data: firstPageData, meta } = firstResponse.data;
  console.log('Metadados:', meta);

  let allProducts = [...(firstPageData || [])];

  if (meta && meta.pageSize > 0 && meta.total > meta.pageSize) {
    const totalPages = Math.ceil(meta.total / meta.pageSize);
    const pageRequests = [];

    // Chunks de 5 requisições por vez para evitar overload:
    for (let i = 2; i <= totalPages; i += 5) {
      const chunk = [];
      for (let j = i; j < i + 5 && j <= totalPages; j++) {
        chunk.push(externalClient.get(targetUrl, { params: { page: j } }));
      }
      const responses = await Promise.all(chunk);
      for (const res of responses) {
        if (res.data && res.data.data) {
          allProducts = [...allProducts, ...res.data.data];
        }
      }
      console.log(`Buscadas páginas ${i} a ${Math.min(i+4, totalPages)}... Total = ${allProducts.length}`);
    }
  }
  console.log('Total recebido:', allProducts.length);
}
run();
