/**
 * PROYECTO CLIMATE — Gran Chaco
 * Sistema Híbrido de Proyección Climática y Alerta Temprana
 * NASA Space Apps Challenge 2026
 *
 * Motor de Simulación Geoespacial Mapbox / MapLibre GL JS
 */

// ================= GEOGRAPHIC CONFIGURATION =================
const QUIMILI_COORDS = [-62.42, -28.64]; // Longitud, Latitud (Sitio Centinela)
const CHACO_CENTER = [-62.70, -28.20];     // Centro del Gran Chaco Santiagueño

// Open high-resolution tile styles (NO REQUIEREN API KEY NI TIENEN MARCA DE AGUA)
const TILE_STYLES = {
  dark: {
    version: 8,
    sources: {
      'esri-dark': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap'
      },
      'esri-labels': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'esri-dark-layer',
        type: 'raster',
        source: 'esri-dark',
        minzoom: 0,
        maxzoom: 19
      },
      {
        id: 'esri-labels-layer',
        type: 'raster',
        source: 'esri-labels',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  satellite: {
    version: 8,
    sources: {
      'esri-sat': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: '&copy; Esri, Maxar, Earthstar Geographics'
      }
    },
    layers: [
      {
        id: 'esri-sat-layer',
        type: 'raster',
        source: 'esri-sat',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  },
  osm: {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: [
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  }
};

// ================= TIMELINE STEPS (t-6 a t+6 meses) =================
const TIMELINE_STEPS = [
  { id: 0, label: 't-6 (Mayo 2026)', date: '2026-05', phase: 'historical', name: 'May 26' },
  { id: 1, label: 't-5 (Junio 2026)', date: '2026-06', phase: 'historical', name: 'Jun 26' },
  { id: 2, label: 't-4 (Julio 2026)', date: '2026-07', phase: 'historical', name: 'Jul 26' },
  { id: 3, label: 't-3 (Agosto 2026)', date: '2026-08', phase: 'historical', name: 'Ago 26' },
  { id: 4, label: 't-2 (Septiembre 2026)', date: '2026-09', phase: 'historical', name: 'Sep 26' },
  { id: 5, label: 't-1 (Octubre 2026)', date: '2026-10', phase: 'historical', name: 'Oct 26' },
  { id: 6, label: 't0 (Noviembre 2026 - HOY)', date: '2026-11', phase: 'current', name: 'Nov 26 (t0)' },
  { id: 7, label: 't+1 (Diciembre 2026)', date: '2026-12', phase: 'projection', name: 'Dic 26' },
  { id: 8, label: 't+2 (Enero 2027)', date: '2027-01', phase: 'projection', name: 'Ene 27' },
  { id: 9, label: 't+3 (Febrero 2027)', date: '2027-02', phase: 'projection', name: 'Feb 27' },
  { id: 10, label: 't+4 (Marzo 2027)', date: '2027-03', phase: 'projection', name: 'Mar 27' },
  { id: 11, label: 't+5 (Abril 2027)', date: '2027-04', phase: 'projection', name: 'Abr 27' },
  { id: 12, label: 't+6 (Mayo 2027)', date: '2027-05', phase: 'projection', name: 'May 27' }
];

// ================= DEPARTAMENTOS DEL CHACO SECO (GEOJSON) =================
const REGIONS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'moreno',
      properties: {
        id: 'moreno',
        name: 'Dpto. Moreno (Quimilí)',
        headquarter: 'Quimilí',
        isSentinel: true,
        infilFactor: 0.18
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-62.90, -28.20],
          [-61.80, -28.20],
          [-61.85, -29.10],
          [-62.95, -29.05],
          [-62.90, -28.20]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'ibarra',
      properties: {
        id: 'ibarra',
        name: 'Dpto. Juan Felipe Ibarra',
        headquarter: 'Suncho Corral',
        isSentinel: false,
        infilFactor: 0.22
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-63.60, -28.00],
          [-62.90, -28.20],
          [-62.95, -29.05],
          [-63.70, -28.80],
          [-63.60, -28.00]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'alberdi',
      properties: {
        id: 'alberdi',
        name: 'Dpto. Alberdi',
        headquarter: 'Campo Gallo',
        isSentinel: false,
        infilFactor: 0.25
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-63.40, -27.00],
          [-62.10, -27.05],
          [-61.80, -28.20],
          [-62.90, -28.20],
          [-63.40, -27.00]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'copo',
      properties: {
        id: 'copo',
        name: 'Dpto. Copo (Norte Chaco)',
        headquarter: 'Monte Quemado',
        isSentinel: false,
        infilFactor: 0.29
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-63.60, -25.70],
          [-61.70, -25.75],
          [-62.10, -27.05],
          [-63.40, -27.00],
          [-63.60, -25.70]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'taboada',
      properties: {
        id: 'taboada',
        name: 'Dpto. General Taboada',
        headquarter: 'Añatuya',
        isSentinel: false,
        infilFactor: 0.20
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-63.50, -28.80],
          [-62.20, -29.00],
          [-62.20, -29.80],
          [-63.40, -29.70],
          [-63.50, -28.80]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'figueroa',
      properties: {
        id: 'figueroa',
        name: 'Dpto. Figueroa (Cuenca Salado)',
        headquarter: 'La Cañada',
        isSentinel: false,
        infilFactor: 0.15
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-64.10, -27.30],
          [-63.40, -27.00],
          [-63.60, -28.00],
          [-64.10, -28.10],
          [-64.10, -27.30]
        ]]
      }
    }
  ]
};

