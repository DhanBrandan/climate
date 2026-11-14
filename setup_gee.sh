#!/usr/bin/env bash
# PROYECTO CLIMATE — Gran Chaco
# Script de Configuración y Automatización de Google Earth Engine (GEE)

echo "==============================================================="
echo "   🛰️ PROYECTO CLIMATE — CONFIGURADOR GOOGLE EARTH ENGINE     "
echo "   NASA Space Apps Challenge 2026 - Gran Chaco (Quimilí)       "
echo "==============================================================="
echo ""

# 1. Comprobar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 no está instalado en este sistema."
    exit 1
fi
echo "✅ Python 3 detectado."

# 2. Instalar paquetes necesarios
echo "📦 Instalando dependencias (FastAPI, Earth Engine, NumPy, Scikit-Learn)..."
python3 -m pip install --upgrade pip
python3 -m pip install fastapi uvicorn earthengine-api google-auth numpy scikit-learn requests

echo ""
echo "==============================================================="
echo "   🔑 AUTENTICACIÓN EN GOOGLE EARTH ENGINE                     "
echo "==============================================================="
echo "A continuación se abrirá tu navegador para autorizar tu cuenta."
echo "Si es la primera vez, asegúrate de registrarte gratis en:"
echo "👉 https://earthengine.google.com/signup"
echo ""

read -p "¿Deseas autenticar tu cuenta de Google Earth Engine ahora? (s/n): " respuesta
if [[ "$respuesta" =~ ^[Ss]$ ]]; then
    python3 -c "import ee; ee.Authenticate()"
    echo "✅ Autenticación completada con éxito."
else
    echo "ℹ️ Saltando autenticación. El sistema funcionará con datos satelitales calibrados."
fi

echo ""
echo "🚀 Iniciando API Backend con integración GEE en el puerto 8000..."
echo "👉 Documentación interactiva de la API: http://localhost:8000/docs"
echo ""
python3 server.py
