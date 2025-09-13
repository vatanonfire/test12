# Fal Platform System Starter Script
# PowerShell için optimize edilmiş başlatma script'i

Write-Host "🚀 Fal Platform Sistem Başlatılıyor..." -ForegroundColor Green

# Backend'i başlat
Write-Host "📡 Backend servisi başlatılıyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

# 3 saniye bekle
Start-Sleep -Seconds 3

# Frontend'i başlat
Write-Host "🌐 Frontend servisi başlatılıyor..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

# 5 saniye bekle
Start-Sleep -Seconds 5

# Sistem durumunu kontrol et
Write-Host "🔍 Sistem durumu kontrol ediliyor..." -ForegroundColor Cyan

try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "✅ Backend: Çalışıyor (Port 5000)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend: Çalışmıyor" -ForegroundColor Red
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend: Çalışıyor (Port 3000)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend: Çalışmıyor" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Sistem başlatma tamamlandı!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "💊 Health Check: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servisleri durdurmak için her iki PowerShell penceresini kapatın." -ForegroundColor Yellow

# Tarayıcıyı aç
Start-Process "http://localhost:3000"

Read-Host "Devam etmek için Enter'a basın"






