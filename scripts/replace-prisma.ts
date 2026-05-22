import fs from 'fs';
import { execSync } from 'child_process';

const files = execSync('grep -rl "import { prisma }" apps/api/src/modules/').toString().split('\n').filter(Boolean);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ prisma \} from/g, 'import { legacyPrisma } from');
  content = content.replace(/prisma\./g, 'legacyPrisma.');
  fs.writeFileSync(file, content);
}
console.log('Done');
