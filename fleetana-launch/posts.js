// Fleetana social posts — Instagram feed (1080×1350), reel covers (1080×1920), LinkedIn document pages.
// Always light theme. Same toolkit and ground rules as the films: every claim maps to shipped code.
// posts.html?post=ig2&slide=3&lang=ar
const QP = new URLSearchParams(location.search);
const POST = QP.get("post") || "ig2", SLIDE = +(QP.get("slide") || 1);
const HF = RTL ? F.ar : F.head, DIR = RTL ? "rtl" : "ltr";
const BG_WHITE = "#f7f9fb", BG_TINT = "#e8f2ff";   // marketing bg / app accent (light tokens)
let W = 1080, H = 1350;
const X = x => (RTL ? W - x : x);
const AL = a => (RTL ? (a === "left" ? "right" : a === "right" ? "left" : a) : a);
const P = S.posts;

// ── shared furniture ────────────────────────────────────────────────────────
function base(ctx, bg) {
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // the landing page's particle network, very quiet, for texture
  ctx.save(); ctx.globalAlpha = 0.55; kineticBgParticles(ctx); ctx.restore();
}
function kineticBgParticles(ctx) {
  const pts = []; for (let i = 0; i < 70; i++) pts.push([hash(i, 1) * W, hash(i, 2) * H, hash(i, 5) * 1.5 + 0.8]);
  ctx.fillStyle = "rgba(0,81,213,0.22)"; pts.forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], p[2] * 1.4, 0, TAU); ctx.fill(); });
  ctx.lineWidth = 1;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
    if (d < 170) { ctx.strokeStyle = `rgba(0,81,213,${0.12 - d / 1500})`; ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke(); }
  }
}
function brandBar(ctx, { slide = 0, total = 0, y = 92 } = {}) {
  const lh = 30, lw = logoWidth(lh);
  drawLogo(ctx, RTL ? W - 80 - lw : 80, y - lh / 2, lh, C.brand, 1);   // lockup top-left (LTR) / top-right (RTL), never mirrored
  if (total) text(ctx, `${slide} / ${total}`, RTL ? 80 : W - 80, y + 9, { size: 24, weight: 600, font: F.mono, color: C.muted, align: RTL ? "left" : "right" });
}
function footer(ctx, { swipe = false } = {}) {
  text(ctx, S.url, X(80), H - 72, { size: 26, weight: 600, font: F.ui, color: C.muted, align: AL("left") });
  if (swipe) {
    const x = RTL ? 80 : W - 80;
    text(ctx, P.swipe, RTL ? x + 44 : x - 44, H - 72, { size: 26, weight: 600, font: RTL ? F.ar : F.ui, color: C.accentText, align: RTL ? "left" : "right", dir: DIR });
    ctx.save(); ctx.translate(x, H - 81); if (RTL) ctx.scale(-1, 1); icon(ctx, "arrowRight", -32, -16, 32, C.accentText, 2.6); ctx.restore();
  }
}
// headline block: lines, accent lines in brand accent text colour. Returns y after block.
function headline(ctx, lines, y, { size = 84, accent = [1], align = "left", maxW = 920, x = null } = {}) {
  ctx.font = `700 ${size}px ${HF}`;
  const fs = Math.min(size, size * maxW / Math.max(...lines.map(l => ctx.measureText(l).width)));
  const ax = x ?? (align === "center" ? W / 2 : X(80));
  lines.forEach((l, i) => text(ctx, l, ax, y + i * fs * 1.14, { size: fs, weight: 700, font: HF, color: accent.includes(i) ? C.accentText : C.heading, align: align === "center" ? "center" : AL("left"), dir: DIR, track: RTL ? 0 : -1.5 }));
  return y + (lines.length - 1) * fs * 1.14 + fs * 0.5;
}
function eyebrow(ctx, label, iconName, y) {
  const x = X(80);
  icon(ctx, iconName, RTL ? x - 36 : x, y - 28, 36, C.accentText, 2.2);
  text(ctx, label, RTL ? x - 52 : x + 52, y, { size: 30, weight: 600, font: RTL ? F.ar : F.ui, color: C.accentText, align: AL("left"), dir: DIR });
}
function body(ctx, s, y, { size = 34, color = C.onVariant, maxW = 900, x = null, align = "left" } = {}) {
  const fnt = `500 ${size}px ${RTL ? F.ar : F.ui}`, lines = s.split("\n").flatMap(p => wrapLines(ctx, p, maxW, fnt));
  lines.forEach((l, i) => text(ctx, l, x ?? (align === "center" ? W / 2 : X(80)), y + i * size * (RTL ? 1.6 : 1.4), { size, weight: 500, font: RTL ? F.ar : F.ui, color, align: align === "center" ? "center" : AL("left"), dir: DIR }));
  return y + lines.length * size * (RTL ? 1.6 : 1.4);
}
// draw a UI block at scale s with its top-left at (x, y) in a w-wide design box
function scaled(ctx, x, y, s, fn) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); fn(); ctx.restore(); }
const box = (w, extra = {}) => ({ x: 0, y: 0, w, rtl: RTL, ...extra });
function trackerTag(ctx, y) { statusPill(ctx, X(80), y, S.f1.tracker, "info", { size: 28, rtl: RTL }); }

