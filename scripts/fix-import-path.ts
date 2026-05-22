import fs from 'fs';
import { execSync } from 'child_process';

const files = execSync('grep -rl "import { legacyPrisma } from" apps/api/src/modules/').toString().split('\n').filter(Boolean);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/infra\/legacyPrisma\.js/g, 'infra/prisma.js');
  fs.writeFileSync(file, content);
}
console.log('Done');
