/**
 * PROYECTO CLIMATE — Gran Chaco
 * Sistema Híbrido de Proyección Climática y Alerta Temprana
 * NASA Space Apps Challenge 2026
 *
 * Motor de Simulación Geoespacial Mapbox / MapLibre GL JS
 */

// ================= GEOGRAPHIC CONFIGURATION: GRAN CHACO AMERICANO =================
const GRAN_CHACO_CENTER = [-61.20, -24.80]; // Centro Macro Ecorregional (Trinacional)
const GRAN_CHACO_BOUNDS = [[-67.2, -32.5], [-56.0, -17.0]]; // Bounding Box Gran Chaco

// Red de Nodos de Monitoreo Transfronterizo
const SENTINEL_NODES = {
  gran_chaco: {
    id: 'gran_chaco',
    name: 'Gran Chaco Americano (Consolidado Ecorregional)',
    country: 'Trinacional (Argentina • Bolivia • Paraguay)',
    coords: [-61.20, -24.80],
    zoom: 5.2,
    spiFactor: 1.0,
    gwetFactor: 1.0,
    ndviFactor: 1.0,
    floodFactor: 1.0,
    desc: 'Visión Macro Ecorregional (~1.100.000 km²)'
  },
  quimili: {
    id: 'quimili',
    name: 'Nodo Quimilí (Chaco Seco Austral)',
    country: 'Argentina (Santiago del Estero)',
    coords: [-62.42, -28.64],
    zoom: 8.0,
    spiFactor: 1.0,
    gwetFactor: 0.95,
    ndviFactor: 0.96,
    floodFactor: 0.90,
    desc: 'Epicentro Semiárido y Pérdida de Humedad Radicular'
  },
  filadelfia: {
    id: 'filadelfia',
    name: 'Nodo Filadelfia (Chaco Boreal)',
    country: 'Paraguay (Boquerón)',
    coords: [-60.03, -22.35],
    zoom: 8.0,
    spiFactor: 0.92,
    gwetFactor: 0.88,
    ndviFactor: 0.90,
    floodFactor: 0.75,
    desc: 'Corazón Agroganadero y Déficit de Precipitaciones'
  },
  villamontes: {
    id: 'villamontes',
    name: 'Nodo Villa Montes (Chaco Subandino)',
    country: 'Bolivia (Tarija)',
    coords: [-63.46, -21.26],
    zoom: 8.0,
    spiFactor: 0.96,
    gwetFactor: 1.04,
    ndviFactor: 1.08,
    floodFactor: 1.15,
    desc: 'Cuenca Alta del Pilcomayo y Recarga Orográfica'
  },
  saenzpena: {
    id: 'saenzpena',
    name: 'Nodo Sáenz Peña (Chaco Central)',
    country: 'Argentina (Chaco)',
    coords: [-60.44, -26.79],
    zoom: 8.0,
    spiFactor: 1.06,
    gwetFactor: 1.02,
    ndviFactor: 1.05,
    floodFactor: 1.10,
    desc: 'Cinturón Agrícola y Riego en Cuencas Bajas'
  },
  resistencia: {
    id: 'resistencia',
    name: 'Nodo Resistencia (Chaco Húmedo)',
    country: 'Argentina (Chaco / Formosa)',
    coords: [-58.98, -27.45],
    zoom: 8.0,
    spiFactor: 1.25,
    gwetFactor: 1.35,
    ndviFactor: 1.28,
    floodFactor: 1.65,
    desc: 'Confluencia Fluvial Paraná-Paraguay y Riesgo Severo de Anegamiento'
  }
};

const QUIMILI_COORDS = SENTINEL_NODES.quimili.coords;
const CHACO_CENTER = GRAN_CHACO_CENTER;

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

