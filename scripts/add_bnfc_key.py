import json
import os

def add_key_to_locales():
    locales_dir = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\locales"
    files = [f for f in os.listdir(locales_dir) if f.endswith(".json") and f != "en.json"]
    
    for filename in files:
        filepath = os.path.join(locales_dir, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Add grammar.bnfc after grammar.saved if it exists, otherwise at the end
            new_data = {}
            added = False
            for k, v in data.items():
                new_data[k] = v
                if k == "grammar.saved":
                    new_data["grammar.bnfc"] = "grammar.bnfc"
                    added = True
            
            if not added:
                new_data["grammar.bnfc"] = "grammar.bnfc"
            
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(new_data, f, ensure_ascii=False, indent=4)
            print(f"Updated {filename}")

        except Exception as e:
            print(f"Error updating {filename}: {str(e)}")

if __name__ == "__main__":
    add_key_to_locales()
