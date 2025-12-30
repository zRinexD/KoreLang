import os
import re

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    content = content.replace('--bg-main', '--background')
    content = content.replace('--bg-panel', '--surface')
    content = content.replace('--bg-header', '--elevated')
    content = content.replace('--text-1', '--text-primary')
    content = content.replace('--text-2', '--text-secondary')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ {os.path.basename(filepath)}")
        return True
    return False

count = 0
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            filepath = os.path.join(root, file)
            if replace_in_file(filepath):
                count += 1

print(f"\nTotal: {count} fichiers modifiés")