// ================= MACRO-REGIONES DEL GRAN CHACO AMERICANO (GEOJSON) =================
const REGIONS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'chaco_seco_sur',
      properties: {
        id: 'chaco_seco_sur',
        name: 'Gran Chaco Seco Austral',
        country: 'Argentina',
        provinces: 'Santiago del Estero, Córdoba Norte, Salta Este',
        headquarter: 'Quimilí / Añatuya',
        isSentinel: true,
        infilFactor: 0.18,
        areaKm2: 240000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-65.50, -27.20],
          [-61.50, -27.20],
          [-61.50, -31.80],
          [-64.80, -31.80],
          [-65.50, -27.20]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'chaco_central',
      properties: {
        id: 'chaco_central',
        name: 'Gran Chaco Central Argentino',
        country: 'Argentina',
        provinces: 'Chaco Centro-Oeste, Formosa Centro',
        headquarter: 'P. R. Sáenz Peña / Las Lomitas',
        isSentinel: true,
        infilFactor: 0.22,
        areaKm2: 195000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-63.20, -23.80],
          [-59.80, -24.20],
          [-59.80, -27.20],
          [-63.20, -27.20],
          [-63.20, -23.80]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'chaco_humedo',
      properties: {
        id: 'chaco_humedo',
        name: 'Gran Chaco Húmedo & Ribereño',
        country: 'Argentina / Paraguay',
        provinces: 'Formosa Este, Chaco Este, Santa Fe Norte, Ñeembucú',
        headquarter: 'Resistencia / Formosa / Pilar',
        isSentinel: true,
        infilFactor: 0.14,
        areaKm2: 160000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-59.80, -24.20],
          [-57.00, -24.20],
          [-58.20, -30.50],
          [-60.50, -29.80],
          [-59.80, -27.20],
          [-59.80, -24.20]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'chaco_boreal',
      properties: {
        id: 'chaco_boreal',
        name: 'Gran Chaco Boreal Central',
        country: 'Paraguay',
        provinces: 'Boquerón, Presidente Hayes',
        headquarter: 'Filadelfia / Mcal. Estigarribia',
        isSentinel: true,
        infilFactor: 0.20,
        areaKm2: 210000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-62.60, -20.50],
          [-58.20, -20.80],
          [-57.00, -24.20],
          [-59.80, -24.20],
          [-62.60, -23.80],
          [-62.60, -20.50]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'chaco_septentrional',
      properties: {
        id: 'chaco_septentrional',
        name: 'Chaco Septentrional & Pantanal',
        country: 'Paraguay / Bolivia / Brasil',
        provinces: 'Alto Paraguay, Bahía Negra, Pantanal Chaqueño',
        headquarter: 'Bahía Negra / Fuerte Olimpo',
        isSentinel: false,
        infilFactor: 0.16,
        areaKm2: 130000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-61.50, -17.50],
          [-57.00, -17.50],
          [-58.20, -20.80],
          [-61.50, -20.50],
          [-61.50, -17.50]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'chaco_boliviano',
      properties: {
        id: 'chaco_boliviano',
        name: 'Gran Chaco Boliviano',
        country: 'Bolivia',
        provinces: 'Tarija Este, Chuquisaca Este, Santa Cruz Sur',
        headquarter: 'Villa Montes / Yacuiba / Camiri',
        isSentinel: true,
        infilFactor: 0.25,
        areaKm2: 125000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-64.50, -18.50],
          [-61.50, -18.50],
          [-62.60, -22.80],
          [-64.50, -22.80],
          [-64.50, -18.50]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'chaco_serrano',
      properties: {
        id: 'chaco_serrano',
        name: 'Chaco Serrano & Piedemonte Subandino',
        country: 'Argentina / Bolivia',
        provinces: 'Salta Oeste, Jujuy Este, Tarija Oeste',
        headquarter: 'Tartagal / Orán',
        isSentinel: false,
        infilFactor: 0.32,
        areaKm2: 90000
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-65.80, -21.50],
          [-64.20, -21.50],
          [-64.50, -27.20],
          [-65.80, -27.20],
          [-65.80, -21.50]
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
  chaco_seco_sur: { spiFactor: 1.0, gwetFactor: 0.95, ndviFactor: 0.96, floodBias: -0.05 },
  chaco_central: { spiFactor: 1.05, gwetFactor: 1.02, ndviFactor: 1.05, floodBias: 0.08 },
  chaco_humedo: { spiFactor: 1.25, gwetFactor: 1.35, ndviFactor: 1.28, floodBias: 0.28 },
  chaco_boreal: { spiFactor: 0.92, gwetFactor: 0.90, ndviFactor: 0.92, floodBias: 0.02 },
  chaco_septentrional: { spiFactor: 1.12, gwetFactor: 1.20, ndviFactor: 1.22, floodBias: 0.22 },
  chaco_boliviano: { spiFactor: 0.96, gwetFactor: 1.04, ndviFactor: 1.08, floodBias: 0.12 },
  chaco_serrano: { spiFactor: 1.15, gwetFactor: 1.18, ndviFactor: 1.25, floodBias: 0.10 }
};

