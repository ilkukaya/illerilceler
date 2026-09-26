/**
 * Generates the site's share images (Open Graph, 1200×630 JPEG) and app icons.
 *
 * Every province and district gets its own card: the real Türkiye map with the
 * province highlighted, the place name and its key TÜİK figures. Text is
 * converted to vector paths with opentype.js from the vendored OFL fonts in
 * scripts/fonts, so output is identical on any machine (no system fonts).
 *
 * Output (git-ignored, regenerated before every build):
 *   public/og/default.png, public/og/provinces/<il>.jpg,
 *   public/og/districts/<il>/<ilçe>.jpg
 *   public/icons/{apple-touch-icon,icon-192,icon-512}.png, public/favicon.ico
 *
 * Usage: npm run og:generate
 */
import sharp from "sharp";
import opentype from "opentype.js";
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { provinces } from "../src/data/provinces.ts";
import { districts } from "../src/data/districts.ts";
import { regions } from "../src/data/regions.ts";
import { provinceShapes, MAP_VIEWBOX } from "../src/data/turkeyMap.ts";

const W = 1200;
const H = 630;
const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/og");
const ICONS = path.join(ROOT, "public/icons");

const INK = "#15171C";
const PAPER = "#F7F6F2";
const LAND = "#E2DED3";
const RED = "#C8102E";

