// Fleetana film toolkit — shared by every launch film.
// Visual identity is taken from the shipped app (app/globals.css, app/layout.tsx,
// app/kinetic-background.tsx, public/fleetana-*.svg), which is the source of truth.
// Every frame is a pure function of time so frames can be rendered in any order.

const TAU = Math.PI * 2;

// ── Tokens (app/globals.css) ────────────────────────────────────────────────
const C = {
  brand: "#2a89fa",        // --brand / --primary
  brandMuted: "#d9d9d9",   // --brand-muted
  // .dark "Deep Space"
  bg: "#0f172a", surface: "#0b1326", card: "#1e293b", card2: "#0c1426", container: "#171f33",
  border: "#334155", mkBorder: "#283248", on: "#dae2fd", onVariant: "#c1c6d6", heading: "#e7ecf7",
  muted: "#94a3b8", fg: "#f8fafc", accentDeep: "#1e3a8a", accentFg: "#dbeafe",
  gradFrom: "#0f172a", gradTo: "#060e20",
  // light marketing
  lBg: "#f7f9fb", lCard: "#ffffff", lOn: "#191c1e", lOnVariant: "#45464d", lHeading: "#000000",
  lAccent: "#0051d5", lBorder: "#e3e4e8", lContainer: "#eceef0", lFg: "#0f172a", lMuted: "#64748b",
  // semantic (used sparingly, for vehicle state / costs)
  good: "#10b981", warn: "#f59e0b", bad: "#ef4444", chart2: "#60a5fa", chart3: "#93c5fd",
};
// Semantic tokens for things the films draw (dark values; light values below)
Object.assign(C, {
  accentText: C.brand, btn: C.brand, panel: "#16213a", well: "#0b1326", wellHi: "#16213a", wellLo: "#111a2e", wellRGB: "11,19,38",
  overlay: "rgba(15,23,42,0.92)", overlayCard: "rgba(30,41,59,0.97)", track: "rgba(51,65,85,0.6)", rowLine: "rgba(51,65,85,0.6)",
  tint: "rgba(51,65,85,0.35)", inactive: "rgba(148,163,184,0.25)", shadow: "rgba(0,0,0,0.35)",
  amber: "#fbbf24", red: "#f87171", redSoft: "#fca5a5", green: "#4ade80", greenLine: "rgba(74,222,128,0.6)",
  warnBg: "#2a2110", warnText: "#fde68a", scrimRGB: "9,16,34", fadeRGB: "6,14,32", puffRGB: "203,213,225",
  road: "rgba(30,41,59,0.9)", roadDash: "rgba(148,163,184,0.35)", skyTop: "rgba(42,137,250,0.10)", skyBot: "rgba(30,41,59,0.85)",
  storyTrack: "rgba(226,232,240,0.25)", storyFill: "#ffffff",
});
// ?theme=light → the app's light tokens (:root for app UI, .marketing for the marketing surface)
const THEME = new URLSearchParams(location.search).get("theme") === "light" ? "light" : "dark";
if (THEME === "light") Object.assign(C, {
  bg: "#ffffff", surface: "#f7f9fb", card: "#ffffff", card2: "#f8fafc", container: "#eceef0",
  border: "#d9d9d9", mkBorder: "#e3e4e8", on: "#191c1e", onVariant: "#45464d", heading: "#000000",
  muted: "#64748b", fg: "#0f172a", accentDeep: "#e8f2ff", accentFg: "#1e3a8a", gradFrom: "#f7f9fb", gradTo: "#e6e8ea",
  accentText: "#0051d5", btn: "#000000", panel: "#ffffff", well: "#f1f5f9", wellHi: "#ffffff", wellLo: "#f8fafc", wellRGB: "241,245,249",
  overlay: "rgba(255,255,255,0.96)", overlayCard: "rgba(255,255,255,0.98)", track: "rgba(203,213,225,0.8)", rowLine: "rgba(217,217,217,0.9)",
  tint: "rgba(241,245,249,1)", inactive: "rgba(100,116,139,0.22)", shadow: "rgba(15,23,42,0.12)",
  amber: "#b45309", red: "#b91c1c", redSoft: "#dc2626", green: "#15803d", greenLine: "rgba(21,128,61,0.45)",
  warnBg: "#fffbeb", warnText: "#92400e", scrimRGB: "247,249,251", fadeRGB: "247,249,251", puffRGB: "100,116,139",
  road: "rgba(203,213,225,0.9)", roadDash: "rgba(255,255,255,0.95)", skyTop: "rgba(0,81,213,0.06)", skyBot: "rgba(148,163,184,0.45)",
  storyTrack: "rgba(15,23,42,0.15)", storyFill: "#0f172a",
});
const F = {
  head: '"Hanken Grotesk", sans-serif',  // marketing surface
  ui: '"Inter", sans-serif',             // app
  ar: '"IBM Plex Sans Arabic", sans-serif',
  mono: '"IBM Plex Mono", monospace',
};

