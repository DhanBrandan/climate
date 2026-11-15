# 🛰️ PROYECTO CLIMATE — GRAN CHACO AMERICANO
## Sistema Híbrido de Proyección Climática, Alerta Temprana y Explicabilidad Satelital (NASA Space Apps Challenge)
**Documento Maestro de Transferencia de Conocimiento y Guía de Continuidad Técnica**

---

## 📌 1. Visión y Objetivo del Proyecto

El **Gran Chaco Americano** es el segundo ecosistema boscoso más extenso de Sudamérica (~1.100.000 km² a lo largo de **Argentina, Bolivia y Paraguay**). Es una ecorregión transfronteriza altamente vulnerable a ciclos climáticos acoplados extremos:
1. **Sequías profundas y prolongadas** que agotan la humedad radicular del suelo antes de que sea evidente en la vegetación.
2. **Pulsos torrenciales de lluvia** modulados por eventos oceánicos (El Niño / ENSO) que, al impactar sobre suelos arcillosos y sedimentarios degradados por la sequía, provocan inundaciones y anegamientos masivos.

### El Desafío
Los pronósticos globales tradicionales tienen baja resolución espacial y no son accionables para un productor agropecuario o un intendente local.

### Nuestra Solución: "Proyecto CLIMATE"
Un **sistema híbrido de inteligencia artificial acoplado a telemetría satelital en tiempo real (NASA y NOAA)** que:
- Monitorea el Gran Chaco en su conjunto y a través de una **red de Nodos Centinela Trinacionales** (Quimilí, Filadelfia, Villa Montes, Sáenz Peña, Resistencia).
- Proyecta continuamente el índice de sequía **SPI a 6 meses vista** con intervalos de incertidumbre empírica ($p10, p50, p90$) mediante **LightGBM Cuantílico**.
- Clasifica el nivel de riesgo en 4 niveles (**Verde, Amarillo, Naranja, Rojo**) mediante un **Random Forest Classifier**.
- Explica de forma transparente cada decisión del modelo mediante **valores SHAP**, señalando si cada variable empuja hacia más sequía o hacia alivio.
- Permite operar en dos modos: **Planilla Calibrada (Demo histórica de 13 meses)** y **Google Earth Engine en Tiempo Real (En Vivo)**.
- Incluye sistema de suscripciones a alertas (Email/Telegram) y generador de reportes técnicos ejecutivos en PDF.

---

## 🏗️ 2. Arquitectura del Sistema

```
                      ┌──────────────────────────────────────────────┐
                      │    FUENTES SATELITALES (NASA / NOAA / GEE)    │
                      │  • GPM IMERG: Precipitación acumulada         │
                      │  • SMAP L4: Humedad radicular profunda        │
                      │  • MODIS Terra: Vigor fotosintético (NDVI)    │
                      │  • NOAA CPC: Índice ENSO ONI (Niño 3.4)       │
                      │  • MERRA-2: Temperatura máx y radiación       │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────┴───────────────────────┐
                      │      CAPA BACKEND (Python 3.9+ / FastAPI)     │
                      │  • server.py: API REST asíncrona             │
                      │  • gee_service.py: Conector oficial GEE SDK  │
                      │  • Inferencia LightGBM + Random Forest + SHAP│
                      │  • Gestor de Suscripciones (Email/Telegram)  │
                      └──────────────────────┬───────────────────────┘
                                             │ JSON REST API (Puerto 8000)
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │     CAPA FRONTEND (SPA Vanilla + Tailwind)   │
                      │  • index.html: Interfaz Dark Mode espacial   │
                      │  • app.js: Motor de estado reactivo          │
                      │  • MapLibre GL / Mapbox: GeoJSON trinacional │
                      │  • Chart.js: Curva SPI + Incertidumbre + SHAP│
                      │  • html2pdf.js: Generador de informe PDF     │
                      └──────────────────────────────────────────────┘
```

---

## 📂 3. Estructura del Repositorio

| Archivo / Carpeta | Propósito y Contenido |
| :--- | :--- |
| **`index.html`** | Estructura completa de la aplicación web de una sola página (SPA). Diseñado con clases de Tailwind CSS en tema oscuro espacial (`#060913`, `#0B0F19`, `#0F172A`). Contiene modales de GEE, suscripciones, ayuda técnica, referencias y comparativa de datos. |
| **`app.js`** | Cerebro del frontend (~6.800 líneas). Controla el estado global (`state`), el mapa MapLibre GL, los gráficos Chart.js, la interactividad del timeline, el inspector de clics en el mapa, el conmutador Planilla vs GEE y la generación del PDF. |
| **`server.py`** | Servidor backend en FastAPI. Expone endpoints de salud (`/api/health`), cálculo predictivo (`/api/predict`), telemetría en vivo GEE (`/api/gee/telemetry`), simulación híbrida (`/api/gee/simulate-live`), suscripciones (`/api/alerts/subscribe`) y envío de notificaciones. |
| **`gee_service.py`** | Wrapper de Python que se conecta a la librería `ee` (Google Earth Engine) usando la cuenta y proyecto de servicio para extraer datos en vivo de Sentinel, GPM, SMAP y MODIS. |
| **`gran_chaco_real_regions.json`** | GeoJSON con límites geográficos reales de la ecorregión Gran Chaco y de departamentos de Argentina, Bolivia y Paraguay, optimizado sin solapamientos. |
| **`requirements.txt`** | Dependencias de Python (`fastapi`, `uvicorn`, `earthengine-api`, `pydantic`, `requests`). |
| **`iniciar_climate.command`** | Script de inicio de un solo clic para macOS. |
| **`setup_gee.sh`** | Script interactivo para autenticar la cuenta de Google Earth Engine mediante CLI. |