// ── UI blocks (same data as the films) ─────────────────────────────────────
function vehiclesCard(ctx, w, rows = 5, drivers = false) {
  const st = [S.active, S.active, S.inShop, S.active, S.outOfService], kinds = ["good", "good", "warn", "good", "muted"];
  const dates = ["12/03/2027", "02/11/2026", "18/01/2027", "27/06/2027", "09/11/2026"];
  card(ctx, 0, -20, w, 74 * rows + 90, { fill: "#fff", r: 18 });
  table(ctx, box(w), [
    { key: "v", label: S.colVehicle, w: w * 0.27, bold: true }, { key: "p", label: S.colPlate, w: w * 0.23, mono: true },
    drivers ? { key: "d", label: S.colDriver, w: w * 0.28 } : { key: "s", label: S.colStatus, w: w * 0.28 },
    { key: "i", label: S.colIstimara, w: w * 0.2, num: true, color: C.onVariant },
  ], FLEET.slice(0, rows).map((f, i) => ({ v: f.model.replace("Toyota ", ""), p: f.plate, d: S.drivers[i], i: dates[i], s: (c, x, y) => statusPill(c, x, y + 8, st[i], kinds[i], { size: 16, rtl: RTL }) })), { rowH: 74 });
}
function remindersCard(ctx, w) {
  const rows = [
    { v: FLEET[0].model.replace("Toyota ", ""), k: S.tasks[0], due: "90,000 km", s: ["overdue", "bad"] },
    { v: FLEET[2].model, k: S.tasks[1], due: "1,200 h", s: ["overdue", "bad"] },
    { v: FLEET[1].model.replace("Toyota ", ""), k: S.tasks[2], due: "01/11/2026", s: ["dueSoon", "warn"] },
    { v: FLEET[5].model.replace("Toyota ", ""), k: S.tasks[3], due: "110,000 km", s: ["upcoming", "muted"] },
  ];
  table(ctx, box(w), [
    { key: "v", label: S.colVehicle, w: w * 0.26, bold: true }, { key: "k", label: S.colTask, w: w * 0.3 },
    { key: "due", label: S.colDueAt, w: w * 0.2, num: true }, { key: "s", label: S.colStatus, w: w * 0.22 },
  ], rows.map(r => ({ ...r, s: (c, x, y) => statusPill(c, x, y + 8, S[r.s[0]], r.s[1], { size: 16, rtl: RTL }) })), { rowH: 80 });
}
function fuelCard(ctx, w) {
  const rows = [["21 Oct", FLEET[0].plate, "62.0 L", "9.4 km/L"], ["20 Oct", FLEET[1].plate, "62.0 L", "5.9 km/L", true], ["19 Oct", FLEET[3].plate, "58.0 L", "9.6 km/L"]];
  table(ctx, box(w), [
    { key: "d", label: S.colDate, w: w * 0.18, num: true }, { key: "p", label: S.colPlate, w: w * 0.26, mono: true },
    { key: "l", label: S.colVolume, w: w * 0.18, num: true }, { key: "e", label: S.colEconomy, w: w * 0.36 },
  ], rows.map(r => ({ d: r[0], p: r[1], l: r[2],
    e: (c, x, y) => { const tw = text(c, r[3], x, y + 7, { size: 20, weight: 700, font: F.ui, color: r[4] ? C.amber : C.fg, align: AL("left") });
      if (r[4]) statusPill(c, RTL ? x - tw - 12 : x + tw + 12, y + 8, S.low, "warn", { size: 16, rtl: RTL, dot: false }); } })),
  { rowH: 80, highlight: 1, hlColor: C.warn, hlP: 1 });
}
function inspectionCard(ctx, w) {
  S.inspItems.slice(0, 3).forEach((it, i) => {
    const y = i * 84, b = box(w, { y });
    card(ctx, 0, y, w, 70, { fill: "#fff", r: 12, shadow: false });
    bt(ctx, b, it, 24, 44, { size: 22, weight: 600, color: C.fg });
    const fail = i === 1, lbl = fail ? S.fail : S.pass, kind = fail ? "bad" : "good";
    ctx.font = `700 20px ${RTL ? F.ar : F.ui}`; const pw = ctx.measureText(lbl).width + 40, px = RTL ? 20 : w - 20 - pw;
    rr(ctx, px, y + 14, pw, 42, 10); ctx.fillStyle = PILLS[kind].dot; ctx.fill();
    text(ctx, lbl, px + pw / 2, y + 42, { size: 20, weight: 700, font: RTL ? F.ar : F.ui, color: "#fff", align: "center", dir: DIR });
    if (fail) bt(ctx, b, "— " + S.failNote, RTL ? 200 : 210, 44, { size: 18, weight: 500, color: C.redSoft });
  });
  toast(ctx, box(w, { y: 270, h: 104 }), S.issuesRaised, `${S.failNote} · ${S.issueOpen}`, "bad", 1);
}
function docCardS(ctx, x, y, w, h, title, sub, date, n, back) {
  h = back ? h : Math.min(h, 270);
  card(ctx, x, y, w, h, { fill: "#fff", r: 20 });
  const b = { x, y, w, rtl: RTL };
  ctx.fillStyle = C.brand; ctx.fillRect(RTL ? x + w - 10 : x, y + 24, 10, 60);
  bt(ctx, b, title, 40, 66, { size: 40, weight: 700, color: C.fg });
  statusPill(ctx, bx(b, w - 36), y + (back ? 58 : h - 46), S.inDays(n), n <= 14 ? "bad" : "warn", { size: 22, rtl: RTL, align: "right" });
  if (back) return;
  bn(ctx, b, sub, 40, 110, { size: 22, weight: 500, color: C.muted });
  bt(ctx, b, S.expiringSoon, 40, h - 78, { size: 20, weight: 500, color: C.muted });
  bn(ctx, b, date, 40, h - 36, { size: 34, weight: 600, color: C.fg, font: F.mono });
}
function fuelChart(ctx, w, h, { threshold = true, values = [9.4, 9.0, 9.3, 9.1, 5.9] } = {}) {
  card(ctx, 0, 0, w, h, { fill: "#fff", r: 20 });
  const b = box(w);
  bn(ctx, b, `${FLEET[1].model} · ${FLEET[1].plate}`, 36, 58, { size: 26, weight: 700, color: C.fg });
  bt(ctx, b, `${S.colEconomy} · ${S.u.kmL}`, 36, 94, { size: 20, weight: 500, color: C.muted });
  const avg = 9.2, thr = avg * 0.7, top = 150, bot = h - 60, sc = (bot - top) / 11, gutter = 150, cw = (w - 100 - gutter - 4 * 22) / 5;
  const ly = v => bot - v * sc;
  ctx.strokeStyle = "rgba(100,116,139,0.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(RTL ? gutter + 30 : 30, ly(avg)); ctx.lineTo(RTL ? w - 30 : w - 30 - gutter, ly(avg)); ctx.stroke();
  bt(ctx, b, `${S.u.avg} 9.2`, w - 30, ly(avg) + 7, { size: 20, weight: 600, color: C.onVariant, align: "right", font: RTL ? F.ar : F.mono });
  if (threshold) {
    ctx.strokeStyle = "#f59e0b"; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(RTL ? gutter + 30 : 30, ly(thr)); ctx.lineTo(RTL ? w - 30 : w - 30 - gutter, ly(thr)); ctx.stroke(); ctx.setLineDash([]);
    bt(ctx, b, `${S.u.thr} 6.4`, w - 30, ly(thr) + 7, { size: 20, weight: 600, color: C.amber, align: "right", font: RTL ? F.ar : F.mono });
  }
  values.forEach((v, i) => {
    const x = RTL ? w - 50 - cw - i * (cw + 22) : 50 + i * (cw + 22), hh = v * sc, low = threshold && v < thr, last = i === values.length - 1;
    ctx.fillStyle = low ? "#D97706" : last ? C.brand : "rgba(42,137,250,0.35)"; rr(ctx, x, bot - hh, cw, hh, 8); ctx.fill();
    text(ctx, v.toFixed(1), x + cw / 2, bot - hh - 14, { size: 24, weight: 700, font: F.ui, color: low ? C.amber : C.fg, align: "center" });
    if (low) statusPill(ctx, x + cw / 2, bot - hh - 58, S.low, "warn", { size: 18, rtl: RTL, align: "center", dot: false });
  });
  ctx.fillStyle = C.border; ctx.fillRect(30, bot, w - 60, 2);
}
function skylineS(ctx, gy, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createLinearGradient(0, gy - 340, 0, gy); g.addColorStop(0, "rgba(0,81,213,0.05)"); g.addColorStop(1, "rgba(148,163,184,0.45)"); ctx.fillStyle = g;
  [[30, 80, 110], [120, 60, 170], [190, 100, 80], [700, 70, 150], [780, 110, 100], [900, 70, 200], [980, 100, 130]].forEach(([x, w, h]) => ctx.fillRect(x, gy - h, w, h));
  const kx = 580, kw = 150, kh = 330;
  ctx.beginPath(); ctx.moveTo(kx - kw / 2, gy); ctx.lineTo(kx - kw * 0.36, gy - kh); ctx.lineTo(kx + kw * 0.36, gy - kh); ctx.lineTo(kx + kw / 2, gy); ctx.closePath();
  ctx.moveTo(kx - kw * 0.28, gy - kh - 1); ctx.quadraticCurveTo(kx, gy - kh * 0.28, kx + kw * 0.28, gy - kh - 1); ctx.closePath(); ctx.fill("evenodd");
  ctx.fillRect(kx - kw * 0.2, gy - kh * 0.66, kw * 0.4, 8);
  const fx = 370, fh = 290;
  ctx.beginPath(); ctx.moveTo(fx - 70, gy); ctx.lineTo(fx - 8, gy - fh); ctx.lineTo(fx + 8, gy - fh); ctx.lineTo(fx + 70, gy); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(42,137,250,0.35)"; ctx.beginPath(); ctx.arc(fx, gy - fh * 0.62, 20, 0, TAU); ctx.fill();
  ctx.restore();
}
function driverCard(ctx, w) {
  card(ctx, 0, 0, w, 330, { fill: "#fff", r: 20 });
  const b = box(w);
  bt(ctx, b, S.driverPerf, 32, 56, { size: 28, weight: 700, color: C.fg });
  [[S.drivers[0], 94, S.excellent, "good"], [S.drivers[1], 81, S.good, "info"], [S.drivers[2], 63, S.fair, "warn"]].forEach(([n, sc, band, kind], i) => {
    const y = 96 + i * 76;
    bt(ctx, b, n, 32, y + 30, { size: 24, weight: 600, color: C.fg });
    bn(ctx, b, String(sc), w * 0.62, y + 32, { size: 34, weight: 700, color: C.fg, align: "right" });
    statusPill(ctx, bx(b, w - 32), y + 22, band, kind, { size: 22, rtl: RTL, align: "right", dot: false });
    ctx.fillStyle = C.track; ctx.fillRect(32, y + 50, w - 64, 6);
    ctx.fillStyle = PILLS[kind].dot; const bw = (w - 64) * sc / 100; ctx.fillRect(RTL ? w - 32 - bw : 32, y + 50, bw, 6);
  });
}

