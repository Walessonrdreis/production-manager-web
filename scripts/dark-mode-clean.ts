import fs from 'fs';
import path from 'path';

const REPLACEMENTS = [
  // First clean up the double duplicates!
  { regex: /dark:bg-slate-900 dark:bg-slate-900/g, replacement: "dark:bg-slate-900" },
  { regex: /dark:text-zinc-100 dark:text-zinc-100/g, replacement: "dark:text-zinc-100" },
  { regex: /dark:text-slate-100 dark:text-slate-100/g, replacement: "dark:text-slate-100" },
  { regex: /dark:text-gray-100 dark:text-gray-100/g, replacement: "dark:text-gray-100" },
  { regex: /dark:text-zinc-200 dark:text-zinc-200/g, replacement: "dark:text-zinc-200" },
  { regex: /dark:text-slate-200 dark:text-slate-200/g, replacement: "dark:text-slate-200" },
  { regex: /dark:text-zinc-300 dark:text-zinc-300/g, replacement: "dark:text-zinc-300" },
  { regex: /dark:text-slate-300 dark:text-slate-300/g, replacement: "dark:text-slate-300" },
  { regex: /dark:border-zinc-800 dark:border-zinc-800/g, replacement: "dark:border-zinc-800" },
  { regex: /dark:border-slate-800 dark:border-slate-800/g, replacement: "dark:border-slate-800" },
  { regex: /dark:bg-zinc-900\/50 dark:bg-zinc-900\/50/g, replacement: "dark:bg-zinc-900/50" },
  { regex: /dark:bg-slate-900\/50 dark:bg-slate-900\/50/g, replacement: "dark:bg-slate-900/50" },
  { regex: /dark:bg-zinc-800 dark:bg-zinc-800/g, replacement: "dark:bg-zinc-800" },
  { regex: /dark:bg-slate-800 dark:bg-slate-800/g, replacement: "dark:bg-slate-800" },
  { regex: /dark:text-zinc-400 dark:text-zinc-400/g, replacement: "dark:text-zinc-400" },
  { regex: /dark:text-slate-400 dark:text-slate-400/g, replacement: "dark:text-slate-400" },
  
  // also handle triple duplicates just in case! Wait, doing it sequentially handles up to 4 if we run it multiple times.
];

function processDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const defaultPath = path.join(dir, file);
    const stat = fs.statSync(defaultPath);
    if (stat.isDirectory()) {
      processDirectory(defaultPath);
    } else if (defaultPath.endsWith('.tsx') || defaultPath.endsWith('.ts')) {
      let content = fs.readFileSync(defaultPath, 'utf8');
      let changed = false;
      
      for (const { regex, replacement } of REPLACEMENTS) {
        if (regex.test(content)) {
          // Replace multiple times to catch triples
          content = content.replace(regex, replacement).replace(regex, replacement).replace(regex, replacement);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(defaultPath, content, 'utf8');
        console.log(`Cleaned ${defaultPath}`);
      }
    }
  }
}

processDirectory('./apps/web/src/components');
processDirectory('./apps/web/src/features');
processDirectory('./apps/web/src/pages');
processDirectory('./apps/web/src/app');