// ── Math / easing ───────────────────────────────────────────────────────────
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const fract = x => x - Math.floor(x);
// cubic-bezier(0.16, 1, 0.3, 1) — the curve the landing page's hero-fade-in uses
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = t => ((ax * t + bx) * t + cx) * t, sy = t => ((ay * t + by) * t + cy) * t;
  const dx = t => (3 * ax * t + 2 * bx) * t + cx;
  return x => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x;
    for (let i = 0; i < 8; i++) { const e = sx(t) - x, d = dx(t); if (Math.abs(e) < 1e-6 || !d) break; t -= e / d; }
    return sy(clamp(t)); };
}
const E = {
  hero: bezier(0.16, 1, 0.3, 1),
  outExpo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inExpo: t => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
  inOutExpo: t => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inCubic: t => t * t * t,
  inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: t => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
};
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const hash = (i, j = 0) => { const r = rng(i * 7919 + j * 104729 + 13); r(); return r(); };
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
function mixHex(a, b, t) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
  const ch = s => Math.round(lerp((A >> s) & 255, (B >> s) & 255, t)); return `rgb(${ch(16)},${ch(8)},${ch(0)})`; }
// count-up formatting
const fmt = (n, d = 0) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

// ── Logo (public/fleetana-logo.svg — exact paths) ───────────────────────────
// The wordmark is the chevron "F" followed by the drawn letters L-E-E-T-A-N-A.
const MARK_PATHS = [
  // upper chevron and lower chevron pieces of the F (from the logo lockup)
  new Path2D("M 410.25 712.738 L 382.992 690.477 L 338.695 690.477 L 338.695 732.484 L 351.035 712.738 Z"),
  new Path2D("M 382.992 723.871 L 410.25 746.133 L 369.539 746.133 L 338.695 795.492 L 338.695 753.477 L 357.195 723.871 Z"),
];
const MARK_BOX = { x: 338.695, y: 690.469, w: 71.555, h: 105.02 };
const LETTERS = [
  [0.939, "M 7.125 0 L 7.125 -101.813 L 27.641 -101.813 L 27.641 -17.453 L 88.422 -17.453 L 88.422 0 Z"],
  [92.412, "M 7.125 0 L 7.125 -101.813 L 88.578 -101.813 L 88.578 -84.5 L 26.609 -84.5 L 26.609 -59.188 L 86.094 -59.188 L 86.094 -42.469 L 26.609 -42.469 L 26.609 -17.313 L 88.578 -17.313 L 88.578 0 Z"],
  [184.903, "M 7.125 0 L 7.125 -101.813 L 88.578 -101.813 L 88.578 -84.5 L 26.609 -84.5 L 26.609 -59.188 L 86.094 -59.188 L 86.094 -42.469 L 26.609 -42.469 L 26.609 -17.313 L 88.578 -17.313 L 88.578 0 Z"],
  [284.811, "M 38.25 0 L 38.25 -84.5 L -1.313 -84.5 L -1.313 -101.813 L 98.031 -101.813 L 98.031 -84.5 L 58.609 -84.5 L 58.609 0 Z"],
  [370.322, "M -3.344 0 L 48.578 -102.391 L 66.172 -102.391 L 117.797 0 L 95.547 0 L 83.047 -24.438 L 30.828 -24.438 L 18.328 0 Z M 39.266 -41.297 L 74.609 -41.297 L 64.422 -63.266 L 57.453 -82.031 L 49.891 -62.969 Z"],
  [488.408, "M 7.266 0 L 7.266 -101.813 L 25.313 -101.813 L 78.094 -40.578 L 89.297 -24.719 L 89.734 -24.875 L 87.984 -44.063 L 87.984 -101.813 L 107.484 -101.813 L 107.484 0 L 87.703 0 L 34.766 -62.688 L 25.891 -76.641 L 25.156 -76.5 L 27.047 -60.359 L 27.047 0 Z"],
  [605.476, "M -3.344 0 L 48.578 -102.391 L 66.172 -102.391 L 117.797 0 L 95.547 0 L 83.047 -24.438 L 30.828 -24.438 L 18.328 0 Z M 39.266 -41.297 L 74.609 -41.297 L 64.422 -63.266 L 57.453 -82.031 L 49.891 -62.969 Z"],
].map(([dx, d]) => ({ dx: 424 + dx, p: new Path2D(d) }));
const LOGO_BOX = { x: 338.695, y: 690.469, w: 1142.278 - 338.695 - 15, h: 105.02 };

