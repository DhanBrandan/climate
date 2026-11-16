@echo off
title PROYECTO CLIMATE - Gran Chaco
cd /d "%~dp0"

echo =======================================================
echo   PROYECTO CLIMATE - Gran Chaco
echo   NASA Space Apps Challenge 2026
echo =======================================================
echo.

:: Verificar si existe Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No se encontro Python instalado o no esta en el PATH.
    echo Por favor instala Python 3.10 o superior desde python.org
    echo Asegurate de marcar la casilla "Add python.exe to PATH".
    pause
    exit /b 1
)

:: Crear entorno virtual si no existe
if not exist "venv" (
    echo [1/3] Creando entorno virtual 'venv'...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERROR] Fallo al crear el entorno virtual.
        pause
        exit /b 1
    )
    echo [2/3] Instalando dependencias desde requirements.txt...
    call venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

echo [3/3] Iniciando servidores locales...
echo.
echo - Iniciando Backend FastAPI en http://localhost:8000 ...
start "CLIMATE Backend (FastAPI)" cmd /k "venv\Scripts\python.exe server.py"

echo - Iniciando Frontend Web en http://localhost:3005 ...
start "CLIMATE Frontend (HTTP Server)" cmd /k "venv\Scripts\python.exe -m http.server 3005"

timeout /t 3 >nul
echo Abriendo navegador en http://localhost:3005 ...
start http://localhost:3005

echo.
echo =======================================================
echo   Proyecto ejecutandose exitosamente.
echo   - Frontend: http://localhost:3005
echo   - Backend:  http://localhost:8000
echo   - Docs API: http://localhost:8000/docs
echo =======================================================
echo.