function loadFont(file: string) {
  const buf = readFileSync(path.join(ROOT, "scripts/fonts", file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

const serif = loadFont("SourceSerif4_600SemiBold.ttf");
const sansMedium = loadFont("Inter_500Medium.ttf");
const sansSemi = loadFont("Inter_600SemiBold.ttf");

const nf = new Intl.NumberFormat("tr-TR");

/** Vector text; shrinks the font size until it fits maxWidth. */
function text(
  font: opentype.Font,
  value: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  maxWidth = Infinity,
): string {
  let s = size;
  while (s > 20 && font.getAdvanceWidth(value, s) > maxWidth) s -= 2;
  return `<path d="${font.getPath(value, x, y, s).toPathData(1)}" fill="${fill}"/>`;
}

const [vbX, vbY, vbW, vbH] = MAP_VIEWBOX.split(" ").map(Number);

function mapSvg(highlight: string | null, x: number, y: number, width: number, regionColors = false) {
  const scale = width / vbW;
  const regionColor = Object.fromEntries(regions.map((r) => [r.slug, r.color]));
  const provinceRegion = Object.fromEntries(provinces.map((p) => [p.slug, p.region]));
  const paths = provinceShapes
    .map((s) => {
      const fill =
        s.slug === highlight
          ? RED
          : regionColors
            ? regionColor[provinceRegion[s.slug]] ?? LAND
            : LAND;
      return `<path d="${s.d}" fill="${fill}" stroke="${PAPER}" stroke-width="1.1" stroke-linejoin="round"/>`;
    })
    .join("");
  return `<g transform="translate(${x} ${y}) scale(${scale}) translate(${-vbX} ${-vbY})">${paths}</g>`;
}

function mapHeight(width: number) {
  return (width / vbW) * vbH;
}

function brand(x: number, y: number) {
  return `<g transform="translate(${x} ${y})">
    <rect width="40" height="40" rx="9" fill="${RED}"/>
    <circle cx="20" cy="20" r="9.4" fill="none" stroke="#fff" stroke-width="3.8"/>
    <circle cx="20" cy="20" r="3.3" fill="#fff"/>
  </g>${text(serif, "İller İlçeler", x + 54, y + 30, 30, INK)}`;
}

function card(params: {
  title: string;
  eyebrow: string;
  facts: string[];
  highlight: string | null;
  regionColors?: boolean;
}) {
  const mapW = 600;
  const mapX = W - mapW - 40;
  const mapY = (H - mapHeight(mapW)) / 2 + 20;
  const factLines = params.facts
    .map((f, i) => text(sansMedium, f, 64, 430 + i * 46, 30, INK, 520))
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${PAPER}"/>
    ${mapSvg(params.highlight, mapX, mapY, mapW, params.regionColors)}
    ${brand(64, 56)}
    ${text(sansSemi, params.eyebrow.toLocaleUpperCase("tr-TR"), 64, 222, 22, RED, 540)}
    ${text(serif, params.title, 60, 330, 104, INK, 560)}
    ${factLines}
    <rect x="0" y="${H - 10}" width="${W}" height="10" fill="${RED}"/>
  </svg>`;
}

async function render(svg: string, file: string, format: "jpg" | "png" = "jpg") {
  await mkdir(path.dirname(file), { recursive: true });
  const img = sharp(Buffer.from(svg));
  if (format === "png") await img.png({ compressionLevel: 9 }).toFile(file);
  else await img.jpeg({ quality: 80, mozjpeg: true }).toFile(file);
}

async function icons() {
  await mkdir(ICONS, { recursive: true });
  const mark = (size: number, pad = 0) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${-pad} ${32 + pad * 2} ${32 + pad * 2}">
    ${pad ? `<rect x="${-pad}" y="${-pad}" width="${32 + pad * 2}" height="${32 + pad * 2}" fill="${RED}"/>` : ""}
    <rect width="32" height="32" rx="${pad ? 0 : 7}" fill="${RED}"/>
    <circle cx="16" cy="16" r="7.5" fill="none" stroke="#fff" stroke-width="3"/>
    <circle cx="16" cy="16" r="2.6" fill="#fff"/></svg>`;
  await writeFile(path.join(ICONS, "favicon.svg"), mark(32));
  await render(mark(180, 4), path.join(ICONS, "apple-touch-icon.png"), "png");
  await render(mark(192, 4), path.join(ICONS, "icon-192.png"), "png");
  await render(mark(512, 4), path.join(ICONS, "icon-512.png"), "png");
  await render(mark(512, 8), path.join(ICONS, "icon-maskable-512.png"), "png");

  // favicon.ico with a single PNG-compressed 32×32 entry (valid ICO since Vista).
  const png = await sharp(Buffer.from(mark(32))).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6);
  header.writeUInt8(32, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  await writeFile(path.join(ROOT, "public/favicon.ico"), Buffer.concat([header, png]));
}

async function main() {
  const started = Date.now();
  await icons();

  await render(
    card({
      title: "81 il, 973 ilçe",
      eyebrow: "Türkiye bilgi rehberi",
      facts: ["Nüfus · Yüzölçümü · Plaka kodu", "Alan kodu · Harita · Mesafeler"],
      highlight: null,
      regionColors: true,
    }),
    path.join(OUT, "default.png"),
    "png",
  );

  const regionName = Object.fromEntries(regions.map((r) => [r.slug, r.name]));
  const provinceBySlug = Object.fromEntries(provinces.map((p) => [p.slug, p]));

  const jobs: (() => Promise<void>)[] = [];
  for (const p of provinces) {
    jobs.push(() =>
      render(
        card({
          title: p.name,
          eyebrow: `${regionName[p.region] ?? ""} · Plaka ${p.plateCode}`,
          facts: [
            p.population ? `Nüfus ${nf.format(p.population)}` : "",
            [p.areaKm2 ? `${nf.format(p.areaKm2)} km²` : "", p.districtCount ? `${p.districtCount} ilçe` : ""]
              .filter(Boolean)
              .join(" · "),
          ].filter(Boolean),
          highlight: p.slug,
        }),
        path.join(OUT, "provinces", `${p.slug}.jpg`),
      ),
    );
  }
  for (const d of districts) {
    const p = provinceBySlug[d.provinceSlug];
    jobs.push(() =>
      render(
        card({
          title: d.name,
          eyebrow: `${p?.name ?? ""} ilçesi`,
          facts: [
            d.population ? `Nüfus ${nf.format(d.population)}` : "",
            [d.areaKm2 ? `${nf.format(d.areaKm2)} km²` : "", d.neighborhoodCount ? `${d.neighborhoodCount} mahalle` : ""]
              .filter(Boolean)
              .join(" · "),
          ].filter(Boolean),
          highlight: d.provinceSlug,
        }),
        path.join(OUT, "districts", d.provinceSlug, `${d.slug}.jpg`),
      ),
    );
  }

  const CONCURRENCY = 8;
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < jobs.length) await jobs[next++]();
    }),
  );
  console.log(`OG images: ${jobs.length + 1} written in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
