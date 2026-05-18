import fs from 'fs';
import path from 'path';

const REPLACEMENTS = [
  { regex: /(?<!dark:)bg-white/g, replacement: "bg-white dark:bg-slate-900" },
  { regex: /(?<!dark:)text-zinc-900/g, replacement: "text-zinc-900 dark:text-锌-100" },
  { regex: /(?<!dark:)text-slate-900/g, replacement: "text-slate-900 dark:text-slate-100" },
  { regex: /(?<!dark:)text-gray-900/g, replacement: "text-gray-900 dark:text-gray-100" },
  
  { regex: /(?<!dark:)text-zinc-800/g, replacement: "text-zinc-800 dark:text-zinc-200" },
  { regex: /(?<!dark:)text-slate-800/g, replacement: "text-slate-800 dark:text-slate-200" },
  
  { regex: /(?<!dark:)text-zinc-700/g, replacement: "text-zinc-700 dark:text-zinc-300" },
  { regex: /(?<!dark:)text-slate-700/g, replacement: "text-slate-700 dark:text-slate-300" },
  
  { regex: /(?<!dark:)border-zinc-100/g, replacement: "border-zinc-100 dark:border-zinc-800" },
  { regex: /(?<!dark:)border-slate-100/g, replacement: "border-slate-100 dark:border-slate-800" },
  { regex: /(?<!dark:)border-gray-100/g, replacement: "border-gray-100 dark:border-gray-800" },
  
  { regex: /(?<!dark:)border-zinc-200/g, replacement: "border-zinc-200 dark:border-zinc-800" },
  { regex: /(?<!dark:)border-slate-200/g, replacement: "border-slate-200 dark:border-slate-800" },
  
  { regex: /(?<!dark:)text-zinc-500/g, replacement: "text-zinc-500 dark:text-zinc-400" },
  { regex: /(?<!dark:)text-slate-500/g, replacement: "text-slate-500 dark:text-slate-400" },
  { regex: /(?<!dark:)text-zinc-600/g, replacement: "text-zinc-600 dark:text-zinc-400" },
  { regex: /(?<!dark:)text-slate-600/g, replacement: "text-slate-600 dark:text-slate-400" },
  { regex: /(?<!dark:)text-gray-500/g, replacement: "text-gray-500 dark:text-gray-400" },
  { regex: /(?<!dark:)hover:bg-zinc-50(?!0)/g, replacement: "hover:bg-zinc-50 dark:hover:bg-zinc-800" },
  { regex: /(?<!dark:)hover:bg-slate-50(?!0)/g, replacement: "hover:bg-slate-50 dark:hover:bg-slate-800" },
  { regex: /(?<!dark:)hover:bg-zinc-100/g, replacement: "hover:bg-zinc-100 dark:hover:bg-zinc-800" },
  { regex: /(?<!dark:)hover:bg-slate-100/g, replacement: "hover:bg-slate-100 dark:hover:bg-slate-800" },
  
  { regex: /(?<!dark:)bg-zinc-100/g, replacement: "bg-zinc-100 dark:bg-zinc-800" },
  { regex: /(?<!dark:)bg-slate-100/g, replacement: "bg-slate-100 dark:bg-slate-800" }
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
          content = content.replace(regex, replacement);
          // Also fix the mistake in zinc array `锌` string
          content = content.replace('dark:text-锌-100', 'dark:text-zinc-100');
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(defaultPath, content, 'utf8');
        console.log(`Updated ${defaultPath}`);
      }
    }
  }
}

processDirectory('./apps/web/src/components');
processDirectory('./apps/web/src/features');
processDirectory('./apps/web/src/pages');
processDirectory('./apps/web/src/app');