// ================= MODEL MULTIVARIABLE TIME SERIES (QUIMILÍ) =================
const QUIMILI_TIME_SERIES = [
  // t-6 (Mayo 2026)
  {
    step: 0,
    precip: 24.5, precipAnom: -35,
    gwetroot: 0.36, gwetrootZ: -0.65,
    ndvi: 0.48, oni: +0.65, t2mMax: 26.2,
    spi: -0.42, p10: -0.80, p50: -0.42, p90: -0.10,
    alert: 'VERDE', alertConfidence: 89.2, floodRisk: 0.12,
    shap: { oni: 0.08, gwetroot: 0.12, precip: 0.14, ndvi: -0.05, t2mMax: 0.04 }
  },
  // t-5 (Junio 2026)
  {
    step: 1,
    precip: 12.0, precipAnom: -48,
    gwetroot: 0.30, gwetrootZ: -1.05,
    ndvi: 0.41, oni: +0.92, t2mMax: 24.8,
    spi: -0.78, p10: -1.15, p50: -0.78, p90: -0.45,
    alert: 'AMARILLO', alertConfidence: 78.4, floodRisk: 0.15,
    shap: { oni: 0.14, gwetroot: 0.19, precip: 0.20, ndvi: 0.02, t2mMax: 0.06 }
  },
  // t-4 (Julio 2026)
  {
    step: 2,
    precip: 8.5, precipAnom: -55,
    gwetroot: 0.24, gwetrootZ: -1.42,
    ndvi: 0.35, oni: +1.18, t2mMax: 25.5,
    spi: -1.12, p10: -1.45, p50: -1.12, p90: -0.75,
    alert: 'AMARILLO', alertConfidence: 84.1, floodRisk: 0.18,
    shap: { oni: 0.19, gwetroot: 0.24, precip: 0.22, ndvi: 0.08, t2mMax: 0.09 }
  },
  // t-3 (Agosto 2026)
  {
    step: 3,
    precip: 6.2, precipAnom: -68,
    gwetroot: 0.19, gwetrootZ: -1.78,
    ndvi: 0.30, oni: +1.40, t2mMax: 29.4,
    spi: -1.38, p10: -1.70, p50: -1.38, p90: -1.02,
    alert: 'NARANJA', alertConfidence: 88.6, floodRisk: 0.25,
    shap: { oni: 0.25, gwetroot: 0.28, precip: 0.26, ndvi: 0.14, t2mMax: 0.15 }
  },
  // t-2 (Septiembre 2026)
  {
    step: 4,
    precip: 14.1, precipAnom: -60,
    gwetroot: 0.16, gwetrootZ: -2.02,
    ndvi: 0.26, oni: +1.55, t2mMax: 33.2,
    spi: -1.54, p10: -1.88, p50: -1.54, p90: -1.20,
    alert: 'ROJO', alertConfidence: 92.5, floodRisk: 0.34,
    shap: { oni: 0.31, gwetroot: 0.33, precip: 0.28, ndvi: 0.21, t2mMax: 0.22 }
  },
  // t-1 (Octubre 2026)
  {
    step: 5,
    precip: 22.0, precipAnom: -58,
    gwetroot: 0.13, gwetrootZ: -2.25,
    ndvi: 0.22, oni: +1.62, t2mMax: 36.8,
    spi: -1.68, p10: -2.05, p50: -1.68, p90: -1.32,
    alert: 'ROJO', alertConfidence: 96.2, floodRisk: 0.42,
    shap: { oni: 0.36, gwetroot: 0.35, precip: 0.30, ndvi: 0.25, t2mMax: 0.28 }
  },
  // t0 (Noviembre 2026 - HOY)
  {
    step: 6,
    precip: 18.4, precipAnom: -62,
    gwetroot: 0.14, gwetrootZ: -2.15,
    ndvi: 0.24, oni: +1.65, t2mMax: 35.5,
    spi: -1.62, p10: -1.98, p50: -1.62, p90: -1.28,
    alert: 'ROJO', alertConfidence: 94.8, floodRisk: 0.45,
    shap: { oni: 0.38, gwetroot: 0.29, precip: 0.27, ndvi: 0.20, t2mMax: 0.24 }
  },
  // t+1 (Diciembre 2026 - Proyección LightGBM)
  {
    step: 7,
    precip: 92.0, precipAnom: +22,
    gwetroot: 0.22, gwetrootZ: -1.40,
    ndvi: 0.29, oni: +1.72, t2mMax: 34.0,
    spi: -0.95, p10: -1.55, p50: -0.95, p90: -0.32,
    alert: 'NARANJA', alertConfidence: 86.4, floodRisk: 0.78, // CRÍTICO: lluvia sobre suelo sellado
    shap: { oni: 0.42, gwetroot: -0.15, precip: 0.35, ndvi: 0.10, t2mMax: 0.12 }
  },
  // t+2 (Enero 2027)
  {
    step: 8,
    precip: 185.0, precipAnom: +68,
    gwetroot: 0.48, gwetrootZ: +0.65,
    ndvi: 0.45, oni: +1.68, t2mMax: 32.5,
    spi: +0.65, p10: +0.10, p50: +0.65, p90: +1.30,
    alert: 'NARANJA', alertConfidence: 89.0, floodRisk: 0.88,
    shap: { oni: 0.40, gwetroot: 0.20, precip: 0.46, ndvi: -0.18, t2mMax: -0.05 }
  },
  // t+3 (Febrero 2027)
  {
    step: 9,
    precip: 110.0, precipAnom: +15,
    gwetroot: 0.58, gwetrootZ: +1.10,
    ndvi: 0.58, oni: +1.45, t2mMax: 31.0,
    spi: +0.82, p10: +0.25, p50: +0.82, p90: +1.40,
    alert: 'AMARILLO', alertConfidence: 82.3, floodRisk: 0.55,
    shap: { oni: 0.28, gwetroot: 0.12, precip: 0.22, ndvi: -0.25, t2mMax: -0.08 }
  },
  // t+4 (Marzo 2027)
  {
    step: 10,
    precip: 75.0, precipAnom: -5,
    gwetroot: 0.52, gwetrootZ: +0.80,
    ndvi: 0.62, oni: +1.10, t2mMax: 29.8,
    spi: +0.45, p10: -0.15, p50: +0.45, p90: +1.05,
    alert: 'VERDE', alertConfidence: 91.2, floodRisk: 0.28,
    shap: { oni: 0.15, gwetroot: -0.05, precip: 0.08, ndvi: -0.30, t2mMax: -0.04 }
  },
  // t+5 (Abril 2027)
  {
    step: 11,
    precip: 45.0, precipAnom: -10,
    gwetroot: 0.46, gwetrootZ: +0.35,
    ndvi: 0.56, oni: +0.75, t2mMax: 27.0,
    spi: +0.15, p10: -0.40, p50: +0.15, p90: +0.70,
    alert: 'VERDE', alertConfidence: 94.0, floodRisk: 0.18,
    shap: { oni: 0.09, gwetroot: -0.08, precip: 0.05, ndvi: -0.22, t2mMax: 0.02 }
  },
  // t+6 (Mayo 2027)
  {
    step: 12,
    precip: 32.0, precipAnom: -15,
    gwetroot: 0.42, gwetrootZ: +0.10,
    ndvi: 0.50, oni: +0.40, t2mMax: 25.0,
    spi: -0.08, p10: -0.65, p50: -0.08, p90: +0.48,
    alert: 'VERDE', alertConfidence: 93.5, floodRisk: 0.14,
    shap: { oni: 0.05, gwetroot: -0.04, precip: 0.06, ndvi: -0.18, t2mMax: 0.04 }
  }
];

