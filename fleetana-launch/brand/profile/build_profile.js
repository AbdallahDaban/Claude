// Fleetana company profile — for prospective clients. Light, 16:9.
//   node build_profile.js   → Fleetana-Company-Profile-EN.pptx
// Built on the shared deck system (../templates/powerpoint/deck.js). English first; Arabic follows once the copy is final.
// Placeholders the team fills in are written [Like this].
const path = require("path");
const { createDeck, W, M, HEX } = require("../templates/powerpoint/deck.js");

async function build(lang) {
  const T = COPY[lang];
  const { pres, ar, THEME, X, txt, title2, card, iconDot, ui, pill, notes, save } = createDeck(lang, T.meta.title);
  const HF = THEME.headFontFace;
  const R = { map: 1100 / 1880, costs: 1100 / 1880, route: 1100 / 1880, vehicles: 900 / 1880, reminders: 780 / 1880, inspection: 790 / 1880, papers: 1020 / 1880 };
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
  const divider = (n, [t, b], sec) => {
    const s = pres.addSlide({ masterName: "Section divider", sectionTitle: sec });
    s.addText(n, { placeholder: "number" }); s.addText(t, { placeholder: "title" }); s.addText(b, { placeholder: "body" });
  };
  const titled = (t, sec) => { const s = pres.addSlide({ masterName: "Title only", sectionTitle: sec }); s.addText(title2(...t), { placeholder: "title" }); return s; };
  // text left, product screen right (mirrors in RTL)
  const split = (key, sec, img, ratio, imgName) => {
    const c = T[key], s = titled(c.title, sec);
    bullets(s, c.points, M, 2.45, 5.0, 3.9);
    const cw = 6.78, ih = (cw - 0.24) * ratio;
    card(s, 5.95, 2.3, cw, ih + 0.24, `card-${img}`);
    ui(s, img, 6.07, 2.42, cw - 0.24, ratio, imgName);
    if (c.tag) pill(s, 5.95, 2.3 + ih + 0.45, c.tag, "info", 2.4);
    notes(s, c.notes);
    return s;
  };
  const SEC = T.sections;

  // ── 1 · cover ─────────────────────────────────────────────────────────────
  pres.addSection({ title: SEC[0] });
  let s = pres.addSlide({ masterName: "Cover", sectionTitle: SEC[0] });
  s.addText(T.cover.eyebrow, { placeholder: "eyebrow" });
  s.addText(title2(...T.cover.title), { placeholder: "title" });
  s.addText(T.cover.sub, { placeholder: "body" });
  s.addText(T.cover.meta, { placeholder: "meta" });
  card(s, 7.95, 1.7, 4.78, 3.0, "cover-map-card");
  ui(s, "ui-map", 8.07, 1.82, 4.54, R.map, "Fleet map");
  notes(s, T.cover.notes);

  // ── 2 · who we are ────────────────────────────────────────────────────────
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

  // ── 3 · vision & mission ──────────────────────────────────────────────────
  s = titled(T.vm.title, SEC[0]);
  T.vm.items.forEach(([k, v], i) => {
    const x = M + i * 6.15, w = 5.9;
    card(s, x, 2.4, w, 3.6, `vm-${i + 1}`, i ? HEX.white : HEX.tint);
    iconDot(s, x + 0.45, 2.8, i ? "check" : "chart", 0.62);
    s.addText(k, txt({ x: X(x + 0.45, w - 0.9), y: 3.65, w: w - 0.9, h: 0.4, fontSize: 14, bold: true, color: HEX.accent, charSpacing: ar ? 0 : 2 }));
    s.addText(v, txt({ x: X(x + 0.45, w - 0.9), y: 4.1, w: w - 0.9, h: 1.6, fontSize: 28, bold: true, color: HEX.black, fontFace: HF, valign: "top" }));
  });
  notes(s, T.vm.notes);

  // ── 4 · the problem ───────────────────────────────────────────────────────
  pres.addSection({ title: SEC[1] });
  divider("01", T.div[0], SEC[1]);
  s = titled(T.problem.title, SEC[1]);
  T.problem.cards.forEach(([ic, h, b], i) => {
    const x = M + i * 3.07, w = 2.85;
    card(s, x, 2.45, w, 3.4, `problem-${i + 1}`);
    iconDot(s, x + 0.3, 2.75, ic);
    s.addText(h, txt({ x: X(x + 0.3, w - 0.6), y: 3.6, w: w - 0.6, h: 0.5, fontSize: 19, bold: true, color: HEX.black, fontFace: HF }));
    s.addText(b, txt({ x: X(x + 0.3, w - 0.6), y: 4.15, w: w - 0.6, h: 1.5, fontSize: 14, color: HEX.onv, valign: "top" }));
  });
  notes(s, T.problem.notes);

  // ── 5 · visibility ────────────────────────────────────────────────────────
  pres.addSection({ title: SEC[2] });
  divider("02", T.div[1], SEC[2]);

  // fleet visibility: points left, live map right
  s = titled(T.fleetVis.title, SEC[2]);
  T.fleetVis.points.forEach(([ic, h, b], i) => {
    const y = 2.35 + i * 1.02;
    iconDot(s, M, y, ic, 0.56);
    s.addText(h, txt({ x: X(M + 0.8, 4.6), y: y - 0.02, w: 4.6, h: 0.4, fontSize: 17, bold: true, color: HEX.black, fontFace: HF }));
    s.addText(b, txt({ x: X(M + 0.8, 4.6), y: y + 0.38, w: 4.6, h: 0.55, fontSize: 13, color: HEX.onv, valign: "top" }));
  });
  card(s, 6.15, 2.3, 6.58, 3.97, "card-map");
  ui(s, "ui-map", 6.27, 2.42, 6.34, R.map, "Live map");
  pill(s, 6.15, 6.42, T.fleetVis.tag, "info", 2.4);
  notes(s, T.fleetVis.notes);

  // cost visibility: cost card left, numbered points right
  s = titled(T.costVis.title, SEC[2]);
  card(s, M, 2.3, 6.9, 4.15, "card-costs");
  ui(s, "ui-costs", M + 0.12, 2.38, 6.66, R.costs, "Vehicle cost breakdown");
  numbered(s, T.costVis.points, 7.95, 2.35, 4.78, 1.08);
  notes(s, T.costVis.notes);

  // route optimisation: map left, numbered points right
  s = titled(T.route.title, SEC[2]);
  card(s, M, 2.3, 6.9, 4.15, "card-route");
  ui(s, "ui-route", M + 0.12, 2.38, 6.66, R.route, "Driven route vs optimised route");
  numbered(s, T.route.points, 7.95, 2.35, 4.78, 1.3);
  pill(s, 7.95, 6.1, T.route.tag, "info", 2.4);
  notes(s, T.route.notes);

  // visibility → savings
  s = titled(T.savings.title, SEC[2]);
  tiles(s, T.savings.items);
  notes(s, T.savings.notes);

  // ── 6 · what Fleetana does ────────────────────────────────────────────────
  pres.addSection({ title: SEC[3] });
  divider("03", T.div[2], SEC[3]);
  s = titled(T.overview.title, SEC[3]);
  tiles(s, T.overview.items);
  notes(s, T.overview.notes);
  split("vehicles", SEC[3], "ui-vehicles", R.vehicles, "Vehicle list");
  split("service", SEC[3], "ui-reminders", R.reminders, "Service reminders");
  split("inspections", SEC[3], "ui-inspection", R.inspection, "Inspection with a failed item");

  // built for Saudi fleets
  s = titled(T.saudi.title, SEC[3]);
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

  // ── 7 · working with us ───────────────────────────────────────────────────
  pres.addSection({ title: SEC[4] });
  s = titled(T.onboard.title, SEC[4]);
  T.onboard.steps.forEach(([ic, h, b], i) => {
    const x = M + i * 3.07, w = 2.85;
    card(s, x, 2.45, w, 3.4, `step-${i + 1}`);
    iconDot(s, x + 0.3, 2.75, ic);
    s.addText(`${String(i + 1).padStart(2, "0")}  ${h}`, txt({ x: X(x + 0.3, w - 0.6), y: 3.6, w: w - 0.6, h: 0.5, fontSize: 18, bold: true, color: HEX.black, fontFace: HF }));
    s.addText(b, txt({ x: X(x + 0.3, w - 0.6), y: 4.15, w: w - 0.6, h: 1.5, fontSize: 14, color: HEX.onv, valign: "top" }));
  });
  notes(s, T.onboard.notes);

  s = titled(T.team.title, SEC[4]);
  T.team.people.forEach(([n, r], i) => {
    const x = M + i * 4.1, w = 3.85;
    card(s, x, 2.45, w, 3.5, `team-${i + 1}`);
    s.addShape(pres.shapes.OVAL, { x: X(x + (w - 1.4) / 2, 1.4), y: 2.8, w: 1.4, h: 1.4, fill: { color: HEX.tint }, line: { color: HEX.border, width: 1 }, objectName: `photo-${i + 1}` });
    s.addText(T.team.photo, txt({ x: X(x + (w - 1.4) / 2, 1.4), y: 2.8, w: 1.4, h: 1.4, fontSize: 11, color: HEX.muted, align: "center", valign: "middle" }));
    s.addText(n, txt({ x: X(x + 0.3, w - 0.6), y: 4.45, w: w - 0.6, h: 0.5, fontSize: 20, bold: true, color: HEX.black, fontFace: HF, align: "center" }));
    s.addText(r, txt({ x: X(x + 0.3, w - 0.6), y: 4.95, w: w - 0.6, h: 0.4, fontSize: 15, color: HEX.accent, align: "center" }));
  });
  notes(s, T.team.notes);

  s = pres.addSlide({ masterName: "Closing", sectionTitle: SEC[4] });
  s.addText(T.closing[0], { placeholder: "title" });
  s.addText(T.closing[1], { placeholder: "body" });
  notes(s, T.closingNotes);

  const out = path.join(__dirname, `Fleetana-Company-Profile-${lang.toUpperCase()}.pptx`);
  await save(out);
  console.log("wrote", path.basename(out));
}

