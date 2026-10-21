// FILM 1 — "Off spreadsheets" · launch hero · 40 s · 1920×1080
const W = 1920, H = 1080, DUR = 40;
const T = { chaosEnd: 5, logo: 5, logoEnd: 8.2, head: 8.2, tour: 10.8, beat: 3.0, saudi: 31.8, end: 34.8 };
const MODULES = [
  { key: "vehicles", icon: "truck" }, { key: "service", icon: "wrench" }, { key: "fuel", icon: "fuel" },
  { key: "inspections", icon: "clipboard" }, { key: "workOrders", icon: "check" }, { key: "home", icon: "calendar" }, { key: "map", icon: "pin" },
];
const NAV = [
  { key: "home", icon: "chart" }, { key: "vehicles", icon: "truck" }, { key: "service", icon: "wrench" }, { key: "fuel", icon: "fuel" },
  { key: "inspections", icon: "clipboard" }, { key: "issues", icon: "alert" }, { key: "workOrders", icon: "check" }, { key: "map", icon: "pin" },
].map(n => ({ ...n, label: S.nav[n.key] }));
const WS = 1.1;                                   // app window scale: big enough to read on a phone
const X = x => (RTL ? W - x : x);                 // mirror a scene x for Arabic
const AL = a => (RTL ? (a === "left" ? "right" : a === "right" ? "left" : a) : a);
const HF = RTL ? F.ar : F.head;                    // headline face per language

// ── Scene A: the chaos the product replaces ─────────────────────────────────
function chaos(ctx, t) {
  kineticBg(ctx, W, H, t, { alpha: 0.35 });
  const suck = E.inExpo(seg(t, 4.1, 5.05));        // everything collapses into the mark
  const push = 1 + t * 0.012;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(push * (1 - suck * 0.98), push * (1 - suck * 0.98)); ctx.rotate(suck * 0.6); ctx.translate(-W / 2, -H / 2);
  ctx.globalAlpha = 1 - seg(t, 4.85, 5.05);
  const drop = (d, fn) => { const k = E.outBack(seg(t, d, d + 0.45)); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(k * 2);
    const j = Math.sin(t * 9 + d * 7) * 2 * seg(t, 1.5, 4); ctx.translate(j, (1 - k) * -90 + j); fn(); ctx.restore(); };
  drop(0.0, () => {
    const R = RTL ? [["المركبة", "اللوحة", "موعد الزيت", "الاستمارة", "وقود (لتر)", "السائق", "ملاحظات"],
      ["هايلكس", "4271", "85,000?", "#REF!", "62", "فيصل", "كلم الورشة"], ["هايس", "8834", "??", "12/2026", "#VALUE!", "عمر", ""],
      ["ايسوزو", "1902", "71,500", "انتهت؟", "140", "سعيد", "الكفر؟؟"], ["هايلكس", "6647", "", "03/2027", "58", "", "اسأل ماجد"],
      ["كوستر", "3150", "#N/A", "??", "", "ماجد", ""], ["هايس", "7720", "102,000", "", "70", "ناصر", "الفاتورة ضاعت"]]
    : [["Vehicle", "Plate", "Oil due", "Istimara", "Fuel (L)", "Driver", "Notes"],
      ["Hilux", "4271", "85,000?", "#REF!", "62", "Faisal", "call garage"], ["Hiace", "8834", "??", "12/2026", "#VALUE!", "Omar", ""],
      ["Isuzu", "1902", "71,500", "expired?", "140", "Saeed", "tyre??"], ["Hilux", "6647", "", "03/2027", "58", "", "ask Majed"],
      ["Coaster", "3150", "#N/A", "??", "", "Majed", ""], ["Hiace", "7720", "102,000", "", "70", "Nasser", "receipt lost"]];
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.04); ctx.translate(-W / 2, -H / 2); ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 50;
    spreadsheet(ctx, 330, 250, 1000, 300, R, t); ctx.restore();
  });
  drop(0.45, () => receipt(ctx, 1290, 190, 0.12, ["SASCO", "21/10/2026  06:42", "DIESEL", "140.00 L", "SAR 232.40", "", "THANK YOU"]));
  drop(0.7, () => receipt(ctx, 200, 520, -0.16, ["ALDREES", "19/10/2026  21:10", "PETROL 91", "62.00 L", "SAR 135.16", "", "———"]));
  drop(0.95, () => paperChecklist(ctx, 1460, 520, 0.08, RTL ? ["الأنوار", "الإطارات", "الفرامل", "السوائل", "الأحزمة"] : ["Lights", "Tyres", "Brakes", "Fluids", "Belts"]));
  // the two lines the film opens on: sticky note, then the chat
  drop(0.25, () => { ctx.save(); ctx.translate(560, 560); ctx.scale(1.55, 1.55); sticky(ctx, 0, 0, -0.07, S.f1.sticky); ctx.restore(); });
  drop(2.2, () => { ctx.save(); ctx.translate(980, 690); ctx.scale(1.6, 1.6); chatBubble(ctx, 0, 0, 0.03, S.f1.chat, { rtl: RTL, time: "23:14" }); ctx.restore(); });
  ctx.restore();
  // collapse flash
  const fl = Math.exp(-Math.max(0, t - 5.0) * 10) * seg(t, 4.95, 5.0);
  if (fl > 0.01) { ctx.fillStyle = rgba(C.brand, fl * 0.5); ctx.fillRect(0, 0, W, H); }
}