const DEPT_VARIATIONS = {
  moreno: { spiFactor: 1.0, gwetFactor: 1.0, ndviFactor: 1.0, floodBias: 0.0 },
  ibarra: { spiFactor: 0.95, gwetFactor: 0.92, ndviFactor: 0.96, floodBias: 0.05 },
  alberdi: { spiFactor: 1.08, gwetFactor: 1.05, ndviFactor: 1.04, floodBias: -0.05 },
  copo: { spiFactor: 0.90, gwetFactor: 0.88, ndviFactor: 0.90, floodBias: -0.08 },
  taboada: { spiFactor: 0.98, gwetFactor: 0.95, ndviFactor: 0.98, floodBias: 0.08 },
  figueroa: { spiFactor: 0.85, gwetFactor: 0.80, ndviFactor: 0.88, floodBias: 0.15 }
};

// ================= ESTADO DE LA APLICACIÓN =================
const state = {
  activeStep: 6, // t0
  activeLayer: 'spi', // 'spi', 'gwetroot', 'ndvi', 'flood'
  isPlaying: false,
  playSpeed: 1,
  playIntervalId: null,
  activeMapStyle: 'dark',
  mapLoaded: false
};

let map = null;
let projectionChart = null;
let shapChart = null;

// ================= FUNCIONES DE COLOR =================
function getSpiColor(val) {
  if (val <= -2.0) return '#7F1D1D'; // Extrema
  if (val <= -1.5) return '#EF4444'; // Severa
  if (val <= -1.0) return '#F97316'; // Moderada
  if (val <= -0.5) return '#FBBF24'; // Ligera
  if (val < 0.5) return '#94A3B8';  // Cerca de lo normal
  if (val < 1.5) return '#38BDF8';  // Húmedo
  return '#1D4ED8';                  // Muy húmedo
}

function getGwetrootColor(val) {
  if (val < 0.15) return '#DC2626';
  if (val < 0.25) return '#EA580C';
  if (val < 0.35) return '#F59E0B';
  if (val < 0.50) return '#10B981';
  return '#06B6D4';
}

function getNdviColor(val) {
  if (val < 0.25) return '#B45309';
  if (val < 0.35) return '#CA8A04';
  if (val < 0.45) return '#84CC16';
  if (val < 0.60) return '#22C55E';
  return '#15803D';
}

function getFloodColor(risk) {
  if (risk < 0.25) return '#1E293B';
  if (risk < 0.50) return '#0284C7';
  if (risk < 0.70) return '#EA580C';
  return '#DC2626';
}

function getFeatureColor(featureId, layer, stepData) {
  const variation = DEPT_VARIATIONS[featureId] || DEPT_VARIATIONS.moreno;

  if (layer === 'spi') {
    return getSpiColor(stepData.spi * variation.spiFactor);
  }
  if (layer === 'gwetroot') {
    const val = Math.max(0.05, Math.min(0.9, stepData.gwetroot * variation.gwetFactor));
    return getGwetrootColor(val);
  }
  if (layer === 'ndvi') {
    const val = Math.max(0.1, Math.min(0.85, stepData.ndvi * variation.ndviFactor));
    return getNdviColor(val);
  }
  if (layer === 'flood') {
    const val = Math.max(0.05, Math.min(0.99, stepData.floodRisk + variation.floodBias));
    return getFloodColor(val);
  }
  return '#3B82F6';
}

// ================= INICIALIZACIÓN DEL MAPA =================
function initMap() {
  try {
    const mapLib = window.maplibregl || window.mapboxgl;
    if (!mapLib) {
      console.error('No Map library loaded');
      return;
    }

    map = new mapLib.Map({
      container: 'map',
      style: TILE_STYLES.dark,
      center: CHACO_CENTER,
      zoom: 7.8,
      attributionControl: false
    });

    map.addControl(new mapLib.NavigationControl(), 'top-right');
    map.addControl(new mapLib.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      state.mapLoaded = true;
      setupMapLayers();
      setupSentinelMarker();
      updateMapData();
    });

  } catch (err) {
    console.error('Error inicializando el mapa:', err);
  }
}

