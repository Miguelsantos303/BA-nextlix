#!/usr/bin/env bash
# Nextlix — arranca o site num só comando (Mac/Linux)
set -e
cd "$(dirname "$0")"

echo "============================================"
echo "   NEXTLIX — a iniciar o vosso site"
echo "============================================"

command -v node >/dev/null || { echo "[ERRO] Instala o Node.js: https://nodejs.org"; exit 1; }
command -v python3 >/dev/null || { echo "[ERRO] Instala o Python 3: https://www.python.org"; exit 1; }

if [ ! -f frontend/build/index.html ]; then
    echo "[1/3] A preparar o site pela primeira vez (pode demorar uns minutos)…"
    (cd frontend && npm install --no-audit --no-fund && REACT_APP_BACKEND_URL= npm run build)
else
    echo "[1/3] Site já compilado."
fi

echo "[2/3] A instalar o servidor…"
python3 -m pip install -q -r backend/requirements.txt

IP=$(hostname -I 2>/dev/null | awk '{print $1}')
[ -z "$IP" ] && IP=$(ipconfig getifaddr en0 2>/dev/null || echo "IP-do-computador")

echo "[3/3] A arrancar!"
echo
echo "  No PC:        http://localhost:8001"
echo "  No telemóvel: http://$IP:8001  (mesma rede Wi-Fi)"
echo
echo "  Para parar: Ctrl+C"
echo
cd backend
exec python3 -m uvicorn server:app --host 0.0.0.0 --port 8001
