// Brand asset exporter: transparent PNGs for documents, decks and email.  assets.html?asset=<name>&theme=light
const A = new URLSearchParams(location.search).get("asset");
const ICON_NAMES = ["truck", "wrench", "fuel", "clipboard", "check", "calendar", "pin", "shield", "chart", "users", "alert", "bell", "box", "camera", "arrowRight"];
function particles(ctx, w, h, n, seed, alpha = 1) {
  const pts = []; for (let i = 0; i < n; i++) pts.push([hash(i + seed, 1) * w, hash(i + seed, 2) * h, hash(i + seed, 5) * 1.5 + 0.8]);
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(0,81,213,0.28)"; pts.forEach(p => { ctx.beginPath(); ctx.arc(p[0], p[1], p[2] * 2.2, 0, TAU); ctx.fill(); });
  ctx.lineWidth = 1.6;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]), lim = Math.min(w, h) * 0.16;
    if (d < lim) { ctx.strokeStyle = `rgba(0,81,213,${0.16 * (1 - d / lim)})`; ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke(); }
  }
  ctx.restore();
}
const ASSETS = {
  "logo-blue": { w: 2400, h: 330, draw: c => drawLogo(c, 40, 20, 290, C.brand, 1) },
  "logo-white": { w: 2400, h: 330, draw: c => drawLogo(c, 40, 20, 290, "#ffffff", 1) },
  "logo-black": { w: 2400, h: 330, draw: c => drawLogo(c, 40, 20, 290, "#000000", 1) },
  "mark-blue": { w: 1024, h: 1024, draw: c => drawMark(c, 512, 512, 760, C.brand, 1) },
  "mark-white": { w: 1024, h: 1024, draw: c => drawMark(c, 512, 512, 760, "#ffffff", 1) },
  // light textures (transparent) — the landing page's particle network
  "texture-a4": { w: 2480, h: 3508, draw: c => particles(c, 2480, 3508, 90, 7) },
  "texture-16x9": { w: 3840, h: 2160, draw: c => particles(c, 3840, 2160, 80, 3) },
  "texture-band": { w: 3840, h: 900, draw: c => particles(c, 3840, 900, 40, 11) },
  // opaque covers: Paper + particle network, with a Tint field at the foot
  "cover-a4": { w: 2480, h: 3508, draw: c => { c.fillStyle = "#F7F9FB"; c.fillRect(0, 0, 2480, 3508);
      const g = c.createLinearGradient(0, 2300, 0, 3508); g.addColorStop(0, "rgba(232,242,255,0)"); g.addColorStop(1, "rgba(232,242,255,1)"); c.fillStyle = g; c.fillRect(0, 2300, 2480, 1208);
      particles(c, 2480, 3508, 110, 7); } },
  "cover-16x9": { w: 3840, h: 2160, draw: c => { c.fillStyle = "#F7F9FB"; c.fillRect(0, 0, 3840, 2160);
      const g = c.createRadialGradient(3000, 1700, 0, 3000, 1700, 2200); g.addColorStop(0, "rgba(232,242,255,1)"); g.addColorStop(1, "rgba(232,242,255,0)"); c.fillStyle = g; c.fillRect(0, 0, 3840, 2160);
      particles(c, 3840, 2160, 90, 3); } },
  "divider-16x9": { w: 3840, h: 2160, draw: c => { c.fillStyle = "#E8F2FF"; c.fillRect(0, 0, 3840, 2160); particles(c, 3840, 2160, 60, 19, 0.8); } },
  // product UI as illustration (2× for crisp print / projection)
  "ui-vehicles": { w: 1880, h: 900, draw: c => { c.scale(2, 2); c.translate(10, 30); vehiclesCard(c, 920, 5, true); } },
  "ui-reminders": { w: 1880, h: 780, draw: c => { c.scale(2, 2); c.translate(10, 10); remindersCard(c, 920); } },
  "ui-fuel": { w: 1880, h: 1160, draw: c => { c.scale(2, 2); c.translate(10, 10); fuelChart(c, 920, 560); } },
  "ui-inspection": { w: 1880, h: 790, draw: c => { c.scale(2, 2); c.translate(10, 10); inspectionCard(c, 920); } },
  "ui-drivers": { w: 1880, h: 700, draw: c => { c.scale(2, 2); c.translate(10, 10); driverCard(c, 920); } },
  "ui-papers": { w: 1880, h: 1020, draw: c => { c.scale(2, 2); c.translate(-70, -40);
      [[S.docFahes, FLEET[2], "16/11/2026", 26], [S.docInsurance, FLEET[4], "09/11/2026", 19], [S.docIstimara, FLEET[1], "02/11/2026", 12]]
        .forEach((d, i) => docCardS(c, 80, 50 + i * 96, 920, 340, d[0], `${d[1].model} · ${d[1].plate}`, d[2], d[3], i < 2)); } },
  "ui-map": { w: 1880, h: 1100, draw: c => { c.scale(2, 2); const mb = { x: 10, y: 10, w: 920, h: 530, r: 20 };
      mapBase(c, mb, 0, { zoom: 1.2 }); c.strokeStyle = C.border; c.lineWidth = 2; rr(c, mb.x, mb.y, mb.w, mb.h, 20); c.stroke();
      const roads = ROADS(mb); [[0, 0.3, "moving"], [1, 0.55, "idling"], [3, 0.35, "moving"], [5, 0.6, "parked"], [2, 0.4, "stale"], [4, 0.2, "moving"]].forEach(([r, u, st]) => { const p = along(roads[r], u); mapPin(c, p[0], p[1], st, 1.4); }); } },
  // profile illustrations: per-vehicle cost breakdown and route optimisation (demo data)
  "ui-costs": { w: 1880, h: 1100, draw: c => { c.scale(2, 2); c.translate(10, 10); costCard(c, 920, 530); } },
  "ui-route": { w: 1880, h: 1100, draw: c => { c.scale(2, 2); routeMap(c, { x: 10, y: 10, w: 920, h: 530, r: 20 }); } },
};
const L2 = (en, ar) => (RTL ? ar : en);
function costCard(c, w, h) {
  card(c, 0, 0, w, h, { fill: "#fff", r: 20 });
  const b = box(w), v = FLEET[1];
  bn(c, b, `${v.model} · ${v.plate}`, 36, 56, { size: 26, weight: 700, color: C.fg });
  bt(c, b, L2("Cost this year", "التكلفة هذا العام"), 36, 92, { size: 20, weight: 500, color: C.muted });
  bn(c, b, "SAR 48,620.00", 36, 158, { size: 50, weight: 700, color: C.fg });
  statusPill(c, bx(b, w - 36), 64, L2("SAR 0.71 / km", "0.71 ريال / كم"), "info", { size: 20, rtl: RTL, align: "right", dot: false });
  const parts = [[L2("Fuel", "الوقود"), 27940, C.brand], [L2("Work orders", "أوامر العمل"), 12530, "#0051D5"], [L2("Service", "الصيانة"), 8150, "#93C5FD"]];
  const tot = parts.reduce((a, p) => a + p[1], 0), bw = w - 72; let x0 = 0;
  parts.forEach(([, v2, col], i) => { const ww = bw * v2 / tot; c.fillStyle = col; rr(c, RTL ? w - 36 - x0 - ww : 36 + x0, 196, ww - (i < 2 ? 4 : 0), 26, 6); c.fill(); x0 += ww; });
  parts.forEach(([lbl, v2, col], i) => {
    const y = 262 + i * 62;
    c.fillStyle = col; rr(c, RTL ? w - 36 - 18 : 36, y + 2, 18, 18, 5); c.fill();
    bt(c, b, lbl, 66, y + 18, { size: 22, weight: 600, color: C.fg });
    bn(c, b, `SAR ${fmt(v2, 2)}`, w * 0.66, y + 18, { size: 22, weight: 600, color: C.fg, align: "right" });
    bn(c, b, `${Math.round(v2 / tot * 100)}%`, w - 36, y + 18, { size: 22, weight: 700, color: C.muted, align: "right" });
    if (i < 2) { c.fillStyle = C.rowLine; c.fillRect(36, y + 40, w - 72, 1); }
  });
  statusPill(c, bx(b, 36), h - 34, L2("2 fuel fills flagged Low", "تعبئتان بعلامة «منخفض»"), "warn", { size: 20, rtl: RTL });
}
function routeMap(c, mb) {
  mapBase(c, mb, 0, { zoom: 1.0 }); c.strokeStyle = C.border; c.lineWidth = 2; rr(c, mb.x, mb.y, mb.w, mb.h, 20); c.stroke();
  const P = pts => pts.map(([fx, fy]) => [mb.x + (RTL ? 1 - fx : fx) * mb.w, mb.y + fy * mb.h]);
  const line = (pts, col, wdt, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = wdt; c.lineCap = "round"; c.lineJoin = "round"; c.setLineDash(dash || []); c.beginPath(); pts.forEach(([x, y], k) => (k ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke(); c.restore(); };
  const driven = P([[0.08, 0.6], [0.2, 0.57], [0.2, 0.35], [0.2, 0.19], [0.47, 0.18], [0.45, 0.4], [0.42, 0.62], [0.42, 0.78], [0.42, 0.86], [0.62, 0.85], [0.8, 0.46], [0.8, 0.25], [0.78, 0.53], [0.9, 0.51]]);
  const best = P([[0.08, 0.6], [0.3, 0.555], [0.42, 0.57], [0.55, 0.58], [0.8, 0.53], [0.9, 0.51]]);
  line(driven, "rgba(100,116,139,0.55)", 7, [2, 12]);
  line(best, "#ffffff", 14); line(best, C.brand, 8);
  const stops = P([[0.08, 0.6], [0.42, 0.57], [0.55, 0.58], [0.9, 0.51]]);
  stops.forEach(([x, y], i) => { c.fillStyle = i === 0 ? C.fg : C.brand; c.beginPath(); c.arc(x, y, 15, 0, TAU); c.fill(); c.strokeStyle = "#fff"; c.lineWidth = 3; c.stroke();
    text(c, i === 0 ? "A" : String(i), x, y + 6, { size: 16, weight: 700, font: F.ui, color: "#fff", align: "center" }); });
  mapPin(c, ...along(best, 0.7), "moving", 1.1);
  const lw = 330, lx = RTL ? mb.x + 20 : mb.x + mb.w - lw - 20, ly = mb.y + mb.h - 150, lb = { x: lx, y: ly, w: lw, rtl: RTL };
  card(c, lx, ly, lw, 130, { fill: "#fff", r: 14 });
  c.fillStyle = C.brand; c.fillRect(RTL ? lx + lw - 58 : lx + 22, ly + 38, 36, 6);
  bt(c, lb, L2("Optimised", "المسار الأمثل"), 72, 46, { size: 18, weight: 600, color: C.fg });
  bn(c, lb, "64 km", lw - 22, 46, { size: 20, weight: 700, color: C.fg, align: "right" });
  c.fillStyle = "rgba(100,116,139,0.6)"; for (let k = 0; k < 3; k++) c.fillRect((RTL ? lx + lw - 58 : lx + 22) + k * 13, ly + 78, 7, 6);
  bt(c, lb, L2("Driven", "المسار الفعلي"), 72, 86, { size: 18, weight: 600, color: C.muted });
  bn(c, lb, "86 km", lw - 22, 86, { size: 20, weight: 700, color: C.muted, align: "right" });
  statusPill(c, bx(lb, lw - 22), ly + 116, "−22 km", "good", { size: 16, rtl: RTL, align: "right", dot: false });
}
ICON_NAMES.forEach(n => { ASSETS[`icon-${n}`] = { w: 256, h: 256, draw: c => icon(c, n, 28, 28, 200, C.accentText, 2) }; });
const a = ASSETS[A] || ASSETS["logo-blue"];
W = a.w; H = a.h;
film({ w: a.w, h: a.h, fps: 60, dur: 1 / 60, render(c) { c.clearRect(0, 0, a.w, a.h); a.draw(c); } });
window.ASSET_LIST = [...Object.keys(ASSETS)];