// ── Scene B: logo ──────────────────────────────────────────────────────────
function logoScene(ctx, t) {
  const u = t - T.logo;
  kineticBg(ctx, W, H, t, { alpha: seg(u, 0, 1.2) });
  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 700);
  glow.addColorStop(0, rgba(C.brand, 0.18 * seg(u, 0, 0.8))); glow.addColorStop(1, rgba(C.brand, 0));
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  const out = E.inOutExpo(seg(t, T.logoEnd - 0.45, T.logoEnd));
  // mark builds big, then the lockup resolves around it
  const lh = 120, lw = logoWidth(lh);
  const mk = E.hero(seg(u, 0, 0.9));
  const toLock = E.inOutExpo(seg(u, 0.9, 1.6));
  ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(0, -out * 60);
  const mh = lerp(300, lh, toLock), mx = lerp(W / 2, W / 2 - lw / 2 + (lh * MARK_BOX.w / MARK_BOX.h) / 2, toLock);
  drawMark(ctx, mx, H / 2, mh, C.brand, mk);
  if (toLock > 0) drawLogo(ctx, W / 2 - lw / 2, H / 2 - lh / 2, lh, C.brand, 0.15 + E.outCubic(seg(u, 1.1, 2.2)) * 0.85, { mark: false });
  // Arabic name under the Latin lockup in the Arabic cut (typed, not a drawn wordmark)
  if (RTL) text(ctx, "فليتانا", W / 2, H / 2 + lh * 0.5 + 90, { size: 54, weight: 600, font: F.ar, color: C.heading, align: "center", alpha: E.hero(seg(u, 1.5, 2.2)), dir: "rtl" });
  ctx.restore();
}

// ── Scene C+D: headline then the product tour in one app window ─────────────
function windowBox(t) {
  const k = E.hero(seg(t, T.tour - 0.3, T.tour + 0.55));
  const w = 1180, h = 800, x = RTL ? 40 : W - 40 - w * WS, y = 100 + (1 - k) * 800;
  return { x, y, w, h, rtl: RTL, k };
}
function headline(ctx, t) {
  const u = t - T.head, out = E.inOutExpo(seg(t, T.tour - 0.75, T.tour - 0.2));
  if (out >= 1) return;
  ctx.save(); ctx.globalAlpha = 1 - out;
  const big = lerp(1, 0.6, out);
  S.f1.headline.forEach((l, i) => riseText(ctx, l, W / 2, H / 2 - 10 + i * 128 - out * 200, seg(u, 0.05 + i * 0.25, 0.85 + i * 0.25),
    { size: 110 * big, weight: 700, font: HF, color: i ? C.brand : C.heading, align: "center", dir: RTL ? "rtl" : "ltr", track: RTL ? 0 : -2 }));
  ctx.restore();
}
function caption(ctx, t, idx, lt) {
  const inK = seg(lt, 0.05, 0.75), outK = seg(lt, T.beat - 0.3, T.beat);
  const isLast = idx === MODULES.length - 1, a = isLast ? 1 - seg(t, T.saudi - 0.4, T.saudi) : 1 - E.inCubic(outK);
  if (a <= 0) return;
  const x = X(90), w = 560, mod = MODULES[idx];
  ctx.save(); ctx.globalAlpha = a;
  // step + module eyebrow
  text(ctx, `${String(idx + 1).padStart(2, "0")} / ${String(MODULES.length).padStart(2, "0")}`, x, 360, { size: 20, weight: 500, font: F.mono, color: C.muted, align: AL("left") });
  const ey = E.hero(seg(lt, 0, 0.5));
  icon(ctx, mod.icon, RTL ? x - 30 : x, 400 + (1 - ey) * 20, 30, C.brand, 2.2);
  text(ctx, S.nav[mod.key === "home" ? "home" : mod.key], RTL ? x - 44 : x + 44, 425 + (1 - ey) * 20, { size: 26, weight: 600, font: RTL ? F.ar : F.ui, color: C.brand, align: AL("left"), alpha: ey, dir: RTL ? "rtl" : "ltr" });
  const fs = S.f1.caps[idx].reduce((m, l) => { ctx.font = `700 60px ${HF}`; return Math.min(m, 60 * 470 / ctx.measureText(l).width); }, RTL ? 56 : 60);
  S.f1.caps[idx].forEach((l, i) => riseText(ctx, l, x, 520 + i * fs * 1.25, seg(lt, 0.15 + i * 0.12, 0.85 + i * 0.12),
    { size: fs, weight: 700, font: HF, color: C.heading, align: AL("left"), dir: RTL ? "rtl" : "ltr", track: RTL ? 0 : -1 }));
  if (isLast) { const k = E.hero(seg(lt, 0.6, 1.2)); ctx.globalAlpha = a * k; statusPill(ctx, x, 720, S.f1.tracker, "info", { size: 20, rtl: RTL, dot: true }); }
  ctx.restore();
}
function tour(ctx, t) {
  const wb = windowBox(t); if (wb.k <= 0) return;
  const lt0 = t - T.tour, idx = clamp(Math.floor(lt0 / T.beat), 0, MODULES.length - 1), lt = lt0 - idx * T.beat;
  const out = E.inOutExpo(seg(t, T.saudi - 0.5, T.saudi + 0.2));
  ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(0, out * 120);
  // gentle parallax drift of the window
  const drift = Math.sin(t * 0.6) * 6;
  ctx.translate(0, drift);
  const navIdx = Math.max(0, NAV.findIndex(n => n.key === MODULES[idx].key));
  ctx.translate(wb.x, wb.y); ctx.scale(WS, WS); ctx.translate(-wb.x, -wb.y);
  const cb = appWindow(ctx, wb, { nav: NAV, active: t < T.tour ? 1 : navIdx });
  if (t >= T.tour - 0.1) {
    // content cross-fade: incoming slides up
    const k = E.hero(seg(lt, 0, 0.55));
    ctx.save(); rr(ctx, wb.x + 1, wb.y + 54, wb.w - 2, wb.h - 55, 16); ctx.clip();
    ctx.globalAlpha *= clamp(k * 1.4); ctx.translate(0, (1 - k) * 40);
    CONTENT[idx](ctx, cb, Math.max(0, lt), t);
    ctx.restore();
  }
  ctx.restore();
  if (t >= T.tour - 0.1) caption(ctx, t, idx, lt);
}
const pageTitle = (ctx, b, s, sub) => { bt(ctx, b, s, 0, 34, { size: 32, weight: 700, color: C.fg }); if (sub) bt(ctx, b, sub, 0, 66, { size: 17, weight: 500, color: C.muted }); };

