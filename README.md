# Proyecto CLIMATE — Gran Chaco
### Sistema Híbrido de Proyección Climática y Alerta Temprana
**NASA Space Apps Challenge 2026** — Documentación Técnica, Científica y Operativa

---

## 🛰️ 1. Resumen del Proyecto

El **Gran Chaco Americano** experimenta ciclos acoplados extremos: sequías prolongadas que diezman la humedad del suelo y la biomasa, seguidas por pulsos severos de precipitación modulados por el fenómeno ENSO (El Niño) que causan anegamientos por la pérdida de infiltración del suelo sedimentario.

Este sistema establece su **sitio centinela en Quimilí, Santiago del Estero (-28.64°, -62.42°)** y desacopla la baja resolución de los modelos globales mediante una **arquitectura híbrida de dos niveles**:

1. **Nivel 1 (LightGBM):** Proyección continua multivariable con lags temporales ($t-1$ a $t-6$) e intervalos empíricos de incertidumbre ($p10, p50, p90$).
2. **Nivel 2 (Random Forest Classifier + SHAP):** Motor de alerta categórica (**Verde, Amarillo, Naranja, Rojo**) con explicabilidad transparente de cada variable que detona la decisión.

---

## 🗺️ 2. Arquitectura de Visualización (Mapbox GL JS)

La interfaz gráfica implementa **Mapbox GL JS (WebGL)**:

* **Sitio Centinela Quimilí:** Marcador interactivo con baliza de pulso sincronizada en tiempo real con el nivel de alerta.
* **Capas Satelitales Intercambiables:**
  * **SPI Sequía:** Índice estandarizado de sequía ajustado con distribución Gamma acumulada.
  * **Humedad Radicular (SMAP/GLDAS):** Variable crítica `GWETROOT` para prevenir colapso agropecuario antes de que se seque la superficie.
  * **Biomasa NDVI (MODIS Terra/Aqua):** Vigor fotosintético del Chaco Seco.
  * **Riesgo de Anegamiento:** Acoplamiento no lineal de sellado del suelo y pulso de precipitación pronosticada.
* **Línea de Tiempo Predictiva:** Scrubber interactivo con modo reproducción automática (1x, 2x) que recorre desde $t-6$ meses (histórico observado) hasta $t+6$ meses (proyección cuantílica).
* **Gráficos Dinámicos:** Cono de incertidumbre $p10-p90$ y gráfico de barras de impacto **SHAP**.
* **Accionabilidad Computada:** Recomendaciones específicas para municipios (gestión de reservorios y canales) y productores (fechas de siembra diferida).

---

## 🚀 3. Cómo Ejecutar la Aplicación

### Opción A: Interfaz Web (Inmediato)
Puedes abrir directamente el archivo `index.html` en tu navegador o servirlo con el servidor HTTP de Python:

```bash
cd proyecto-climate
python3 -m http.server 3000
```

Luego abre tu navegador en:
👉 `http://localhost:3000`

### Opción B: Backend API FastAPI (Opcional)
Para correr la API matemática en Python:

```bash
cd proyecto-climate
pip install -r requirements.txt
python3 -m uvicorn server:app --reload --port 8000
```

Documentación interactiva Swagger:
👉 `http://localhost:8000/docs`

---

## 📊 4. Misiones Satelitales Acopladas
* **Atmosféricas:** NASA POWER / MERRA-2 (`T2M`, `T2M_MAX`, `ALLSKY_SFC_SW_DWN`, `RH2M`).
* **Balance Hídrico:** GPM IMERG (`PRECTOTCORR`) y SMAP/GLDAS (`GWETROOT`).
* **Biomasa:** MODIS Terra/Aqua (`MOD13C2` NDVI).
* **Forzante Oceánico:** NOAA CPC (Índice `ONI` con rezago de 0 a 6 meses).
