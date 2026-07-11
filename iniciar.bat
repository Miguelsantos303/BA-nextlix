@echo off
chcp 65001 >nul
title Nextlix
cd /d "%~dp0"

echo ============================================
echo    NEXTLIX - a iniciar o vosso site
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERRO] O Node.js nao esta instalado.
    echo Descarrega em: https://nodejs.org  ^(versao LTS^)
    pause
    exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
    echo [ERRO] O Python nao esta instalado.
    echo Descarrega em: https://www.python.org/downloads
    echo IMPORTANTE: marca a opcao "Add Python to PATH" ao instalar.
    pause
    exit /b 1
)

if not exist "frontend\build\index.html" (
    echo [1/3] A preparar o site pela primeira vez ^(pode demorar uns minutos^)...
    cd frontend
    call npm install --no-audit --no-fund
    set "REACT_APP_BACKEND_URL="
    call npm run build
    cd ..
) else (
    echo [1/3] Site ja compilado.
)

echo [2/3] A instalar o servidor...
python -m pip install -q -r backend\requirements.txt

echo [3/3] A arrancar!
echo.
echo   No PC:        http://localhost:8001
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    echo   No telemovel: http://%%a:8001  ^(mesma rede Wi-Fi^)
)
echo.
echo   Para parar: fecha esta janela ou carrega Ctrl+C
echo.
cd backend
python -m uvicorn server:app --host 0.0.0.0 --port 8001
pause