const CONTENT = [
  // 01 Vehicles
  (ctx, b, lt) => {
    pageTitle(ctx, b, S.vehiclesTitle);
    const st = [S.active, S.active, S.inShop, S.active, S.outOfService, S.active], kinds = ["good", "good", "warn", "good", "muted", "good"];
    const dates = ["12/03/2027", "02/11/2026", "18/01/2027", "27/06/2027", "09/11/2026", "30/04/2027"];
    table(ctx, { x: b.x, y: b.y + 70, w: b.w, rtl: RTL }, [
      { key: "v", label: S.colVehicle, w: 260, bold: true }, { key: "p", label: S.colPlate, w: 170, mono: true },
      { key: "d", label: S.colDriver, w: 150 }, { key: "s", label: S.colStatus, w: 160 }, { key: "i", label: S.colIstimara, w: 140, num: true, color: C.onVariant },
    ], FLEET.map((f, i) => ({ v: f.model, p: f.plate, d: S.drivers[i], i: dates[i],
      s: (ctx, x, y) => statusPill(ctx, x, y + 8, st[i], kinds[i], { size: 15, rtl: RTL }) })), { reveal: seg(lt, 0.15, 1.1), rowH: 74 });
  },
  // 02 Service reminders — row 0 rolls past its km and flips to Overdue
  (ctx, b, lt) => {
    pageTitle(ctx, b, S.remindersTitle);
    const flip = lt > 1.7;
    const tw = (b.w - 20) / 3;
    [[S.overdue, flip ? "2" : "1", C.bad], [S.dueSoon, flip ? "4" : "5", C.warn], [S.upcoming, "11", C.onVariant]].forEach(([l, v, c], i) =>
      statTile(ctx, { x: RTL ? b.x + b.w - (i + 1) * tw - i * 10 : b.x + i * (tw + 10), y: b.y + 66, w: tw, h: 116, rtl: RTL }, l, v, { valueColor: c }));
    const meter = Math.round(lerp(89420, 90060, E.inOutCubic(seg(lt, 0.5, 1.7))));
    const rows = [
      { v: FLEET[0].model, k: S.tasks[0], due: "90,000 km", cur: fmt(meter) + " km", s: flip ? ["overdue", "bad"] : ["dueSoon", "warn"] },
      { v: FLEET[2].model, k: S.tasks[1], due: "1,200 h", cur: "1,236 h", s: ["overdue", "bad"] },
      { v: FLEET[1].model, k: S.tasks[2], due: "01/11/2026", cur: "21/10/2026", s: ["dueSoon", "warn"] },
      { v: FLEET[5].model, k: S.tasks[3], due: "110,000 km", cur: "104,880 km", s: ["upcoming", "muted"] },
      { v: FLEET[3].model, k: S.tasks[4], due: "60,000 km", cur: "51,300 km", s: ["upcoming", "muted"] },
    ];
    table(ctx, { x: b.x, y: b.y + 200, w: b.w, rtl: RTL }, [
      { key: "v", label: S.colVehicle, w: 230, bold: true }, { key: "k", label: S.colTask, w: 230 },
      { key: "due", label: S.colDueAt, w: 140, num: true }, { key: "cur", label: S.colCurrent, w: 140, num: true, color: C.onVariant }, { key: "s", label: S.colStatus, w: 140 },
    ], rows.map(r => ({ ...r, s: (ctx, x, y) => statusPill(ctx, x, y + 8, S[r.s[0]], r.s[1], { size: 15, rtl: RTL }) })),
    { reveal: seg(lt, 0.1, 0.9), rowH: 70, highlight: 0, hlColor: C.bad, hlP: E.hero(seg(lt, 1.7, 2.1)) });
  },
  // 03 Fuel — the anomaly rule from lib/fuel-economy.ts (economy < 70% of recent average)
  (ctx, b, lt) => {
    pageTitle(ctx, b, S.fuelTitle);
    const tw = (b.w - 30) / 4;
    [[S.statTotalVolume, "3,482 L"], [S.statTotalSpend, "SAR 6,840.12"], [S.statAvgUnit, "1.96"], [S.statAvgEconomy, "9.2 km/L"]].forEach(([l, v], i) =>
      statTile(ctx, { x: RTL ? b.x + b.w - (i + 1) * tw - i * 10 : b.x + i * (tw + 10), y: b.y + 66, w: tw, h: 116, rtl: RTL }, l, v));
    const flag = E.hero(seg(lt, 1.3, 1.75));
    const rows = [
      ["21 Oct", FLEET[0].plate, "88,912", "62.0 L", "SAR 135.16", "9.4 km/L"],
      ["20 Oct", FLEET[1].plate, "120,440", "62.0 L", "SAR 135.16", "5.9 km/L", true],
      ["19 Oct", FLEET[3].plate, "51,020", "58.0 L", "SAR 126.44", "9.6 km/L"],
      ["18 Oct", FLEET[5].plate, "104,610", "66.0 L", "SAR 143.88", "9.1 km/L"],
    ];
    table(ctx, { x: b.x, y: b.y + 200, w: b.w, rtl: RTL }, [
      { key: "d", label: S.colDate, w: 110, num: true }, { key: "p", label: S.colPlate, w: 150, mono: true }, { key: "o", label: S.colOdometer, w: 120, num: true },
      { key: "l", label: S.colVolume, w: 110, num: true }, { key: "c", label: S.colCost, w: 150, num: true }, { key: "e", label: S.colEconomy, w: 220 },
    ], rows.map(r => ({ d: r[0], p: r[1], o: r[2], l: r[3], c: r[4],
      e: (ctx, x, y) => { const w = text(ctx, r[5], x, y + 7, { size: 18, weight: 600, font: F.ui, color: r[6] && flag > 0 ? "#fbbf24" : C.fg, align: AL("left") });
        if (r[6] && flag > 0) { ctx.save(); ctx.globalAlpha *= flag; statusPill(ctx, RTL ? x - w - 12 : x + w + 12, y + 8, S.low, "warn", { size: 14, rtl: RTL, dot: false }); ctx.restore(); } } })),
    { reveal: seg(lt, 0.1, 0.8), rowH: 70, highlight: 1, hlColor: C.warn, hlP: flag });
    // the rule, as the app words it
    if (flag > 0) { ctx.save(); ctx.globalAlpha *= flag;
      card(ctx, b.x + (RTL ? 0 : b.w - 560), b.y + 520, 560, 64, { fill: "#2a2110", stroke: rgba(C.warn, 0.5), r: 10, shadow: true });
      icon(ctx, "alert", RTL ? b.x + 560 - 46 : b.x + b.w - 560 + 20, b.y + 540, 24, "#fbbf24", 2.2);
      text(ctx, S.anomalyNote, RTL ? b.x + 560 - 60 : b.x + b.w - 560 + 58, b.y + 559, { size: 17, weight: 500, font: RTL ? F.ar : F.ui, color: "#fde68a", align: AL("left"), dir: RTL ? "rtl" : "ltr" });
      ctx.restore(); }
  },
  // 04 Inspections — Tyres fails → an issue is raised automatically
  (ctx, b, lt) => {
    pageTitle(ctx, b, S.inspTitle, `${FLEET[0].model} · ${FLEET[0].plate}`);
    const failAt = 1.0;
    S.inspItems.forEach((it, i) => {
      const y = b.y + 110 + i * 78, k = E.hero(seg(lt, 0.1 + i * 0.12, 0.6 + i * 0.12)); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k;
      card(ctx, b.x, y, b.w, 64, { fill: C.card, stroke: C.border, r: 10, shadow: false });
      bt(ctx, { ...b, y }, it, 22, 40, { size: 19, weight: 600, color: C.fg });
      const isFail = i === 1, decided = isFail ? lt > failAt : lt > 0.4 + i * 0.15;
      // Pass / Fail segmented control
      const segW = 110, sx0 = RTL ? b.x + 20 : b.x + b.w - 20 - segW * 2;
      [[S.pass, "good"], [S.fail, "bad"]].forEach(([l, kind], j) => {
        const on = decided && ((isFail && j === 1) || (!isFail && j === 0));
        const xx = RTL ? sx0 + (1 - j) * segW : sx0 + j * segW;
        rr(ctx, xx + 3, y + 10, segW - 6, 44, 8); ctx.fillStyle = on ? PILLS[kind].dot : "rgba(51,65,85,0.5)"; ctx.fill();
        text(ctx, l, xx + segW / 2, y + 39, { size: 17, weight: 600, font: RTL ? F.ar : F.ui, color: on ? "#fff" : C.muted, align: "center", dir: RTL ? "rtl" : "ltr" });
      });
      if (isFail && lt > failAt) {
        const nk = E.hero(seg(lt, failAt, failAt + 0.4));
        ctx.globalAlpha *= nk;
        bt(ctx, { ...b, y }, "— " + S.failNote, 230, 40, { size: 17, weight: 500, color: "#fca5a5" });
        // photo thumbnail
        const px = RTL ? b.x + 20 + segW * 2 + 16 : b.x + b.w - 20 - segW * 2 - 16 - 56;
        rr(ctx, px, y + 6, 56, 52, 6); const g = ctx.createLinearGradient(px, y, px + 56, y + 56); g.addColorStop(0, "#334155"); g.addColorStop(1, "#111827"); ctx.fillStyle = g; ctx.fill();
        ctx.fillStyle = "#0b0f19"; ctx.beginPath(); ctx.arc(px + 28, y + 32, 18, 0, TAU); ctx.fill(); ctx.strokeStyle = "#64748b"; ctx.lineWidth = 3; ctx.stroke();
        icon(ctx, "camera", px + 36, y + 36, 16, "#e2e8f0", 2);
      }
      ctx.restore();
    });
    toast(ctx, { x: RTL ? b.x : b.x + b.w - 520, y: b.y + 520, w: 520, h: 104, rtl: RTL }, S.issuesRaised, `${S.failNote} · ${S.issueOpen}`, "bad", seg(lt, 1.5, 2.0));
  },
  // 05 Work order — lines + VAT 15% totalled in SAR
  (ctx, b, lt) => {
    bn(ctx, b, S.woTitle, 0, 34, { size: 32, weight: 700, color: C.fg, font: F.mono });
    statusPill(ctx, RTL ? b.x + b.w - 260 : b.x + 260, b.y + 26, S.inProgress, "info", { size: 16, rtl: RTL });
    bt(ctx, b, `${FLEET[2].model} · ${FLEET[2].plate}`, 0, 70, { size: 17, weight: 500, color: C.muted });
    const lines = [[1, 420], [1.5, 150], [1, 25]];
    table(ctx, { x: b.x, y: b.y + 100, w: b.w, rtl: RTL }, [
      { key: "t", label: S.colType, w: 150 }, { key: "d", label: S.colDesc, w: 300, bold: true }, { key: "q", label: S.colQty, w: 110, num: true },
      { key: "u", label: S.colUnit, w: 160, num: true }, { key: "l", label: S.colLine, w: 160, num: true, align: "right" },
    ], S.woLines.map((l, i) => ({ t: l[0], d: l[1], q: String(lines[i][0]), u: `SAR ${fmt(lines[i][1], 2)}`, l: `SAR ${fmt(lines[i][0] * lines[i][1], 2)}` })),
    { reveal: seg(lt, 0.1, 0.8), rowH: 70 });
    const sub = 670, vat = 100.5, tot = 770.5, k = E.outCubic(seg(lt, 0.6, 1.4));
    const tb = { x: RTL ? b.x : b.x + b.w - 420, y: b.y + 400, w: 420, rtl: RTL };
    card(ctx, tb.x, tb.y, tb.w, 190, { fill: C.card, stroke: C.border, r: 12, shadow: false });
    [[S.subtotal, sub, C.onVariant, 22], [S.vat, vat, C.onVariant, 22], [S.total, tot, C.fg, 30]].forEach(([l, v, c, s], i) => {
      const y = 50 + i * 52 + (i === 2 ? 10 : 0);
      if (i === 2) { ctx.fillStyle = C.border; ctx.fillRect(tb.x + 20, tb.y + y - 36, tb.w - 40, 1); }
      bt(ctx, tb, l, 24, y, { size: i === 2 ? 22 : 18, weight: i === 2 ? 700 : 500, color: c });
      bn(ctx, tb, `SAR ${fmt(v * k, 2)}`, tb.w - 24, y, { size: s * 0.8, weight: 700, color: i === 2 ? C.fg : c, align: "right" });
    });
  },
  // 06 Home — documents expiring within 30 days (dashboard)
  (ctx, b, lt) => {
    pageTitle(ctx, b, S.homeTitle);
    const tw = (b.w - 20) / 3;
    [[S.active, "18", C.fg], [S.inShop, "2", C.onVariant], [S.outOfService, "1", C.onVariant]].forEach(([l, v, c], i) =>
      statTile(ctx, { x: RTL ? b.x + b.w - (i + 1) * tw - i * 10 : b.x + i * (tw + 10), y: b.y + 66, w: tw, h: 116, rtl: RTL }, l, v, { valueColor: c }));
    card(ctx, b.x, b.y + 200, b.w, 420, { fill: C.card, stroke: C.border, r: 12, shadow: false });
    const cb = { x: b.x, y: b.y + 200, w: b.w, rtl: RTL };
    bt(ctx, cb, S.expiringSoon, 24, 46, { size: 22, weight: 700, color: C.fg });
    const docs = [[S.docIstimara, FLEET[1], 12, "02/11/2026"], [S.docInsurance, FLEET[4], 19, "09/11/2026"], [S.docFahes, FLEET[2], 26, "16/11/2026"], [S.docIstimara, FLEET[5], 29, "19/11/2026"]];
    docs.forEach(([d, f, n, date], i) => {
      const k = E.hero(seg(lt, 0.2 + i * 0.15, 0.7 + i * 0.15)); if (k <= 0) return;
      const y = 76 + i * 84; ctx.save(); ctx.globalAlpha *= k; ctx.translate((RTL ? -1 : 1) * (1 - k) * 30, 0);
      ctx.fillStyle = "rgba(51,65,85,0.35)"; rr(ctx, cb.x + 16, cb.y + y, cb.w - 32, 70, 10); ctx.fill();
      icon(ctx, "calendar", RTL ? cb.x + cb.w - 64 : cb.x + 36, cb.y + y + 22, 26, n <= 14 ? "#f87171" : "#fbbf24", 2);
      bt(ctx, cb, d, 80, y + 32, { size: 19, weight: 700, color: C.fg });
      bn(ctx, cb, `${f.model} · ${f.plate}`, 80, y + 58, { size: 15, weight: 500, color: C.muted });
      bn(ctx, cb, date, cb.w - 230, y + 44, { size: 17, weight: 500, color: C.onVariant, align: "right" });
      statusPill(ctx, bx(cb, cb.w - 40), cb.y + y + 44, S.inDays(n), n <= 14 ? "bad" : "warn", { size: 15, rtl: RTL, align: "right" });
      ctx.restore();
    });
  },
  // 07 Fleet map (needs tracker) + driver performance scores
  (ctx, b, lt, t) => {
    const mb = { x: b.x - 2, y: b.y - 12, w: b.w + 4, h: b.h + 22, r: 12 };
    mapBase(ctx, mb, t, { zoom: 1 + lt * 0.015 });
    const roads = ROADS(mb);
    const vs = [[0, 0.1, "moving", 0.06], [1, 0.3, "moving", 0.045], [2, 0.55, "idling", 0], [3, 0.2, "moving", 0.05], [4, 0.7, "parked", 0], [5, 0.4, "moving", 0.035], [1, 0.75, "parked", 0], [2, 0.15, "stale", 0]];
    ctx.save(); rr(ctx, mb.x, mb.y, mb.w, mb.h, 12); ctx.clip();
    vs.forEach(([r, u0, st, sp], i) => {
      const u = u0 + sp * lt, p = along(roads[r], u);
      if (st === "moving") { ctx.strokeStyle = "rgba(34,197,94,0.55)"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath();
        for (let q = 0; q <= 12; q++) { const pp = along(roads[r], u - 0.08 * (1 - q / 12)); q ? ctx.lineTo(pp[0], pp[1]) : ctx.moveTo(pp[0], pp[1]); } ctx.stroke(); }
      const k = E.outBack(seg(lt, 0.1 + i * 0.07, 0.5 + i * 0.07));
      if (k > 0) mapPin(ctx, p[0], p[1], st, k, { pulse: st === "idling" ? fract(lt * 0.8) : 0, label: i === 2 && lt > 0.9 ? `${FLEET[2].plate} · ${S.idle} 41 min` : null, rtl: RTL });
    });
    ctx.restore();
    // live badge + legend
    pill(ctx, RTL ? mb.x + mb.w - 20 : mb.x + 20, mb.y + 20, S.mapLive, { bg: "rgba(15,23,42,0.9)", fg: "#4ade80", dot: "#16A34A", size: 17, font: RTL ? F.ar : F.ui, align: RTL ? "right" : "left" });
    let lx = RTL ? mb.x + mb.w - 20 : mb.x + 20;
    [[S.moving, "moving", 5], [S.idle, "idling", 1], [S.parked, "parked", 2], [S.noSignal, "stale", 1]].forEach(([l, st, n]) => {
      const w = pill(ctx, lx, mb.y + mb.h - 60, `${l} ${n}`, { bg: "rgba(15,23,42,0.9)", fg: C.fg, dot: PIN[st][0], size: 16, font: RTL ? F.ar : F.ui, align: RTL ? "right" : "left" });
      lx += (RTL ? -1 : 1) * (w + 10);
    });
    // driver performance card (lib/telematics/driver-score.ts bands)
    const k = E.hero(seg(lt, 1.0, 1.5)); if (k <= 0) return;
    const db = { x: RTL ? mb.x + 24 : mb.x + mb.w - 24 - 400, y: mb.y + 90, w: 400, rtl: RTL };
    ctx.save(); ctx.globalAlpha *= k; ctx.translate((RTL ? -1 : 1) * (1 - k) * 40, 0);
    card(ctx, db.x, db.y, db.w, 290, { fill: "rgba(30,41,59,0.97)", stroke: C.border, r: 14 });
    bt(ctx, db, S.driverPerf, 22, 42, { size: 20, weight: 700, color: C.fg });
    [[S.drivers[0], 94, S.excellent, "good"], [S.drivers[1], 81, S.good, "info"], [S.drivers[2], 63, S.fair, "warn"]].forEach(([n, sc, band, kind], i) => {
      const y = 70 + i * 70, sk = E.outCubic(seg(lt, 1.0 + i * 0.1, 1.6 + i * 0.1));
      bt(ctx, db, n, 22, y + 32, { size: 18, weight: 600, color: C.fg });
      bn(ctx, db, String(Math.round(sc * sk)), 230, y + 33, { size: 26, weight: 700, color: C.fg, align: "right" });
      statusPill(ctx, bx(db, 378), db.y + y + 26, band, kind, { size: 14, rtl: RTL, align: "right", dot: false });
      ctx.fillStyle = "rgba(51,65,85,0.6)"; ctx.fillRect(db.x + 22, db.y + y + 50, db.w - 44, 5);
      ctx.fillStyle = PILLS[kind].dot; const bw = (db.w - 44) * sc / 100 * sk; ctx.fillRect(RTL ? db.x + db.w - 22 - bw : db.x + 22, db.y + y + 50, bw, 5);
    });
    ctx.restore();
  },
];

