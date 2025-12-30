#!/usr/bin/env node
/**
 * Translate missing or English-copied entries in locale JSONs using Gemini.
 * - Preserves placeholders like {{count}} and variables.
 * - Uses professional software UI terminology in the target language.
 * - Only fills empty values or values identical to English.
 *
 * Usage:
 *   $env:GEMINI_API_KEY="<your_key>"  # Windows PowerShell
 *   node scripts/translate_missing_locales.mjs
 */
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = 'gemini-1.5-flash';
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set.');
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL });

const LOCALES_DIR = path.resolve(process.cwd(), 'src', 'locales');

const langMap = {
  ar: 'Arabic', bn: 'Bengali', cs: 'Czech', de: 'German', el: 'Greek', en: 'English', es: 'Spanish',
  fa: 'Persian', fi: 'Finnish', fr: 'French', gu: 'Gujarati', ha: 'Hausa', he: 'Hebrew', hi: 'Hindi',
  hu: 'Hungarian', id: 'Indonesian', it: 'Italian', ja: 'Japanese', jv: 'Javanese', kn: 'Kannada',
  ko: 'Korean', ml: 'Malayalam', mr: 'Marathi', ms: 'Malay', nl: 'Dutch', pa: 'Punjabi', pcm: 'Nigerian Pidgin',
  pl: 'Polish', pt: 'Portuguese', ro: 'Romanian', ru: 'Russian', sr: 'Serbian', sv: 'Swedish', sw: 'Swahili',
  ta: 'Tamil', te: 'Telugu', th: 'Thai', tl: 'Tagalog', tr: 'Turkish', uk: 'Ukrainian', ur: 'Urdu',
  vi: 'Vietnamese', wuu: 'Wu Chinese', yue: 'Cantonese', 'zh-tw': 'Traditional Chinese', zh: 'Simplified Chinese'
};

function flatten(obj, prefix = '', out = {}) {
  if (typeof obj !== 'object' || obj === null) return out;
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

function setDeep(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const key = pathArr[i];
    if (cur[key] == null || typeof cur[key] !== 'object') cur[key] = {};
    cur = cur[key];
  }
  cur[pathArr[pathArr.length - 1]] = value;
}

function normalizeObject(obj) {
  const result = JSON.parse(JSON.stringify(obj));
  const dottedKeys = Object.keys(result).filter(k => k.includes('.'));
  for (const dk of dottedKeys) {
    const parts = dk.split('.');
    const dottedVal = result[dk];
    setDeep(result, parts, dottedVal);
    delete result[dk];
  }
  return result;
}

function stripCodeFences(text) {
  return text.replace(/^```json\n?|\n?```$/g, '').trim();
}

async function translateBatch(items, targetLang) {
  // Build strict JSON prompt
  const payload = JSON.stringify(items, null, 2);
  const prompt = [
    `Translate the following JSON values from English to ${targetLang}.`,
    'Rules:',
    '- Return ONLY valid JSON with the same keys, no explanations.',
    '- Preserve placeholders exactly: {{...}}, %s, %d, {0}, {1}.',
    '- Do not translate product names (KoreLang) or tokens.',
    '- Use professional software UI terminology in the target language.',
    '- Keep punctuation, case, and ellipses consistent.',
    '',
    payload
  ].join('\n');

  const res = await model.generateContent(prompt);
  const txt = res.response.text();
  const cleaned = stripCodeFences(txt);
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse JSON translation. Raw output:\n', txt);
    throw e;
  }
}

async function translateLocale(file, enFlat) {
  const localePath = path.join(LOCALES_DIR, file);
  const raw = fs.readFileSync(localePath, 'utf8');
  const data = JSON.parse(raw);
  const flat = flatten(data);

  const code = path.basename(file, '.json');
  const targetLang = langMap[code] || code;

  // Collect keys needing translation: empty or identical to English
  const pending = [];
  for (const [k, enVal] of Object.entries(enFlat)) {
    const cur = flat[k];
    if (cur === undefined || cur === '' || cur === enVal) {
      // Only translate textual strings
      if (typeof enVal === 'string' && enVal.trim().length > 0) {
        pending.push({ key: k, value: enVal });
      }
    }
  }

  if (pending.length === 0) {
    console.log(`No changes: ${file}`);
    return;
  }

  // Chunk requests to avoid token limits
  const CHUNK = 60;
  let filled = 0;
  for (let i = 0; i < pending.length; i += CHUNK) {
    const chunk = pending.slice(i, i + CHUNK);
    const input = Object.fromEntries(chunk.map(it => [it.key, it.value]));
    const out = await translateBatch(input, targetLang);
    for (const [k, v] of Object.entries(out)) {
      if (typeof v === 'string' && v.trim().length > 0) {
        setDeep(data, k.split('.'), v);
        filled++;
      }
    }
  }

  const normalized = normalizeObject(data);
  fs.writeFileSync(localePath, JSON.stringify(normalized, null, 2) + '\n', 'utf8');
  console.log(`Translated ${filled} keys: ${file}`);
}

async function main() {
  const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
  const enPath = path.join(LOCALES_DIR, 'en.json');
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enFlat = flatten(en);

  for (const f of files) {
    if (f === 'en.json') continue; // skip source
    await translateLocale(f, enFlat);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
