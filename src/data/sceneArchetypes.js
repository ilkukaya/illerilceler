/**
 * Archetype library for LocationScene. Every province/district is mapped
 * (see locationImageOverrides.ts / locationImageManifest.ts) to one of
 * these keys. Each archetype draws a specific, real silhouette — not a
 * generic gradient — using the primitives in src/utils/sceneEngine.js.
 */
import {
  CANVAS_W,
  CANVAS_H,
  ridgeShape,
  cliffShape,
  glow,
  terracedHouses,
  fairyChimneys,
  suspensionBridge,
  isletTower,
  citadel,
  mosqueSilhouette,
  balloonCluster,
  ferryGlyph,
  boatGlyph,
  windmill,
  waterBand,
  plainField,
  snowCap,
} from "../utils/sceneEngine.js";

const COAST_Y = 470;
const INLAND_Y = 500;

export const sceneArchetypes = {
  "bosphorus-strait": {
    label: "Boğaz, köprü ve tarihi silüet",
    mood: "dusk",
    coastal: true,
    sky: ["#f5a862", "#274472"],
    build(rng) {
      const l = [];
      l.push(glow(1200, 140, 66, "#ffd39a", 0.9));
      l.push(
        ridgeShape(
          [
            [0, 442],
            [260, 428],
            [520, 438],
            [800, 424],
            [1080, 434],
            [1360, 422],
            [1600, 438],
          ],
          "#1c2b4a",
          0.55,
          COAST_Y,
        ),
      );
      l.push(mosqueSilhouette({ cx: 300, baseY: 438, domeR: 20, minaretH: 58, minarets: 2, color: "#16233f" }));
      l.push(mosqueSilhouette({ cx: 980, baseY: 434, domeR: 15, minaretH: 44, minarets: 1, color: "#16233f" }));
      l.push(waterBand({ y: COAST_Y, color: "#1b3358", highlightColor: "#ffd9a0", rng }));
      l.push(suspensionBridge({ cx: 780, baseY: 560, span: 640, towerH: 150, deckY: 498, color: "#0d1b30", cableColor: "#8fa3c2" }));
      l.push(isletTower({ cx: 1280, baseY: 566, scale: 1.15, color: "#13223d" }));
      l.push(ferryGlyph({ x: 400, y: 548, scale: 1.35, color: "#0d1b30" }));
      l.push(`<rect x="0" y="566" width="${CANVAS_W}" height="${CANVAS_H - 566}" fill="#0c1729" />`);
      return l;
    },
  },

  "bosphorus-district-ferry": {
    label: "Sahil, vapur ve kent dokusu",
    mood: "day",
    coastal: true,
    sky: ["#bfe3f6", "#4f8fc0"],
    build(rng) {
      const l = [];
      l.push(glow(280, 120, 58, "#fff6da", 0.85));
      l.push(
        terracedHouses({
          rng,
          count: 22,
          x0: 0,
          x1: CANVAS_W,
          slope: () => 452,
          minH: 40,
          maxH: 110,
          color: "#33587a",
          roofColor: "#20405c",
        }),
      );
      l.push(waterBand({ y: COAST_Y, color: "#2c6690", highlightColor: "#eaf6ff", rng }));
      l.push(ferryGlyph({ x: 720, y: 540, scale: 1.5, color: "#123049" }));
      l.push(boatGlyph({ x: 1180, y: 520, scale: 1, color: "#123049" }));
      l.push(`<rect x="0" y="562" width="${CANVAS_W}" height="${CANVAS_H - 562}" fill="#0f2436" />`);
      return l;
    },
  },

  "capital-citadel-steppe": {
    label: "Kale, anıt ve İç Anadolu bozkırı",
    mood: "afternoon",
    coastal: false,
    sky: ["#f6c177", "#7a5a8c"],
    build(rng) {
      const l = [];
      l.push(glow(1250, 130, 60, "#ffe3ab", 0.85));
      l.push(ridgeShape([[0, 420], [400, 400], [820, 415], [1200, 395], [1600, 415]], "#3a3448", 0.45, INLAND_Y));
      l.push(citadel({ x: 220, y: 360, w: 150, h: 90, teeth: 7, color: "#463c52" }));
      l.push(
        `<g fill="#4b405a">` +
          `<rect x="738" y="398" width="264" height="12" />` +
          `<rect x="754" y="384" width="232" height="14" />` +
          `<rect x="770" y="338" width="200" height="46" />` +
          `<rect x="760" y="333" width="220" height="7" />` +
          Array.from({ length: 8 })
            .map(
              (_, i) =>
                `<line x1="${783 + i * 24}" y1="340" x2="${783 + i * 24}" y2="382" stroke="#372e40" stroke-width="2" opacity="0.55" />`,
            )
            .join("") +
          `</g>`,
      );
      l.push(plainField({ y: INLAND_Y, color: "#8a7248", rng }));
      l.push(`<rect x="0" y="640" width="${CANVAS_W}" height="${CANVAS_H - 640}" fill="#5c4a30" />`);
      return l;
    },
  },

  "stone-hill-town": {
    label: "Taş teraslı yamaç kasabası ve ova",
    mood: "afternoon",
    coastal: false,
    sky: ["#f6d29a", "#c98a4e"],
    build(rng) {
      const l = [];
      l.push(glow(1300, 120, 64, "#ffe9c2", 0.9));
      l.push(plainField({ y: 470, color: "#d7ab6d", rng }));
      const slope = (x) => 470 - Math.pow(x / CANVAS_W, 1.15) * 270;
      l.push(
        terracedHouses({
          rng,
          count: 30,
          x0: 0,
          x1: CANVAS_W,
          slope,
          minH: 28,
          maxH: 66,
          color: "#b9773f",
          roofColor: "#8f5a2c",
        }),
      );
      l.push(
        terracedHouses({
          rng,
          count: 20,
          x0: 60,
          x1: CANVAS_W - 40,
          slope: (x) => slope(x) - 95,
          minH: 24,
          maxH: 52,
          color: "#a7652f",
          roofColor: "#7c4a24",
        }),
      );
      l.push(`<rect x="0" y="650" width="${CANVAS_W}" height="${CANVAS_H - 650}" fill="#7c5a34" />`);
      return l;
    },
  },

  "mesopotamian-basalt-city": {
    label: "Bazalt sur ve nehir ovası",
    mood: "afternoon",
    coastal: false,
    sky: ["#eab676", "#6d5a72"],
    build(rng) {
      const l = [];
      l.push(glow(300, 140, 58, "#ffe0ad", 0.85));
      l.push(plainField({ y: 480, color: "#c99a5c", rng }));
      l.push(citadel({ x: 260, y: 380, w: 620, h: 70, teeth: 22, color: "#2b2b30" }));
      l.push(citadel({ x: 900, y: 400, w: 260, h: 50, teeth: 9, color: "#232327" }));
      l.push(`<rect x="0" y="450" width="${CANVAS_W}" height="30" fill="#232327" opacity="0.9" />`);
      l.push(`<rect x="0" y="660" width="${CANVAS_W}" height="${CANVAS_H - 660}" fill="#5c4a30" />`);
      return l;
    },
  },

  "gap-plain-heritage": {
    label: "Höyük, kale ve verimli GAP ovası",
    mood: "afternoon",
    coastal: false,
    sky: ["#f3c98a", "#b9754b"],
    build(rng) {
      const l = [];
      l.push(glow(1280, 130, 62, "#ffe6b8", 0.88));
      l.push(ridgeShape([[0, 440], [500, 420], [1000, 435], [1600, 415]], "#c1935e", 0.4, 470));
      l.push(citadel({ x: 620, y: 388, w: 150, h: 84, teeth: 6, color: "#8a5a37" }));
      for (let i = 0; i < 8; i++) {
        const x = 140 + i * 170 + rng() * 30;
        const h = 14 + rng() * 18;
        const w = 46 + rng() * 22;
        l.push(
          `<path d="M${(x - w).toFixed(1)},472 Q${(x - w * 0.5).toFixed(1)},${(472 - h).toFixed(1)} ${x.toFixed(1)},${(472 - h).toFixed(1)} Q${(x + w * 0.5).toFixed(1)},${(472 - h).toFixed(1)} ${(x + w).toFixed(1)},472 Z" fill="#a97b4c" opacity="0.8" />`,
        );
      }
      l.push(plainField({ y: 472, color: "#cf9d5f", rng }));
      l.push(`<rect x="0" y="650" width="${CANVAS_W}" height="${CANVAS_H - 650}" fill="#8a6234" />`);
      return l;
    },
  },

  "black-sea-tea-hills": {
    label: "Yeşil çay yaylaları ve Karadeniz kıyısı",
    mood: "misty",
    coastal: true,
    sky: ["#cfe3d8", "#5c8b7a"],
    build(rng) {
      const l = [];
      l.push(ridgeShape([[0, 300], [400, 250], [900, 290], [1600, 240]], "#9fc4ae", 0.5, 420));
      l.push(ridgeShape([[0, 360], [500, 320], [1000, 355], [1600, 315]], "#6f9c81", 0.65, 440));
      l.push(
        ridgeShape(
          [[0, 400], [300, 370], [650, 405], [1000, 365], [1350, 400], [1600, 375]],
          "#437059",
          0.85,
          COAST_Y,
        ),
      );
      for (let i = 0; i < 5; i++) {
        l.push(
          `<path d="M${120 + i * 300},${418 - (i % 2) * 10} q40,-14 80,0" stroke="#2f5240" stroke-width="2" fill="none" opacity="0.3" />`,
        );
      }
      l.push(waterBand({ y: COAST_Y, color: "#2c5a6b", highlightColor: "#eaf6f2", rng }));
      l.push(boatGlyph({ x: 500, y: 520, scale: 1.1, color: "#173a3f" }));
      l.push(`<rect x="0" y="560" width="${CANVAS_W}" height="${CANVAS_H - 560}" fill="#12302c" />`);
      return l;
    },
  },

  "uludag-green-city": {
    label: "Ormanlık dağ, ulu cami ve yeşil şehir",
    mood: "afternoon",
    coastal: false,
    sky: ["#dcefd6", "#5f8f7a"],
    build(rng) {
      const l = [];
      const peak = [[0, 340], [420, 200], [700, 260], [1000, 190], [1600, 330]];
      l.push(ridgeShape(peak, "#4c7261", 0.55, 430));
      l.push(snowCap(1000, 190, 60, 250, "#f3f8f5"));
      l.push(snowCap(420, 200, 40, 250, "#f3f8f5"));
      l.push(ridgeShape([[0, 420], [500, 380], [1000, 415], [1600, 385]], "#33553f", 0.75, 470));
      l.push(mosqueSilhouette({ cx: 780, baseY: 470, domeR: 26, minaretH: 78, minarets: 4, color: "#25382c" }));
      l.push(plainField({ y: 470, color: "#3f5c46", rng }));
      l.push(`<rect x="0" y="640" width="${CANVAS_W}" height="${CANVAS_H - 640}" fill="#233827" />`);
      return l;
    },
  },

  "mediterranean-cliff-harbor": {
    label: "Akdeniz falezleri ve tarihi liman",
    mood: "day",
    coastal: true,
    sky: ["#aee4f0", "#2f8fc4"],
    build(rng) {
      const l = [];
      l.push(glow(1300, 110, 60, "#fff7dc", 0.9));
      l.push(ridgeShape([[0, 300], [500, 260], [1000, 310], [1600, 250]], "#7fb2c9", 0.4, 420));
      l.push(
        cliffShape(
          [
            [0, 420],
            [260, 380],
            [340, 460],
            [560, 400],
            [640, 470],
            [900, 410],
            [1000, 480],
            [1300, 420],
            [1600, 460],
          ],
          "#c98d5f",
          0.95,
          COAST_Y,
        ),
      );
      l.push(waterBand({ y: COAST_Y, color: "#0e93a8", highlightColor: "#eafcff", rng }));
      l.push(boatGlyph({ x: 900, y: 520, scale: 1.2, color: "#0d4a56" }));
      l.push(boatGlyph({ x: 1120, y: 535, scale: 0.8, color: "#0d4a56" }));
      l.push(`<rect x="0" y="560" width="${CANVAS_W}" height="${CANVAS_H - 560}" fill="#0a3e48" />`);
      return l;
    },
  },

  "aegean-cove-windmill": {
    label: "Ege koyu, beyaz evler ve yel değirmeni",
    mood: "day",
    coastal: true,
    sky: ["#cdeaf5", "#3d8fc2"],
    build(rng) {
      const l = [];
      l.push(glow(1260, 110, 56, "#fff8e0", 0.88));
      const slope = (x) => 430 - Math.sin(x / 260) * 20;
      l.push(
        terracedHouses({
          rng,
          count: 20,
          x0: 60,
          x1: 1200,
          slope,
          minH: 26,
          maxH: 58,
          color: "#f4f2ea",
          roofColor: "#2f6fa8",
        }),
      );
      l.push(windmill({ x: 1320, y: 430, scale: 1.3, color: "#f4f2ea" }));
      l.push(waterBand({ y: COAST_Y, color: "#1a7ca3", highlightColor: "#eafcff", rng }));
      l.push(boatGlyph({ x: 500, y: 520, scale: 1, color: "#0d4a63" }));
      l.push(`<rect x="0" y="560" width="${CANVAS_W}" height="${CANVAS_H - 560}" fill="#0c3a4d" />`);
      return l;
    },
  },

  "strait-monument": {
    label: "Çanakkale Boğazı ve şehitlik anıtı",
    mood: "dusk",
    coastal: true,
    sky: ["#f2a15c", "#2c4666"],
    build(rng) {
      const l = [];
      l.push(glow(400, 150, 64, "#ffd7a0", 0.9));
      l.push(ridgeShape([[0, 420], [500, 400], [1100, 415], [1600, 395]], "#294059", 0.5, COAST_Y));
      l.push(
        `<g fill="#152438"><rect x="1180" y="360" width="16" height="110" /><rect x="1150" y="345" width="76" height="16" /></g>`,
      );
      l.push(waterBand({ y: COAST_Y, color: "#1c3a54", highlightColor: "#ffe3ba", rng }));
      l.push(boatGlyph({ x: 700, y: 540, scale: 1.3, color: "#0e1f30" }));
      l.push(`<rect x="0" y="560" width="${CANVAS_W}" height="${CANVAS_H - 560}" fill="#0b1826" />`);
      return l;
    },
  },

  "fairy-chimney-valley": {
    label: "Peri bacaları, vadi ve sıcak hava balonları",
    mood: "dawn",
    coastal: false,
    sky: ["#f7cdd8", "#e6a2b8"],
    build(rng) {
      const l = [];
      l.push(glow(240, 160, 60, "#fff0d8", 0.85));
      l.push(balloonCluster({ rng, count: 9, xRange: [200, 1500], yRange: [60, 220], colors: ["#e8734f", "#f2b64c", "#5b8fc9", "#e2e2e2", "#c9506b"] }));
      l.push(ridgeShape([[0, 430], [500, 400], [1000, 435], [1600, 405]], "#d9b98a", 0.5, 470));
      l.push(fairyChimneys({ rng, count: 16, x0: 40, x1: 1560, baseY: 470, minH: 50, maxH: 130, color: "#c99a68" }));
      l.push(plainField({ y: 470, color: "#e0bd8a", rng }));
      l.push(`<rect x="0" y="640" width="${CANVAS_W}" height="${CANVAS_H - 640}" fill="#a9865a" />`);
      return l;
    },
  },

  "anatolian-plain-castle": {
    label: "Tahıl ovası, kale ve kubbeli merkez",
    mood: "afternoon",
    coastal: false,
    sky: ["#f4d089", "#c98a4e"],
    build(rng) {
      const l = [];
      l.push(glow(1250, 130, 60, "#ffe9bd", 0.88));
      l.push(ridgeShape([[0, 430], [400, 410], [900, 425], [1600, 405]], "#c79a5e", 0.35, 470));
      l.push(citadel({ x: 200, y: 380, w: 130, h: 88, teeth: 6, color: "#8f6a3d" }));
      l.push(mosqueSilhouette({ cx: 820, baseY: 470, domeR: 28, minaretH: 82, minarets: 2, color: "#6d5030" }));
      l.push(plainField({ y: 470, color: "#dcb578", rng }));
      l.push(
        terracedHouses({ rng, count: 12, x0: 370, x1: 730, slope: () => 470, minH: 16, maxH: 32, color: "#a5824c", roofColor: "#7c5c34" }),
      );
      l.push(
        terracedHouses({ rng, count: 9, x0: 920, x1: 1180, slope: () => 470, minH: 15, maxH: 28, color: "#a5824c", roofColor: "#7c5c34" }),
      );
      l.push(`<rect x="0" y="640" width="${CANVAS_W}" height="${CANVAS_H - 640}" fill="#8a6a3c" />`);
      return l;
    },
  },

  "lake-shore": {
    label: "Göl kıyısı, ada ve kar zirvesi",
    mood: "day",
    coastal: false,
    sky: ["#bfe0ee", "#4a7ea3"],
    build(rng) {
      const l = [];
      l.push(ridgeShape([[0, 330], [500, 210], [900, 300], [1600, 260]], "#7a9db5", 0.5, 420));
      l.push(snowCap(500, 210, 70, 270, "#f6f9fb"));
      l.push(waterBand({ y: 440, color: "#2f6f92", highlightColor: "#eaf6ff", rng }));
      l.push(isletTower({ cx: 1100, baseY: 520, scale: 0.9, color: "#1e4258" }));
      l.push(`<rect x="1050" y="505" width="110" height="18" rx="3" fill="#1e4258" opacity="0.85" />`);
      l.push(`<rect x="0" y="560" width="${CANVAS_W}" height="${CANVAS_H - 560}" fill="#123244" />`);
      return l;
    },
  },

  "eastern-highland-peak": {
    label: "Karlı doruk ve yüksek yayla",
    mood: "crisp",
    coastal: false,
    sky: ["#cfe6f5", "#3f6fa0"],
    build(rng) {
      const l = [];
      l.push(ridgeShape([[0, 360], [420, 150], [820, 300], [1200, 190], [1600, 340]], "#7690ac", 0.55, 470));
      l.push(snowCap(420, 150, 90, 230, "#ffffff"));
      l.push(snowCap(1200, 190, 70, 250, "#ffffff"));
      l.push(plainField({ y: 470, color: "#93998f", rng }));
      l.push(`<rect x="0" y="640" width="${CANVAS_W}" height="${CANVAS_H - 640}" fill="#5c645c" />`);
      return l;
    },
  },

  "central-steppe-salt": {
    label: "Tuz gölü düzlüğü ve volkanik koni",
    mood: "day",
    coastal: false,
    sky: ["#f7e7ea", "#bcd3e6"],
    build(rng) {
      const l = [];
      l.push(ridgeShape([[600, 340], [820, 230], [1040, 340]], "#c19a8f", 0.6, 460));
      l.push(snowCap(820, 230, 50, 290, "#f7f4f2"));
      l.push(`<rect x="0" y="460" width="${CANVAS_W}" height="${CANVAS_H - 460}" fill="#f3dfe2" />`);
      for (let i = 0; i < 16; i++) {
        const x = rng() * CANVAS_W;
        const y = 470 + rng() * 180;
        l.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(60 + rng() * 90).toFixed(1)}" ry="${(6 + rng() * 8).toFixed(1)}" fill="#e7c9ce" opacity="0.5" />`);
      }
      return l;
    },
  },

  "industrial-port-bay": {
    label: "Liman körfezi, vinçler ve modern silüet",
    mood: "day",
    coastal: true,
    sky: ["#bfe3f0", "#3f7fb0"],
    build(rng) {
      const l = [];
      l.push(
        terracedHouses({
          rng,
          count: 18,
          x0: 0,
          x1: CANVAS_W,
          slope: () => 440,
          minH: 50,
          maxH: 150,
          color: "#3a5068",
          roofColor: "#243448",
        }),
      );
      for (let i = 0; i < 4; i++) {
        const x = 200 + i * 340;
        l.push(`<line x1="${x}" y1="450" x2="${x}" y2="400" stroke="#25384c" stroke-width="4" />`);
        l.push(`<line x1="${x - 40}" y1="404" x2="${x + 40}" y2="404" stroke="#25384c" stroke-width="4" />`);
      }
      l.push(waterBand({ y: COAST_Y, color: "#255a80", highlightColor: "#eaf6ff", rng }));
      l.push(ferryGlyph({ x: 900, y: 530, scale: 1.2, color: "#12293c" }));
      l.push(`<rect x="0" y="560" width="${CANVAS_W}" height="${CANVAS_H - 560}" fill="#0e2233" />`);
      return l;
    },
  },

  "marmara-green-plain": {
    label: "Yeşil tarım ovası ve cami silueti",
    mood: "afternoon",
    coastal: false,
    sky: ["#dcecd7", "#6f9bb0"],
    build(rng) {
      const l = [];
      l.push(ridgeShape([[0, 420], [500, 395], [1000, 418], [1600, 400]], "#7fa583", 0.4, 470));
      l.push(mosqueSilhouette({ cx: 700, baseY: 470, domeR: 20, minaretH: 56, minarets: 1, color: "#4c5f45" }));
      l.push(plainField({ y: 470, color: "#8fae6c", rng }));
      l.push(
        terracedHouses({ rng, count: 9, x0: 940, x1: 1220, slope: () => 470, minH: 15, maxH: 28, color: "#5c6f48", roofColor: "#3f4f34" }),
      );
      for (let i = 0; i < 13; i++) {
        const x = 40 + i * 128 + rng() * 40;
        const r = 9 + rng() * 9;
        const y = 458 + rng() * 12;
        l.push(`<circle cx="${x.toFixed(1)}" cy="${(y - r * 0.6).toFixed(1)}" r="${r.toFixed(1)}" fill="#4c5f3c" opacity="0.82" />`);
      }
      l.push(`<rect x="0" y="640" width="${CANVAS_W}" height="${CANVAS_H - 640}" fill="#5c7048" />`);
      return l;
    },
  },

  "travertine-terraces": {
    label: "Pamukkale traverten terasları",
    mood: "day",
    coastal: false,
    sky: ["#eaf6f7", "#8fc9d6"],
    build(rng) {
      const l = [];
      l.push(glow(1300, 120, 58, "#fff9e8", 0.85));
      l.push(ridgeShape([[0, 380], [400, 358], [900, 385], [1600, 352]], "#cfe4e2", 0.35, 470));
      for (let i = 0; i < 5; i++) {
        const x = 300 + i * 46;
        l.push(`<rect x="${x}" y="352" width="10" height="${34 + (i % 2) * 10}" fill="#d8cdb8" opacity="0.85" />`);
      }
      let y = 402;
      const stepW = 1420;
      const x0 = 90;
      const steps = 8;
      for (let i = 0; i < steps; i++) {
        const h = 24 + rng() * 8;
        const inset = (i / steps) * 260;
        l.push(
          `<path d="M${(x0 + inset).toFixed(1)},${y.toFixed(1)} L${(x0 + stepW - inset).toFixed(1)},${y.toFixed(1)} L${(x0 + stepW - inset - 40).toFixed(1)},${(y + h).toFixed(1)} L${(x0 + inset + 40).toFixed(1)},${(y + h).toFixed(1)} Z" fill="${i % 2 === 0 ? "#eef6f3" : "#dcecec"}" opacity="0.96" />`,
        );
        l.push(
          `<path d="M${(x0 + inset).toFixed(1)},${y.toFixed(1)} L${(x0 + stepW - inset).toFixed(1)},${y.toFixed(1)} L${(x0 + stepW - inset - 6).toFixed(1)},${(y + 5).toFixed(1)} L${(x0 + inset + 6).toFixed(1)},${(y + 5).toFixed(1)} Z" fill="#bfe0df" opacity="0.6" />`,
        );
        y += h;
      }
      l.push(`<rect x="0" y="${y.toFixed(1)}" width="${CANVAS_W}" height="${(CANVAS_H - y).toFixed(1)}" fill="#cfe8e6" />`);
      return l;
    },
  },
};

export const archetypeKeys = Object.keys(sceneArchetypes);
