const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'src', 'locales');

function fillEmptyValues(obj, prefix = '') {
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      // Récursion pour les objets imbriqués
      fillEmptyValues(obj[key], fullKey);
    } else if (obj[key] === '') {
      // Remplacer les chaînes vides par le nom de la clé
      obj[key] = key;
    }
  }
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    fillEmptyValues(data);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`Traité: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Erreur lors du traitement de ${filePath}:`, error.message);
  }
}

function main() {
  const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));
  
  console.log(`Traitement de ${files.length} fichiers de localisation...\n`);
  
  files.forEach(file => {
    const filePath = path.join(localesDir, file);
    processFile(filePath);
  });
  
  console.log('\n✓ Tous les fichiers ont été traités!');
}

main();
