import axios from 'axios';

async function run() {
  const targetUrl = `https://production-manager-api.onrender.com/v1/admin/sectors`;
  const response = await axios.get(targetUrl);
  console.log("Response Data:", JSON.stringify(response.data, null, 2));
}
run();
