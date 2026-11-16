#!/bin/bash
cd "$(dirname "$0")"
echo "======================================================="
echo "  🛰️ PROYECTO CLIMATE — Gran Chaco"
echo "  NASA Space Apps Challenge 2026"
echo "======================================================="
echo ""

# 1. Comprobar Python
if ! command -v python3 >/dev/null 2>&1; then
    echo "[ERROR] Python 3 no está instalado. Instálalo desde https://python.org"
    read -p "Presiona Enter para salir..."
    exit 1
fi

# 2. Configurar entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "[1/3] Creando entorno virtual 'venv'..."
    python3 -m venv venv
    source venv/bin/activate
    echo "[2/3] Instalando dependencias de requirements.txt..."
    pip install --upgrade pip
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# 3. Liberar puertos si estaban ocupados
lsof -ti :8000 | xargs kill -9 2>/dev/null
lsof -ti :3005 | xargs kill -9 2>/dev/null

echo "[3/3] Iniciando servidores locales..."

# Iniciar Backend en segundo plano
python3 server.py &
BACKEND_PID=$!
echo "✓ Backend FastAPI corriendo en http://localhost:8000 (PID: $BACKEND_PID)"

# Iniciar Frontend en segundo plano
python3 -m http.server 3005 &
FRONTEND_PID=$!
echo "✓ Frontend corriendo en http://localhost:3005 (PID: $FRONTEND_PID)"

sleep 2

# Abrir en el navegador según el SO
if command -v open >/dev/null 2>&1; then
    open "http://localhost:3005"
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:3005"
fi

echo ""
echo "======================================================="
echo "  Proyecto en ejecución:"
echo "  - Frontend: http://localhost:3005"
echo "  - Backend:  http://localhost:8000"
echo "  - Swagger:  http://localhost:8000/docs"
echo ""
echo "  Presiona Ctrl+C en esta ventana para detener ambos servidores."
echo "======================================================="

trap "echo 'Deteniendo servidores...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM
wait
