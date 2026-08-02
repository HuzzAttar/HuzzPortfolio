$file = "c:\Users\Administrator\Desktop\Hportfolio\index.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Fix corrupted em-dashes (â€" = — encoded wrongly)
$content = $content.Replace("â€"", "—")
# Fix corrupted copyright (Â© = ©)
$content = $content.Replace("Â©", "©")
# Fix corrupted heart (â¤ï¸ = ❤️)
$content = $content.Replace("â¤ï¸", "❤️")
# Fix any other corrupted chars from encoding issue
$content = $content.Replace("Ã©", "é")
$content = $content.Replace("â€™", "'")
$content = $content.Replace("â€œ", '"')
$content = $content.Replace("â€", '"')

[System.IO.File]::WriteAllText($file, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done. File fixed successfully."
