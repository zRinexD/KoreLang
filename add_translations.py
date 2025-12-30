import json
import os
from pathlib import Path

# Define the base directory for locales
LOCALES_DIR = r"c:\Users\LENOVO\OneDrive\Documentos\KL\KoreLang-1.1.1\KoreLang-Language_update\src\locales"

# New translation keys to add (English versions)
NEW_KEYS = {
    "console.table_original": "Original",
    "console.table_fidelity": "Fidelity",
    "console.table_ai_proposal": "AI Proposal (Editable)",
    "console.proposals_review": "Proposals generated. Review staging table:",
    "console.repair_aborted": "Repair session aborted.",
    "console.ai_pipeline_failed": "AI pipeline failed.",
    "console.ai_applied_count": "AI applied: {{count}} words modified.",
    "common.apply": "Apply Changes",
    "phonology.vowel_front": "Front",
    "phonology.vowel_central": "Central",
    "phonology.vowel_back": "Back"
}

# Translations for all supported languages
TRANSLATIONS = {
    "es": {  # Spanish
        "console.table_original": "Original",
        "console.table_fidelity": "Fidelidad",
        "console.table_ai_proposal": "Propuesta IA (Editable)",
        "console.proposals_review": "Propuestas generadas. Revise la tabla de staging:",
        "console.repair_aborted": "Sesión de reparación abortada.",
        "console.ai_pipeline_failed": "Fallo en la pipeline de IA.",
        "console.ai_applied_count": "IA aplicada: {{count}} palabras modificadas.",
        "common.apply": "Aplicar Cambios",
        "phonology.vowel_front": "Anterior",
        "phonology.vowel_central": "Central",
        "phonology.vowel_back": "Posterior"
    },
    "fr": {  # French
        "console.table_original": "Original",
        "console.table_fidelity": "Fidélité",
        "console.table_ai_proposal": "Proposition IA (Modifiable)",
        "console.proposals_review": "Propositions générées. Examinez le tableau de staging :",
        "console.repair_aborted": "Session de réparation annulée.",
        "console.ai_pipeline_failed": "Échec du pipeline IA.",
        "console.ai_applied_count": "IA appliquée : {{count}} mots modifiés.",
        "common.apply": "Appliquer les Modifications",
        "phonology.vowel_front": "Antérieur",
        "phonology.vowel_central": "Central",
        "phonology.vowel_back": "Postérieur"
    },
    "de": {  # German
        "console.table_original": "Original",
        "console.table_fidelity": "Genauigkeit",
        "console.table_ai_proposal": "KI-Vorschlag (Bearbeitbar)",
        "console.proposals_review": "Vorschläge generiert. Überprüfen Sie die Staging-Tabelle:",
        "console.repair_aborted": "Reparatursitzung abgebrochen.",
        "console.ai_pipeline_failed": "KI-Pipeline fehlgeschlagen.",
        "console.ai_applied_count": "KI angewendet: {{count}} Wörter geändert.",
        "common.apply": "Änderungen Übernehmen",
        "phonology.vowel_front": "Vorn",
        "phonology.vowel_central": "Zentral",
        "phonology.vowel_back": "Hinten"
    },
    "pt": {  # Portuguese
        "console.table_original": "Original",
        "console.table_fidelity": "Fidelidade",
        "console.table_ai_proposal": "Proposta IA (Editável)",
        "console.proposals_review": "Propostas geradas. Revise a tabela de staging:",
        "console.repair_aborted": "Sessão de reparo abortada.",
        "console.ai_pipeline_failed": "Falha no pipeline de IA.",
        "console.ai_applied_count": "IA aplicada: {{count}} palavras modificadas.",
        "common.apply": "Aplicar Alterações",
        "phonology.vowel_front": "Frontal",
        "phonology.vowel_central": "Central",
        "phonology.vowel_back": "Posterior"
    },
    "it": {  # Italian
        "console.table_original": "Originale",
        "console.table_fidelity": "Fedeltà",
        "console.table_ai_proposal": "Proposta IA (Modificabile)",
        "console.proposals_review": "Proposte generate. Rivedi la tabella di staging:",
        "console.repair_aborted": "Sessione di riparazione annullata.",
        "console.ai_pipeline_failed": "Pipeline IA fallita.",
        "console.ai_applied_count": "IA applicata: {{count}} parole modificate.",
        "common.apply": "Applica Modifiche",
        "phonology.vowel_front": "Anteriore",
        "phonology.vowel_central": "Centrale",
        "phonology.vowel_back": "Posteriore"
    },
    "ru": {  # Russian
        "console.table_original": "Оригинал",
        "console.table_fidelity": "Точность",
        "console.table_ai_proposal": "Предложение ИИ (Редактируемое)",
        "console.proposals_review": "Предложения сгенерированы. Просмотрите промежуточную таблицу:",
        "console.repair_aborted": "Сеанс восстановления прерван.",
        "console.ai_pipeline_failed": "Сбой конвейера ИИ.",
        "console.ai_applied_count": "ИИ применён: {{count}} слов изменено.",
        "common.apply": "Применить Изменения",
        "phonology.vowel_front": "Передний",
        "phonology.vowel_central": "Центральный",
        "phonology.vowel_back": "Задний"
    },
    "ja": {  # Japanese
        "console.table_original": "オリジナル",
        "console.table_fidelity": "忠実度",
        "console.table_ai_proposal": "AI提案（編集可能）",
        "console.proposals_review": "提案が生成されました。ステージングテーブルを確認してください：",
        "console.repair_aborted": "修復セッションが中止されました。",
        "console.ai_pipeline_failed": "AIパイプラインが失敗しました。",
        "console.ai_applied_count": "AI適用：{{count}}語が変更されました。",
        "common.apply": "変更を適用",
        "phonology.vowel_front": "前舌",
        "phonology.vowel_central": "中舌",
        "phonology.vowel_back": "後舌"
    },
    "zh": {  # Chinese (Simplified)
        "console.table_original": "原始",
        "console.table_fidelity": "保真度",
        "console.table_ai_proposal": "AI建议（可编辑）",
        "console.proposals_review": "已生成提案。查看暂存表：",
        "console.repair_aborted": "修复会话已中止。",
        "console.ai_pipeline_failed": "AI流水线失败。",
        "console.ai_applied_count": "AI已应用：{{count}}个单词已修改。",
        "common.apply": "应用更改",
        "phonology.vowel_front": "前",
        "phonology.vowel_central": "中",
        "phonology.vowel_back": "后"
    },
    "zh-tw": {  # Chinese (Traditional)
        "console.table_original": "原始",
        "console.table_fidelity": "保真度",
        "console.table_ai_proposal": "AI建議（可編輯）",
        "console.proposals_review": "已生成提案。查看暫存表：",
        "console.repair_aborted": "修復會話已中止。",
        "console.ai_pipeline_failed": "AI流水線失敗。",
        "console.ai_applied_count": "AI已應用：{{count}}個單詞已修改。",
        "common.apply": "應用更改",
        "phonology.vowel_front": "前",
        "phonology.vowel_central": "中",
        "phonology.vowel_back": "後"
    },
    "ko": {  # Korean
        "console.table_original": "원본",
        "console.table_fidelity": "충실도",
        "console.table_ai_proposal": "AI 제안 (편집 가능)",
        "console.proposals_review": "제안이 생성되었습니다. 스테이징 테이블을 검토하세요:",
        "console.repair_aborted": "복구 세션이 중단되었습니다.",
        "console.ai_pipeline_failed": "AI 파이프라인이 실패했습니다.",
        "console.ai_applied_count": "AI 적용됨: {{count}}개 단어 수정됨.",
        "common.apply": "변경사항 적용",
        "phonology.vowel_front": "전설",
        "phonology.vowel_central": "중설",
        "phonology.vowel_back": "후설"
    },
    "ar": {  # Arabic
        "console.table_original": "الأصلي",
        "console.table_fidelity": "الدقة",
        "console.table_ai_proposal": "اقتراح الذكاء الاصطناعي (قابل للتحرير)",
        "console.proposals_review": "تم إنشاء المقترحات. راجع جدول التدريج:",
        "console.repair_aborted": "تم إحباط جلسة الإصلاح.",
        "console.ai_pipeline_failed": "فشل خط أنابيب الذكاء الاصطناعي.",
        "console.ai_applied_count": "تم تطبيق الذكاء الاصطناعي: تم تعديل {{count}} كلمة.",
        "common.apply": "تطبيق التغييرات",
        "phonology.vowel_front": "أمامي",
        "phonology.vowel_central": "وسط",
        "phonology.vowel_back": "خلفي"
    },
    "hi": {  # Hindi
        "console.table_original": "मूल",
        "console.table_fidelity": "निष्ठा",
        "console.table_ai_proposal": "AI प्रस्ताव (संपादन योग्य)",
        "console.proposals_review": "प्रस्ताव जेनरेट किए गए। स्टेजिंग तालिका की समीक्षा करें:",
        "console.repair_aborted": "मरम्मत सत्र रद्द कर दिया गया।",
        "console.ai_pipeline_failed": "AI पाइपलाइन विफल रही।",
        "console.ai_applied_count": "AI लागू किया गया: {{count}} शब्द संशोधित किए गए।",
        "common.apply": "परिवर्तन लागू करें",
        "phonology.vowel_front": "अग्र",
        "phonology.vowel_central": "मध्य",
        "phonology.vowel_back": "पश्च"
    },
    "bn": {  # Bengali
        "console.table_original": "মূল",
        "console.table_fidelity": "বিশ্বস্ততা",
        "console.table_ai_proposal": "AI প্রস্তাব (সম্পাদনাযোগ্য)",
        "console.proposals_review": "প্রস্তাবগুলি তৈরি করা হয়েছে। স্টেজিং টেবিল পর্যালোচনা করুন:",
        "console.repair_aborted": "মেরামত সেশন বাতিল করা হয়েছে।",
        "console.ai_pipeline_failed": "AI পাইপলাইন ব্যর্থ হয়েছে।",
        "console.ai_applied_count": "AI প্রয়োগ করা হয়েছে: {{count}}টি শব্দ পরিবর্তন করা হয়েছে।",
        "common.apply": "পরিবর্তন প্রয়োগ করুন",
        "phonology.vowel_front": "সামনে",
        "phonology.vowel_central": "কেন্দ্রীয়",
        "phonology.vowel_back": "পিছনে"
    },
    "tr": {  # Turkish
        "console.table_original": "Orijinal",
        "console.table_fidelity": "Doğruluk",
        "console.table_ai_proposal": "AI Önerisi (Düzenlenebilir)",
        "console.proposals_review": "Öneriler oluşturuldu. Hazırlama tablosunu gözden geçirin:",
        "console.repair_aborted": "Onarım oturumu iptal edildi.",
        "console.ai_pipeline_failed": "AI hattı başarısız oldu.",
        "console.ai_applied_count": "AI uygulandı: {{count}} kelime değiştirildi.",
        "common.apply": "Değişiklikleri Uygula",
        "phonology.vowel_front": "Ön",
        "phonology.vowel_central": "Orta",
        "phonology.vowel_back": "Arka"
    },
    "vi": {  # Vietnamese
        "console.table_original": "Gốc",
        "console.table_fidelity": "Độ chính xác",
        "console.table_ai_proposal": "Đề xuất AI (Có thể chỉnh sửa)",
        "console.proposals_review": "Đã tạo các đề xuất. Xem lại bảng tạm:",
        "console.repair_aborted": "Phiên sửa chữa đã bị hủy bỏ.",
        "console.ai_pipeline_failed": "Đường ống AI thất bại.",
        "console.ai_applied_count": "AI đã áp dụng: {{count}} từ đã được sửa đổi.",
        "common.apply": "Áp dụng Thay đổi",
        "phonology.vowel_front": "Trước",
        "phonology.vowel_central": "Giữa",
        "phonology.vowel_back": "Sau"
    },
    "th": {  # Thai
        "console.table_original": "ต้นฉบับ",
        "console.table_fidelity": "ความแม่นยำ",
        "console.table_ai_proposal": "ข้อเสนอ AI (แก้ไขได้)",
        "console.proposals_review": "สร้างข้อเสนอแล้ว ตรวจสอบตารางชั่วคราว:",
        "console.repair_aborted": "เซสชันการซ่อมแซมถูกยกเลิก",
        "console.ai_pipeline_failed": "ไปป์ไลน์ AI ล้มเหลว",
        "console.ai_applied_count": "AI ถูกนำไปใช้: แก้ไข {{count}} คำ",
        "common.apply": "ใช้การเปลี่ยนแปลง",
        "phonology.vowel_front": "หน้า",
        "phonology.vowel_central": "กลาง",
        "phonology.vowel_back": "หลัง"
    },
    "id": {  # Indonesian
        "console.table_original": "Asli",
        "console.table_fidelity": "Kesetiaan",
        "console.table_ai_proposal": "Usulan AI (Dapat Diedit)",
        "console.proposals_review": "Usulan dibuat. Tinjau tabel staging:",
        "console.repair_aborted": "Sesi perbaikan dibatalkan.",
        "console.ai_pipeline_failed": "Pipeline AI gagal.",
        "console.ai_applied_count": "AI diterapkan: {{count}} kata dimodifikasi.",
        "common.apply": "Terapkan Perubahan",
        "phonology.vowel_front": "Depan",
        "phonology.vowel_central": "Tengah",
        "phonology.vowel_back": "Belakang"
    },
    "ms": {  # Malay
        "console.table_original": "Asal",
        "console.table_fidelity": "Kesetiaan",
        "console.table_ai_proposal": "Cadangan AI (Boleh Diedit)",
        "console.proposals_review": "Cadangan dijana. Semak jadual peringkat:",
        "console.repair_aborted": "Sesi pembaikan dibatalkan.",
        "console.ai_pipeline_failed": "Saluran paip AI gagal.",
        "console.ai_applied_count": "AI digunakan: {{count}} perkataan diubah suai.",
        "common.apply": "Gunakan Perubahan",
        "phonology.vowel_front": "Hadapan",
        "phonology.vowel_central": "Tengah",
        "phonology.vowel_back": "Belakang"
    },
    "tl": {  # Tagalog/Filipino
        "console.table_original": "Orihinal",
        "console.table_fidelity": "Katapatan",
        "console.table_ai_proposal": "Mungkahi ng AI (Maaaring I-edit)",
        "console.proposals_review": "Nabuo ang mga mungkahi. Suriin ang staging table:",
        "console.repair_aborted": "Kinansela ang sesyon ng pag-aayos.",
        "console.ai_pipeline_failed": "Nabigo ang AI pipeline.",
        "console.ai_applied_count": "Inilapat ang AI: {{count}} salita ang binago.",
        "common.apply": "Ilapat ang mga Pagbabago",
        "phonology.vowel_front": "Harap",
        "phonology.vowel_central": "Gitna",
        "phonology.vowel_back": "Likod"
    },
    "nl": {  # Dutch
        "console.table_original": "Origineel",
        "console.table_fidelity": "Nauwkeurigheid",
        "console.table_ai_proposal": "AI-voorstel (Bewerkbaar)",
        "console.proposals_review": "Voorstellen gegenereerd. Bekijk de staging-tabel:",
        "console.repair_aborted": "Herstelsessie afgebroken.",
        "console.ai_pipeline_failed": "AI-pijplijn mislukt.",
        "console.ai_applied_count": "AI toegepast: {{count}} woorden gewijzigd.",
        "common.apply": "Wijzigingen Toepassen",
        "phonology.vowel_front": "Voor",
        "phonology.vowel_central": "Centraal",
        "phonology.vowel_back": "Achter"
    },
    "pl": {  # Polish
        "console.table_original": "Oryginalny",
        "console.table_fidelity": "Wierność",
        "console.table_ai_proposal": "Propozycja AI (Edytowalna)",
        "console.proposals_review": "Wygenerowano propozycje. Sprawdź tabelę przejściową:",
        "console.repair_aborted": "Sesja naprawy przerwana.",
        "console.ai_pipeline_failed": "Potok AI nie powiódł się.",
        "console.ai_applied_count": "Zastosowano AI: zmodyfikowano {{count}} słów.",
        "common.apply": "Zastosuj Zmiany",
        "phonology.vowel_front": "Przód",
        "phonology.vowel_central": "Środek",
        "phonology.vowel_back": "Tył"
    },
    "uk": {  # Ukrainian
        "console.table_original": "Оригінал",
        "console.table_fidelity": "Точність",
        "console.table_ai_proposal": "Пропозиція ШІ (Редагується)",
        "console.proposals_review": "Пропозиції згенеровано. Перегляньте проміжну таблицю:",
        "console.repair_aborted": "Сеанс відновлення перервано.",
        "console.ai_pipeline_failed": "Збій конвеєра ШІ.",
        "console.ai_applied_count": "ШІ застосовано: {{count}} слів змінено.",
        "common.apply": "Застосувати Зміни",
        "phonology.vowel_front": "Передній",
        "phonology.vowel_central": "Центральний",
        "phonology.vowel_back": "Задній"
    },
    "ro": {  # Romanian
        "console.table_original": "Original",
        "console.table_fidelity": "Fidelitate",
        "console.table_ai_proposal": "Propunere AI (Editabilă)",
        "console.proposals_review": "Propuneri generate. Revizuiți tabelul de pregătire:",
        "console.repair_aborted": "Sesiune de reparare anulată.",
        "console.ai_pipeline_failed": "Conducta AI a eșuat.",
        "console.ai_applied_count": "AI aplicat: {{count}} cuvinte modificate.",
        "common.apply": "Aplicați Modificările",
        "phonology.vowel_front": "Anterior",
        "phonology.vowel_central": "Central",
        "phonology.vowel_back": "Posterior"
    },
    "cs": {  # Czech
        "console.table_original": "Původní",
        "console.table_fidelity": "Věrnost",
        "console.table_ai_proposal": "Návrh AI (Editovatelný)",
        "console.proposals_review": "Návrhy vygenerovány. Zkontrolujte přechodovou tabulku:",
        "console.repair_aborted": "Relace opravy přerušena.",
        "console.ai_pipeline_failed": "AI pipeline selhalo.",
        "console.ai_applied_count": "AI použito: {{count}} slov změněno.",
        "common.apply": "Použít Změny",
        "phonology.vowel_front": "Přední",
        "phonology.vowel_central": "Střední",
        "phonology.vowel_back": "Zadní"
    },
    "el": {  # Greek
        "console.table_original": "Πρωτότυπο",
        "console.table_fidelity": "Πιστότητα",
        "console.table_ai_proposal": "Πρόταση AI (Επεξεργάσιμη)",
        "console.proposals_review": "Δημιουργήθηκαν προτάσεις. Ελέγξτε τον πίνακα σταδιοποίησης:",
        "console.repair_aborted": "Η συνεδρία επιδιόρθωσης ματαιώθηκε.",
        "console.ai_pipeline_failed": "Η διαδικασία AI απέτυχε.",
        "console.ai_applied_count": "Εφαρμόστηκε AI: {{count}} λέξεις τροποποιήθηκαν.",
        "common.apply": "Εφαρμογή Αλλαγών",
        "phonology.vowel_front": "Μπροστινό",
        "phonology.vowel_central": "Κεντρικό",
        "phonology.vowel_back": "Πίσω"
    },
    "sv": {  # Swedish
        "console.table_original": "Original",
        "console.table_fidelity": "Noggrannhet",
        "console.table_ai_proposal": "AI-förslag (Redigerbar)",
        "console.proposals_review": "Förslag genererade. Granska mellantabellen:",
        "console.repair_aborted": "Reparationssession avbruten.",
        "console.ai_pipeline_failed": "AI-pipeline misslyckades.",
        "console.ai_applied_count": "AI tillämpad: {{count}} ord ändrade.",
        "common.apply": "Tillämpa Ändringar",
        "phonology.vowel_front": "Främre",
        "phonology.vowel_central": "Central",
        "phonology.vowel_back": "Bakre"
    },
    "fi": {  # Finnish
        "console.table_original": "Alkuperäinen",
        "console.table_fidelity": "Tarkkuus",
        "console.table_ai_proposal": "AI-ehdotus (Muokattava)",
        "console.proposals_review": "Ehdotukset luotu. Tarkista väliaikainen taulukko:",
        "console.repair_aborted": "Korjausistunto keskeytetty.",
        "console.ai_pipeline_failed": "AI-putki epäonnistui.",
        "console.ai_applied_count": "AI sovellettu: {{count}} sanaa muokattu.",
        "common.apply": "Käytä Muutoksia",
        "phonology.vowel_front": "Etu",
        "phonology.vowel_central": "Keski",
        "phonology.vowel_back": "Taka"
    },
    "sr": {  # Serbian
        "console.table_original": "Оригинал",
        "console.table_fidelity": "Тачност",
        "console.table_ai_proposal": "АИ предлог (Може се уређивати)",
        "console.proposals_review": "Предлози генерисани. Прегледајте табелу припреме:",
        "console.repair_aborted": "Сесија поправке прекинута.",
        "console.ai_pipeline_failed": "АИ пајплајн није успео.",
        "console.ai_applied_count": "АИ примењен: {{count}} речи измењено.",
        "common.apply": "Примени Промене",
        "phonology.vowel_front": "Предњи",
        "phonology.vowel_central": "Централни",
        "phonology.vowel_back": "Задњи"
    },
    "hu": {  # Hungarian
        "console.table_original": "Eredeti",
        "console.table_fidelity": "Pontosság",
        "console.table_ai_proposal": "AI javaslat (Szerkeszthető)",
        "console.proposals_review": "Javaslatok létrehozva. Tekintse át az átmeneti táblázatot:",
        "console.repair_aborted": "Javítási munkamenet megszakítva.",
        "console.ai_pipeline_failed": "AI csővezeték sikertelen.",
        "console.ai_applied_count": "AI alkalmazva: {{count}} szó módosítva.",
        "common.apply": "Változtatások Alkalmazása",
        "phonology.vowel_front": "Elülső",
        "phonology.vowel_central": "Középső",
        "phonology.vowel_back": "Hátsó"
    },
    "he": {  # Hebrew
        "console.table_original": "מקורי",
        "console.table_fidelity": "נאמנות",
        "console.table_ai_proposal": "הצעת AI (ניתן לעריכה)",
        "console.proposals_review": "הוצעו הצעות. בדוק את טבלת ההכנה:",
        "console.repair_aborted": "הפעלת התיקון בוטלה.",
        "console.ai_pipeline_failed": "צינור AI נכשל.",
        "console.ai_applied_count": "AI יושם: {{count}} מילים שונו.",
        "common.apply": "החל שינויים",
        "phonology.vowel_front": "קדמי",
        "phonology.vowel_central": "מרכזי",
        "phonology.vowel_back": "אחורי"
    },
    "fa": {  # Persian
        "console.table_original": "اصلی",
        "console.table_fidelity": "دقت",
        "console.table_ai_proposal": "پیشنهاد هوش مصنوعی (قابل ویرایش)",
        "console.proposals_review": "پیشنهادات ایجاد شد. جدول مرحله‌بندی را بررسی کنید:",
        "console.repair_aborted": "جلسه تعمیر لغو شد.",
        "console.ai_pipeline_failed": "خط لوله هوش مصنوعی شکست خورد.",
        "console.ai_applied_count": "هوش مصنوعی اعمال شد: {{count}} کلمه تغییر کرد.",
        "common.apply": "اعمال تغییرات",
        "phonology.vowel_front": "قدامی",
        "phonology.vowel_central": "مرکزی",
        "phonology.vowel_back": "خلفی"
    },
    "ur": {  # Urdu
        "console.table_original": "اصل",
        "console.table_fidelity": "وفاداری",
        "console.table_ai_proposal": "AI تجویز (قابل تدوین)",
        "console.proposals_review": "تجاویز بنائی گئیں۔ سٹیجنگ ٹیبل کا جائزہ لیں:",
        "console.repair_aborted": "مرمت کا سیشن منسوخ کر دیا گیا۔",
        "console.ai_pipeline_failed": "AI پائپ لائن ناکام ہو گئی۔",
        "console.ai_applied_count": "AI لاگو کیا گیا: {{count}} الفاظ تبدیل کیے گئے۔",
        "common.apply": "تبدیلیاں لاگو کریں",
        "phonology.vowel_front": "سامنے",
        "phonology.vowel_central": "وسطی",
        "phonology.vowel_back": "پیچھے"
    },
    "sw": {  # Swahili
        "console.table_original": "Asili",
        "console.table_fidelity": "Uaminifu",
        "console.table_ai_proposal": "Pendekezo la AI (Linaweza Kubadilishwa)",
        "console.proposals_review": "Mapendekezo yameundwa. Kagua jedwali la hatua:",
        "console.repair_aborted": "Kikao cha ukarabati kimefutwa.",
        "console.ai_pipeline_failed": "Bomba la AI limeshindwa.",
        "console.ai_applied_count": "AI imetumika: maneno {{count}} yamebadilishwa.",
        "common.apply": "Tekeleza Mabadiliko",
        "phonology.vowel_front": "Mbele",
        "phonology.vowel_central": "Kati",
        "phonology.vowel_back": "Nyuma"
    },
    "ta": {  # Tamil
        "console.table_original": "அசல்",
        "console.table_fidelity": "உண்மைத்தன்மை",
        "console.table_ai_proposal": "AI முன்மொழிவு (திருத்தக்கூடியது)",
        "console.proposals_review": "முன்மொழிவுகள் உருவாக்கப்பட்டன. அரங்கேற்ற அட்டவணையை மதிப்பாய்வு செய்யவும்:",
        "console.repair_aborted": "பழுது பார்க்கும் அமர்வு ரத்து செய்யப்பட்டது.",
        "console.ai_pipeline_failed": "AI குழாய் தோல்வியடைந்தது.",
        "console.ai_applied_count": "AI பயன்படுத்தப்பட்டது: {{count}} சொற்கள் மாற்றப்பட்டன.",
        "common.apply": "மாற்றங்களைப் பயன்படுத்தவும்",
        "phonology.vowel_front": "முன்",
        "phonology.vowel_central": "மத்திய",
        "phonology.vowel_back": "பின்"
    },
    "te": {  # Telugu
        "console.table_original": "అసలు",
        "console.table_fidelity": "నమ్మకత్వం",
        "console.table_ai_proposal": "AI ప్రతిపాదన (సవరించదగినది)",
        "console.proposals_review": "ప్రతిపాదనలు రూపొందించబడ్డాయి. స్టేజింగ్ పట్టికను సమీక్షించండి:",
        "console.repair_aborted": "మరమ్మతు సెషన్ రద్దు చేయబడింది.",
        "console.ai_pipeline_failed": "AI పైప్‌లైన్ విఫలమైంది.",
        "console.ai_applied_count": "AI వర్తించబడింది: {{count}} పదాలు సవరించబడ్డాయి.",
        "common.apply": "మార్పులను వర్తించండి",
        "phonology.vowel_front": "ముందు",
        "phonology.vowel_central": "మధ్య",
        "phonology.vowel_back": "వెనుక"
    },
    "kn": {  # Kannada
        "console.table_original": "ಮೂಲ",
        "console.table_fidelity": "ನಿಷ್ಠೆ",
        "console.table_ai_proposal": "AI ಪ್ರಸ್ತಾಪ (ಸಂಪಾದಿಸಬಹುದಾದ)",
        "console.proposals_review": "ಪ್ರಸ್ತಾಪಗಳನ್ನು ರಚಿಸಲಾಗಿದೆ. ಹಂತದ ಟೇಬಲ್ ಅನ್ನು ಪರಿಶೀಲಿಸಿ:",
        "console.repair_aborted": "ದುರಸ್ತಿ ಅಧಿವೇಶನ ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ.",
        "console.ai_pipeline_failed": "AI ಪೈಪ್‌ಲೈನ್ ವಿಫಲವಾಗಿದೆ.",
        "console.ai_applied_count": "AI ಅನ್ವಯಿಸಲಾಗಿದೆ: {{count}} ಪದಗಳನ್ನು ಮಾರ್ಪಡಿಸಲಾಗಿದ್ದೇ.",
        "common.apply": "ಬದಲಾವಣೆಗಳನ್ನು ಅನ್ವಯಿಸಿ",
        "phonology.vowel_front": "ಮುಂಭಾಗ",
        "phonology.vowel_central": "ಮಧ್ಯ",
        "phonology.vowel_back": "ಹಿಂಭಾಗ"
    },
    "mlml": {  # Malayalam
        "console.table_original": "യഥാർത്ഥ",
        "console.table_fidelity": "വിശ്വസ്തത",
        "console.table_ai_proposal": "AI നിർദ്ദേശം (എഡിറ്റ് ചെയ്യാവുന്നത്)",
        "console.proposals_review": "നിർദ്ദേശങ്ങൾ സൃഷ്ടിച്ചു. സ്റ്റേജിംഗ് ടേബിൾ അവലോകനം ചെയ്യുക:",
        "console.repair_aborted": "അറ്റകുറ്റപ്പണി സെഷൻ റദ്ദാക്കി.",
        "console.ai_pipeline_failed": "AI പൈപ്പ്‌ലൈൻ പരാജയപ്പെട്ടു.",
        "console.ai_applied_count": "AI പ്രയോഗിച്ചു: {{count}} വാക്കുകൾ പരിഷ്‌ക്കരിച്ചു.",
        "common.apply": "മാറ്റങ്ങൾ പ്രയോഗിക്കുക",
        "phonology.vowel_front": "മുൻ",
        "phonology.vowel_central": "മധ്യ",
        "phonology.vowel_back": "പിൻ"
    },
    "mr": {  # Marathi
        "console.table_original": "मूळ",
        "console.table_fidelity": "निष्ठा",
        "console.table_ai_proposal": "AI प्रस्ताव (संपादित करण्यायोग्य)",
        "console.proposals_review": "प्रस्ताव तयार केले. स्टेजिंग टेबल पुनरावलोकन करा:",
        "console.repair_aborted": "दुरुस्ती सत्र रद्द केले.",
        "console.ai_pipeline_failed": "AI पाइपलाइन अयशस्वी झाली.",
        "console.ai_applied_count": "AI लागू केले: {{count}} शब्द सुधारित केले.",
        "common.apply": "बदल लागू करा",
        "phonology.vowel_front": "पुढचे",
        "phonology.vowel_central": "मध्य",
        "phonology.vowel_back": "मागचे"
    },
    "gu": {  # Gujarati
        "console.table_original": "મૂળ",
        "console.table_fidelity": "નિષ્ઠા",
        "console.table_ai_proposal": "AI પ્રસ્તાવ (સંપાદિત કરી શકાય તેવું)",
        "console.proposals_review": "પ્રસ્તાવો બનાવ્યા. સ્ટેજિંગ ટેબલ સમીક્ષા કરો:",
        "console.repair_aborted": "સમારકામ સત્ર રદ કર્યું.",
        "console.ai_pipeline_failed": "AI પાઇપલાઇન નિષ્ફળ થઈ.",
        "console.ai_applied_count": "AI લાગુ કર્યું: {{count}} શબ્દો સંશોધિત કર્યા.",
        "common.apply": "ફેરફારો લાગુ કરો",
        "phonology.vowel_front": "આગળ",
        "phonology.vowel_central": "મધ્ય",
        "phonology.vowel_back": "પાછળ"
    },
    "pa": {  # Punjabi
        "console.table_original": "ਅਸਲੀ",
        "console.table_fidelity": "ਵਫ਼ਾਦਾਰੀ",
        "console.table_ai_proposal": "AI ਪ੍ਰਸਤਾਵ (ਸੰਪਾਦਨਯੋਗ)",
        "console.proposals_review": "ਪ੍ਰਸਤਾਵ ਬਣਾਏ ਗਏ। ਸਟੇਜਿੰਗ ਟੇਬਲ ਦੀ ਸਮੀਖਿਆ ਕਰੋ:",
        "console.repair_aborted": "ਮੁਰੰਮਤ ਸੈਸ਼ਨ ਰੱਦ ਕੀਤਾ ਗਿਆ।",
        "console.ai_pipeline_failed": "AI ਪਾਇਪਲਾਈਨ ਅਸਫਲ ਰਹੀ।",
        "console.ai_applied_count": "AI ਲਾਗੂ ਕੀਤਾ: {{count}} ਸ਼ਬਦ ਸੋਧੇ ਗਏ।",
        "common.apply": "ਤਬਦੀਲੀਆਂ ਲਾਗੂ ਕਰੋ",
        "phonology.vowel_front": "ਅੱਗੇ",
        "phonology.vowel_central": "ਕੇਂਦਰੀ",
        "phonology.vowel_back": "ਪਿੱਛੇ"
    },
    "jv": {  # Javanese
        "console.table_original": "Asli",
        "console.table_fidelity": "Kasetyan",
        "console.table_ai_proposal": "Usulan AI (Bisa Diowahi)",
        "console.proposals_review": "Usulan digawe. Teliti tabel staging:",
        "console.repair_aborted": "Sesi ndandani dibatalake.",
        "console.ai_pipeline_failed": "Pipeline AI gagal.",
        "console.ai_applied_count": "AI ditrapake: {{count}} tembung diowahi.",
        "common.apply": "Terapake Owah-owahan",
        "phonology.vowel_front": "Ngarep",
        "phonology.vowel_central": "Tengah",
        "phonology.vowel_back": "Mburi"
    },
    "pcm": {  # Nigerian Pidgin
        "console.table_original": "Original",
        "console.table_fidelity": "Correct-correct",
        "console.table_ai_proposal": "AI Proposal (Fit Edit Am)",
        "console.proposals_review": "Dem don generate proposals. Check di staging table:",
        "console.repair_aborted": "Dem don cancel di repair session.",
        "console.ai_pipeline_failed": "AI pipeline don fail.",
        "console.ai_applied_count": "AI don apply: {{count}} words don change.",
        "common.apply": "Apply Changes",
        "phonology.vowel_front": "Front",
        "phonology.vowel_central": "Middle",
        "phonology.vowel_back": "Back"
    },
    "ha": {  # Hausa
        "console.table_original": "Asali",
        "console.table_fidelity": "Aminci",
        "console.table_ai_proposal": "Shawarar AI (Ana Iya Gyarawa)",
        "console.proposals_review": "An ƙirƙiri shawarwari. Bincika tebur na tsarawa:",
        "console.repair_aborted": "An soke zaman gyara.",
        "console.ai_pipeline_failed": "Bututun AI ya gaza.",
        "console.ai_applied_count": "An yi amfani da AI: an gyara kalmomi {{count}}.",
        "common.apply": "Yi Amfani da Canje-canje",
        "phonology.vowel_front": "Gaba",
        "phonology.vowel_central": "Tsakiya",
        "phonology.vowel_back": "Baya"
    },
    "yue": {  # Cantonese
        "console.table_original": "原始",
        "console.table_fidelity": "保真度",
        "console.table_ai_proposal": "AI建議（可編輯）",
        "console.proposals_review": "已生成提案。查看暫存表：",
        "console.repair_aborted": "修復會話已中止。",
        "console.ai_pipeline_failed": "AI流水線失敗。",
        "console.ai_applied_count": "AI已應用：{{count}}個詞語已修改。",
        "common.apply": "套用更改",
        "phonology.vowel_front": "前",
        "phonology.vowel_central": "中",
        "phonology.vowel_back": "後"
    },
    "wuu": {  # Wu Chinese
        "console.table_original": "原始",
        "console.table_fidelity": "保真度",
        "console.table_ai_proposal": "AI建议（可编辑）",
        "console.proposals_review": "已生成提案。查看暂存表：",
        "console.repair_aborted": "修复会话已中止。",
        "console.ai_pipeline_failed": "AI流水线失败。",
        "console.ai_applied_count": "AI已应用：{{count}}个词已修改。",
        "common.apply": "应用更改",
        "phonology.vowel_front": "前",
        "phonology.vowel_central": "中",
        "phonology.vowel_back": "后"
    }
}