// Mark: the two chevrons slide in from the left along their own diagonal, then lock.
function drawMark(ctx, cx, cy, h, color = C.brand, p = 1) {
  const s = h / MARK_BOX.h;
  ctx.save(); ctx.translate(cx - (MARK_BOX.w * s) / 2, cy - h / 2); ctx.scale(s, s); ctx.translate(-MARK_BOX.x, -MARK_BOX.y);
  ctx.fillStyle = color;
  MARK_PATHS.forEach((path, i) => {
    const k = E.hero(seg(p, i * 0.18, 0.75 + i * 0.18));
    ctx.save(); ctx.globalAlpha *= clamp(k * 1.6);
    ctx.translate(-(1 - k) * 60, (i ? 1 : -1) * (1 - k) * 18);
    ctx.fill(path); ctx.restore();
  });
  ctx.restore();
}
// Full lockup (mark + letters). x,y = left/top. Returns drawn width.
function drawLogo(ctx, x, y, h, color = C.brand, p = 1, { mark = true, letters = true } = {}) {
  const s = h / MARK_BOX.h;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-MARK_BOX.x, -MARK_BOX.y);
  ctx.fillStyle = color;
  if (mark) MARK_PATHS.forEach((path, i) => {
    const k = E.hero(seg(p, i * 0.1, 0.45 + i * 0.1));
    ctx.save(); ctx.globalAlpha *= clamp(k * 1.6); ctx.translate(-(1 - k) * 50, 0); ctx.fill(path); ctx.restore();
  });
  if (letters) LETTERS.forEach((L, i) => {
    const k = E.hero(seg(p, 0.2 + i * 0.06, 0.7 + i * 0.06));
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2.5); ctx.beginPath(); ctx.rect(L.dx - 10, 675, 140, 125); ctx.clip();
    ctx.translate(L.dx, 790.274 + (1 - k) * 110); ctx.fill(L.p); ctx.restore();
  });
  ctx.restore();
  return (LOGO_BOX.w) * s;
}
const logoWidth = h => (LOGO_BOX.w * h) / MARK_BOX.h;

// ── Kinetic background (app/kinetic-background.tsx, made deterministic) ────
// Same recipe: 135° gradient, ~150 drifting particles linked under 150px, vertical data streams.
const STREAMS = [[26.157, 48.46, 13.76, -9.23], [1.796, 30.79, 14.2, -2.65], [51.317, 62.05, 13.54, -6.55], [34.342, 29.96, 9.48, -5.96],
  [9.489, 37.65, 5.53, -8.76], [83.836, 57.3, 6.19, -4.11], [45.004, 33.07, 11.09, -0.79], [85.984, 36.23, 7.61, -4.72], [4.721, 23.47, 6.47, -9.97],
  [64.784, 32.44, 5.34, -9.65], [85.878, 52.41, 10.47, -9.52], [27.069, 54.97, 10.81, -3.96], [68.336, 47.71, 5.4, -0.81], [47.635, 62.35, 13.37, -4.75], [21.494, 57.73, 10.72, -8.47]];
