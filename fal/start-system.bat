@echo off
echo 🚀 Fal Platform Sistem Başlatılıyor...

echo 📡 Backend servisi başlatılıyor...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo 🌐 Frontend servisi başlatılıyor...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak > nul

echo 🔍 Sistem durumu kontrol ediliyor...

echo ✅ Backend: http://localhost:5000
echo ✅ Frontend: http://localhost:3000
echo 💊 Health Check: http://localhost:5000/health

echo.
echo 🎉 Sistem başlatma tamamlandı!
echo 📱 Tarayıcıda http://localhost:3000 adresini açın
echo.
echo Servisleri durdurmak için açılan cmd pencerelerini kapatın.

start http://localhost:3000

pause






