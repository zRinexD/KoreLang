import os
import json
from translate import Translator

# Map of filenames to language codes
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
    'pcm.json': 'en', # Nigerian Pidgin fallback
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

def translate_locales(base_dir):
    source_file = os.path.join(base_dir, 'en.json')
    
    if not os.path.exists(source_file):
        print(f"Source file {source_file} not found.")
        return

    with open(source_file, 'r', encoding='utf-8') as f:
        source_data = json.load(f)

    for filename, lang_code in LANG_MAP.items():
        if filename == 'en.json':
            continue
            
        target_path = os.path.join(base_dir, filename)
        print(f"Processing {filename} ({lang_code})...")
        
        translator = Translator(to_lang=lang_code)
        translated_data = {}
        
        for key, value in source_data.items():
            try:
                # Note: This is a basic implementation. For production use with many keys,
                # consider batching or using a more robust API.
                translation = translator.translate(value)
                translated_data[key] = translation
            except Exception as e:
                print(f"Error translating {key} to {lang_code}: {e}")
                translated_data[key] = value
                
        with open(target_path, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=4)
        print(f"Saved {filename}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    locales_path = os.path.join(os.path.dirname(current_dir), 'src', 'locales')
    translate_locales(locales_path)
