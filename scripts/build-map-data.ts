/**
 * Builds src/data/turkeyMap.ts from the vendored province outlines.
 *
 * Source: turkey-map-react (MIT, © 2020 Erdi Gökçe) — see
 * scripts/vendor/turkey-map-react-LICENSE. The original paths are ~180 KB of
 * cubic Béziers; this script flattens them to polylines and simplifies them
 * (Ramer–Douglas–Peucker) at two detail levels so the interactive map stays
 * small enough to inline:
 *   - `d`     : detailed outline for the full-size interactive map
 *   - `dLite` : coarse outline for the small locator maps on every page
 * It also fits a linear lat/lng → SVG projection against the real province
 * centre coordinates, so districts and cities can be placed on the map.
 *
 * Run: npm run map:build (output is committed; no runtime dependency).
 */
import fs from "node:fs";
import path from "node:path";
import { cities } from "./vendor/turkey-map-react-cities.js";
import { provinces } from "../src/data/provinces.ts";

type Pt = [number, number];

function parseRings(d: string): Pt[][] {
  const tokens = d.match(/[MCLZmclz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const rings: Pt[][] = [];
  let ring: Pt[] = [];
  let cmd = "";
  let i = 0;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[MCLZmclz]/.test(t)) {
      cmd = t.toUpperCase();
      i++;
      if (cmd === "Z") {
        if (ring.length) rings.push(ring);
        ring = [];
      }
      continue;
    }
    if (cmd === "M") {
      if (ring.length) rings.push(ring);
      ring = [[num(), num()]];
      cmd = "L";
    } else if (cmd === "L") {
      ring.push([num(), num()]);
    } else if (cmd === "C") {
      const p0 = ring[ring.length - 1];
      const c1: Pt = [num(), num()];
      const c2: Pt = [num(), num()];
      const p3: Pt = [num(), num()];
      // Flatten the curve into a few points.
      for (const tt of [0.33, 0.66, 1]) {
        const u = 1 - tt;
        ring.push([
          u * u * u * p0[0] + 3 * u * u * tt * c1[0] + 3 * u * tt * tt * c2[0] + tt * tt * tt * p3[0],
          u * u * u * p0[1] + 3 * u * u * tt * c1[1] + 3 * u * tt * tt * c2[1] + tt * tt * tt * p3[1],
        ]);
      }
    } else {
      i++;
    }
  }
  if (ring.length) rings.push(ring);
  return rings;
}

