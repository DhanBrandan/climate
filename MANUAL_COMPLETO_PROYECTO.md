# 🛰️ PROYECTO CLIMATE — GRAN CHACO AMERICANO
## Sistema Híbrido de Proyección Climática, Alerta Temprana, Red IoT LoRa y Explicabilidad Satelital (NASA Space Apps Challenge)
**Documento Maestro de Transferencia de Conocimiento y Guía de Continuidad Técnica**

---

## 📌 1. Visión y Objetivo del Proyecto

El **Gran Chaco Americano** es el segundo ecosistema boscoso más extenso de Sudamérica (~1.100.000 km² a lo largo de **Argentina, Bolivia y Paraguay**). Es una ecorregión transfronteriza altamente vulnerable a ciclos climáticos acoplados extremos:
1. **Sequías profundas y prolongadas** que agotan la humedad radicular del suelo antes de que sea evidente en la vegetación.
2. **Pulsos torrenciales de lluvia** modulados por eventos oceánicos (El Niño / ENSO) que, al impactar sobre suelos arcillosos y sedimentarios degradados por la sequía, provocan inundaciones y anegamientos masivos.

### El Desafío
Los pronósticos globales tradicionales tienen baja resolución espacial y no son accionables para un productor agropecuario o un intendente local.

### Nuestra Solución: "Proyecto CLIMATE"
Un **sistema híbrido de inteligencia artificial acoplado a telemetría satelital en tiempo real (NASA y NOAA) y a una red de sensores IoT de campo (LoRaWAN)** que:
- Monitorea el Gran Chaco en su conjunto mediante satélites y a través de una **red de Nodos Centinela y Gateway Hubs** (Quimilí, Añatuya, Bandera, Termas de Río Hondo, Filadelfia, Villa Montes, Sáenz Peña, Resistencia).
- Proyecta continuamente el índice de sequía **SPI a 6 meses vista** con intervalos de incertidumbre empírica ($p10, p50, p90$) mediante **LightGBM Cuantílico**.
- Clasifica el nivel de riesgo en 4 niveles (**Verde, Amarillo, Naranja, Rojo**) mediante un **Random Forest Classifier**.
- Explica de forma transparente cada decisión del modelo mediante **valores SHAP**, señalando si cada variable empuja hacia más sequía o hacia alivio.
- Permite operar en tres modos: **Planilla Calibrada (Demo histórica de 13 meses)**, **Google Earth Engine (En Vivo)** y **Red LoRa de Campo (ESP32-C3 in-situ)**.
- Incluye sistema de suscripciones a alertas (Email/Telegram), generador de reportes técnicos ejecutivos en PDF y prototipo de presentación cinematográfica (`intro_prototype.html`).

---

## 🏗️ 2. Arquitectura del Sistema

```
      ┌────────────────────────────────────┐       ┌─────────────────────────────────────┐
      │  FUENTES SATELITALES (NASA / GEE)  │       │   RED IOT DE CAMPO (ESP32-C3 LoRa)   │
      │ • GPM IMERG: Precipitación         │       │ • Humedad suelo in-situ (0-7 cm)    │
      │ • SMAP L4: Humedad radicular       │       │ • Gateways MultiTech Conduit AEP/IP │
      │ • MODIS Terra: NDVI biomasa        │       │ • Batería, RSSI, SNR, Temp, RH      │
      │ • NOAA CPC: Índice ENSO ONI        │       │ • Enlaces RF (LoRa Mesh) en el mapa │
      └─────────────────┬──────────────────┘       └──────────────────┬──────────────────┘
                        │                                             │
                        └──────────────────────┬──────────────────────┘
                                               │
                        ┌──────────────────────┴───────────────────────┐
                        │      CAPA BACKEND (Python 3.9+ / FastAPI)     │
                        │  • server.py: API REST asíncrona             │
                        │  • Ingesta LoRa: POST /api/nodes/telemetry   │
                        │  • Simulación LoRa: /api/nodes/telemetry/sim │
                        │  • gee_service.py: Conector oficial GEE SDK  │
                        │  • Inferencia LightGBM + Random Forest + SHAP│
                        │  • Gestor de Suscripciones (Email/Telegram)  │
                        └──────────────────────┬───────────────────────┘
                                               │ JSON REST API (Puerto 8000)
                                               ▼
                        ┌──────────────────────────────────────────────┐
                        │     CAPA FRONTEND (SPA Vanilla + Tailwind)   │
                        │  • index.html: Dashboard Dark Mode espacial  │
                        │  • intro_prototype.html: Intro animada equipo│
                        │  • app.js: Motor reactivo + enlaces LoRa     │
                        │  • MapLibre GL: Polígonos reales + Gateways  │
                        │  • Chart.js: Curva SPI + Incertidumbre + SHAP│
                        │  • html2pdf.js: Generador de informe PDF     │
                        └──────────────────────────────────────────────┘
```

