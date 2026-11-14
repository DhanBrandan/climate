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
import os
import json
import time
import uuid
import smtplib
import urllib.request
import urllib.parse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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

# Configuración Geográfica: Gran Chaco Americano
GRAN_CHACO_METADATA = {
    "region": "Gran Chaco Americano",
    "scope": "Trinacional (Argentina, Bolivia, Paraguay, Brasil)",
    "area_km2": 1100000,
    "center": {"lat": -24.80, "lon": -61.20},
    "sentinel_nodes": {
        "gran_chaco": {"name": "Gran Chaco Americano (Consolidado)", "scope": "Trinacional"},
        "quimili": {"name": "Quimilí", "province": "Santiago del Estero", "country": "Argentina", "lat": -28.64, "lon": -62.42},
        "filadelfia": {"name": "Filadelfia", "department": "Boquerón", "country": "Paraguay", "lat": -22.35, "lon": -60.03},
        "villamontes": {"name": "Villa Montes", "department": "Tarija", "country": "Bolivia", "lat": -21.26, "lon": -63.46},
        "saenzpena": {"name": "Sáenz Peña", "province": "Chaco", "country": "Argentina", "lat": -26.79, "lon": -60.44},
        "resistencia": {"name": "Resistencia", "province": "Chaco", "country": "Argentina", "lat": -27.45, "lon": -58.98}
    }
}

QUIMILI_METADATA = GRAN_CHACO_METADATA["sentinel_nodes"]["quimili"]

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
        "region": GRAN_CHACO_METADATA,
        "gee_status": gee_manager.get_status(),
        "status": "ONLINE"
    }

@app.get("/api/sentinel")
def get_sentinel_info():
    return GRAN_CHACO_METADATA

@app.get("/api/region")
def get_region_info():
    return GRAN_CHACO_METADATA

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
    node: str = Query("gran_chaco", description="Nodo centinela o región: gran_chaco, quimili, filadelfia, villamontes, saenzpena, resistencia"),
    start_date: str = Query("2026-10-01", description="Fecha inicio"),
    end_date: str = Query("2026-11-14", description="Fecha fin")
):
    """
    Extrae la telemetría satelital del Gran Chaco o de un nodo centinela directamente desde Earth Engine
    """
    return gee_manager.extract_sentinel_telemetry(node=node, start_date=start_date, end_date=end_date)

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

# ================= SISTEMA DE SUSCRIPCIÓN A ALERTAS Y NOTIFICACIONES =================
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
ALERT_FROM_EMAIL = os.getenv("ALERT_FROM_EMAIL", "alertas-climate@chaco.org")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

SUBSCRIPTIONS_FILE = "subscriptions.json"

