@echo off
echo ================================
echo AI PHOTOBOOTH - FRONTEND SETUP
echo ================================
echo.

cd frontend

echo [1/3] Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

echo.
echo [2/3] Checking npm...
npm --version

echo.
echo [3/3] Installing dependencies...
npm install

echo.
echo ================================
echo Setup complete!
echo ================================
echo.
echo Next step:
echo Run: start_frontend.bat
echo.
pause