# For languages without specific translations, use English as fallback
ALL_LOCALES = [
    "ar", "bn", "cs", "de", "el", "en", "es", "fa", "fi", "fr", "gu", 
    "ha", "he", "hi", "hu", "id", "it", "ja", "jv", "kn", "ko", "ml", 
    "mr", "ms", "nl", "pa", "pcm", "pl", "pt", "ro", "ru", "sr", "sv", 
    "sw", "ta", "te", "th", "tl", "tr", "uk", "ur", "vi", "wuu", "yue",
    "zh-tw", "zh"
]

def add_translations_to_locale(locale_code):
    """Add missing translation keys to a specific locale file."""
    file_path = Path(LOCALES_DIR) / f"{locale_code}.json"
    
    if not file_path.exists():
        print(f"Warning: {file_path} does not exist. Skipping.")
        return
    
    # Read existing translations
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Get translations for this locale, fallback to English
    locale_translations = TRANSLATIONS.get(locale_code, NEW_KEYS)
    
    # Add new keys if they don't exist
    added_count = 0
    for key, value in locale_translations.items():
        if key not in data:
            data[key] = value
            added_count += 1
    
    # Write back to file
    if added_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"✓ Added {added_count} translations to {locale_code}.json")
    else:
        print(f"  {locale_code}.json already up to date")

def main():
    print("Adding translations to all locale files...")
    print(f"Locales directory: {LOCALES_DIR}\n")
    
    for locale in ALL_LOCALES:
        add_translations_to_locale(locale)
    
    print("\n✓ All translations added successfully!")

if __name__ == "__main__":
    main()