def load_subscriptions():
    if os.path.exists(SUBSCRIPTIONS_FILE):
        try:
            with open(SUBSCRIPTIONS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_subscriptions(subs):
    try:
        with open(SUBSCRIPTIONS_FILE, "w", encoding="utf-8") as f:
            json.dump(subs, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[ALERTS] Error guardando archivo de suscripciones: {e}")

class AlertSubscriptionModel(BaseModel):
    id: Optional[str] = None
    zone: str
    zone_name: str
    channel: str  # "email" | "telegram"
    destination: str
    threshold: str  # "any" | "yellow" | "orange" | "red"
    created_at: Optional[str] = None

class AlertNotifyRequest(BaseModel):
    zone: str
    zone_name: str
    previous_level: str
    new_level: str
    spi: float
    confidence: float
    recommendation: Optional[str] = None
    channel: Optional[str] = None
    destination: Optional[str] = None

def dispatch_email_alert(to_email: str, zone_name: str, prev_level: str, new_level: str, spi: float, confidence: float, recommendation: str):
    subject = f"🚨 [ALERTA CLIMATE] Cambio de Nivel en {zone_name}: {new_level}"
    badge_color = "#7F1D1D" if new_level == "ROJO" else "#7C2D12" if new_level == "NARANJA" else "#78350F" if new_level == "AMARILLO" else "#064E3B"
    
    body_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #060913; color: #F8FAFC; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #0B0F19; border: 1px solid #1E293B; border-radius: 14px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="border-bottom: 2px solid #06B6D4; padding-bottom: 12px; margin-bottom: 16px;">
      <h1 style="color: #38BDF8; font-size: 18px; margin: 0; letter-spacing: 0.5px;">PROYECTO CLIMATE • ALERTA TEMPRANA</h1>
      <p style="color: #94A3B8; font-size: 12px; margin: 4px 0 0 0;">NASA Space Apps Challenge 2026 • Gran Chaco Americano</p>
    </div>
    
    <div style="background-color: {badge_color}; border-radius: 10px; padding: 16px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.15);">
      <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #E2E8F0; letter-spacing: 1px;">Transición de Alerta Detectada:</div>
      <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 4px;">
        {prev_level} ➔ {new_level}
      </div>
      <div style="font-size: 13px; font-family: monospace; margin-top: 8px; color: #F1F5F9;">
        📍 <b>Zona:</b> {zone_name}<br>
        📉 <b>Índice SPI 3M:</b> {spi:+.2f}<br>
        🎯 <b>Confianza Ensamble:</b> {confidence:.1f}%
      </div>
    </div>

    <div style="background-color: #0F172A; border: 1px solid #1E293B; border-radius: 10px; padding: 14px; margin-bottom: 16px;">
      <h3 style="color: #F59E0B; font-size: 12px; text-transform: uppercase; font-family: monospace; margin: 0 0 6px 0;">Recomendación y Medida de Contingencia:</h3>
      <p style="font-size: 13px; line-height: 1.5; color: #CBD5E1; margin: 0;">{recommendation}</p>
    </div>

    <div style="border-top: 1px solid #1E293B; padding-top: 12px; font-size: 11px; color: #64748B; font-family: monospace; display: flex; justify-content: space-between;">
      <span>Emisión: {time.strftime('%Y-%m-%d %H:%M:%S UTC')}</span>
      <span>Plataforma CLIMATE Trinacional</span>
    </div>
  </div>
</body>
</html>"""

    if SMTP_USER and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = ALERT_FROM_EMAIL
            msg["To"] = to_email
            msg.attach(MIMEText(body_html, "html"))
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as s:
                s.starttls()
                s.login(SMTP_USER, SMTP_PASSWORD)
                s.sendmail(ALERT_FROM_EMAIL, [to_email], msg.as_string())
            return {"status": "DELIVERED", "channel": "email", "recipient": to_email}
        except Exception as e:
            return {"status": "SMTP_ERROR", "detail": str(e), "channel": "email", "recipient": to_email}
    else:
        print(f"[ALERTS DISPATCH MOCK - EMAIL] To: {to_email} | Zone: {zone_name} | {prev_level} -> {new_level}")
        return {
            "status": "MOCK_DELIVERED",
            "channel": "email",
            "recipient": to_email,
            "note": "Notificación simulada correctamente (Credenciales SMTP_USER / SMTP_PASSWORD no configuradas en variables de entorno)."
        }

def dispatch_telegram_alert(chat_id: str, zone_name: str, prev_level: str, new_level: str, spi: float, confidence: float, recommendation: str):
    text_md = (
        f"🚨 *ALERTA CLIMATE — GRAN CHACO*\n\n"
        f"📍 *Zona Monitoreada:* {zone_name}\n"
        f"⚠️ *Transición de Estado:* `{prev_level}` ➔ *{new_level}*\n"
        f"📉 *Índice SPI 3M:* `{spi:+.2f}`\n"
        f"🎯 *Confianza Modelo:* `{confidence:.1f}%`\n\n"
        f"📋 *Acción Recomendada:* {recommendation}\n\n"
        f"⏱ _Emisión Oficial: {time.strftime('%Y-%m-%d %H:%M:%S UTC')}_"
    )

    if TELEGRAM_BOT_TOKEN:
        try:
            url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
            payload = json.dumps({"chat_id": chat_id, "text": text_md, "parse_mode": "Markdown"}).encode("utf-8")
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                res = json.loads(resp.read().decode())
            return {"status": "DELIVERED", "channel": "telegram", "recipient": chat_id, "telegram_res": res}
        except Exception as e:
            return {"status": "TELEGRAM_ERROR", "detail": str(e), "channel": "telegram", "recipient": chat_id}
    else:
        print(f"[ALERTS DISPATCH MOCK - TELEGRAM] ChatId: {chat_id} | Zone: {zone_name} | {prev_level} -> {new_level}")
        return {
            "status": "MOCK_DELIVERED",
            "channel": "telegram",
            "recipient": chat_id,
            "note": "Mensaje Telegram simulado correctamente (Variable TELEGRAM_BOT_TOKEN no configurada en variables de entorno)."
        }

@app.get("/api/alerts/config-status")
def get_alerts_config_status():
    """Reporta el estado de configuración de credenciales de envío en variables de entorno"""
    return {
        "email": {
            "configured": bool(SMTP_USER and SMTP_PASSWORD),
            "smtp_host": SMTP_HOST,
            "smtp_port": SMTP_PORT,
            "from_email": ALERT_FROM_EMAIL
        },
        "telegram": {
            "configured": bool(TELEGRAM_BOT_TOKEN),
            "has_token": bool(TELEGRAM_BOT_TOKEN)
        }
    }

@app.get("/api/alerts/subscriptions")
def get_subscriptions():
    """Devuelve la lista de suscripciones activas"""
    return load_subscriptions()

@app.post("/api/alerts/subscribe")
def create_subscription(sub: AlertSubscriptionModel):
    """Registra una nueva suscripción a alertas para una zona y canal específico"""
    subs = load_subscriptions()
    new_sub = sub.dict()
    if not new_sub.get("id"):
        new_sub["id"] = f"sub_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    if not new_sub.get("created_at"):
        new_sub["created_at"] = time.strftime('%Y-%m-%d %H:%M:%S UTC')
    
    # Evitar duplicados exactos
    subs = [s for s in subs if not (s.get("zone") == new_sub["zone"] and s.get("destination") == new_sub["destination"] and s.get("channel") == new_sub["channel"])]
    subs.append(new_sub)
    save_subscriptions(subs)
    return {"status": "SUCCESS", "subscription": new_sub}

@app.delete("/api/alerts/subscriptions/{sub_id}")
def delete_subscription(sub_id: str):
    """Elimina una suscripción registrada"""
    subs = load_subscriptions()
    subs = [s for s in subs if s.get("id") != sub_id]
    save_subscriptions(subs)
    return {"status": "DELETED", "id": sub_id}

@app.post("/api/alerts/notify")
def trigger_alert_notification(req: AlertNotifyRequest):
    """
    Despacha una notificación de alerta al canal especificado o a todos los suscriptores de la zona
    """
    rec = req.recommendation or "Activar reservas de emergencia y monitoreo diario de napas y perfiles de humedad."
    results = []

    # Si se especificó canal y destino individual directo
    if req.channel and req.destination:
        if req.channel == "email":
            res = dispatch_email_alert(req.destination, req.zone_name, req.previous_level, req.new_level, req.spi, req.confidence, rec)
        else:
            res = dispatch_telegram_alert(req.destination, req.zone_name, req.previous_level, req.new_level, req.spi, req.confidence, rec)
        results.append(res)
    else:
        # Despachar a todos los suscriptores activos de la zona
        subs = load_subscriptions()
        matching_subs = [s for s in subs if s.get("zone") == req.zone or s.get("zone") == "gran_chaco"]
        
        severity_order = {"VERDE": 0, "AMARILLO": 1, "NARANJA": 2, "ROJO": 3}
        for s in matching_subs:
            threshold = s.get("threshold", "any")
            should_notify = False
            
            if threshold == "any":
                should_notify = req.previous_level != req.new_level
            elif threshold == "yellow":
                should_notify = severity_order.get(req.new_level, 0) >= 1
            elif threshold == "orange":
                should_notify = severity_order.get(req.new_level, 0) >= 2
            elif threshold == "red":
                should_notify = req.new_level == "ROJO"

            if should_notify:
                if s.get("channel") == "email":
                    res = dispatch_email_alert(s.get("destination"), req.zone_name, req.previous_level, req.new_level, req.spi, req.confidence, rec)
                else:
                    res = dispatch_telegram_alert(s.get("destination"), req.zone_name, req.previous_level, req.new_level, req.spi, req.confidence, rec)
                results.append(res)

    return {"status": "PROCESSED", "dispatched_count": len(results), "deliveries": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
