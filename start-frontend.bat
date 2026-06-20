@echo off
title DigiShield Frontend
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo Node.js not found. Install Node.js 20+ and add it to PATH.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
)

echo.
echo DigiShield UI: http://localhost:5173
echo.
npm run dev