// ── posts ───────────────────────────────────────────────────────────────────
const POSTS = {
  // IG 1 — reel cover (reel = fleetana-film3-*-light.mp4). Title kept inside the 3:4 grid crop (y 240–1680).
  ig1cover: { w: 1080, h: 1920, draw(ctx) {
    base(ctx, BG_WHITE);
    scaled(ctx, 540, 1080, 1.9, () => { ctx.rotate(-0.06); spreadsheet(ctx, -230, -70, 460, 150, RTL ? [["المركبة", "الزيت", "الاستمارة"], ["هايلكس", "85,000?", "#REF!"], ["هايس", "??", "انتهت؟"], ["ايسوزو", "71,500", "??"]] : [["Vehicle", "Oil due", "Istimara"], ["Hilux", "85,000?", "#REF!"], ["Hiace", "??", "expired?"], ["Isuzu", "71,500", "??"]], 0); });
    (RTL ? ["وين فاتورة الديزل؟", "متى صيانة الهايس؟"] : ["Where's the diesel receipt?", "When is the Hiace due?"]).forEach((c, i) =>
      scaled(ctx, RTL ? 760 - i * 90 : 250 + i * 90, 1300 + i * 140, 1.7, () => chatBubble(ctx, -110, 0, (i - 0.5) * 0.05, c, { rtl: RTL, time: `22:${14 + i * 14}` })));
    headline(ctx, P.coverHook, 500, { size: 110, align: "center", maxW: 940, accent: [1, 2] });
    const lw = logoWidth(44); drawLogo(ctx, W / 2 - lw / 2, 300, 44, C.brand, 1);
  } },

  // IG 2 — carousel: one place for the whole fleet
  ig2: { slides: 6, draw(ctx, s) {
    base(ctx, BG_TINT); brandBar(ctx, { slide: s, total: 6 });
    if (s === 1) {
      headline(ctx, S.f1.headline, 330, { size: 112 });
      body(ctx, P.ig2.sub, RTL ? 560 : 545);
      scaled(ctx, 80, 660, 1.3, () => vehiclesCard(ctx, 708, 4));
      footer(ctx, { swipe: true }); return;
    }
    if (s === 6) {
      const lw = logoWidth(80); drawLogo(ctx, W / 2 - lw / 2, 420, 80, C.brand, 1);
      if (RTL) text(ctx, S.brandName, W / 2, 580, { size: 46, weight: 600, font: F.ar, color: C.heading, align: "center", dir: "rtl" });
      headline(ctx, S.f3.cta, 700, { size: 88, align: "center" });
      ctx.font = `600 36px ${F.ui}`; const w = ctx.measureText(S.url).width + 100;
      rr(ctx, W / 2 - w / 2, 900, w, 88, 44); ctx.fillStyle = C.btn; ctx.fill();
      text(ctx, S.url, W / 2, 957, { size: 36, weight: 600, font: F.ui, color: "#fff", align: "center" });
      body(ctx, P.ig2.langs, 1090, { align: "center", size: 30, color: C.muted, maxW: 940 }); return;
    }
    const m = [null, null, ["vehicles", "truck", 0], ["service", "wrench", 1], ["fuel", "fuel", 2], ["inspections", "clipboard", 3]][s];
    eyebrow(ctx, s === 5 ? P.ig2.inspWo : S.nav[m[0]], m[1], 250);
    headline(ctx, S.f1.caps[m[2]], 350, { size: 76, accent: [1] });
    if (s === 2) scaled(ctx, 80, 610, 1.3, () => vehiclesCard(ctx, 708, 5, true));
    if (s === 3) scaled(ctx, 80, 610, 1.3, () => remindersCard(ctx, 708));
    if (s === 4) { scaled(ctx, 80, 610, 1.3, () => fuelCard(ctx, 708)); body(ctx, S.anomalyNote, 1040, { color: C.warnText, size: 32 }); body(ctx, S.f2.fuelFoot, 1140, { size: 32 }); }
    if (s === 5) scaled(ctx, 80, 610, 1.25, () => inspectionCard(ctx, 736));
    footer(ctx);
  } },

  // IG 3 — single image: papers
  ig3: { draw(ctx) {
    base(ctx, BG_WHITE); brandBar(ctx);
    headline(ctx, P.ig3.title, 300, { size: 86, accent: [2] });
    const docs = [[S.docFahes, FLEET[2], "16/11/2026", 26], [S.docInsurance, FLEET[4], "09/11/2026", 19], [S.docIstimara, FLEET[1], "02/11/2026", 12]];
    docs.forEach((d, i) => docCardS(ctx, 80, 590 + i * 96, 920, 340, d[0], `${d[1].model} · ${d[1].plate}`, d[2], d[3], i < 2));
    body(ctx, P.ig3.note, 1110, { size: 30, color: C.muted });
    footer(ctx);
  } },

  // IG 4 — reel cover (reel = fleetana-film2-vertical-*-light.mp4)
  ig4cover: { w: 1080, h: 1920, draw(ctx) {
    base(ctx, BG_TINT);
    const lw = logoWidth(44); drawLogo(ctx, W / 2 - lw / 2, 300, 44, C.brand, 1);
    headline(ctx, S.f2.hook, 520, { size: 104, align: "center" });
    scaled(ctx, 100, 800, 1, () => fuelChart(ctx, 880, 560));
    ICONS4.forEach((ic, i) => { const x = W / 2 + (i - 2) * 150 * (RTL ? -1 : 1); ctx.fillStyle = "rgba(42,137,250,0.14)"; ctx.beginPath(); ctx.arc(x, 1520, 54, 0, TAU); ctx.fill(); icon(ctx, ic, x - 24, 1496, 48, C.accentText, 2.2); });
  } },

  // IG 5 — carousel: how the fuel flag works (lib/fuel-economy.ts)
  ig5: { slides: 4, draw(ctx, s) {
    base(ctx, BG_WHITE); brandBar(ctx, { slide: s, total: 4 });
    const q = P.ig5;
    if (s === 1) {
      headline(ctx, q.hook, 330, { size: 96 });
      card(ctx, 80, 640, 920, 380, { fill: "#fff", r: 24 });
      bn(ctx, box(920, { x: 80, y: 640 }), `${FLEET[1].model} · ${FLEET[1].plate}`, 48, 76, { size: 28, weight: 600, color: C.muted });
      bn(ctx, box(920, { x: 80, y: 640 }), "5.9", 48, 280, { size: 190, weight: 700, color: C.amber });
      ctx.font = `700 190px ${F.ui}`; const vw = ctx.measureText("5.9").width;
      bt(ctx, box(920, { x: 80, y: 640 }), S.u.kmL, 48 + vw + 24, 270, { size: 52, weight: 600, color: C.muted });
      statusPill(ctx, bx(box(920, { x: 80, y: 640 }), 872), 640 + 330, S.low, "warn", { size: 34, rtl: RTL, align: "right", dot: false });
      footer(ctx, { swipe: true }); return;
    }
    text(ctx, q.step(s - 1), X(80), 260, { size: 30, weight: 600, font: RTL ? F.ar : F.ui, color: C.accentText, align: AL("left"), dir: DIR });
    headline(ctx, q.titles[s - 2], 360, { size: 72, accent: [] });
    if (s === 2) {
      // economy = distance since last full fill ÷ fuel added since then
      const y0 = 680;
      [[`88,912 ${S.u.km}`, q.lastFull], [`89,278 ${S.u.km}`, q.thisFull]].forEach(([km, lbl], i) => {
        const x = RTL ? W - 80 - 420 - i * 500 : 80 + i * 500;
        card(ctx, x, y0, 420, 170, { fill: "#fff", r: 20 });
        bt(ctx, box(420, { x, y: y0 }), lbl, 32, 56, { size: 24, weight: 600, color: C.muted });
        bt(ctx, box(420, { x, y: y0 }), km, 32, 126, { size: 48, weight: 700, color: C.fg, font: RTL ? F.ar : F.mono });
      });
      card(ctx, 80, 890, 920, 220, { fill: "#fff", r: 20 });
      const b = box(920, { x: 80, y: 890 });
      bt(ctx, b, RTL ? "366 كم ÷ 62.0 لتر" : "366 km ÷ 62.0 L", 40, 92, { size: 52, weight: 700, color: C.fg });
      bt(ctx, b, RTL ? "= 5.9 كم/لتر" : "= 5.9 km/L", 40, 172, { size: 52, weight: 700, color: C.amber });
      body(ctx, q.partial, 1170, { size: 28, color: C.muted });
    }
    if (s === 3) scaled(ctx, 80, 580, 1, () => fuelChart(ctx, 920, 600, { threshold: false, values: [9.4, 9.0, 9.3, 9.1, 9.2] }));
    if (s === 4) { scaled(ctx, 80, 560, 1, () => fuelChart(ctx, 920, 560)); body(ctx, S.anomalyNote + (RTL ? " — " : " — ") + q.check, 1160, { size: 28, color: C.warnText }); }
    footer(ctx);
  } },

  // IG 6 — single image: built for Saudi fleets
  ig6: { draw(ctx) {
    base(ctx, BG_TINT); brandBar(ctx);
    headline(ctx, P.ig6.title, 300, { size: 92, accent: [1] });
    const chips = S.f1.chips, sz = 30; let rows = [[0, 1, 2], [3, 4, 5]];
    rows.forEach((r, ri) => {
      ctx.font = `600 ${sz}px ${F.ui}`;
      const ws = r.map(i => { ctx.font = `600 ${sz}px ${/[؀-ۿ]/.test(chips[i]) ? F.ar : F.ui}`; return ctx.measureText(chips[i]).width + sz * 1.5; });
      let x = RTL ? W - 80 : 80;
      r.forEach((i, j) => { const ar = /[؀-ۿ]/.test(chips[i]);
        const w = ws[j]; const px = RTL ? x - w : x;
        const hl = i === 5; pill(ctx, px, 480 + ri * 86, chips[i], { bg: hl ? C.brand : "#fff", fg: hl ? "#fff" : C.accentFg, size: sz, font: ar ? F.ar : F.ui });
        if (!hl) { rr(ctx, px + 0.5, 480 + ri * 86 + 0.5, w - 1, sz * 1.85 - 1, sz * 0.92); ctx.strokeStyle = C.border; ctx.lineWidth = 1.5; ctx.stroke(); }
        x += (RTL ? -1 : 1) * (w + 16); });
    });
    const gy = 1130; skylineS(ctx, gy + 10);
    ctx.fillStyle = "rgba(203,213,225,0.95)"; ctx.fillRect(0, gy + 10, W, 120);
    ctx.fillStyle = "#fff"; for (let x = 20; x < W; x += 180) ctx.fillRect(x, gy + 66, 90, 6);
    ctx.save(); if (RTL) { ctx.translate(W, 0); ctx.scale(-1, 1); }
    vehicle(ctx, "pickup", 40, gy - 150 * 0.6 + 2 + 8, 0.6); vehicle(ctx, "truck", 400, gy - 150 * 0.66 + 2 + 8, 0.66); ctx.restore();
    footer(ctx);
  } },

  // IG 7 — reel cover (reel = fleetana-reel-map-*-light.mp4)
  ig7cover: { w: 1080, h: 1920, draw(ctx) {
    base(ctx, BG_WHITE);
    const lw = logoWidth(44); drawLogo(ctx, W / 2 - lw / 2, 300, 44, C.brand, 1);
    headline(ctx, P.map.hook, 520, { size: 100, align: "center" });
    const mb = { x: 80, y: 760, w: 920, h: 800, r: 24 };
    mapBase(ctx, mb, 0, { zoom: 1.2 }); ctx.strokeStyle = C.border; ctx.lineWidth = 2; rr(ctx, mb.x, mb.y, mb.w, mb.h, 24); ctx.stroke();
    const roads = ROADS(mb); [[0, 0.3, "moving"], [1, 0.55, "idling"], [3, 0.35, "moving"], [5, 0.6, "parked"], [2, 0.4, "stale"]].forEach(([r, u, st]) => { const p = along(roads[r], u); mapPin(ctx, p[0], p[1], st, 1.5); });
    statusPill(ctx, W / 2, 1640, S.f1.tracker, "info", { size: 30, rtl: RTL, align: "center" });
  } },

  // IG 8 — carousel: spreadsheet vs Fleetana
  ig8: { slides: 6, draw(ctx, s) {
    base(ctx, BG_TINT); brandBar(ctx, { slide: s, total: 6 });
    const q = P.ig8;
    if (s === 1) {
      headline(ctx, q.hook, 330, { size: 100 });
      scaled(ctx, 70, 640, 1.55, () => { ctx.rotate(RTL ? 0.04 : -0.04); spreadsheet(ctx, 0, 0, 380, 150, RTL ? [["المركبة", "الزيت"], ["هايلكس", "85,000?"], ["هايس", "??"], ["ايسوزو", "#REF!"]] : [["Vehicle", "Oil due"], ["Hilux", "85,000?"], ["Hiace", "??"], ["Isuzu", "#REF!"]], 0); });
      scaled(ctx, 440, 900, 1, () => remindersCardMini(ctx, 560));
      footer(ctx, { swipe: true }); return;
    }
    if (s === 6) {
      const lw = logoWidth(80); drawLogo(ctx, W / 2 - lw / 2, 440, 80, C.brand, 1);
      if (RTL) text(ctx, S.brandName, W / 2, 600, { size: 46, weight: 600, font: F.ar, color: C.heading, align: "center", dir: "rtl" });
      headline(ctx, S.f3.cta, 720, { size: 88, align: "center" });
      ctx.font = `600 36px ${F.ui}`; const w = ctx.measureText(S.url).width + 100;
      rr(ctx, W / 2 - w / 2, 920, w, 88, 44); ctx.fillStyle = C.btn; ctx.fill();
      text(ctx, S.url, W / 2, 977, { size: 36, weight: 600, font: F.ui, color: "#fff", align: "center" });
      footer(ctx); return;
    }
    const [before, after] = q.pairs[s - 2];
    // before: muted, struck through
    text(ctx, q.spreadsheet, X(80), 270, { size: 28, weight: 600, font: RTL ? F.ar : F.ui, color: C.muted, align: AL("left"), dir: DIR });
    ctx.font = `700 64px ${HF}`; const bw = Math.min(920, ctx.measureText(before).width);
    text(ctx, before, X(80), 360, { size: 64, weight: 700, font: HF, color: "#94a3b8", align: AL("left"), dir: DIR });
    ctx.fillStyle = "#94a3b8"; ctx.fillRect(RTL ? W - 80 - bw : 80, 340, bw, 5);
    // after: Fleetana
    drawMark(ctx, X(98), 476, 34, C.brand, 1);
    text(ctx, S.brandName, RTL ? W - 130 : 130, 488, { size: 28, weight: 700, font: RTL ? F.ar : F.head, color: C.accentText, align: AL("left"), dir: DIR });
    headline(ctx, after, 580, { size: 72, accent: [] });
    const v = s - 2;
    if (v === 0) scaled(ctx, 80, 780, 1.2, () => remindersCard(ctx, 767));
    if (v === 1) scaled(ctx, 80, 790, 1.3, () => fuelCard(ctx, 708));
    if (v === 2) scaled(ctx, 80, 780, 1.2, () => inspectionCard(ctx, 767));
    if (v === 3) { const docs = [[S.docInsurance, FLEET[4], "09/11/2026", 19], [S.docIstimara, FLEET[1], "02/11/2026", 12]];
      docs.forEach((d, i) => docCardS(ctx, 80, 790 + i * 96, 920, 340, d[0], `${d[1].model} · ${d[1].plate}`, d[2], d[3], i < 1)); }
    footer(ctx);
  } },

  // IG 9 / LinkedIn 3 — single image: how driver scores work (lib/telematics/driver-score.ts)
  ig9: { draw(ctx) {
    base(ctx, BG_WHITE); brandBar(ctx);
    const q = P.drivers;
    headline(ctx, q.title, 260, { size: 84, accent: [1] });
    scaled(ctx, 80, 420, 1, () => driverCard(ctx, 920));
    let y = 820;
    q.points.forEach((p, i) => {
      ctx.fillStyle = "rgba(42,137,250,0.14)"; ctx.beginPath(); ctx.arc(X(104), y - 10, 24, 0, TAU); ctx.fill();
      text(ctx, String(i + 1), X(104), y, { size: 24, weight: 700, font: F.ui, color: C.accentText, align: "center" });
      y = body(ctx, p, y, { x: X(150), maxW: 840, size: 28, color: C.onVariant }) + 18;
    });
    statusPill(ctx, RTL ? 80 : W - 80, H - 98, S.f1.tracker, "info", { size: 28, rtl: RTL, align: "right" });   // far side from the url
    footer(ctx);
  } },
};
const ICONS4 = ["fuel", "wrench", "calendar", "pin", "shield"];
function remindersCardMini(ctx, w) {
  card(ctx, 0, 0, w, 250, { fill: "#fff", r: 20 });
  const b = box(w);
  icon(ctx, "wrench", RTL ? w - 66 : 30, 30, 36, C.brand, 2.2);
  bt(ctx, b, S.tasks[0], 84, 60, { size: 28, weight: 700, color: C.fg });
  bn(ctx, b, `${FLEET[0].model} · ${FLEET[0].plate}`, 84, 98, { size: 20, weight: 500, color: C.muted });
  statusPill(ctx, bx(b, w - 30), 170, S.overdue, "bad", { size: 24, rtl: RTL, align: "right" });
  bn(ctx, b, "90,060 / 90,000 km", 30, 180, { size: 24, weight: 600, color: C.onVariant, font: F.mono });
  ctx.fillStyle = "#ef4444"; rr(ctx, 30, 210, w - 60, 10, 5); ctx.fill();
}

