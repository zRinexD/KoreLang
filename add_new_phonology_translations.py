import json
from pathlib import Path

LOCALES_DIR = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\locales"

# Solo las nuevas 5 claves de traducción para todos los idiomas
NEW_TRANSLATIONS = {
    "es": {
        "phonology.replace_confirm": "Esto REEMPLAZARÁ tu fonología actual. ¿Estás seguro?",
        "phonology.clear_confirm": "¿Estás seguro de que quieres eliminar todos los fonemas?",
        "phonology.hide_preview": "Ocultar Vista Previa",
        "phonology.show_preview": "Mostrar Vista Previa IA",
        "phonology.generation_failed": "Generación IA fallida. Verifica la API Key o intenta nuevamente."
    },
    "en": {
        "phonology.replace_confirm": "This will REPLACE your current phonology. Are you sure?",
        "phonology.clear_confirm": "Are you sure you want to clear all phonemes?",
        "phonology.hide_preview": "Hide Preview",
        "phonology.show_preview": "Show AI Preview",
        "phonology.generation_failed": "AI Generation failed. Check API Key or try again."
    },
    "fr": {
        "phonology.replace_confirm": "Cela REMPLACERA votre phonologie actuelle. Êtes-vous sûr?",
        "phonology.clear_confirm": "Êtes-vous sûr de vouloir effacer tous les phonèmes?",
        "phonology.hide_preview": "Masquer l'Aperçu",
        "phonology.show_preview": "Afficher l'Aperçu IA",
        "phonology.generation_failed": "Échec de la génération IA. Vérifiez la clé API ou réessayez."
    },
    "de": {
        "phonology.replace_confirm": "Dies wird Ihre aktuelle Phonologie ERSETZEN. Sind Sie sicher?",
        "phonology.clear_confirm": "Sind Sie sicher, dass Sie alle Phoneme löschen möchten?",
        "phonology.hide_preview": "Vorschau Ausblenden",
        "phonology.show_preview": "KI-Vorschau Anzeigen",
        "phonology.generation_failed": "KI-Generierung fehlgeschlagen. Überprüfen Sie den API-Schlüssel oder versuchen Sie es erneut."
    },
    "pt": {
        "phonology.replace_confirm": "Isto SUBSTITUIRÁ sua fonologia atual. Tem certeza?",
        "phonology.clear_confirm": "Tem certeza de que deseja limpar todos os fonemas?",
        "phonology.hide_preview": "Ocultar Visualização",
        "phonology.show_preview": "Mostrar Visualização IA",
        "phonology.generation_failed": "Falha na geração IA. Verifique a chave API ou tente novamente."
    },
    "it": {
        "phonology.replace_confirm": "Questo SOSTITUIRÀ la tua fonologia attuale. Sei sicuro?",
        "phonology.clear_confirm": "Sei sicuro di voler cancellare tutti i fonemi?",
        "phonology.hide_preview": "Nascondi Anteprima",
        "phonology.show_preview": "Mostra Anteprima IA",
        "phonology.generation_failed": "Generazione IA fallita. Controlla la chiave API o riprova."
    },
    "ru": {
        "phonology.replace_confirm": "Это ЗАМЕНИТ вашу текущую фонологию. Вы уверены?",
        "phonology.clear_confirm": "Вы уверены, что хотите очистить все фонемы?",
        "phonology.hide_preview": "Скрыть Предпросмотр",
        "phonology.show_preview": "Показать Предпросмотр ИИ",
        "phonology.generation_failed": "Сбой генерации ИИ. Проверьте ключ API или попробуйте снова."
    },
    "ja": {
        "phonology.replace_confirm": "これにより現在の音韻論が置き換えられます。よろしいですか？",
        "phonology.clear_confirm": "すべての音素をクリアしてもよろしいですか？",
        "phonology.hide_preview": "プレビューを隠す",
        "phonology.show_preview": "AIプレビューを表示",
        "phonology.generation_failed": "AI生成に失敗しました。APIキーを確認するか、もう一度お試しください。"
    },
    "zh": {
        "phonology.replace_confirm": "这将替换您当前的音系。您确定吗？",
        "phonology.clear_confirm": "您确定要清除所有音素吗？",
        "phonology.hide_preview": "隐藏预览",
        "phonology.show_preview": "显示AI预览",
        "phonology.generation_failed": "AI生成失败。请检查API密钥或重试。"
    },
    "zh-tw": {
        "phonology.replace_confirm": "這將替換您當前的音系。您確定嗎？",
        "phonology.clear_confirm": "您確定要清除所有音素嗎？",
        "phonology.hide_preview": "隱藏預覽",
        "phonology.show_preview": "顯示AI預覽",
        "phonology.generation_failed": "AI生成失敗。請檢查API密鑰或重試。"
    },
    "ko": {
        "phonology.replace_confirm": "현재 음운론이 대체됩니다. 계속하시겠습니까?",
        "phonology.clear_confirm": "모든 음소를 지우시겠습니까?",
        "phonology.hide_preview": "미리보기 숨기기",
        "phonology.show_preview": "AI 미리보기 표시",
        "phonology.generation_failed": "AI 생성 실패. API 키를확인하거나 다시 시도하세요."
    },
    "ar": {
        "phonology.replace_confirm": "سيؤدي هذا إلى استبدال علم الصوتات الحالي. هل أنت متأكد؟",
        "phonology.clear_confirm": "هل أنت متأكد من أنك تريد مسح جميع الأصوات؟",
        "phonology.hide_preview": "إخفاء المعاينة",
        "phonology.show_preview": "إظهار معاينة الذكاء الاصطناعي",
        "phonology.generation_failed": "فشل إنشاء الذكاء الاصطناعي. تحقق من مفتاح API أو حاول مرة أخرى."
    },
    "hi": {
        "phonology.replace_confirm": "यह आपकी वर्तमान ध्वनिविज्ञान को बदल देगा। क्या आप सुनिश्चित हैं?",
        "phonology.clear_confirm": "क्या आप सभी ध्वनियों को साफ करना चाहते हैं?",
        "phonology.hide_preview": "पूर्वावलोकन छुपाएं",
        "phonology.show_preview": "AI पूर्वावलोकन दिखाएं",
        "phonology.generation_failed": "AI जनरेशन विफल। API कुंजी जांचें या पुनः प्रयास करें।"
    }
}

