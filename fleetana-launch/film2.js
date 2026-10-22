// FILM 2 — "Where the money leaks" · cost film · 30 s · 1920×1080
// Each leak is one rule from the code: fuel economy < 70% of the 30-day average (lib/fuel-economy.ts),
// service due by km/hours/date (lib/service-reminders.ts), documents expiring (dashboard, 30 days),
// idle time from the tracker (lib/telematics/trips.ts), warranty "active until" (lib/warranty.ts).
// ?format=vertical → 1080×1920 reel: statement on top, the same hero visuals below, inside the Reels safe zone
const VERT = new URLSearchParams(location.search).get("format") === "vertical";
const W = VERT ? 1080 : 1920, H = VERT ? 1920 : 1080, DUR = 30;
const VY = VERT ? 680 : 0;                        // hero visuals drop below the statement in vertical
const SW = VERT ? 920 : 800;                       // statement column width
const LEAKS = [3.0, 7.8, 12.6, 17.4, 21.6, 26.4];   // on the 100 BPM grid (0.6 s beats)    // start of each leak, then end card
const ICONS = ["fuel", "wrench", "calendar", "pin", "shield"];
const HF = RTL ? F.ar : F.head;
const DIR = RTL ? "rtl" : "ltr";
const X = x => (RTL ? W - x : x);
const ZX = VERT ? 120 : RTL ? 100 : 980, ZW = 840;   // hero zone (right half; left half in Arabic; centred when vertical)
const AL = a => (RTL ? (a === "left" ? "right" : a === "right" ? "left" : a) : a);

// big statement lines: line 1 lands, line 2 (resolution) lands in brand blue
function statement(ctx, l1, l2, lt, t2, { y = VERT ? 560 - VY : 500, size = RTL ? 72 : 76 } = {}) {
  const x = X(VERT ? 80 : 110);
  ctx.save(); ctx.font = `700 ${size}px ${HF}`; const fs = Math.min(size, size * SW / Math.max(ctx.measureText(l1).width, ctx.measureText(l2).width)); ctx.restore();
  riseText(ctx, l1, x, y, seg(lt, 0.15, 0.85), { size: fs, weight: 700, font: HF, color: C.heading, align: AL("left"), dir: DIR, track: RTL ? 0 : -1.5 });
  riseText(ctx, l2, x, y + fs * 1.22, seg(lt, t2, t2 + 0.6), { size: fs, weight: 700, font: HF, color: C.accentText, align: AL("left"), dir: DIR, track: RTL ? 0 : -1.5 });
}
// leak counter: 01 / 05 + label, plus five progress ticks
function counter(ctx, i, lt) {
  const k = E.hero(seg(lt, 0, 0.5)), x = X(VERT ? 80 : 110);
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, VERT ? 400 - 330 - VY : 0);
  text(ctx, `0${i + 1}`, x, 330, { size: 22, weight: 600, font: F.mono, color: C.accentText, align: AL("left") });
  text(ctx, S.f2.leak[i], RTL ? x - 54 : x + 54, 330, { size: 22, weight: 600, font: RTL ? F.ar : F.ui, color: C.onVariant, align: AL("left"), dir: DIR });
  for (let j = 0; j < 5; j++) { ctx.fillStyle = j <= i ? C.brand : C.inactive; ctx.fillRect(RTL ? x - 40 - j * 52 : x + j * 52, 352, 40, 4); }
  ctx.restore();
}
function enterExit(ctx, t, a, b, fn) { // shared in/out for a leak block
  if (t < a - 0.05 || t > b + 0.05) return;
  const out = E.inOutExpo(seg(t, b - 0.35, b + 0.05));
  ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(0, -out * 60 + VY); fn(t - a); ctx.restore();
}

