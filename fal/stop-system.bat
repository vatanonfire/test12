@echo off
echo 🛑 Fal Platform Servisleri Durduruluyor...

echo 📡 Node.js process'leri durduruluyor...
taskkill /f /im node.exe >nul 2>&1

echo 🔍 Port durumu kontrol ediliyor...
netstat -ano | findstr :5000 >nul
if %errorlevel% == 0 (
    echo ⚠️ Port 5000 hala kullanımda
) else (
    echo ✅ Port 5000 boş
)

netstat -ano | findstr :3000 >nul
if %errorlevel% == 0 (
    echo ⚠️ Port 3000 hala kullanımda
) else (
    echo ✅ Port 3000 boş
)

echo.
echo 🏁 Sistem durdurma işlemi tamamlandı!

pause