// ================= ESTADO DE LA APLICACIÓN =================
const state = {
  activeStep: 6, // t0
  activeLayer: 'spi', // 'spi', 'gwetroot', 'ndvi', 'flood'
  activeNode: 'gran_chaco', // 'gran_chaco', 'quimili', 'filadelfia', 'villamontes', 'saenzpena', 'resistencia'
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

// ================= AJUSTE DINÁMICO DE ENCUADRE (GRAN CHACO BOUNDS) =================
function fitGranChacoBounds(animate = true) {
  if (!map) return;
  const w = window.innerWidth;
  const isMobile = w < 768;
  const isCompact = w < 1280;

  const padding = {
    top: isMobile ? 35 : 45,
    bottom: isMobile ? 45 : 65,
    left: isMobile ? 20 : (isCompact ? 30 : 45),
    right: isMobile ? 20 : (isCompact ? 30 : 45)
  };

  map.fitBounds(GRAN_CHACO_BOUNDS, {
    padding: padding,
    maxZoom: 6.2,
    duration: animate ? 1200 : 0
  });
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
      center: GRAN_CHACO_CENTER,
      zoom: 5.2,
      attributionControl: false
    });

    map.addControl(new mapLib.NavigationControl(), 'top-right');
    map.addControl(new mapLib.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      state.mapLoaded = true;
      setupMapLayers();
      setupSentinelMarkers();
      updateMapData();
      fitGranChacoBounds(false);
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
          'fill-opacity': 0.55
        }
      });

      // Bordes ecorregionales
      map.addLayer({
        id: 'chaco-regions-line',
        type: 'line',
        source: 'chaco-regions',
        paint: {
          'line-color': '#06B6D4',
          'line-width': 2.0,
          'line-opacity': 0.85
        }
      });

      // Interacción: Click para abrir Popup con telemetría de la macro-región
      map.on('click', 'chaco-regions-fill', (e) => {
        if (e.features && e.features.length > 0) {
          showRegionPopup(e.lngLat, e.features[0].properties);
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

function showRegionPopup(lngLat, props) {
  const currentStepData = QUIMILI_TIME_SERIES[state.activeStep];
  const variation = DEPT_VARIATIONS[props.id] || { spiFactor: 1.0, gwetFactor: 1.0, ndviFactor: 1.0, floodBias: 0.0 };
  const spiVal = (currentStepData.spi * variation.spiFactor).toFixed(2);
  const gwetVal = (currentStepData.gwetroot * variation.gwetFactor).toFixed(2);
  const ndviVal = (currentStepData.ndvi * variation.ndviFactor).toFixed(2);
  const mapLib = window.maplibregl || window.mapboxgl;

  const html = `
    <div style="font-family: inherit; font-size: 12px; color: #F8FAFC; max-width: 250px;">
      <div style="font-weight: bold; font-size: 13px; color: #38BDF8; margin-bottom: 4px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
        ${props.name}
      </div>
      <div style="font-size: 11px; color: #94A3B8; margin-bottom: 6px;">
        📍 <b>${props.country}</b> • ${props.provinces || ''}
      </div>
      <div style="line-height: 1.6; font-family: monospace; font-size: 11px;">
        <div><b>Sede / Monitoreo:</b> ${props.headquarter}</div>
        <div><b>Superficie:</b> ~${props.areaKm2 ? Number(props.areaKm2).toLocaleString() : '150.000'} km²</div>
        <div><b>SPI 3M (Sequía):</b> <span style="color: ${spiVal < -1.5 ? '#EF4444' : (spiVal < -0.8 ? '#F59E0B' : '#38BDF8')}; font-weight: bold;">${spiVal}</span></div>
        <div><b>Humedad Radicular (SMAP):</b> ${gwetVal} GWET</div>
        <div><b>Biomasa NDVI (MODIS):</b> ${ndviVal}</div>
        <div><b>Infiltración de Suelo:</b> ${(props.infilFactor * 100).toFixed(0)}%</div>
      </div>
    </div>
  `;

  new mapLib.Popup({ offset: 12 })
    .setLngLat(lngLat)
    .setHTML(html)
    .addTo(map);
}

function setupSentinelMarkers() {
  try {
    const mapLib = window.maplibregl || window.mapboxgl;

    const nodeEntries = Object.values(SENTINEL_NODES).filter(n => n.id !== 'gran_chaco');

    nodeEntries.forEach(node => {
      const el = document.createElement('div');
      el.className = 'cursor-pointer';
      
      const isSelected = state.activeNode === node.id;
      const pulseColor = isSelected ? '#38BDF8' : '#EF4444';

      el.innerHTML = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;" title="${node.name}">
          <div class="sentinel-pulse" style="position: absolute; width: 30px; height: 30px; border-radius: 50%; color: ${pulseColor};"></div>
          <div style="width: 14px; height: 14px; border-radius: 50%; background: ${pulseColor}; border: 2px solid #FFFFFF; box-shadow: 0 0 12px ${pulseColor}; z-index: 10;"></div>
          <div style="position: absolute; top: -28px; padding: 2px 6px; border-radius: 5px; background: rgba(11, 15, 25, 0.95); color: #38BDF8; font-family: monospace; font-size: 10px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.4); white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">
            ${node.name.split(' ')[1] || node.name}
          </div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        selectNode(node.id);
      });

      new mapLib.Marker({ element: el })
        .setLngLat(node.coords)
        .addTo(map);
    });

  } catch (err) {
    console.error('Error creando la red de marcadores centinela:', err);
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

// ================= SELECCIÓN DE NODO / REGIÓN =================
function selectNode(nodeId) {
  state.activeNode = nodeId;
  const node = SENTINEL_NODES[nodeId] || SENTINEL_NODES.gran_chaco;

  const selectEl = document.getElementById('select-active-node');
  if (selectEl && selectEl.value !== nodeId) {
    selectEl.value = nodeId;
  }

  if (map) {
    if (nodeId === 'gran_chaco') {
      fitGranChacoBounds(true);
    } else {
      map.flyTo({
        center: node.coords,
        zoom: node.zoom || 8.0,
        duration: 1300
      });
    }
  }

  updateUI();
}

// ================= ACTUALIZACIÓN DE TELEMETRÍA Y UI =================
function updateUI() {
  const currentStepData = QUIMILI_TIME_SERIES[state.activeStep];
  const stepInfo = TIMELINE_STEPS[state.activeStep];
  const activeNode = SENTINEL_NODES[state.activeNode] || SENTINEL_NODES.gran_chaco;

  // Factores regionales del Gran Chaco
  const spiFactor = activeNode.spiFactor || 1.0;
  const gwetFactor = activeNode.gwetFactor || 1.0;
  const ndviFactor = activeNode.ndviFactor || 1.0;
  const floodFactor = activeNode.floodFactor || 1.0;

  const currentSpi = (currentStepData.spi * spiFactor).toFixed(2);
  const currentGwet = Math.max(0.08, Math.min(0.85, currentStepData.gwetroot * gwetFactor)).toFixed(2);
  const currentNdvi = Math.max(0.12, Math.min(0.80, currentStepData.ndvi * ndviFactor)).toFixed(2);
  const currentFloodRisk = Math.max(0.05, Math.min(0.99, currentStepData.floodRisk * floodFactor));

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
      headerBadge.textContent = currentFloodRisk > 0.6 ? 'ALERTA NARANJA: ANEGAMIENTO' : 'ALERTA NARANJA: DÉFICIT';
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
    if (alertSubtitle) alertSubtitle.textContent = `${activeNode.name} • SPI 3M: ${currentSpi} • Humedad Radicular crítica`;
    if (alertIconBox) { alertIconBox.className = 'w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-lg'; alertIconBox.textContent = '🚨'; }
    if (pills.ROJO) pills.ROJO.className = 'py-1 rounded bg-red-500 text-white font-bold shadow-lg shadow-red-950';
  } else if (currentStepData.alert === 'NARANJA') {
    if (alertCard) alertCard.className = 'rounded-xl border p-3.5 bg-orange-950/30 border-orange-500/40 transition-all';
    if (alertTitle) {
      alertTitle.className = 'font-bold text-orange-400 text-sm tracking-wide';
      alertTitle.textContent = currentFloodRisk > 0.6 ? 'ALERTA NARANJA: RIESGO DE ANEGAMIENTO' : 'ALERTA NARANJA: ESTRÉS HÍDRICO';
    }
    if (alertSubtitle) {
      alertSubtitle.textContent = currentFloodRisk > 0.6 
        ? `${activeNode.name} • Lluvia torrencial sobre suelo sellado sin infiltración`
        : `${activeNode.name} • SPI 3M: ${currentSpi} • Alerta preventiva regional`;
    }
    if (alertIconBox) { alertIconBox.className = 'w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg'; alertIconBox.textContent = '⚠️'; }
    if (pills.NARANJA) pills.NARANJA.className = 'py-1 rounded bg-orange-500 text-white font-bold shadow-lg shadow-orange-950';
  } else if (currentStepData.alert === 'AMARILLO') {
    if (alertCard) alertCard.className = 'rounded-xl border p-3.5 bg-amber-950/30 border-amber-500/40 transition-all';
    if (alertTitle) { alertTitle.className = 'font-bold text-amber-400 text-sm tracking-wide'; alertTitle.textContent = 'ALERTA AMARILLA: VIGILANCIA AGROCLIMÁTICA'; }
    if (alertSubtitle) alertSubtitle.textContent = `${activeNode.name} • SPI 3M: ${currentSpi} • Déficit en cuencas`;
    if (alertIconBox) { alertIconBox.className = 'w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg'; alertIconBox.textContent = '⚡'; }
    if (pills.AMARILLO) pills.AMARILLO.className = 'py-1 rounded bg-amber-500 text-white font-bold shadow-lg shadow-amber-950';
  } else {
    if (alertCard) alertCard.className = 'rounded-xl border p-3.5 bg-emerald-950/30 border-emerald-500/40 transition-all';
    if (alertTitle) { alertTitle.className = 'font-bold text-emerald-400 text-sm tracking-wide'; alertTitle.textContent = 'NIVEL VERDE: CONDICIONES NORMALES'; }
    if (alertSubtitle) alertSubtitle.textContent = `${activeNode.name} • SPI 3M: ${currentSpi} • Índices biofísicos estables`;
    if (alertIconBox) { alertIconBox.className = 'w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg'; alertIconBox.textContent = '✅'; }
    if (pills.VERDE) pills.VERDE.className = 'py-1 rounded bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950';
  }

  // 4. Métricas Satelitales Acopladas
  const siteLabel = document.getElementById('telemetry-site-label');
  if (siteLabel) siteLabel.textContent = `${activeNode.name.split('(')[0].trim()} (${activeNode.country})`;

  const precEl = document.getElementById('metric-precip');
  if (precEl) precEl.textContent = (currentStepData.precip * (spiFactor > 1.1 ? 1.25 : 0.95)).toFixed(1);

  const precAnomEl = document.getElementById('metric-precip-anom');
  if (precAnomEl) {
    precAnomEl.textContent = `${currentStepData.precipAnom >= 0 ? '+' : ''}${currentStepData.precipAnom}% vs climatología (μ)`;
    precAnomEl.className = currentStepData.precipAnom < -30 ? 'text-[10px] font-mono text-red-400 mt-0.5' : 'text-[10px] font-mono text-cyan-400 mt-0.5';
  }

  const gwetEl = document.getElementById('metric-gwetroot');
  if (gwetEl) gwetEl.textContent = currentGwet;

  const gwetAnomEl = document.getElementById('metric-gwetroot-anom');
  if (gwetAnomEl) gwetAnomEl.textContent = `Z-score: ${currentStepData.gwetrootZ >= 0 ? '+' : ''}${currentStepData.gwetrootZ.toFixed(2)} σ`;

  const ndviEl = document.getElementById('metric-ndvi');
  if (ndviEl) ndviEl.textContent = currentNdvi;

  const ndviAnomEl = document.getElementById('metric-ndvi-anom');
  if (ndviAnomEl) ndviAnomEl.textContent = Number(currentNdvi) < 0.28 ? 'Estrés fotosintético severo' : (Number(currentNdvi) < 0.45 ? 'Vigor medio' : 'Biomasa óptima');

  const oniEl = document.getElementById('metric-oni');
  if (oniEl) oniEl.textContent = `${currentStepData.oni >= 0 ? '+' : ''}${currentStepData.oni.toFixed(2)}`;

  // 5. Texto SHAP
  const shapText = document.getElementById('shap-summary-text');
  if (shapText) {
    if (currentStepData.alert === 'ROJO') {
      shapText.innerHTML = `👉 En el <b>Gran Chaco</b>, la anomalía <b class="text-purple-300">ENSO ONI (+${currentStepData.shap.oni.toFixed(2)})</b> acoplada a la caída de <b class="text-cyan-300">Humedad Radicular (-${Math.abs(currentStepData.shap.gwetroot).toFixed(2)})</b> detonan el 67% del riesgo regional.`;
    } else if (currentFloodRisk > 0.6) {
      shapText.innerHTML = `👉 El pulso torrencial de <b class="text-blue-300">Lluvia (+${currentStepData.shap.precip.toFixed(2)})</b> sobre planicies sedimentarias de baja pendiente dispara el anegamiento transfronterizo.`;
    } else {
      shapText.innerHTML = `👉 Índices en amortiguación. La forzante oceánica disminuye y el dosel vegetal del <b class="text-emerald-300">Gran Chaco (NDVI)</b> absorbe el impacto hidroclimático.`;
    }
  }

  // 6. Recomendaciones
  renderActions(currentStepData, activeNode);

  // 7. Actualizar Mapa y Gráficos
  updateMapData();
  updateCharts();
}

function renderActions(stepData, activeNode) {
  const container = document.getElementById('actions-container');
  if (!container) return;
  const node = activeNode || SENTINEL_NODES.gran_chaco;

  let html = '';

  if (stepData.alert === 'ROJO') {
    html = `
      <div class="p-2 xl:p-2.5 rounded-xl bg-space-900 border border-red-500/40 text-[11px] xl:text-xs space-y-0.5 xl:space-y-1">
        <div class="font-bold text-red-400">🚨 Comisión Trinacional Pilcomayo / Bermejo:</div>
        <p class="text-slate-300">Activar comités de emergencia de cuenca. Regular bombeo y preservar tajamares comunitarios ante sequía continental.</p>
      </div>
      <div class="p-2 xl:p-2.5 rounded-xl bg-space-900 border border-amber-500/40 text-[11px] xl:text-xs space-y-0.5 xl:space-y-1">
        <div class="font-bold text-amber-400">🚜 Sector Agropecuario (${node.name.split('(')[0].trim()}):</div>
        <p class="text-slate-300">Retrasar siembra en Chaco Seco/Boreal. Ajustar carga animal en pasturas y mantener cobertura de rastrojo.</p>
      </div>
    `;
  } else if (stepData.alert === 'NARANJA' && stepData.floodRisk > 0.6) {
    html = `
      <div class="p-2 xl:p-2.5 rounded-xl bg-space-900 border border-orange-500/40 text-[11px] xl:text-xs space-y-0.5 xl:space-y-1">
        <div class="font-bold text-orange-400">⚠️ Defensa Civil & Vialidad Regional:</div>
        <p class="text-slate-300">Riesgo inminente de anegamiento en planicies aluviales de Chaco Húmedo. Monitorear terraplenes y rutas troncales.</p>
      </div>
      <div class="p-2 xl:p-2.5 rounded-xl bg-space-900 border border-cyan-500/40 text-[11px] xl:text-xs space-y-0.5 xl:space-y-1">
        <div class="font-bold text-cyan-400">🚜 Productores Agropecuarios:</div>
        <p class="text-slate-300">Evitar maquinaria pesada por riesgo de sellado de sedimentos. Mover hacienda a lomas altas.</p>
      </div>
    `;
  } else if (stepData.alert === 'AMARILLO') {
    html = `
      <div class="p-2 xl:p-2.5 rounded-xl bg-space-900 border border-amber-500/40 text-[11px] xl:text-xs space-y-0.5 xl:space-y-1">
        <div class="font-bold text-amber-400">⚡ Gestión de Recursos Hídricos:</div>
        <p class="text-slate-300">Vigilancia de caudales orográficos en Tarija (Bolivia) y recarga de cuencas bajas. Planificar turnos de riego.</p>
      </div>
    `;
  } else {
    html = `
      <div class="p-2 xl:p-2.5 rounded-xl bg-space-900 border border-emerald-500/40 text-[11px] xl:text-xs space-y-0.5 xl:space-y-1">
        <div class="font-bold text-emerald-400">✅ Gran Chaco en Balance Favorable:</div>
        <p class="text-slate-300">Humedad radicular adecuada en los tres países. Ventana propicia para labores agronómicas y recarga de acuíferos.</p>
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
        b.className = 'layer-btn px-2.5 py-1 rounded-lg text-[11px] xl:text-xs font-medium text-slate-300 hover:text-white transition';
      });
      btn.className = 'layer-btn active px-2.5 py-1 rounded-lg text-[11px] xl:text-xs font-medium bg-cyan-600 text-white transition';
      state.activeLayer = btn.getAttribute('data-layer');
      updateLegend();
      updateMapData();
    });
  });

  // Alternar Visibilidad del Panel Lateral (Sidebar Toggle)
  const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');
  const toggleSidebarMapBtn = document.getElementById('btn-toggle-sidebar-map');

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-panel');
    if (!sidebar) return;
    sidebar.classList.toggle('hidden');

    setTimeout(() => {
      if (map) {
        map.resize();
        if (state.activeNode === 'gran_chaco') {
          fitGranChacoBounds(true);
        }
      }
    }, 280);
  }

  if (toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', toggleSidebar);
  if (toggleSidebarMapBtn) toggleSidebarMapBtn.addEventListener('click', toggleSidebar);

  // Redimensionamiento Responsivo Automático (Window Resize)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (map) {
      map.resize();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (state.activeNode === 'gran_chaco') {
          fitGranChacoBounds(false);
        }
      }, 250);
    }
  });

  // Centrar en Gran Chaco
  const recenterBtn = document.getElementById('btn-recenter');
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      selectNode('gran_chaco');
    });
  }

  // Selector de Monitoreo Transfronterizo
  const selectNodeEl = document.getElementById('select-active-node');
  if (selectNodeEl) {
    selectNodeEl.addEventListener('change', (e) => {
      selectNode(e.target.value);
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
  const activeNode = SENTINEL_NODES[state.activeNode] || SENTINEL_NODES.gran_chaco;

  const reportText = `===============================================================
PROYECTO CLIMATE — NASA SPACE APPS CHALLENGE 2026
SISTEMA HÍBRIDO DE PROYECCIÓN CLIMÁTICA Y ALERTA TEMPRANA
INFORME DE SITUACIÓN Y ACCIÓN: GRAN CHACO AMERICANO
===============================================================

REGIÓN / NODO ANALIZADO: ${activeNode.name}
ALCANCE TERRITORIAL: ${activeNode.country} (~1.100.000 km²)
COORDENADAS CENTROIDE: Lat: ${activeNode.coords[1]} | Lon: ${activeNode.coords[0]}
PASO TEMPORAL ANALIZADO: ${stepInfo.label} (${stepInfo.date})
FECHA EMISIÓN REPORTE: ${new Date().toISOString()}

---------------------------------------------------------------
1. DIAGNÓSTICO DEL MOTOR DE ALERTA CATEGÓRICA (NIVEL 2)
---------------------------------------------------------------
- Nivel de Alerta: ${currentStepData.alert}
- Confianza del Ensamble (Random Forest): ${currentStepData.alertConfidence.toFixed(1)}%
- Riesgo de Anegamiento Acoplado: ${(currentStepData.floodRisk * (activeNode.floodFactor || 1.0) * 100).toFixed(1)}%
- Índice Estandarizado de Sequía (SPI 3M): ${(currentStepData.spi * (activeNode.spiFactor || 1.0)).toFixed(2)}

---------------------------------------------------------------
2. TELEMETRÍA SATELITAL ACOPLADA (NASA / NOAA / GEE)
---------------------------------------------------------------
- Precipitación (GPM IMERG V07): ${currentStepData.precip} mm/mes (Anomalía: ${currentStepData.precipAnom}%)
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
5. ACCIONABILIDAD Y MEDIDAS ESTRATÉGICAS TRANSFRONTERIZAS
---------------------------------------------------------------
[COMISIÓN TRINACIONAL RÍOS PILCOMAYO Y BERMEJO (ARG • BOL • PRY)]
- Coordinación hidrológica de caudales y compuertas ante pulsos torrenciales pronosticados.
- Monitoreo de sedimentación y erosión de riberas en cuencas compartidas.

[DEFENSA CIVIL Y GOBIERNOS REGIONALES (GRAN CHACO)]
- Activar reservas estratégicas en cisternas comunitarias y tajamares.
- Protocolos de prevención de incendios forestales por bajo vigor de biomasa (MODIS NDVI).

[SECTOR AGROPECUARIO Y GANADERO]
- Ajuste de cargas animales en Chaco Boreal y Chaco Seco.
- Retrasar fechas de siembra hasta recuperación confirmada de humedad radicular en SMAP.

===============================================================
Equipo CLIMATE — Gran Chaco Americano / NASA Space Apps Challenge
===============================================================`;

  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_Crisis_Gran_Chaco_${stepInfo.date}.txt`;
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