---

## 📂 3. Estructura del Repositorio

| Archivo / Carpeta | Propósito y Contenido |
| :--- | :--- |
| **`index.html`** | Estructura completa del dashboard web principal (SPA). Diseñado con clases de Tailwind CSS en tema oscuro espacial (`#060913`, `#0B0F19`, `#0F172A`). Contiene modales de GEE, suscripciones, LoRa, referencias y comparativa de datos. |
| **`intro_prototype.html`** | Presentación cinematográfica interactiva: perfiles del equipo, impacto regional, vista simulada y beneficios del Proyecto CLIMATE para el pitch de la NASA. |
| **`app.js`** | Cerebro del frontend. Controla el estado global (`state`), MapLibre GL, la capa de enlaces LoRa RF, Chart.js, la interactividad del timeline, el conmutador tripartito y el generador de PDF. |
| **`server.py`** | Servidor backend en FastAPI. Expone endpoints de salud (`/api/health`), cálculo predictivo (`/api/predict`), telemetría en vivo GEE (`/api/gee/telemetry`), ingesta LoRa (`/api/nodes/telemetry`), simulación LoRa (`/api/nodes/telemetry/simulate`), suscripciones y notificaciones. |
| **`gee_service.py`** | Wrapper de Python que se conecta a la librería `ee` (Google Earth Engine) usando la cuenta y proyecto de servicio para extraer datos en vivo de Sentinel, GPM, SMAP y MODIS. |
| **`gran_chaco_real_regions.json`** | GeoJSON con límites geográficos reales de la ecorregión Gran Chaco y de departamentos de Argentina, Bolivia y Paraguay, optimizado sin solapamientos. |
| **`requirements.txt`** | Dependencias de Python (`fastapi`, `uvicorn`, `earthengine-api`, `pydantic`, `requests`). |
| **`iniciar_climate.command`** | Script de inicio de un solo clic para macOS. |
| **`setup_gee.sh`** | Script interactivo para autenticar la cuenta de Google Earth Engine mediante CLI. |

---

## 🌟 4. Funcionalidades Implementadas en el Prototipo

### 4.1. Conmutador Tripartito de Datos
- **Planilla Demo**: Serie temporal sintética calibrada (`QUIMILI_TIME_SERIES`) de 13 pasos mensuales (May 2026 - May 2027) para observar la evolución histórica y la proyección continua.
- **GEE en Vivo**: Consulta al endpoint `/api/gee/simulate-live`, descargando la telemetría satelital real del Gran Chaco y ejecutando los modelos de ML al vuelo.
- **LoRa Campo**: Conexión a la red de Nodos Centinela in-situ (sensores físicos de suelo $0-7\text{ cm}$, temperatura, batería y telemetría de radioenlace).
- **Modal Comparativo (`[ ⇄ Comparar ]`)**: Tabla en dos paneles que muestra la diferencia ($\Delta$) de entrada satelital y el impacto en las decisiones de la IA.

### 4.2. Red IoT de Nodos Centinela y Gateways LoRaWAN
- **Nodos Gateway Hubs**: Quimilí (Central), Añatuya (IP67), Bandera (Bajos Submeridionales), Termas de Río Hondo (Cuenca Río Dulce), Filadelfia, Villa Montes, Sáenz Peña y Resistencia.
- **Capa LoRa RF Links**: Líneas discontinuas luminiscentes en MapLibre GL que representan los enlaces de radiofrecuencia entre gateways y nodos de campo.
- **Telemetría de Hardware**: Monitoreo de voltaje de batería (3.6–4.2 V), nivel de señal RSSI (-120 a -80 dBm), SNR (-5 a 12 dB) y humedad volumétrica de suelo.

### 4.3. Motor de Modelos de IA en Dos Niveles
- **Nivel 1 (LightGBM Cuantílico)**: Modela el SPI-3M para $t+1$ hasta $t+6$ meses. En lugar de un número cerrado, proyecta un rango cuantílico $[p10, p90]$ que representa la probabilidad del 80% de ocurrencia.
- **Nivel 2 (Random Forest Classifier)**: Evalúa el estado conjunto del SPI, la humedad profunda SMAP y el forzante ONI para emitir una categoría de alerta:
  - 🟢 **Verde**: Condiciones normales y humedad óptima.
  - 🟡 **Amarillo**: Vigilancia agroclimática y ajuste de siembra.
  - 🟠 **Naranja**: Estrés hídrico severo o riesgo inminente de anegamiento.
  - 🔴 **Alerta Roja**: Sequía extrema y colapso de reservas hídricas profundas.
