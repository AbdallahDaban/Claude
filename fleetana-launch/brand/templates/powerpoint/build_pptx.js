// Fleetana PowerPoint template — light, 16:9, English (LTR) and Arabic (RTL).
//   node build_pptx.js   → Fleetana-Template-EN.pptx/.potx, Fleetana-Template-AR.pptx/.potx
// Built as a structured deck: Fleetana theme (colours + fonts), named layouts with placeholders,
// sections, and example slides for a company profile, a pitch and a proposal. Content is true to the
// shipped product (brand skill v2: product-truth.md) — no invented stats, no testimonials, no pricing.
const path = require("path");
const { createDeck, A, W, H, M, HEX } = require("./deck.js");

async function build(lang) {
  const T = COPY[lang];
  const { pres, ar, THEME, X, AL, txt, title2, card, iconDot, ui, pill, notes, save } = createDeck(lang, T.meta.title);


  // ── 1 · cover ─────────────────────────────────────────────────────────────
  pres.addSection({ title: T.sections[0] });
  let s = pres.addSlide({ masterName: "Cover", sectionTitle: T.sections[0] });
  s.addText(T.cover.eyebrow, { placeholder: "eyebrow" });
  s.addText(title2(...T.cover.title), { placeholder: "title" });
  s.addText(T.cover.sub, { placeholder: "body" });
  s.addText(T.cover.meta, { placeholder: "meta" });
  card(s, 7.95, 1.7, 4.78, 3.55, "cover-map-card");
  ui(s, "ui-map", 8.07, 1.82, 4.54, 1100 / 1880, "Fleet map");
  pill(s, 8.07, 4.65 + 0.15, T.cover.tag, "info", 2.6);
  notes(s, T.notes.cover);

  // ── 2 · contents ──────────────────────────────────────────────────────────
  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[0] });
  s.addText(title2(T.contents.title), { placeholder: "title" });
  T.contents.items.forEach((it, i) => {
    const x = M + i * 3.07, w = 2.85;
    card(s, x, 2.35, w, 3.0, `contents-${i + 1}`);
    s.addText(String(i + 1).padStart(2, "0"), txt({ x: X(x + 0.3, 1.5), y: 2.65, w: 1.5, h: 0.7, fontSize: 36, bold: true, color: HEX.blue, fontFace: THEME.headFontFace }));
    s.addText(it[0], txt({ x: X(x + 0.3, w - 0.6), y: 3.55, w: w - 0.6, h: 0.9, fontSize: 20, bold: true, color: HEX.black, fontFace: THEME.headFontFace, valign: "top" }));
    s.addText(it[1], txt({ x: X(x + 0.3, w - 0.6), y: 4.5, w: w - 0.6, h: 0.75, fontSize: 15, color: HEX.onv, valign: "top" }));
  });
  notes(s, T.notes.contents);

  // ── 3 · divider + problem ─────────────────────────────────────────────────
  pres.addSection({ title: T.sections[1] });
  s = pres.addSlide({ masterName: "Section divider", sectionTitle: T.sections[1] });
  s.addText("01", { placeholder: "number" }); s.addText(T.div[0][0], { placeholder: "title" }); s.addText(T.div[0][1], { placeholder: "body" });
  notes(s, T.notes.divider);

  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[1] });
  s.addText(title2(...T.problem.title), { placeholder: "title" });
  T.problem.cards.forEach(([ic, h, b], i) => {
    const x = M + i * 4.1, w = 3.85;
    card(s, x, 2.55, w, 3.05, `problem-${i + 1}`);
    iconDot(s, x + 0.35, 2.9, ic);
    s.addText(h, txt({ x: X(x + 0.35, w - 0.7), y: 3.75, w: w - 0.7, h: 0.6, fontSize: 21, bold: true, color: HEX.black, fontFace: THEME.headFontFace }));
    s.addText(b, txt({ x: X(x + 0.35, w - 0.7), y: 4.4, w: w - 0.7, h: 1.05, fontSize: 16, color: HEX.onv, valign: "top" }));
  });
  notes(s, T.notes.problem);

  // ── 4 · divider + solution ────────────────────────────────────────────────
  pres.addSection({ title: T.sections[2] });
  s = pres.addSlide({ masterName: "Section divider", sectionTitle: T.sections[2] });
  s.addText("02", { placeholder: "number" }); s.addText(T.div[1][0], { placeholder: "title" }); s.addText(T.div[1][1], { placeholder: "body" });

  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[2] });
  s.addText(title2(...T.solution.title), { placeholder: "title" });
  s.addText(T.solution.points.map((p, i) => ({ text: p, options: { bullet: { code: "25CF" }, breakLine: i < T.solution.points.length - 1, paraSpaceAfter: 10 } })),
    txt({ x: X(M, 4.9), y: 2.45, w: 4.9, h: 3.8, fontSize: 17, color: HEX.ink, valign: "top" }));
  card(s, 5.85, 2.3, 6.88, 3.55, "product-vehicles");
  ui(s, "ui-vehicles", 6.0, 2.42, 6.58, 900 / 1880, "Vehicle list screen");
  notes(s, T.notes.solution);

  // ── 5 · feature grid ──────────────────────────────────────────────────────
  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[2] });
  s.addText(title2(...T.features.title), { placeholder: "title" });
  T.features.items.forEach(([ic, h, b, tag], i) => {
    const col = i % 3, row = Math.floor(i / 3), x = M + col * 4.1, y = 2.3 + row * 2.2, w = 3.85;
    card(s, x, y, w, 2.0, `feature-${i + 1}`);
    iconDot(s, x + 0.3, y + 0.3, ic, 0.56);
    s.addText(h, txt({ x: X(x + 1.05, w - 1.3), y: y + 0.33, w: w - 1.3, h: 0.5, fontSize: 17, bold: true, color: HEX.black, fontFace: THEME.headFontFace }));
    s.addText(b, txt({ x: X(x + 0.3, w - 0.6), y: y + 0.98, w: w - 0.6, h: tag ? 0.5 : 0.9, fontSize: 13, color: HEX.onv, valign: "top" }));
    if (tag) pill(s, x + w - 2.05, y + 1.5, tag, "info", 1.8);
  });
  notes(s, T.notes.features);

  // ── 6 · product proof ─────────────────────────────────────────────────────
  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[2] });
  s.addText(title2(...T.proof.title), { placeholder: "title" });
  card(s, M, 2.25, 7.1, 4.4, "product-fuel");
  ui(s, "ui-fuel", M + 0.15, 2.38, 6.8, 1160 / 1880, "Fuel economy chart");
  T.proof.points.forEach(([h, b], i) => {
    const y = 2.35 + i * 1.42;
    s.addText(String(i + 1), txt({ x: X(8.15, 0.5), y, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: HEX.accent, align: "center", valign: "middle",
      fill: { color: HEX.tint }, shape: pres.shapes.OVAL, objectName: `proof-num-${i + 1}` }));
    s.addText(h, txt({ x: X(8.85, 3.9), y: y - 0.02, w: 3.9, h: 0.45, fontSize: 17, bold: true, color: HEX.black, fontFace: THEME.headFontFace }));
    s.addText(b, txt({ x: X(8.85, 3.9), y: y + 0.45, w: 3.9, h: 0.8, fontSize: 13, color: HEX.onv, valign: "top" }));
  });
  notes(s, T.notes.proof);

  // ── 7 · stats (rules from the code) ───────────────────────────────────────
  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[2] });
  s.addText(title2(...T.stats.title), { placeholder: "title" });
  T.stats.items.forEach(([n, h, b], i) => {
    const x = M + i * 3.07, w = 2.85;
    card(s, x, 2.4, w, 3.75, `stat-${i + 1}`);
    s.addText(n, txt({ x: X(x + 0.3, w - 0.5), y: 2.7, w: w - 0.5, h: 1.1, fontSize: 54, bold: true, color: HEX.blue, fontFace: ar ? THEME.headFontFace : "Hanken Grotesk" }));
    s.addText(h, txt({ x: X(x + 0.3, w - 0.6), y: 3.9, w: w - 0.6, h: 0.75, fontSize: 16, bold: true, color: HEX.black, fontFace: THEME.headFontFace, valign: "top" }));
    s.addText(b, txt({ x: X(x + 0.3, w - 0.6), y: 4.65, w: w - 0.6, h: 1.35, fontSize: 12.5, color: HEX.onv, valign: "top" }));
  });
  s.addText(T.stats.source, txt({ x: X(M, W - 2 * M), y: 6.35, w: W - 2 * M, h: 0.3, fontSize: 11, color: HEX.muted }));
  notes(s, T.notes.stats);

  // ── 8 · how it works (process) ────────────────────────────────────────────
  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[2] });
  s.addText(title2(...T.process.title), { placeholder: "title" });
  T.process.steps.forEach(([ic, h, b], i) => {
    const x = M + i * 4.1, w = 3.85;
    card(s, x, 2.5, w, 3.0, `step-${i + 1}`);
    iconDot(s, x + 0.35, 2.85, ic);
    s.addText(`${String(i + 1).padStart(2, "0")}  ${h}`, txt({ x: X(x + 0.35, w - 0.7), y: 3.7, w: w - 0.7, h: 0.55, fontSize: 21, bold: true, color: HEX.black, fontFace: THEME.headFontFace }));
    s.addText(b, txt({ x: X(x + 0.35, w - 0.7), y: 4.3, w: w - 0.7, h: 1.05, fontSize: 15, color: HEX.onv, valign: "top" }));
    if (i < 2) s.addImage({ path: A("icons/icon-arrowRight.png"), x: X(x + w + 0.02, 0.22), y: 4.13, w: 0.22, h: 0.22, rotate: ar ? 180 : 0, objectName: `arrow-${i + 1}` });
  });
  notes(s, T.notes.process);

  // ── 9 · built for Saudi fleets ────────────────────────────────────────────
  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[2] });
  s.addText(title2(...T.saudi.title), { placeholder: "title" });
  T.saudi.chips.forEach((c, i) => {
    const w = 2.75, x = M + (i % 3) * 2.95, y = 2.35 + Math.floor(i / 3) * 0.72;
    s.addText(c, txt({ x: X(x, w), y, w, h: 0.52, fontSize: 15, bold: true, color: HEX.navy, align: "center", valign: "middle",
      fill: { color: HEX.white }, line: { color: HEX.border, width: 1 }, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.26, objectName: `chip-${i + 1}` }));
  });
  s.addText(T.saudi.whoTitle, txt({ x: X(M, 8.6), y: 4.0, w: 8.6, h: 0.45, fontSize: 18, bold: true, color: HEX.black, fontFace: THEME.headFontFace }));
  T.saudi.who.forEach(([ic, h], i) => {
    const x = M + (i % 2) * 4.35, y = 4.6 + Math.floor(i / 2) * 0.85;
    iconDot(s, x, y, ic, 0.55);
    s.addText(h, txt({ x: X(x + 0.75, 3.5), y: y + 0.05, w: 3.5, h: 0.45, fontSize: 15, color: HEX.ink, valign: "middle" }));
  });
  card(s, 9.75, 2.35, 2.98, 3.9, "papers-card");
  ui(s, "ui-papers", 9.85, 2.6, 2.78, 1020 / 1880, "Document expiry cards");
  s.addText(T.saudi.papers, txt({ x: X(9.95, 2.6), y: 4.35, w: 2.6, h: 1.7, fontSize: 12.5, color: HEX.onv, valign: "top" }));
  notes(s, T.notes.saudi);

  // ── 10 · proposal: rollout table ──────────────────────────────────────────
  pres.addSection({ title: T.sections[3] });
  s = pres.addSlide({ masterName: "Section divider", sectionTitle: T.sections[3] });
  s.addText("03", { placeholder: "number" }); s.addText(T.div[2][0], { placeholder: "title" }); s.addText(T.div[2][1], { placeholder: "body" });

  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[3] });
  s.addText(title2(...T.rollout.title), { placeholder: "title" });
  const hdr = T.rollout.head.map(h => ({ text: h, options: { bold: true, color: HEX.navy, fill: { color: HEX.tint }, fontSize: 13 } }));
  const rows = T.rollout.rows.map((r, i) => r.map((c, j) => ({ text: c, options: { fontSize: 13, color: j === 0 ? HEX.black : HEX.ink, bold: j === 0,
    fill: { color: i % 2 ? HEX.paper : HEX.white }, fontFace: j === 3 ? "IBM Plex Mono" : undefined } })));
  const colW = [2.6, 5.6, 2.2, 1.73];
  s.addTable([hdr, ...rows], { x: M, y: 2.3, w: W - 2 * M, colW, rowH: 0.62, valign: "middle", align: AL, margin: [0.06, 0.12, 0.06, 0.12],
    border: { type: "solid", pt: 0.75, color: HEX.border }, fontFace: THEME.bodyFontFace, rtlMode: ar, objectName: "rollout-table" });
  s.addText(T.rollout.note, txt({ x: X(M, W - 2 * M), y: 6.2, w: W - 2 * M, h: 0.35, fontSize: 12, color: HEX.muted }));
  notes(s, T.notes.rollout);

  // ── 11 · big statement ────────────────────────────────────────────────────
  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[3] });
  card(s, M, 1.95, W - 2 * M, 3.9, "statement-card", HEX.tint);
  s.addText(title2(...T.statement.lines).map(r => ({ ...r, options: { ...r.options, fontSize: 48, bold: true } })),
    txt({ x: X(M + 0.7, W - 2 * M - 1.4), y: 2.45, w: W - 2 * M - 1.4, h: 2.2, fontFace: THEME.headFontFace, valign: "middle" }));
  s.addText(T.statement.sub, txt({ x: X(M + 0.7, W - 2 * M - 1.4), y: 4.75, w: W - 2 * M - 1.4, h: 0.7, fontSize: 17, color: HEX.navy }));
  notes(s, T.notes.statement);

  // ── 12 · next steps ───────────────────────────────────────────────────────
  s = pres.addSlide({ masterName: "Title only", sectionTitle: T.sections[3] });
  s.addText(title2(...T.next.title), { placeholder: "title" });
  T.next.steps.forEach(([h, b], i) => {
    const y = 2.35 + i * 1.25;
    s.addText(String(i + 1), txt({ x: X(M, 0.6), y, w: 0.6, h: 0.6, fontSize: 20, bold: true, color: HEX.white, align: "center", valign: "middle",
      fill: { color: HEX.blue }, shape: pres.shapes.OVAL, objectName: `next-num-${i + 1}` }));
    s.addText(h, txt({ x: X(M + 0.85, 6.4), y: y - 0.04, w: 6.4, h: 0.45, fontSize: 19, bold: true, color: HEX.black, fontFace: THEME.headFontFace }));
    s.addText(b, txt({ x: X(M + 0.85, 6.4), y: y + 0.42, w: 6.4, h: 0.6, fontSize: 14, color: HEX.onv, valign: "top" }));
  });
  card(s, 8.6, 2.3, 4.13, 3.75, "contact-card");
  s.addText(T.next.contactTitle, txt({ x: X(8.95, 3.5), y: 2.6, w: 3.5, h: 0.4, fontSize: 13, bold: true, color: HEX.accent }));
  s.addText(T.next.contact.map((l, i) => ({ text: l, options: { breakLine: i < T.next.contact.length - 1, bold: i === 0, fontSize: i === 0 ? 20 : 14, color: i === 0 ? HEX.black : HEX.onv } })),
    txt({ x: X(8.95, 3.5), y: 3.1, w: 3.5, h: 1.6, valign: "top", paraSpaceAfter: 4 }));
  s.addText("fleetana.sa", txt({ x: X(8.95, 3.5), y: 5.2, w: 3.5, h: 0.45, fontSize: 18, bold: true, color: HEX.accent }));
  notes(s, T.notes.next);

  // ── 13 · closing ──────────────────────────────────────────────────────────
  s = pres.addSlide({ masterName: "Closing", sectionTitle: T.sections[3] });
  s.addText(T.closing[0], { placeholder: "title" });
  s.addText(T.closing[1], { placeholder: "body" });
  notes(s, T.notes.closing);

  const out = path.join(__dirname, `Fleetana-Template-${lang.toUpperCase()}.pptx`);
  await save(out, { potx: true });
  console.log("wrote", path.basename(out));
}