# Add more languages with English as fallback
ALL_LOCALES = [
    "ar", "bn", "cs", "de", "el", "en", "es", "fa", "fi", "fr", "gu", 
    "ha", "he", "hi", "hu", "id", "it", "ja", "jv", "kn", "ko", "ml", 
    "mr", "ms", "nl", "pa", "pcm", "pl", "pt", "ro", "ru", "sr", "sv", 
    "sw", "ta", "te", "th", "tl", "tr", "uk", "ur", "vi", "wuu", "yue",
    "zh-tw", "zh"
]

def add_new_translations():
    print("Agregando nuevas traducciones de fonología...")
    
    for locale in ALL_LOCALES:
        file_path = Path(LOCALES_DIR) / f"{locale}.json"
        
        if not file_path.exists():
            print(f"⚠ {locale}.json no existe")
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Obtener traducciones para este idioma o usar inglés como fallback
        translations = NEW_TRANSLATIONS.get(locale, NEW_TRANSLATIONS["en"])
        
        added = 0
        for key, value in translations.items():
            if key not in data:
                data[key] = value
                added += 1
        
        if added > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            print(f"✓ {locale}.json: agregadas {added} traducciones")
        else:
            print(f"  {locale}.json: ya actualizado")
    
    print("\n✓ ¡Proceso completado!")

if __name__ == "__main__":
    add_new_translations()
