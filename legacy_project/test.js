import axios from 'axios';

async function test() {
  const r = await axios.get('http://0.0.0.0:3000/api/proxy/admin/sectors');
  console.log(JSON.stringify(r.data, null, 2));
}

test();
