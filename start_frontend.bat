@echo off
echo ================================
echo AI PHOTOBOOTH - STARTING FRONTEND
echo ================================
echo.

cd frontend

if not exist node_modules (
    echo ERROR: node_modules not found!
    echo Please run setup_frontend.bat first.
    pause
    exit /b 1
)

echo Starting React development server...
echo Frontend will run at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
