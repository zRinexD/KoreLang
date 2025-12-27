import json
from pathlib import Path

LOCALES_DIR = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\locales"

# TODOS los 45 idiomas con traducciones completas
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
        "phonology.generation_failed": "AI 생성 실패. API 키를 확인하거나 다시 시도하세요."
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
    },
    "bn": {
        "phonology.replace_confirm": "এটি আপনার বর্তমান ধ্বনিবিদ্যা প্রতিস্থাপন করবে। আপনি কি নিশ্চিত?",
        "phonology.clear_confirm": "আপনি কি সমস্ত ধ্বনি মুছে ফেলতে চান?",
        "phonology.hide_preview": "প্রিভিউ লুকান",
        "phonology.show_preview": "AI প্রিভিউ দেখান",
        "phonology.generation_failed": "AI জেনারেশন ব্যর্থ হয়েছে। API কী পরীক্ষা করুন বা পুনরায় চেষ্টা করুন।"
    },
    "tr": {
        "phonology.replace_confirm": "Bu mevcut fonolojiyi DEĞİŞTİRECEK. Emin misiniz?",
        "phonology.clear_confirm": "Tüm fonemleri temizlemek istediğinizden emin misiniz?",
        "phonology.hide_preview": "Önizlemeyi Gizle",
        "phonology.show_preview": "AI Önizlemesi Göster",
        "phonology.generation_failed": "AI oluşturma başarısız oldu. API anahtarını kontrol edin veya tekrar deneyin."
    },
    "vi": {
        "phonology.replace_confirm": "Điều này sẽ THAY THẾ hệ thống âm vị hiện tại của bạn. Bạn có chắc không?",
        "phonology.clear_confirm": "Bạn có chắc chắn muốn xóa tất cả các âm vị không?",
        "phonology.hide_preview": "Ẩn Xem Trước",
        "phonology.show_preview": "Hiển Thị Xem Trước AI",
        "phonology.generation_failed": "Tạo AI thất bại. Kiểm tra khóa API hoặc thử lại."
    },
    "th": {
        "phonology.replace_confirm": "นี่จะแทนที่ระบบเสียงปัจจุบันของคุณ คุณแน่ใจหรือไม่?",
        "phonology.clear_confirm": "คุณแน่ใจหรือไม่ว่าต้องการล้างหน่วยเสียงทั้งหมด?",
        "phonology.hide_preview": "ซ่อนตัวอย่าง",
        "phonology.show_preview": "แสดงตัวอย่าง AI",
        "phonology.generation_failed": "การสร้าง AI ล้มเหลว ตรวจสอบคีย์ API หรือลองอีกครั้ง"
    },
    "id": {
        "phonology.replace_confirm": "Ini akan MENGGANTIKAN fonologi Anda saat ini. Apakah Anda yakin?",
        "phonology.clear_confirm": "Apakah Anda yakin ingin menghapus semua fonem?",
        "phonology.hide_preview": "Sembunyikan Pratinjau",
        "phonology.show_preview": "Tampilkan Pratinjau AI",
        "phonology.generation_failed": "Pembuatan AI gagal. Periksa kunci API atau coba lagi."
    },
    "ms": {
        "phonology.replace_confirm": "Ini akan MENGGANTIKAN fonologi semasa anda. Adakah anda pasti?",
        "phonology.clear_confirm": "Adakah anda pasti mahu mengosongkan semua fonem?",
        "phonology.hide_preview": "Sembunyikan Pratonton",
        "phonology.show_preview": "Tunjukkan Pratonton AI",
        "phonology.generation_failed": "Penjanaan AI gagal. Semak kunci API atau cuba lagi."
    },
    "tl": {
        "phonology.replace_confirm": "Ito ay PAPALITAN ang iyong kasalukuyang ponolohiya. Sigurado ka ba?",
        "phonology.clear_confirm": "Sigurado ka bang gusto mong burahin ang lahat ng ponema?",
        "phonology.hide_preview": "Itago ang Preview",
        "phonology.show_preview": "Ipakita ang AI Preview",
        "phonology.generation_failed": "Nabigo ang AI Generation. Suriin ang API Key o subukan muli."
    },
    "nl": {
        "phonology.replace_confirm": "Dit zal uw huidige fonologie VERVANGEN. Weet u het zeker?",
        "phonology.clear_confirm": "Weet u zeker dat u alle fonemen wilt wissen?",
        "phonology.hide_preview": "Verberg Voorbeeld",
        "phonology.show_preview": "Toon AI-voorbeeld",
        "phonology.generation_failed": "AI-generatie mislukt. Controleer de API-sleutel of probeer het opnieuw."
    },
    "pl": {
        "phonology.replace_confirm": "To ZASTĄPI twoją obecną fonologię. Czy jesteś pewien?",
        "phonology.clear_confirm": "Czy na pewno chcesz usunąć wszystkie fonemy?",
        "phonology.hide_preview": "Ukryj Podgląd",
        "phonology.show_preview": "Pokaż Podgląd AI",
        "phonology.generation_failed": "Generowanie AI nie powiodło się. Sprawdź klucz API lub spróbuj ponownie."
    },
    "uk": {
        "phonology.replace_confirm": "Це ЗАМІНИТЬ вашу поточну фонологію. Ви впевнені?",
        "phonology.clear_confirm": "Ви впевнені, що хочете очистити всі фонеми?",
        "phonology.hide_preview": "Сховати Попередній Перегляд",
        "phonology.show_preview": "Показати Попередній Перегляд ШІ",
        "phonology.generation_failed": "Збій генерації ШІ. Перевірте ключ API або спробуйте ще раз."
    },
    "ro": {
        "phonology.replace_confirm": "Aceasta va ÎNLOCUI fonologia curentă. Sunteți sigur?",
        "phonology.clear_confirm": "Sigur doriți să ștergeți toate fonemele?",
        "phonology.hide_preview": "Ascunde Previzualizarea",
        "phonology.show_preview": "Arată Previzualizarea AI",
        "phonology.generation_failed": "Generarea AI a eșuat. Verificați cheia API sau încercați din nou."
    },
    "cs": {
        "phonology.replace_confirm": "Toto NAHRADÍ vaši současnou fonologii. Jste si jisti?",
        "phonology.clear_confirm": "Opravdu chcete vymazat všechny fonémy?",
        "phonology.hide_preview": "Skrýt Náhled",
        "phonology.show_preview": "Zobrazit AI Náhled",
        "phonology.generation_failed": "Generování AI selhalo. Zkontrolujte klíč API nebo to zkuste znovu."
    },
    "el": {
        "phonology.replace_confirm": "Αυτό θα ΑΝΤΙΚΑΤΑΣΤΗΣΕΙ την τρέχουσα φωνολογία σας. Είστε σίγουροι;",
        "phonology.clear_confirm": "Είστε σίγουροι ότι θέλετε να διαγράψετε όλα τα φωνήματα;",
        "phonology.hide_preview": "Απόκρυψη Προεπισκόπησης",
        "phonology.show_preview": "Εμφάνιση Προεπισκόπησης AI",
        "phonology.generation_failed": "Η δημιουργία AI απέτυχε. Ελέγξτε το κλειδί API ή δοκιμάστε ξανά."
    },
    "sv": {
        "phonology.replace_confirm": "Detta kommer att ERSÄTTA din nuvarande fonologi. Är du säker?",
        "phonology.clear_confirm": "Är du säker på att du vill rensa alla fonem?",
        "phonology.hide_preview": "Dölj Förhandsgranskning",
        "phonology.show_preview": "Visa AI-förhandsgranskning",
        "phonology.generation_failed": "AI-generering misslyckades. Kontrollera API-nyckeln eller försök igen."
    },
    "fi": {
        "phonology.replace_confirm": "Tämä KORVAA nykyisen fonologian. Oletko varma?",
        "phonology.clear_confirm": "Haluatko varmasti tyhjentää kaikki foneemit?",
        "phonology.hide_preview": "Piilota Esikatselu",
        "phonology.show_preview": "Näytä AI-esikatselu",
        "phonology.generation_failed": "AI-generointi epäonnistui. Tarkista API-avain tai yritä uudelleen."
    },
    "sr": {
        "phonology.replace_confirm": "Ово ће ЗАМЕНИТИ вашу тренутну фонологију. Да ли сте сигурни?",
        "phonology.clear_confirm": "Да ли сте сигурни да желите да обришете све фонеме?",
        "phonology.hide_preview": "Сакриј Преглед",
        "phonology.show_preview": "Прикажи АИ Преглед",
        "phonology.generation_failed": "АИ генерисање није успело. Проверите АПИ кључ или покушајте поново."
    },
    "hu": {
        "phonology.replace_confirm": "Ez LECSERÉLI a jelenlegi fonológiát. Biztos vagy benne?",
        "phonology.clear_confirm": "Biztosan törölni szeretnéd az összes fonémát?",
        "phonology.hide_preview": "Előnézet Elrejtése",
        "phonology.show_preview": "AI Előnézet Megjelenítése",
        "phonology.generation_failed": "Az AI generálás sikertelen. Ellenőrizd az API kulcsot vagy próbáld újra."
    },
    "he": {
        "phonology.replace_confirm": "זה יחליף את הפונולוגיה הנוכחית שלך. האם אתה בטוח?",
        "phonology.clear_confirm": "האם אתה בטוח שברצונך לנקות את כל הפונמות?",
        "phonology.hide_preview": "הסתר תצוגה מקדימה",
        "phonology.show_preview": "הצג תצוגה מקדימה של AI",
        "phonology.generation_failed": "יצירת AI נכשלה. בדוק את מפתח ה-API או נסה שוב."
    },
    "fa": {
        "phonology.replace_confirm": "این فونولوژی فعلی شما را جایگزین خواهد کرد. آیا مطمئن هستید؟",
        "phonology.clear_confirm": "آیا مطمئن هستید که می‌خواهید همه واج‌ها را پاک کنید؟",
        "phonology.hide_preview": "پنهان کردن پیش‌نمایش",
        "phonology.show_preview": "نمایش پیش‌نمایش هوش مصنوعی",
        "phonology.generation_failed": "تولید هوش مصنوعی شکست خورد. کلید API را بررسی کنید یا دوباره امتحان کنید."
    },
    "ur": {
        "phonology.replace_confirm": "یہ آپ کی موجودہ صوتیات کو تبدیل کر دے گا۔ کیا آپ کو یقین ہے؟",
        "phonology.clear_confirm": "کیا آپ کو یقین ہے کہ آپ تمام آوازوں کو صاف کرنا چاہتے ہیں؟",
        "phonology.hide_preview": "پیش نظارہ چھپائیں",
        "phonology.show_preview": "AI پیش نظارہ دکھائیں",
        "phonology.generation_failed": "AI جنریشن ناکام ہو گئی۔ API کلید چیک کریں یا دوبارہ کوشش کریں۔"
    },
    "sw": {
        "phonology.replace_confirm": "Hii itabadilisha fonolojia yako ya sasa. Una uhakika?",
        "phonology.clear_confirm": "Una uhakika unataka kufuta fonemu zote?",
        "phonology.hide_preview": "Ficha Onyesho la Awali",
        "phonology.show_preview": "Onyesha Onyesho la Awali la AI",
        "phonology.generation_failed": "Utengenezaji wa AI umeshindwa. Angalia ufunguo wa API au jaribu tena."
    },
    "ta": {
        "phonology.replace_confirm": "இது உங்கள் தற்போதைய ஒலியியலை மாற்றும். நீங்கள் உறுதியாக இருக்கிறீர்களா?",
        "phonology.clear_confirm": "அனைத்து ஒலிகளையும் அழிக்க விரும்புகிறீர்களா?",
        "phonology.hide_preview": "முன்னோட்டத்தை மறை",
        "phonology.show_preview": "AI முன்னோட்டத்தைக் காட்டு",
        "phonology.generation_failed": "AI உருவாக்கம் தோல்வியடைந்தது. API விசையைச் சரிபார்க்கவும் அல்லது மீண்டும் முயற்சிக்கவும்."
    },
    "te": {
        "phonology.replace_confirm": "ఇది మీ ప్రస్తుత ధ్వనిశాస్త్రాన్ని భర్తీ చేస్తుంది. మీరు ఖచ్చితంగా ఉన్నారా?",
        "phonology.clear_confirm": "మీరు అన్ని ధ్వనులను క్లియర్ చేయాలనుకుంటున్నారా?",
        "phonology.hide_preview": "ప్రివ్యూను దాచు",
        "phonology.show_preview": "AI ప్రివ్యూను చూపించు",
        "phonology.generation_failed": "AI జనరేషన్ విఫలమైంది. API కీని తనిఖీ చేయండి లేదా మళ్లీ ప్రయత్నించండి."
    },
    "kn": {
        "phonology.replace_confirm": "ಇದು ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಧ್ವನಿಶಾಸ್ತ್ರವನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ. ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?",
        "phonology.clear_confirm": "ನೀವು ಎಲ್ಲಾ ಧ್ವನಿಗಳನ್ನು ತೆರವುಗೊಳಿಸಲು ಬಯಸುತ್ತೀರಾ?",
        "phonology.hide_preview": "ಪೂರ್ವವೀಕ್ಷಣೆಯನ್ನು ಮರೆಮಾಡಿ",
        "phonology.show_preview": "AI ಪೂರ್ವವೀಕ್ಷಣೆಯನ್ನು ತೋರಿಸಿ",
        "phonology.generation_failed": "AI ಉತ್ಪಾದನೆ ವಿಫಲವಾಗಿದೆ. API ಕೀಲಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
    },
    "ml": {
        "phonology.replace_confirm": "ഇത് നിങ്ങളുടെ നിലവിലെ സ്വരശാസ്ത്രം മാറ്റിസ്ഥാപിക്കും. നിങ്ങൾക്ക് ഉറപ്പാണോ?",
        "phonology.clear_confirm": "എല്ലാ ശബ്ദങ്ങളും മായ്‌ക്കണമെന്ന് നിങ്ങൾക്ക് ഉറപ്പാണോ?",
        "phonology.hide_preview": "പ്രിവ്യൂ മറയ്ക്കുക",
        "phonology.show_preview": "AI പ്രിവ്യൂ കാണിക്കുക",
        "phonology.generation_failed": "AI ജനറേഷൻ പരാജയപ്പെട്ടു. API കീ പരിശോധിക്കുക അല്ലെങ്കിൽ വീണ്ടും ശ്രമിക്കുക."
    },
    "mr": {
        "phonology.replace_confirm": "हे तुमचे सध्याचे ध्वनीशास्त्र बदलेल. तुम्हाला खात्री आहे का?",
        "phonology.clear_confirm": "तुम्हाला सर्व ध्वनी साफ करायचे आहेत का?",
        "phonology.hide_preview": "पूर्वावलोकन लपवा",
        "phonology.show_preview": "AI पूर्वावलोकन दाखवा",
        "phonology.generation_failed": "AI निर्मिती अयशस्वी झाली. API की तपासा किंवा पुन्हा प्रयत्न करा."
    },
    "gu": {
        "phonology.replace_confirm": "આ તમારી વર્તમાન ધ્વનિશાસ્ત્રને બદલશે. તમે ખાતરી કરો છો?",
        "phonology.clear_confirm": "શું તમે ખરેખર બધા ધ્વનિને સાફ કરવા માંગો છો?",
        "phonology.hide_preview": "પૂર્વાવલોકન છુપાવો",
        "phonology.show_preview": "AI પૂર્વાવલોકન બતાવો",
        "phonology.generation_failed": "AI જનરેશન નિષ્ફળ થયું. API કી તપાસો અથવા ફરી પ્રયાસ કરો."
    },
    "pa": {
        "phonology.replace_confirm": "ਇਹ ਤੁਹਾਡੀ ਮੌਜੂਦਾ ਧੁਨੀ ਵਿਗਿਆਨ ਨੂੰ ਬਦਲ ਦੇਵੇਗਾ। ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਹੋ?",
        "phonology.clear_confirm": "ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਹੋ ਕਿ ਤੁਸੀਂ ਸਾਰੀਆਂ ਧੁਨੀਆਂ ਨੂੰ ਸਾਫ਼ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
        "phonology.hide_preview": "ਪੂਰਵਦਰਸ਼ਨ ਲੁਕਾਓ",
        "phonology.show_preview": "AI ਪੂਰਵਦਰਸ਼ਨ ਦਿਖਾਓ",
        "phonology.generation_failed": "AI ਜਨਰੇਸ਼ਨ ਅਸਫਲ ਰਹੀ। API ਕੁੰਜੀ ਦੀ ਜਾਂਚ ਕਰੋ ਜਾਂ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।"
    },
    "jv": {
        "phonology.replace_confirm": "Iki bakal NGGANTI fonologi sampeyan saiki. Sampeyan yakin?",
        "phonology.clear_confirm": "Sampeyan yakin arep mbusak kabeh fonem?",
        "phonology.hide_preview": "Dhelikake Pratinjau",
        "phonology.show_preview": "Tuduhake Pratinjau AI",
        "phonology.generation_failed": "Generasi AI gagal. Priksa kunci API utawa coba maneh."
    },
    "pcm": {
        "phonology.replace_confirm": "Dis go REPLACE your current phonology. You sure?",
        "phonology.clear_confirm": "You sure say you wan clear all phonemes?",
        "phonology.hide_preview": "Hide Preview",
        "phonology.show_preview": "Show AI Preview",
        "phonology.generation_failed": "AI Generation don fail. Check API Key or try again."
    },
    "ha": {
        "phonology.replace_confirm": "Wannan zai MAYE GURBIN ilimin sautin ku na yanzu. Kun tabbata?",
        "phonology.clear_confirm": "Kun tabbata kuna son share duk sautunan?",
        "phonology.hide_preview": "Ɓoye Samfoti",
        "phonology.show_preview": "Nuna Samfoti na AI",
        "phonology.generation_failed": "AI ta kasa ƙirƙira. Bincika maɓallin API ko sake gwadawa."
    },
    "yue": {
        "phonology.replace_confirm": "呢個會替換你而家嘅語音系統。你確定嗎？",
        "phonology.clear_confirm": "你確定要清除所有音素嗎？",
        "phonology.hide_preview": "隱藏預覽",
        "phonology.show_preview": "顯示AI預覽",
        "phonology.generation_failed": "AI生成失敗。請檢查API密鑰或重試。"
    },
    "wuu": {
        "phonology.replace_confirm": "这将替换侬当前个语音系统。侬确定伐？",
        "phonology.clear_confirm": "侬确定要清除所有音素伐？",
        "phonology.hide_preview": "隐藏预览",
        "phonology.show_preview": "显示AI预览",
        "phonology.generation_failed": "AI生成失败。请检查API密钥或重试。"
    }
}