---

## 🌟 4. Funcionalidades Implementadas en el Prototipo

### 4.1. Conmutador de Fuente de Datos: Planilla vs GEE en Vivo
- **Planilla Demo**: Utiliza la serie temporal sintética calibrada (`QUIMILI_TIME_SERIES`) de 13 pasos mensuales (May 2026 - May 2027) para observar la evolución histórica y la proyección.
- **GEE en Vivo**: Consulta al endpoint `/api/gee/simulate-live`, descargando la telemetría satelital real del Gran Chaco y ejecutando los modelos de ML al vuelo.
- **Modal Comparativo (`[ ⇄ Comparar ]`)**: Tabla en dos paneles que muestra la diferencia ($\Delta$) de entrada satelital y el impacto en las decisiones de la IA.

### 4.2. Motor de Modelos de IA en Dos Niveles
- **Nivel 1 (LightGBM Cuantílico)**: Modela el SPI-3M para $t+1$ hasta $t+6$ meses. En lugar de un número cerrado, proyecta un rango cuantílico $[p10, p90]$ que representa la probabilidad del 80% de ocurrencia.
- **Nivel 2 (Random Forest Classifier)**: Evalúa el estado conjunto del SPI, la humedad profunda SMAP y el forzante ONI para emitir una categoría de alerta:
  - 🟢 **Verde**: Condiciones normales y humedad óptima.
  - 🟡 **Amarillo**: Vigilancia agroclimática y ajuste de siembra.
  - 🟠 **Naranja**: Estrés hídrico severo o riesgo inminente de anegamiento.
  - 🔴 **Alerta Roja**: Sequía extrema y colapso de reservas hídricas profundas.
- **Explicabilidad SHAP**: Gráfico de 5 barras horizontales ordenadas por impacto absoluto. Indica con colores (+ Sequía en rojo, - Sequía en verde) y etiquetas claras cómo cada satélite forzó la predicción.
- **Diferenciación explícita de datos**: Distingue claramente entre el "ONI Observado" (+1.65 °C) y la "Contribución SHAP del ONI" (+0.380).

### 4.3. Gráfico de Proyección Avanzado
- **Bandas de color de fondo por categoría SPI**: Franjas sombreadas para Extrema ($< -2.0$), Severa ($-1.5$), Moderada ($-1.0$), Normal y Húmeda.
- **Línea vertical marcada "HOY"**: Separa nítidamente el periodo histórico observado (Mayo - Noviembre) de la proyección futura (Diciembre - Mayo).
- **Selector de Años Análogos**: Permite superponer en el gráfico las curvas reales de grandes sequías históricas del Gran Chaco:
  - 🔴 **2008-2009**: Gran sequía agropecuaria del Cono Sur.
  - 🟡 **2018**: Sequía histórica de primavera-verano.
  - 🟣 **2022-2023**: Trienio La Niña y colapso hídrico de la cuenca del Plata.
- **Tooltips dinámicos**: Al pasar el mouse se indica fecha, valor $p50$, intervalo de confianza $[p10, p90]$ y categoría hidrológica.

### 4.4. Confianza y Transparencia
- **Confianza por Horizonte**: Mini-barras interactivas de $t+1$ a $t+6$ con decaimiento físico de la predictibilidad.
- **Panel de Métricas de Validación**: Métricas científicas (RMSE, correlación de Pearson $r$ y ganancia predictiva vs climatología).
- **Frescura de Telemetría**: Cada tarjeta satelital indica cuándo fue actualizada la información (ej. "hace 2 días", "hace 6 h") y su estado operativo.
- **Panel "¿Cómo se calcula?"**: Explicación en lenguaje no técnico sobre cómo funcionan LightGBM, Random Forest y SHAP, reconociendo límites del modelo.

### 4.5. Mapa Trinacional Interactivo (MapLibre GL)
- Polígonos reales del Gran Chaco divididos por macro-regiones y departamentos de Argentina, Bolivia y Paraguay.
- **Capas intercambiables**: SPI Sequía, Humedad Radicular SMAP, Biomasa NDVI y Riesgo de Anegamiento.
- **Point Inspector (Clic en cualquier parte del mapa)**: Al hacer clic en cualquier punto geográfico (no sólo ciudades), se realiza una inferencia espacial en tiempo real mostrando SPI local, alerta y sparkline de 12 meses.
- **Nodos Centinela**: Marcadores con balizas parpadeantes con el color del nivel de alerta.

