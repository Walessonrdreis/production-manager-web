import fs from 'fs';
import path from 'path';

const searchRegex = /https:\/\/production-manager-api\.onrender\.com\/v1/g;
const replaceString = 'https://production-manager-api.onrender.com/v1';

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

const files = walkDir('apps/api/src').filter(f => f.endsWith('.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (searchRegex.test(content)) {
    // We update it to read from process.env.VITE_API_BASE_URL but default to the url.
    content = content.replace(/`https:\/\/production-manager-api\.onrender\.com\/v1([^`]+)`/g, '`${process.env.VITE_API_BASE_URL || \'https://production-manager-api.onrender.com/v1\'}$1`');
    content = content.replace(/'https:\/\/production-manager-api\.onrender\.com\/v1([^']+)'/g, '`${process.env.VITE_API_BASE_URL || \'https://production-manager-api.onrender.com/v1\'}$1`');
    content = content.replace(/"https:\/\/production-manager-api\.onrender\.com\/v1([^"]+)"/g, '`${process.env.VITE_API_BASE_URL || \'https://production-manager-api.onrender.com/v1\'}$1`');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
