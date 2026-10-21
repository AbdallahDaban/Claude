// FILM 3 — vertical social cut · 20 s · 1080×1920 (Snapchat / TikTok / Reels / Shorts)
// Text stays inside the platform safe zone (clear of the top ~250 px and bottom ~380 px).
const W = 1080, H = 1920, DUR = 20;
const CARDS = [2.4, 5.8, 9.2, 12.6, 16.0];          // card starts; last value = end card
const HF = RTL ? F.ar : F.head, DIR = RTL ? "rtl" : "ltr";
const AL = a => (RTL ? (a === "left" ? "right" : a === "right" ? "left" : a) : a);

// story-style progress bars (one per card)
function progress(ctx, t) {
  const a = seg(t, CARDS[0] - 0.2, CARDS[0]) * (1 - seg(t, CARDS[4] - 0.2, CARDS[4]));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const n = 4, gap = 10, w = (W - 120 - gap * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    const x = RTL ? W - 60 - (i + 1) * w - i * gap : 60 + i * (w + gap);
    ctx.fillStyle = "rgba(226,232,240,0.25)"; rr(ctx, x, 290, w, 6, 3); ctx.fill();
    const p = seg(t, CARDS[i], CARDS[i + 1]);
    ctx.fillStyle = "#ffffff"; rr(ctx, RTL ? x + w * (1 - p) : x, 290, w * p, 6, 3); ctx.fill();
  }
  // tiny brand row under the bars, like a story header
  drawMark(ctx, RTL ? W - 88 : 88, 348, 34, C.brand, 1);
  text(ctx, S.brandName, RTL ? W - 124 : 124, 360, { size: 26, weight: 700, font: RTL ? F.ar : F.head, color: C.fg, align: AL("left"), dir: DIR });
  ctx.restore();
}

function hook(ctx, t) {
  const out = E.inOutExpo(seg(t, CARDS[0] - 0.35, CARDS[0]));
  ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(0, -out * 160);
  // spreadsheet + chats piling behind the question
  const R = RTL ? [["المركبة", "الزيت", "الاستمارة"], ["هايلكس", "85,000?", "#REF!"], ["هايس", "??", "انتهت؟"], ["ايسوزو", "71,500", "??"]]
    : [["Vehicle", "Oil due", "Istimara"], ["Hilux", "85,000?", "#REF!"], ["Hiace", "??", "expired?"], ["Isuzu", "71,500", "??"]];
  const k1 = E.outBack(seg(t, 0.05, 0.5));
  if (k1 > 0) { ctx.save(); ctx.globalAlpha *= clamp(k1); ctx.translate(540, 1200); ctx.rotate(-0.06); ctx.scale(1.95 * k1, 1.95 * k1); spreadsheet(ctx, -230, -70, 460, 150, R, t); ctx.restore(); }
  const chats = RTL ? ["وين فاتورة الديزل؟", "الكفر الخلفي فيه شي", "متى صيانة الهايس؟"] : ["Where's the diesel receipt?", "Rear tyre looks bad", "When is the Hiace due?"];
  chats.forEach((c, i) => { const k = E.outBack(seg(t, 0.35 + i * 0.28, 0.75 + i * 0.28)); if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(k); ctx.translate(RTL ? 760 - i * 100 : 240 + i * 90, 1420 + i * 130); ctx.scale(1.7 * k, 1.7 * k); chatBubble(ctx, -110, 0, (i - 1) * 0.04, c, { rtl: RTL, time: `22:${String(14 + i * 7)}` }); ctx.restore(); });
  S.f3.hook.forEach((l, i) => riseText(ctx, l, W / 2, 620 + i * 120, seg(t, 0.2 + i * 0.22, 0.95 + i * 0.22),
    { size: RTL ? 92 : 100, weight: 700, font: HF, color: i ? C.brand : C.heading, align: "center", dir: DIR, track: RTL ? 0 : -2 }));
  ctx.restore();
}

// card frame: caption on top, UI below; enters by swiping up
function cardScene(ctx, t, i, draw) {
  const a = CARDS[i], b = CARDS[i + 1];
  if (t < a - 0.05 || t > b + 0.05) return;
  const lt = t - a, inK = E.hero(seg(lt, 0, 0.55)), out = E.inOutExpo(seg(t, b - 0.3, b));
  ctx.save(); ctx.globalAlpha *= clamp(inK * 1.5) * (1 - out); ctx.translate(0, (1 - inK) * 220 - out * 260);
  const lines = S.f3.cards[i];
  ctx.font = `700 92px ${HF}`; const fs = Math.min(92, 92 * 940 / Math.max(...lines.map(l => ctx.measureText(l).width)));
  lines.forEach((l, j) => riseText(ctx, l, W / 2, 540 + j * fs * 1.15, seg(lt, 0.1 + j * 0.12, 0.75 + j * 0.12),
    { size: fs, weight: 700, font: HF, color: j ? C.brand : C.heading, align: "center", dir: DIR, track: RTL ? 0 : -1.5 }));
  draw(lt, { x: 70, y: 760, w: W - 140, rtl: RTL });
  ctx.restore();
}

