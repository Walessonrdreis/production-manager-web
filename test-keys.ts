import axios from 'axios';

async function run() {
  const targetUrl = `https://production-manager-api.onrender.com/v1/admin/orders/stage20/enriched`;
  const response = await axios.get(targetUrl, { params: { page: 1, pageSize: 1 }});
  
  const d = response.data?.data?.[0] || response.data?.orders?.[0] || response.data?.[0];
  console.log("Root Keys:", Object.keys(d));
  console.log(JSON.stringify(d, null, 2));
}
run();
