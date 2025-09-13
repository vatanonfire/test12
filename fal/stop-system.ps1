# Fal Platform System Stopper Script
# Tüm servisleri durdurmak için

Write-Host "🛑 Fal Platform Servisleri Durduruluyor..." -ForegroundColor Red

# Node.js process'lerini bul ve durdur
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "📡 Node.js process'leri bulundu, durduruluyor..." -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        try {
            Stop-Process -Id $_.Id -Force
            Write-Host "✅ Process $($_.Id) durduruldu" -ForegroundColor Green
        } catch {
            Write-Host "❌ Process $($_.Id) durdurulamadı" -ForegroundColor Red
        }
    }
} else {
    Write-Host "ℹ️ Çalışan Node.js process'i bulunamadı" -ForegroundColor Blue
}

# Port'ları kontrol et
Write-Host "🔍 Port durumu kontrol ediliyor..." -ForegroundColor Cyan

$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "⚠️ Port 5000 hala kullanımda" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 5000 boş" -ForegroundColor Green
}

if ($port3000) {
    Write-Host "⚠️ Port 3000 hala kullanımda" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port 3000 boş" -ForegroundColor Green
}

Write-Host ""
Write-Host "🏁 Sistem durdurma işlemi tamamlandı!" -ForegroundColor Green

Read-Host "Devam etmek için Enter'a basın"






