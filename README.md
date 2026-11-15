# 🛰️ Proyecto CLIMATE — Gran Chaco Americano
### Sistema Híbrido de Proyección Climática, Alerta Temprana y Explicabilidad Satelital
**NASA Space Apps Challenge 2026** — Documentación Técnica, Científica y Operativa

[![GitHub repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/DhanBrandan/climate)
[![Status](https://img.shields.io/badge/Status-Prototipo%20Operativo-10B981)](#)
[![Python](https://img.shields.io/badge/Backend-FastAPI%20%7C%20GEE%20SDK-06B6D4)](#)
[![Frontend](https://img.shields.io/badge/Frontend-MapLibre%20%7C%20Tailwind-3B82F6)](#)

> 📘 **¿Trabajando en equipo?** Consulta la [**Guía Completa de Transferencia y Continuidad Técnica (MANUAL_COMPLETO_PROYECTO.md)**](MANUAL_COMPLETO_PROYECTO.md) para conocer la arquitectura a fondo, cómo instalarlo y nuevas ideas para sumar al proyecto.

---

## 🗺️ 1. Resumen Ejecutivo

El **Gran Chaco Americano** es un ecosistema transfronterizo de más de 1.100.000 km² distribuido entre **Argentina, Bolivia y Paraguay**. Sufre ciclos acoplados extremos de sequías prolongadas seguidas de inundaciones repentinas provocadas por teleconexiones oceánicas (El Niño/ENSO).

**CLIMATE** es una plataforma operativa que combina **telemetría satelital en tiempo real de la NASA y NOAA** con **modelos de Machine Learning de dos niveles**:
1. **Nivel 1 (LightGBM Cuantílico):** Proyección continua a 6 meses del índice de sequía SPI con conos de incertidumbre $[p10, p50, p90]$.
2. **Nivel 2 (Random Forest Classifier + SHAP):** Motor de alerta temprana en 4 niveles (**Verde, Amarillo, Naranja, Rojo**) con explicabilidad transparente de variables satelitales.

---

## 🚀 2. Inicio Rápido (Cómo Ejecutarlo)

### Opción A: Frontend (Visualizador Web)
Solo necesitas un servidor HTTP simple para servir los archivos locales:
```bash
python3 -m http.server 3005
```
Abre en tu navegador: **`http://localhost:3005`**

### Opción B: Backend Completo (FastAPI + Google Earth Engine)
Para activar la inferencia y telemetría satelital en tiempo real:
```bash
# 1. Crear entorno virtual e instalar dependencias
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Iniciar el servidor backend
python3 server.py
```
Accede a la documentación interactiva Swagger: **`http://localhost:8000/docs`**

---

## 🛰️ 3. Misiones Satelitales Acopladas

* **Precipitación:** NASA GPM IMERG V07 (`PRECTOTCORR`).
* **Humedad del Suelo Profunda:** NASA SMAP L4 Root-Zone Soil Moisture (`GWETROOT`, 0–100 cm).
* **Vigor y Biomasa:** NASA MODIS Terra/Aqua (`MOD13A2` NDVI).
* **Teleconexión Oceánica:** NOAA Climate Prediction Center (`ONI` Niño 3.4).
* **Térmica y Radiación:** NASA MERRA-2 (`T2M_MAX`, radiación de onda corta incidente).

---

## 🌟 4. Funcionalidades Principales

* **Conmutador de Fuentes:** Alterna entre la **Planilla Calibrada (13 meses de serie temporal)** y **Google Earth Engine en Tiempo Real**.
* **Modal Comparativo (`[ ⇄ Comparar ]`):** Contraste cara a cara de la telemetría satelital y su impacto en las decisiones del modelo.
* **Inspector Puntual:** Haz clic en cualquier coordenada del mapa para obtener una predicción instantánea con sparkline de 12 meses.
* **Años Análogos Históricos:** Superpón las grandes sequías del Gran Chaco (2008-09, 2018, 2022-23) sobre la proyección activa.
* **Reporte Ejecutivo PDF:** Generación de un reporte completo con mapa, gráficos de proyección, análisis SHAP y recomendaciones de mitigación.
* **Sistema de Suscripciones:** Suscripción a alertas tempranas de cuenca por correo electrónico o Telegram.

---

## 👥 5. Para el Equipo y Colaboradores

- **Repositorio:** [https://github.com/DhanBrandan/climate](https://github.com/DhanBrandan/climate)
- **Manual Maestro para el equipo:** [MANUAL_COMPLETO_PROYECTO.md](MANUAL_COMPLETO_PROYECTO.md)
- **Contacto:** Desarrollado para el NASA Space Apps Challenge.