function setupMapLayers() {
  try {
    if (!map.getSource('chaco-regions')) {
      map.addSource('chaco-regions', {
        type: 'geojson',
        data: REGIONS_GEOJSON
      });

      // Layer de relleno coroplético
      map.addLayer({
        id: 'chaco-regions-fill',
        type: 'fill',
        source: 'chaco-regions',
        paint: {
          'fill-color': '#EF4444',
          'fill-opacity': 0.60
        }
      });

      // Bordes departamentales
      map.addLayer({
        id: 'chaco-regions-line',
        type: 'line',
        source: 'chaco-regions',
        paint: {
          'line-color': '#06B6D4',
          'line-width': 2.2,
          'line-opacity': 0.9
        }
      });

      // Interacción: Click para abrir Popup con telemetría del departamento
      map.on('click', 'chaco-regions-fill', (e) => {
        if (e.features && e.features.length > 0) {
          showDepartmentPopup(e.lngLat, e.features[0].properties);
        }
      });

      map.on('mouseenter', 'chaco-regions-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'chaco-regions-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  } catch (err) {
    console.error('Error configurando capas en el mapa:', err);
  }
}

function showDepartmentPopup(lngLat, props) {
  const currentStepData = QUIMILI_TIME_SERIES[state.activeStep];
  const variation = DEPT_VARIATIONS[props.id] || DEPT_VARIATIONS.moreno;
  const spiVal = (currentStepData.spi * variation.spiFactor).toFixed(2);
  const gwetVal = (currentStepData.gwetroot * variation.gwetFactor).toFixed(2);
  const ndviVal = (currentStepData.ndvi * variation.ndviFactor).toFixed(2);
  const mapLib = window.maplibregl || window.mapboxgl;

  const html = `
    <div style="font-family: inherit; font-size: 12px; color: #F8FAFC;">
      <div style="font-weight: bold; font-size: 13px; color: #38BDF8; margin-bottom: 6px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
        ${props.name}
      </div>
      <div style="line-height: 1.6; font-family: monospace;">
        <div><b>Cabecera:</b> ${props.headquarter}</div>
        <div><b>SPI 3M:</b> <span style="color: ${spiVal < -1.5 ? '#EF4444' : '#38BDF8'}; font-weight: bold;">${spiVal}</span></div>
        <div><b>Humedad Radicular (SMAP):</b> ${gwetVal}</div>
        <div><b>Biomasa NDVI (MODIS):</b> ${ndviVal}</div>
        <div><b>Infiltración Sedimento:</b> ${(props.infilFactor * 100).toFixed(0)}%</div>
      </div>
    </div>
  `;

  new mapLib.Popup({ offset: 12 })
    .setLngLat(lngLat)
    .setHTML(html)
    .addTo(map);
}

function setupSentinelMarker() {
  try {
    const mapLib = window.maplibregl || window.mapboxgl;
    const el = document.createElement('div');
    el.className = 'cursor-pointer';
    el.innerHTML = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div class="sentinel-pulse" style="position: absolute; width: 34px; height: 34px; border-radius: 50%; color: #EF4444;"></div>
        <div style="width: 18px; height: 18px; border-radius: 50%; background: #EF4444; border: 2.5px solid #FFFFFF; box-shadow: 0 0 14px rgba(239, 68, 68, 0.8); z-index: 10;"></div>
        <div style="position: absolute; top: -32px; padding: 2px 7px; border-radius: 6px; background: rgba(11, 15, 25, 0.95); color: #38BDF8; font-family: monospace; font-size: 10px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.5); white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
          QUIMILÍ (CENTINELA)
        </div>
      </div>
    `;

    el.addEventListener('click', () => {
      map.flyTo({ center: QUIMILI_COORDS, zoom: 8.8, duration: 1200 });
    });

    new mapLib.Marker({ element: el })
      .setLngLat(QUIMILI_COORDS)
      .addTo(map);

  } catch (err) {
    console.error('Error creando el marcador centinela:', err);
  }
}

function updateMapData() {
  if (!state.mapLoaded || !map.getSource('chaco-regions')) return;

  try {
    const currentStepData = QUIMILI_TIME_SERIES[state.activeStep];
    const colorMatch = ['match', ['get', 'id']];

    REGIONS_GEOJSON.features.forEach(feat => {
      const col = getFeatureColor(feat.properties.id, state.activeLayer, currentStepData);
      colorMatch.push(feat.properties.id, col);
    });

    colorMatch.push('#3B82F6'); // fallback

    map.setPaintProperty('chaco-regions-fill', 'fill-color', colorMatch);

    // Color del pulso
    const alertColor = currentStepData.alert === 'ROJO' ? '#EF4444' :
                       currentStepData.alert === 'NARANJA' ? '#F97316' :
                       currentStepData.alert === 'AMARILLO' ? '#F59E0B' : '#10B981';

    const pulseEl = document.querySelector('.sentinel-pulse');
    if (pulseEl) pulseEl.style.color = alertColor;

  } catch (err) {
    console.error('Error actualizando capas del mapa:', err);
  }
}

// ================= GRÁFICOS (CHART.JS) =================
function initCharts() {
  try {
    initProjectionChart();
  } catch (err) {
    console.error('Error inicializando Chart Proyección:', err);
  }

  try {
    initShapChart();
  } catch (err) {
    console.error('Error inicializando Chart SHAP:', err);
  }
}

function initProjectionChart() {
  const canvas = document.getElementById('chart-projection');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const labels = TIMELINE_STEPS.map(s => s.name.split(' ')[0]);
  const p50Data = QUIMILI_TIME_SERIES.map(s => s.p50);
  const p10Data = QUIMILI_TIME_SERIES.map(s => s.p10);
  const p90Data = QUIMILI_TIME_SERIES.map(s => s.p90);
  const observedData = QUIMILI_TIME_SERIES.map((s, idx) => idx <= 6 ? s.spi : null);

  projectionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Observado',
          data: observedData,
          borderColor: '#F8FAFC',
          borderWidth: 2.2,
          pointRadius: 3,
          pointBackgroundColor: '#F8FAFC',
          tension: 0.2
        },
        {
          label: 'Mediana p50 (LightGBM)',
          data: p50Data,
          borderColor: '#06B6D4',
          borderWidth: 2,
          borderDash: [4, 4],
          pointRadius: 2,
          pointBackgroundColor: '#06B6D4',
          tension: 0.2
        },
        {
          label: 'Incertidumbre p90',
          data: p90Data,
          borderColor: 'transparent',
          backgroundColor: 'rgba(6, 182, 212, 0.20)',
          fill: 3, // Llena hacia el dataset de índice 3 (p10)
          pointRadius: 0,
          tension: 0.2
        },
        {
          label: 'Incertidumbre p10',
          data: p10Data,
          borderColor: 'transparent',
          pointRadius: 0,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0F172A',
          borderColor: '#334155',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.25)' },
          ticks: { color: '#94A3B8', font: { family: 'monospace', size: 9 } }
        },
        y: {
          grid: { color: 'rgba(51, 65, 85, 0.25)' },
          ticks: { color: '#94A3B8', font: { family: 'monospace', size: 9 } },
          min: -2.3,
          max: 1.6
        }
      }
    }
  });
}

function initShapChart() {
  const canvas = document.getElementById('chart-shap');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const currentStepData = QUIMILI_TIME_SERIES[state.activeStep];

  const shapLabels = [
    'NOAA ONI (ENSO)',
    'SMAP GWETROOT',
    'GPM Lluvia',
    'MODIS NDVI',
    'MERRA-2 T2M'
  ];

  const shapValues = [
    currentStepData.shap.oni,
    currentStepData.shap.gwetroot,
    currentStepData.shap.precip,
    currentStepData.shap.ndvi,
    currentStepData.shap.t2mMax
  ];

  shapChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: shapLabels,
      datasets: [{
        data: shapValues,
        backgroundColor: shapValues.map(v => v >= 0 ? '#EF4444' : '#10B981'),
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0F172A',
          borderColor: '#334155',
          borderWidth: 1,
          callbacks: {
            label: (ctx) => `Impacto SHAP: ${ctx.raw > 0 ? '+' : ''}${ctx.raw.toFixed(2)}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.25)' },
          ticks: { color: '#94A3B8', font: { family: 'monospace', size: 9 } }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#E2E8F0', font: { family: 'monospace', size: 9 } }
        }
      }
    }
  });
}

function updateCharts() {
  const currentStepData = QUIMILI_TIME_SERIES[state.activeStep];

  if (shapChart) {
    const shapValues = [
      currentStepData.shap.oni,
      currentStepData.shap.gwetroot,
      currentStepData.shap.precip,
      currentStepData.shap.ndvi,
      currentStepData.shap.t2mMax
    ];
    shapChart.data.datasets[0].data = shapValues;
    shapChart.data.datasets[0].backgroundColor = shapValues.map(v => v >= 0 ? '#EF4444' : '#10B981');
    shapChart.update('none');
  }

  if (projectionChart) {
    projectionChart.update('none');
  }
}

