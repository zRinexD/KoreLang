const fs = require('fs');
const path = require('path');

const replacements = [
  ['--bg-main', '--background'],
  ['--bg-panel', '--surface'],
  ['--bg-header', '--elevated'],
  ['--text-1', '--text-primary'],
  ['--text-2', '--text-secondary']
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  replacements.forEach(([oldVar, newVar]) => {
    if (content.includes(oldVar)) {
      content = content.replaceAll(oldVar, newVar);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${path.basename(filePath)}`);
    return 1;
  }
  return 0;
}

function walkDir(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (/\.(tsx?|css)$/.test(file)) {
      count += processFile(filePath);
    }
  });
  
  return count;
}

const srcDir = path.join(__dirname, 'src');
const total = walkDir(srcDir);
console.log(`\nTotal: ${total} fichiers modifiés`);
