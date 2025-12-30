#!/usr/bin/env node
/*
Normalize i18n locale JSON files by converting dotted keys (e.g., "menu.file")
into nested objects (e.g., { menu: { file: "..." } }) and removing redundant
flat entries. Existing nested values take precedence; dotted values are used
only when nested path is missing.
*/
const fs = require('fs');
const path = require('path');

function setDeep(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const key = pathArr[i];
    if (cur[key] == null || typeof cur[key] !== 'object') cur[key] = {};
    cur = cur[key];
  }
  cur[pathArr[pathArr.length - 1]] = value;
}

function getDeep(obj, pathArr) {
  let cur = obj;
  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i];
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[key];
  }
  return cur;
}

function normalizeObject(obj) {
  const result = JSON.parse(JSON.stringify(obj)); // clone
  const dottedKeys = Object.keys(result).filter(k => k.includes('.'));
  for (const dk of dottedKeys) {
    const parts = dk.split('.');
    const dottedVal = result[dk];
    const existing = getDeep(result, parts);
    if (existing === undefined) {
      setDeep(result, parts, dottedVal);
    }
    delete result[dk];
  }
  return result;
}

function normalizeFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`Invalid JSON: ${filePath}`);
    throw e;
  }
  const normalized = normalizeObject(data);
  const out = JSON.stringify(normalized, null, 2) + '\n';
  fs.writeFileSync(filePath, out, 'utf8');
  console.log(`Normalized: ${filePath}`);
}

function main() {
  const args = process.argv.slice(2);
  let files = args.length ? args : [
    path.join('src', 'locales', 'en.json'),
    path.join('src', 'locales', 'fr.json'),
    path.join('src', 'locales', 'de.json'),
  ];
  
  // If no arguments, normalize ALL locale files
  if (!args.length) {
    const localesDir = path.join('src', 'locales');
    files = fs.readdirSync(localesDir)
      .filter(f => f.endsWith('.json'))
      .map(f => path.join(localesDir, f));
  } else {
    files = files.map(f => path.resolve(process.cwd(), f));
  }
  
  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.error(`File not found: ${f}`);
      process.exitCode = 1;
    } else {
      normalizeFile(f);
    }
  }
}

if (require.main === module) {
  main();
}