// ── Scene E: Built for Saudi fleets — chips + illustrated vehicles ──────────
function saudi(ctx, t) {
  const u = t - T.saudi, out = E.inOutExpo(seg(t, T.end - 0.4, T.end + 0.1));
  ctx.save(); ctx.globalAlpha = 1 - out;
  riseText(ctx, S.f1.saudi, W / 2, 300, seg(u, 0.1, 0.9), { size: RTL ? 84 : 92, weight: 700, font: HF, color: C.heading, align: "center", dir: RTL ? "rtl" : "ltr", track: RTL ? 0 : -1.5 });
  // chips flow in two rows
  skyline(ctx, u);
  const chips = S.f1.chips, sz = 30;
  ctx.font = `600 ${sz}px ${F.ui}`;
  const widths = chips.map(c => { ctx.font = `600 ${sz}px ${/[؀-ۿ]/.test(c) ? F.ar : F.ui}`; return ctx.measureText(c).width + sz * 1.5 + 14; });
  const rows = [[0, 1, 2], [3, 4, 5]];
  rows.forEach((r, ri) => {
    const tot = r.reduce((s, i) => s + widths[i] + 16, -16); let x = W / 2 - tot / 2;
    (RTL ? [...r].reverse() : r).forEach((i, j) => {
      const k = E.outBack(seg(u, 0.5 + (ri * 3 + j) * 0.09, 1.0 + (ri * 3 + j) * 0.09));
      if (k > 0) { ctx.save(); ctx.globalAlpha *= clamp(k); ctx.translate(0, (1 - k) * 30);
        const ar = /[؀-ۿ]/.test(chips[i]);
        pill(ctx, x, 400 + ri * 84, chips[i], { bg: i === 5 ? C.brand : "rgba(42,137,250,0.14)", fg: i === 5 ? "#fff" : C.accentFg, size: sz, font: ar ? F.ar : F.ui, dot: null });
        ctx.restore(); }
      x += widths[i] + 16;
    });
  });
  // road + three fleet vehicles driving through
  const gy = 880;
  ctx.fillStyle = "rgba(30,41,59,0.9)"; ctx.fillRect(0, gy + 10, W, 120);
  ctx.fillStyle = "rgba(148,163,184,0.35)"; for (let x = -200 + ((u * 600) % 200); x < W + 200; x += 200) ctx.fillRect(RTL ? W - x - 90 : x, gy + 68, 90, 6);
  [["truck", 0], ["van", 0.55], ["pickup", 1.05]].forEach(([ty, d], i) => {
    const k = seg(u, d, d + 3.4), x = lerp(-700, W + 200, E.inOutSine(k) * 0.6 + k * 0.4);
    const sc = ty === "truck" ? 1.1 : 1.0;
    if (k > 0 && k < 1) { ctx.save(); if (RTL) { ctx.translate(W, 0); ctx.scale(-1, 1); } vehicle(ctx, ty, x, gy - 150 * sc + 2, sc, { t, moving: true, plate: null }); ctx.restore(); }
  });
  ctx.restore();
}

