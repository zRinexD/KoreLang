import json
import os

def cleanup_locales():
    locales_dir = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\locales"
    keys_to_remove = ["whats_new.f2_title", "whats_new.f2_desc"]
    
    for filename in os.listdir(locales_dir):
        if not filename.endswith('.json'):
            continue
            
        filepath = os.path.join(locales_dir, filename)
        print(f"Cleaning up {filename}...")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            modified = False
            for key in keys_to_remove:
                if key in data:
                    del data[key]
                    modified = True
            
            if modified:
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=4)
                print(f"  Removed keys from {filename}")
            else:
                print(f"  No keys to remove in {filename}")
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    cleanup_locales()
