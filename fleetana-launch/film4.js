// REEL — "Every vehicle. One live map." · 15 s · 1080×1920
// Fleet map (app/(app)/map/fleet-map.tsx pin colours, ~10 s refresh) + driver performance
// (lib/telematics/driver-score.ts bands). Both need a GPS tracker, so the tag stays on screen.
const W = 1080, H = 1920, DUR = 15;
const HF = RTL ? F.ar : F.head, DIR = RTL ? "rtl" : "ltr";
const T = { map: 2.2, drivers: 6.8, end: 11.8 };

function hook(ctx, t, y0) {
  const out = E.inOutExpo(seg(t, T.map - 0.4, T.map));
  ctx.save(); ctx.globalAlpha *= 1 - out * 0.0; // the hook stays as the title, it just rises
  const rise = E.inOutExpo(seg(t, T.map - 0.5, T.map + 0.2));
  S.posts.map.hook.forEach((l, i) => riseText(ctx, l, W / 2, lerp(820, y0, rise) + i * 112, seg(t, 0.15 + i * 0.25, 0.9 + i * 0.25),
    { size: lerp(104, 84, rise), weight: 700, font: HF, color: i ? C.accentText : C.heading, align: "center", dir: DIR, track: RTL ? 0 : -2 }));
  ctx.restore();
}

function mapScene(ctx, t) {
  const u = t - T.map, k = E.hero(seg(u, 0, 0.7)), out = E.inOutExpo(seg(t, T.end - 0.4, T.end));
  if (k <= 0 || out >= 1) return;
  const mb = { x: 70, y: 600, w: 940, h: 900, r: 24 };
  ctx.save(); ctx.globalAlpha *= k * (1 - out); ctx.translate(0, (1 - k) * 200 - out * 120);
  card(ctx, mb.x, mb.y, mb.w, mb.h, { fill: "#fff", r: 24 });
  mapBase(ctx, mb, t, { zoom: 1.15 + u * 0.01 });
  ctx.strokeStyle = C.border; ctx.lineWidth = 2; rr(ctx, mb.x, mb.y, mb.w, mb.h, 24); ctx.stroke();
  const roads = ROADS(mb);
  const vs = [[0, 0.08, "moving", 0.05], [1, 0.25, "moving", 0.04], [2, 0.5, "idling", 0], [3, 0.15, "moving", 0.045], [4, 0.7, "parked", 0], [5, 0.35, "moving", 0.03], [1, 0.8, "parked", 0], [2, 0.12, "stale", 0]];
  ctx.save(); rr(ctx, mb.x, mb.y, mb.w, mb.h, 24); ctx.clip();
  vs.forEach(([r, u0, st, sp], i) => {
    const uu = u0 + sp * u, p = along(roads[r], uu);
    if (st === "moving") { ctx.strokeStyle = "rgba(34,197,94,0.55)"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath();
      for (let q = 0; q <= 12; q++) { const pp = along(roads[r], uu - 0.08 * (1 - q / 12)); q ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1]); } ctx.stroke(); }
    const pk = E.outBack(seg(u, 0.2 + i * 0.08, 0.6 + i * 0.08));
    if (pk > 0) mapPin(ctx, p[0], p[1], st, 1.45 * pk, { pulse: st === "idling" ? fract(u * 0.8) : 0,
      label: i === 2 && u > 1.6 ? `${FLEET[2].plate} · ${S.idle} 41 ${S.u.min}` : null, rtl: false });
  });
  ctx.restore();
  pill(ctx, RTL ? mb.x + mb.w - 24 : mb.x + 24, mb.y + 24, S.mapLive, { bg: C.overlay, fg: C.green, dot: "#16A34A", size: 24, font: RTL ? F.ar : F.ui, align: RTL ? "right" : "left" });
  // legend: counts match the pins drawn
  const leg = [[S.moving, "moving", 4], [S.idle, "idling", 1], [S.parked, "parked", 2], [S.noSignal, "stale", 1]];
  let lx = RTL ? mb.x + mb.w - 24 : mb.x + 24, ly = mb.y + mb.h - 76;
  leg.forEach(([l, st, n], j) => {
    if (j === 2) { lx = RTL ? mb.x + mb.w - 24 : mb.x + 24; ly += 0; }
    const w = pill(ctx, lx, j < 2 ? ly - 60 : ly, `${l} ${n}`, { bg: C.overlay, fg: C.fg, dot: PIN[st][0], size: 22, font: RTL ? F.ar : F.ui, align: RTL ? "right" : "left" });
    lx += (RTL ? -1 : 1) * (w + 12);
  });
  ctx.restore();
}

