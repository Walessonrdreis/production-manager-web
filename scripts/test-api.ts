import axios from 'axios';

async function test(url: string) {
  try {
    const res = await axios.get(url, { timeout: 10000 });
    console.log(`[${url}] Success! Status: ${res.status}`);
  } catch(e) {
    if (e.response) {
      console.log(`[${url}] Error Status: ${e.response.status}`);
    } else {
      console.log(`[${url}] Exception: ${e.message}`);
    }
  }
}

async function run() {
  await test('https://production-manager-api.onrender.com/v1/clients');
  await test('https://production-manager-api.onrender.com/v1/sectors');
  await test('https://production-manager-api.onrender.com/v1/dashboard/produced');
  await test('https://production-manager-api.onrender.com/v1/admin/orders/stage20/totals');
}
run();
