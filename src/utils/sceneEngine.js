/**
 * Landmark-aware illustration engine for province/district hero art.
 *
 * Replaces generic gradient-blob placeholders with scenes built from real
 * geographic/architectural silhouettes (bridge + Maiden's Tower for the
 * Bosphorus, terraced stone houses for Mardin, fairy chimneys for
 * Cappadocia, etc.). Every location is mapped to one of a fixed set of
 * archetypes in src/data/sceneArchetypes.js — this file only holds the
 * drawing primitives and the renderer, so it stays framework-agnostic
 * (plain JS, no Astro/TS dependency) and can be previewed straight in a
 * browser or screenshot tool.
 */

export const CANVAS_W = 1600;
export const CANVAS_H = 700;

export function seededRandom(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function rng() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const n1 = (v) => Number(v.toFixed(1));

/** Smooth rolling ridge/hill silhouette from a handful of control points. */
export function ridgeShape(points, color, opacity = 1, baseline = CANVAS_H) {
  let d = `M-10,${baseline} L${n1(points[0][0])},${n1(points[0][1])} `;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1];
    const [x, y] = points[i];
    const mx = (px + x) / 2;
    d += `Q${n1(px)},${n1(py)} ${n1(mx)},${n1((py + y) / 2)} `;
    d += `Q${n1(mx)},${n1(y)} ${n1(x)},${n1(y)} `;
  }
  const last = points[points.length - 1];
  d += `L${n1(last[0])},${baseline} Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}" />`;
}

/** Jagged cliff/rock face — sharp linear segments instead of smooth curves. */
export function cliffShape(points, color, opacity = 1, baseline = CANVAS_H) {
  let d = `M-10,${baseline} `;
  for (const [x, y] of points) d += `L${n1(x)},${n1(y)} `;
  const last = points[points.length - 1];
  d += `L${n1(last[0])},${baseline} Z`;
  return `<path d="${d}" fill="${color}" opacity="${opacity}" />`;
}

export function glow(cx, cy, r, color, opacity = 0.9) {
  return (
    `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * 1.7)}" fill="${color}" opacity="${opacity * 0.18}" />` +
    `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="${color}" opacity="${opacity * 0.4}" />` +
    `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r * 0.55)}" fill="${color}" opacity="${opacity}" />`
  );
}

/** Houses stacked up a hillside, following a slope() baseline function — Mardin-style terraces. */
export function terracedHouses({ rng, count, x0, x1, slope, minH, maxH, color, roofColor }) {
  let out = "";
  const w = (x1 - x0) / count;
  for (let i = 0; i < count; i++) {
    const cw = w * (0.72 + rng() * 0.4);
    const cx = x0 + i * w + (w - cw) / 2 + (rng() - 0.5) * w * 0.15;
    const baseY = slope(cx + cw / 2);
    const ch = minH + rng() * (maxH - minH);
    const cy = baseY - ch;
    out += `<rect x="${n1(cx)}" y="${n1(cy)}" width="${n1(cw)}" height="${n1(ch + 30)}" rx="1.2" fill="${color}" />`;
    if (rng() > 0.45) {
      out += `<rect x="${n1(cx + cw * 0.15)}" y="${n1(cy + ch * 0.28)}" width="${n1(cw * 0.2)}" height="${n1(cw * 0.2)}" fill="${roofColor}" opacity="0.55" />`;
    }
    if (rng() > 0.7) {
      out += `<path d="M${n1(cx - cw * 0.06)},${n1(cy)} L${n1(cx + cw * 0.5)},${n1(cy - ch * 0.22)} L${n1(cx + cw * 1.06)},${n1(cy)} Z" fill="${roofColor}" opacity="0.85" />`;
    }
  }
  return out;
}