// ── 0: hook — receipts rain, the question lands ────────────────────────────
const RECEIPTS = Array.from({ length: 16 }, (_, i) => ({
  x: (120 + hash(i, 1) * 1680) * (VERT ? 1080 / 1920 : 1), d: hash(i, 2) * 1.1, rot: (hash(i, 3) - 0.5) * 0.7, s: 0.7 + hash(i, 4) * 0.5,
  lines: [["SASCO", "ALDREES", "PETROMIN", "NAFT"][i % 4], `${String(10 + (i % 18)).padStart(2, "0")}/10/2026`, ["DIESEL", "PETROL 91", "SERVICE", "TYRES"][i % 4],
    `SAR ${fmt([232.4, 135.16, 1150, 1840, 96.75, 420][i % 6], 2)}`, "", "———"],
}));
function hook(ctx, t) {
  RECEIPTS.forEach(r => {
    const k = seg(t, r.d, r.d + 1.6); if (k <= 0) return;
    const y = lerp(-420, H + 220, E.inCubic(k) * 0.55 + k * 0.45);
    ctx.save(); ctx.globalAlpha *= THEME === "light" ? 0.95 : 0.55; ctx.translate(r.x, y); ctx.scale(r.s, r.s); receipt(ctx, -110, 0, r.rot + k * 0.4 * Math.sign(r.rot), r.lines); ctx.restore();
  });
  const dim = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 900);
  dim.addColorStop(0, `rgba(${C.fadeRGB},${THEME === "light" ? 0.8 : 0.85})`); dim.addColorStop(1, `rgba(${C.fadeRGB},${THEME === "light" ? 0 : 0.2})`); ctx.fillStyle = dim; ctx.fillRect(0, 0, W, H);
  const out = E.inOutExpo(seg(t, 2.65, 3.0));
  ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(0, -out * 80 + (VERT ? 320 : 0));
  S.f2.hook.forEach((l, i) => riseText(ctx, l, W / 2, 500 + i * 128, seg(t, 0.35 + i * 0.25, 1.15 + i * 0.25),
    { size: VERT ? (RTL ? 92 : 96) : RTL ? 112 : 118, weight: 700, font: HF, color: i ? C.accentText : C.heading, align: "center", dir: DIR, track: RTL ? 0 : -2.5 }));
  ctx.restore();
}

// ── 1: fuel — the 70% rule as a chart ──────────────────────────────────────
function leakFuel(ctx, lt, t) {
  counter(ctx, 0, lt); statement(ctx, S.f2.fuel1, S.f2.fuel2, lt, 2.4);
  const b = { x: ZX, y: 230, w: ZW, h: 620, rtl: RTL };
  const k = E.hero(seg(lt, 0.3, 1.0)); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 60);
  card(ctx, b.x, b.y, b.w, b.h, { fill: C.card, stroke: C.border, r: 18 });
  bn(ctx, b, `${FLEET[1].model} · ${FLEET[1].plate}`, 40, 64, { size: 28, weight: 700, color: C.fg });
  bt(ctx, b, `${S.colEconomy} · km/L`, 40, 102, { size: 20, weight: 500, color: C.muted });
  const vals = [9.4, 9.0, 9.3, 9.1, 5.9], avg = 9.2, thr = avg * 0.7, top = b.y + 140, base = b.y + b.h - 70, sc = (base - top) / 11;
  const cw = 104, gap = 30, gutter = 150, x0 = RTL ? b.x + gutter : b.x + 50;
  // average + threshold lines
  const ly = v => base - v * sc, lk = E.hero(seg(lt, 0.9, 1.5));
  ctx.strokeStyle = "rgba(148,163,184,0.6)"; ctx.lineWidth = 2; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(b.x + 30 + (RTL ? gutter : 0), ly(avg)); ctx.lineTo(b.x + 30 + (b.w - 60 - gutter) * lk + (RTL ? gutter : 0), ly(avg)); ctx.stroke();
  ctx.strokeStyle = rgba("#f59e0b", 0.9); ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(b.x + 30 + (RTL ? gutter : 0), ly(thr)); ctx.lineTo(b.x + 30 + (b.w - 60 - gutter) * lk + (RTL ? gutter : 0), ly(thr)); ctx.stroke(); ctx.setLineDash([]);
  ctx.save(); ctx.globalAlpha *= lk;
  bt(ctx, b, `${S.u.avg} 9.2`, b.w - 30, ly(avg) - b.y + 7, { size: 20, weight: 600, color: C.onVariant, align: "right", font: F.mono });
  bt(ctx, b, `${S.u.thr} 6.4`, b.w - 30, ly(thr) - b.y + 7, { size: 20, weight: 600, color: C.amber, align: "right", font: F.mono });
  ctx.restore();
  vals.forEach((v, i) => {
    const gk = E.outCubic(seg(lt, 0.5 + i * 0.12, 1.1 + i * 0.12)), last = i === 4;
    const shown = last ? lerp(9.2, v, E.inOutCubic(seg(lt, 1.4, 2.2))) : v;
    const x = RTL ? b.x + b.w - 50 - cw - i * (cw + gap) : x0 + i * (cw + gap), hgt = shown * sc * gk;
    const low = last && shown < thr;
    ctx.fillStyle = low ? "#D97706" : last ? C.brand : "rgba(42,137,250,0.45)";
    rr(ctx, x, base - hgt, cw, hgt, 8); ctx.fill();
    if (gk > 0.5) text(ctx, shown.toFixed(1), x + cw / 2, base - hgt - (last ? 34 : 16), { size: 28, weight: 700, font: F.ui, color: low ? C.amber : C.fg, align: "center" });
    if (low) { const pk = E.outBack(seg(lt, 2.3, 2.7)); if (pk > 0) { ctx.save(); ctx.globalAlpha *= clamp(pk); statusPill(ctx, x + cw / 2, base - hgt - 86, S.low, "warn", { size: 20, rtl: RTL, align: "center", dot: false }); ctx.restore(); } }
  });
  ctx.fillStyle = C.border; ctx.fillRect(b.x + 30, base, b.w - 60, 2);
  ctx.restore();
  const fk = E.hero(seg(lt, 2.7, 3.2));
  text(ctx, S.f2.fuelFoot, X(VERT ? 80 : 110), VERT ? 790 - VY : 760, { size: RTL ? 36 : 38, weight: 500, font: RTL ? F.ar : F.ui, color: C.onVariant, align: AL("left"), alpha: fk, dir: DIR });
}

