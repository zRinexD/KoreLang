
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const enPath = path.join(localesDir, 'en.json');

// Read English
const enContent = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

function flattenKeys(obj, prefix = '') {
    let keys = {};
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(keys, flattenKeys(obj[key], `${prefix}${key}.`));
        } else {
            keys[`${prefix}${key}`] = obj[key];
        }
    }
    return keys;
}

const enFlat = flattenKeys(enContent);

fs.readdirSync(localesDir).forEach(file => {
    if (file === 'en.json' || !file.endsWith('.json')) return;

    const filePath = path.join(localesDir, file);
    let content = {};
    try {
        content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        console.log('Skipping ' + file);
        return;
    }

    // Checking missing keys
    // For nested structure, we can just ensure the keys exist.
    // However, if the structure is flat/nested mix, this is tricky. 
    // The current files seem to be flat key-value pairs mostly, but some nested?
    // Let's assume flat structure based on previous file views (e.g. "buttons.save": "Save").

    // Wait, the file view shows "genword.title" etc. These are flat keys with dots.
    // So we can just check if key exists.

    let modified = false;
    for (const key in enContent) {
        if (!content.hasOwnProperty(key)) {
            content[key] = enContent[key]; // Fill with English default
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
        console.log(`Updated ${file}`);
    }
});