// ================= ACTUALIZACIÓN DE TELEMETRÍA Y UI =================
function updateUI() {
  const currentStepData = QUIMILI_TIME_SERIES[state.activeStep];
  const stepInfo = TIMELINE_STEPS[state.activeStep];

  // 1. Etiqueta y deslizador
  const labelEl = document.getElementById('timeline-step-label');
  if (labelEl) labelEl.textContent = stepInfo.label;
  const sliderEl = document.getElementById('timeline-slider');
  if (sliderEl) sliderEl.value = state.activeStep;

  // 2. Badge del Header
  const headerBadge = document.getElementById('header-alert-badge');
  const headerPulseDot = document.getElementById('header-pulse-dot');
  const headerPulseBeacon = document.getElementById('header-pulse-beacon');

  if (headerBadge) {
    if (currentStepData.alert === 'ROJO') {
      headerBadge.className = 'px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono tracking-wide bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse';
      headerBadge.textContent = 'ALERTA ROJA: SEQUÍA SEVERA';
      if (headerPulseDot) headerPulseDot.className = 'relative inline-flex rounded-full h-3 w-3 bg-red-500';
      if (headerPulseBeacon) headerPulseBeacon.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75';
    } else if (currentStepData.alert === 'NARANJA') {
      headerBadge.className = 'px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono tracking-wide bg-orange-500/20 text-orange-400 border border-orange-500/40';
      headerBadge.textContent = currentStepData.floodRisk > 0.6 ? 'ALERTA NARANJA: ANEGAMIENTO' : 'ALERTA NARANJA: DÉFICIT';
      if (headerPulseDot) headerPulseDot.className = 'relative inline-flex rounded-full h-3 w-3 bg-orange-500';
      if (headerPulseBeacon) headerPulseBeacon.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75';
    } else if (currentStepData.alert === 'AMARILLO') {
      headerBadge.className = 'px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono tracking-wide bg-amber-500/20 text-amber-400 border border-amber-500/40';
      headerBadge.textContent = 'ALERTA AMARILLA: VIGILANCIA';
      if (headerPulseDot) headerPulseDot.className = 'relative inline-flex rounded-full h-3 w-3 bg-amber-500';
      if (headerPulseBeacon) headerPulseBeacon.className = 'animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75';
    } else {
      headerBadge.className = 'px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono tracking-wide bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      headerBadge.textContent = 'CONDICIONES NORMALES';
      if (headerPulseDot) headerPulseDot.className = 'relative inline-flex rounded-full h-3 w-3 bg-emerald-500';
      if (headerPulseBeacon) headerPulseBeacon.className = 'relative inline-flex rounded-full h-3 w-3 bg-emerald-400';
    }
  }

  // 3. Tarjeta Nivel 2
  const alertCard = document.getElementById('alert-card');
  const alertTitle = document.getElementById('alert-title');
  const alertSubtitle = document.getElementById('alert-subtitle');
  const alertIconBox = document.getElementById('alert-icon-box');
  const alertConf = document.getElementById('alert-confidence');

  if (alertConf) alertConf.textContent = `${currentStepData.alertConfidence.toFixed(1)}%`;

  const pills = {
    VERDE: document.getElementById('pill-verde'),
    AMARILLO: document.getElementById('pill-amarillo'),
    NARANJA: document.getElementById('pill-naranja'),
    ROJO: document.getElementById('pill-rojo')
  };

  Object.keys(pills).forEach(key => {
    if (pills[key]) pills[key].className = 'py-1 rounded bg-space-800 text-slate-500';
  });

  if (currentStepData.alert === 'ROJO') {
    if (alertCard) alertCard.className = 'rounded-xl border p-3.5 bg-red-950/30 border-red-500/40 transition-all';
    if (alertTitle) { alertTitle.className = 'font-bold text-red-400 text-sm tracking-wide'; alertTitle.textContent = 'ALERTA ROJA: SEQUÍA SEVERA'; }
    if (alertSubtitle) alertSubtitle.textContent = `Quimilí • SPI 3M: ${currentStepData.spi.toFixed(2)} • Humedad Radicular crítica`;
    if (alertIconBox) { alertIconBox.className = 'w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-lg'; alertIconBox.textContent = '🚨'; }
    if (pills.ROJO) pills.ROJO.className = 'py-1 rounded bg-red-500 text-white font-bold shadow-lg shadow-red-950';
  } else if (currentStepData.alert === 'NARANJA') {
    if (alertCard) alertCard.className = 'rounded-xl border p-3.5 bg-orange-950/30 border-orange-500/40 transition-all';
    if (alertTitle) {
      alertTitle.className = 'font-bold text-orange-400 text-sm tracking-wide';
      alertTitle.textContent = currentStepData.floodRisk > 0.6 ? 'ALERTA NARANJA: RIESGO DE ANEGAMIENTO' : 'ALERTA NARANJA: ESTRÉS HÍDRICO';
    }
    if (alertSubtitle) {
      alertSubtitle.textContent = currentStepData.floodRisk > 0.6 
        ? `Lluvia torrencial (${currentStepData.precip}mm) sobre suelo sellado sin infiltración`
        : `Quimilí • SPI 3M: ${currentStepData.spi.toFixed(2)} • Alerta preventiva`;
    }
    if (alertIconBox) { alertIconBox.className = 'w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg'; alertIconBox.textContent = '⚠️'; }
    if (pills.NARANJA) pills.NARANJA.className = 'py-1 rounded bg-orange-500 text-white font-bold shadow-lg shadow-orange-950';
  } else if (currentStepData.alert === 'AMARILLO') {
    if (alertCard) alertCard.className = 'rounded-xl border p-3.5 bg-amber-950/30 border-amber-500/40 transition-all';
    if (alertTitle) { alertTitle.className = 'font-bold text-amber-400 text-sm tracking-wide'; alertTitle.textContent = 'ALERTA AMARILLA: VIGILANCIA AGROCLIMÁTICA'; }
    if (alertSubtitle) alertSubtitle.textContent = `Quimilí • SPI 3M: ${currentStepData.spi.toFixed(2)} • Balance hídrico deficitario`;
    if (alertIconBox) { alertIconBox.className = 'w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg'; alertIconBox.textContent = '⚡'; }
    if (pills.AMARILLO) pills.AMARILLO.className = 'py-1 rounded bg-amber-500 text-white font-bold shadow-lg shadow-amber-950';
  } else {
    if (alertCard) alertCard.className = 'rounded-xl border p-3.5 bg-emerald-950/30 border-emerald-500/40 transition-all';
    if (alertTitle) { alertTitle.className = 'font-bold text-emerald-400 text-sm tracking-wide'; alertTitle.textContent = 'NIVEL VERDE: CONDICIONES NORMALES'; }
    if (alertSubtitle) alertSubtitle.textContent = `Quimilí • SPI 3M: ${currentStepData.spi.toFixed(2)} • Índices biofísicos estables`;
    if (alertIconBox) { alertIconBox.className = 'w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg'; alertIconBox.textContent = '✅'; }
    if (pills.VERDE) pills.VERDE.className = 'py-1 rounded bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950';
  }

  // 4. Métricas Satelitales
  const precEl = document.getElementById('metric-precip');
  if (precEl) precEl.textContent = currentStepData.precip.toFixed(1);

  const precAnomEl = document.getElementById('metric-precip-anom');
  if (precAnomEl) {
    precAnomEl.textContent = `${currentStepData.precipAnom >= 0 ? '+' : ''}${currentStepData.precipAnom}% vs climatología (μ)`;
    precAnomEl.className = currentStepData.precipAnom < -30 ? 'text-[10px] font-mono text-red-400 mt-0.5' : 'text-[10px] font-mono text-cyan-400 mt-0.5';
  }

  const gwetEl = document.getElementById('metric-gwetroot');
  if (gwetEl) gwetEl.textContent = currentStepData.gwetroot.toFixed(2);

  const gwetAnomEl = document.getElementById('metric-gwetroot-anom');
  if (gwetAnomEl) gwetAnomEl.textContent = `Z-score: ${currentStepData.gwetrootZ >= 0 ? '+' : ''}${currentStepData.gwetrootZ.toFixed(2)} σ`;

  const ndviEl = document.getElementById('metric-ndvi');
  if (ndviEl) ndviEl.textContent = currentStepData.ndvi.toFixed(2);

  const ndviAnomEl = document.getElementById('metric-ndvi-anom');
  if (ndviAnomEl) ndviAnomEl.textContent = currentStepData.ndvi < 0.28 ? 'Estrés fotosintético severo' : (currentStepData.ndvi < 0.45 ? 'Vigor medio' : 'Biomasa óptima');

  const oniEl = document.getElementById('metric-oni');
  if (oniEl) oniEl.textContent = `${currentStepData.oni >= 0 ? '+' : ''}${currentStepData.oni.toFixed(2)}`;

  // 5. Texto SHAP
  const shapText = document.getElementById('shap-summary-text');
  if (shapText) {
    if (currentStepData.alert === 'ROJO') {
      shapText.innerHTML = `👉 La anomalía <b class="text-purple-300">ENSO ONI (+${currentStepData.shap.oni.toFixed(2)})</b> acoplada a la caída de <b class="text-cyan-300">Humedad Radicular (-${Math.abs(currentStepData.shap.gwetroot).toFixed(2)})</b> detonan el 67% del riesgo.`;
    } else if (currentStepData.floodRisk > 0.6) {
      shapText.innerHTML = `👉 El pulso de <b class="text-blue-300">Lluvia (+${currentStepData.shap.precip.toFixed(2)})</b> sobre suelo compactado con sellado hídrico dispara la probabilidad de anegamiento.`;
    } else {
      shapText.innerHTML = `👉 Índices en amortiguación. La forzante oceánica disminuye y el vigor fotosintético <b class="text-emerald-300">NDVI</b> actúa como amortiguador (-${Math.abs(currentStepData.shap.ndvi).toFixed(2)}).`;
    }
  }

  // 6. Recomendaciones
  renderActions(currentStepData);

  // 7. Actualizar Mapa y Gráficos
  updateMapData();
  updateCharts();
}

