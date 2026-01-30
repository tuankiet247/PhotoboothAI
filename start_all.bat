@echo off
echo ================================
echo AI PHOTOBOOTH - QUICK START
echo ================================
echo.
echo This script will start both backend and frontend servers
echo in separate windows.
echo.
echo Make sure you have:
echo [x] Python 3.8+ installed
echo [x] Node.js 18+ installed
echo [x] Ran setup scripts
echo [x] Added OPENROUTER_API_KEY to backend/.env
echo.
pause

echo Starting Backend...
start cmd /k "cd /d "%~dp0" && start_backend.bat"

timeout /t 3 /nobreak > nul

echo Starting Frontend...
start cmd /k "cd /d "%~dp0" && start_frontend.bat"

echo.
echo ================================
echo Both servers are starting!
echo ================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Check the opened windows for server status.
echo.
pause
