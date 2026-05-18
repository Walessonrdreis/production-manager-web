import fs from 'fs';
import path from 'path';

function walkDir(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walkDir('apps/api/src/modules').filter(f => f.endsWith('.adapter.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('502')) {
    content = content.replace(/,\s*502\)/g, ', err.response?.status || 500)');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