function renderActions(stepData) {
  const container = document.getElementById('actions-container');
  if (!container) return;

  let html = '';

  if (stepData.alert === 'ROJO') {
    html = `
      <div class="p-2.5 rounded-xl bg-space-900 border border-red-500/40 text-xs space-y-1">
        <div class="font-bold text-red-400">🚨 Municipio de Quimilí / DPA Santiago:</div>
        <p class="text-slate-300">Activar bombeo y llenado de reservorios y cisternas comunitarias. Prohibir quemas de pastizales por índice de ignición extremo.</p>
      </div>
      <div class="p-2.5 rounded-xl bg-space-900 border border-amber-500/40 text-xs space-y-1">
        <div class="font-bold text-amber-400">🚜 Productores Agropecuarios (Chaco Seco):</div>
        <p class="text-slate-300">Retrasar fecha de siembra de soja y maíz tardío hasta que SMAP confirme recuperación ≥ 0.28 en perfil radicular. Mantener rastrojo.</p>
      </div>
    `;
  } else if (stepData.alert === 'NARANJA' && stepData.floodRisk > 0.6) {
    html = `
      <div class="p-2.5 rounded-xl bg-space-900 border border-orange-500/40 text-xs space-y-1">
        <div class="font-bold text-orange-400">⚠️ Defensa Civil & Vialidad Provincial:</div>
        <p class="text-slate-300">Riesgo inminente de anegamiento en bajos sedimentarios de Moreno e Ibarra. Desobstruir canales de alivio sobre RP 89 y 92.</p>
      </div>
      <div class="p-2.5 rounded-xl bg-space-900 border border-cyan-500/40 text-xs space-y-1">
        <div class="font-bold text-cyan-400">🚜 Productores Agropecuarios:</div>
        <p class="text-slate-300">Evitar ingreso de maquinaria pesada para prevenir pisoteo y compactación irreversible. Mover hacienda a lomas altas del campo.</p>
      </div>
    `;
  } else if (stepData.alert === 'AMARILLO') {
    html = `
      <div class="p-2.5 rounded-xl bg-space-900 border border-amber-500/40 text-xs space-y-1">
        <div class="font-bold text-amber-400">⚡ Gestión de Recursos Hídricos:</div>
        <p class="text-slate-300">Monitoreo continuo quincenal de caudales en azudes del Río Salado. Evaluar turnos de riego para el sector productivo.</p>
      </div>
    `;
  } else {
    html = `
      <div class="p-2.5 rounded-xl bg-space-900 border border-emerald-500/40 text-xs space-y-1">
        <div class="font-bold text-emerald-400">✅ Condiciones Favorables:</div>
        <p class="text-slate-300">Perfiles de humedad en balance óptimo. Ventana adecuada para labores agronómicas y fertilización de cobertura.</p>
      </div>
    `;
  }

  container.innerHTML = html;
}

