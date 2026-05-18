import fs from 'fs';
import path from 'path';

const search = 'https://production-manager-api.onrender.com/v1';
const replace = '${process.env.VITE_API_BASE_URL}';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walkDir('apps/api/src');
files.filter(f => f.endsWith('.ts')).forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(search)) {
    content = content.replace(new RegExp(search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