ALL_LOCALES = [
    "ar", "bn", "cs", "de", "el", "en", "es", "fa", "fi", "fr", "gu", 
    "ha", "he", "hi", "hu", "id", "it", "ja", "jv", "kn", "ko", "ml", 
    "mr", "ms", "nl", "pa", "pcm", "pl", "pt", "ro", "ru", "sr", "sv", 
    "sw", "ta", "te", "th", "tl", "tr", "uk", "ur", "vi", "wuu", "yue",
    "zh-tw", "zh"
]

def update_all_translations():
    print("Actualizando TODAS las traducciones a los idiomas nativos...")
    
    for locale in ALL_LOCALES:
        file_path = Path(LOCALES_DIR) / f"{locale}.json"
        
        if not file_path.exists():
            print(f"⚠ {locale}.json no existe")
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Obtener traducciones para este idioma
        if locale in NEW_TRANSLATIONS:
            translations = NEW_TRANSLATIONS[locale]
            updated = 0
            
            for key, value in translations.items():
                # Sobrescribir si existe o agregar si no existe
                if key in data:
                    if data[key] != value:  # Solo actualizar si es diferente
                        data[key] = value
                        updated += 1
                else:
                    data[key] = value
                    updated += 1
            
            if updated > 0:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=4)
                print(f"✓ {locale}.json: actualizadas {updated} traducciones")
            else:
                print(f"  {locale}.json: ya actualizado")
        else:
            print(f"⚠ {locale}: No hay traducciones definidas")
    
    print("\n✓ ¡Todas las traducciones actualizadas!")

if __name__ == "__main__":
    update_all_translations()
