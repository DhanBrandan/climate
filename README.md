# 🛰️ Proyecto CLIMATE — Gran Chaco Americano
### Sistema Híbrido de Proyección Climática, Alerta Temprana, Red IoT LoRa y Explicabilidad Satelital
**NASA Space Apps Challenge 2026** — Documentación Técnica, Científica y Operativa

[![GitHub repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/DhanBrandan/climate)
[![Status](https://img.shields.io/badge/Status-Prototipo%20Operativo-10B981)](#)
[![Python](https://img.shields.io/badge/Backend-FastAPI%20%7C%20GEE%20SDK%20%7C%20LoRa-06B6D4)](#)
[![Frontend](https://img.shields.io/badge/Frontend-MapLibre%20%7C%20Tailwind-3B82F6)](#)

> 📘 **¿Trabajando en equipo?** Consulta la [**Guía Completa de Transferencia y Continuidad Técnica (MANUAL_COMPLETO_PROYECTO.md)**](MANUAL_COMPLETO_PROYECTO.md) para conocer la arquitectura a fondo, cómo instalarlo y nuevas ideas para sumar al proyecto.

---

## 🗺️ 1. Resumen Ejecutivo

El **Gran Chaco Americano** es un ecosistema transfronterizo de más de 1.100.000 km² distribuido entre **Argentina, Bolivia y Paraguay**. Sufre ciclos acoplados extremos de sequías prolongadas seguidas de inundaciones repentinas provocadas por teleconexiones oceánicas (El Niño/ENSO).

**CLIMATE** es una plataforma operativa trinacional que combina:
1. **Telemetría Satelital en Tiempo Real (NASA & NOAA):** GPM IMERG, SMAP L4, MODIS Terra/Aqua y NOAA CPC.
2. **Red de Monitoreo IoT In-Situ (LoRa / ESP32-C3):** Sensores de suelo profundo y superficial en tiempo real acoplados mediante enlaces de radiofrecuencia (RF Mesh) a Gateway Hubs estratégicos.
3. **Modelos de Machine Learning en Dos Niveles:**
   - **Nivel 1 (LightGBM Cuantílico):** Proyección continua a 6 meses del índice de sequía SPI con conos de incertidumbre $[p10, p50, p90]$.
   - **Nivel 2 (Random Forest Classifier + SHAP):** Motor de alerta temprana en 4 niveles (**Verde, Amarillo, Naranja, Rojo**) con explicabilidad transparente de variables biofísicas.

---

## 🚀 2. Inicio Rápido (Cómo Ejecutarlo)

### Prototipo de Introducción Cinematográfica
Abre [`intro_prototype.html`](intro_prototype.html) para recorrer una presentación interactiva: perfiles del equipo, visión de impacto, vista simulada y propuesta de valor para la NASA Space Apps Challenge. Es una experiencia independiente del dashboard principal.

### Opción A: Frontend (Visualizador Web)
Solo necesitas un servidor HTTP para servir los archivos locales:
```bash
python3 -m http.server 3005
```
Abre en tu navegador: **`http://localhost:3005`**

### Opción B: Backend Completo (FastAPI + Google Earth Engine + Ingesta LoRa)
Para activar la inferencia predictiva, telemetría satelital y servidor de ingesta de campo:
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

## 🛰️ 3. Fuentes de Datos: Satélites, IoT y Benchmarks

| Nivel de Entrada | Misión / Tecnología | Variables Clave | Cobertura |
| :--- | :--- | :--- | :--- |
| **Satélites Globales** | NASA GPM, SMAP L4, MODIS, NOAA ONI | Precipitación, Humedad Radicular ($0-100\text{ cm}$), NDVI, ENSO | Macro-ecorregional (~1.1M km²) |
| **Red IoT de Campo** | ESP32-C3 + Ra-02 / SX1262 (LoRaWAN) | Humedad de suelo ($0-7\text{ cm}$), Batería, RSSI, SNR, Temp / RH | Micro-cuenca in-situ (Quimilí, Añatuya, Bandera, etc.) |
| **Benchmark Calibrado** | Planilla Sintética NASA Space Apps | Serie temporal completa de 13 meses ($t-6$ a $t+6$) | Histórico y proyección continua |

---

## 🌟 4. Funcionalidades Principales

* **Conmutador Tripartito de Datos:** Alterna fluidamente entre:
  - `📋 Planilla`: Serie histórica calibrada de 13 meses con deslizador temporal interactivo.
  - `🛰️ GEE Vivo`: Telemetría satelital en tiempo real descargada directamente de Google Earth Engine.
  - `📡 LoRa Campo`: Datos físicos in-situ provenientes de la red de Nodos Centinela y Gateways de campo.
* **Red LoRaWAN Profesional & Edge Computing:** Integración de Broker Open Source **ChirpStack v4** con estándar **Semtech Basics Station**, desduplicación de paquetes solapados multi-gateway, cifrado **AES-128** y micro-modelos locales en los concentradores **MultiTech Conduit** para activar alertas autónomas por SMS directo (módem GSM) e Iridium Satelital si una tormenta corta la conexión a internet.
* **Capa de Enlaces LoRa (RF Links):** Visualización en el mapa de las líneas de comunicación por radiofrecuencia entre Gateways y Nodos Centinela de campo.
* **Modal Comparativo (`[ ⇄ Comparar ]`):** Contraste cara a cara entre la telemetría satelital observada y las salidas del modelo de IA.
* **Inspector Puntual:** Clic en cualquier coordenada del mapa para obtener una proyección instantánea con sparkline de 12 meses.
* **Años Análogos Históricos:** Superposición de las curvas de sequías históricas (2008-09, 2018, 2022-23) sobre la proyección activa.
* **Reporte Ejecutivo PDF:** Generación de un reporte completo con mapa, gráficos de proyección, análisis SHAP y recomendaciones de mitigación.
* **Sistema de Suscripciones:** Alertas tempranas de cuenca vía Correo Electrónico o Telegram.

---

## 👥 5. Para el Equipo y Colaboradores

- **Repositorio:** [https://github.com/DhanBrandan/climate](https://github.com/DhanBrandan/climate)
- **Manual Maestro para el equipo:** [MANUAL_COMPLETO_PROYECTO.md](MANUAL_COMPLETO_PROYECTO.md)
- **Contacto:** Desarrollado para el NASA Space Apps Challenge.
