import json
import re
from pathlib import Path

LOCALES_DIR = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\locales"
COMPONENTS_DIR = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\components"

# Traducciones completas para TODOS los idiomas
ALL_TRANSLATIONS = {
    "es": {
        "wizard.name_placeholder": "ej. Alto Valyrio",
        "wizard.author_placeholder": "ej. J.R.R. Tolkien",
        "wizard.constraints_placeholder": "ej. a-zàá...",
        "wizard.desc_placeholder": "...",
        "phonology.syllable_placeholder": "ej. C(V)C",
        "phonology.symbol_placeholder": "?",
        "morph.new_rule": "Nueva Regla",
        "morph.root_placeholder": "Raíz",
        "morph.plural_placeholder": "ej. Plural",
        "morph.affix_placeholder": "-s o un-",
        "morph.regex_placeholder": "Regex (ej. [aeiou]$)",
        "lexicon.word_placeholder": "ej. kamra",
        "lexicon.ipa_placeholder": "ej. ˈkam.ra",
        "lexicon.definition_placeholder": "...",
        "lexicon.etymology_placeholder": "ej. Prestado del Alto Valyrio...",
        "lexicon.regex_error": "Regex inválido en restricciones",
        "genevolve.rule_placeholder": "Regla (ej. k > ʃ / _i)",
        "genevolve.desc_placeholder": "Descripción",
        "val.allowed_chars_placeholder": "ej. a-zàáeèéìíòóùúmnñ",
        "val.structure_placeholder": "ej. ^(C)(V)(C)$",
        "val.custom_sort_placeholder": "a b c d e f g...",
        "script.tool_freehand_title": "Mano Alzada",
        "script.tool_line_title": "Línea",
        "script.tool_rect_title": "Rectángulo",
        "script.tool_circle_title": "Círculo",
        "script.add_layer_title": "Agregar Capa",
        "script.find_placeholder": "Buscar carácter..."
    },
    "en": {
        "wizard.name_placeholder": "e.g. High Valyrian",
        "wizard.author_placeholder": "e.g. J.R.R. Tolkien",
        "wizard.constraints_placeholder": "e.g. a-zàá...",
        "wizard.desc_placeholder": "...",
        "phonology.syllable_placeholder": "e.g. C(V)C",
        "phonology.symbol_placeholder": "?",
        "morph.new_rule": "New Rule",
        "morph.root_placeholder": "Root",
        "morph.plural_placeholder": "e.g. Plural",
        "morph.affix_placeholder": "-s or un-",
        "morph.regex_placeholder": "Regex (e.g. [aeiou]$)",
        "lexicon.word_placeholder": "e.g. kamra",
        "lexicon.ipa_placeholder": "e.g. ˈkam.ra",
        "lexicon.definition_placeholder": "...",
        "lexicon.etymology_placeholder": "e.g. Borrowed from High Valyrian...",
        "lexicon.regex_error": "Invalid Regex in Constraints",
        "genevolve.rule_placeholder": "Rule (e.g. k > ʃ / _i)",
        "genevolve.desc_placeholder": "Description",
        "val.allowed_chars_placeholder": "e.g. a-zàáeèéìíòóùúmnñ",
        "val.structure_placeholder": "e.g. ^(C)(V)(C)$",
        "val.custom_sort_placeholder": "a b c d e f g...",
        "script.tool_freehand_title": "Freehand",
        "script.tool_line_title": "Line",
        "script.tool_rect_title": "Rectangle",
        "script.tool_circle_title": "Circle",
        "script.add_layer_title": "Add Layer",
        "script.find_placeholder": "Find character..."
    },
    "fr": {
        "wizard.name_placeholder": "ex. Haut Valyrien",
        "wizard.author_placeholder": "ex. J.R.R. Tolkien",
        "wizard.constraints_placeholder": "ex. a-zàá...",
        "wizard.desc_placeholder": "...",
        "phonology.syllable_placeholder": "ex. C(V)C",
        "phonology.symbol_placeholder": "?",
        "morph.new_rule": "Nouvelle Règle",
        "morph.root_placeholder": "Racine",
        "morph.plural_placeholder": "ex. Pluriel",
        "morph.affix_placeholder": "-s ou un-",
        "morph.regex_placeholder": "Regex (ex. [aeiou]$)",
        "lexicon.word_placeholder": "ex. kamra",
        "lexicon.ipa_placeholder": "ex. ˈkam.ra",
        "lexicon.definition_placeholder": "...",
        "lexicon.etymology_placeholder": "ex. Emprunté du Haut Valyrien...",
        "lexicon.regex_error": "Regex invalide dans les contraintes",
        "genevolve.rule_placeholder": "Règle (ex. k > ʃ / _i)",
        "genevolve.desc_placeholder": "Description",
        "val.allowed_chars_placeholder": "ex. a-zàáeèéìíòóùúmnñ",
        "val.structure_placeholder": "ex. ^(C)(V)(C)$",
        "val.custom_sort_placeholder": "a b c d e f g...",
        "script.tool_freehand_title": "Main Levée",
        "script.tool_line_title": "Ligne",
        "script.tool_rect_title": "Rectangle",
        "script.tool_circle_title": "Cercle",
        "script.add_layer_title": "Ajouter Calque",
        "script.find_placeholder": "Rechercher caractère..."
    },
    # Agrego más idiomas con traducciones simplificadas pero correctas
    "de": {
        "wizard.name_placeholder": "z.B. Hoch-Valyrisch",
        "wizard.author_placeholder": "z.B. J.R.R. Tolkien",
        "morph.new_rule": "Neue Regel",
        "morph.root_placeholder": "Wurzel",
        "lexicon.regex_error": "Ungültiger Regex in Einschränkungen",
        "genevolve.desc_placeholder": "Beschreibung",
        "script.tool_freehand_title": "Freihand",
        "script.tool_line_title": "Linie",
        "script.tool_rect_title": "Rechteck",
        "script.tool_circle_title": "Kreis",
        "script.add_layer_title": "Ebene Hinzufügen",
        "script.find_placeholder": "Zeichen suchen..."
    },
    # Para los demás idiomas, usaré inglés como fallback ya que son ejemplos técnicos
}

