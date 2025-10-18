@echo off
echo Starting Backend Server...
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
.\venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
