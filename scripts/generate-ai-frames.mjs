// Generates placeholder frames for the AI scroll experience
// (components/sections/AiScrollExperience.tsx).
//
// The frames are a line-drawn KYC verification sequence: document extraction,
// face match, watchlist screening, then a risk decision. They are stand-ins —
// replace the files in public/assets/ai-sequence/ with rendered frames (and
// update data/aiExperience.ts) when the final visuals are ready.
//
// Usage: node scripts/generate-ai-frames.mjs

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FRAME_COUNT = 96;
const OUT_DIR = join(process.cwd(), "public", "assets", "ai-sequence");

const WHITE = "#ffffff";
const BRAND = "#0353a4";
const BRAND_LIGHT = "#b9d6f2";
const ACCENT = "#f05a3c";

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (p, a, b) => ease(clamp((p - a) / (b - a)));
const lerp = (a, b, t) => a + (b - a) * t;
const f = (n) => Math.round(n * 100) / 100;

function arcPath(cx, cy, r, startDeg, endDeg) {
  const toXY = (deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [sx, sy] = toXY(startDeg);
  const [ex, ey] = toXY(endDeg);
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M${f(sx)} ${f(sy)} A${r} ${r} 0 ${large} 1 ${f(ex)} ${f(ey)}`;
}

function frame(p) {
  const out = [];

  // Phase weights
  const scan = seg(p, 0.03, 0.24);
  const face = seg(p, 0.27, 0.34);
  const match = seg(p, 0.34, 0.48);
  const faceOut = seg(p, 0.5, 0.55);
  const shrink = seg(p, 0.52, 0.62);
  const cardOut = seg(p, 0.76, 0.82);
  const rowsOut = seg(p, 0.76, 0.82);
  const gaugeIn = seg(p, 0.8, 0.86);
  const needle = seg(p, 0.84, 0.94);
  const audit = seg(p, 0.88, 1);

  // --- Identity document ---------------------------------------------------
  const cardScale = lerp(1, 0.62, shrink);
  const cardDx = lerp(0, -175, shrink);
  const cardOpacity = 1 - cardOut;
  const cx = 400;
  const cy = 400;

  const card = [];
  card.push(
    `<rect x="160" y="250" width="480" height="300" rx="22" fill="${WHITE}" fill-opacity="0.03" stroke="${WHITE}" stroke-opacity="0.55" stroke-width="2"/>`
  );

  // Portrait
  card.push(
    `<rect x="190" y="290" width="130" height="160" rx="12" fill="none" stroke="${WHITE}" stroke-opacity="0.35" stroke-width="2"/>`,
    `<circle cx="255" cy="350" r="28" fill="none" stroke="${WHITE}" stroke-opacity="0.5" stroke-width="2"/>`,
    `<path d="M207 440 C215 400 295 400 303 440" fill="none" stroke="${WHITE}" stroke-opacity="0.5" stroke-width="2"/>`
  );

  // Data fields, highlighted as the scan line passes over them
  const fieldWidths = [230, 170, 205, 140, 185];
  const scanY = lerp(262, 540, scan);
  const scanActive = scan > 0 && scan < 1;
  fieldWidths.forEach((w, k) => {
    const y = 302 + k * 34;
    const hit = scan > 0 && scanY >= y ? 1 : 0;
    const dim = lerp(1, 0.55, face);
    card.push(
      `<line x1="350" y1="${y}" x2="${350 + w}" y2="${y}" stroke="${hit ? BRAND_LIGHT : WHITE}" stroke-opacity="${f((hit ? 0.95 : 0.25) * dim)}" stroke-width="7" stroke-linecap="round"/>`
    );
    if (hit) {
      card.push(
        `<rect x="340" y="${y - 12}" width="${w + 20}" height="24" rx="6" fill="${BRAND}" fill-opacity="${f(0.22 * dim)}" stroke="${BRAND}" stroke-opacity="${f(0.9 * dim)}" stroke-width="1.5"/>`
      );
    }
  });

  // Machine-readable zone
  for (let row = 0; row < 2; row++) {
    for (let k = 0; k < 22; k++) {
      const x = 192 + k * 19.5;
      const y = 500 + row * 22;
      const hit = scan > 0 && scanY >= y ? 1 : 0;
      card.push(
        `<line x1="${f(x)}" y1="${y}" x2="${f(x + 10)}" y2="${y}" stroke="${hit ? BRAND_LIGHT : WHITE}" stroke-opacity="${hit ? 0.8 : 0.22}" stroke-width="3" stroke-linecap="round"/>`
      );
    }
  }

  // Scan line
  if (scanActive) {
    card.push(
      `<rect x="164" y="${f(Math.max(scanY - 36, 252))}" width="472" height="${f(scanY - Math.max(scanY - 36, 252))}" fill="${BRAND_LIGHT}" fill-opacity="0.07"/>`,
      `<line x1="150" y1="${f(scanY)}" x2="650" y2="${f(scanY)}" stroke="${BRAND_LIGHT}" stroke-width="2"/>`
    );
  }

  // Face-match brackets on the portrait
  if (face > 0) {
    const o = f(face * (1 - faceOut));
    const g = lerp(18, 0, face);
    const L = 18;
    const corners = [
      [180 - g, 280 - g, 1, 1],
      [330 + g, 280 - g, -1, 1],
      [180 - g, 460 + g, 1, -1],
      [330 + g, 460 + g, -1, -1],
    ];
    corners.forEach(([x, y, sx, sy]) => {
      card.push(
        `<path d="M${f(x)} ${f(y + sy * L)} L${f(x)} ${f(y)} L${f(x + sx * L)} ${f(y)}" fill="none" stroke="${BRAND_LIGHT}" stroke-opacity="${o}" stroke-width="3" stroke-linecap="round"/>`
      );
    });
    [
      [244, 344],
      [266, 344],
      [255, 356],
      [247, 366],
      [263, 366],
    ].forEach(([x, y]) => {
      card.push(`<circle cx="${x}" cy="${y}" r="2.6" fill="${BRAND_LIGHT}" fill-opacity="${o}"/>`);
    });
  }

  out.push(
    `<g opacity="${f(cardOpacity)}" transform="translate(${f(cx + cardDx)} ${cy}) scale(${f(cardScale)}) translate(${-cx} ${-cy})">${card.join("")}</g>`
  );

  // --- Live capture + match arc --------------------------------------------
  if (face > 0 && faceOut < 1) {
    const o = f(face * (1 - faceOut));
    const scx = 520;
    const scy = 140;
    out.push(
      `<g opacity="${o}">`,
      `<path d="M255 290 C255 180 380 140 ${scx - 70} ${scy}" fill="none" stroke="${BRAND_LIGHT}" stroke-opacity="0.6" stroke-width="1.5" stroke-dasharray="4 7"/>`,
      `<circle cx="${scx}" cy="${scy}" r="60" fill="${WHITE}" fill-opacity="0.03" stroke="${WHITE}" stroke-opacity="0.35" stroke-width="2"/>`,
      `<circle cx="${scx}" cy="${scy - 12}" r="18" fill="none" stroke="${WHITE}" stroke-opacity="0.5" stroke-width="2"/>`,
      `<path d="M${scx - 32} ${scy + 42} C${scx - 26} ${scy + 14} ${scx + 26} ${scy + 14} ${scx + 32} ${scy + 42}" fill="none" stroke="${WHITE}" stroke-opacity="0.5" stroke-width="2"/>`,
      `<circle cx="${scx}" cy="${scy}" r="72" fill="none" stroke="${WHITE}" stroke-opacity="0.12" stroke-width="4"/>`
    );
    if (match > 0) {
      out.push(
        `<path d="${arcPath(scx, scy, 72, 0, 346 * match)}" fill="none" stroke="${BRAND_LIGHT}" stroke-width="4" stroke-linecap="round"/>`
      );
    }
    if (match >= 1) {
      out.push(
        `<path d="M${scx + 44} ${scy + 50} l8 8 l16 -18" fill="none" stroke="${BRAND_LIGHT}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
      );
    }
    out.push(`</g>`);
  }

  // --- Watchlist screening rows --------------------------------------------
  if (shrink > 0 && rowsOut < 1) {
    const rows = 5;
    const flagged = 3;
    for (let k = 0; k < rows; k++) {
      const appear = seg(p, 0.56 + k * 0.018, 0.61 + k * 0.018);
      const checked = seg(p, 0.62 + k * 0.025, 0.64 + k * 0.025);
      if (appear <= 0) continue;
      const y = 250 + k * 64;
      const x = lerp(470, 430, appear);
      const o = f(appear * (1 - rowsOut));
      const isFlag = k === flagged;
      const status = checked > 0 ? (isFlag ? ACCENT : BRAND_LIGHT) : WHITE;
      out.push(
        `<g opacity="${o}">`,
        `<rect x="${f(x)}" y="${y}" width="280" height="46" rx="10" fill="${WHITE}" fill-opacity="${checked > 0 && isFlag ? 0.06 : 0.03}" stroke="${checked > 0 && isFlag ? ACCENT : WHITE}" stroke-opacity="${checked > 0 && isFlag ? 0.7 : 0.3}" stroke-width="1.5"/>`,
        `<line x1="${f(x + 22)}" y1="${y + 23}" x2="${f(x + 22 + [120, 150, 100, 135, 110][k])}" y2="${y + 23}" stroke="${WHITE}" stroke-opacity="0.35" stroke-width="6" stroke-linecap="round"/>`,
        `<circle cx="${f(x + 250)}" cy="${y + 23}" r="9" fill="none" stroke="${status}" stroke-opacity="${checked > 0 ? 1 : 0.35}" stroke-width="2"/>`
      );
      if (checked > 0) {
        out.push(
          isFlag
            ? `<line x1="${f(x + 250)}" y1="${y + 18}" x2="${f(x + 250)}" y2="${y + 24}" stroke="${ACCENT}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${f(x + 250)}" cy="${y + 28}" r="1.4" fill="${ACCENT}"/>`
            : `<path d="M${f(x + 245)} ${y + 23} l3.5 3.5 l6 -7" fill="none" stroke="${BRAND_LIGHT}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="${f(checked)}"/>`
        );
      }
      out.push(`</g>`);
    }

    // Connector from the shrunk document to the list
    out.push(
      `<line x1="${f(lerp(400, 375, shrink))}" y1="400" x2="425" y2="400" stroke="${BRAND_LIGHT}" stroke-opacity="${f(0.5 * shrink * (1 - rowsOut))}" stroke-width="1.5" stroke-dasharray="4 6"/>`
    );
  }

  // --- Risk decision gauge + audit trail -----------------------------------
  if (gaugeIn > 0) {
    const gx = 400;
    const gy = 440;
    const r = 180;
    const o = f(gaugeIn);
    const sweep = lerp(0, 1, gaugeIn);
    out.push(`<g opacity="${o}">`);
    out.push(
      `<path d="${arcPath(gx, gy, r, -90, -90 + 180 * sweep)}" fill="none" stroke="${WHITE}" stroke-opacity="0.12" stroke-width="18" stroke-linecap="round"/>`
    );
    const bands = [
      [-90, -32, BRAND_LIGHT],
      [-28, 28, BRAND],
      [32, 90, ACCENT],
    ];
    bands.forEach(([a, b, color]) => {
      const end = Math.min(b, -90 + 180 * sweep);
      if (end > a) {
        out.push(
          `<path d="${arcPath(gx, gy, r + 26, a, end)}" fill="none" stroke="${color}" stroke-opacity="0.85" stroke-width="3" stroke-linecap="round"/>`
        );
      }
    });
    for (let t = 0; t <= 12; t++) {
      const deg = -90 + t * 15;
      const rad = ((deg - 90) * Math.PI) / 180;
      const r1 = r - 26;
      const r2 = r - (t % 3 === 0 ? 42 : 34);
      out.push(
        `<line x1="${f(gx + r1 * Math.cos(rad))}" y1="${f(gy + r1 * Math.sin(rad))}" x2="${f(gx + r2 * Math.cos(rad))}" y2="${f(gy + r2 * Math.sin(rad))}" stroke="${WHITE}" stroke-opacity="0.3" stroke-width="2"/>`
      );
    }
    const needleDeg = lerp(-90, -52, needle);
    const nr = ((needleDeg - 90) * Math.PI) / 180;
    out.push(
      `<path d="${arcPath(gx, gy, r, -90, needleDeg)}" fill="none" stroke="${BRAND_LIGHT}" stroke-width="18" stroke-linecap="round" opacity="${f(needle)}"/>`,
      `<line x1="${gx}" y1="${gy}" x2="${f(gx + (r - 56) * Math.cos(nr))}" y2="${f(gy + (r - 56) * Math.sin(nr))}" stroke="${WHITE}" stroke-width="3" stroke-linecap="round"/>`,
      `<circle cx="${gx}" cy="${gy}" r="10" fill="#111111" stroke="${WHITE}" stroke-width="3"/>`
    );
    out.push(`</g>`);

    // Audit trail entries stack in beneath the gauge
    for (let k = 0; k < 4; k++) {
      const a = seg(audit, k * 0.2, k * 0.2 + 0.35);
      if (a <= 0) continue;
      const y = 510 + k * 40;
      out.push(
        `<g opacity="${f(a)}" transform="translate(0 ${f(lerp(12, 0, a))})">`,
        `<circle cx="250" cy="${y}" r="5" fill="${k === 3 ? BRAND_LIGHT : "none"}" stroke="${BRAND_LIGHT}" stroke-width="2"/>`,
        k < 3
          ? `<line x1="250" y1="${y + 7}" x2="250" y2="${y + 33}" stroke="${BRAND_LIGHT}" stroke-opacity="0.35" stroke-width="1.5"/>`
          : "",
        `<line x1="274" y1="${y}" x2="${274 + [220, 170, 250, 190][k]}" y2="${y}" stroke="${WHITE}" stroke-opacity="0.35" stroke-width="6" stroke-linecap="round"/>`,
        `<line x1="${520}" y1="${y}" x2="${560}" y2="${y}" stroke="${WHITE}" stroke-opacity="0.18" stroke-width="6" stroke-linecap="round"/>`,
        `</g>`
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 50 680 680" width="1200" height="1200">${out.join("")}</svg>\n`;
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

for (let i = 0; i < FRAME_COUNT; i++) {
  const p = i / (FRAME_COUNT - 1);
  const name = `frame-${String(i + 1).padStart(3, "0")}.svg`;
  writeFileSync(join(OUT_DIR, name), frame(p));
}

console.log(`Wrote ${FRAME_COUNT} frames to ${OUT_DIR}`);
