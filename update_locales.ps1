$localeFiles = Get-ChildItem -Path "src\locales" -Filter "*.json"

foreach ($file in $localeFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $newContent = $content.Replace('"settings.light":', '"settings.cappuccino":')
    Set-Content -Path $file.FullName -Value $newContent -NoNewline
    Write-Host "Updated $($file.Name)"
}

Write-Host "All locale files updated!"