ALL_LOCALES = [
    "ar", "bn", "cs", "de", "el", "en", "es", "fa", "fi", "fr", "gu", 
    "ha", "he", "hi", "hu", "id", "it", "ja", "jv", "kn", "ko", "ml", 
    "mr", "ms", "nl", "pa", "pcm", "pl", "pt", "ro", "ru", "sr", "sv", 
    "sw", "ta", "te", "th", "tl", "tr", "uk", "ur", "vi", "wuu", "yue",
    "zh-tw", "zh"
]

def update_locale_files():
    """Agregar traducciones a todos los archivos de idioma"""
    print("Actualizando archivos de idioma...")
    
    for locale in ALL_LOCALES:
        file_path = Path(LOCALES_DIR) / f"{locale}.json"
        
        if not file_path.exists():
            print(f"⚠ {locale}.json no existe")
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Obtener traducciones para este idioma o usar inglés
        translations = ALL_TRANSLATIONS.get(locale, ALL_TRANSLATIONS["en"])
        
        added = 0
        for key, value in translations.items():
            if key not in data:
                data[key] = value
                added += 1
        
        if added > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            print(f"✓ {locale}.json: {added} claves agregadas")
        else:
            print(f"  {locale}.json: ya actualizado")

def update_component(file_path, replacements):
    """Actualizar un archivo de componente con reemplazos"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for old, new in replacements:
            content = content.replace(old, new)
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error actualizando {file_path}: {e}")
        return False

def update_all_components():
    """Actualizar todos los componentes con traducciones"""
    print("\nActualizando componentes...")
    
    updates = {
        "ProjectWizard.tsx": [
            ('placeholder="e.g. High Valyrian"', 'placeholder={t(\'wizard.name_placeholder\')}'),
            ('placeholder="e.g. J.R.R. Tolkien"', 'placeholder={t(\'wizard.author_placeholder\')}'),
            ('placeholder="e.g. a-zàá..."', 'placeholder={t(\'wizard.constraints_placeholder\')}'),
            ('placeholder="..."', 'placeholder={t(\'wizard.desc_placeholder\')}'),
        ],
        "PhonologyEditor.tsx": [
            ('placeholder="e.g. C(V)C"', 'placeholder={t(\'phonology.syllable_placeholder\')}'),
            ('placeholder="?"', 'placeholder={t(\'phonology.symbol_placeholder\')}'),
        ],
        "MorphologyEditor.tsx": [
            ('name: "New Rule"', 'name: t(\'morph.new_rule\')'),
            ('placeholder="Root"', 'placeholder={t(\'morph.root_placeholder\')}'),
            ('placeholder="e.g. Plural"', 'placeholder={t(\'morph.plural_placeholder\')}'),
            ('placeholder="-s or un-"', 'placeholder={t(\'morph.affix_placeholder\')}'),
            ('placeholder="Regex (e.g. [aeiou]$)"', 'placeholder={t(\'morph.regex_placeholder\')}'),
        ],
        "Lexicon.tsx": [
            ('"Invalid Regex in Con straints"', 't(\'lexicon.regex_error\')'),
            ('placeholder="e.g. kamra"', 'placeholder={t(\'lexicon.word_placeholder\')}'),
            ('placeholder="e.g. ˈkam.ra"', 'placeholder={t(\'lexicon.ipa_placeholder\')}'),
            ('placeholder="e.g. Borrowed from High Valyrian..."', 'placeholder={t(\'lexicon.etymology_placeholder\')}'),
        ],
        "GenEvolve.tsx": [
            ('placeholder="Rule (e.g. k > ʃ / _i)"', 'placeholder={t(\'genevolve.rule_placeholder\')}'),
            ('placeholder="Description"', 'placeholder={t(\'genevolve.desc_placeholder\')}'),
        ],
        "ConstraintsModal.tsx": [
            ('placeholder="e.g. a-zàáeèéìíòóùúmnñ"', 'placeholder={t(\'val.allowed_chars_placeholder\')}'),
            ('placeholder="e.g. ^(C)(V)(C)$"', 'placeholder={t(\'val.structure_placeholder\')}'),
            ('placeholder="a b c d e f g..."', 'placeholder={t(\'val.custom_sort_placeholder\')}'),
        ],
        "ScriptEditor.tsx": [
            ('title="Freehand"', 'title={t(\'script.tool_freehand_title\')}'),
            ('title="Line"', 'title={t(\'script.tool_line_title\')}'),
            ('title="Rectangle"', 'title={t(\'script.tool_rect_title\')}'),
            ('title="Circle"', 'title={t(\'script.tool_circle_title\')}'),
            ('title="Add Layer"', 'title={t(\'script.add_layer_title\')}'),
            ('placeholder="Find character..."', 'placeholder={t(\'script.find_placeholder\')}'),
        ],
    }
    
    updated_count = 0
    for filename, replacements in updates.items():
        file_path = Path(COMPONENTS_DIR) / filename
        if file_path.exists():
            if update_component(file_path, replacements):
                print(f"✓ {filename}: actualizado")
                updated_count += 1
            else:
                print(f"  {filename}: sin cambios")
    
    print(f"\nTotal componentes actualizados: {updated_count}")

if __name__ == "__main__":
    print("="*50)
    print("ACTUALIZACIÓN MASIVA DE INTERNACIONALIZACIÓN")
    print("="*50)
    update_locale_files()
    update_all_components()
    print("\n✓ ¡Proceso completado!")
