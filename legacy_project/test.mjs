import axios from 'axios';

async function test() {
  try {
    const r1 = await axios.patch('http://0.0.0.0:3000/api/proxy/admin/sectors/70f227f0-8c1f-4627-87a8-b82658f7149a', { name: "Temperagem NOVO NOME" });
    console.log("PATCH 1:", r1.data);
    
    const r2 = await axios.get('http://0.0.0.0:3000/api/proxy/admin/sectors');
    console.log("GET ALL:", r2.data);
    
    const r3 = await axios.patch('http://0.0.0.0:3000/api/proxy/admin/sectors/70f227f0-8c1f-4627-87a8-b82658f7149a', { name: "Temperagem" });
    console.log("PATCH 2:", r3.data);
  } catch (err) {
    if (err.response) {
      console.log("Erro Resposta:", err.response.data);
    } else {
      console.log("Erro:", err);
    }
  }
}

test();
