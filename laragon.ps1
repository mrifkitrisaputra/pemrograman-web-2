# Path folder utama Laragon
$laragonPath = "D:\tools\laragon\laragon"

# Path file eksekusi GUI Laragon
$laragonExe = "$laragonPath\laragon.exe"

# Jalankan Laragon GUI jika belum berjalan
if (-not (Get-Process -Name "laragon" -ErrorAction SilentlyContinue)) {
    Start-Process -FilePath $laragonExe -WorkingDirectory $laragonPath
    Write-Host "Laragon GUI started."
} else {
    Write-Host "Laragon GUI is already running."
}

# Tunggu beberapa detik agar service siap
Start-Sleep -Seconds 5

# Path ke Brave
$bravePath = "${env:ProgramFiles(x86)}\BraveSoftware\Brave-Browser\Application\brave.exe"
if (-not (Test-Path $bravePath)) {
    $bravePath = "${env:ProgramFiles}\BraveSoftware\Brave-Browser\Application\brave.exe"
}

# Buka phpMyAdmin dan localhost:5173 di Brave private window
if (Test-Path $bravePath) {
    Start-Process -FilePath $bravePath -ArgumentList "--incognito", "http://localhost:5173"
    Start-Process -FilePath $bravePath -ArgumentList "--incognito", "http://localhost/phpmyadmin"
    Write-Host "Opened phpMyAdmin and localhost:5173 in Brave incognito window."
} else {
    Write-Warning "Brave Browser not found. Could not open URLs."
}