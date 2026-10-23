// EMAIL SIGNATURE BANNER — 960×240 (shown at 480×120), ~4.4 s, plays once and holds on the logo.
// A pickup drives in, a scan checks lights / tyres / brakes (inspection — not engine diagnostics),
// the car folds away and the chevron F + FLEETANA build in its place.  ?fps=25 for the GIF, 60 for video.
const W = 960, H = 240, DUR = 4.6;
const FPS = +(new URLSearchParams(location.search).get("fps") || 60);
const CAR = { s: 0.48, y: 44 };                               // parked pickup: left in LTR, right in RTL
CAR.x = RTL ? W - 60 - 520 * CAR.s : 60;
const PTS = [                                              // check points on the pickup (vehicle units)
  { vx: 500, vy: 125, label: () => S.inspItems[0], at: 1.35 },   // lights (front)
  { vx: 418, vy: 172, label: () => S.inspItems[1], at: 1.65 },   // tyres (front wheel)
  { vx: 112, vy: 172, label: () => S.inspItems[2], at: 1.95 },   // brakes (rear wheel)
];
const vx2px = (vx, x0) => x0 + vx * CAR.s;
const HF = RTL ? F.ar : F.ui;

function check(ctx, x, y, r, k) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = "#16A34A"; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = "#fff"; ctx.lineWidth = r * 0.28; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.beginPath(); ctx.moveTo(-r * 0.42, 0); ctx.lineTo(-r * 0.1, r * 0.32); ctx.lineTo(r * 0.45, -r * 0.32); ctx.stroke();
  ctx.restore();
}
function brackets(ctx, x, y, w, h, k, color) {
  const L = 18 * k, off = (1 - k) * 18;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.globalAlpha *= clamp(k * 1.5);
  [[x - off, y - off, 1, 1], [x + w + off, y - off, -1, 1], [x - off, y + h + off, 1, -1], [x + w + off, y + h + off, -1, -1]].forEach(([px, py, sx, sy]) => {
    ctx.beginPath(); ctx.moveTo(px, py + sy * L); ctx.lineTo(px, py); ctx.lineTo(px + sx * L, py); ctx.stroke(); });
  ctx.restore();
}

