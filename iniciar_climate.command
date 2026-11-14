#!/bin/bash
cd "$(dirname "$0")"
echo "======================================================="
echo "  🛰️ PROYECTO CLIMATE — Gran Chaco"
echo "  NASA Space Apps Challenge 2026"
echo "======================================================="
echo ""

PORT=3005

# Si ya hay un servidor en el puerto 3005, cerrarlo para reiniciar limpio
lsof -ti :$PORT | xargs kill -9 2>/dev/null

echo "Abriendo aplicación en: http://localhost:$PORT"
(sleep 1 && open "http://localhost:$PORT") &
python3 -m http.server $PORT