// Riyadh skyline silhouettes (Kingdom Centre, Al Faisaliah) — low contrast, behind the road
function skyline(ctx, u) {
  const a = E.hero(seg(u, 0.2, 1.4)), gy = 890, rise = (1 - a) * 80;
  ctx.save(); ctx.globalAlpha *= 0.9 * a; ctx.translate(0, rise);
  const g = ctx.createLinearGradient(0, 560, 0, gy); g.addColorStop(0, "rgba(42,137,250,0.10)"); g.addColorStop(1, "rgba(30,41,59,0.85)");
  ctx.fillStyle = g;
  const base = (x, w, h) => ctx.fillRect(x, gy - h, w, h);
  [[60, 90, 120], [170, 60, 180], [240, 120, 90], [380, 70, 210], [470, 110, 140], [1290, 80, 160], [1390, 130, 110], [1540, 70, 230], [1630, 110, 150], [1760, 120, 100]].forEach(([x, w, h]) => base(x, w, h));
  // Kingdom Centre: tapering tower with the parabolic void and sky bridge
  const kx = 1120, kw = 150, kh = 330;
  ctx.beginPath(); ctx.moveTo(kx - kw / 2, gy); ctx.lineTo(kx - kw * 0.36, gy - kh); ctx.lineTo(kx + kw * 0.36, gy - kh); ctx.lineTo(kx + kw / 2, gy); ctx.closePath();
  ctx.moveTo(kx - kw * 0.28, gy - kh - 1); ctx.quadraticCurveTo(kx, gy - kh * 0.28, kx + kw * 0.28, gy - kh - 1); ctx.closePath(); ctx.fill("evenodd");
  ctx.fillRect(kx - kw * 0.2, gy - kh * 0.66, kw * 0.4, 8);
  // Al Faisaliah: four-legged pyramid with the golden globe
  const fx = 760, fh = 300;
  ctx.beginPath(); ctx.moveTo(fx - 70, gy); ctx.lineTo(fx - 8, gy - fh); ctx.lineTo(fx + 8, gy - fh); ctx.lineTo(fx + 70, gy); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(42,137,250,0.35)"; ctx.beginPath(); ctx.arc(fx, gy - fh * 0.62, 20, 0, TAU); ctx.fill();
  ctx.restore();
}