function driversScene(ctx, t) {
  const u = t - T.drivers, k = E.hero(seg(u, 0, 0.6)), out = E.inOutExpo(seg(t, T.end - 0.4, T.end));
  if (k <= 0 || out >= 1) return;
  const w = 880, x = (W - w) / 2, y = 860;
  ctx.save(); ctx.globalAlpha *= k * (1 - out); ctx.translate(0, (1 - k) * 260);
  card(ctx, x, y, w, 420, { fill: "#fff", r: 24 });
  const b = { x, y, w, rtl: RTL };
  bt(ctx, b, S.driverPerf, 40, 64, { size: 34, weight: 700, color: C.fg });
  [[S.drivers[0], 94, S.excellent, "good"], [S.drivers[1], 81, S.good, "info"], [S.drivers[2], 63, S.fair, "warn"]].forEach(([n, sc, band, kind], i) => {
    const yy = 110 + i * 96, sk = E.outCubic(seg(u, 0.3 + i * 0.12, 1.1 + i * 0.12));
    bt(ctx, b, n, 40, yy + 36, { size: 28, weight: 600, color: C.fg });
    bn(ctx, b, String(Math.round(sc * sk)), w * 0.62, yy + 38, { size: 42, weight: 700, color: C.fg, align: "right" });
    statusPill(ctx, bx(b, w - 40), y + yy + 26, band, kind, { size: 20, rtl: RTL, align: "right", dot: false });
    ctx.fillStyle = C.track; ctx.fillRect(x + 40, y + yy + 60, w - 80, 7);
    ctx.fillStyle = PILLS[kind].dot; const bw = (w - 80) * sc / 100 * sk; ctx.fillRect(RTL ? x + w - 40 - bw : x + 40, y + yy + 60, bw, 7);
  });
  // one line on how it is scored (driver-score.ts)
  const lk = E.hero(seg(u, 1.4, 2.0));
  ctx.globalAlpha *= lk;
  const lines = wrapLines(ctx, S.posts.drivers.points[1], 880, `500 30px ${RTL ? F.ar : F.ui}`);
  lines.forEach((l, i) => text(ctx, l, W / 2, y + 490 + i * 46, { size: 30, weight: 500, font: RTL ? F.ar : F.ui, color: C.onVariant, align: "center", dir: DIR }));
  ctx.restore();
}

function endCard(ctx, t) {
  const u = t - T.end;
  const glow = ctx.createRadialGradient(W / 2, 800, 0, W / 2, 800, 900);
  glow.addColorStop(0, rgba(C.brand, 0.14 * seg(u, 0, 1))); glow.addColorStop(1, rgba(C.brand, 0)); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  const lh = 100, lw = logoWidth(lh);
  drawLogo(ctx, W / 2 - lw / 2, 700, lh, C.brand, seg(u, 0, 1.1));
  if (RTL) text(ctx, S.brandName, W / 2, 900, { size: 46, weight: 600, font: F.ar, color: C.heading, align: "center", alpha: E.hero(seg(u, 0.6, 1.2)), dir: "rtl" });
  S.f3.cta.forEach((l, i) => riseText(ctx, l, W / 2, (RTL ? 1060 : 1010) + i * 104, seg(u, 0.6 + i * 0.2, 1.3 + i * 0.2),
    { size: RTL ? 80 : 86, weight: 700, font: HF, color: i ? C.accentText : C.heading, align: "center", dir: DIR, track: RTL ? 0 : -2 }));
  const bk = E.hero(seg(u, 1.0, 1.5));
  if (bk > 0) { ctx.save(); ctx.globalAlpha *= bk; ctx.font = `600 44px ${F.ui}`; const w = ctx.measureText(S.url).width + 110;
    rr(ctx, W / 2 - w / 2, 1290, w, 100, 50); ctx.fillStyle = C.btn; ctx.fill();
    text(ctx, S.url, W / 2, 1355, { size: 44, weight: 600, font: F.ui, color: "#fff", align: "center" }); ctx.restore(); }
  const fo = seg(t, DUR - 0.4, DUR); if (fo > 0) { ctx.fillStyle = `rgba(${C.fadeRGB},${E.inCubic(fo)})`; ctx.fillRect(0, 0, W, H); }
}

film({
  w: W, h: H, fps: 60, dur: DUR, audio: "audio/film4.wav",
  render(ctx, t) {
    kineticBg(ctx, W, H, t, { alpha: 0.6, density: 1.2 });
    if (t < T.end) {
      const titleOut = E.inOutExpo(seg(t, T.end - 0.4, T.end));
      ctx.save(); ctx.globalAlpha = 1 - titleOut; hook(ctx, t, 400); ctx.restore();
      mapScene(ctx, t);
      // map pushes up and dims behind the driver card
      if (t > T.drivers) { const d = E.hero(seg(t, T.drivers, T.drivers + 0.6)) * (1 - E.inOutExpo(seg(t, T.end - 0.4, T.end)));
        ctx.fillStyle = `rgba(${C.scrimRGB},${0.82 * d})`; ctx.fillRect(0, 560, W, 1000); }
      driversScene(ctx, t);
      const tk = E.hero(seg(t, T.map + 0.6, T.map + 1.2)) * (1 - E.inOutExpo(seg(t, T.end - 0.4, T.end)));
      if (tk > 0) { ctx.save(); ctx.globalAlpha *= tk; statusPill(ctx, W / 2, 1580, S.f1.tracker, "info", { size: 28, rtl: RTL, align: "center" }); ctx.restore(); }
    }
    if (t >= T.end) endCard(ctx, t);
  },
});