function perpDist(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  if (len === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / len;
}

function rdp(points: Pt[], eps: number): Pt[] {
  if (points.length < 3) return points;
  let maxD = 0;
  let idx = 0;
  for (let k = 1; k < points.length - 1; k++) {
    const d = perpDist(points[k], points[0], points[points.length - 1]);
    if (d > maxD) {
      maxD = d;
      idx = k;
    }
  }
  if (maxD > eps) {
    const left = rdp(points.slice(0, idx + 1), eps);
    const right = rdp(points.slice(idx), eps);
    return [...left.slice(0, -1), ...right];
  }
  return [points[0], points[points.length - 1]];
}

function ringArea(r: Pt[]): number {
  let a = 0;
  for (let k = 0; k < r.length; k++) {
    const [x1, y1] = r[k];
    const [x2, y2] = r[(k + 1) % r.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

function ringCentroid(r: Pt[]): Pt {
  let cx = 0;
  let cy = 0;
  const a = ringArea(r);
  for (let k = 0; k < r.length; k++) {
    const [x1, y1] = r[k];
    const [x2, y2] = r[(k + 1) % r.length];
    const f = x1 * y2 - x2 * y1;
    cx += (x1 + x2) * f;
    cy += (y1 + y2) * f;
  }
  return [cx / (6 * a), cy / (6 * a)];
}

function toPath(rings: Pt[][], eps: number, minArea: number): string {
  return rings
    .filter((r) => Math.abs(ringArea(r)) >= minArea)
    .map((r) => {
      const s = rdp(r, eps);
      if (s.length < 3) return "";
      return (
        "M" +
        s.map(([x, y]) => `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`).join("L") +
        "Z"
      );
    })
    .join("");
}

const shapes = cities.map((c: { id: string; name: string; plateNumber: number; path: string }) => {
  const rings = parseRings(c.path);
  const main = rings.reduce((a, b) => (Math.abs(ringArea(b)) > Math.abs(ringArea(a)) ? b : a));
  const [cx, cy] = ringCentroid(main);
  const xs = rings.flat().map((p) => p[0]);
  const ys = rings.flat().map((p) => p[1]);
  return {
    slug: c.id,
    d: toPath(rings, 0.35, 2),
    dLite: toPath(rings, 1.4, 12),
    cx: Math.round(cx * 10) / 10,
    cy: Math.round(cy * 10) / 10,
    bbox: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)].map((v) =>
      Math.round(v),
    ) as [number, number, number, number],
  };
});

// Least-squares fit: x = a·lng + b, y = c·lat + d
function fit(xs: number[], ys: number[]): [number, number] {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let k = 0; k < n; k++) {
    num += (xs[k] - mx) * (ys[k] - my);
    den += (xs[k] - mx) ** 2;
  }
  const slope = num / den;
  return [slope, my - slope * mx];
}

const pairs = shapes
  .map((s) => ({ s, p: provinces.find((p) => p.slug === s.slug) }))
  .filter((x) => x.p?.coordinates);
const [ax, bx] = fit(
  pairs.map((x) => x.p!.coordinates!.lng),
  pairs.map((x) => x.s.cx),
);
const [ay, by] = fit(
  pairs.map((x) => x.p!.coordinates!.lat),
  pairs.map((x) => x.s.cy),
);

const allX = shapes.flatMap((s) => [s.bbox[0], s.bbox[2]]);
const allY = shapes.flatMap((s) => [s.bbox[1], s.bbox[3]]);
const viewBox = [
  Math.floor(Math.min(...allX)) - 4,
  Math.floor(Math.min(...allY)) - 4,
  Math.ceil(Math.max(...allX) - Math.min(...allX)) + 8,
  Math.ceil(Math.max(...allY) - Math.min(...allY)) + 8,
];

const out = `/* eslint-disable */
// GENERATED by scripts/build-map-data.ts — do not edit by hand.
// Province outlines derived from turkey-map-react (MIT License, © 2020 Erdi Gökçe).

export interface ProvinceShape {
  slug: string;
  /** Detailed outline for the full-size map. */
  d: string;
  /** Coarse outline for small locator maps. */
  dLite: string;
  /** Visual centre of the largest ring. */
  cx: number;
  cy: number;
  bbox: [number, number, number, number];
}

export const MAP_VIEWBOX = ${JSON.stringify(viewBox.join(" "))};

/** Linear lat/lng → map coordinate projection fitted to the 81 province centres. */
export function project(lat: number, lng: number): [number, number] {
  return [${ax.toFixed(5)} * lng + ${bx.toFixed(3)}, ${ay.toFixed(5)} * lat + ${by.toFixed(3)}];
}

export const provinceShapes: ProvinceShape[] = ${JSON.stringify(shapes)};

export const provinceShapeBySlug: Record<string, ProvinceShape> = Object.fromEntries(
  provinceShapes.map((s) => [s.slug, s]),
);
`;

const target = path.join(process.cwd(), "src/data/turkeyMap.ts");
fs.writeFileSync(target, out);
const sizeD = shapes.reduce((s, x) => s + x.d.length, 0);
const sizeL = shapes.reduce((s, x) => s + x.dLite.length, 0);
const residual = Math.max(
  ...pairs.map((x) => Math.hypot(ax * x.p!.coordinates!.lng + bx - x.s.cx, ay * x.p!.coordinates!.lat + by - x.s.cy)),
);
console.log(
  `turkeyMap.ts: ${shapes.length} provinces, detailed ${(sizeD / 1024).toFixed(1)} KB, lite ${(sizeL / 1024).toFixed(1)} KB, viewBox ${viewBox.join(" ")}, max projection residual ${residual.toFixed(1)}`,
);
