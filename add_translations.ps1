# PowerShell script to add missing translation keys to all locale files

$localesDir = "src\locales"
$localeFiles = Get-ChildItem -Path $localesDir -Filter "*.json"

# Translation keys and their values for each language
$translations = @{
    "ar" = @{
        "console.table_original" = "الأصلي"
        "console.table_fidelity" = "الدقة"
        "console.table_ai_proposal" = "اقتراح الذكاء الاصطناعي (قابل للتحرير)"
        "console.proposals_review" = "تم إنشاء المقترحات. راجع جدول التدريج:"
        "console.repair_aborted" = "تم إحباط جلسة الإصلاح."
        "console.ai_pipeline_failed" = "فشل خط أنابيب الذكاء الاصطناعي."
        "console.ai_applied_count" = "تم تطبيق الذكاء الاصطناعي: تم تعديل {{count}} كلمة."
        "common.apply" = "تطبيق التغييرات"
        "phonology.vowel_front" = "أمامي"
        "phonology.vowel_central" = "وسط"
        "phonology.vowel_back" = "خلفي"
    }
    "bn" = @{
        "console.table_original" = "মূল"
        "console.table_fidelity" = "বিশ্বস্ততা"
        "console.table_ai_proposal" = "AI প্রস্তাব (সম্পাদনাযোগ্য)"
        "console.proposals_review" = "প্রস্তাবগুলি তৈরি করা হয়েছে। স্টেজিং টেবিল পর্যালোচনা করুন:"
        "console.repair_aborted" = "মেরামত সেশন বাতিল করা হয়েছে।"
        "console.ai_pipeline_failed" = "AI পাইপলাইন ব্যর্থ হয়েছে।"
        "console.ai_applied_count" = "AI প্রয়োগ করা হয়েছে: {{count}}টি শব্দ পরিবর্তন করা হয়েছে।"
        "common.apply" = "পরিবর্তন প্রয়োগ করুন"
        "phonology.vowel_front" = "সামনে"
        "phonology.vowel_central" = "কেন্দ্রীয়"
        "phonology.vowel_back" = "পিছনে"
    }
    # Add more languages here... (truncated for brevity - the script would have all 45)
}

foreach ($file in $localeFiles) {
    $locale = $file.BaseName
    Write-Host "Processing $locale..."
    
    # Read JSON
    $json = Get-Content -Path $file.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
    
    # Check if translations exist for this locale
    if ($translations.Contains($locale)) {
        $added = 0
        foreach ($key in $translations[$locale].Keys) {
            if (-not $json.PSObject.Properties.Name.Contains($key)) {
                $json | Add-Member -MemberType NoteProperty -Name $key -Value $translations[$locale][$key]
                $added++
            }
        }
        
        if ($added -gt 0) {
            # Write back to file
            $json | ConvertTo-Json -Depth 100 | Set-Content -Path $file.FullName -Encoding UTF8
            Write-Host "  Added $added translations to $locale"
        } else {
            Write-Host "  $locale already up to date"
        }
    }
}

Write-Host "`nDone!"