// ── 2: service — rolling odometer, reminder flips to Overdue ───────────────
function odometer(ctx, cx, cy, value, digits = 6, s = 1) {
  const dw = 78 * s, dh = 118 * s, w = dw * digits;
  ctx.save(); card(ctx, cx - w / 2 - 18 * s, cy - dh / 2 - 18 * s, w + 36 * s, dh + 36 * s, { fill: C.well, stroke: C.border, r: 16 * s });
  for (let i = 0; i < digits; i++) {
    const place = Math.pow(10, digits - 1 - i), raw = value / place, d = Math.floor(raw) % 10;
    // only roll when lower digits are about to carry, like a mechanical counter
    const lower = value % place, roll = place === 1 ? fract(raw) : clamp((lower - (place - 1)) / 1), off = (place === 1 ? fract(value) : roll);
    const x = cx - w / 2 + i * dw;
    ctx.save(); rr(ctx, x + 4 * s, cy - dh / 2, dw - 8 * s, dh, 8 * s); ctx.fillStyle = i >= digits - 3 ? C.wellHi : C.wellLo; ctx.fill(); ctx.clip();
    ctx.font = `600 ${86 * s}px ${F.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = C.fg;
    ctx.fillText(String(d), x + dw / 2, cy - off * dh); ctx.fillText(String((d + 1) % 10), x + dw / 2, cy + dh - off * dh);
    const g = ctx.createLinearGradient(0, cy - dh / 2, 0, cy + dh / 2); g.addColorStop(0, `rgba(${C.wellRGB},0.85)`); g.addColorStop(0.3, `rgba(${C.wellRGB},0)`); g.addColorStop(0.7, `rgba(${C.wellRGB},0)`); g.addColorStop(1, `rgba(${C.wellRGB},0.85)`);
    ctx.fillStyle = g; ctx.fillRect(x, cy - dh / 2, dw, dh); ctx.restore();
  }
  text(ctx, S.u.km, cx + w / 2 + 40 * s, cy + 22 * s, { size: 34 * s, weight: 600, font: RTL ? F.ar : F.ui, color: C.muted });
  ctx.restore();
}
function leakService(ctx, lt) {
  counter(ctx, 1, lt); statement(ctx, S.f2.svc1, S.f2.svc2, lt, 2.2);
  const k = E.hero(seg(lt, 0.3, 1.0)); if (k <= 0) return;
  const km = lerp(89420, 90060, E.inOutCubic(seg(lt, 0.6, 2.2)));
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 60);
  odometer(ctx, RTL ? ZX + 330 : ZX + ZW - 360, 410, km, 6, 1.2);
  // reminder card
  const b = { x: ZX, y: 590, w: ZW, h: 220, rtl: RTL };
  card(ctx, b.x, b.y, b.w, b.h, { fill: C.card, stroke: C.border, r: 16 });
  icon(ctx, "wrench", RTL ? b.x + b.w - 70 : b.x + 34, b.y + 36, 36, C.brand, 2.2);
  bt(ctx, b, S.tasks[0], 92, 64, { size: 28, weight: 700, color: C.fg });
  bn(ctx, b, `${FLEET[0].model} · ${FLEET[0].plate}`, 92, 100, { size: 19, weight: 500, color: C.muted });
  const prog = clamp((km - 80000) / 10000), st = km >= 90000 ? ["overdue", "bad"] : km >= 89000 ? ["dueSoon", "warn"] : ["upcoming", "muted"];
  statusPill(ctx, bx(b, b.w - 34), b.y + 64, S[st[0]], st[1], { size: 20, rtl: RTL, align: "right" });
  ctx.fillStyle = C.track; rr(ctx, b.x + 34, b.y + 140, b.w - 68, 14, 7); ctx.fill();
  ctx.fillStyle = PILLS[st[1] === "muted" ? "info" : st[1]].dot; const pw = (b.w - 68) * Math.min(1, prog);
  rr(ctx, RTL ? b.x + b.w - 34 - pw : b.x + 34, b.y + 140, pw, 14, 7); ctx.fill();
  bn(ctx, b, "90,000 km", b.w - 34, 182, { size: 17, weight: 600, color: C.onVariant, align: "right", font: F.mono });
  ctx.restore();
}

// ── 3: papers — Istimara card counts down ───────────────────────────────────
function docCard(ctx, x, y, w, h, title, sub, date, n, kind, rot, back = false) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot); ctx.translate(-w / 2, -h / 2);
  card(ctx, 0, 0, w, h, { fill: C.panel, stroke: C.border, r: 18 });
  const b = { x: 0, y: 0, w, rtl: RTL };
  ctx.fillStyle = rgba(C.brand, 0.9); ctx.fillRect(RTL ? w - 10 : 0, 24, 10, 60);
  bt(ctx, b, title, 36, 64, { size: 36, weight: 700, color: C.fg });
  if (back) { statusPill(ctx, bx(b, w - 32), 56, S.inDays(n), kind, { size: 20, rtl: RTL, align: "right" }); ctx.restore(); return; }
  bn(ctx, b, sub, 36, 104, { size: 20, weight: 500, color: C.muted });
  bt(ctx, b, S.expiringSoon, 36, h - 70, { size: 18, weight: 500, color: C.muted });
  bn(ctx, b, date, 36, h - 34, { size: 30, weight: 600, color: C.fg, font: F.mono });
  statusPill(ctx, bx(b, w - 32), h - 42, S.inDays(n), kind, { size: 22, rtl: RTL, align: "right" });
  ctx.restore();
}
function leakPapers(ctx, lt) {
  counter(ctx, 2, lt); statement(ctx, S.f2.doc1, S.f2.doc2, lt, 2.0);
  const docs = [[S.docFahes, FLEET[2], "16/11/2026", 26, "warn"], [S.docInsurance, FLEET[4], "09/11/2026", 19, "warn"], [S.docIstimara, FLEET[1], "02/11/2026", 12, "bad"]];
  const cx = ZX + ZW / 2;
  docs.forEach((d, i) => {
    const k = E.hero(seg(lt, 0.3 + i * 0.18, 1.0 + i * 0.18)); if (k <= 0) return;
    const fan = (i - 2) * 0.025 * (RTL ? -1 : 1), off = (i - 2) * 100;
    const n = i === 2 ? Math.round(lerp(30, 12, E.inOutCubic(seg(lt, 1.0, 2.0)))) : d[3];
    ctx.save(); ctx.globalAlpha *= k; ctx.translate((RTL ? -1 : 1) * (1 - k) * 200, 0);
    docCard(ctx, cx - 400 - off * 0.25 * (RTL ? -1 : 1), 470 + off, 800, 340, d[0], `${d[1].model} · ${d[1].plate}`, d[2], n, n <= 14 ? "bad" : "warn", fan + (1 - k) * 0.2, i < 2);
    ctx.restore();
  });
}

// ── 4: idling — parked truck, engine running, amber pin, idle time ─────────
function leakIdle(ctx, lt, t) {
  counter(ctx, 3, lt); statement(ctx, S.f2.idle1, S.f2.idle2, lt, 1.7);
  const k = E.hero(seg(lt, 0.25, 1.0)); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 60);
  const mb = { x: ZX, y: 210, w: ZW, h: 560, r: 18 };
  mapBase(ctx, mb, t, { zoom: 1.25 + lt * 0.02 });
  ctx.strokeStyle = C.border; ctx.lineWidth = 2; rr(ctx, mb.x, mb.y, mb.w, mb.h, 18); ctx.stroke();
  const px = mb.x + mb.w * 0.42, py = mb.y + mb.h * 0.55;
  mapPin(ctx, px, py, "idling", 1.6, { pulse: fract(lt * 0.9) });
  // idle-time panel (fleet-map shows idle per trip / per day)
  const pb = { x: RTL ? mb.x + 30 : mb.x + mb.w - 30 - 330, y: mb.y + 30, w: 330, rtl: RTL };
  card(ctx, pb.x, pb.y, pb.w, 150, { fill: C.overlay, stroke: C.border, r: 14 });
  bn(ctx, pb, FLEET[2].plate, 24, 44, { size: 22, weight: 600, color: C.fg, font: F.mono });
  statusPill(ctx, bx(pb, pb.w - 24), pb.y + 40, S.idle, "warn", { size: 16, rtl: RTL, align: "right" });
  bt(ctx, pb, S.idleTime, 24, 92, { size: 17, weight: 500, color: C.muted });
  const mins = Math.round(lerp(12, 41, E.outCubic(seg(lt, 0.8, 2.6))));
  bt(ctx, pb, `${mins} ${S.u.min}`, 24, 132, { size: 34, weight: 700, color: C.amber });
  // tracker tag
  statusPill(ctx, RTL ? mb.x + mb.w - 24 : mb.x + 24, mb.y + mb.h - 40, S.f1.tracker, "info", { size: 17, rtl: RTL });
  ctx.restore();
  // parked truck with engine running (exhaust puffs) in front of the map
  const tx = RTL ? mb.x + mb.w - 420 : mb.x - 90, ty = 660;
  ctx.save(); ctx.globalAlpha *= k;
  if (RTL) { ctx.translate(2 * tx + 620 * 0.85, 0); ctx.scale(-1, 1); }
  vehicle(ctx, "truck", tx, ty, 0.85, { t, moving: false });
  for (let i = 0; i < 6; i++) { const ph = fract(lt * 0.9 + i / 6); ctx.fillStyle = `rgba(${C.puffRGB},${0.28 * (1 - ph)})`; ctx.beginPath(); ctx.arc(tx - 10 - ph * 90, ty + 140 - ph * 80, 10 + ph * 26, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ── 5: warranty — "active until" stamp lands on the line ───────────────────
function leakWarranty(ctx, lt) {
  counter(ctx, 4, lt); statement(ctx, S.f2.war1, S.f2.war2, lt, 1.5);
  const k = E.hero(seg(lt, 0.25, 0.9)); if (k <= 0) return;
  const b = { x: ZX, y: 380, w: ZW, h: 320, rtl: RTL };
  ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 60);
  card(ctx, b.x, b.y, b.w, b.h, { fill: C.card, stroke: C.border, r: 18 });
  bn(ctx, b, S.woTitle, 36, 56, { size: 26, weight: 700, color: C.fg, font: F.mono });
  bn(ctx, b, `${FLEET[2].model} · ${FLEET[2].plate}`, 36, 90, { size: 18, weight: 500, color: C.muted });
  ctx.fillStyle = C.border; ctx.fillRect(b.x + 30, b.y + 116, b.w - 60, 1);
  bt(ctx, b, S.woLines[0][0], 36, 166, { size: 20, weight: 500, color: C.muted });
  bt(ctx, b, S.woLines[0][1], 150, 170, { size: 32, weight: 700, color: C.fg });
  // stamp
  const sk = E.outBack(seg(lt, 0.9, 1.25));
  if (sk > 0) {
    ctx.save(); const sx = bx(b, 36), sy = b.y + 250;
    ctx.globalAlpha *= clamp(sk * 1.5); ctx.translate(sx, sy); ctx.scale(lerp(1.6, 1, clamp(sk)), lerp(1.6, 1, clamp(sk))); ctx.translate(-sx, -sy);
    const lbl = `${S.warranty} · ${S.activeUntil("14/03/2027")}`;
    ctx.font = `600 26px ${RTL ? F.ar : F.ui}`; const w = ctx.measureText(lbl).width + 84;
    const px = RTL ? sx - w : sx;
    rr(ctx, px, sy - 30, w, 60, 30); ctx.fillStyle = "rgba(22,163,74,0.16)"; ctx.fill(); ctx.strokeStyle = C.greenLine; ctx.lineWidth = 2; ctx.stroke();
    icon(ctx, "shield", RTL ? px + w - 50 : px + 20, sy - 15, 30, C.green, 2.2);
    text(ctx, lbl, RTL ? px + w - 62 : px + 62, sy + 9, { size: 26, weight: 600, font: RTL ? F.ar : F.ui, color: C.green, align: AL("left"), dir: DIR });
    ctx.restore();
  }
  ctx.restore();
}

// ── end: five leak icons converge into the mark ─────────────────────────────
function endCard(ctx, t) {
  const u = t - LEAKS[5];
  const glow = ctx.createRadialGradient(W / 2, 470, 0, W / 2, 470, 800);
  glow.addColorStop(0, rgba(C.brand, 0.16 * seg(u, 0.4, 1.2))); glow.addColorStop(1, rgba(C.brand, 0)); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  const conv = E.inOutExpo(seg(u, 0.55, 1.05));
  ctx.save(); if (VERT) ctx.translate(0, 420);
  ICONS.forEach((ic, i) => {
    const k = E.outBack(seg(u, i * 0.06, 0.4 + i * 0.06)); if (k <= 0 || conv >= 1) return;
    const x0 = W / 2 + (i - 2) * 150 * (RTL ? -1 : 1), x = lerp(x0, W / 2, conv), y = lerp(380, 400, conv), s = lerp(1, 0.2, conv);
    ctx.save(); ctx.globalAlpha *= clamp(k) * (1 - conv); ctx.translate(x, y); ctx.scale(k * s, k * s);
    ctx.fillStyle = "rgba(42,137,250,0.14)"; ctx.beginPath(); ctx.arc(0, 0, 54, 0, TAU); ctx.fill();
    icon(ctx, ic, -24, -24, 48, C.brand, 2.2); ctx.restore();
  });
  const lh = 88, lw = logoWidth(lh);
  if (u > 0.9) drawLogo(ctx, W / 2 - lw / 2, 350, lh, C.brand, seg(u, 0.9, 1.9));
  S.f2.end.forEach((l, i) => riseText(ctx, l, W / 2, 600 + i * 100, seg(u, 1.1 + i * 0.25, 1.8 + i * 0.25),
    { size: RTL ? 76 : 82, weight: 700, font: HF, color: i ? C.accentText : C.heading, align: "center", dir: DIR, track: RTL ? 0 : -2 }));
  const bk = E.hero(seg(u, 1.4, 1.9));
  if (bk > 0) { ctx.save(); ctx.globalAlpha *= bk; ctx.font = `600 30px ${F.ui}`; const w = ctx.measureText(S.url).width + 80;
    rr(ctx, W / 2 - w / 2, 800, w, 68, 34); ctx.fillStyle = C.btn; ctx.fill();
    text(ctx, S.url, W / 2, 845, { size: 30, weight: 600, font: F.ui, color: "#fff", align: "center" }); ctx.restore(); }
  ctx.restore();
  const fo = seg(t, DUR - 0.4, DUR); if (fo > 0) { ctx.fillStyle = `rgba(${C.fadeRGB},${E.inCubic(fo)})`; ctx.fillRect(0, 0, W, H); }
}

film({
  w: W, h: H, fps: 60, dur: DUR, audio: "audio/film2.wav",
  render(ctx, t) {
    kineticBg(ctx, W, H, t, { alpha: t < LEAKS[0] ? 0.25 : t > LEAKS[5] ? 1 : 0.45 });
    if (t < LEAKS[0] + 0.05) hook(ctx, t);
    enterExit(ctx, t, LEAKS[0], LEAKS[1], lt => leakFuel(ctx, lt, t));
    enterExit(ctx, t, LEAKS[1], LEAKS[2], lt => leakService(ctx, lt));
    enterExit(ctx, t, LEAKS[2], LEAKS[3], lt => leakPapers(ctx, lt));
    enterExit(ctx, t, LEAKS[3], LEAKS[4], lt => leakIdle(ctx, lt, t));
    enterExit(ctx, t, LEAKS[4], LEAKS[5], lt => leakWarranty(ctx, lt));
    if (t >= LEAKS[5]) endCard(ctx, t);
  },
});