const tri = x => { const f = fract(x / 2) * 2; return f < 1 ? f : 2 - f; }; // bounce, as the original reverses at the walls
function kineticBg(ctx, W, H, t, { light = THEME === "light", density = 1, alpha = 1, speed = 1 } = {}) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, light ? C.lBg : C.gradFrom); g.addColorStop(1, light ? "#e6e8ea" : C.gradTo);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (alpha <= 0) return;
  const rgb = light ? "0,81,213" : "42,137,250";
  ctx.save(); ctx.globalAlpha = alpha;
  // streams
  for (const [left, hv, dur, delay] of STREAMS) {
    const ph = fract((t * speed - delay) / dur), sh = (hv / 100) * H, y = lerp(-H, H, ph);
    const op = ph < 0.1 ? ph / 0.1 : ph > 0.9 ? (1 - ph) / 0.1 : 1;
    const sg = ctx.createLinearGradient(0, y, 0, y + sh);
    sg.addColorStop(0, `rgba(${rgb},0)`); sg.addColorStop(0.5, `rgba(${rgb},${0.22 * op})`); sg.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = sg; ctx.fillRect((left / 100) * W, y, 1.5, sh);
  }
  // particles (positions are closed-form so any frame can render alone)
  const n = Math.round(150 * density * (W * H) / (1920 * 1080)), pts = [];
  for (let i = 0; i < n; i++) {
    const vx = (hash(i, 3) - 0.5) * 1.5 * 60 * speed, vy = (hash(i, 4) - 0.5) * 1.5 * 60 * speed;
    pts.push([tri(hash(i, 1) * 2 + (vx * t) / W) * W, tri(hash(i, 2) * 2 + (vy * t) / H) * H, hash(i, 5) * 1.5 + 0.5]);
  }
  ctx.fillStyle = `rgba(${rgb},0.3)`;
  for (const p of pts) { ctx.beginPath(); ctx.arc(p[0], p[1], p[2] * 1.4, 0, TAU); ctx.fill(); }
  ctx.lineWidth = 0.8;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], d = Math.hypot(dx, dy);
    if (d < 150) { ctx.strokeStyle = `rgba(${rgb},${(0.1 - d / 1500) * 1.4})`; ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke(); }
  }
  ctx.restore();
}