// ── Scene F: end card ───────────────────────────────────────────────────────
function endCard(ctx, t) {
  const u = t - T.end;
  const glow = ctx.createRadialGradient(W / 2, H / 2 - 60, 0, W / 2, H / 2 - 60, 800);
  glow.addColorStop(0, rgba(C.brand, 0.16 * seg(u, 0, 1))); glow.addColorStop(1, rgba(C.brand, 0));
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  const lh = 96, lw = logoWidth(lh);
  drawLogo(ctx, W / 2 - lw / 2, 330, lh, C.brand, seg(u, 0, 1.2));
  if (RTL) text(ctx, "فليتانا", W / 2, 330 + lh + 70, { size: 44, weight: 600, font: F.ar, color: C.heading, align: "center", alpha: E.hero(seg(u, 0.5, 1.2)), dir: "rtl" });
  riseText(ctx, S.f1.cta, W / 2, RTL ? 650 : 620, seg(u, 0.6, 1.4), { size: RTL ? 66 : 72, weight: 700, font: HF, color: C.heading, align: "center", dir: RTL ? "rtl" : "ltr", track: RTL ? 0 : -1.5 });
  const bk = E.hero(seg(u, 1.1, 1.8));
  if (bk > 0) { ctx.save(); ctx.globalAlpha *= bk; ctx.translate(0, (1 - bk) * 20);
    ctx.font = `600 34px ${F.ui}`; const w = ctx.measureText(S.url).width + 90;
    rr(ctx, W / 2 - w / 2, RTL ? 730 : 700, w, 76, 38); ctx.fillStyle = C.brand; ctx.fill();
    text(ctx, S.url, W / 2, (RTL ? 730 : 700) + 50, { size: 34, weight: 600, font: F.ui, color: "#fff", align: "center" });
    ctx.restore(); }
  const fo = seg(t, DUR - 0.6, DUR);
  if (fo > 0) { ctx.fillStyle = `rgba(6,14,32,${E.inCubic(fo)})`; ctx.fillRect(0, 0, W, H); }
}

film({
  w: W, h: H, fps: 60, dur: DUR, audio: "audio/film1.wav",
  render(ctx, t) {
    if (t < T.chaosEnd + 0.05) chaos(ctx, t);
    if (t >= T.logo && t < T.logoEnd) logoScene(ctx, t);
    if (t >= T.logoEnd - 0.05) {
      kineticBg(ctx, W, H, t, { alpha: t > T.saudi ? 1 : 0.55 });
      if (t < T.saudi + 0.3) { headline(ctx, t); tour(ctx, t); }
      if (t >= T.saudi - 0.1 && t < T.end + 0.2) saudi(ctx, t);
      if (t >= T.end) endCard(ctx, t);
    }
  },
});