- **Explicabilidad SHAP**: Gráfico de 5 barras horizontales ordenadas por impacto absoluto con colores (+ Sequía en rojo, - Sequía en verde).

### 4.4. Gráfico de Proyección Avanzado
- **Bandas de color de fondo por categoría SPI**: Franjas sombreadas para Extrema ($< -2.0$), Severa ($-1.5$), Moderada ($-1.0$), Normal y Húmeda.
- **Línea vertical "HOY"**: Separa nítidamente el periodo histórico observado (Mayo - Noviembre) de la proyección futura (Diciembre - Mayo).
- **Selector de Años Análogos**: Superpone las grandes sequías históricas del Gran Chaco (2008-2009, 2018, 2022-2023).

### 4.5. Confianza y Transparencia
- **Confianza por Horizonte**: Mini-barras interactivas de $t+1$ a $t+6$ con decaimiento físico de la predictibilidad.
- **Panel de Métricas de Validación**: Métricas científicas (RMSE, correlación de Pearson $r$ y skill vs climatología).
- **Frescura de Telemetría**: Cada tarjeta satelital indica cuándo fue actualizada la información y su estado operativo.

### 4.6. Mapa Trinacional Interactivo (MapLibre GL)
- Polígonos reales del Gran Chaco divididos por macro-regiones y departamentos de Argentina, Bolivia y Paraguay.
- **Capas intercambiables**: SPI Sequía, Humedad Radicular SMAP, Biomasa NDVI y Riesgo de Anegamiento.
- **Nodos Centinela**: Marcadores con balizas parpadeantes con el color del nivel de alerta y popups interactivos de diagnóstico Gateway LoRa.

### 4.7. Sistema de Suscripción a Alertas y Reporte PDF
- Formulario modal para suscribirse a alertas de un nodo específico por **Email** o **Telegram** (`/api/alerts/subscribe`).
- Botón **"Generar Reporte PDF"**: Compila en un documento profesional A4 la carátula oficial, el mapa del Gran Chaco, el gráfico de proyección continua con sus bandas, la tabla de valores de horizonte $t+1$ a $t+6$, las tarjetas satelitales y las recomendaciones operativas.

---

## 💻 5. Cómo Ejecutar el Proyecto Localmente

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/DhanBrandan/climate.git
cd climate
```

### Paso 2: Ejecutar el Servidor Web (Frontend)
```bash
python3 -m http.server 3005
```
- Dashboard principal: **`http://localhost:3005`**
- Presentación animada del equipo: **`http://localhost:3005/intro_prototype.html`**

### Paso 3: Ejecutar el Servidor Backend (FastAPI + GEE + LoRa)
```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 server.py
```
- API REST activa en: **`http://localhost:8000`**
- Documentación interactiva Swagger: **`http://localhost:8000/docs`**

---

## 📡 6. Integración de Campo LoRaWAN (Hardware In-Situ)

Para enviar datos desde un microcontrolador ESP32-C3 de campo hacia CLIMATE:
```bash
curl -X POST "http://localhost:8000/api/nodes/telemetry" \
  -H "Content-Type: application/json" \
  -d '{
    "node_id": "quimili",
    "localidad": "Quimilí",
    "provincia": "Santiago del Estero",
    "pais": "Argentina",
    "latitud": -27.646,
    "longitud": -62.416,
    "humedad_suelo_0_7cm_m3m3": 0.14,
    "temp_media_C": 28.5,
    "temp_min_C": 19.2,
    "temp_max_C": 35.1,
    "humedad_relativa_media_pct": 38.0,
    "bateria_v": 3.95,
    "rssi": -92.0,
    "snr": 8.5,
    "fecha_local": "2026-11-15",
    "hora_local": "12:00:00"
  }'
```

---

## 🤝 7. Cómo Compartir este Proyecto con tu Compañera

- **Repositorio oficial:** [https://github.com/DhanBrandan/climate](https://github.com/DhanBrandan/climate)
- **Invitación en GitHub:** Ve a `Settings` > `Collaborators` y añade a `Danielafz`.
- **Manual Maestro para el equipo:** [MANUAL_COMPLETO_PROYECTO.md](MANUAL_COMPLETO_PROYECTO.md)

---

*Proyecto desarrollado con pasión para el Gran Chaco Americano — NASA Space Apps Challenge.*
