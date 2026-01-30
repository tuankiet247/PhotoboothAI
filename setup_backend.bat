@echo off
echo ================================
echo AI PHOTOBOOTH - BACKEND SETUP
echo ================================
echo.

cd backend

echo [1/4] Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.8+
    pause
    exit /b 1
)

echo.
echo [2/4] Creating virtual environment...
if not exist venv (
    python -m venv venv
    echo Virtual environment created!
) else (
    echo Virtual environment already exists.
)

echo.
echo [3/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [4/4] Installing dependencies...
pip install -r requirements.txt

echo.
echo ================================
echo Setup complete!
echo ================================
echo.
echo Next steps:
echo 1. Copy .env.example to .env
echo 2. Add your OPENROUTER_API_KEY to .env
echo 3. Run: start_backend.bat
echo.
pause