// ── UI primitives (shadcn-ish cards in the app's tokens) ───────────────────
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function card(ctx, x, y, w, h, { fill = C.card, stroke = C.border, r = 14, shadow = true } = {}) {
  ctx.save();
  if (shadow) { ctx.shadowColor = C.shadow; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; }
  rr(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
  if (stroke) { rr(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
}
function pill(ctx, x, y, text, { bg = rgba(C.brand, 0.15), fg = C.brand, dot = null, size = 18, font = F.ui, align = "left" } = {}) {
  ctx.save(); ctx.font = `600 ${size}px ${font}`;
  const tw = ctx.measureText(text).width, padX = size * 0.75, dotW = dot ? size * 0.9 : 0, w = tw + padX * 2 + dotW, h = size * 1.85;
  if (align === "right") x -= w; else if (align === "center") x -= w / 2;
  rr(ctx, x, y, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
  const ar = /[\u0600-\u06FF]/.test(text);   // Arabic label: RTL run, dot on the right
  if (dot) { ctx.fillStyle = dot; ctx.beginPath(); ctx.arc(ar ? x + w - padX - size * 0.25 : x + padX + size * 0.25, y + h / 2, size * 0.25, 0, TAU); ctx.fill(); }
  ctx.fillStyle = fg; ctx.textBaseline = "middle";
  if (ar) { ctx.direction = "rtl"; ctx.textAlign = "right"; ctx.fillText(text, x + w - padX - dotW, y + h / 2 + 1); }
  else ctx.fillText(text, x + padX + dotW, y + h / 2 + 1);
  ctx.restore(); return w;
}
function text(ctx, s, x, y, { size = 32, weight = 600, font = F.head, color = C.heading, align = "left", base = "alphabetic", alpha = 1, track = 0, dir = "ltr" } = {}) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = `${weight} ${size}px ${font}`; ctx.fillStyle = color;
  ctx.textAlign = align; ctx.textBaseline = base; ctx.direction = dir; ctx.letterSpacing = `${track}px`;
  ctx.fillText(s, x, y); const w = ctx.measureText(s).width; ctx.restore(); return w;
}
// Rising line reveal (masked), the house "hero-fade-in" move made sharper for video.
function riseText(ctx, s, x, y, p, opts = {}) {
  const size = opts.size || 32, k = E.hero(clamp(p));
  ctx.save(); ctx.beginPath(); ctx.rect(-5000, y - size * 1.25, 12000, size * 1.65); ctx.clip();
  text(ctx, s, x, y + (1 - k) * size * 1.3, { ...opts, alpha: (opts.alpha ?? 1) * clamp(k * 2) });
  ctx.restore();
}
function wrapLines(ctx, s, maxW, fontStr) { ctx.save(); ctx.font = fontStr; const words = s.split(" "), out = []; let line = "";
  for (const w of words) { const tst = line ? line + " " + w : w; if (ctx.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; }
  if (line) out.push(line); ctx.restore(); return out; }

// Simple line icons (drawn, so no icon font needed)
function icon(ctx, name, x, y, s, color, lw = 2.4) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 24, s / 24); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw * 24 / s * (s / 24); ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.lineWidth = lw; const P = d => ctx.stroke(new Path2D(d));
  switch (name) {
    case "wrench": P("M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"); break;
    case "fuel": P("M3 22h12M4 9h10M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"); break;
    case "check": P("M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"); break;
    case "clipboard": P("M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6v4H9zM9 12h6M9 16h4"); break;
    case "bell": P("M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"); break;
    case "truck": P("M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"); ctx.beginPath(); ctx.arc(17, 18, 2, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(7, 18, 2, 0, TAU); ctx.stroke(); break;
    case "shield": P("M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4"); break;
    case "box": P("M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.3 7 12 12l8.7-5M12 22V12"); break;
    case "pin": P("M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"); ctx.beginPath(); ctx.arc(12, 10, 3, 0, TAU); ctx.stroke(); break;
    case "chart": P("M3 3v18h18M18 17V9M13 17V5M8 17v-3"); break;
    case "camera": P("M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"); ctx.beginPath(); ctx.arc(12, 13, 3, 0, TAU); ctx.stroke(); break;
    case "alert": P("m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01"); break;
    case "calendar": P("M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"); break;
    case "users": P("M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"); ctx.beginPath(); ctx.arc(9, 7, 4, 0, TAU); ctx.stroke(); break;
    case "download": P("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"); break;
    case "arrowDown": P("M12 5v14M19 12l-7 7-7-7"); break;
    case "arrowRight": P("M5 12h14M12 5l7 7-7 7"); break;
  }
  ctx.restore();
}

// ── Film harness ────────────────────────────────────────────────────────────
// film(cfg): cfg = {w, h, fps, dur, fonts:[...], init(), render(ctx, t, frame)}
function film(cfg) {
  const cv = document.getElementById("c"); cv.width = cfg.w; cv.height = cfg.h;
  const ctx = cv.getContext("2d");
  window.FILM = { w: cfg.w, h: cfg.h, fps: cfg.fps, frames: Math.round(cfg.dur * cfg.fps) };
  window.ready = (async () => {
    await Promise.all([
      `700 40px ${F.head}`, `800 40px ${F.head}`, `600 40px ${F.head}`, `500 40px ${F.head}`, `400 40px ${F.head}`,
      `400 40px ${F.ui}`, `500 40px ${F.ui}`, `600 40px ${F.ui}`, `700 40px ${F.ui}`,
      `400 40px ${F.ar}`, `500 40px ${F.ar}`, `600 40px ${F.ar}`, `700 40px ${F.ar}`, `500 40px ${F.mono}`,
    ].map(f => document.fonts.load(f, f.includes("Arabic") ? "مركبة" : "Aa1")));
    if (cfg.init) await cfg.init(ctx);
    return true;
  })();
  const draw = n => {
    const t = n / cfg.fps;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.direction = "ltr"; ctx.letterSpacing = "0px"; ctx.filter = "none";
    cfg.render(ctx, t, n); ctx.restore();
  };
  window.frame = n => { draw(n); return cv.toDataURL("image/png"); };
  if (!location.search.includes("render")) window.ready.then(() => {
    const audio = cfg.audio ? new Audio(cfg.audio) : null; let t0 = performance.now(), playing = false;
    const loop = () => { const s = playing && audio && !audio.paused ? audio.currentTime : ((performance.now() - t0) / 1000) % cfg.dur;
      draw(Math.min(window.FILM.frames - 1, Math.floor(s * cfg.fps))); requestAnimationFrame(loop); };
    cv.addEventListener("click", () => { if (!audio) return; audio.currentTime = 0; audio.play().then(() => (playing = true)).catch(() => {}); });
    loop();
  });
}
