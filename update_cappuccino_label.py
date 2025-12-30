import os

locale_dir = "src/locales"

for filename in os.listdir(locale_dir):
    if filename.endswith(".json"):
        filepath = os.path.join(locale_dir, filename)
        
        # Read content
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace settings.light with settings.cappuccino
        content = content.replace('"settings.light"', '"settings.cappuccino"')
        
        # Write back
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        
        print(f"Updated {filename}")

print("Done!")