// ── copy ────────────────────────────────────────────────────────────────────
const TRACKER = "Requires a GPS tracker";
const COPY = {
  en: {
    meta: { title: "Fleetana — company profile" },
    sections: ["About us", "The problem", "Visibility", "The platform", "Working with us"],
    cover: { eyebrow: "COMPANY PROFILE", title: ["Your whole fleet.", "One place."], sub: "Fleet and cost visibility, built for Saudi fleets",
      meta: "Fleetana · 2026 · fleetana.sa", notes: "Fleetana company profile for prospective clients." },
    who: { title: ["Who", "we are"],
      lead: "Fleetana is fleet-management software built in Saudi Arabia for the people who run vehicles.",
      points: [
        "One platform for vehicles, drivers, routes, fuel, service, inspections and work orders",
        "Shows what every vehicle is doing and what every vehicle costs",
        "Web app for managers, mobile app for drivers and technicians",
        "Arabic and English throughout, SAR with 15% VAT"],
      facts: [["FOUNDED", "[Year]"], ["HEADQUARTERS", "[City], Saudi Arabia"], ["CR NUMBER", "[CR number]"], ["LANGUAGES", "Arabic · English"]],
      notes: "Replace [Year], [City] and [CR number] before sending." },
    vm: { title: ["Vision &", "mission"], items: [["VISION", "Every Saudi fleet run on facts, not spreadsheets."], ["MISSION", "One place to see every vehicle, its cost and its next job."]],
      notes: "Read both lines aloud; let them stand." },
    div: [["The problem", "Fleets run on spreadsheets, receipts and memory"],
      ["Two kinds of visibility", "Know what your fleet is doing. Know where its money goes."],
      ["The platform", "Everything that touches your fleet, in one place"]],
    problem: { title: ["Where does your", "fleet's money go?"], cards: [
      ["clipboard", "Spreadsheets", "Service dates, plates and Istimara expiries live in files nobody updates on time."],
      ["fuel", "Receipts", "Fuel and repair spend sits in drawers and photos, so odd fill-ups go unnoticed."],
      ["pin", "Blind spots", "Nobody can say which route a vehicle took, or how long it sat idling."],
      ["bell", "Chat threads", "Checks, faults and approvals happen in WhatsApp, and nothing links back to the vehicle."]],
      notes: "Ask the client which of these four sounds most like their week." },
    fleetVis: { title: ["Know what every", "vehicle is doing"], tag: TRACKER, points: [
      ["pin", "Live map", "Every vehicle as moving, idle, parked or no signal, updated every few seconds."],
      ["chart", "Trip replay", "See the exact route each vehicle drove, stop by stop."],
      ["alert", "Idle time", "Engine-on minutes per trip and per day, for every vehicle."],
      ["users", "Driver scores", "Harsh driving, speeding and collisions turned into a 0–100 score."]],
      notes: "Fleet visibility needs a GPS tracker in each vehicle. Cost visibility on the next slide does not." },
    costVis: { title: ["See where your fleet's", "money really goes"], points: [
      ["Cost per vehicle", "Fuel, service and work orders add up on each vehicle, in SAR, with cost per km."],
      ["Fuel anomalies flagged", "A full fill below 70% of that vehicle's 30-day average is flagged Low."],
      ["Every riyal itemised", "Work orders split parts, labour and fees, with 15% VAT."],
      ["Warranty on record", "Check the warranty before you pay for the same repair twice."]],
      notes: "Illustration uses demo figures." },
    route: { title: ["Shorter routes,", "less fuel"], tag: TRACKER, points: [
      ["Optimised routes", "Fleetana orders your stops into the shortest route before the vehicle leaves."],
      ["Planned vs driven", "Compare the route you planned with the route actually driven."],
      ["Fewer wasted kilometres", "Every kilometre saved is fuel, time and wear you don't pay for."]],
      notes: "Map and distances are demo figures." },
    savings: { title: ["Find the leaks.", "Fix them."], items: [
      ["alert", "Cut idle time", "See which vehicles idle longest, and when."],
      ["pin", "Drive shorter routes", "Optimised stop order, every day."],
      ["fuel", "Question odd fills", "Low fills flagged against each vehicle's own average."],
      ["users", "Coach your drivers", "Scores show who needs a word, and why."],
      ["wrench", "Service before breakdowns", "Due by km, engine hours or date."],
      ["truck", "Retire the costliest", "Cost per vehicle and per km, side by side."]],
      notes: "Each saving is an action the client takes with what Fleetana shows them." },
    overview: { title: ["Everything that", "touches your fleet"], items: [
      ["truck", "Vehicles & documents", "Plates, drivers, Istimara, insurance and Fahes for every vehicle."],
      ["wrench", "Service & maintenance", "Programs by km, engine hours or date. Due soon and overdue at a glance."],
      ["fuel", "Fuel", "km/L on every full fill. Low fills flagged."],
      ["clipboard", "Inspections & issues", "Custom checklists with photos. A failed item opens an issue."],
      ["check", "Work orders & parts", "Parts, labour and fees, with 15% VAT and approval steps."],
      ["pin", "Live map & routes", "Live positions, trip replay, optimised routes and driver scores.", "GPS tracker"]],
      notes: "The six modules. The next slides go through them." },
    vehicles: { title: ["Every vehicle,", "one record"], points: [
      "Plate, VIN, make, model, driver and status for every vehicle",
      "Fuel, service, issues, inspections and work orders all link to the same vehicle",
      "Istimara, insurance and Fahes listed 30 days before they expire",
      "Statuses from Active to In shop, Out of service, Sold and Retired"],
      notes: "Demo data on screen." },
    service: { title: ["Service on schedule,", "not after breakdowns"], points: [
      "Service due by km, engine hours or date, whichever comes first",
      "36 standard service tasks ready on day one",
      "Work orders with parts, labour, fees, 15% VAT and approval",
      "Parts stock per location with reorder minimums",
      "Warranty periods on parts and repairs"],
      notes: "Demo data on screen." },
    inspections: { title: ["Inspections that", "lead to action"], points: [
      "Custom inspection forms for each vehicle type",
      "Drivers complete them in the mobile app, with photos",
      "A failed item opens an issue automatically",
      "Issues from Low to Critical, with alerts for the urgent ones"],
      notes: "Demo data on screen." },
    saudi: { title: ["Built for", "Saudi fleets"], chips: ["Istimara", "Fahes", "Insurance", "SAR + 15% VAT", "km & engine hours", "العربية · English"],
      whoTitle: "Made for fleets like yours", who: [["truck", "Delivery & courier"], ["wrench", "Construction & heavy equipment"], ["box", "Distribution & retail"], ["users", "Passenger & school transport"]],
      papers: "Expiry dates live on each vehicle, and Home lists everything expiring in the next 30 days.", notes: "Adjust the industries to the client." },
    onboard: { title: ["How we get", "you running"], steps: [
      ["users", "Sign up", "Create your workspace at fleetana.sa and invite your team."],
      ["truck", "Add vehicles", "Vehicles, drivers and document dates, imported or added by hand."],
      ["wrench", "Set your rules", "Service programs from the standard set, and your inspection forms."],
      ["pin", "Connect trackers", "GPS trackers switch on the live map, routes and driver scores."]],
      notes: "Most of setup happens in the first week." },
    team: { title: ["The team", "behind Fleetana"], photo: "Photo", people: [["[Name]", "[Role]"], ["[Name]", "[Role]"], ["[Name]", "[Role]"]],
      notes: "Replace names, roles and photos. Use square photos on a light background." },
    closing: ["Get your fleet off spreadsheets.", "fleetana.sa  ·  [Phone]  ·  [Email]"],
    closingNotes: "Replace [Phone] and [Email].",
  },
};

(async () => { await build("en"); })();
