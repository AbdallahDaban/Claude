// Shared Fleetana deck system: theme, layouts (Cover, Section divider, Title only, Title and body, Closing)
// and slide helpers. Used by the template (build_pptx.js) and the company profile (../../profile).
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const SKILL = "/root/.claude/skills/synced/5a26829e-c972-43a4-8f15-5c1ddafdc14f_5c17e887-c8c0-4440-9bbc-83792b896460/pptx";
const { applyTheme } = require(path.join(SKILL, "scripts/apply_theme.js"));

const A = (f) => path.join(__dirname, "../../assets", f);
const W = 13.333, H = 7.5, M = 0.6;
const HEX = { ink: "0F172A", black: "000000", blue: "2A89FA", accent: "0051D5", navy: "1E3A8A", onv: "45464D", muted: "64748B",
  paper: "F7F9FB", tint: "E8F2FF", border: "D9D9D9", white: "FFFFFF" };
const PILL = { good: ["E3F4E9", "15803D"], warn: ["FAECDC", "B45309"], bad: ["FDE9E9", "B91C1C"], muted: ["ECEEF1", "475569"], info: ["E5F1FE", "1E3A8A"] };

function createDeck(lang, title) {
  const ar = lang === "ar";
  const THEME = {
    name: "Fleetana",
    headFontFace: ar ? "IBM Plex Sans Arabic" : "Hanken Grotesk",
    bodyFontFace: ar ? "IBM Plex Sans Arabic" : "Inter",
    colors: { dk1: HEX.ink, lt1: HEX.white, dk2: HEX.black, lt2: HEX.paper, accent1: HEX.blue, accent2: HEX.accent, accent3: "16A34A",
      accent4: "D97706", accent5: "EF4444", accent6: HEX.navy, hlink: HEX.accent, folHlink: HEX.navy },
  };
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Fleetana"; pres.company = "Fleetana"; pres.title = title; pres.rtlMode = ar;
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const X = (x, w) => (ar ? W - x - w : x);                 // mirror for RTL
  const AL = ar ? "right" : "left";
  const txt = (o) => ({ isTextBox: true, margin: 0, rtlMode: ar, align: AL, ...o });

  // ── layouts ────────────────────────────────────────────────────────────────
  const logo = (h = 0.26, y = 0.42) => ({ image: { path: A("logo-blue.png"), x: X(M, h * 7.27), y, w: h * 7.27, h } });
  const footer = [
    { text: { text: "fleetana.sa", options: { x: X(M, 3), y: H - 0.5, w: 3, h: 0.25, fontSize: 10, color: HEX.muted, align: AL, margin: 0 } } },
  ];
  const slideNum = { x: X(W - M - 0.8, 0.8), y: H - 0.5, w: 0.8, h: 0.25, fontSize: 10, color: HEX.muted, align: ar ? "left" : "right", margin: 0 };
  const titlePH = { name: "title", type: "title", x: X(M, W - 2 * M), y: 0.95, w: W - 2 * M, h: 1.05, fontSize: 32, bold: true, color: HEX.black, align: AL, valign: "top", margin: 0 };

  pres.defineSlideMaster({ title: "Cover", background: { path: A("cover-16x9.jpg") }, objects: [
    logo(0.42, 0.6),
    { placeholder: { options: { name: "eyebrow", type: "body", x: X(M, 8), y: 2.15, w: 8, h: 0.4, fontSize: 14, bold: true, color: HEX.accent, align: AL, margin: 0, charSpacing: ar ? 0 : 2 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: X(M, 6.9), y: 2.6, w: 6.9, h: 2.2, fontSize: 48, bold: true, color: HEX.black, align: AL, valign: "top", margin: 0, lineSpacingMultiple: 0.95 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: X(M, 6.9), y: 4.9, w: 6.9, h: 0.8, fontSize: 20, color: HEX.onv, align: AL, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: X(M, 9.2), y: 6.55, w: 9.2, h: 0.35, fontSize: 12, color: HEX.muted, align: AL, margin: 0 }, text: "" } },
  ] });
  pres.defineSlideMaster({ title: "Section divider", background: { path: A("divider-16x9.jpg") }, objects: [
    logo(),
    { placeholder: { options: { name: "number", type: "body", x: X(M, 4), y: 2.0, w: 4, h: 1.3, fontSize: 80, bold: true, color: HEX.blue, fontFace: THEME.headFontFace, align: AL, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: X(M, 10), y: 3.45, w: 10, h: 1.4, fontSize: 44, bold: true, color: HEX.black, align: AL, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: X(M, 9), y: 4.95, w: 9, h: 0.8, fontSize: 18, color: HEX.navy, align: AL, valign: "top", margin: 0 }, text: "" } },
    ...footer,
  ], slideNumber: slideNum });
  pres.defineSlideMaster({ title: "Title only", background: { color: HEX.paper }, objects: [
    logo(), { placeholder: { options: titlePH, text: "" } }, ...footer,
  ], slideNumber: slideNum });
  pres.defineSlideMaster({ title: "Title and body", background: { color: HEX.paper }, objects: [
    logo(), { placeholder: { options: { ...titlePH }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: X(M, W - 2 * M), y: 2.25, w: W - 2 * M, h: 4.3, fontSize: 18, color: HEX.ink, align: AL, valign: "top", margin: 0, paraSpaceAfter: 8 }, text: "" } },
    ...footer,
  ], slideNumber: slideNum });
  pres.defineSlideMaster({ title: "Closing", background: { path: A("cover-16x9.jpg") }, objects: [
    { image: { path: A("logo-blue.png"), x: (W - 4.6) / 2, y: 1.85, w: 4.6, h: 4.6 / 7.27 } },
    { placeholder: { options: { name: "title", type: "title", x: 1.2, y: 3.0, w: W - 2.4, h: 1.0, fontSize: 40, bold: true, color: HEX.black, align: "center", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 1.2, y: 4.05, w: W - 2.4, h: 0.6, fontSize: 20, color: HEX.accent, align: "center", margin: 0 }, text: "" } },
  ] });

  // ── slide helpers ──────────────────────────────────────────────────────────
  const title2 = (a, b) => [{ text: a, options: { color: HEX.black, breakLine: !!b } }, ...(b ? [{ text: b, options: { color: HEX.accent } }] : [])];
  const card = (s, x, y, w, h, name, fill = HEX.white) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: X(x, w), y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: HEX.border, width: 1 }, objectName: name,
    shadow: { type: "outer", color: "0F172A", opacity: 0.08, blur: 14, offset: 3, angle: 90 } });
  const iconDot = (s, x, y, name, d = 0.62) => {
    s.addShape(pres.shapes.OVAL, { x: X(x, d), y, w: d, h: d, fill: { color: HEX.tint }, line: { color: HEX.tint, width: 0 }, objectName: `icon-bg-${name}` });
    s.addImage({ path: A(`icons/icon-${name}.png`), x: X(x + d * 0.2, d * 0.6), y: y + d * 0.2, w: d * 0.6, h: d * 0.6, objectName: `icon-${name}` });
  };
  const ui = (s, file, x, y, w, ratio, name) => s.addImage({ path: A(`ui/${lang}/${file}.png`), x: X(x, w), y, w, h: w * ratio, objectName: name,
    altText: name });
  const pill = (s, x, y, label, kind, w = 1.6) => s.addText(label, txt({ x: X(x, w), y, w, h: 0.34, fontSize: 12, bold: true, color: PILL[kind][1],
    fill: { color: PILL[kind][0] }, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.17, align: "center", valign: "middle", objectName: `pill-${label}` }));
  const notes = (s, n) => s.addNotes(n);

  async function save(out, { potx = false } = {}) {
    await pres.writeFile({ fileName: out });
    await applyTheme(out, THEME);
    if (!potx) return;
    // .potx: same package, template content type
    const zip = await JSZip.loadAsync(fs.readFileSync(out));
    const ct = await zip.file("[Content_Types].xml").async("string");
    zip.file("[Content_Types].xml", ct.replace("presentationml.presentation.main+xml", "presentationml.template.main+xml"));
    fs.writeFileSync(out.replace(".pptx", ".potx"), await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  }
  return { pres, ar, THEME, X, AL, txt, title2, card, iconDot, ui, pill, notes, save };
}

module.exports = { createDeck, A, W, H, M, HEX, PILL };
