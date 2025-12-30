$ErrorActionPreference = "Stop"

$replacements = @{
    '--bg-main' = '--background'
    '--bg-panel' = '--surface'
    '--bg-header' = '--elevated'
    '--text-1' = '--text-primary'
    '--text-2' = '--text-secondary'
}

$files = Get-ChildItem -Path .\src -Recurse -Include *.tsx,*.ts,*.css
$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content
    
    foreach ($key in $replacements.Keys) {
        $newContent = $newContent -replace [regex]::Escape($key), $replacements[$key]
    }
    
    if ($content -ne $newContent) {
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.UTF8Encoding]::new($false))
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
        $count++
    }
}

Write-Host "`nTotal files updated: $count" -ForegroundColor Cyan
