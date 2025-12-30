import json
import os
from translate import Translator

LANG_MAP = {
    'ar.json': 'ar',
    'bn.json': 'bn',
    'cs.json': 'cs',
    'de.json': 'de',
    'el.json': 'el',
    'es.json': 'es',
    'fa.json': 'fa',
    'fi.json': 'fi',
    'fr.json': 'fr',
    'gu.json': 'gu',
    'ha.json': 'ha',
    'he.json': 'he',
    'hi.json': 'hi',
    'hu.json': 'hu',
    'id.json': 'id',
    'it.json': 'it',
    'ja.json': 'ja',
    'jv.json': 'jw',
    'kn.json': 'kn',
    'ko.json': 'ko',
    'ml.json': 'ml',
    'mr.json': 'mr',
    'ms.json': 'ms',
    'nl.json': 'nl',
    'pa.json': 'pa',
    'pcm.json': 'en', 
    'pl.json': 'pl',
    'pt.json': 'pt',
    'ro.json': 'ro',
    'ru.json': 'ru',
    'sr.json': 'sr',
    'sv.json': 'sv',
    'sw.json': 'sw',
    'ta.json': 'ta',
    'te.json': 'te',
    'th.json': 'th',
    'tl.json': 'tl',
    'tr.json': 'tr',
    'uk.json': 'uk',
    'ur.json': 'ur',
    'vi.json': 'vi',
    'wuu.json': 'zh',
    'yue.json': 'zh',
    'zh-tw.json': 'zh-TW',
    'zh.json': 'zh'
}

def translate_bnfc():
    locales_dir = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\locales"
    source_text = "Enter grammar syntax (BNF)..."
    
    for filename, lang_code in LANG_MAP.items():
        filepath = os.path.join(locales_dir, filename)
        if not os.path.exists(filepath):
            print(f"Skipping {filename}: Not found.")
            continue
            
        print(f"Translating for {filename} ({lang_code})...")
        
        try:
            # For Nigerian Pidgin, we stay with English
            if lang_code == 'en' and filename != 'en.json':
                translation = source_text
            else:
                translator = Translator(to_lang=lang_code)
                translation = translator.translate(source_text)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            data["grammar.bnfc"] = translation
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            print(f"Updated {filename} with: {translation}")
            
        except Exception as e:
            print(f"Error updating {filename}: {e}")

if __name__ == "__main__":
    translate_bnfc()
