import axios from 'axios';

async function run() {
  const targetUrl = `https://production-manager-api.onrender.com/v1/admin/orders/stage20/enriched`;
  const response = await axios.get(targetUrl, { params: { page: 1, pageSize: 1 }});
  console.log("Response Data Keys:", Object.keys(response.data || {}));
  console.log("Array length:", response.data?.data?.length || response.data?.orders?.length || response.data?.length);
  if (response.data?.data?.length > 0) {
    const d = response.data.data[0];
    console.log("First Order Keys:", Object.keys(d));
    if (d.customer) console.log("Customer keys:", Object.keys(d.customer));
    if (d.client) console.log("Client keys:", Object.keys(d.client));
    console.log("tradeName inside customer?", d.customer?.tradeName);
    console.log("tradeName inside client?", d.client?.tradeName);
    console.log("tradeName root?", d.tradeName);
  }
}
run();