const DRAW = [
  // fuel fill flagged
  (ctx, lt, b) => {
    card(ctx, b.x, b.y, b.w, 640, { fill: C.card, stroke: C.border, r: 28 });
    bt(ctx, b, S.fuelTitle, 48, 80, { size: 38, weight: 700, color: C.fg });
    bn(ctx, b, `${FLEET[1].model} · ${FLEET[1].plate}`, 48, 126, { size: 26, weight: 500, color: C.muted });
    const flag = E.hero(seg(lt, 1.2, 1.6)), v = lerp(9.2, 5.9, E.inOutCubic(seg(lt, 0.5, 1.3)));
    bn(ctx, b, v.toFixed(1), 48, 300, { size: 150, weight: 700, color: flag > 0.5 ? "#fbbf24" : C.fg });
    ctx.save(); ctx.font = `700 150px ${F.ui}`; const vw = ctx.measureText(v.toFixed(1)).width; ctx.restore();
    bt(ctx, b, S.u.kmL, 48 + vw + 20, 296, { size: 44, weight: 600, color: C.muted });
    if (flag > 0) { ctx.save(); ctx.globalAlpha *= flag; statusPill(ctx, bx(b, b.w - 48), b.y + 250, S.low, "warn", { size: 34, rtl: RTL, align: "right", dot: false }); ctx.restore(); }
    // last five fills
    const vals = [9.4, 9.0, 9.3, 9.1, v], base = b.y + 560;
    vals.forEach((x, i) => { const bw = 120, gx = RTL ? b.x + b.w - 48 - bw - i * 150 : b.x + 48 + i * 150, hh = x * 18;
      ctx.fillStyle = i === 4 ? (x < 6.44 ? "#D97706" : C.brand) : "rgba(42,137,250,0.4)"; rr(ctx, gx, base - hh, bw, hh, 10); ctx.fill(); });
    ctx.strokeStyle = "#f59e0b"; ctx.setLineDash([12, 10]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(b.x + 40, base - 6.44 * 18); ctx.lineTo(b.x + b.w - 40, base - 6.44 * 18); ctx.stroke(); ctx.setLineDash([]);
    const nk = E.hero(seg(lt, 1.6, 2.1));
    if (nk > 0) { ctx.save(); ctx.globalAlpha *= nk; const nb = { ...b, y: b.y + 680 };
      const ls = wrapLines(ctx, S.anomalyNote, b.w - 60, `500 34px ${RTL ? F.ar : F.ui}`);
      ls.forEach((l, j) => bt(ctx, nb, l, 24, 10 + j * 52, { size: 34, weight: 500, color: "#fde68a" })); ctx.restore(); }
  },
  // service overdue: 2 trucks
  (ctx, lt, b) => {
    const rows = [[FLEET[0], S.tasks[0], "90,060 / 90,000 km"], [FLEET[2], S.tasks[1], "1,236 / 1,200 h"]];
    rows.forEach((r, i) => {
      const k = E.hero(seg(lt, 0.3 + i * 0.25, 0.9 + i * 0.25)); if (k <= 0) return;
      const y = b.y + i * 330; ctx.save(); ctx.globalAlpha *= k; ctx.translate((RTL ? -1 : 1) * (1 - k) * 80, 0);
      card(ctx, b.x, y, b.w, 300, { fill: C.card, stroke: rgba("#ef4444", 0.45), r: 28 });
      const cb = { ...b, y };
      icon(ctx, "wrench", RTL ? b.x + b.w - 96 : b.x + 44, y + 44, 52, "#f87171", 2.2);
      bt(ctx, cb, r[1], 124, 86, { size: 42, weight: 700, color: C.fg });
      bn(ctx, cb, `${r[0].model} · ${r[0].plate}`, 124, 136, { size: 28, weight: 500, color: C.muted });
      bn(ctx, cb, r[2], 48, 246, { size: 34, weight: 600, color: C.onVariant, font: F.mono });
      statusPill(ctx, bx(cb, b.w - 44), y + 240, S.overdue, "bad", { size: 30, rtl: RTL, align: "right" });
      ctx.restore();
    });
  },
  // Istimara: 12 days left
  (ctx, lt, b) => {
    card(ctx, b.x, b.y, b.w, 560, { fill: "#16213a", stroke: C.border, r: 28 });
    ctx.fillStyle = C.brand; ctx.fillRect(RTL ? b.x + b.w - 14 : b.x, b.y + 50, 14, 90);
    bt(ctx, b, S.docIstimara, 56, 112, { size: 64, weight: 700, color: C.fg });
    bn(ctx, b, `${FLEET[1].model} · ${FLEET[1].plate}`, 56, 166, { size: 30, weight: 500, color: C.muted });
    const n = Math.round(lerp(30, 12, E.inOutCubic(seg(lt, 0.4, 1.6))));
    bn(ctx, b, String(n), 56, 410, { size: 220, weight: 700, color: n <= 14 ? "#f87171" : "#fbbf24" });
    ctx.save(); ctx.font = `700 220px ${F.ui}`; const nw = ctx.measureText(String(n)).width; ctx.restore();
    bt(ctx, b, RTL ? "يومًا" : "days", 56 + nw + 24, 400, { size: 60, weight: 600, color: C.muted });
    bn(ctx, b, "02/11/2026", 56, 500, { size: 38, weight: 600, color: C.fg, font: F.mono });
    statusPill(ctx, bx(b, b.w - 48), b.y + 492, S.expiringSoon, n <= 14 ? "bad" : "warn", { size: 28, rtl: RTL, align: "right" });
  },
  // failed check → issue opened
  (ctx, lt, b) => {
    const items = [S.inspItems[0], S.inspItems[1], S.inspItems[2]];
    items.forEach((it, i) => {
      const y = b.y + i * 150, k = E.hero(seg(lt, 0.15 + i * 0.12, 0.6 + i * 0.12)); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k;
      card(ctx, b.x, y, b.w, 128, { fill: C.card, stroke: C.border, r: 22, shadow: false });
      bt(ctx, { ...b, y }, it, 40, 80, { size: 38, weight: 600, color: C.fg });
      const fail = i === 1, decided = fail ? lt > 1.0 : lt > 0.5 + i * 0.15;
      const lbl = fail ? S.fail : S.pass, kind = fail ? "bad" : "good";
      if (decided) { const sk = E.outBack(seg(lt, fail ? 1.0 : 0.5 + i * 0.15, (fail ? 1.0 : 0.5 + i * 0.15) + 0.3));
        ctx.save(); const px = bx(b, b.w - 40), py = y + 64; ctx.translate(px, py); ctx.scale(sk, sk); ctx.translate(-px, -py);
        ctx.font = `700 32px ${RTL ? F.ar : F.ui}`; const w = ctx.measureText(lbl).width + 60;
        rr(ctx, RTL ? px : px - w, py - 32, w, 64, 14); ctx.fillStyle = PILLS[kind].dot; ctx.fill();
        text(ctx, lbl, RTL ? px + w / 2 : px - w / 2, py + 11, { size: 32, weight: 700, font: RTL ? F.ar : F.ui, color: "#fff", align: "center", dir: DIR }); ctx.restore(); }
      ctx.restore();
    });
    ctx.save(); const ts = 1.55, tw = b.w / ts; ctx.translate(b.x, b.y + 500); ctx.scale(ts, ts);
    toast(ctx, { x: 0, y: 0, w: tw, h: 104, rtl: RTL }, S.issuesRaised, `${S.failNote} · ${S.issueOpen}`, "bad", seg(lt, 1.5, 2.0)); ctx.restore();
  },
];

function endCard(ctx, t) {
  const u = t - CARDS[4];
  const glow = ctx.createRadialGradient(W / 2, 760, 0, W / 2, 760, 900);
  glow.addColorStop(0, rgba(C.brand, 0.18 * seg(u, 0, 1))); glow.addColorStop(1, rgba(C.brand, 0)); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  const lh = 104, lw = logoWidth(lh);
  drawLogo(ctx, W / 2 - lw / 2, 700, lh, C.brand, seg(u, 0, 1.2));
  if (RTL) text(ctx, "فليتانا", W / 2, 950, { size: 46, weight: 600, font: F.ar, color: C.heading, align: "center", alpha: E.hero(seg(u, 0.9, 1.5)), dir: "rtl" });
  S.f3.cta.forEach((l, i) => riseText(ctx, l, W / 2, (RTL ? 1110 : 1060) + i * 104, seg(u, 0.9 + i * 0.2, 1.6 + i * 0.2),
    { size: RTL ? 80 : 86, weight: 700, font: HF, color: i ? C.brand : C.heading, align: "center", dir: DIR, track: RTL ? 0 : -2 }));
  const bk = E.hero(seg(u, 1.2, 1.7));
  if (bk > 0) { ctx.save(); ctx.globalAlpha *= bk; ctx.translate(0, (1 - bk) * 30); ctx.font = `600 44px ${F.ui}`; const w = ctx.measureText(S.url).width + 110;
    rr(ctx, W / 2 - w / 2, 1330, w, 100, 50); ctx.fillStyle = C.brand; ctx.fill();
    text(ctx, S.url, W / 2, 1395, { size: 44, weight: 600, font: F.ui, color: "#fff", align: "center" }); ctx.restore(); }
  const fo = seg(t, DUR - 0.4, DUR); if (fo > 0) { ctx.fillStyle = `rgba(6,14,32,${E.inCubic(fo)})`; ctx.fillRect(0, 0, W, H); }
}

film({
  w: W, h: H, fps: 60, dur: DUR, audio: "audio/film3.wav",
  render(ctx, t) {
    kineticBg(ctx, W, H, t, { alpha: t > CARDS[4] ? 1 : 0.5, density: 1.2 });
    if (t < CARDS[0] + 0.05) hook(ctx, t);
    for (let i = 0; i < 4; i++) cardScene(ctx, t, i, (lt, b) => DRAW[i](ctx, lt, b));
    progress(ctx, t);
    if (t >= CARDS[4]) endCard(ctx, t);
  },
});
