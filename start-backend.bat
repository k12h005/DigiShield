@echo off
title DigiShield Backend
setlocal EnableDelayedExpansion

:: Conda environment name (change if yours is different, e.g. hackathon)
set CONDA_ENV=digishield

cd /d "%~dp0backend-py"

if not exist ".env" (
    echo Creating .env from .env.example...
    copy /Y ".env.example" ".env" >nul
)

echo.
echo Activating Conda environment: %CONDA_ENV%
echo.

set "CONDA_ACTIVATED=0"

:: Locate conda.bat (Anaconda / Miniconda common install paths)
set "CONDA_BAT="
for %%P in (
    "%USERPROFILE%\anaconda3\condabin\conda.bat"
    "%USERPROFILE%\miniconda3\condabin\conda.bat"
    "%LOCALAPPDATA%\anaconda3\condabin\conda.bat"
    "%LOCALAPPDATA%\miniconda3\condabin\conda.bat"
    "C:\ProgramData\anaconda3\condabin\conda.bat"
    "C:\ProgramData\miniconda3\condabin\conda.bat"
) do (
    if exist %%P set "CONDA_BAT=%%~P"
)

if defined CONDA_BAT (
    call "%CONDA_BAT%" activate %CONDA_ENV%
    if errorlevel 1 (
        echo Environment "%CONDA_ENV%" not found. Creating with Python 3.12...
        call "%CONDA_BAT%" create -n %CONDA_ENV% python=3.12 -y
        if errorlevel 1 (
            echo Failed to create conda env "%CONDA_ENV%".
            pause
            exit /b 1
        )
        call "%CONDA_BAT%" activate %CONDA_ENV%
    )
    set "CONDA_ACTIVATED=1"
) else (
    where conda >nul 2>&1
    if not errorlevel 1 (
        call conda activate %CONDA_ENV%
        if errorlevel 1 (
            echo Environment "%CONDA_ENV%" not found. Creating with Python 3.12...
            call conda create -n %CONDA_ENV% python=3.12 -y
            call conda activate %CONDA_ENV%
        )
        set "CONDA_ACTIVATED=1"
    )
)

if "%CONDA_ACTIVATED%"=="0" (
    echo [WARN] Conda not found on this machine.
    echo        Install Anaconda/Miniconda, or run manually:
    echo          conda create -n %CONDA_ENV% python=3.12 -y
    echo          conda activate %CONDA_ENV%
    echo        Falling back to system Python...
    echo.
)

where python >nul 2>&1
if errorlevel 1 (
    echo Python not found. Install Python 3.12+ or set up Conda env "%CONDA_ENV%".
    pause
    exit /b 1
)

python -c "import sys; print('Using Python:', sys.executable)"

python -c "import uvicorn" >nul 2>&1
if errorlevel 1 (
    echo Installing backend dependencies into active environment...
    pip install -r requirements.txt
)

echo.
python run_dev.py
