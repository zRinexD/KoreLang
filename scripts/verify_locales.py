import json
import os

def verify_locales():
    locales_dir = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\locales"
    en_file = os.path.join(locales_dir, "en.json")
    
    with open(en_file, "r", encoding="utf-8") as f:
        en_data = json.load(f)
    
    en_keys = set(en_data.keys())
    print(f"Source file: en.json, Keys: {len(en_keys)}")
    
    files = [f for f in os.listdir(locales_dir) if f.endswith(".json") and f != "en.json"]
    
    errors = []
    for filename in files:
        filepath = os.path.join(locales_dir, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            data_keys = set(data.keys())
            
            missing_in_file = en_keys - data_keys
            extra_in_file = data_keys - en_keys
            
            if missing_in_file:
                errors.append(f"{filename}: Missing keys: {missing_in_file}")
            if extra_in_file:
                errors.append(f"{filename}: Extra keys: {extra_in_file}")
            
            # Check for empty values or untranslated placeholders
            for k, v in data.items():
                if not v or v.strip() == "":
                    errors.append(f"{filename}: Empty value for key '{k}'")
                if v == "..." or v == "?":
                    # Some values might legitimately be ... or ? if they were so in en.json
                    if en_data.get(k) != v:
                        errors.append(f"{filename}: Likely untranslated value '{v}' for key '{k}'")

        except Exception as e:
            errors.append(f"{filename}: Error reading file: {str(e)}")
            
    if not errors:
        print("All locale files are consistent with en.json!")
    else:
        print(f"Found {len(errors)} consistency issues:")
        for error in errors:
            print(error)

if __name__ == "__main__":
    verify_locales()
