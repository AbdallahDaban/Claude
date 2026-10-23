// Fleetana company profile — for prospective clients. Light, 16:9.
//   node build_profile.js   → Fleetana-Company-Profile-EN.pptx
// Built on the shared deck system (../templates/powerpoint/deck.js). English first; Arabic follows once the copy is final.
// Founder photos: team/<id>.jpg (square). Missing photos fall back to initials.
const fs = require("fs");
const path = require("path");
const { createDeck, A, W, M, HEX } = require("../templates/powerpoint/deck.js");

async function build(lang) {
  const T = COPY[lang];
  const { pres, ar, THEME, X, AL, txt, title2, card, iconDot, ui, pill, notes, save } = createDeck(lang, T.meta.title);
  const HF = THEME.headFontFace;
  const R = { map: 1100 / 1880, costs: 1100 / 1880, route: 1100 / 1880, reminders: 780 / 1880, inspection: 790 / 1880, papers: 1020 / 1880 };
  const DEV = { fmc003: { file: A("devices/fmc003.jpg"), ratio: 1536 / 1584 }, r12l: { file: A("devices/r12l.png"), ratio: 386 / 115 } };
  const device = (s, id, x, y, h) => { const d = DEV[id], w = h / d.ratio; s.addImage({ path: d.file, x: X(x, w), y, w, h, objectName: `device-${id}`, altText: id }); return w; };
  const bullets = (s, pts, x, y, w, h, size = 17) => s.addText(pts.map((p, i) => ({ text: p, options: { bullet: { code: "25CF" }, breakLine: i < pts.length - 1, paraSpaceAfter: 10 } })),
    txt({ x: X(x, w), y, w, h, fontSize: size, color: HEX.ink, valign: "top" }));
  const numbered = (s, pts, x, y, w, gap) => pts.forEach(([h, b], i) => {
    const yy = y + i * gap;
    s.addText(String(i + 1), txt({ x: X(x, 0.5), y: yy, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: HEX.accent, align: "center", valign: "middle",
      fill: { color: HEX.tint }, shape: pres.shapes.OVAL, objectName: `num-${i + 1}` }));
    s.addText(h, txt({ x: X(x + 0.7, w - 0.7), y: yy - 0.02, w: w - 0.7, h: 0.45, fontSize: 17, bold: true, color: HEX.black, fontFace: HF }));
    s.addText(b, txt({ x: X(x + 0.7, w - 0.7), y: yy + 0.43, w: w - 0.7, h: gap - 0.55, fontSize: 13, color: HEX.onv, valign: "top" }));
  });
  const tiles = (s, items, y0 = 2.3, h = 2.0) => items.forEach(([ic, hd, b, tag], i) => {
    const col = i % 3, row = Math.floor(i / 3), x = M + col * 4.1, y = y0 + row * (h + 0.2), w = 3.85;
    card(s, x, y, w, h, `tile-${i + 1}`);
    iconDot(s, x + 0.3, y + 0.3, ic, 0.56);
    s.addText(hd, txt({ x: X(x + 1.05, w - 1.3), y: y + 0.33, w: w - 1.3, h: 0.5, fontSize: 17, bold: true, color: HEX.black, fontFace: HF }));
    s.addText(b, txt({ x: X(x + 0.3, w - 0.6), y: y + 0.98, w: w - 0.6, h: tag ? 0.5 : 0.9, fontSize: 13, color: HEX.onv, valign: "top" }));
    if (tag) pill(s, x + w - 2.05, y + h - 0.5, tag, "info", 1.8);
  });
  // four equal cards: icon, heading, body (problem, onboarding)
  const fourCards = (s, items, { y = 2.45, h = 3.4, num = false } = {}) => items.forEach(([ic, hd, b], i) => {
    const x = M + i * 3.07, w = 2.85;
    card(s, x, y, w, h, `card4-${i + 1}`);
    iconDot(s, x + 0.3, y + 0.3, ic);
    s.addText(num ? `${String(i + 1).padStart(2, "0")}  ${hd}` : hd, txt({ x: X(x + 0.3, w - 0.6), y: y + 1.15, w: w - 0.6, h: 0.75, fontSize: 18, bold: true, color: HEX.black, fontFace: HF, valign: "top" }));
    s.addText(b, txt({ x: X(x + 0.3, w - 0.6), y: y + 1.95, w: w - 0.6, h: h - 2.1, fontSize: 14, color: HEX.onv, valign: "top" }));
  });
  const arrow = (s, x, y, n) => s.addImage({ path: A("icons/icon-arrowRight.png"), x: X(x, 0.24), y, w: 0.24, h: 0.24, rotate: ar ? 180 : 0, objectName: `arrow-${n}` });
  const divider = (n, [t, b], sec) => {
    const s = pres.addSlide({ masterName: "Section divider", sectionTitle: sec });
    s.addText(n, { placeholder: "number" }); s.addText(t, { placeholder: "title" }); s.addText(b, { placeholder: "body" });
  };
  const titled = (t, sec) => { const s = pres.addSlide({ masterName: "Title only", sectionTitle: sec }); s.addText(title2(...t), { placeholder: "title" }); return s; };
  const SEC = T.sections;

  // ── about ─────────────────────────────────────────────────────────────────
  pres.addSection({ title: SEC[0] });
  let s = pres.addSlide({ masterName: "Cover", sectionTitle: SEC[0] });
  s.addText(T.cover.eyebrow, { placeholder: "eyebrow" });
  s.addText(title2(...T.cover.title), { placeholder: "title" });
  s.addText(T.cover.sub, { placeholder: "body" });
  s.addText(T.cover.meta, { placeholder: "meta" });
  card(s, 7.95, 1.7, 4.78, 3.0, "cover-map-card");
  ui(s, "ui-map", 8.07, 1.82, 4.54, R.map, "Fleet map");
  notes(s, T.cover.notes);

  s = titled(T.who.title, SEC[0]);
  s.addText(T.who.lead, txt({ x: X(M, 6.6), y: 2.4, w: 6.6, h: 1.3, fontSize: 21, color: HEX.black, fontFace: HF, valign: "top" }));
  bullets(s, T.who.points, M, 3.85, 6.6, 2.6, 16);
  T.who.facts.forEach(([k, v], i) => {
    const x = 7.75 + (i % 2) * 2.55, y = 2.4 + Math.floor(i / 2) * 1.85, w = 2.4;
    card(s, x, y, w, 1.65, `fact-${i + 1}`);
    s.addText(k, txt({ x: X(x + 0.25, w - 0.5), y: y + 0.28, w: w - 0.5, h: 0.35, fontSize: 12, bold: true, color: HEX.accent, charSpacing: ar ? 0 : 1 }));
    s.addText(v, txt({ x: X(x + 0.25, w - 0.5), y: y + 0.7, w: w - 0.5, h: 0.7, fontSize: 20, bold: true, color: HEX.black, fontFace: HF, valign: "top" }));
  });
  notes(s, T.who.notes);

  s = titled(T.vm.title, SEC[0]);
  T.vm.items.forEach(([k, v], i) => {
    const x = M + i * 6.15, w = 5.9;
    card(s, x, 2.4, w, 3.6, `vm-${i + 1}`, i ? HEX.white : HEX.tint);
    iconDot(s, x + 0.45, 2.8, i ? "check" : "chart", 0.62);
    s.addText(k, txt({ x: X(x + 0.45, w - 0.9), y: 3.65, w: w - 0.9, h: 0.4, fontSize: 14, bold: true, color: HEX.accent, charSpacing: ar ? 0 : 2 }));
    s.addText(v, txt({ x: X(x + 0.45, w - 0.9), y: 4.1, w: w - 0.9, h: 1.7, fontSize: 26, bold: true, color: HEX.black, fontFace: HF, valign: "top" }));
  });
  notes(s, T.vm.notes);

  // ── 01 the problem ────────────────────────────────────────────────────────
  pres.addSection({ title: SEC[1] });
  divider("01", T.div[0], SEC[1]);
  s = titled(T.problem.title, SEC[1]);
  fourCards(s, T.problem.cards);
  notes(s, T.problem.notes);

  // ── 02 the solution ───────────────────────────────────────────────────────
  pres.addSection({ title: SEC[2] });
  divider("02", T.div[1], SEC[2]);

  // how Fleetana works: tracker → platform → decisions
  s = titled(T.how.title, SEC[2]);
  T.how.steps.forEach(([eyebrow, hd, b], i) => {
    const x = M + i * 4.1, w = 3.75, y = 2.3;
    card(s, x, y, w, 4.25, `how-${i + 1}`);
    if (i === 0) { device(s, "fmc003", x + 0.55, y + 0.3, 1.3); device(s, "r12l", x + 2.5, y + 0.22, 1.45); }
    if (i === 1) ui(s, "ui-map", x + 0.3, y + 0.3, w - 0.6, R.map, "Fleetana platform");
    if (i === 2) ui(s, "ui-costs", x + 0.3, y + 0.3, w - 0.6, R.costs, "Cost per vehicle");
    s.addText(eyebrow, txt({ x: X(x + 0.3, w - 0.6), y: y + 2.38, w: w - 0.6, h: 0.3, fontSize: 11, bold: true, color: HEX.accent, charSpacing: ar ? 0 : 2 }));
    s.addText(hd, txt({ x: X(x + 0.3, w - 0.6), y: y + 2.68, w: w - 0.6, h: 0.5, fontSize: 19, bold: true, color: HEX.black, fontFace: HF }));
    s.addText(b, txt({ x: X(x + 0.3, w - 0.6), y: y + 3.2, w: w - 0.6, h: 0.95, fontSize: 13.5, color: HEX.onv, valign: "top" }));
    if (i < 2) arrow(s, x + w + 0.055, y + 2.0, i + 1);
  });
  notes(s, T.how.notes);

  s = titled(T.overview.title, SEC[2]);
  tiles(s, T.overview.items);
  notes(s, T.overview.notes);

  s = titled(T.fleetVis.title, SEC[2]);
  T.fleetVis.points.forEach(([ic, h, b], i) => {
    const y = 2.35 + i * 1.02;
    iconDot(s, M, y, ic, 0.56);
    s.addText(h, txt({ x: X(M + 0.8, 4.6), y: y - 0.02, w: 4.6, h: 0.4, fontSize: 17, bold: true, color: HEX.black, fontFace: HF }));
    s.addText(b, txt({ x: X(M + 0.8, 4.6), y: y + 0.38, w: 4.6, h: 0.55, fontSize: 13, color: HEX.onv, valign: "top" }));
  });
  card(s, 6.15, 2.3, 6.58, 3.97, "card-map");
  ui(s, "ui-map", 6.27, 2.42, 6.34, R.map, "Live map");
  pill(s, 6.15, 6.42, T.tag, "info", 2.6);
  notes(s, T.fleetVis.notes);

  s = titled(T.costVis.title, SEC[2]);
  card(s, M, 2.3, 6.9, 4.15, "card-costs");
  ui(s, "ui-costs", M + 0.12, 2.38, 6.66, R.costs, "Vehicle cost breakdown");
  numbered(s, T.costVis.points, 7.95, 2.35, 4.78, 1.08);
  notes(s, T.costVis.notes);

  s = titled(T.route.title, SEC[2]);
  card(s, M, 2.3, 6.9, 4.15, "card-route");
  ui(s, "ui-route", M + 0.12, 2.38, 6.66, R.route, "Driven route vs optimised route");
  numbered(s, T.route.points, 7.95, 2.35, 4.78, 1.3);
  pill(s, 7.95, 6.1, T.tag, "info", 2.6);
  notes(s, T.route.notes);

  // maintenance, inspections & work orders: points left, two screens stacked right
  s = titled(T.maint.title, SEC[2]);
  bullets(s, T.maint.points, M, 2.45, 6.1, 4.1, 16);
  [["ui-reminders", R.reminders, "Service reminders", 2.25], ["ui-inspection", R.inspection, "Inspection with a failed item", 4.55]].forEach(([img, r, name, y]) => {
    const cw = 4.85; card(s, 7.88, y, cw, (cw - 0.24) * r + 0.24, `card-${img}`); ui(s, img, 8.0, y + 0.12, cw - 0.24, r, name);
  });
  notes(s, T.maint.notes);

  // ── 03 our trackers ───────────────────────────────────────────────────────
  pres.addSection({ title: SEC[3] });
  divider("03", T.div[2], SEC[3]);

  s = titled(T.devices.title, SEC[3]);
  T.devices.items.forEach((d, i) => {
    const x = M + i * 6.17, w = 5.9, y = 2.25, h = 4.45;
    card(s, x, y, w, h, `device-card-${d.id}`);
    const ih = d.id === "fmc003" ? 1.75 : 2.4;
    device(s, d.id, d.id === "fmc003" ? x + 0.3 : x + 0.75, y + (d.id === "fmc003" ? 0.55 : 0.3), ih);
    const tx = x + 2.25, tw = w - 2.5;
    s.addText(d.brand, txt({ x: X(tx, tw), y: y + 0.3, w: tw, h: 0.3, fontSize: 11, bold: true, color: HEX.accent, charSpacing: ar ? 0 : 2 }));
    s.addText(d.name, txt({ x: X(tx, tw), y: y + 0.58, w: tw, h: 0.5, fontSize: 24, bold: true, color: HEX.black, fontFace: HF }));
    s.addText(d.tagline, txt({ x: X(tx, tw), y: y + 1.08, w: tw, h: 0.35, fontSize: 13, color: HEX.onv }));
    s.addText(d.points.map((p, k) => ({ text: p, options: { bullet: { code: "25CF" }, breakLine: k < d.points.length - 1, paraSpaceAfter: 5 } })),
      txt({ x: X(tx, tw), y: y + 1.55, w: tw, h: 2.2, fontSize: 12.5, color: HEX.ink, valign: "top" }));
    s.addText([{ text: T.devices.bestFor, options: { bold: true, color: HEX.navy } }, { text: d.bestFor, options: { color: HEX.navy } }],
      txt({ x: X(x + 0.3, w - 0.6), y: y + h - 0.68, w: w - 0.6, h: 0.44, fontSize: 13, fill: { color: HEX.tint }, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.1,
        valign: "middle", margin: [0, 10, 0, 10], objectName: `bestfor-${d.id}` }));
  });
  notes(s, T.devices.notes);

  // what each tracker unlocks: tick table + supply/install card
  s = titled(T.unlocks.title, SEC[3]);
  const tick = (v) => ({ text: v ? "✓" : "—", options: { bold: true, color: v ? "15803D" : HEX.muted, align: "center", fontSize: v ? 16 : 13 } });
  const head = T.unlocks.head.map((h, j) => ({ text: h, options: { bold: true, color: HEX.navy, fill: { color: HEX.tint }, fontSize: 13, align: j ? "center" : AL } }));
  const rows = T.unlocks.rows.map(([f, a, b], i) => [
    { text: f, options: { fontSize: 13, color: HEX.ink, align: AL } }, tick(a), tick(b)].map(c => ({ ...c, options: { ...c.options, fill: { color: i % 2 ? HEX.paper : HEX.white } } })));
  s.addTable([head, ...rows], { x: X(M, 7.9), y: 2.25, w: 7.9, colW: [4.9, 1.5, 1.5], rowH: 0.4, valign: "middle", margin: [0.03, 0.12, 0.03, 0.12],
    border: { type: "solid", pt: 0.75, color: HEX.border }, fontFace: THEME.bodyFontFace, rtlMode: ar, objectName: "unlocks-table" });
  card(s, 8.85, 2.25, 3.88, 4.35, "service-card", HEX.tint);
  iconDot(s, 9.15, 2.55, "wrench", 0.62);
  s.addText(T.unlocks.cardTitle, txt({ x: X(9.15, 3.3), y: 3.35, w: 3.3, h: 0.8, fontSize: 20, bold: true, color: HEX.black, fontFace: HF, valign: "top" }));
  bullets(s, T.unlocks.cardPoints, 9.15, 4.2, 3.3, 2.2, 13.5);
  notes(s, T.unlocks.notes);

  // ── 04 the savings ────────────────────────────────────────────────────────
  pres.addSection({ title: SEC[4] });
  s = titled(T.savings.title, SEC[4]);
  T.savings.groups.forEach(([ic, hd, pts], i) => {
    const x = M + i * 3.07, w = 2.85, y = 2.3, h = 4.1;
    card(s, x, y, w, h, `saving-${i + 1}`);
    iconDot(s, x + 0.3, y + 0.3, ic);
    s.addText(hd, txt({ x: X(x + 0.3, w - 0.6), y: y + 1.12, w: w - 0.6, h: 0.5, fontSize: 20, bold: true, color: HEX.black, fontFace: HF }));
    s.addText(pts.map((p, k) => ({ text: p, options: { bullet: { code: "25CF" }, breakLine: k < pts.length - 1, paraSpaceAfter: 7 } })),
      txt({ x: X(x + 0.3, w - 0.6), y: y + 1.72, w: w - 0.6, h: h - 1.9, fontSize: 13, color: HEX.onv, valign: "top" }));
  });
  notes(s, T.savings.notes);

  s = titled(T.saudi.title, SEC[4]);
  T.saudi.chips.forEach((c, i) => {
    const w = 2.75, x = M + (i % 3) * 2.95, y = 2.35 + Math.floor(i / 3) * 0.72;
    s.addText(c, txt({ x: X(x, w), y, w, h: 0.52, fontSize: 15, bold: true, color: HEX.navy, align: "center", valign: "middle",
      fill: { color: HEX.white }, line: { color: HEX.border, width: 1 }, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.26, objectName: `chip-${i + 1}` }));
  });
  s.addText(T.saudi.whoTitle, txt({ x: X(M, 8.6), y: 4.0, w: 8.6, h: 0.45, fontSize: 18, bold: true, color: HEX.black, fontFace: HF }));
  T.saudi.who.forEach(([ic, h], i) => {
    const x = M + (i % 2) * 4.35, y = 4.6 + Math.floor(i / 2) * 0.85;
    iconDot(s, x, y, ic, 0.55);
    s.addText(h, txt({ x: X(x + 0.75, 3.5), y: y + 0.05, w: 3.5, h: 0.45, fontSize: 15, color: HEX.ink, valign: "middle" }));
  });
  card(s, 9.75, 2.35, 2.98, 3.9, "papers-card");
  ui(s, "ui-papers", 9.85, 2.6, 2.78, R.papers, "Document expiry cards");
  s.addText(T.saudi.papers, txt({ x: X(9.95, 2.6), y: 4.35, w: 2.6, h: 1.7, fontSize: 12.5, color: HEX.onv, valign: "top" }));
  notes(s, T.saudi.notes);

  // ── 05 working with us ────────────────────────────────────────────────────
  pres.addSection({ title: SEC[5] });
  s = titled(T.onboard.title, SEC[5]);
  fourCards(s, T.onboard.steps, { num: true });
  T.onboard.steps.slice(0, 3).forEach((_, i) => arrow(s, M + i * 3.07 + 2.85 - 0.02, 4.0, i + 1));
  notes(s, T.onboard.notes);

  s = titled(T.team.title, SEC[5]);
  T.team.people.forEach(([id, n, r], i) => {
    const x = M + i * 3.07, w = 2.85, y = 2.3, d = 1.9, px = x + (w - d) / 2;
    card(s, x, y, w, 4.1, `team-${id}`);
    const photo = path.join(__dirname, "team", `${id}.jpg`);
    if (fs.existsSync(photo)) s.addImage({ path: photo, x: X(px, d), y: y + 0.32, w: d, h: d, rounding: true, objectName: `photo-${id}`, altText: n });
    else s.addText(n.split(" ").map(p => p[0]).join(""), txt({ x: X(px, d), y: y + 0.32, w: d, h: d, fontSize: 44, bold: true, color: HEX.accent, fontFace: HF,
      align: "center", valign: "middle", fill: { color: HEX.tint }, shape: pres.shapes.OVAL, objectName: `photo-${id}` }));
    s.addText(n, txt({ x: X(x + 0.2, w - 0.4), y: y + 2.45, w: w - 0.4, h: 0.75, fontSize: 18, bold: true, color: HEX.black, fontFace: HF, align: "center", valign: "top" }));
    s.addText(r, txt({ x: X(x + 0.2, w - 0.4), y: y + 3.2, w: w - 0.4, h: 0.7, fontSize: 13.5, color: HEX.accent, align: "center", valign: "top" }));
  });
  notes(s, T.team.notes);

  s = pres.addSlide({ masterName: "Closing", sectionTitle: SEC[5] });
  s.addText(T.closing[0], { placeholder: "title" });
  s.addText(T.closing[1], { placeholder: "body" });

  const out = path.join(__dirname, `Fleetana-Company-Profile-${lang.toUpperCase()}.pptx`);
  await save(out);
  console.log("wrote", path.basename(out));
}

