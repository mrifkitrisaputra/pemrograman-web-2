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

# # Buka phpMyAdmin di browser default
# Start-Process "http://localhost/phpmyadmin"

