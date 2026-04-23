import fs from 'fs';
import path from 'path';

const FILE_PATH = './Estrutura_Projeto.md';
const IGNORE_DIRS = ['node_modules', '.git', 'dist', '.next', 'backups', 'docs', '.gemini'];
const IGNORE_FILES = ['.gitignore', '.env.example', 'package-lock.json', 'tsconfig.json', 'vitest.config.ts', 'metadata.json'];

function getTree(dir, prefix = '') {
    let tree = '';
    const items = fs.readdirSync(dir)
        .filter(item => !IGNORE_DIRS.includes(item) && !IGNORE_FILES.includes(item) && !item.startsWith('.'))
        .sort((a, b) => {
            const aPath = path.join(dir, a);
            const bPath = path.join(dir, b);
            const aStat = fs.statSync(aPath);
            const bStat = fs.statSync(bPath);
            
            // Diretorios primeiro
            if (aStat.isDirectory() && !bStat.isDirectory()) return -1;
            if (!aStat.isDirectory() && bStat.isDirectory()) return 1;
            return a.localeCompare(b);
        });

    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        tree += `${prefix}${isLast ? '└── ' : '├── '}${item}\n`;

        if (stats.isDirectory()) {
            tree += getTree(fullPath, `${prefix}${isLast ? '    ' : '│   '}`);
        }
    });

    return tree;
}

function updateFile() {
    if (!fs.existsSync(FILE_PATH)) {
        console.error('Arquivo Estrutura_Projeto.md não encontrado.');
        return;
    }

    const content = fs.readFileSync(FILE_PATH, 'utf-8');
    const versionMatch = content.match(/\*\*Versão:\*\* v(\d+)\.(\d+)\.(\d+)/);
    
    let newVersion = 'v1.0.0';
    if (versionMatch) {
        const [_, major, minor, patch] = versionMatch;
        newVersion = `v${major}.${minor}.${parseInt(patch) + 1}`;
    }

    const newTree = getTree('.');
    const now = new Date().toLocaleDateString('pt-BR');
    
    const newContent = `# Mapa de Estrutura do Projeto: Production Manager
**Versão:** ${newVersion} (Gerado em ${now})

## 🌳 Árvore de Arquivos
\`\`\`text
.
${newTree}\`\`\`
`;

    fs.writeFileSync(FILE_PATH, newContent);
    console.log(`Estrutura atualizada para ${newVersion}`);
}

updateFile();
