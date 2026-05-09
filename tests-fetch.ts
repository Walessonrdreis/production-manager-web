import axios from 'axios';

async function run() {
  const targetUrl = `https://production-manager-api.onrender.com/v1/admin/orders/stage20/enriched`;
  const response = await axios.get(targetUrl, { params: { page: 1, pageSize: 2 }});
  console.log(JSON.stringify(response.data?.data?.slice?.(0, 2) || response.data?.orders?.slice?.(0, 2) || response.data?.slice?.(0, 2) || response.data, null, 2));
}
run();