/** Cone-shaped fairy-chimney silhouettes. */
export function fairyChimneys({ rng, count, x0, x1, baseY, minH, maxH, color }) {
  let out = "";
  const w = (x1 - x0) / count;
  for (let i = 0; i < count; i++) {
    const cx = x0 + i * w + w / 2 + (rng() - 0.5) * w * 0.3;
    const r = w * (0.24 + rng() * 0.16);
    const h = minH + rng() * (maxH - minH);
    const capH = h * 0.22;
    out += `<path d="M${n1(cx - r)},${n1(baseY)} L${n1(cx - r * 0.32)},${n1(baseY - h + capH)} Q${n1(cx)},${n1(baseY - h)} ${n1(cx + r * 0.32)},${n1(baseY - h + capH)} L${n1(cx + r)},${n1(baseY)} Z" fill="${color}" />`;
  }
  return out;
}

/** Suspension bridge with twin pylons and fanned cables — the Bosphorus bridges. */
export function suspensionBridge({ cx, baseY, span, towerH, deckY, color, cableColor }) {
  const leftX = cx - span / 2;
  const rightX = cx + span / 2;
  let cables = "";
  const steps = 9;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = leftX + t * span;
    const sag = Math.sin(t * Math.PI) * 26;
    cables += `<line x1="${n1(x)}" y1="${n1(deckY)}" x2="${n1(leftX + (rightX - leftX) * t)}" y2="${n1(deckY - 46 - sag)}" stroke="${cableColor}" stroke-width="1.4" opacity="0.55" />`;
  }
  return (
    `<rect x="${n1(leftX - 9)}" y="${n1(baseY - towerH)}" width="18" height="${n1(towerH)}" fill="${color}" />` +
    `<rect x="${n1(rightX - 9)}" y="${n1(baseY - towerH)}" width="18" height="${n1(towerH)}" fill="${color}" />` +
    `<rect x="${n1(leftX - 16)}" y="${n1(baseY - towerH)}" width="32" height="10" fill="${color}" />` +
    `<rect x="${n1(rightX - 16)}" y="${n1(baseY - towerH)}" width="32" height="10" fill="${color}" />` +
    cables +
    `<line x1="${n1(leftX - 40)}" y1="${n1(deckY)}" x2="${n1(rightX + 40)}" y2="${n1(deckY)}" stroke="${color}" stroke-width="5" opacity="0.9" />`
  );
}

/** A round watch-tower on a small islet, connected by nothing (an island) — Maiden's Tower. */
export function isletTower({ cx, baseY, scale = 1, color }) {
  const w = 34 * scale;
  const h = 46 * scale;
  return (
    `<ellipse cx="${n1(cx)}" cy="${n1(baseY + 4)}" rx="${n1(w * 0.9)}" ry="${n1(6 * scale)}" fill="${color}" opacity="0.5" />` +
    `<rect x="${n1(cx - w / 2)}" y="${n1(baseY - h)}" width="${n1(w)}" height="${n1(h)}" fill="${color}" />` +
    `<path d="M${n1(cx - w / 2 - 4)},${n1(baseY - h)} L${n1(cx)},${n1(baseY - h - 16 * scale)} L${n1(cx + w / 2 + 4)},${n1(baseY - h)} Z" fill="${color}" />` +
    `<rect x="${n1(cx - w * 0.28)}" y="${n1(baseY - h * 0.55)}" width="${n1(w * 0.56)}" height="${n1(h * 0.28)}" fill="${color}" opacity="0.7" />`
  );
}

/** Castle / citadel block with crenellations. */
export function citadel({ x, y, w, h, teeth = 6, color }) {
  let crenel = "";
  const tw = w / (teeth * 2);
  for (let i = 0; i < teeth; i++) {
    crenel += `<rect x="${n1(x + i * tw * 2)}" y="${n1(y - 10)}" width="${n1(tw)}" height="10" fill="${color}" />`;
  }
  return (
    `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="${color}" />` +
    crenel +
    `<rect x="${n1(x + w * 0.36)}" y="${n1(y - h * 0.55)}" width="${n1(w * 0.14)}" height="${n1(h * 0.55)}" fill="${color}" />`
  );
}