function updateLegend() {
  const title = document.getElementById('legend-title');
  const gradient = document.getElementById('legend-gradient');
  const labels = document.getElementById('legend-labels');
  if (!title || !gradient || !labels) return;

  if (state.activeLayer === 'spi') {
    title.textContent = 'Escala SPI (Sequía)';
    gradient.style.background = 'linear-gradient(to right, #7F1D1D, #EF4444, #F97316, #FBBF24, #94A3B8, #38BDF8, #1D4ED8)';
    labels.innerHTML = '<span>≤ -2.0 (Extrema)</span><span>0 (Normal)</span><span>≥ +2.0</span>';
  } else if (state.activeLayer === 'gwetroot') {
    title.textContent = 'Humedad Radicular (SMAP)';
    gradient.style.background = 'linear-gradient(to right, #DC2626, #EA580C, #F59E0B, #10B981, #06B6D4)';
    labels.innerHTML = '<span>0% (Seco)</span><span>25%</span><span>≥ 50%</span>';
  } else if (state.activeLayer === 'ndvi') {
    title.textContent = 'Biomasa NDVI (MODIS)';
    gradient.style.background = 'linear-gradient(to right, #B45309, #CA8A04, #84CC16, #22C55E, #15803D)';
    labels.innerHTML = '<span>0.1 (Estrés)</span><span>0.4</span><span>0.8 (Vigor)</span>';
  } else if (state.activeLayer === 'flood') {
    title.textContent = 'Riesgo de Anegamiento';
    gradient.style.background = 'linear-gradient(to right, #1E293B, #0284C7, #EA580C, #DC2626)';
    labels.innerHTML = '<span>Bajo</span><span>Moderado</span><span>Crítico</span>';
  }
}

// ================= TIMELINE Y CONTROLES =================
function setupTimeline() {
  const slider = document.getElementById('timeline-slider');
  const playBtn = document.getElementById('btn-play-pause');
  const playIcon = document.getElementById('play-icon');
  const prevBtn = document.getElementById('btn-prev-step');
  const nextBtn = document.getElementById('btn-next-step');
  const ticksContainer = document.getElementById('timeline-ticks');

  if (ticksContainer) {
    let ticksHtml = '';
    TIMELINE_STEPS.forEach(step => {
      ticksHtml += `<span class="${step.phase === 'current' ? 'text-cyan-300 font-bold' : ''}">${step.name.split(' ')[0]}</span>`;
    });
    ticksContainer.innerHTML = ticksHtml;
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      state.activeStep = parseInt(e.target.value, 10);
      updateUI();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (state.activeStep > 0) {
        state.activeStep--;
        updateUI();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (state.activeStep < TIMELINE_STEPS.length - 1) {
        state.activeStep++;
        updateUI();
      }
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      state.isPlaying = !state.isPlaying;
      if (state.isPlaying) {
        playBtn.className = 'w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition shadow-md shadow-amber-900/30';
        if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
        startPlayback();
      } else {
        playBtn.className = 'w-8 h-8 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center transition shadow-md shadow-cyan-900/30';
        if (playIcon) playIcon.setAttribute('data-lucide', 'play');
        stopPlayback();
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => {
        b.className = 'speed-btn px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 hover:text-white';
      });
      btn.className = 'speed-btn active px-2 py-0.5 rounded text-[11px] font-mono text-cyan-400 bg-space-800';
      state.playSpeed = parseFloat(btn.getAttribute('data-speed'));
      if (state.isPlaying) {
        stopPlayback();
        startPlayback();
      }
    });
  });
}

function startPlayback() {
  const intervalMs = 1800 / state.playSpeed;
  state.playIntervalId = setInterval(() => {
    if (state.activeStep < TIMELINE_STEPS.length - 1) {
      state.activeStep++;
    } else {
      state.activeStep = 0;
    }
    updateUI();
  }, intervalMs);
}

function stopPlayback() {
  if (state.playIntervalId) {
    clearInterval(state.playIntervalId);
    state.playIntervalId = null;
  }
}

// ================= BOTONES Y EVENTOS =================
function setupEventHandlers() {
  // Selector de capas
  document.querySelectorAll('.layer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.layer-btn').forEach(b => {
        b.className = 'layer-btn px-3 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition';
      });
      btn.className = 'layer-btn active px-3 py-1 rounded-lg text-xs font-medium bg-cyan-600 text-white transition';
      state.activeLayer = btn.getAttribute('data-layer');
      updateLegend();
      updateMapData();
    });
  });

  // Centrar en Quimilí
  const recenterBtn = document.getElementById('btn-recenter');
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      if (map) {
        map.flyTo({ center: QUIMILI_COORDS, zoom: 8.5, duration: 1200 });
      }
    });
  }

  // Estilo de mapa (Oscuro vs Satélite vs OSM)
  const btnDark = document.getElementById('btn-style-dark');
  const btnSat = document.getElementById('btn-style-sat');
  const btnOsm = document.getElementById('btn-style-osm');

  function setActiveStyleBtn(activeBtn) {
    [btnDark, btnSat, btnOsm].forEach(b => {
      if (b) b.className = 'px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white transition';
    });
    if (activeBtn) activeBtn.className = 'px-2.5 py-1 rounded-md text-xs font-medium bg-space-800 text-cyan-300 transition';
  }

  if (btnDark) {
    btnDark.addEventListener('click', () => {
      setActiveStyleBtn(btnDark);
      if (map) {
        map.setStyle(TILE_STYLES.dark);
        map.once('style.load', () => {
          setupMapLayers();
          updateMapData();
        });
      }
    });
  }

  if (btnSat) {
    btnSat.addEventListener('click', () => {
      setActiveStyleBtn(btnSat);
      if (map) {
        map.setStyle(TILE_STYLES.satellite);
        map.once('style.load', () => {
          setupMapLayers();
          updateMapData();
        });
      }
    });
  }

  if (btnOsm) {
    btnOsm.addEventListener('click', () => {
      setActiveStyleBtn(btnOsm);
      if (map) {
        map.setStyle(TILE_STYLES.osm);
        map.once('style.load', () => {
          setupMapLayers();
          updateMapData();
        });
      }
    });
  }

  // Modal Documentación Técnica
  const modalDocs = document.getElementById('modal-docs');
  const btnDocs = document.getElementById('btn-modal-docs');
  const btnCloseDocs = document.getElementById('btn-close-docs');

  if (btnDocs && modalDocs) {
    btnDocs.addEventListener('click', () => modalDocs.classList.remove('hidden'));
  }
  if (btnCloseDocs && modalDocs) {
    btnCloseDocs.addEventListener('click', () => modalDocs.classList.add('hidden'));
  }

  // Modal Google Earth Engine (GEE)
  const modalGee = document.getElementById('modal-gee');
  const btnGee = document.getElementById('btn-modal-gee');
  const btnCloseGee = document.getElementById('btn-close-gee');
  const inputGeeProject = document.getElementById('input-gee-project');
  const btnSaveGeeProject = document.getElementById('btn-save-gee-project');

  if (btnGee && modalGee) {
    btnGee.addEventListener('click', () => {
      if (inputGeeProject) {
        inputGeeProject.value = localStorage.getItem('gee_project_id') || '';
      }
      modalGee.classList.remove('hidden');
    });
  }
  if (btnCloseGee && modalGee) {
    btnCloseGee.addEventListener('click', () => modalGee.classList.add('hidden'));
  }
  if (btnSaveGeeProject && inputGeeProject) {
    btnSaveGeeProject.addEventListener('click', () => {
      const pid = inputGeeProject.value.trim();
      if (pid) {
        localStorage.setItem('gee_project_id', pid);
        alert(`Proyecto GEE configurado: ${pid}`);
      }
      modalGee.classList.add('hidden');
    });
  }

  // Exportar Reporte de Crisis
  const btnExport = document.getElementById('btn-export-report');
  if (btnExport) {
    btnExport.addEventListener('click', exportCrisisReport);
  }
}

