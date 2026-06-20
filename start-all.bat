@echo off
cd /d "%~dp0"
start "DigiShield Backend" cmd /k "%~dp0start-backend.bat"
timeout /t 2 /nobreak >nul
start "DigiShield Frontend" cmd /k "%~dp0start-frontend.bat"
echo.
echo Backend and frontend are starting in separate windows.
echo   UI:  http://localhost:5173
echo   API: http://localhost:8000/api
echo.
