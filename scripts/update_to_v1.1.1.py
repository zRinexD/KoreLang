import json
import os
from translate import Translator

LANG_MAP = {
    'ar.json': 'ar', 'bn.json': 'bn', 'cs.json': 'cs', 'de.json': 'de', 'el.json': 'el',
    'es.json': 'es', 'fa.json': 'fa', 'fi.json': 'fi', 'fr.json': 'fr', 'gu.json': 'gu',
    'ha.json': 'ha', 'he.json': 'he', 'hi.json': 'hi', 'hu.json': 'hu', 'id.json': 'id',
    'it.json': 'it', 'ja.json': 'ja', 'jv.json': 'jw', 'kn.json': 'kn', 'ko.json': 'ko',
    'ml.json': 'ml', 'mr.json': 'mr', 'ms.json': 'ms', 'nl.json': 'nl', 'pa.json': 'pa',
    'pcm.json': 'en', 'pl.json': 'pl', 'pt.json': 'pt', 'ro.json': 'ro', 'ru.json': 'ru',
    'sr.json': 'sr', 'sv.json': 'sv', 'sw.json': 'sw', 'ta.json': 'ta', 'te.json': 'te',
    'th.json': 'th', 'tl.json': 'tl', 'tr.json': 'tr', 'uk.json': 'uk', 'ur.json': 'ur',
    'vi.json': 'vi', 'wuu.json': 'zh', 'yue.json': 'zh', 'zh-tw.json': 'zh-TW', 'zh.json': 'zh'
}

UPDATES = {
    "whats_new.title": "What's new in v1.1.1",
    "whats_new.f1_title": "Better Translations",
    "whats_new.f1_desc": "All 46 languages are now more accurately translated and fully internationalized.",
    "console.kernel_version": "KoreLang kernel_v1.1.1_stable"
}

def update_locales():
    locales_dir = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\locales"
    
    for filename, lang_code in LANG_MAP.items():
        filepath = os.path.join(locales_dir, filename)
        if not os.path.exists(filepath):
            continue
            
        print(f"Updating {filename}...")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Handle Pidgin (pcm) separately by using English
            if lang_code == 'en' and filename == 'pcm.json':
                data["whats_new.title"] = "Wetin New for v1.1.1"
                data["whats_new.f1_title"] = "Beta Translations"
                data["whats_new.f1_desc"] = "All 46 languages now translate beta and dem work well everywhere."
                data["console.kernel_version"] = "KoreLang kernel_v1.1.1_stable"
            else:
                translator = Translator(to_lang=lang_code)
                for key, text in UPDATES.items():
                    # For strings with versions, we might want to keep the version as is
                    if "v1.1.1" in text:
                        # Translate the part before the version if necessary
                        if key == "whats_new.title":
                            trans = translator.translate("What's new in")
                            data[key] = f"{trans} v1.1.1"
                        elif key == "console.kernel_version":
                            data[key] = text # Keep kernel version standard
                        else:
                            data[key] = translator.translate(text)
                    else:
                        data[key] = translator.translate(text)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
                
        except Exception as e:
            print(f"Error updating {filename}: {e}")

if __name__ == "__main__":
    update_locales()