function scene(ctx, t) {
  // background: white so it blends into any email, with a whisper of the particle network
  ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.5;
  for (let i = 0; i < 26; i++) { const x = hash(i, 1) * W, y = hash(i, 2) * H; ctx.fillStyle = "rgba(0,81,213,0.18)"; ctx.beginPath(); ctx.arc(x, y, 2, 0, TAU); ctx.fill(); }
  ctx.restore();

  const fold = E.inOutExpo(seg(t, 2.5, 2.95));                     // car + HUD fold into the mark
  const MX = RTL ? W - 120 : 120;                                  // where the mark is born
  // ── car drive-in ──
  const drive = E.outCubic(seg(t, 0, 0.85));
  const cx = RTL ? lerp(W + 10, CAR.x, drive) : lerp(-260, CAR.x, drive), moving = t < 0.85;
  const carW = 520 * CAR.s, carH = 210 * CAR.s;
  if (fold < 1) {
    ctx.save();
    // fold: shrink toward the mark position
    const fx = MX, fy = H / 2;
    ctx.translate(lerp(0, fx - (CAR.x + carW / 2), fold), lerp(0, fy - (CAR.y + carH / 2), fold));
    ctx.translate(CAR.x + carW / 2, CAR.y + carH / 2); ctx.scale(1 - fold * 0.85, 1 - fold * 0.85); ctx.translate(-(CAR.x + carW / 2), -(CAR.y + carH / 2));
    ctx.globalAlpha = 1 - fold;
    ctx.save(); if (RTL) { ctx.translate(2 * cx + carW, 0); ctx.scale(-1, 1); }   // faces left, driving in from the right
    vehicle(ctx, "pickup", cx, CAR.y, CAR.s, { t, moving });
    ctx.restore();
    // HUD brackets lock on
    const bk = E.outBack(seg(t, 0.75, 1.1));
    if (bk > 0) brackets(ctx, CAR.x - 14, CAR.y + 2, carW + 28, carH + 4, bk, C.brand);
    // scan line sweeps the car
    const sp = seg(t, 1.05, 2.15);
    if (sp > 0 && sp < 1) {
      const sx = RTL ? lerp(CAR.x + carW + 10, CAR.x - 10, E.inOutSine(sp)) : lerp(CAR.x - 10, CAR.x + carW + 10, E.inOutSine(sp));
      const g = ctx.createLinearGradient(sx + (RTL ? 60 : -60), 0, sx, 0);
      g.addColorStop(0, "rgba(42,137,250,0)"); g.addColorStop(1, "rgba(42,137,250,0.22)");
      ctx.fillStyle = g; ctx.fillRect(Math.min(sx, sx + (RTL ? 60 : -60)), CAR.y - 4, 60, carH + 12);
      ctx.fillStyle = C.brand; ctx.fillRect(sx - 1.5, CAR.y - 8, 3, carH + 20);
    }
    // check points pop as the scan passes
    PTS.forEach(p => {
      const k = E.outBack(seg(t, p.at, p.at + 0.25)); if (k <= 0) return;
      let px = vx2px(p.vx, CAR.x); if (RTL) px = 2 * CAR.x + carW - px;
      const py = CAR.y + p.vy * CAR.s;
      ctx.strokeStyle = `rgba(22,163,74,${0.45 * (1 - seg(t, p.at, p.at + 0.6))})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(px, py, 12 + 26 * seg(t, p.at, p.at + 0.6), 0, TAU); ctx.stroke();
      check(ctx, px, py, 12, k);
    });
    ctx.restore();
  }
  // ── checklist on the right ──
  const listOut = E.inOutExpo(seg(t, 2.5, 2.9));
  if (listOut < 1) {
    ctx.save(); ctx.globalAlpha = 1 - listOut; ctx.translate((RTL ? -1 : 1) * listOut * 40, 0);
    const lx = RTL ? 50 : 390, lw = 520;
    text(ctx, RTL ? "فحص المركبة" : "Vehicle check", RTL ? lx + lw : lx, 52, { size: 22, weight: 700, font: HF, color: C.accentText, align: RTL ? "right" : "left", dir: RTL ? "rtl" : "ltr", alpha: E.hero(seg(t, 0.8, 1.2)) });
    PTS.forEach((p, i) => {
      const k = E.hero(seg(t, p.at, p.at + 0.35)); if (k <= 0) return;
      const y = 92 + i * 50;
      ctx.save(); ctx.globalAlpha *= k; ctx.translate((RTL ? -1 : 1) * (1 - k) * 24, 0);
      rr(ctx, lx, y, lw, 40, 10); ctx.fillStyle = "#F7F9FB"; ctx.fill(); ctx.strokeStyle = "#E3E4E8"; ctx.lineWidth = 1.5; ctx.stroke();
      text(ctx, p.label(), RTL ? lx + lw - 18 : lx + 18, y + 27, { size: 21, weight: 600, font: HF, color: C.fg, align: RTL ? "right" : "left", dir: RTL ? "rtl" : "ltr" });
      ctx.font = `700 18px ${HF}`; const pw = ctx.measureText(S.pass).width + 30, px = RTL ? lx + 12 : lx + lw - 12 - pw;
      rr(ctx, px, y + 7, pw, 26, 13); ctx.fillStyle = "#16A34A"; ctx.fill();
      text(ctx, S.pass, px + pw / 2, y + 26, { size: 18, weight: 700, font: HF, color: "#fff", align: "center", dir: RTL ? "rtl" : "ltr" });
      ctx.restore();
    });
    ctx.restore();
  }
  // ── logo builds where the car was, then settles centred ──
  if (t > 2.85) {
    const u = t - 2.85, lh = 66, lw = logoWidth(lh);
    const settle = E.inOutExpo(seg(u, 0.55, 1.05));
    const x = lerp(MX - (lh * MARK_BOX.w / MARK_BOX.h) / 2, (W - lw) / 2, settle);
    drawLogo(ctx, x, H / 2 - lh / 2, lh, C.brand, seg(u, 0, 1.0), { letters: false });   // chevrons slide in
    drawLogo(ctx, x, H / 2 - lh / 2, lh, C.brand, seg(u, 0.75, 1.55), { mark: false });
    // one sheen across the finished logo
    const sh = seg(t, 4.05, 4.45);
    if (sh > 0 && sh < 1) {
      ctx.save(); ctx.globalCompositeOperation = "source-atop";
      const sx = lerp(x - 80, x + lw + 80, sh);
      const g = ctx.createLinearGradient(sx - 50, 0, sx + 50, 0);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.75)"); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g; ctx.fillRect(sx - 50, 0, 100, H); ctx.restore();
    }
  }
}

film({ w: W, h: H, fps: FPS, dur: DUR, render(ctx, t) { scene(ctx, t); } });