// ================= EXPORTADOR DE REPORTE =================
function exportCrisisReport() {
  const currentStepData = QUIMILI_TIME_SERIES[state.activeStep];
  const stepInfo = TIMELINE_STEPS[state.activeStep];

  const reportText = `===============================================================
PROYECTO CLIMATE — NASA SPACE APPS CHALLENGE 2026
SISTEMA HÍBRIDO DE PROYECCIÓN CLIMÁTICA Y ALERTA TEMPRANA
INFORME DE SITUACIÓN Y RECOMENDACIONES DE CRISIS
===============================================================

SITIO CENTINELA: Quimilí, Dpto. Moreno, Santiago del Estero, Argentina
COORDENADAS: Lat: ${QUIMILI_COORDS[1]} | Lon: ${QUIMILI_COORDS[0]}
PASO TEMPORAL ANALIZADO: ${stepInfo.label} (${stepInfo.date})
FECHA EMISIÓN REPORTE: ${new Date().toISOString()}

---------------------------------------------------------------
1. DIAGNÓSTICO DEL MOTOR DE ALERTA CATEGÓRICA (NIVEL 2)
---------------------------------------------------------------
- Nivel de Alerta: ${currentStepData.alert}
- Confianza del Ensamble (Random Forest): ${currentStepData.alertConfidence.toFixed(1)}%
- Riesgo de Anegamiento Acoplado: ${(currentStepData.floodRisk * 100).toFixed(1)}%
- Índice Estandarizado de Sequía (SPI 3M): ${currentStepData.spi.toFixed(2)}

---------------------------------------------------------------
2. TELEMETRÍA SATELITAL ACOPLADA (NASA / NOAA)
---------------------------------------------------------------
- Precipitación (GPM IMERG): ${currentStepData.precip} mm/mes (Anomalía: ${currentStepData.precipAnom}%)
- Humedad Radicular (SMAP GWETROOT): ${currentStepData.gwetroot} (Z-Score: ${currentStepData.gwetrootZ} σ)
- Vigor de Biomasa (MODIS NDVI): ${currentStepData.ndvi}
- Forzante Oceánico (NOAA CPC Índice ONI): +${currentStepData.oni}
- Temperatura Máxima (MERRA-2 T2M_MAX): ${currentStepData.t2mMax} °C

---------------------------------------------------------------
3. EXPLICABILIDAD DEL MODELO (VALORES SHAP)
---------------------------------------------------------------
- Contribución ONI (ENSO): +${currentStepData.shap.oni.toFixed(2)}
- Contribución Humedad Radicular (SMAP): ${currentStepData.shap.gwetroot > 0 ? '+' : ''}${currentStepData.shap.gwetroot.toFixed(2)}
- Contribución Precipitación GPM: +${currentStepData.shap.precip.toFixed(2)}
- Contribución Biomasa MODIS: ${currentStepData.shap.ndvi.toFixed(2)}
- Contribución Térmica MERRA-2: +${currentStepData.shap.t2mMax.toFixed(2)}

---------------------------------------------------------------
4. PROYECCIÓN CONTINUA MULTIVARIABLE (NIVEL 1 LightGBM)
---------------------------------------------------------------
- Intervalo Cuantílico de Incertidumbre:
  * Escenario Pesimista p10: SPI ${currentStepData.p10.toFixed(2)}
  * Mediana Proyectada p50: SPI ${currentStepData.p50.toFixed(2)}
  * Escenario Optimista p90: SPI ${currentStepData.p90.toFixed(2)}

---------------------------------------------------------------
5. ACCIONABILIDAD Y MEDIDAS PREVENTIVAS RECOMENDADAS
---------------------------------------------------------------
[AUTORIDADES MUNICIPALES Y DEFENSA CIVIL]
- Activar reservas comunales y protocolos de emergencia hídrica.
- Relevar canalizaciones sobre Rutas 89 y 92 ante riesgo de anegamiento por pérdida de infiltración.

[SECTOR AGROPECUARIO]
- Adaptar ventanas de siembra según proyección de humedad SMAP.
- Proteger cobertura de suelo para evitar sellado mecánico.

===============================================================
Equipo CLIMATE — Gran Chaco / NASA Space Apps Challenge
===============================================================`;

  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_Crisis_Quimili_${stepInfo.date}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ================= ARRANQUE CONTROLADO =================
function startApp() {
  try {
    initMap();
  } catch (e) {
    console.error('initMap error:', e);
  }

  try {
    initCharts();
  } catch (e) {
    console.error('initCharts error:', e);
  }

  try {
    setupTimeline();
  } catch (e) {
    console.error('setupTimeline error:', e);
  }

  try {
    setupEventHandlers();
  } catch (e) {
    console.error('setupEventHandlers error:', e);
  }

  try {
    updateUI();
  } catch (e) {
    console.error('updateUI error:', e);
  }

  try {
    updateLegend();
  } catch (e) {
    console.error('updateLegend error:', e);
  }

  try {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  } catch (e) {
    console.error('lucide error:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