/** Dome + minarets mosque silhouette. */
export function mosqueSilhouette({ cx, baseY, domeR, minaretH, minarets = 2, color }) {
  let out = `<path d="M${n1(cx - domeR)},${n1(baseY)} A${n1(domeR)},${n1(domeR)} 0 0 1 ${n1(cx + domeR)},${n1(baseY)} Z" fill="${color}" />`;
  out += `<rect x="${n1(cx - domeR * 0.7)}" y="${n1(baseY - domeR * 0.25)}" width="${n1(domeR * 1.4)}" height="${n1(domeR * 0.9)}" fill="${color}" />`;
  const gap = domeR * 2.3;
  const start = minarets === 1 ? 0 : -(minarets - 1) / 2;
  for (let i = 0; i < minarets; i++) {
    const mx = cx + (start + i) * gap;
    out += `<rect x="${n1(mx - 4)}" y="${n1(baseY - minaretH)}" width="8" height="${n1(minaretH)}" fill="${color}" />`;
    out += `<path d="M${n1(mx - 6)},${n1(baseY - minaretH)} L${n1(mx)},${n1(baseY - minaretH - 14)} L${n1(mx + 6)},${n1(baseY - minaretH)} Z" fill="${color}" />`;
  }
  return out;
}

/** Cluster of hot-air balloons drifting in the sky. */
export function balloonCluster({ rng, count, xRange, yRange, colors }) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const cx = xRange[0] + rng() * (xRange[1] - xRange[0]);
    const cy = yRange[0] + rng() * (yRange[1] - yRange[0]);
    const s = 0.5 + rng() * 0.6;
    const color = colors[i % colors.length];
    out += `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(20 * s)}" ry="${n1(26 * s)}" fill="${color}" opacity="0.88" />`;
    out += `<line x1="${n1(cx)}" y1="${n1(cy + 24 * s)}" x2="${n1(cx)}" y2="${n1(cy + 34 * s)}" stroke="${color}" stroke-width="1" opacity="0.7" />`;
    out += `<rect x="${n1(cx - 3 * s)}" y="${n1(cy + 33 * s)}" width="${n1(6 * s)}" height="${n1(5 * s)}" fill="${color}" opacity="0.8" />`;
  }
  return out;
}

/** Small ferry glyph with an optional wake — Bosphorus/Marmara coastal scenes. */
export function ferryGlyph({ x, y, scale = 1, color, wake = true }) {
  let out = `<path d="M${n1(x - 26 * scale)},${n1(y)} L${n1(x - 20 * scale)},${n1(y - 9 * scale)} L${n1(x + 20 * scale)},${n1(y - 9 * scale)} L${n1(x + 26 * scale)},${n1(y)} Z" fill="${color}" />`;
  out += `<rect x="${n1(x - 12 * scale)}" y="${n1(y - 20 * scale)}" width="${n1(24 * scale)}" height="${n1(11 * scale)}" fill="${color}" />`;
  out += `<rect x="${n1(x - 3 * scale)}" y="${n1(y - 27 * scale)}" width="${n1(4 * scale)}" height="${n1(7 * scale)}" fill="${color}" />`;
  if (wake) {
    out += `<line x1="${n1(x - 34 * scale)}" y1="${n1(y + 3 * scale)}" x2="${n1(x - 28 * scale)}" y2="${n1(y)}" stroke="${color}" stroke-width="1.4" opacity="0.4" />`;
    out += `<line x1="${n1(x + 30 * scale)}" y1="${n1(y)}" x2="${n1(x + 40 * scale)}" y2="${n1(y + 4 * scale)}" stroke="${color}" stroke-width="1.4" opacity="0.4" />`;
  }
  return out;
}

/** Simple sailboat/fishing-boat glyph for harbours and coves. */
export function boatGlyph({ x, y, scale = 1, color }) {
  return (
    `<path d="M${n1(x - 14 * scale)},${n1(y)} L${n1(x + 14 * scale)},${n1(y)} L${n1(x + 9 * scale)},${n1(y + 6 * scale)} L${n1(x - 9 * scale)},${n1(y + 6 * scale)} Z" fill="${color}" />` +
    `<line x1="${n1(x)}" y1="${n1(y)}" x2="${n1(x)}" y2="${n1(y - 18 * scale)}" stroke="${color}" stroke-width="1.4" />` +
    `<path d="M${n1(x)},${n1(y - 17 * scale)} L${n1(x + 11 * scale)},${n1(y - 2 * scale)} L${n1(x)},${n1(y - 2 * scale)} Z" fill="${color}" opacity="0.9" />`
  );
}

