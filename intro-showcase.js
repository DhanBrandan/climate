/**
 * CLIMATE — Módulo Interactivo de Introducción (Equipo, Prototipo Unificado & Beneficios)
 * Orquesta el carrusel cronológico 1..7 de integrantes, el reproductor HUD sincronizado
 * del video unificado del prototipo LoRaWAN/Edge y la matriz de valor e impacto.
 *
 * Funciona tanto como overlay de bienvenida en index.html como en vista dedicada (intro_prototype.html).
 */
(function (global) {
  'use strict';

  const TEAM_SLIDES = [
    {
      index: 1,
      total: 7,
      image: 'assets/team/1.jpeg',
      badge: '01 / 07 · MENTORÍA',
      badgeEn: '01 / 07 · MENTORSHIP',
      name: 'Prof. José Luis Pereyra',
      roleEs: 'Mentoría Científica & Coordinación Territorial',
      roleEn: 'Scientific Mentorship & Territorial Coordination',
      bioEs: 'Acompañamiento estratégico del equipo C.L.I.M.A.T.E. en Santiago del Estero, articulando los desafíos agroclimáticos reales del Gran Chaco con validación académica e institucional.',
      bioEn: 'Strategic guidance for Team C.L.I.M.A.T.E. in Santiago del Estero, connecting real Gran Chaco agroclimatic challenges with academic and institutional validation.',
      tags: ['Mentoría NASA', 'Gran Chaco', 'Articulación Territorial'],
      isGroup: false
    },
    {
      index: 2,
      total: 7,
      image: 'assets/team/2.jpeg',
      badge: '02 / 07 · TERRITORIO',
      badgeEn: '02 / 07 · TERRITORY',
      name: 'Integrante 02 · Gestión Climática',
      roleEs: 'Investigación Ambiental, Riesgo Hídrico & Vinculación Regional',
      roleEn: 'Environmental Research, Water Risk & Regional Outreach',
      bioEs: 'Relevamiento de necesidades de productores rurales y gobiernos locales frente a sequías prolongadas y anegamientos, traduciendo la ciencia de datos en protocolos de acción claros.',
      bioEn: 'Assessment of rural producers and local governments facing severe droughts and floods, translating data science into clear action protocols.',
      tags: ['Riesgo Hídrico', 'Impacto Social', 'Defensa Civil'],
      isGroup: false
    },
    {
      index: 3,
      total: 7,
      image: 'assets/team/3.jpeg',
      badge: '03 / 07 · SISTEMAS & IA',
      badgeEn: '03 / 07 · SYSTEMS & AI',
      name: 'Dhan Brandan',
      roleEs: 'Arquitectura Full-Stack, Modelos IA & Red LoRaWAN / Edge',
      roleEn: 'Full-Stack Architecture, AI Models & LoRaWAN / Edge Network',
      bioEs: 'Diseño del sistema híbrido NASA GEE + LightGBM/Random Forest con explicabilidad SHAP, broker ChirpStack v4 y failover autónomo Edge Computing en gateways rurales MultiTech.',
      bioEn: 'Design of the hybrid NASA GEE + LightGBM/Random Forest engine with SHAP explainability, ChirpStack v4 broker, and autonomous Edge Computing failover on rural MultiTech gateways.',
      tags: ['Arquitectura IoT', 'LightGBM + SHAP', 'ChirpStack & Edge'],
      isGroup: false
    },
    {
      index: 4,
      total: 7,
      image: 'assets/team/4.png',
      badge: '04 / 07 · CIENCIA DE DATOS',
      badgeEn: '04 / 07 · DATA SCIENCE',
      name: 'Daniela Fernández',
      roleEs: 'Ciencia de Datos, Series SARIMAX/MK & Analítica In-Situ',
      roleEn: 'Data Science, SARIMAX/MK Time Series & In-Situ Analytics',
      bioEs: 'Construcción de la Planilla Maestra de 30 años, análisis estadístico de tendencias Mann-Kendall / Sen y módulo de ingesta de planillas Excel para validación directa de campo.',
      bioEn: 'Development of the 30-year Master Workbook, Mann-Kendall / Sen statistical trend analysis, and Excel ingestion module for direct field validation.',
      tags: ['SARIMAX 30Y', 'Mann-Kendall', 'Analítica Excel'],
      isGroup: false
    },
    {
      index: 5,
      total: 7,
      image: 'assets/team/5.jpeg',
      badge: '05 / 07 · HARDWARE IOT',
      badgeEn: '05 / 07 · IOT HARDWARE',
      name: 'Integrante 05 · Ingeniería de Campo',
      roleEs: 'Nodos Centinela LoRa, Sensores de Suelo & Energía Solar',
      roleEn: 'LoRa Sentinel Nodes, Soil Sensors & Solar Power Engineering',
      bioEs: 'Integración de hardware de ultra bajo consumo (ESP32-C3 + SX1262/Ra-02) con sondas de humedad radicular, panel solar autónomo y enlaces sub-GHz de largo alcance sin red celular.',
      bioEn: 'Ultra-low-power hardware integration (ESP32-C3 + SX1262/Ra-02) with root-zone moisture probes, autonomous solar power, and long-range sub-GHz links without cellular service.',
      tags: ['ESP32-C3 + SX1262', 'Telemetría Solar', 'Sonda Suelo'],
      isGroup: false
    },
    {
      index: 6,
      total: 7,
      image: 'assets/team/6.jpeg',
      badge: '06 / 07 · UX & GEOMÁTICA',
      badgeEn: '06 / 07 · UX & GEOMATICS',
      name: 'Integrante 06 · Cartografía & Diseño',
      roleEs: 'Experiencia UI/UX, Visualización GIS & Comunicación Científica',
      roleEn: 'UI/UX Experience, GIS Visualization & Scientific Storytelling',
      bioEs: 'Diseño visual de la consola geoespacial, mapas coropléticos multiescala del Gran Chaco Americano y síntesis narrativa del impacto ambiental para la toma de decisiones.',
      bioEn: 'Visual design of the geospatial console, multi-scale choropleth maps of the American Gran Chaco, and clear environmental storytelling for decision makers.',
      tags: ['MapLibre GIS', 'UI/UX Espacial', 'Pitch NASA'],
      isGroup: false
    },
    {
      index: 7,
      total: 7,
      image: 'assets/team/7.png',
      badge: '07 / 07 · EQUIPO COMPLETO',
      badgeEn: '07 / 07 · FULL TEAM',
      name: 'Equipo C.L.I.M.A.T.E. — NASA Space Apps',
      roleEs: 'Santiago del Estero • "¡La misión ha comenzado!"',
      roleEn: 'Santiago del Estero • "The mission has begun!"',
      bioEs: 'Un equipo multidisciplinario unido desde Santiago del Estero para proteger al Gran Chaco Americano combinando observación espacial de la NASA, inteligencia artificial explicable y sensores rurales LoRaWAN.',
      bioEn: 'A multidisciplinary team united from Santiago del Estero to protect the American Gran Chaco by combining NASA Earth observation, explainable AI, and rural LoRaWAN sensors.',
      tags: ['NASA Space Apps', 'Equipo Multidisciplinario', 'Gran Chaco Resiliente'],
      isGroup: true
    }
  ];

  const VIDEO_CHAPTERS = [
    {
      id: 'node',
      timeSec: 0,
      endSec: 9.0,
      code: 'ESCENA 01 · 00:00',
      codeEn: 'SCENE 01 · 00:00',
      titleEs: 'Nodo Centinela en Lote',
      titleEn: 'Field Sentinel Node',
      descEs: 'Estación solar autónoma con sonda de suelo, sensor BME280 y radio LoRa SX1262 capturando microclima en el lote.',
      descEn: 'Autonomous solar station with soil probe, BME280 sensor, and LoRa SX1262 radio capturing field microclimate.',
      telemetryEs: 'ESP32-C3 · HUMEDAD SUELO · 915 MHz TX',
      telemetryEn: 'ESP32-C3 · SOIL MOISTURE · 915 MHz TX'
    },
    {
      id: 'gateway',
      timeSec: 9.2,
      endSec: 18.0,
      code: 'ESCENA 02 · 00:09',
      codeEn: 'SCENE 02 · 00:09',
      titleEs: 'Gateway MultiTech en Altura',
      titleEn: 'Elevated MultiTech Gateway',
      descEs: 'Gateway industrial IP67 montado sobre molino rural captando múltiples parcelas a hasta 15 km sin depender de señal celular.',
      descEn: 'IP67 industrial gateway mounted on a rural windmill receiving multiple plots up to 15 km away without cellular coverage.',
      telemetryEs: 'MULTITECH MTCDTIP · BASICS STATION · EDGE MLINUX',
      telemetryEn: 'MULTITECH MTCDTIP · BASICS STATION · EDGE MLINUX'
    },
    {
      id: 'mesh',
      timeSec: 18.2,
      endSec: 28.0,
      code: 'ESCENA 03 · 00:18',
      codeEn: 'SCENE 03 · 00:18',
      titleEs: 'Convergencia & Fusión NASA',
      titleEn: 'Network & NASA Fusion',
      descEs: 'Desduplicación en ChirpStack v4, cómputo Edge offline ante tormentas y fusión en vivo con satélites GPM, SMAP y MODIS.',
      descEn: 'ChirpStack v4 deduplication, offline Edge computing during storms, and live fusion with NASA GPM, SMAP, and MODIS.',
      telemetryEs: 'CHIRPSTACK V4 · LIGHTGBM SHAP · SATÉLITES NASA',
      telemetryEn: 'CHIRPSTACK V4 · LIGHTGBM SHAP · NASA SATELLITES'
    }
  ];

  const STYLES = `
    #climate-intro-overlay {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .climate-intro-glass {
      background: rgba(10, 15, 29, 0.94);
      border: 1px solid rgba(34, 211, 238, 0.28);
      box-shadow: 0 25px 70px -15px rgba(0, 0, 0, 0.85), 0 0 40px rgba(6, 182, 212, 0.14);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
    }
    html.light #climate-intro-overlay .climate-intro-glass {
      background: rgba(255, 255, 255, 0.97);
      border: 1px solid rgba(14, 165, 233, 0.35);
      box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.22);
      color: #0F172A;
    }
    html.light #climate-intro-overlay .intro-surface-card {
      background: #F8FAFC !important;
      border-color: #CBD5E1 !important;
    }
    html.light #climate-intro-overlay .intro-text-main {
      color: #0F172A !important;
    }
    html.light #climate-intro-overlay .intro-text-sub {
      color: #334155 !important;
    }
    html.light #climate-intro-overlay .intro-text-muted {
      color: #475569 !important;
    }
    html.light #climate-intro-overlay .intro-tab-idle {
      background: #F1F5F9 !important;
      color: #334155 !important;
      border-color: #CBD5E1 !important;
    }
    html.light #climate-intro-overlay .intro-tab-idle:hover {
      background: #E2E8F0 !important;
      color: #0F172A !important;
    }
    html.light #climate-intro-overlay .intro-tag-chip {
      background: #E0F2FE !important;
      color: #0369A1 !important;
      border-color: #7DD3FC !important;
    }
    html.light #climate-intro-overlay .intro-compare-bad {
      background: #FEF2F2 !important;
      border-color: #FECACA !important;
    }
    html.light #climate-intro-overlay .intro-compare-good {
      background: #ECFDF5 !important;
      border-color: #A7F3D0 !important;
    }
    html.light #climate-intro-overlay .intro-compare-bad .text-red-400 {
      color: #B91C1C !important;
    }
    html.light #climate-intro-overlay .intro-compare-good .text-emerald-400 {
      color: #047857 !important;
    }
    html.light #climate-intro-overlay .intro-impact-banner {
      background: linear-gradient(90deg, #ECFEFF 0%, #F8FAFC 50%, #ECFDF5 100%) !important;
      border-color: #67E8F9 !important;
    }
    html.light #climate-intro-overlay .text-cyan-400,
    html.light #climate-intro-overlay .text-cyan-300 {
      color: #0284C7 !important;
    }
    html.light #climate-intro-overlay .text-emerald-400 {
      color: #059669 !important;
    }
    html.light #climate-intro-overlay .text-amber-400,
    html.light #climate-intro-overlay .text-amber-300 {
      color: #B45309 !important;
    }
    html.light #climate-intro-overlay .text-purple-400 {
      color: #7C3AED !important;
    }
    /* Media stage and tab badges retain intentional colors */
    html.light #climate-intro-overlay .bg-cyan-600,
    html.light #climate-intro-overlay .bg-gradient-to-r.from-emerald-500 {
      color: #FFFFFF !important;
    }
    /* Media stage stays cinema-dark regardless of UI theme so photos/video pop */
    .climate-intro-media-stage {
      background: radial-gradient(circle at 50% 35%, #111c33 0%, #060a14 100%) !important;
      color: #F8FAFC !important;
    }
    .climate-intro-atmosphere {
      background:
        radial-gradient(circle at 12% 18%, rgba(6, 182, 212, 0.22), transparent 34%),
        radial-gradient(circle at 86% 80%, rgba(16, 185, 129, 0.18), transparent 34%),
        radial-gradient(circle at 54% 12%, rgba(59, 130, 246, 0.16), transparent 30%);
      animation: climateIntroDrift 16s ease-in-out infinite alternate;
    }
    @keyframes climateIntroDrift {
      from { transform: scale(0.96) translate3d(-1%, -1%, 0); opacity: 0.72; }
      to { transform: scale(1.06) translate3d(1%, 1%, 0); opacity: 1; }
    }
    @keyframes climateSlideIn {
      from { opacity: 0; transform: translateY(10px) scale(0.985); filter: blur(4px); }
      to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    .climate-slide-anim {
      animation: climateSlideIn 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes climateKenBurns {
      0% { transform: scale(1); }
      100% { transform: scale(1.055); }
    }
    .climate-photo-motion {
      animation: climateKenBurns 7.5s ease-out forwards;
    }
    .climate-hud-scan {
      background: linear-gradient(180deg, transparent 0%, rgba(34, 211, 238, 0.08) 50%, transparent 100%);
      background-size: 100% 24px;
      pointer-events: none;
    }
    .climate-thumb-btn {
      transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
    }
    .climate-thumb-btn[aria-current="true"] {
      transform: translateY(-2px) scale(1.06);
      border-color: #22D3EE !important;
      box-shadow: 0 0 16px rgba(34, 211, 238, 0.48);
      opacity: 1 !important;
    }
    /* Spotlight del Demo Guiado en vivo */
    .climate-demo-highlight {
      position: relative;
      z-index: 25;
      box-shadow: 0 0 0 2px #22D3EE, 0 0 26px rgba(34, 211, 238, 0.45) !important;
      border-radius: 14px;
      transition: box-shadow 0.35s ease;
    }
    html.light #climate-demo-hud {
      background: rgba(255, 255, 255, 0.97) !important;
      border-color: rgba(2, 132, 199, 0.45) !important;
      color: #0F172A !important;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.22) !important;
    }
    html.light #climate-demo-hud .demo-hud-title {
      color: #0F172A !important;
    }
    html.light #climate-demo-hud .demo-hud-desc {
      color: #334155 !important;
    }
    html.light #climate-demo-hud .demo-hud-btn-idle {
      background: #F1F5F9 !important;
      color: #1E293B !important;
      border-color: #CBD5E1 !important;
    }
    html.light #climate-demo-hud .demo-hud-pill-idle {
      background: #E2E8F0 !important;
      color: #475569 !important;
      border-color: #CBD5E1 !important;
    }
    html.light #climate-demo-hud .text-cyan-400,
    html.light #climate-demo-hud .text-cyan-300,
    html.light #climate-demo-hud .text-cyan-200 {
      color: #0369A1 !important;
    }
    html.light #climate-demo-hud .text-emerald-300 {
      color: #047857 !important;
    }
    html.light #climate-demo-hud .text-amber-300 {
      color: #B45309 !important;
    }
    @keyframes climateDemoPulse {
      0%, 100% { box-shadow: 0 0 0 2px #22D3EE, 0 0 20px rgba(34, 211, 238, 0.42); }
      50% { box-shadow: 0 0 0 3px #10B981, 0 0 34px rgba(16, 185, 129, 0.55); }
    }
    .climate-demo-highlight {
      animation: climateDemoPulse 2s ease-in-out infinite;
    }
  `;

  function injectStyles() {
    if (document.getElementById('climate-intro-styles')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'climate-intro-styles';
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
  }

  function createIntroController(options) {
    const opts = Object.assign({
      standalone: false,
      autoOpen: true,
      storageKey: 'climate_intro_seen_session_v1',
      onClose: null,
      language: 'es'
    }, options || {});

    injectStyles();

    let currentStep = 1; // 1 = Equipo, 2 = Prototipo Video, 3 = Beneficios & Impacto
    let currentMemberIdx = 0;
    let isPlayingCarousel = true;
    let carouselTimer = null;
    let progressTimer = null;
    let slideStartedAt = Date.now();
    const SLIDE_DURATION_MS = 4500;
    let lang = opts.language === 'en' ? 'en' : 'es';
    let lastActiveChapterId = null;
    let demoActive = false;
    let demoStageIdx = 0;
    let demoPaused = false;
    let demoStageStartedAt = 0;
    let demoRemainingMs = 0;
    let demoTickTimer = null;
    let demoSubTimers = [];
    let demoHudEl = null;

    // Build DOM overlay
    let root = document.getElementById('climate-intro-overlay');
    if (!root) {
      root = document.createElement('div');
      root.id = 'climate-intro-overlay';
      root.className = 'fixed inset-0 z-[70] hidden items-center justify-center p-2 sm:p-4 lg:p-6 bg-space-950/90 backdrop-blur-xl transition-opacity duration-300';
      document.body.appendChild(root);
    }

    root.innerHTML = `
      <div class="climate-intro-atmosphere pointer-events-none absolute inset-0" aria-hidden="true"></div>
      <div class="relative w-full max-w-6xl climate-intro-glass rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 flex flex-col max-h-[95dvh] overflow-hidden shadow-2xl">

        <!-- CABECERA DEL MODAL -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-space-800 shrink-0">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-cyan-950/40 shrink-0">
              <i data-lucide="satellite" class="w-4.5 h-4.5"></i>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-black tracking-widest text-sm sm:text-base intro-text-main text-white">CLIMATE</span>
                <span class="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/35 whitespace-nowrap">NASA Space Apps · Gran Chaco</span>
              </div>
              <p id="intro-subtitle-line" class="text-[10.5px] sm:text-xs intro-text-muted text-slate-400 truncate">
                Plataforma Híbrida de Alerta Temprana, Satélites NASA & Red LoRaWAN Rural
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button type="button" data-intro-step="1" class="intro-step-tab px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="users" class="w-3.5 h-3.5"></i>
              <span id="intro-tab-label-1">1. Equipo (1–7)</span>
            </button>
            <button type="button" data-intro-step="2" class="intro-step-tab px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="clapperboard" class="w-3.5 h-3.5"></i>
              <span id="intro-tab-label-2">2. Prototipo</span>
            </button>
            <button type="button" data-intro-step="3" class="intro-step-tab px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="trending-up" class="w-3.5 h-3.5"></i>
              <span id="intro-tab-label-3">3. Beneficios</span>
            </button>
            <button id="intro-btn-close-x" type="button" class="ml-1 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-space-800 transition cursor-pointer" title="Ir a la plataforma">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- CUERPO SCROLLEABLE ADAPTATIVO -->
        <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-3 sm:py-4 pr-0.5">

          <!-- ================= PASO 1: CARRUSEL EQUIPO (IMÁGENES 1 A 7) ================= -->
          <section id="intro-panel-step-1" class="space-y-3.5">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span id="intro-team-kicker" class="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                  NUESTRO EQUIPO · ORDEN 01 A 07
                </span>
                <h2 id="intro-team-heading" class="text-lg sm:text-2xl font-black intro-text-main text-white leading-tight mt-0.5">
                  El talento humano detrás de CLIMATE
                </h2>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button id="intro-carousel-play-toggle" type="button" class="px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-semibold border border-cyan-500/35 text-cyan-400 hover:bg-cyan-500/10 transition cursor-pointer flex items-center gap-1">
                  <i data-lucide="pause" class="w-3 h-3"></i>
                  <span id="intro-play-label">Pausar</span>
                </button>
                <span id="intro-member-counter" class="px-2.5 py-1 rounded-lg bg-space-850 border border-space-700 font-mono text-[10.5px] font-bold text-cyan-300 tabular-nums intro-surface-card">
                  01 / 07
                </span>
              </div>
            </div>

            <!-- Spotlight Card Split Layout -->
            <div id="intro-member-spotlight" class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch rounded-2xl border border-space-800 bg-space-900/80 p-3 sm:p-4 intro-surface-card shadow-xl">

              <!-- Foto del Integrante / Grupo -->
              <div class="lg:col-span-6 relative rounded-2xl overflow-hidden climate-intro-media-stage border border-cyan-500/30 shadow-2xl flex items-center justify-center min-h-[240px] sm:min-h-[300px] lg:min-h-[340px]">
                <img id="intro-member-img" src="assets/team/1.jpeg" alt="Integrante del equipo CLIMATE" class="w-full h-full max-h-[380px] object-cover object-[center_18%] transition-all duration-500" />
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20"></div>

                <!-- Badges sobre foto -->
                <div class="absolute top-3 left-3 flex items-center gap-1.5">
                  <span id="intro-member-badge" class="px-2.5 py-1 rounded-lg bg-space-950/85 backdrop-blur-md border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 tracking-wider">
                    01 / 07 · MENTORÍA
                  </span>
                </div>

                <!-- Botones flotantes sobre la foto para escritorio/táctil -->
                <button id="intro-member-prev-overlay" type="button" class="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 hover:bg-cyan-600 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition cursor-pointer" aria-label="Anterior">
                  <i data-lucide="chevron-left" class="w-5 h-5"></i>
                </button>
                <button id="intro-member-next-overlay" type="button" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/55 hover:bg-cyan-600 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition cursor-pointer" aria-label="Siguiente">
                  <i data-lucide="chevron-right" class="w-5 h-5"></i>
                </button>

                <!-- Barra de progreso de slide -->
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
                  <div id="intro-slide-progress" class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-[width] duration-75" style="width: 0%"></div>
                </div>
              </div>

              <!-- Ficha Descriptiva del Integrante -->
              <div class="lg:col-span-6 flex flex-col justify-between py-1 sm:py-2 px-1 sm:px-2 space-y-3">
                <div class="space-y-2.5">
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-semibold">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span id="intro-team-origin">NASA Space Apps · Santiago del Estero</span>
                  </div>

                  <h3 id="intro-member-name" class="text-xl sm:text-2xl lg:text-[26px] font-black intro-text-main text-white leading-tight">
                    Prof. José Luis Pereyra
                  </h3>

                  <p id="intro-member-role" class="font-mono text-xs sm:text-sm font-semibold text-cyan-400">
                    Mentoría Científica & Coordinación Territorial
                  </p>

                  <p id="intro-member-bio" class="text-xs sm:text-sm intro-text-sub text-slate-300 leading-relaxed pt-1">
                    Acompañamiento estratégico del equipo C.L.I.M.A.T.E.
                  </p>

                  <div id="intro-member-tags" class="flex flex-wrap gap-1.5 pt-2">
                    <!-- Tags dinámicos -->
                  </div>
                </div>

                <!-- Controles y mini-resumen del prototipo -->
                <div class="pt-3 border-t border-space-800 flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <button id="intro-member-prev" type="button" class="h-8 px-3 rounded-xl border border-space-700 bg-space-850 hover:border-cyan-400 text-xs font-mono font-semibold intro-text-sub text-slate-200 transition flex items-center gap-1 cursor-pointer intro-surface-card">
                      <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
                      <span id="intro-prev-txt">Anterior</span>
                    </button>
                    <button id="intro-member-next" type="button" class="h-8 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-semibold text-white transition flex items-center gap-1 cursor-pointer shadow-sm">
                      <span id="intro-next-txt">Siguiente</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>

                  <button type="button" id="intro-jump-video" class="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer">
                    <i data-lucide="play-circle" class="w-3.5 h-3.5"></i>
                    <span id="intro-jump-video-txt">Ver Prototipo en Video</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Filmstrip de Miniaturas en Orden 1 al 7 -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-[10px] font-mono intro-text-muted text-slate-400 px-1">
                <span id="intro-filmstrip-hint">Secuencia cronológica del equipo (clic en cualquier foto para enfocar):</span>
                <span class="hidden sm:inline">← / → teclado</span>
              </div>
              <div id="intro-member-filmstrip" class="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                <!-- Generado dinámicamente 1..7 -->
              </div>
            </div>
          </section>

          <!-- ================= PASO 2: VIDEO UNIFICADO DEL PROTOTIPO CON EFECTOS ================= -->
          <section id="intro-panel-step-2" class="hidden space-y-3.5">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span id="intro-proto-kicker" class="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  PROTOTIPO UNIFICADO · CAPTURA EN CAMPO + GATEWAY + RED GRAN CHACO
                </span>
                <h2 id="intro-proto-heading" class="text-lg sm:text-2xl font-black intro-text-main text-white leading-tight mt-0.5">
                  Del suelo agrícola al satélite sin perder un solo paquete
                </h2>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button id="intro-video-mute-btn" type="button" class="px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-semibold bg-space-850 border border-cyan-500/35 text-cyan-300 hover:bg-space-800 transition cursor-pointer flex items-center gap-1.5 intro-surface-card">
                  <i id="intro-video-mute-icon" data-lucide="volume-x" class="w-3.5 h-3.5"></i>
                  <span id="intro-video-mute-label">Activar Audio</span>
                </button>
                <button id="intro-video-replay-btn" type="button" class="px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-semibold bg-space-850 border border-space-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1 intro-surface-card">
                  <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                  <span id="intro-video-replay-label">Reiniciar</span>
                </button>
              </div>
            </div>

            <!-- Visor Cinematográfico con HUD Aeroespacial -->
            <div class="relative rounded-2xl overflow-hidden climate-intro-media-stage border border-cyan-500/40 shadow-2xl">
              <div class="relative aspect-video max-h-[46vh] w-full bg-black flex items-center justify-center overflow-hidden">
                <video id="intro-prototype-video" class="w-full h-full object-contain" muted loop playsinline preload="metadata" controlsList="nodownload">
                  <source src="assets/video/prototipo_climate_unificado.mp4" type="video/mp4">
                </video>

                <!-- HUD Superpuesto Sutil -->
                <div class="climate-hud-scan absolute inset-0 pointer-events-none"></div>

                <!-- Esquinas tácticas HUD -->
                <div class="pointer-events-none absolute top-2.5 left-2.5 flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-400/40 font-mono text-[10px] font-bold text-cyan-300 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span id="intro-video-hud-telemetry">ESP32-C3 · HUMEDAD SUELO · 915 MHz TX</span>
                  </span>
                </div>

                <div class="pointer-events-none absolute top-2.5 right-2.5 hidden sm:flex items-center gap-1.5">
                  <span id="intro-video-time-pill" class="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 font-mono text-[10px] text-slate-200 tabular-nums">
                    00:00 / 00:27
                  </span>
                </div>

                <!-- Subtítulo dinámico de escena en la base del video -->
                <div class="pointer-events-none absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                  <div class="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 max-w-2xl">
                    <p id="intro-video-hud-caption" class="text-[11px] sm:text-xs text-slate-100 font-medium leading-snug">
                      Estación solar autónoma con sonda de suelo, sensor BME280 y radio LoRa SX1262 capturando microclima en el lote.
                    </p>
                  </div>
                  <button id="intro-video-playpause-btn" type="button" class="pointer-events-auto w-9 h-9 rounded-full bg-cyan-600/90 hover:bg-cyan-500 text-white shadow-lg flex items-center justify-center transition cursor-pointer shrink-0" title="Pausar/Reproducir video">
                    <i id="intro-video-playpause-icon" data-lucide="pause" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Selector de Capítulos Sincronizados (3 Etapas del Prototipo) -->
            <div id="intro-video-chapters" class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <!-- Renderizado dinámico -->
            </div>
          </section>

          <!-- ================= PASO 3: BENEFICIOS E IMPACTO DEL SERVICIO ================= -->
          <section id="intro-panel-step-3" class="hidden space-y-3.5">
            <div>
              <span id="intro-benefits-kicker" class="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                PROPUESTA DE VALOR · POR QUÉ ADQUIRIR EL SERVICIO CLIMATE
              </span>
              <h2 id="intro-benefits-heading" class="text-lg sm:text-2xl font-black intro-text-main text-white leading-tight mt-0.5">
                Beneficios e impacto real basados en nuestro prototipo de campo + IA
              </h2>
              <p id="intro-benefits-sub" class="text-xs sm:text-sm intro-text-sub text-slate-300 mt-1">
                Cada componente del prototipo —desde el nodo solar en el lote hasta el motor LightGBM con satélites NASA— se traduce en ahorro operativo, anticipación climática y continuidad productiva.
              </p>
            </div>

            <!-- Comparativa Sin CLIMATE vs Con CLIMATE -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="intro-compare-bad p-3.5 rounded-2xl bg-red-950/20 border border-red-500/35 space-y-1">
                <span id="intro-cmp-without-title" class="font-mono text-[11px] font-bold text-red-400 flex items-center gap-1.5">
                  <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i>
                  SIN MONITOREO INTEGRADO
                </span>
                <p id="intro-cmp-without-body" class="text-xs intro-text-sub text-slate-300 leading-relaxed">
                  Lotes rurales sin cobertura celular, sensores aislados que fallan si se corta internet, y decisiones reactivas tomadas cuando el déficit hídrico ya redujo el rinde.
                </p>
              </div>
              <div class="intro-compare-good p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-1">
                <span id="intro-cmp-with-title" class="font-mono text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i>
                  AL ADQUIRIR EL SERVICIO CLIMATE
                </span>
                <p id="intro-cmp-with-body" class="text-xs intro-text-sub text-slate-300 leading-relaxed">
                  Red propia LoRaWAN a 15 km sin abonos por sensor, cómputo Edge offline en tormentas, fusión con satélites NASA y proyecciones cuantílicas a 6 meses listas para actuar.
                </p>
              </div>
            </div>

            <!-- 4 Beneficios Clave Conectados al Prototipo -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="p-3.5 rounded-2xl bg-space-900/85 border border-space-800 intro-surface-card space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-cyan-400">
                    <i data-lucide="radio" class="w-4.5 h-4.5"></i>
                    <h4 id="intro-ben-1-t" class="font-bold intro-text-main text-white text-xs sm:text-sm">Telemetría Rural Sin Celular (Cero Abonos)</h4>
                  </div>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">Prototipo Escena 1–2</span>
                </div>
                <p id="intro-ben-1-d" class="text-[11.5px] intro-text-sub text-slate-300 leading-relaxed">
                  Nuestros nodos solares transmiten por radio LoRa a un único Gateway MultiTech montado en molino o silo, eliminando pagos mensuales de chips 4G en cientos de hectáreas.
                </p>
              </div>

              <div class="p-3.5 rounded-2xl bg-space-900/85 border border-space-800 intro-surface-card space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-emerald-400">
                    <i data-lucide="trending-up" class="w-4.5 h-4.5"></i>
                    <h4 id="intro-ben-2-t" class="font-bold intro-text-main text-white text-xs sm:text-sm">Horizonte de Anticipación de 6 Meses</h4>
                  </div>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">LightGBM p10–p90</span>
                </div>
                <p id="intro-ben-2-d" class="text-[11.5px] intro-text-sub text-slate-300 leading-relaxed">
                  Planifica fechas de siembra, rotaciones ganaderas y reservas de agua combinando modelos cuantílicos con telemetría espacial GPM, SMAP y MODIS de la NASA.
                </p>
              </div>

              <div class="p-3.5 rounded-2xl bg-space-900/85 border border-space-800 intro-surface-card space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-amber-400">
                    <i data-lucide="cpu" class="w-4.5 h-4.5"></i>
                    <h4 id="intro-ben-3-t" class="font-bold intro-text-main text-white text-xs sm:text-sm">Resiliencia Edge Offline en Tormentas</h4>
                  </div>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">Prototipo Escena 3</span>
                </div>
                <p id="intro-ben-3-d" class="text-[11.5px] intro-text-sub text-slate-300 leading-relaxed">
                  Si el enlace de internet cae durante temporales, el Gateway ejecuta inferencia local en mLinux y activa sirenas de campo y alertas SMS satelitales directas al productor.
                </p>
              </div>

              <div class="p-3.5 rounded-2xl bg-space-900/85 border border-space-800 intro-surface-card space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-purple-400">
                    <i data-lucide="shield-check" class="w-4.5 h-4.5"></i>
                    <h4 id="intro-ben-4-t" class="font-bold intro-text-main text-white text-xs sm:text-sm">Explicabilidad SHAP, Excel 30Y & Reportes</h4>
                  </div>
                  <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30">Auditoría & PDF</span>
                </div>
                <p id="intro-ben-4-d" class="text-[11.5px] intro-text-sub text-slate-300 leading-relaxed">
                  Sin cajas negras: cada alerta detalla qué variable climática la dispara, acepta series históricas en Excel de 30 años y envía avisos automáticos por Email y Telegram.
                </p>
              </div>
            </div>

            <!-- Impacto Estratégico en el Gran Chaco -->
            <div class="intro-impact-banner rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/45 via-space-900/80 to-emerald-950/45 p-3.5 sm:p-4 intro-surface-card">
              <div class="flex items-center justify-between flex-wrap gap-2 mb-2.5">
                <h3 id="intro-impact-title" class="text-xs sm:text-sm font-bold intro-text-main text-white flex items-center gap-1.5">
                  <i data-lucide="globe" class="w-4 h-4 text-cyan-400"></i>
                  Impacto Directo al Adquirir e Implementar CLIMATE
                </h3>
                <span class="text-[9.5px] font-mono text-cyan-400 font-semibold">ARG • PRY • BOL</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11.5px]">
                <div class="p-2.5 rounded-xl bg-space-950/60 border border-space-800 intro-surface-card">
                  <span id="intro-imp-1-t" class="font-mono font-bold text-cyan-400">🌾 PRODUCTORES & COOPERATIVAS</span>
                  <p id="intro-imp-1-d" class="mt-1 intro-text-sub text-slate-300">Menos pérdida de campaña y riego/manejo de rodeos guiado por humedad radicular real del lote.</p>
                </div>
                <div class="p-2.5 rounded-xl bg-space-950/60 border border-space-800 intro-surface-card">
                  <span id="intro-imp-2-t" class="font-mono font-bold text-emerald-400">🏛️ GOBIERNOS LOCALES & INTA</span>
                  <p id="intro-imp-2-d" class="mt-1 intro-text-sub text-slate-300">Priorización presupuestaria por departamento y detección temprana de anomalías departamentales.</p>
                </div>
                <div class="p-2.5 rounded-xl bg-space-950/60 border border-space-800 intro-surface-card">
                  <span id="intro-imp-3-t" class="font-mono font-bold text-purple-400">🛡️ DEFENSA CIVIL & CUENCAS</span>
                  <p id="intro-imp-3-d" class="mt-1 intro-text-sub text-slate-300">Despliegue preventivo ante sequías extremas o anegamientos en Bajos Submeridionales.</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        <!-- PIE DE NAVEGACIÓN FIJO -->
        <div class="pt-3 border-t border-space-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button id="intro-btn-back" type="button" class="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold intro-text-sub text-slate-300 hover:bg-space-800 border border-space-700/80 transition disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
            <span id="intro-btn-back-label">Anterior</span>
          </button>

          <div class="flex flex-wrap items-center gap-2">
            <button id="intro-btn-launch-demo" type="button" class="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/45 transition flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i>
              <span id="intro-btn-launch-demo-label">Ejecutar Demo Guiado</span>
            </button>

            <button id="intro-btn-next" type="button" class="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950/40">
              <span id="intro-btn-next-label">Siguiente: Prototipo en Video</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>

            <button id="intro-btn-enter" type="button" class="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40">
              <i data-lucide="rocket" class="w-3.5 h-3.5"></i>
              <span id="intro-btn-enter-label">Entrar a la Plataforma</span>
            </button>
          </div>
        </div>

      </div>
    `;

    // DOM refs
    const memberImgEl = document.getElementById('intro-member-img');
    const memberBadgeEl = document.getElementById('intro-member-badge');
    const memberNameEl = document.getElementById('intro-member-name');
    const memberRoleEl = document.getElementById('intro-member-role');
    const memberBioEl = document.getElementById('intro-member-bio');
    const memberTagsEl = document.getElementById('intro-member-tags');
    const memberCounterEl = document.getElementById('intro-member-counter');
    const slideProgressEl = document.getElementById('intro-slide-progress');
    const filmstripEl = document.getElementById('intro-member-filmstrip');
    const playToggleBtn = document.getElementById('intro-carousel-play-toggle');
    const videoEl = document.getElementById('intro-prototype-video');
    const videoChaptersEl = document.getElementById('intro-video-chapters');
    const videoHudTelemetryEl = document.getElementById('intro-video-hud-telemetry');
    const videoHudCaptionEl = document.getElementById('intro-video-hud-caption');
    const videoTimePillEl = document.getElementById('intro-video-time-pill');
    const videoMuteBtn = document.getElementById('intro-video-mute-btn');
    const videoReplayBtn = document.getElementById('intro-video-replay-btn');
    const videoPlayPauseBtn = document.getElementById('intro-video-playpause-btn');

    function renderFilmstrip() {
      if (!filmstripEl) return;
      filmstripEl.innerHTML = TEAM_SLIDES.map((s, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        const objPos = s.isGroup ? 'object-cover object-center' : 'object-cover object-[center_20%]';
        return `
          <button type="button" data-thumb-idx="${idx}" aria-current="${idx === currentMemberIdx}" class="climate-thumb-btn relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden border-2 border-space-700 bg-space-950 opacity-60 hover:opacity-100 cursor-pointer group">
            <img src="${s.image}" alt="Foto ${num}" class="w-full h-full ${objPos}">
            <span class="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/75 font-mono text-[9px] font-bold text-white">${num}</span>
          </button>
        `;
      }).join('');

      filmstripEl.querySelectorAll('[data-thumb-idx]').forEach(btn => {
        btn.addEventListener('click', () => {
          stopAutoCarousel();
          showMember(Number(btn.getAttribute('data-thumb-idx')));
        });
      });
    }

    function showMember(idx) {
      currentMemberIdx = (idx + TEAM_SLIDES.length) % TEAM_SLIDES.length;
      const slide = TEAM_SLIDES[currentMemberIdx];
      slideStartedAt = Date.now();

      if (memberImgEl) {
        memberImgEl.classList.remove('climate-photo-motion');
        void memberImgEl.offsetWidth;
        memberImgEl.src = slide.image;
        memberImgEl.alt = slide.name;
        if (slide.isGroup) {
          memberImgEl.className = 'w-full h-full max-h-[380px] object-contain bg-black transition-all duration-500 climate-photo-motion';
        } else {
          memberImgEl.className = 'w-full h-full max-h-[380px] object-cover object-[center_18%] transition-all duration-500 climate-photo-motion';
        }
      }

      if (memberBadgeEl) memberBadgeEl.textContent = lang === 'en' ? slide.badgeEn : slide.badge;
      if (memberNameEl) memberNameEl.textContent = slide.name;
      if (memberRoleEl) memberRoleEl.textContent = lang === 'en' ? slide.roleEn : slide.roleEs;
      if (memberBioEl) memberBioEl.textContent = lang === 'en' ? slide.bioEn : slide.bioEs;
      if (memberCounterEl) memberCounterEl.textContent = `${String(slide.index).padStart(2, '0')} / 07`;

      if (memberTagsEl) {
        memberTagsEl.innerHTML = slide.tags.map(tag => `
          <span class="intro-tag-chip px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-semibold">
            ${tag}
          </span>
        `).join('');
      }

      if (filmstripEl) {
        filmstripEl.querySelectorAll('[data-thumb-idx]').forEach((b, i) => {
          b.setAttribute('aria-current', String(i === currentMemberIdx));
        });
      }
    }

    function startAutoCarousel() {
      stopAutoCarousel();
      isPlayingCarousel = true;
      slideStartedAt = Date.now();
      updatePlayToggleUI();

      progressTimer = window.setInterval(() => {
        if (!isPlayingCarousel || currentStep !== 1 || root.classList.contains('hidden')) return;
        const elapsed = Date.now() - slideStartedAt;
        const pct = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
        if (slideProgressEl) slideProgressEl.style.width = `${pct}%`;
        if (elapsed >= SLIDE_DURATION_MS) {
          showMember(currentMemberIdx + 1);
        }
      }, 60);
    }

    function stopAutoCarousel() {
      isPlayingCarousel = false;
      if (carouselTimer) clearInterval(carouselTimer);
      if (progressTimer) clearInterval(progressTimer);
      carouselTimer = null;
      progressTimer = null;
      if (slideProgressEl) slideProgressEl.style.width = '100%';
      updatePlayToggleUI();
    }

    function updatePlayToggleUI() {
      const label = document.getElementById('intro-play-label');
      if (label) {
        label.textContent = isPlayingCarousel
          ? (lang === 'en' ? 'Pause' : 'Pausar')
          : (lang === 'en' ? 'Play' : 'Reanudar');
      }
      if (playToggleBtn) {
        const icon = playToggleBtn.querySelector('i');
        if (icon) icon.setAttribute('data-lucide', isPlayingCarousel ? 'pause' : 'play');
        if (global.lucide) global.lucide.createIcons();
      }
    }

    function renderVideoChapters(activeId) {
      if (!videoChaptersEl) return;
      videoChaptersEl.innerHTML = VIDEO_CHAPTERS.map(ch => {
        const isActive = ch.id === activeId;
        return `
          <button type="button" data-chapter-id="${ch.id}" class="text-left p-3 rounded-xl border transition cursor-pointer ${
            isActive
              ? 'bg-cyan-950/50 border-cyan-400/60 shadow-lg shadow-cyan-950/30 intro-surface-card'
              : 'bg-space-900/75 border-space-800 hover:border-cyan-500/40 intro-surface-card opacity-85 hover:opacity-100'
          }">
            <div class="flex items-center justify-between gap-1 mb-1">
              <span class="font-mono text-[10px] font-bold ${isActive ? 'text-cyan-400' : 'text-slate-400'}">${lang === 'en' ? ch.codeEn : ch.code}</span>
              ${isActive ? '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>' : ''}
            </div>
            <h4 class="text-xs sm:text-sm font-bold intro-text-main text-white">${lang === 'en' ? ch.titleEn : ch.titleEs}</h4>
            <p class="text-[11px] intro-text-sub text-slate-300 mt-0.5 leading-snug">${lang === 'en' ? ch.descEn : ch.descEs}</p>
          </button>
        `;
      }).join('');

      videoChaptersEl.querySelectorAll('[data-chapter-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cid = btn.getAttribute('data-chapter-id');
          const chapter = VIDEO_CHAPTERS.find(c => c.id === cid);
          if (chapter && videoEl) {
            videoEl.currentTime = chapter.timeSec;
            videoEl.play().catch(() => {});
            syncVideoHud();
          }
        });
      });
    }

    function formatTime(sec) {
      const s = Math.max(0, Math.floor(sec || 0));
      const mm = String(Math.floor(s / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      return `${mm}:${ss}`;
    }

    function syncVideoHud(forceRender) {
      if (!videoEl) return;
      const t = videoEl.currentTime || 0;
      const dur = videoEl.duration || 27.5;
      if (videoTimePillEl) {
        videoTimePillEl.textContent = `${formatTime(t)} / ${formatTime(dur)}`;
      }
      const activeChapter = VIDEO_CHAPTERS.find(c => t >= c.timeSec && t < c.endSec) || VIDEO_CHAPTERS[0];
      if (!forceRender && activeChapter.id === lastActiveChapterId) {
        return;
      }
      lastActiveChapterId = activeChapter.id;
      if (videoHudTelemetryEl) {
        videoHudTelemetryEl.textContent = lang === 'en' ? activeChapter.telemetryEn : activeChapter.telemetryEs;
      }
      if (videoHudCaptionEl) {
        videoHudCaptionEl.textContent = lang === 'en' ? activeChapter.descEn : activeChapter.descEs;
      }
      renderVideoChapters(activeChapter.id);
    }

    function goToStep(step) {
      currentStep = Math.max(1, Math.min(3, step));
      const p1 = document.getElementById('intro-panel-step-1');
      const p2 = document.getElementById('intro-panel-step-2');
      const p3 = document.getElementById('intro-panel-step-3');
      if (p1) p1.classList.toggle('hidden', currentStep !== 1);
      if (p2) p2.classList.toggle('hidden', currentStep !== 2);
      if (p3) p3.classList.toggle('hidden', currentStep !== 3);

      root.querySelectorAll('.intro-step-tab').forEach(tab => {
        const s = Number(tab.getAttribute('data-intro-step'));
        if (s === currentStep) {
          tab.className = 'intro-step-tab px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition flex items-center gap-1.5 cursor-pointer bg-cyan-600 text-white shadow-sm';
        } else {
          tab.className = 'intro-step-tab intro-tab-idle px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold transition flex items-center gap-1.5 cursor-pointer bg-space-850 text-slate-300 border border-space-700 hover:text-white';
        }
      });

      const btnBack = document.getElementById('intro-btn-back');
      const btnNext = document.getElementById('intro-btn-next');
      const nextLabel = document.getElementById('intro-btn-next-label');

      if (btnBack) btnBack.disabled = currentStep === 1;
      if (btnNext) btnNext.classList.toggle('hidden', currentStep === 3);

      if (nextLabel) {
        if (currentStep === 1) nextLabel.textContent = lang === 'en' ? 'Next: Prototype Video' : 'Siguiente: Prototipo en Video';
        else if (currentStep === 2) nextLabel.textContent = lang === 'en' ? 'Next: Benefits & Impact' : 'Siguiente: Beneficios e Impacto';
      }

      if (currentStep === 2 && videoEl) {
        videoEl.play().catch(() => {});
        syncVideoHud();
      } else if (videoEl && !videoEl.paused) {
        videoEl.pause();
      }

      if (global.lucide) global.lucide.createIcons();
    }

    function applyLanguage(newLang) {
      lang = newLang === 'en' ? 'en' : 'es';
      const setTxt = (id, es, en) => {
        const el = document.getElementById(id);
        if (el) el.textContent = lang === 'en' ? en : es;
      };
      setTxt('intro-subtitle-line', 'Plataforma Híbrida de Alerta Temprana, Satélites NASA & Red LoRaWAN Rural', 'Hybrid Early Warning Platform, NASA Satellites & Rural LoRaWAN');
      setTxt('intro-tab-label-1', '1. Equipo (1–7)', '1. Team (1–7)');
      setTxt('intro-tab-label-2', '2. Prototipo', '2. Prototype');
      setTxt('intro-tab-label-3', '3. Beneficios', '3. Benefits');
      setTxt('intro-team-kicker', 'NUESTRO EQUIPO · ORDEN 01 A 07', 'OUR TEAM · SEQUENCE 01 TO 07');
      setTxt('intro-team-heading', 'El talento humano detrás de CLIMATE', 'The people behind CLIMATE');
      setTxt('intro-prev-txt', 'Anterior', 'Previous');
      setTxt('intro-next-txt', 'Siguiente', 'Next');
      setTxt('intro-jump-video-txt', 'Ver Prototipo en Video', 'Watch Prototype Video');
      setTxt('intro-filmstrip-hint', 'Secuencia cronológica del equipo (clic en cualquier foto para enfocar):', 'Team chronological gallery (click any photo to inspect):');
      setTxt('intro-proto-kicker', 'PROTOTIPO UNIFICADO · CAPTURA EN CAMPO + GATEWAY + RED GRAN CHACO', 'UNIFIED PROTOTYPE · FIELD CAPTURE + GATEWAY + GRAN CHACO MESH');
      setTxt('intro-proto-heading', 'Del suelo agrícola al satélite sin perder un solo paquete', 'From farmland soil to satellite without losing a single packet');
      setTxt('intro-video-replay-label', 'Reiniciar', 'Restart');
      setTxt('intro-benefits-kicker', 'PROPUESTA DE VALOR · POR QUÉ ADQUIRIR EL SERVICIO CLIMATE', 'VALUE PROPOSITION · WHY ADOPT CLIMATE');
      setTxt('intro-benefits-heading', 'Beneficios e impacto real basados en nuestro prototipo de campo + IA', 'Real benefits & impact powered by our field prototype + AI');
      setTxt('intro-benefits-sub', 'Cada componente del prototipo —desde el nodo solar en el lote hasta el motor LightGBM con satélites NASA— se traduce en ahorro operativo, anticipación climática y continuidad productiva.', 'Every prototype layer—from the solar node in the plot to LightGBM with NASA satellites—turns into operational savings, early anticipation, and continuity.');
      setTxt('intro-cmp-without-title', 'SIN MONITOREO INTEGRADO', 'WITHOUT INTEGRATED MONITORING');
      setTxt('intro-cmp-without-body', 'Lotes rurales sin cobertura celular, sensores aislados que fallan si se corta internet, y decisiones reactivas tomadas cuando el déficit hídrico ya redujo el rinde.', 'Rural plots lacking cellular coverage, isolated sensors failing during outages, and reactive decisions made after water deficit hits yield.');
      setTxt('intro-cmp-with-title', 'AL ADQUIRIR EL SERVICIO CLIMATE', 'BY ADOPTING THE CLIMATE SERVICE');
      setTxt('intro-cmp-with-body', 'Red propia LoRaWAN a 15 km sin abonos por sensor, cómputo Edge offline en tormentas, fusión con satélites NASA y proyecciones cuantílicas a 6 meses listas para actuar.', 'Private 15 km LoRaWAN network with zero cellular fees, offline Edge computing in storms, NASA satellite fusion, and 6-month quantile forecasts.');
      setTxt('intro-ben-1-t', 'Telemetría Rural Sin Celular (Cero Abonos)', 'Cellular-Free Rural Telemetry (Zero Monthly Fees)');
      setTxt('intro-ben-1-d', 'Nuestros nodos solares transmiten por radio LoRa a un único Gateway MultiTech montado en molino o silo, eliminando pagos mensuales de chips 4G en cientos de hectáreas.', 'Solar field nodes transmit via LoRa radio to a single MultiTech Gateway mounted on a windmill or silo, eliminating monthly 4G SIM costs across large estates.');
      setTxt('intro-ben-2-t', 'Horizonte de Anticipación de 6 Meses', '6-Month Early Anticipation Horizon');
      setTxt('intro-ben-2-d', 'Planifica fechas de siembra, rotaciones ganaderas y reservas de agua combinando modelos cuantílicos con telemetría espacial GPM, SMAP y MODIS de la NASA.', 'Plan planting windows, livestock rotation, and water reserves by combining quantile forecasts with NASA GPM, SMAP, and MODIS telemetry.');
      setTxt('intro-ben-3-t', 'Resiliencia Edge Offline en Tormentas', 'Offline Edge Resilience During Storms');
      setTxt('intro-ben-3-d', 'Si el enlace de internet cae durante temporales, el Gateway ejecuta inferencia local en mLinux y activa sirenas de campo y alertas SMS satelitales directas al productor.', 'When internet drops during severe storms, the Gateway runs local mLinux inference and triggers field sirens plus direct satellite SMS alerts.');
      setTxt('intro-ben-4-t', 'Explicabilidad SHAP, Excel 30Y & Reportes', 'SHAP Explainability, 30Y Excel & Reports');
      setTxt('intro-ben-4-d', 'Sin cajas negras: cada alerta detalla qué variable climática la dispara, acepta series históricas en Excel de 30 años y envía avisos automáticos por Email y Telegram.', 'No black boxes: every alert details its driving climate variables, ingests 30-year Excel series, and dispatches Email & Telegram alerts.');
      setTxt('intro-impact-title', 'Impacto Directo al Adquirir e Implementar CLIMATE', 'Direct Impact of Deploying CLIMATE');
      setTxt('intro-imp-1-t', '🌾 PRODUCTORES & COOPERATIVAS', '🌾 PRODUCERS & COOPERATIVES');
      setTxt('intro-imp-1-d', 'Menos pérdida de campaña y riego/manejo de rodeos guiado por humedad radicular real del lote.', 'Lower crop losses and herd/irrigation management driven by real root-zone soil moisture.');
      setTxt('intro-imp-2-t', '🏛️ GOBIERNOS LOCALES & INTA', '🏛️ LOCAL GOVERNMENTS & AGENCIES');
      setTxt('intro-imp-2-d', 'Priorización presupuestaria por departamento y detección temprana de anomalías departamentales.', 'Targeted departmental budget allocation and early detection of regional anomalies.');
      setTxt('intro-imp-3-t', '🛡️ DEFENSA CIVIL & CUENCAS', '🛡️ CIVIL DEFENSE & WATERSHEDS');
      setTxt('intro-imp-3-d', 'Despliegue preventivo ante sequías extremas o anegamientos en Bajos Submeridionales.', 'Preventive response ahead of extreme droughts or flooding across the Bajos Submeridionales.');
      setTxt('intro-btn-back-label', 'Anterior', 'Back');
      setTxt('intro-btn-launch-demo-label', 'Ejecutar Demo Guiado', 'Run Guided Demo');
      setTxt('intro-btn-enter-label', opts.standalone ? 'Abrir Plataforma en Vivo' : 'Entrar a la Plataforma', opts.standalone ? 'Launch Live Platform' : 'Enter Platform');
      if (videoMuteBtn && videoEl) {
        const lbl = document.getElementById('intro-video-mute-label');
        if (lbl) lbl.textContent = videoEl.muted ? (lang === 'en' ? 'Unmute Audio' : 'Activar Audio') : (lang === 'en' ? 'Mute' : 'Silenciar');
      }

      showMember(currentMemberIdx);
      updatePlayToggleUI();
      syncVideoHud(true);
      goToStep(currentStep);
      if (demoActive) renderDemoHud();
    }

    function open(startStep) {
      root.classList.remove('hidden');
      root.classList.add('flex');
      goToStep(startStep || 1);
      if (currentStep === 1) {
        showMember(currentMemberIdx);
        startAutoCarousel();
      }
      if (global.lucide) global.lucide.createIcons();
    }

    function close() {
      stopAutoCarousel();
      if (videoEl && !videoEl.paused) videoEl.pause();
      if (opts.storageKey) {
        try { sessionStorage.setItem(opts.storageKey, '1'); } catch (e) {}
      }
      if (opts.standalone) {
        window.location.href = 'index.html';
        return;
      }
      root.classList.add('hidden');
      root.classList.remove('flex');
      if (typeof opts.onClose === 'function') opts.onClose();
    }

    // Wire events
    renderFilmstrip();
    showMember(0);
    renderVideoChapters('node');

    root.querySelectorAll('.intro-step-tab').forEach(tab => {
      tab.addEventListener('click', () => goToStep(Number(tab.getAttribute('data-intro-step'))));
    });

    const prevHandler = () => { stopAutoCarousel(); showMember(currentMemberIdx - 1); };
    const nextHandler = () => { stopAutoCarousel(); showMember(currentMemberIdx + 1); };

    document.getElementById('intro-member-prev')?.addEventListener('click', prevHandler);
    document.getElementById('intro-member-next')?.addEventListener('click', nextHandler);
    document.getElementById('intro-member-prev-overlay')?.addEventListener('click', prevHandler);
    document.getElementById('intro-member-next-overlay')?.addEventListener('click', nextHandler);

    playToggleBtn?.addEventListener('click', () => {
      if (isPlayingCarousel) stopAutoCarousel();
      else startAutoCarousel();
    });

    document.getElementById('intro-jump-video')?.addEventListener('click', () => goToStep(2));
    document.getElementById('intro-btn-back')?.addEventListener('click', () => goToStep(currentStep - 1));
    document.getElementById('intro-btn-next')?.addEventListener('click', () => goToStep(currentStep + 1));
    document.getElementById('intro-btn-enter')?.addEventListener('click', close);
    document.getElementById('intro-btn-close-x')?.addEventListener('click', close);
    document.getElementById('intro-btn-launch-demo')?.addEventListener('click', () => {
      if (opts.standalone) {
        window.location.href = 'index.html?demo=1';
        return;
      }
      startDemo(0);
    });

    // Video controls
    if (videoEl) {
      videoEl.addEventListener('timeupdate', syncVideoHud);
      videoMuteBtn?.addEventListener('click', () => {
        videoEl.muted = !videoEl.muted;
        const icon = document.getElementById('intro-video-mute-icon');
        const lbl = document.getElementById('intro-video-mute-label');
        if (icon) icon.setAttribute('data-lucide', videoEl.muted ? 'volume-x' : 'volume-2');
        if (lbl) lbl.textContent = videoEl.muted ? (lang === 'en' ? 'Unmute Audio' : 'Activar Audio') : (lang === 'en' ? 'Mute' : 'Silenciar');
        if (global.lucide) global.lucide.createIcons();
      });
      videoReplayBtn?.addEventListener('click', () => {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {});
        syncVideoHud();
      });
      videoPlayPauseBtn?.addEventListener('click', () => {
        const icon = document.getElementById('intro-video-playpause-icon');
        if (videoEl.paused) {
          videoEl.play().catch(() => {});
          if (icon) icon.setAttribute('data-lucide', 'pause');
        } else {
          videoEl.pause();
          if (icon) icon.setAttribute('data-lucide', 'play');
        }
        if (global.lucide) global.lucide.createIcons();
      });
    }

    // ================= MOTOR DE DEMO GUIADO EN VIVO =================
    function clearDemoSubTimers() {
      demoSubTimers.forEach(id => clearTimeout(id));
      demoSubTimers = [];
    }

    function scheduleDemoSubTimer(fn, delayMs) {
      const id = window.setTimeout(() => {
        if (!demoActive) return;
        fn();
      }, delayMs);
      demoSubTimers.push(id);
      return id;
    }

    function clearDemoHighlights() {
      document.querySelectorAll('.climate-demo-highlight').forEach(el => {
        el.classList.remove('climate-demo-highlight');
      });
    }

    function highlightElements(selectors) {
      clearDemoHighlights();
      if (!Array.isArray(selectors)) return;
      let scrolledFirst = false;
      selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        el.classList.add('climate-demo-highlight');
        if (!scrolledFirst && el.closest && el.closest('#sidebar-panel')) {
          try {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            scrolledFirst = true;
          } catch (e) {}
        }
      });
    }

    function ensureSidebarOpen() {
      const sidebar = document.getElementById('sidebar-panel');
      const btnToggle = document.getElementById('btn-toggle-sidebar');
      if (sidebar && sidebar.classList.contains('hidden') && btnToggle) {
        btnToggle.click();
      }
    }

    function clickSelector(sel) {
      const el = document.querySelector(sel);
      if (el && typeof el.click === 'function') {
        el.click();
      }
    }

    function setTimelineStep(stepVal) {
      const slider = document.getElementById('timeline-slider');
      if (!slider) return;
      slider.value = String(stepVal);
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function closeGatewayPopupIfOpen() {
      const closeBtn = document.getElementById('btn-close-gateway-popup');
      if (closeBtn && typeof closeBtn.click === 'function') {
        closeBtn.click();
      }
    }

    let activeDemoGatewayId = 'quimili';

    function triggerLoraGatewayHub(hubId, attempt) {
      const tries = attempt || 0;
      activeDemoGatewayId = hubId;
      const btnLora = document.getElementById('btn-source-lora');
      if (btnLora && !btnLora.classList.contains('bg-cyan-600')) {
        btnLora.click();
      }
      const marker = document.querySelector(`.lora-marker-gateway[data-lora-node-id="${hubId}"]`)
        || document.querySelector(`[data-lora-node-id="${hubId}"]`);
      if (marker) {
        marker.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        highlightElements(['#btn-source-lora', '#lora-santiago-gateway-banner', '#telemetry-lora-panel']);
        renderDemoHud();
      } else if (tries < 12) {
        scheduleDemoSubTimer(() => triggerLoraGatewayHub(hubId, tries + 1), 220);
      } else if (typeof global.selectNode === 'function') {
        global.selectNode(hubId);
      }
    }

    const DEMO_STAGES = [
      {
        id: 'chaco-overview',
        durationMs: 7000,
        badgeEs: 'PASO 01 / 06 · TERRITORIO TRINACIONAL',
        badgeEn: 'STEP 01 / 06 · TRINATIONAL TERRITORY',
        titleEs: 'Monitoreo Gran Chaco & Serie Histórica Calibrada',
        titleEn: 'Gran Chaco Monitoring & Calibrated 30Y Series',
        descEs: 'Consolidamos Argentina, Paraguay y Bolivia en un mapa coroplético de riesgo con clasificación instantánea de sequía y exceso hídrico.',
        descEn: 'We unify Argentina, Paraguay, and Bolivia into a live risk choropleth map with instant drought and excess-water alert levels.',
        tagEs: 'Climatología 30 Años · HOY',
        tagEn: '30-Year Baseline · TODAY',
        highlights: ['#card-alert', '#card-telemetry'],
        onEnter: () => {
          ensureSidebarOpen();
          closeGatewayPopupIfOpen();
          if (typeof global.closePointInspector === 'function') global.closePointInspector();
          clickSelector('#btn-style-dark');
          clickSelector('#btn-source-baseline');
          clickSelector('.layer-btn[data-layer="spi"]');
          setTimelineStep(6);
          if (typeof global.selectNode === 'function') global.selectNode('gran_chaco');
        }
      },
      {
        id: 'nasa-satellite',
        durationMs: 7500,
        badgeEs: 'PASO 02 / 06 · TELEMETRÍA ESPACIAL NASA',
        badgeEn: 'STEP 02 / 06 · NASA SATELLITE TELEMETRY',
        titleEs: 'Capas NASA (SMAP · NDVI) sobre Imagen Satelital',
        titleEn: 'NASA Layers (SMAP · NDVI) over Satellite Imagery',
        descEs: 'Cambiando a vista Satélite, los límites del Gran Chaco siguen firmes mientras inspeccionamos humedad radicular SMAP y vigor vegetal MODIS.',
        descEn: 'Switching to Satellite basemap preserves Gran Chaco borders while inspecting NASA SMAP root-zone moisture and MODIS vegetation.',
        tagEs: 'SMAP + NDVI + Límites Activos',
        tagEn: 'SMAP + NDVI + Persistent Borders',
        highlights: ['.layer-btn[data-layer="gwetroot"]', '#btn-style-sat', '#card-telemetry'],
        onEnter: () => {
          ensureSidebarOpen();
          closeGatewayPopupIfOpen();
          if (typeof global.closePointInspector === 'function') global.closePointInspector();
          clickSelector('#btn-style-sat');
          clickSelector('.layer-btn[data-layer="gwetroot"]');
          scheduleDemoSubTimer(() => {
            clickSelector('.layer-btn[data-layer="ndvi"]');
            highlightElements(['.layer-btn[data-layer="ndvi"]', '#btn-style-sat', '#card-telemetry']);
          }, 3400);
        }
      },
      {
        id: 'gee-validation',
        durationMs: 7500,
        badgeEs: 'PASO 03 / 06 · GOOGLE EARTH ENGINE EN VIVO',
        badgeEn: 'STEP 03 / 06 · LIVE GOOGLE EARTH ENGINE',
        titleEs: 'Fusión Satelital GEE en Tiempo Real & Validación',
        titleEn: 'Real-Time GEE Satellite Fusion & Validation',
        descEs: 'Conectamos Google Earth Engine con lluvia GPM, temperatura de suelo y validación cruzada multicapa (RMSE/MAE) para calibrar cada departamento.',
        descEn: 'We integrate Google Earth Engine rainfall (GPM), land temperature, and multi-layer cross-validation (RMSE/MAE) across every department.',
        tagEs: 'GPM · SMAP · Validación IA',
        tagEn: 'GPM · SMAP · AI Validation',
        highlights: ['#btn-source-gee', '#card-telemetry', '#card-validation-metrics'],
        onEnter: () => {
          ensureSidebarOpen();
          closeGatewayPopupIfOpen();
          if (typeof global.closePointInspector === 'function') global.closePointInspector();
          clickSelector('#btn-style-dark');
          clickSelector('.layer-btn[data-layer="spi"]');
          clickSelector('#btn-source-gee');
          if (typeof global.selectNode === 'function') global.selectNode('gran_chaco');
        }
      },
      {
        id: 'point-inspector',
        durationMs: 8000,
        badgeEs: 'PASO 04 / 06 · INSPECTOR GEOESPACIAL LIBRE',
        badgeEn: 'STEP 04 / 06 · ANY-COORDINATE INSPECTOR',
        titleEs: 'Diagnóstico en Cualquier Coordenada (Dentro y Fuera)',
        titleEn: 'Inspect Any Point (Inside & Outside Gran Chaco)',
        descEs: 'Primero consultamos un lote en Quimilí y luego un punto fuera del límite del Gran Chaco: el inspector devuelve curva histórica + proyección.',
        descEn: 'First inspecting a plot in Quimilí and then a point outside the Gran Chaco border: the live inspector computes local curve + forecast.',
        tagEs: 'Click Libre en Toda la Región',
        tagEn: 'Unrestricted Spatial Querying',
        highlights: ['#map-point-inspector'],
        onEnter: () => {
          closeGatewayPopupIfOpen();
          clickSelector('#btn-source-baseline');
          if (typeof global.handleMapPointClick === 'function') {
            global.handleMapPointClick({ lng: -62.42, lat: -27.64 }, true);
          }
          scheduleDemoSubTimer(() => {
            if (typeof global.handleMapPointClick === 'function') {
              global.handleMapPointClick({ lng: -59.20, lat: -29.10 }, true);
            }
            highlightElements(['#map-point-inspector']);
          }, 3800);
        }
      },
      {
        id: 'ai-forecast-shap',
        durationMs: 8500,
        badgeEs: 'PASO 05 / 06 · IA EXPLICABLE A 6 MESES',
        badgeEn: 'STEP 05 / 06 · 6-MONTH EXPLAINABLE AI',
        titleEs: 'Proyección Cuantílica LightGBM (t+1..t+6) & SHAP',
        titleEn: 'LightGBM Quantile Forecast (t+1..t+6) & SHAP',
        descEs: 'Deslizamos la línea de tiempo futura (+2, +4 y +6 meses) con bandas p10/p50/p90 e impacto SHAP transparente por variable climática.',
        descEn: 'Scrubbing the future timeline (+2, +4, +6 months) reveals calibrated p10/p50/p90 trajectories and exact SHAP feature attributions.',
        tagEs: 'p10 / p50 / p90 · Sin Caja Negra',
        tagEn: 'p10 / p50 / p90 · Transparent AI',
        highlights: ['#card-projection-container', '#card-shap-container', '#timeline-slider'],
        onEnter: () => {
          ensureSidebarOpen();
          closeGatewayPopupIfOpen();
          if (typeof global.closePointInspector === 'function') global.closePointInspector();
          clickSelector('#btn-source-baseline');
          if (typeof global.selectNode === 'function') global.selectNode('gran_chaco');
          setTimelineStep(8);
          scheduleDemoSubTimer(() => setTimelineStep(10), 2200);
          scheduleDemoSubTimer(() => setTimelineStep(12), 4600);
        }
      },
      {
        id: 'lora-central-nodes',
        durationMs: 11000,
        badgeEs: 'PASO 06 / 06 · ARQUITECTURA LORA: CENTRAL & NODOS',
        badgeEn: 'STEP 06 / 06 · LORA ARCHITECTURE: CENTRAL & NODES',
        titleEs: 'Cómo Trabaja LoRa: Central Gateway, Nodos & Alertas',
        titleEn: 'How LoRa Works: Central Gateway, Field Nodes & Alerts',
        descEs: 'Los Nodos Solares de cada lote transmiten humedad, batería y RSSI por radio 915 MHz (hasta 15 km sin celular) hacia su Central Gateway MultiTech, que ilumina enlaces, procesa Edge offline y dispara alertas/PDF.',
        descEn: 'Solar field nodes transmit soil moisture, battery, and RSSI over 915 MHz radio (15 km without cellular) to their MultiTech Central Gateway, highlighting radio links, running Edge inference, and issuing alerts/PDF.',
        tagEs: 'Nodos Campo ➔ Central Hub ➔ Alerta',
        tagEn: 'Field Nodes ➔ Central Hub ➔ Alert',
        highlights: ['#btn-source-lora', '#lora-santiago-gateway-banner', '#telemetry-lora-panel'],
        isFinal: true,
        onEnter: () => {
          ensureSidebarOpen();
          if (typeof global.closePointInspector === 'function') global.closePointInspector();
          setTimelineStep(6);
          clickSelector('#btn-style-dark');
          clickSelector('.layer-btn[data-layer="spi"]');
          clickSelector('#btn-source-lora');
          scheduleDemoSubTimer(() => triggerLoraGatewayHub('quimili', 0), 320);
          scheduleDemoSubTimer(() => triggerLoraGatewayHub('anatuya', 0), 5400);
        }
      }
    ];

    function ensureDemoHud() {
      if (demoHudEl) return demoHudEl;
      demoHudEl = document.getElementById('climate-demo-hud');
      if (!demoHudEl) {
        demoHudEl = document.createElement('div');
        demoHudEl.id = 'climate-demo-hud';
        demoHudEl.className = 'fixed bottom-20 left-3 sm:left-4 z-[60] w-[calc(100vw-1.5rem)] max-w-md hidden rounded-2xl border border-cyan-500/45 bg-space-900/95 backdrop-blur-xl shadow-2xl p-3.5 text-slate-100';
        document.body.appendChild(demoHudEl);
      }
      return demoHudEl;
    }

    function updateDemoProgressUI() {
      if (!demoActive || !demoHudEl) return;
      const stage = DEMO_STAGES[demoStageIdx];
      const bar = demoHudEl.querySelector('#demo-hud-progress-fill');
      if (!stage || !bar) return;

      let elapsed;
      if (demoPaused) {
        elapsed = stage.durationMs - demoRemainingMs;
      } else {
        elapsed = Date.now() - demoStageStartedAt;
      }
      const pct = Math.min(100, Math.max(0, (elapsed / stage.durationMs) * 100));
      bar.style.width = `${pct}%`;

      if (!demoPaused && elapsed >= stage.durationMs) {
        if (demoStageIdx < DEMO_STAGES.length - 1) {
          goToDemoStage(demoStageIdx + 1);
        } else {
          // Pause cleanly at final stage so presenter can click PDF / Prototype or Replay
          demoPaused = true;
          demoRemainingMs = 0;
          renderDemoHud();
        }
      }
    }

    function renderDemoHud() {
      const hud = ensureDemoHud();
      const stage = DEMO_STAGES[demoStageIdx];
      if (!stage) return;

      const isEn = lang === 'en';
      const badge = isEn ? stage.badgeEn : stage.badgeEs;
      const title = isEn ? stage.titleEn : stage.titleEs;
      const desc = isEn ? stage.descEn : stage.descEs;
      const tag = isEn ? stage.tagEn : stage.tagEs;

      const pillsHtml = DEMO_STAGES.map((st, idx) => {
        const active = idx === demoStageIdx;
        const done = idx < demoStageIdx;
        const cls = active
          ? 'bg-cyan-500 text-white border-cyan-400 shadow-sm shadow-cyan-500/40 font-bold'
          : done
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'demo-hud-pill-idle bg-space-800/80 text-slate-400 border-space-700';
        return `<button type="button" data-demo-jump="${idx}" class="h-6 min-w-[26px] px-1.5 rounded-md border text-[10px] font-mono transition cursor-pointer ${cls}">${idx + 1}</button>`;
      }).join('');

      const gatewayStripHtml = stage.isFinal ? `
        <div class="mt-2.5 pt-2 border-t border-space-800/80">
          <div class="text-[9.5px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
            <span>${isEn ? 'Inspect Central Gateway -> Field Nodes:' : 'Inspeccionar Central Gateway ➔ Nodos:'}</span>
            <span class="text-cyan-400 font-semibold">4 Hubs SGO</span>
          </div>
          <div class="flex flex-wrap gap-1.5 mb-2">
            ${[
              { id: 'quimili', label: 'Quimilí' },
              { id: 'anatuya', label: 'Añatuya' },
              { id: 'bandera', label: 'Bandera' },
              { id: 'termas', label: 'Termas' }
            ].map(gw => {
              const activeGw = activeDemoGatewayId === gw.id;
              const cls = activeGw
                ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400 shadow-sm shadow-cyan-500/30 font-bold'
                : 'demo-hud-btn-idle bg-space-800/90 hover:bg-space-700 text-slate-300 border-space-700';
              return `<button type="button" data-demo-gw="${gw.id}" class="px-2 py-1 rounded-lg text-[10px] font-mono border transition flex items-center gap-1 cursor-pointer ${cls}"><span>🏭</span><span>${gw.label}</span></button>`;
            }).join('')}
          </div>
        </div>
      ` : '';

      const finalActionsHtml = stage.isFinal ? `
        ${gatewayStripHtml}
        <div class="pt-2 border-t border-space-800/80 flex flex-wrap gap-1.5">
          <button id="demo-hud-open-video" type="button" class="px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition flex items-center gap-1 cursor-pointer">
            <i data-lucide="film" class="w-3 h-3"></i>
            <span>${isEn ? 'Prototype Video' : 'Prototipo Video'}</span>
          </button>
          <button id="demo-hud-export-pdf" type="button" class="px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1 cursor-pointer">
            <i data-lucide="file-down" class="w-3 h-3"></i>
            <span>${isEn ? 'PDF Report' : 'Reporte PDF'}</span>
          </button>
          <button id="demo-hud-restart" type="button" class="demo-hud-btn-idle px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 transition flex items-center gap-1 cursor-pointer">
            <i data-lucide="rotate-ccw" class="w-3 h-3"></i>
            <span>${isEn ? 'Replay' : 'Repetir'}</span>
          </button>
        </div>
      ` : '';

      hud.innerHTML = `
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="inline-flex items-center gap-1 text-[9.5px] font-mono font-bold text-cyan-400 tracking-wider">
                <span class="w-2 h-2 rounded-full bg-emerald-400 ${demoPaused ? '' : 'animate-pulse'}"></span>
                ${badge}
              </span>
            </div>
            <h3 class="demo-hud-title text-sm font-bold text-white mt-0.5 leading-snug">${title}</h3>
          </div>
          <button id="demo-hud-close" type="button" class="demo-hud-btn-idle p-1.5 rounded-lg bg-space-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-space-700 transition shrink-0 cursor-pointer" title="${isEn ? 'Exit Demo' : 'Finalizar Demo'}">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <p class="demo-hud-desc text-[11.5px] text-slate-300 leading-relaxed mt-1.5">${desc}</p>

        <div class="mt-2 flex items-center justify-between gap-2">
          <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 font-semibold">${tag}</span>
          <div class="flex items-center gap-1">${pillsHtml}</div>
        </div>

        <div class="mt-2.5 h-1.5 w-full rounded-full bg-space-950/90 border border-space-800 overflow-hidden">
          <div id="demo-hud-progress-fill" class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-[width] duration-75" style="width: 0%"></div>
        </div>

        <div class="mt-2.5 flex items-center justify-between gap-2">
          <button id="demo-hud-prev" type="button" ${demoStageIdx === 0 ? 'disabled' : ''} class="demo-hud-btn-idle px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold bg-space-800 hover:bg-space-700 text-slate-200 border border-space-700 transition disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer">
            <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
            <span>${isEn ? 'Prev' : 'Ant.'}</span>
          </button>

          <button id="demo-hud-playpause" type="button" class="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/45 transition flex items-center gap-1.5 cursor-pointer">
            <i data-lucide="${demoPaused ? 'play' : 'pause'}" class="w-3.5 h-3.5"></i>
            <span>${demoPaused ? (isEn ? 'Resume' : 'Reanudar') : (isEn ? 'Pause' : 'Pausar')}</span>
          </button>

          ${stage.isFinal ? `
            <button id="demo-hud-finish" type="button" class="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white transition flex items-center gap-1 cursor-pointer">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              <span>${isEn ? 'Finish' : 'Finalizar'}</span>
            </button>
          ` : `
            <button id="demo-hud-next" type="button" class="px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-1 cursor-pointer">
              <span>${isEn ? 'Next' : 'Siguiente'}</span>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
          `}
        </div>
        ${finalActionsHtml}
      `;

      hud.querySelector('#demo-hud-close')?.addEventListener('click', stopDemo);
      hud.querySelector('#demo-hud-finish')?.addEventListener('click', stopDemo);
      hud.querySelector('#demo-hud-prev')?.addEventListener('click', () => goToDemoStage(demoStageIdx - 1));
      hud.querySelector('#demo-hud-next')?.addEventListener('click', () => goToDemoStage(demoStageIdx + 1));
      hud.querySelector('#demo-hud-playpause')?.addEventListener('click', toggleDemoPause);
      hud.querySelectorAll('[data-demo-jump]').forEach(btn => {
        btn.addEventListener('click', () => goToDemoStage(Number(btn.getAttribute('data-demo-jump'))));
      });
      hud.querySelectorAll('[data-demo-gw]').forEach(btn => {
        btn.addEventListener('click', () => {
          clearDemoSubTimers();
          demoPaused = true;
          const gwId = btn.getAttribute('data-demo-gw');
          if (gwId) triggerLoraGatewayHub(gwId, 0);
        });
      });
      hud.querySelector('#demo-hud-restart')?.addEventListener('click', () => goToDemoStage(0));
      hud.querySelector('#demo-hud-open-video')?.addEventListener('click', () => {
        stopDemo();
        open(2);
      });
      hud.querySelector('#demo-hud-export-pdf')?.addEventListener('click', () => {
        if (typeof global.exportCrisisReport === 'function') {
          global.exportCrisisReport();
        } else {
          clickSelector('#btn-export-report');
        }
      });

      if (global.lucide) global.lucide.createIcons();
      updateDemoProgressUI();
    }

    function goToDemoStage(idx) {
      if (!demoActive) return;
      clearDemoSubTimers();
      demoStageIdx = Math.max(0, Math.min(DEMO_STAGES.length - 1, idx));
      const stage = DEMO_STAGES[demoStageIdx];
      demoPaused = false;
      demoStageStartedAt = Date.now();
      demoRemainingMs = stage.durationMs;

      try {
        if (typeof stage.onEnter === 'function') stage.onEnter();
      } catch (err) {
        console.error('Demo stage error:', err);
      }

      highlightElements(stage.highlights);
      renderDemoHud();
    }

    function toggleDemoPause() {
      if (!demoActive) return;
      const stage = DEMO_STAGES[demoStageIdx];
      if (!stage) return;
      if (!demoPaused) {
        demoRemainingMs = Math.max(0, stage.durationMs - (Date.now() - demoStageStartedAt));
        demoPaused = true;
      } else {
        if (demoRemainingMs <= 100 && stage.isFinal) {
          goToDemoStage(0);
          return;
        }
        demoStageStartedAt = Date.now() - (stage.durationMs - demoRemainingMs);
        demoPaused = false;
      }
      renderDemoHud();
    }

    function startDemo(startIdx) {
      if (opts.standalone) {
        window.location.href = 'index.html?demo=1';
        return;
      }
      // Close intro modal if open
      stopAutoCarousel();
      if (videoEl && !videoEl.paused) videoEl.pause();
      if (opts.storageKey) {
        try { sessionStorage.setItem(opts.storageKey, '1'); } catch (e) {}
      }
      root.classList.add('hidden');
      root.classList.remove('flex');

      demoActive = true;
      const hud = ensureDemoHud();
      hud.classList.remove('hidden');
      if (demoTickTimer) clearInterval(demoTickTimer);
      demoTickTimer = window.setInterval(updateDemoProgressUI, 80);

      goToDemoStage(typeof startIdx === 'number' ? startIdx : 0);
    }

    function stopDemo() {
      demoActive = false;
      demoPaused = false;
      clearDemoSubTimers();
      if (demoTickTimer) {
        clearInterval(demoTickTimer);
        demoTickTimer = null;
      }
      clearDemoHighlights();
      if (demoHudEl) {
        demoHudEl.classList.add('hidden');
      }
    }

    // Keyboard navigation when overlay or guided demo is active
    document.addEventListener('keydown', (e) => {
      if (!root.classList.contains('hidden')) {
        if (e.key === 'Escape' && !opts.standalone) close();
        if (currentStep === 1 && e.key === 'ArrowRight') nextHandler();
        if (currentStep === 1 && e.key === 'ArrowLeft') prevHandler();
        return;
      }
      if (demoActive) {
        const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
        const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';
        if (e.key === 'Escape') stopDemo();
        else if (e.key === 'ArrowRight' && !isTyping) goToDemoStage(demoStageIdx + 1);
        else if (e.key === 'ArrowLeft' && !isTyping) goToDemoStage(demoStageIdx - 1);
        else if (e.key === ' ' && !isTyping) {
          e.preventDefault();
          toggleDemoPause();
        }
      }
    });

    // Auto-open logic
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem(opts.storageKey) === '1'; } catch (e) {}
    if (opts.standalone || (opts.autoOpen && !alreadySeen)) {
      open(1);
    }

    return {
      open,
      close,
      goToStep,
      showMember,
      setLanguage: applyLanguage,
      startDemo,
      stopDemo
    };
  }

  global.ClimateIntroShowcase = {
    init: function (options) {
      const instance = createIntroController(options);
      global.ClimateIntro = instance;
      return instance;
    }
  };
})(window);
