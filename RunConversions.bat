@echo off

:: Install or update dependencies from requirements.txt
if exist requirements.txt (
    echo Checking/Installing Python modules from requirements.txt...
    :: Upgrade pip first to avoid installation warning glitches
    python -m pip install --upgrade pip --quiet
    :: Install required packages
    pip install -r requirements.txt --quiet
) else (
    echo WARNING: requirements.txt not found. Attempting manual installation...
    pip install Flask moviepy Pillow --quiet
)


start cmd /k "python app.py"

timeout /t 2 >nul
start "" http://127.0.0.1:5000