export function windmill({ x, y, scale = 1, color }) {
  return (
    `<path d="M${n1(x - 8 * scale)},${n1(y)} L${n1(x - 4 * scale)},${n1(y - 30 * scale)} L${n1(x + 4 * scale)},${n1(y - 30 * scale)} L${n1(x + 8 * scale)},${n1(y)} Z" fill="${color}" />` +
    `<circle cx="${n1(x)}" cy="${n1(y - 30 * scale)}" r="${n1(2.4 * scale)}" fill="${color}" />` +
    [0, 1, 2, 3]
      .map((i) => {
        const ang = (Math.PI / 2) * i + Math.PI / 5;
        const x2 = x + Math.cos(ang) * 16 * scale;
        const y2 = y - 30 * scale + Math.sin(ang) * 16 * scale;
        return `<line x1="${n1(x)}" y1="${n1(y - 30 * scale)}" x2="${n1(x2)}" y2="${n1(y2)}" stroke="${color}" stroke-width="${n1(2 * scale)}" />`;
      })
      .join("")
  );
}

export function waterBand({ y, color, highlightColor, rng }) {
  let out = `<rect x="0" y="${n1(y)}" width="${CANVAS_W}" height="${n1(CANVAS_H - y)}" fill="${color}" />`;
  const lines = 14;
  for (let i = 0; i < lines; i++) {
    const ly = y + 14 + rng() * (CANVAS_H - y - 20);
    const lw = 40 + rng() * 160;
    const lx = rng() * (CANVAS_W - lw);
    out += `<rect x="${n1(lx)}" y="${n1(ly)}" width="${n1(lw)}" height="2" fill="${highlightColor}" opacity="${n1(0.08 + rng() * 0.14)}" />`;
  }
  return out;
}

export function plainField({ y, color, rng }) {
  let out = `<rect x="0" y="${n1(y)}" width="${CANVAS_W}" height="${n1(CANVAS_H - y)}" fill="${color}" />`;
  for (let i = 0; i < 10; i++) {
    const ly = y + 10 + i * ((CANVAS_H - y - 10) / 10);
    out += `<line x1="0" y1="${n1(ly)}" x2="${CANVAS_W}" y2="${n1(ly + 6)}" stroke="#000" stroke-width="1" opacity="${n1(0.02 + rng() * 0.03)}" />`;
  }
  return out;
}

export function snowCap(cx, tipY, halfWidth, dropY, color = "#f5f7fb") {
  return `<path d="M${n1(cx - halfWidth)},${n1(dropY)} L${n1(cx)},${n1(tipY)} L${n1(cx + halfWidth)},${n1(dropY)} L${n1(cx + halfWidth * 0.4)},${n1(dropY - 10)} L${n1(cx)},${n1(dropY + 16)} L${n1(cx - halfWidth * 0.4)},${n1(dropY - 10)} Z" fill="${color}" opacity="0.92" />`;
}

/** Subtle film-grain / vignette overlay so flat vector fills read as premium editorial photography rather than a flat icon. */
export function grainOverlayDefs(uid) {
  return `
    <filter id="grain-${uid}">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.02 0" />
    </filter>
    <radialGradient id="vignette-${uid}" cx="50%" cy="40%" r="75%">
      <stop offset="55%" stop-color="#000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000" stop-opacity="0.28" />
    </radialGradient>`;
}

export function grainOverlayLayers(uid) {
  return (
    `<rect width="${CANVAS_W}" height="${CANVAS_H}" filter="url(#grain-${uid})" opacity="0.5" />` +
    `<rect width="${CANVAS_W}" height="${CANVAS_H}" fill="url(#vignette-${uid})" />`
  );
}