// ── copy ────────────────────────────────────────────────────────────────────
const COPY = {
  en: {
    meta: { title: "Fleetana — company profile" },
    sections: ["Introduction", "The problem", "What Fleetana does", "Proposal"],
    cover: { eyebrow: "COMPANY PROFILE", title: ["Get your fleet", "off spreadsheets"], sub: "Fleet management built for Saudi fleets", tag: "Live map · GPS tracker", meta: "Company name · DD/MM/YYYY · fleetana.sa" },
    contents: { title: "Contents", items: [["The problem", "Where fleet time and money slip away"], ["What Fleetana does", "One workspace for every vehicle"], ["Built for Saudi fleets", "Istimara, Fahes, SAR, Arabic"], ["Proposal", "Rollout and next steps"]] },
    div: [["The problem", "Fleets run on spreadsheets, receipts and memory"], ["What Fleetana does", "One place for everything that touches your fleet"], ["Proposal", "How we would roll Fleetana out for you"]],
    problem: { title: ["Your fleet runs on", "spreadsheets and memory"], cards: [
      ["clipboard", "Spreadsheets", "Service dates, plates and Istimara expiries live in files nobody updates on time."],
      ["fuel", "Receipts", "Fuel and repair spend sits in drawers and photos, so odd fill-ups go unnoticed."],
      ["bell", "Chat threads", "Checks, faults and approvals happen in WhatsApp, and nothing links back to the vehicle."]] },
    solution: { title: ["One workspace", "for every vehicle"], points: [
      "Every fuel log, service entry, issue, inspection and work order links to the same vehicle",
      "Service due by km, engine hours or date, whichever comes first",
      "Istimara, insurance and Fahes listed 30 days before they expire",
      "Arabic and English, SAR with 15% VAT, km and engine hours"] },
    features: { title: ["Everything that", "touches your fleet"], items: [
      ["truck", "Vehicles", "Plates, drivers, documents and status for every vehicle."],
      ["wrench", "Service & PM", "Programs by km, hours or date. Due soon and overdue at a glance."],
      ["fuel", "Fuel", "km/L on every full fill. Fills below 70% of the 30-day average flagged."],
      ["clipboard", "Inspections", "Custom checklists with photos. A failed item opens an issue."],
      ["check", "Work orders", "Parts, labour and fees, with 15% VAT and approval steps."],
      ["pin", "Live map", "Moving, idle, parked. Trip replay and driver scores.", "GPS tracker"]] },
    proof: { title: ["Odd fill-ups", "get flagged"], points: [
      ["Economy on every full fill", "Distance since the last full fill ÷ fuel added, with an odometer reading."],
      ["Compared with its own average", "Each vehicle against its 30-day average, not against the fleet."],
      ["Below 70%? Flagged Low", "Worth checking for a vehicle problem or a logging error."]] },
    stats: { title: ["Rules you can check,", "not promises"], source: "Each figure is a rule in the product, not a customer result.", items: [
      ["70%", "Fuel flag", "A full fill below 70% of the vehicle's 30-day average is flagged Low."],
      ["30", "Days ahead", "Istimara, insurance and Fahes expiring within 30 days are listed on Home."],
      ["15%", "VAT built in", "Work orders and costs in SAR, with VAT added or split out."],
      ["3", "Service triggers", "km, engine hours or date, whichever comes first."]] },
    process: { title: ["How it", "works"], steps: [
      ["camera", "Capture", "Drivers and operators log fuel, run inspections and report issues from any device."],
      ["box", "Organise", "Everything links to the right vehicle. Reminders come from your service programs."],
      ["chart", "Decide", "Open Home or a vehicle to see what is due, what is overdue and what is expiring."]] },
    saudi: { title: ["Built for", "Saudi fleets"], chips: ["Istimara", "Fahes", "Insurance", "SAR + 15% VAT", "km & engine hours", "العربية · English"],
      whoTitle: "For fleets of 10 to 50 vehicles", who: [["truck", "Delivery & courier"], ["wrench", "Construction & heavy equipment"], ["box", "Distribution & retail"], ["users", "Passenger & school transport"]],
      papers: "Expiry dates live on each vehicle, and Home lists everything expiring in the next 30 days." },
    rollout: { title: ["Proposed", "rollout"], head: ["Phase", "What happens", "Owner", "Week"], note: "Example plan. Adjust phases, owners and weeks to the client.", rows: [
      ["Set up", "Add vehicles, drivers, documents and team members", "Your team", "1"],
      ["Service programs", "Choose service tasks and intervals from the default set", "Together", "1–2"],
      ["Daily use", "Log fuel, run inspections and raise issues", "Your drivers", "2–4"],
      ["Review", "Walk through what is due, overdue and expiring", "Together", "4"]] },
    statement: { lines: ["Log the odometer.", "We flag the rest."], sub: "Fleetana does the arithmetic and the remembering. Your team does the driving." },
    next: { title: ["Next", "steps"], contactTitle: "CONTACT", contact: ["Full name", "Role, Fleetana", "name@fleetana.sa", "+966 5X XXX XXXX"], steps: [
      ["Agree the scope", "Vehicles, sites and the people who will use Fleetana."],
      ["Set up your workspace", "Vehicles, drivers and document dates added in week one."],
      ["Review together", "After four weeks, review what is due, overdue and expiring."]] },
    closing: ["Get your fleet off spreadsheets.", "fleetana.sa"],
    notes: {
      cover: "Cover layout. Eyebrow = document type (company profile, pitch, proposal). Title in two lines: statement in black, payoff in Accent Blue.",
      contents: "Title only layout with four cards. Keep each item to a short title and one line.",
      divider: "Section divider layout. Number, title and one supporting line.",
      problem: "Three cards with icons. One problem per card, in the customer's words. No invented statistics.",
      solution: "Text left, product screen right. Product screens are our illustrations; demo data must look like demo data.",
      features: "Six feature cards. GPS-dependent features carry the 'GPS tracker' tag.",
      proof: "One product screen with three numbered points that explain it.",
      stats: "Stat callouts. Only use numbers that are product rules or proven data, and say which.",
      process: "Three-step process with icons.",
      saudi: "Chips, audience list and a supporting screen.",
      rollout: "Table layout for proposals. Use the house table: Tint header, hairline rules, Paper banding.",
      statement: "Big statement on a Tint card. Use once per deck.",
      next: "Numbered next steps with a contact card.",
      closing: "Closing layout. Logo, the line, the URL.",
    },
  },
  ar: {
    meta: { title: "فليتانا — الملف التعريفي" },
    sections: ["مقدمة", "المشكلة", "ما يقدمه فليتانا", "العرض"],
    cover: { eyebrow: "الملف التعريفي", title: ["أخرج أسطولك", "من جداول البيانات"], sub: "إدارة أساطيل صُممت للأساطيل السعودية", tag: "الخريطة المباشرة · جهاز تتبع", meta: "اسم الجهة · DD/MM/YYYY · fleetana.sa" },
    contents: { title: "المحتويات", items: [["المشكلة", "أين يضيع وقت الأسطول وماله"], ["ما يقدمه فليتانا", "مساحة عمل واحدة لكل مركبة"], ["صُمّم للأساطيل السعودية", "الاستمارة، الفحص الدوري، الريال، العربية"], ["العرض", "خطة التطبيق والخطوات التالية"]] },
    div: [["المشكلة", "أساطيل تُدار بجداول البيانات والإيصالات والذاكرة"], ["ما يقدمه فليتانا", "مكان واحد لكل ما يتعلق بأسطولك"], ["العرض", "كيف نطبّق فليتانا لديكم"]],
    problem: { title: ["أسطولك يُدار", "بالجداول والذاكرة"], cards: [
      ["clipboard", "جداول البيانات", "مواعيد الصيانة واللوحات وتواريخ الاستمارة في ملفات لا تُحدَّث في وقتها."],
      ["fuel", "الإيصالات", "مصاريف الوقود والإصلاح في الأدراج والصور، فتمر التعبئة غير المعتادة دون انتباه."],
      ["bell", "محادثات الواتساب", "الفحوصات والأعطال والموافقات في المحادثات، ولا شيء مرتبط بالمركبة."]] },
    solution: { title: ["مساحة عمل واحدة", "لكل مركبة"], points: [
      "كل سجل وقود وصيانة وبلاغ وفحص وأمر عمل مرتبط بالمركبة نفسها",
      "مواعيد الصيانة بالكيلومترات أو ساعات التشغيل أو التاريخ، أيّها أسبق",
      "الاستمارة والتأمين والفحص الدوري تظهر قبل انتهائها بـ30 يومًا",
      "العربية والإنجليزية، والريال مع ضريبة القيمة المضافة 15٪، والكيلومترات وساعات التشغيل"] },
    features: { title: ["كل ما يتعلق", "بأسطولك"], items: [
      ["truck", "المركبات", "اللوحات والسائقون والوثائق والحالة لكل مركبة."],
      ["wrench", "الصيانة والوقاية", "برامج بالكيلومترات أو الساعات أو التاريخ، مع المستحق والمتأخر بنظرة."],
      ["fuel", "الوقود", "كم/لتر لكل تعبئة كاملة، وتمييز ما يقل عن 70٪ من متوسط 30 يومًا."],
      ["clipboard", "الفحوصات", "قوائم فحص مخصصة مع الصور، والبند الفاشل يفتح بلاغًا."],
      ["check", "أوامر العمل", "القطع والعمالة والرسوم، مع ضريبة 15٪ وخطوات الاعتماد."],
      ["pin", "الخريطة المباشرة", "تتحرك، خاملة، متوقفة، مع إعادة الرحلات وتقييم السائقين.", "جهاز تتبع"]] },
    proof: { title: ["التعبئة غير المعتادة", "تظهر بعلامة «منخفض»"], points: [
      ["معدل لكل تعبئة كاملة", "المسافة منذ التعبئة الكاملة السابقة ÷ الوقود المضاف، مع قراءة العداد."],
      ["مقارنة بمتوسط المركبة نفسها", "كل مركبة مقابل متوسطها خلال 30 يومًا، لا مقابل الأسطول."],
      ["أقل من 70٪؟ «منخفض»", "يستحق التحقق من وجود عطل في المركبة أو خطأ في التسجيل."]] },
    stats: { title: ["قواعد يمكنك التحقق منها،", "لا وعود"], source: "كل رقم هنا قاعدة في المنتج، وليس نتيجة عميل.", items: [
      ["70٪", "تمييز الوقود", "التعبئة الكاملة الأقل من 70٪ من متوسط المركبة خلال 30 يومًا تظهر «منخفض»."],
      ["30", "يومًا مسبقًا", "الاستمارة والتأمين والفحص الدوري التي تنتهي خلال 30 يومًا تظهر في الرئيسية."],
      ["15٪", "الضريبة مدمجة", "أوامر العمل والتكاليف بالريال، مع إضافة الضريبة أو فصلها."],
      ["3", "طرق للاستحقاق", "الكيلومترات أو ساعات التشغيل أو التاريخ، أيّها أسبق."]] },
    process: { title: ["كيف", "يعمل"], steps: [
      ["camera", "التسجيل", "يسجّل السائقون والمشغّلون الوقود ويجرون الفحوصات ويبلّغون عن المشكلات من أي جهاز."],
      ["box", "التنظيم", "كل شيء يرتبط بالمركبة الصحيحة، والتذكيرات تُحسب من برامج الصيانة لديك."],
      ["chart", "القرار", "افتح الرئيسية أو صفحة المركبة لترى المستحق والمتأخر وما سينتهي قريبًا."]] },
    saudi: { title: ["صُمّم", "للأساطيل السعودية"], chips: ["الاستمارة", "الفحص الدوري", "التأمين", "الريال وضريبة 15٪", "كم وساعات التشغيل", "العربية · English"],
      whoTitle: "للأساطيل من 10 إلى 50 مركبة", who: [["truck", "التوصيل والشحن"], ["wrench", "البناء والمعدات الثقيلة"], ["box", "التوزيع والتجزئة"], ["users", "نقل الركاب والنقل المدرسي"]],
      papers: "تواريخ الانتهاء محفوظة في سجل كل مركبة، والرئيسية تعرض ما ينتهي خلال 30 يومًا." },
    rollout: { title: ["خطة", "التطبيق"], head: ["المرحلة", "ما يحدث", "المسؤول", "الأسبوع"], note: "خطة نموذجية. عدّل المراحل والمسؤولين والأسابيع حسب الجهة.", rows: [
      ["الإعداد", "إضافة المركبات والسائقين والوثائق وأعضاء الفريق", "فريقكم", "1"],
      ["برامج الصيانة", "اختيار مهام الصيانة وفتراتها من المجموعة الافتراضية", "معًا", "1–2"],
      ["الاستخدام اليومي", "تسجيل الوقود وإجراء الفحوصات وفتح البلاغات", "سائقوكم", "2–4"],
      ["المراجعة", "مراجعة المستحق والمتأخر وما سينتهي", "معًا", "4"]] },
    statement: { lines: ["سجّل قراءة العداد،", "والباقي علينا."], sub: "فليتانا يتولى الحساب والتذكّر، وفريقك يتولى القيادة." },
    next: { title: ["الخطوات", "التالية"], contactTitle: "التواصل", contact: ["الاسم الكامل", "المسمى الوظيفي، فليتانا", "name@fleetana.sa", "+966 5X XXX XXXX"], steps: [
      ["الاتفاق على النطاق", "المركبات والمواقع والأشخاص الذين سيستخدمون فليتانا."],
      ["إعداد مساحة العمل", "إضافة المركبات والسائقين وتواريخ الوثائق في الأسبوع الأول."],
      ["المراجعة معًا", "بعد أربعة أسابيع، نراجع المستحق والمتأخر وما سينتهي."]] },
    closing: ["أخرج أسطولك من جداول البيانات.", "fleetana.sa"],
    notes: {
      cover: "تخطيط الغلاف. السطر العلوي لنوع المستند، والعنوان في سطرين: العبارة بالأسود والخلاصة بالأزرق.",
      contents: "تخطيط العنوان فقط مع أربع بطاقات.", divider: "تخطيط فاصل القسم: رقم وعنوان وسطر داعم.",
      problem: "ثلاث بطاقات بأيقونات. مشكلة واحدة لكل بطاقة، دون أرقام مختلقة.", solution: "نص يمين وشاشة المنتج يسار.",
      features: "ست بطاقات للميزات. الميزات التي تعتمد على التتبع تحمل وسم «جهاز تتبع».", proof: "شاشة منتج واحدة مع ثلاث نقاط مرقمة.",
      stats: "أرقام بارزة: فقط قواعد المنتج أو بيانات مثبتة، مع ذكر ذلك.", process: "عملية من ثلاث خطوات.", saudi: "وسوم وقائمة الجمهور وشاشة داعمة.",
      rollout: "جدول للعروض بنمط فليتانا.", statement: "عبارة كبيرة على بطاقة فاتحة. مرة واحدة في العرض.", next: "خطوات مرقمة مع بطاقة تواصل.", closing: "الختام: الشعار والعبارة والرابط.",
    },
  },
};

(async () => { await build("en"); await build("ar"); })();
