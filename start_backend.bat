@echo off
echo ================================
echo AI PHOTOBOOTH - STARTING BACKEND
echo ================================
echo.

cd backend

if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup_backend.bat first.
    pause
    exit /b 1
)

if not exist .env (
    echo WARNING: .env file not found!
    echo Copying .env.example to .env...
    copy .env.example .env
    echo.
    echo Please edit .env and add your OPENROUTER_API_KEY
    echo Then run this script again.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting FastAPI server...
echo Backend will run at: http://localhost:8000
echo API Docs at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python main.py