// ── copy ────────────────────────────────────────────────────────────────────
const COPY = {
  en: {
    meta: { title: "Fleetana — company profile" },
    sections: ["About us", "The problem", "The solution", "Our trackers", "The savings", "Working with us"],
    tag: "Fleetana GPS tracker",
    cover: { eyebrow: "COMPANY PROFILE", title: ["Your whole fleet.", "One place."], sub: "Fleet and cost visibility, built for Saudi fleets",
      meta: "Fleetana · 2026 · fleetana.sa", notes: "Fleetana company profile for prospective clients." },
    who: { title: ["Who", "we are"],
      lead: "Fleetana is fleet-management software built in Saudi Arabia for the people who run vehicles.",
      points: [
        "One platform for vehicles, drivers, routes, fuel, service, inspections and work orders",
        "Shows what every vehicle is doing and what every vehicle costs",
        "Our own GPS trackers, supplied and installed by our team",
        "Web app for managers, mobile app for drivers, in Arabic and English"],
      facts: [["FOUNDED", "2026"], ["HEADQUARTERS", "Riyadh, Saudi Arabia"], ["CR NUMBER", "7051877566"], ["LANGUAGES", "Arabic · English"]],
      notes: "Software and hardware from one Saudi partner." },
    vm: { title: ["Vision &", "mission"], items: [
      ["VISION", "Every Saudi fleet run on facts with the lifecycle optimized and efficient."],
      ["MISSION", "One place to see every vehicle, its cost, its next job, and execution."]],
      notes: "Read both lines aloud; let them stand." },
    div: [["The problem", "Fleets run on spreadsheets, receipts and memory"],
      ["The solution", "Software and trackers from one partner"],
      ["Our trackers", "Hardware we supply, install and support"]],
    problem: { title: ["Where does your", "fleet's money go?"], cards: [
      ["clipboard", "Spreadsheets", "Service dates, plates and Istimara expiries live in files nobody updates on time."],
      ["fuel", "Receipts", "Fuel and repair spend sits in drawers and photos, so odd fill-ups go unnoticed."],
      ["pin", "Blind spots", "Nobody can say which route a vehicle took, or how long it sat idling."],
      ["bell", "Chat threads", "Checks, faults and approvals happen in WhatsApp, and nothing links back to the vehicle."]],
      notes: "Ask the client which of these four sounds most like their week." },
    how: { title: ["How Fleetana", "works"], steps: [
      ["IN EVERY VEHICLE", "Our GPS tracker", "We supply and install a tracker that fits the vehicle, from pickups to heavy trucks."],
      ["ON ONE PLATFORM", "Fleetana web & mobile", "Location, trips, fuel, service and costs land in one place, for every vehicle."],
      ["IN YOUR DECISIONS", "See, decide, save", "Spot the waste, act on it, and watch the cost per vehicle come down."]],
      notes: "The whole offer on one slide: hardware, software, outcome." },
    overview: { title: ["Everything that", "touches your fleet"], items: [
      ["truck", "Vehicles & documents", "Plates, drivers, Istimara, insurance and Fahes for every vehicle."],
      ["wrench", "Service & maintenance", "Programs by km, engine hours or date. Due soon and overdue at a glance."],
      ["fuel", "Fuel", "km/L on every full fill. Low fills flagged."],
      ["clipboard", "Inspections & issues", "Custom checklists with photos. A failed item opens an issue."],
      ["check", "Work orders & parts", "Parts, labour and fees, with 15% VAT and approval steps."],
      ["pin", "Live map & routes", "Live positions, trip replay, optimised routes and driver scores."]],
      notes: "The six modules. The next slides go deeper." },
    fleetVis: { title: ["Know what every", "vehicle is doing"], points: [
      ["pin", "Live map", "Every vehicle as moving, idle, parked or no signal, updated every few seconds."],
      ["chart", "Trip replay", "See the exact route each vehicle drove, stop by stop."],
      ["alert", "Idle time", "Engine-on minutes per trip and per day, for every vehicle."],
      ["users", "Driver scores", "Harsh driving, speeding and collisions turned into a 0–100 score."]],
      notes: "Powered by the Fleetana GPS tracker in each vehicle." },
    costVis: { title: ["See where your fleet's", "money really goes"], points: [
      ["Cost per vehicle", "Fuel, service and work orders add up on each vehicle, in SAR, with cost per km."],
      ["Fuel anomalies flagged", "A full fill below 70% of that vehicle's 30-day average is flagged Low."],
      ["Every riyal itemised", "Work orders split parts, labour and fees, with 15% VAT."],
      ["Warranty on record", "Check the warranty before you pay for the same repair twice."]],
      notes: "Illustration uses demo figures." },
    route: { title: ["Shorter routes,", "less fuel"], points: [
      ["Optimised routes", "Fleetana orders your stops into the shortest route before the vehicle leaves."],
      ["Planned vs driven", "Compare the route you planned with the route actually driven."],
      ["Fewer wasted kilometres", "Every kilometre saved is fuel, time and wear you don't pay for."]],
      notes: "Map and distances are demo figures." },
    maint: { title: ["Maintenance that", "runs on schedule"], points: [
      "Service due by km, engine hours or date, whichever comes first",
      "36 standard service tasks ready on day one",
      "Inspections on the mobile app, with photos; a failed item opens an issue automatically",
      "Work orders with parts, labour, fees, 15% VAT and approval",
      "Parts stock per location, and warranty periods on parts and repairs"],
      notes: "Demo data on screen." },
    devices: { title: ["Two trackers,", "every vehicle covered"], bestFor: "Best for  ", notes: "We supply, install and support both trackers.", items: [
      { id: "fmc003", brand: "TELTONIKA", name: "FMC003", tagline: "Plug-and-play OBD tracker",
        points: ["Plugs into the OBD-II port in minutes, no wiring", "4G LTE with GPS, GLONASS, Galileo and BeiDou",
          "Reads the vehicle's own odometer and fuel level", "Eco-driving, crash, towing and unplug detection", "CST-certified in Saudi Arabia"],
        bestFor: "cars, pickups and vans" },
      { id: "r12l", brand: "SEEWORLD", name: "R12L", tagline: "Hard-wired tracker for any vehicle",
        points: ["Hidden install, 9–90 V for trucks, buses and equipment", "4G LTE with GPS and BeiDou", "IP65 dust and water resistant",
          "Remote engine cut-off and ignition detection", "Vibration, power-cut and over-speed alarms"],
        bestFor: "trucks, buses, equipment and theft protection" }] },
    unlocks: { title: ["What each tracker", "unlocks"], head: ["Fleetana feature", "FMC003", "R12L"], rows: [
      ["Live map and trip replay", 1, 1], ["Idle time and driver scores", 1, 1], ["Route optimisation", 1, 1], ["Over-speed alerts", 1, 1],
      ["Tamper alerts (unplug / power cut)", 1, 1], ["Crash detection", 1, 0], ["Fuel level and odometer from the vehicle", 1, 0],
      ["Remote engine cut-off", 0, 1], ["Trucks and heavy equipment (up to 90 V)", 0, 1]],
      cardTitle: "Supplied, installed and supported", cardPoints: ["We pick the right tracker for each vehicle", "Our team installs it", "Live in Fleetana the same day", "One partner for software and hardware"],
      notes: "Mixed fleets often use both: FMC003 for light vehicles, R12L for heavy ones." },
    savings: { title: ["Find the leaks.", "Fix them."], groups: [
      ["fuel", "Fuel", ["Fuel anomalies flagged", "Idle time cut", "Shorter, optimised routes"]],
      ["wrench", "Maintenance", ["Service before breakdowns", "No paying twice under warranty", "Every work order itemised"]],
      ["truck", "Fleet", ["Cost per vehicle and per km", "Retire the costliest vehicles", "Keep documents valid"]],
      ["shield", "Safety", ["Driver scores and coaching", "Crash and over-speed alerts", "Remote engine cut-off"]]],
      notes: "Where the savings come from. Each one is an action the client takes with what Fleetana shows them." },
    saudi: { title: ["Built for", "Saudi fleets"], chips: ["Istimara", "Fahes", "Insurance", "SAR + 15% VAT", "CST-certified trackers", "العربية · English"],
      whoTitle: "Made for fleets like yours", who: [["truck", "Delivery & courier"], ["wrench", "Construction & heavy equipment"], ["box", "Distribution & retail"], ["users", "Passenger & school transport"]],
      papers: "Expiry dates live on each vehicle, and Home lists everything expiring in the next 30 days.", notes: "Adjust the industries to the client." },
    onboard: { title: ["How we get", "you running"], steps: [
      ["users", "Sign up", "Create your workspace at fleetana.sa and invite your team."],
      ["truck", "Add vehicles", "Vehicles, drivers and document dates, imported or added by hand."],
      ["wrench", "We install trackers", "The right tracker for each vehicle, installed by our team."],
      ["chart", "See, decide, save", "Live map, costs and savings from day one."]],
      notes: "Most of setup happens in the first week." },
    team: { title: ["The founders", "behind Fleetana"], people: [
      ["abdallah", "Abdallah Daban", "Operations & Strategy"], ["abdulrahman", "Abdulrahman Alaskar", "Product Manager"],
      ["faisal", "Faisal Qassem", "Business Development"], ["ali", "Ali Choudhary", "Business & Customer Manager"]],
      notes: "Four founders, one team: operations, product, business development and customers." },
    closing: ["Get your fleet off spreadsheets.", "fleetana.sa  ·  info@fleetana.sa"],
  },
};

(async () => { await build("en"); })();