// LinkedIn document (PDF pages, 1080×1350): five places a fleet loses money
POSTS.li2 = { slides: 7, draw(ctx, s) {
  base(ctx, s % 2 ? BG_WHITE : BG_TINT); brandBar(ctx, { slide: s, total: 7 });
  const q = P.li2;
  if (s === 1) { headline(ctx, q.hook, 360, { size: 100, accent: [1] }); body(ctx, q.sub, 640, { size: 34 });
    ICONS4.forEach((ic, i) => { const y = 780 + i * 96, x = X(120);
      ctx.fillStyle = "rgba(42,137,250,0.14)"; ctx.beginPath(); ctx.arc(x, y, 38, 0, TAU); ctx.fill(); icon(ctx, ic, x - 18, y - 18, 36, C.accentText, 2.2);
      text(ctx, `0${i + 1}  ${S.f2.leak[i]}`, RTL ? x - 66 : x + 66, y + 12, { size: 34, weight: 600, font: RTL ? F.ar : F.ui, color: C.fg, align: AL("left"), dir: DIR }); });
    footer(ctx, { swipe: true }); return; }
  if (s === 7) {
    const lw = logoWidth(80); drawLogo(ctx, W / 2 - lw / 2, 420, 80, C.brand, 1);
    headline(ctx, S.f2.end, 640, { size: 92, align: "center", accent: [1] });
    body(ctx, q.close, 860, { align: "center", size: 32 });
    ctx.font = `600 36px ${F.ui}`; const w = ctx.measureText(S.url).width + 100;
    rr(ctx, W / 2 - w / 2, 1000, w, 88, 44); ctx.fillStyle = C.btn; ctx.fill();
    text(ctx, S.url, W / 2, 1057, { size: 36, weight: 600, font: F.ui, color: "#fff", align: "center" }); return; }
  const i = s - 2, [ttl, rule] = q.leaks[i];
  text(ctx, `0${i + 1}  ${S.f2.leak[i]}`, X(80), 250, { size: 30, weight: 600, font: RTL ? F.ar : F.ui, color: C.accentText, align: AL("left"), dir: DIR });
  headline(ctx, ttl, 350, { size: 72, accent: [] });
  if (i === 0) scaled(ctx, 80, 560, 1, () => fuelChart(ctx, 920, 520));
  if (i === 1) scaled(ctx, 80, 580, 1.3, () => remindersCard(ctx, 708));
  if (i === 2) { const docs = [[S.docFahes, FLEET[2], "16/11/2026", 26], [S.docInsurance, FLEET[4], "09/11/2026", 19], [S.docIstimara, FLEET[1], "02/11/2026", 12]];
    docs.forEach((d, k) => docCardS(ctx, 80, 560 + k * 96, 920, 340, d[0], `${d[1].model} · ${d[1].plate}`, d[2], d[3], k < 2)); }
  if (i === 3) { const mb = { x: 80, y: 560, w: 920, h: 480, r: 20 }; mapBase(ctx, mb, 0, { zoom: 1.3 }); ctx.strokeStyle = C.border; ctx.lineWidth = 2; rr(ctx, mb.x, mb.y, mb.w, mb.h, 20); ctx.stroke();
    mapPin(ctx, mb.x + mb.w * 0.45, mb.y + mb.h * 0.55, "idling", 1.8);
    const pb = { x: RTL ? mb.x + 30 : mb.x + mb.w - 360, y: mb.y + 30, w: 330, rtl: RTL };
    card(ctx, pb.x, pb.y, pb.w, 150, { fill: "#fff", r: 14 }); bn(ctx, pb, FLEET[2].plate, 24, 44, { size: 22, weight: 600, color: C.fg, font: F.mono });
    bt(ctx, pb, S.idleTime, 24, 92, { size: 18, weight: 500, color: C.muted }); bt(ctx, pb, `41 ${S.u.min}`, 24, 132, { size: 34, weight: 700, color: C.amber });
    trackerTag(ctx, 1090); }
  if (i === 4) { card(ctx, 80, 600, 920, 300, { fill: "#fff", r: 20 }); const b = box(920, { x: 80, y: 600 });
    bn(ctx, b, S.woTitle, 40, 64, { size: 28, weight: 700, color: C.fg, font: F.mono });
    bt(ctx, b, S.woLines[0][1], 40, 150, { size: 34, weight: 700, color: C.fg });
    statusPill(ctx, bx(b, 40), 600 + 230, `${S.warranty} · ${S.activeUntil("14/03/2027")}`, "good", { size: 26, rtl: RTL }); }
  body(ctx, rule, i === 4 ? 980 : 1150, { size: 30, color: C.onVariant });
  footer(ctx);
} };

const def = POSTS[POST]; if (def.w) { W = def.w; H = def.h; }
film({ w: W, h: H, fps: 60, dur: 1 / 60, render(ctx) { def.draw(ctx, SLIDE); } });
window.POSTDEF = { slides: def.slides || 1, w: W, h: H };
