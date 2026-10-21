// Fleetana film components: illustrated vehicles, the fleet map, and app UI panels.
// All UI is drawn in the app's dark tokens and supports RTL via a mirrored layout box.

// ── Layout box with RTL mirroring ───────────────────────────────────────────
// b = {x, y, w, h, rtl}. bx(b, px) maps a left-origin x to absolute; align() flips text alignment.
const bx = (b, px) => (b.rtl ? b.x + b.w - px : b.x + px);
const al = (b, a = "left") => (!b.rtl ? a : a === "left" ? "right" : a === "right" ? "left" : a);
function bt(ctx, b, s, px, py, o = {}) {
  return text(ctx, s, bx(b, px), b.y + py, { font: b.rtl ? F.ar : F.ui, ...o, align: al(b, o.align || "left"), dir: b.rtl ? "rtl" : "ltr" });
}
// numbers/plates stay LTR even inside RTL
function bn(ctx, b, s, px, py, o = {}) {
  return text(ctx, s, bx(b, px), b.y + py, { font: F.ui, ...o, align: al(b, o.align || "left"), dir: "ltr" });
}

// ── Illustrated vehicles (side view, flat, white Saudi fleet livery) ───────
const VEH = {
  pickup: { w: 520, body: "M20 160 L20 118 Q22 100 44 98 L170 92 L232 40 Q240 34 254 34 L352 34 Q368 34 376 48 L398 96 L498 98 Q512 100 512 116 L512 160 Z", win: ["M244 50 L262 46 L300 46 L300 92 L200 94 Z", "M310 46 L350 46 Q360 46 364 54 L384 92 L310 92 Z"], wheels: [112, 418], bed: "M20 118 L196 112" },
  van: { w: 540, body: "M20 168 L20 50 Q20 26 46 24 L400 24 Q430 24 446 46 L500 108 Q522 116 524 140 L524 168 Z", win: ["M64 40 L150 40 L150 92 L64 92 Z", "M166 40 L262 40 L262 92 L166 92 Z", "M278 40 L382 40 Q400 40 410 54 L452 100 L278 100 Z"], wheels: [118, 436], bed: null },
  truck: { w: 620, body: "M16 172 L16 20 L408 20 L408 172 Z M420 172 L420 70 L520 70 Q540 70 552 88 L596 136 Q604 146 604 158 L604 172 Z", win: ["M444 84 L520 84 Q532 84 540 94 L572 132 L444 132 Z"], wheels: [96, 300, 516], bed: null },
};
function vehicle(ctx, type, x, y, scale = 1, { t = 0, moving = false, body = "#e7ecf7", accent = C.brand, plate = null } = {}) {
  const v = VEH[type];
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  // ground shadow
  ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(v.w / 2, 204, v.w * 0.5, 12, 0, 0, TAU); ctx.fill();
  const bob = moving ? Math.sin(t * 22) * 1.2 : 0;
  ctx.translate(0, bob);
  const g = ctx.createLinearGradient(0, 20, 0, 172); g.addColorStop(0, body); g.addColorStop(1, "#b9c2d3");
  ctx.fillStyle = g; ctx.fill(new Path2D(v.body));
  ctx.strokeStyle = "rgba(15,23,42,0.35)"; ctx.lineWidth = 2; ctx.stroke(new Path2D(v.body));
  ctx.fillStyle = "#0b1326"; v.win.forEach(w => ctx.fill(new Path2D(w)));
  ctx.fillStyle = "rgba(147,197,253,0.18)"; v.win.forEach(w => { ctx.save(); ctx.clip(new Path2D(w)); ctx.fillRect(0, 20, 600, 30); ctx.restore(); });
  if (v.bed) { ctx.strokeStyle = "rgba(15,23,42,0.45)"; ctx.lineWidth = 3; ctx.stroke(new Path2D(v.bed)); }
  // livery stripe in brand blue (chrome, not state)
  ctx.fillStyle = accent; ctx.fillRect(type === "truck" ? 16 : 20, type === "truck" ? 120 : 132, type === "truck" ? 392 : v.w - 40, 7);
  // lights
  ctx.fillStyle = "#fde68a"; ctx.fillRect(v.w - 26, type === "truck" ? 140 : 120, 12, 10);
  ctx.fillStyle = "#f87171"; ctx.fillRect(18, type === "truck" ? 140 : 124, 8, 14);
  // plate
  if (plate) { ctx.fillStyle = "#ffffff"; rr(ctx, v.w - 120, 150, 84, 22, 3); ctx.fill(); ctx.fillStyle = "#0f172a"; ctx.font = `600 13px ${F.mono}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(plate, v.w - 78, 162); }
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  v.wheels.forEach(wx => {
    ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(wx, 172, 36, 0, TAU); ctx.fill();
    ctx.fillStyle = "#94a3b8"; ctx.beginPath(); ctx.arc(wx, 172, 17, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#475569"; ctx.lineWidth = 3; const a = moving ? -t * 14 : 0;
    for (let k = 0; k < 5; k++) { const aa = a + k * TAU / 5; ctx.beginPath(); ctx.moveTo(wx, 172); ctx.lineTo(wx + Math.cos(aa) * 15, 172 + Math.sin(aa) * 15); ctx.stroke(); }
    ctx.fillStyle = "#1e293b"; ctx.beginPath(); ctx.arc(wx, 172, 5, 0, TAU); ctx.fill();
  });
  ctx.restore();
}

// ── Fleet map (stylized Riyadh-like road net; pins exactly like fleet-map.tsx) ─
const PIN = { moving: ["#16A34A", "#15803D"], idling: ["#D97706", "#92400E"], parked: ["#475569", "#334155"], stale: ["#94A3B8", "#64748B"] };
function mapBase(ctx, b, t, { zoom = 1, light = false } = {}) {
  ctx.save(); rr(ctx, b.x, b.y, b.w, b.h, b.r ?? 14); ctx.clip();
  ctx.fillStyle = light ? "#eef1f5" : "#0b1326"; ctx.fillRect(b.x, b.y, b.w, b.h);
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  ctx.translate(cx, cy); ctx.scale(zoom, zoom); ctx.translate(-cx, -cy);
  // blocks
  ctx.fillStyle = light ? "#e2e7ee" : "#111a2e";
  for (let i = -8; i < 20; i++) for (let j = -6; j < 14; j++) {
    const x = b.x + i * 120 + 14 + (j % 2) * 30, y = b.y + j * 90 + 12;
    if (hash(i + 40, j + 40) < 0.82) { rr(ctx, x, y, 92 - (hash(i, j) * 30), 66 - (hash(j, i) * 20), 4); ctx.fill(); }
  }
  // park / wadi
  ctx.fillStyle = light ? "#d8eadf" : "rgba(22,163,74,0.08)"; ctx.beginPath(); ctx.ellipse(b.x + b.w * 0.72, b.y + b.h * 0.28, 170, 90, -0.3, 0, TAU); ctx.fill();
  // roads
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  for (const [w, c] of [[22, light ? "#ffffff" : "#1e293b"], [2, light ? "#f6c76b" : "rgba(148,163,184,0.25)"]]) {
    ctx.strokeStyle = c; ctx.lineWidth = w;
    ROADS(b).forEach(path => { ctx.beginPath(); path.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); });
  }
  ctx.restore();
}
function ROADS(b) {
  const X = f => b.x + f * b.w, Y = f => b.y + f * b.h;
  return [
    [[X(-0.1), Y(0.62)], [X(0.3), Y(0.55)], [X(0.55), Y(0.58)], [X(1.1), Y(0.5)]],            // east–west highway
    [[X(0.42), Y(-0.1)], [X(0.45), Y(0.4)], [X(0.4), Y(0.75)], [X(0.46), Y(1.1)]],             // north–south
    [[X(0.15), Y(-0.1)], [X(0.2), Y(0.35)], [X(0.12), Y(1.1)]],
    [[X(0.75), Y(-0.1)], [X(0.8), Y(0.45)], [X(0.85), Y(1.1)]],
    [[X(-0.1), Y(0.2)], [X(0.5), Y(0.18)], [X(1.1), Y(0.25)]],
    [[X(-0.1), Y(0.88)], [X(0.6), Y(0.85)], [X(1.1), Y(0.9)]],
  ];
}
function along(path, u) { // point along polyline, u in 0..1
  const L = []; let tot = 0; for (let i = 1; i < path.length; i++) { const d = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); L.push(d); tot += d; }
  let d = clamp(u) * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i]) { const k = d / L[i]; return [lerp(path[i][0], path[i + 1][0], k), lerp(path[i][1], path[i + 1][1], k)]; } d -= L[i]; }
  return path[path.length - 1];
}
function mapPin(ctx, x, y, state, s = 1, { pulse = 0, label = null, rtl = false } = {}) {
  const [bg, ring] = PIN[state];
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (pulse > 0) { ctx.strokeStyle = rgba(bg.length === 7 ? bg : "#16A34A", 0.5 * (1 - pulse)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 18 + pulse * 30, 0, TAU); ctx.stroke(); }
  ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(0, 0, 17, 0, TAU); ctx.fill(); ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2.5; ctx.stroke();
  // car glyph (lucide "Car" simplified)
  ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.moveTo(-8, 3); ctx.lineTo(-8, -1); ctx.lineTo(-5, -6); ctx.lineTo(5, -6); ctx.lineTo(8, -1); ctx.lineTo(8, 3); ctx.closePath(); ctx.stroke();
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-4.5, 4.5, 1.8, 0, TAU); ctx.arc(4.5, 4.5, 1.8, 0, TAU); ctx.fill();
  ctx.restore();
  if (label) {
    ctx.save(); ctx.font = `600 ${15 * s}px ${F.mono}`; const w = ctx.measureText(label).width + 18 * s;
    const lx = rtl ? x - 26 * s - w : x + 26 * s;
    rr(ctx, lx, y - 14 * s, w, 28 * s, 6 * s); ctx.fillStyle = "rgba(15,23,42,0.92)"; ctx.fill(); ctx.strokeStyle = C.border; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = C.fg; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillText(label, lx + 9 * s, y + 1); ctx.restore();
  }
}

// ── App chrome ─────────────────────────────────────────────────────────────
// A browser-ish app window with the Fleetana sidebar. Returns content box.
function appWindow(ctx, b, { title = "", nav = [], active = 0, p = 1 } = {}) {
  card(ctx, b.x, b.y, b.w, b.h, { fill: C.bg, stroke: C.border, r: 18 });
  ctx.save(); rr(ctx, b.x, b.y, b.w, b.h, 18); ctx.clip();
  // top bar
  ctx.fillStyle = C.card2; ctx.fillRect(b.x, b.y, b.w, 52);
  ctx.fillStyle = C.border; ctx.fillRect(b.x, b.y + 52, b.w, 1);
  [0, 1, 2].forEach(i => { ctx.fillStyle = ["#475569", "#475569", "#475569"][i]; ctx.beginPath(); ctx.arc(bx(b, 26 + i * 20), b.y + 26, 6, 0, TAU); ctx.fill(); });
  // sidebar
  const sw = 230;
  ctx.fillStyle = C.card; ctx.fillRect(b.rtl ? b.x + b.w - sw : b.x, b.y + 53, sw, b.h - 53);
  ctx.fillStyle = C.border; ctx.fillRect(b.rtl ? b.x + b.w - sw : b.x + sw - 1, b.y + 53, 1, b.h - 53);
  // logo in sidebar: lockup top-left in LTR, top-right in RTL; never mirrored
  const lh = 20, lw = logoWidth(lh);
  drawLogo(ctx, b.rtl ? b.x + b.w - 24 - lw : b.x + 24, b.y + 78, lh, C.brand, 1);
  nav.forEach((n, i) => {
    const y = b.y + 130 + i * 48;
    if (i === active) { ctx.fillStyle = C.accentDeep; rr(ctx, b.rtl ? b.x + b.w - sw + 12 : b.x + 12, y - 4, sw - 24, 40, 8); ctx.fill(); }
    icon(ctx, n.icon, b.rtl ? b.x + b.w - 46 : b.x + 24, y + 4, 22, i === active ? C.accentFg : C.muted, 2);
    bt(ctx, b, n.label, 62, y - b.y + 22, { size: 18, weight: i === active ? 600 : 500, color: i === active ? C.accentFg : C.onVariant });
  });
  ctx.restore();
  return { x: b.rtl ? b.x + 24 : b.x + sw + 24, y: b.y + 76, w: b.w - sw - 48, h: b.h - 100, rtl: b.rtl };
}

// Table: cols = [{key, label, w, align, mono}], rows = objects; returns row y positions.
function table(ctx, b, cols, rows, { rowH = 58, headH = 46, reveal = 1, highlight = -1, hlColor = C.bad, hlP = 0 } = {}) {
  card(ctx, b.x, b.y, b.w, headH + rowH * rows.length + 8, { fill: C.card, stroke: C.border, r: 12, shadow: false });
  let cx = 20; const pos = cols.map(c => { const o = cx; cx += c.w; return o; });
  cols.forEach((c, i) => bt(ctx, b, c.label, pos[i] + (c.align === "right" ? c.w - 20 : 0), 30, { size: 15, weight: 600, color: C.muted, align: c.align || "left" }));
  ctx.fillStyle = C.border; ctx.fillRect(b.x, b.y + headH, b.w, 1);
  rows.forEach((r, k) => {
    const rp = E.hero(clamp(reveal * rows.length - k)); if (rp <= 0) return;
    const y = b.y + headH + k * rowH;
    ctx.save(); ctx.globalAlpha *= rp; ctx.translate(0, (1 - rp) * 14);
    if (k === highlight && hlP > 0) { ctx.fillStyle = rgba(hlColor, 0.14 * hlP); ctx.fillRect(b.x + 1, y + 1, b.w - 2, rowH - 1); ctx.fillStyle = rgba(hlColor, hlP); ctx.fillRect(b.rtl ? b.x + b.w - 4 : b.x, y, 4, rowH); }
    cols.forEach((c, i) => {
      const v = r[c.key]; if (v == null) return;
      if (typeof v === "function") { v(ctx, bx(b, pos[i] + (c.align === "right" ? c.w - 20 : 0)), y + rowH / 2); return; }
      const o = { size: 18, weight: c.bold ? 600 : 500, color: c.color || C.fg, align: c.align || "left" };
      (c.mono || c.num ? bn : bt)(ctx, { ...b, y }, String(v), pos[i] + (c.align === "right" ? c.w - 20 : 0), rowH / 2 + 7, { ...o, font: c.mono ? F.mono : (b.rtl && !c.num ? F.ar : F.ui) });
    });
    if (k < rows.length - 1) { ctx.fillStyle = "rgba(51,65,85,0.6)"; ctx.fillRect(b.x + 16, y + rowH, b.w - 32, 1); }
    ctx.restore();
    r._y = y;
  });
}
// Status pill colours used in the app UI (badges)
const PILLS = {
  good: { bg: "rgba(22,163,74,0.16)", fg: "#4ade80", dot: "#16A34A" },
  warn: { bg: "rgba(217,119,6,0.18)", fg: "#fbbf24", dot: "#D97706" },
  bad: { bg: "rgba(239,68,68,0.16)", fg: "#f87171", dot: "#ef4444" },
  info: { bg: "rgba(42,137,250,0.16)", fg: "#93c5fd", dot: "#2a89fa" },
  muted: { bg: "rgba(148,163,184,0.16)", fg: "#cbd5e1", dot: "#94A3B8" },
};
function statusPill(ctx, x, y, label, kind, { size = 16, rtl = false, align = "left", dot = true } = {}) {
  const P = PILLS[kind];
  return pill(ctx, x, y - size * 0.92, label, { bg: P.bg, fg: P.fg, dot: dot ? P.dot : null, size, font: rtl ? F.ar : F.ui, align: rtl ? (align === "left" ? "right" : align === "right" ? "left" : align) : align });
}

// Stat tile
function statTile(ctx, b, label, value, { sub = null, valueColor = C.fg, p = 1 } = {}) {
  card(ctx, b.x, b.y, b.w, b.h, { fill: C.card, stroke: C.border, r: 12, shadow: false });
  bt(ctx, b, label, 22, 38, { size: 16, weight: 500, color: C.muted });
  ctx.save(); ctx.font = `700 38px ${F.ui}`; const vs = Math.min(38, 38 * (b.w - 44) / ctx.measureText(value).width); ctx.restore();
  bn(ctx, b, value, 22, 92, { size: vs, weight: 700, color: valueColor, font: F.ui });
  if (sub) bt(ctx, b, sub, 22, 124, { size: 15, weight: 500, color: C.muted });
}

// Toast / notification (bell)
function toast(ctx, b, title, body, kind = "bad", p = 1) {
  const k = E.hero(clamp(p)); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k * 1.5); ctx.translate((b.rtl ? -1 : 1) * (1 - k) * 60, 0);
  card(ctx, b.x, b.y, b.w, b.h, { fill: "#16213a", stroke: rgba(PILLS[kind].dot, 0.6), r: 14 });
  ctx.fillStyle = PILLS[kind].dot; ctx.fillRect(b.rtl ? b.x + b.w - 5 : b.x, b.y + 14, 5, b.h - 28);
  icon(ctx, kind === "bad" ? "alert" : "bell", bx(b, 24) - (b.rtl ? 28 : 0), b.y + 22, 28, PILLS[kind].fg, 2.2);
  bt(ctx, b, title, 70, 44, { size: 21, weight: 700, color: C.fg });
  bt(ctx, b, body, 70, 76, { size: 17, weight: 500, color: C.onVariant });
  ctx.restore();
}

// ── Chaos props for the cold open ──────────────────────────────────────────
function spreadsheet(ctx, x, y, w, h, rows, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#e2e8f0"; ctx.fillRect(0, 0, w, 30); ctx.fillRect(0, 0, 40, h);
  ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1;
  for (let cx = 40; cx < w; cx += 130) { ctx.beginPath(); ctx.moveTo(cx + 0.5, 0); ctx.lineTo(cx + 0.5, h); ctx.stroke(); }
  for (let ry = 30; ry < h; ry += 30) { ctx.beginPath(); ctx.moveTo(0, ry + 0.5); ctx.lineTo(w, ry + 0.5); ctx.stroke(); }
  ctx.font = `500 15px ${F.ui}`; ctx.fillStyle = "#334155"; ctx.textBaseline = "middle";
  "ABCDEFGH".slice(0, Math.ceil((w - 40) / 130)).split("").forEach((c, i) => ctx.fillText(c, 40 + i * 130 + 60, 15));
  ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
  rows.forEach((r, i) => { ctx.fillStyle = "#64748b"; ctx.fillText(String(i + 1), 12, 45 + i * 30); r.forEach((c, j) => { ctx.fillStyle = c.startsWith("#") || c.startsWith("?") ? "#dc2626" : "#0f172a"; ctx.fillText(c, 48 + j * 130, 45 + i * 30); }); });
  ctx.restore();
}
function receipt(ctx, x, y, rot, lines) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  ctx.fillStyle = "#fbfaf6"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(220, 0); for (let i = 0; i <= 11; i++) ctx.lineTo(220 - i * 20, 300 + (i % 2) * 8); ctx.closePath(); ctx.fill();
  ctx.shadowColor = "transparent"; ctx.fillStyle = "#334155"; ctx.font = `500 14px ${F.mono}`; ctx.textAlign = "center";
  lines.forEach((l, i) => ctx.fillText(l, 110, 36 + i * 26));
  ctx.restore();
}
function sticky(ctx, x, y, rot, lines, color = "#fde68a") {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; ctx.fillStyle = color; ctx.fillRect(0, 0, 230, 210);
  ctx.shadowColor = "transparent"; ctx.fillStyle = "rgba(0,0,0,0.06)"; ctx.fillRect(0, 0, 230, 26);
  const ar = lines.some(l => /[\u0600-\u06FF]/.test(l));
  ctx.fillStyle = "#1f2937"; ctx.font = ar ? `600 26px ${F.ar}` : `600 24px "Comic Sans MS", ${F.ui}`; ctx.textAlign = "center"; ctx.direction = ar ? "rtl" : "ltr";
  lines.forEach((l, i) => ctx.fillText(l, 115, 80 + i * 40));
  ctx.restore();
}
function chatBubble(ctx, x, y, rot, s, { rtl = false, time = "21:47" } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.font = `500 22px ${rtl ? F.ar : F.ui}`; const w = Math.max(160, ctx.measureText(s).width + 110);
  ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#1f2c34"; rr(ctx, 0, 0, w, 64, 14); ctx.fill(); ctx.shadowColor = "transparent";
  ctx.fillStyle = "#e9edef"; ctx.textBaseline = "middle"; ctx.direction = rtl ? "rtl" : "ltr"; ctx.textAlign = rtl ? "right" : "left";
  ctx.fillText(s, rtl ? w - 18 : 18, 33);
  ctx.direction = "ltr"; ctx.textAlign = rtl ? "left" : "right"; ctx.fillStyle = "#8696a0"; ctx.font = `400 14px ${F.ui}`; ctx.fillText(time, rtl ? 16 : w - 16, 46);
  ctx.restore();
}
function paperChecklist(ctx, x, y, rot, rtl, items) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10; ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 260, 320);
  ctx.shadowColor = "transparent"; ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2;
  const cbx = rtl ? 214 : 24;   // checkbox column sits on the reading-start side
  items.forEach((it, i) => { ctx.strokeRect(cbx, 40 + i * 52, 22, 22); ctx.fillStyle = "#475569"; ctx.font = `500 17px ${rtl ? F.ar : F.ui}`;
    ctx.direction = rtl ? "rtl" : "ltr"; ctx.textAlign = rtl ? "right" : "left"; ctx.fillText(it, rtl ? 200 : 60, 58 + i * 52);
    if (i % 2 === 0) { ctx.strokeStyle = "#1d4ed8"; ctx.beginPath(); ctx.moveTo(cbx + 3, 52 + i * 52); ctx.lineTo(cbx + 10, 60 + i * 52); ctx.lineTo(cbx + 22, 40 + i * 52); ctx.stroke(); ctx.strokeStyle = "#94a3b8"; } });
  ctx.restore();
}