### 4.6. Sistema de Suscripción a Alertas Tempranas
- Formulario modal que permite al usuario suscribirse a alertas de un nodo específico por **Correo Electrónico** o **Canal de Telegram**.
- Persistencia local y en backend vía `/api/alerts/subscribe` con variables de entorno preparadas (`SMTP_HOST`, `SMTP_USER`, `TELEGRAM_BOT_TOKEN`).

### 4.7. Generación de Reporte Ejecutivo en PDF
- Botón **"Generar Reporte PDF"**: Compila en un documento profesional A4 la carátula oficial, el mapa del Gran Chaco, el gráfico de proyección continua con sus bandas, la tabla de valores de horizonte $t+1$ a $t+6$, las tarjetas satelitales y las recomendaciones operativas para municipios y productores.

---

## 💻 5. Cómo Ejecutar el Proyecto Localmente

### Prerrequisitos
- **Git** instalado.
- **Navegador web moderno** (Chrome, Firefox, Safari o Edge).
- **Python 3.9 o superior** (para el servidor y backend de IA).

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/DhanBrandan/climate.git
cd climate
```

### Paso 2: Ejecutar el Servidor Web (Frontend)
En una terminal en la carpeta del proyecto:
```bash
python3 -m http.server 3005
```
Abre tu navegador en: **`http://localhost:3005`**

### Paso 3: Ejecutar el Servidor Backend (FastAPI + GEE)
En una segunda ventana de la terminal:
```bash
# Crear un entorno virtual (recomendado)
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor backend
python3 server.py
```
El servidor backend se iniciará en **`http://localhost:8000`**.
- Documentación interactiva de endpoints: **`http://localhost:8000/docs`**

---

## 🛰️ 6. Configuración de Google Earth Engine (Opcional para datos en vivo)

El proyecto incluye un mecanismo de **contingencia automática**: si Google Earth Engine no está autenticado en la máquina local, el sistema activa automáticamente un *mock satelital en vivo* para que la interfaz nunca se rompa.

Para vincular una cuenta real de Google Earth Engine:
1. Tener un proyecto en Google Cloud con la Earth Engine API habilitada.
2. Ejecutar en la terminal:
   ```bash
   earthengine authenticate
   ```
3. Seguir el enlace de inicio de sesión de Google y pegar el token de autenticación.
4. El proyecto vinculado actual en el código es: `orbital-wording-514718-k1`.

---

## 🤝 7. Cómo Compartir este Proyecto con tu Compañera

Para que tu compañera se sume al proyecto de inmediato:

### Opción A: Invitarla como Colaboradora en GitHub (Recomendado)
1. Ve a tu repositorio en GitHub: [https://github.com/DhanBrandan/climate](https://github.com/DhanBrandan/climate)
2. Haz clic en **Settings** (Configuración) > **Collaborators** (Colaboradores).
3. Haz clic en **"Add people"** y busca el usuario de tu compañera (ej. `Danielafz`).
4. Ella recibirá una invitación por email o en GitHub; al aceptarla, podrá clonar, crear ramas (`git checkout -b feature/nueva-idea`) y hacer `git push`.

### Opción B: Compartir este Archivo Markdown
- Puedes enviarle directamente este archivo: [MANUAL_COMPLETO_PROYECTO.md](file:///Users/dhanbrandan/Programacion/CLIMATE/MANUAL_COMPLETO_PROYECTO.md).
- Al abrirlo en Visual Studio Code, GitHub o cualquier visor de Markdown, tendrá toda la memoria técnica del proyecto explicada paso a paso.

---

## 🚀 8. Hoja de Ruta (Roadmap) e Ideas Abiertas para Continuar

Si tu compañera o el equipo desean seguir sumando valor para la presentación final o el pitch de la NASA, aquí hay ideas estratégicas listas para desarrollar:

1. **Capa de Focos de Calor e Incendios (NASA FIRMS)**:
   - Integrar la capa WMS de satélites VIIRS / MODIS de NASA FIRMS para ver focos de incendio activos superpuestos con las zonas en Alerta Roja de sequía.
2. **Descarga de Datos en Formato Abierto (Open Data GeoJSON / CSV)**:
   - Agregar un botón "Exportar Datos" para que investigadores y ONGs del Gran Chaco puedan descargar la serie temporal predictiva de su departamento en CSV o GeoJSON.
3. **Multi-idioma (Español / Guaraní / Inglés)**:
   - Traducir las alertas clave a Guaraní (idioma oficial en Paraguay y hablado en comunidades del Chaco) e Inglés para el jurado internacional de la NASA.
4. **Modo Comparativo Multi-Nodo**:
   - Una vista de dos mapas lado a lado para comparar el Chaco Seco (Quimilí) contra el Chaco Húmedo (Resistencia).
5. **Simulación de Escenarios Climáticos ("What-If")**:
   - Sliders donde el usuario pueda alterar artificialmente la lluvia esperada (ej. "-40% de precipitaciones") y ver cómo reacciona inmediatamente el cono de incertidumbre de la IA.

---

*Proyecto desarrollado con pasión para el Gran Chaco Americano — NASA Space Apps Challenge.*
