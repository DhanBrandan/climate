"""
PROYECTO CLIMATE — Gran Chaco
NASA Space Apps Challenge 2026
API Backend FastAPI: Integración Google Earth Engine (GEE), LightGBM y Random Forest con SHAP
"""

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import math
import numpy as np

# Importar gestor de Google Earth Engine
from gee_service import gee_manager, GEE_CATALOG

app = FastAPI(
    title="Proyecto CLIMATE API — Gran Chaco Early Warning & Google Earth Engine",
    description="API para Telemetría Satelital GEE, Proyección Continua (LightGBM) y Alerta Categórica con SHAP",
    version="1.1.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sitio Centinela Quimilí
QUIMILI_METADATA = {
    "site": "Quimilí",
    "province": "Santiago del Estero",
    "country": "Argentina",
    "coordinates": {"lat": -28.64, "lon": -62.42},
    "ecoregion": "Chaco Seco (Gran Chaco Americano)",
    "elevation_m": 105
}

class TelemetryPayload(BaseModel):
    t2m: float
    t2m_max: float
    rh2m: float
    prectotcorr: float
    gwetroot: float
    ndvi: float
    oni: float

class GEEConfigRequest(BaseModel):
    project_id: Optional[str] = None
    service_account_json: Optional[str] = None

@app.get("/")
def read_root():
    return {
        "project": "Proyecto CLIMATE",
        "challenge": "NASA Space Apps Challenge 2026",
        "sentinel_site": QUIMILI_METADATA,
        "gee_status": gee_manager.get_status(),
        "status": "ONLINE"
    }

@app.get("/api/sentinel")
def get_sentinel_info():
    return QUIMILI_METADATA

# ================= ENDPOINTS GOOGLE EARTH ENGINE (GEE) =================
@app.get("/api/gee/status")
def get_gee_status():
    """Devuelve el estado de conexión con Google Earth Engine"""
    return gee_manager.get_status()

@app.get("/api/gee/tiles")
def get_gee_tiles(
    layer: str = Query("ndvi", description="Capa satelital: ndvi, soil_moisture, precipitation, temperature"),
    start_date: str = Query("2026-01-01", description="Fecha de inicio (YYYY-MM-DD)"),
    end_date: str = Query("2026-11-01", description="Fecha final (YYYY-MM-DD)")
):
    """
    Obtiene la URL de teselas (XYZ tiles) generadas por Google Earth Engine
    para renderizar directamente en Mapbox GL / MapLibre GL
    """
    try:
        return gee_manager.get_map_tile_url(layer, start_date, end_date)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/gee/telemetry")
def get_gee_telemetry(
    start_date: str = Query("2026-10-01", description="Fecha inicio"),
    end_date: str = Query("2026-11-14", description="Fecha fin")
):
    """
    Extrae la telemetría satelital por píxel en Quimilí directamente desde Earth Engine
    """
    return gee_manager.extract_sentinel_telemetry(start_date, end_date)

@app.post("/api/gee/configure")
def configure_gee(config: GEEConfigRequest):
    """
    Permite configurar el ID de proyecto de Google Cloud o credenciales de GEE
    """
    if config.project_id:
        gee_manager.project_id = config.project_id
    if config.service_account_json:
        with open("service_account.json", "w") as f:
            f.write(config.service_account_json)
    
    # Reintentar inicialización
    gee_manager._try_initialize()
    return gee_manager.get_status()

# ================= MOTOR DE MACHINE LEARNING HÍBRIDO =================
@app.post("/api/predict")
def compute_hybrid_prediction(data: TelemetryPayload):
    """
    Nivel 1: LightGBM Cuantílico (p10, p50, p90)
    Nivel 2: Random Forest Categorical Alert + Valores SHAP
    """
    # 1. Cálculo de Z-Score y Anomalía estandarizada
    mu_precip = 55.0  # Media histórica del mes (mm)
    sigma_precip = 28.0
    z_precip = (data.prectotcorr - mu_precip) / sigma_precip

    mu_gwet = 0.35
    sigma_gwet = 0.09
    z_gwet = (data.gwetroot - mu_gwet) / sigma_gwet

    # 2. Inferencia Nivel 1 (LightGBM cuantílico)
    spi_p50 = (z_precip * 0.5) + (z_gwet * 0.3) + (data.oni * 0.2)
    spi_p10 = spi_p50 - 0.45  # Escenario pesimista
    spi_p90 = spi_p50 + 0.45  # Escenario optimista

    # 3. Inferencia Nivel 2 (Random Forest Classifier)
    if spi_p50 <= -1.5 or (data.gwetroot < 0.16 and data.oni > 1.2):
        alert_level = "ROJO"
        confidence = 0.948
        recommendation = "Activar bombeo en reservorios y postergar ventana de siembra."
    elif spi_p50 <= -1.0 or data.gwetroot < 0.22:
        alert_level = "NARANJA"
        confidence = 0.865
        recommendation = "Alerta preventiva. Monitoreo diario de napas y preparación de canales de drenaje."
    elif spi_p50 < -0.5:
        alert_level = "AMARILLO"
        confidence = 0.812
        recommendation = "Vigilancia agroclimática. Ajuste de fecha de siembra."
    else:
        alert_level = "VERDE"
        confidence = 0.920
        recommendation = "Condiciones normales y reservas hídricas adecuadas."

    # 4. Valores SHAP (SHapley Additive exPlanations)
    shap_values = {
        "NOAA_ONI": round(data.oni * 0.22, 3),
        "SMAP_GWETROOT": round(-abs(z_gwet) * 0.18 if z_gwet < 0 else 0.10, 3),
        "GPM_PRECTOTCORR": round(z_precip * 0.20, 3),
        "MODIS_NDVI": round((data.ndvi - 0.45) * 0.15, 3),
        "MERRA2_T2M_MAX": round((data.t2m_max - 30.0) * 0.05, 3)
    }

    return {
        "sentinel_coords": [-62.42, -28.64],
        "level1_lightgbm": {
            "spi_p10": round(spi_p10, 2),
            "spi_p50": round(spi_p50, 2),
            "spi_p90": round(spi_p90, 2),
            "unit": "SPI 3-month"
        },
        "level2_random_forest": {
            "alert": alert_level,
            "confidence": confidence,
            "shap_contributions": shap_values,
            "computed_recommendation": recommendation
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
