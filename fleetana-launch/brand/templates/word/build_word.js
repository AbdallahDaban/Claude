// Fleetana Word templates — document (cover + body) and letterhead, English (LTR) and Arabic (RTL).
//   node build_word.js   → writes .docx and .dotx files next to this script
// Styles follow the brand skill v2: Hanken Grotesk headings, Inter body, IBM Plex Sans Arabic for Arabic,
// IBM Plex Mono for data, Accent Blue #0051D5 for blue text, light surfaces only.
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, AlignmentType, HeadingLevel, PageNumber,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat, PageBreak,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader, VerticalAlign, TableLayoutType, LineRuleType,
} = require("docx");

const ASSETS = path.join(__dirname, "../../assets");
const img = (f) => fs.readFileSync(path.join(ASSETS, f));
const COL = { blue: "2A89FA", accent: "0051D5", navy: "1E3A8A", black: "000000", ink: "0F172A", onv: "45464D", muted: "64748B",
  paper: "F7F9FB", tint: "E8F2FF", border: "D9D9D9", white: "FFFFFF" };
const PILL = { good: ["E3F4E9", "15803D"], warn: ["FAECDC", "B45309"], bad: ["FDE9E9", "B91C1C"], muted: ["ECEEF1", "475569"], info: ["E5F1FE", "1E3A8A"] };
const A4 = { width: 11906, height: 16838 }, MARGIN = 1247, CONTENT = A4.width - 2 * MARGIN; // 22 mm margins

function build(lang, kind) {
  const ar = lang === "ar";
  const F = (latin) => ({ ascii: latin, hAnsi: latin, cs: "IBM Plex Sans Arabic", eastAsia: latin });
  const HEAD = F("Hanken Grotesk"), BODY = F("Inter"), MONO = F("IBM Plex Mono");
  const T = TEXT[lang];
  const align = AlignmentType.START;   // logical: right in RTL, left in LTR
  const p = (text, o = {}) => new Paragraph({ bidirectional: ar, alignment: o.alignment ?? align, style: o.style, heading: o.heading,
    numbering: o.numbering, spacing: o.spacing, keepNext: o.keepNext, border: o.border, shading: o.shading, indent: o.indent,
    children: Array.isArray(text) ? text : [new TextRun({ text, rightToLeft: ar, ...o.run })] });
  const run = (text, o = {}) => new TextRun({ text, rightToLeft: ar, ...o });
  const pill = (text, kind) => new TextRun({ text: ` ${text} `, rightToLeft: ar, bold: true, size: 17, color: PILL[kind][1], shading: { type: ShadingType.CLEAR, fill: PILL[kind][0], color: "auto" } });

  // ── header / footer ───────────────────────────────────────────────────────
  const logoRun = (h) => new ImageRun({ type: "png", data: img("logo-blue.png"), transformation: { width: Math.round(h * 7.27), height: h },
    altText: { title: "Fleetana", description: "Fleetana logo", name: "Fleetana logo" } });
  const header = new Header({ children: [new Paragraph({ alignment: ar ? AlignmentType.RIGHT : AlignmentType.LEFT, spacing: { after: 0 }, children: [logoRun(30)] })] });
  const NOB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const footCell = (runs, alignment) => new TableCell({ width: { size: CONTENT / 2, type: WidthType.DXA }, margins: { top: 100, bottom: 0, left: 0, right: 0 },
    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: COL.border }, left: NOB, bottom: NOB, right: NOB },
    children: [new Paragraph({ bidirectional: ar, alignment, spacing: { after: 0 }, children: runs })] });
  const footer = new Footer({ children: [new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [CONTENT / 2, CONTENT / 2], layout: TableLayoutType.FIXED, visuallyRightToLeft: ar,
    rows: [new TableRow({ children: [
      footCell([new TextRun({ text: "fleetana.sa", size: 16, color: COL.muted, font: BODY })], AlignmentType.START),
      footCell([new TextRun({ children: [T.page + " ", PageNumber.CURRENT, " " + T.of + " ", PageNumber.TOTAL_PAGES], size: 16, color: COL.muted, rightToLeft: ar, font: BODY })], AlignmentType.END),
    ] })] })] });

  // ── shared content blocks ─────────────────────────────────────────────────
  const tableCell = (children, { fill = null, w, bold = false, header = false } = {}) => new TableCell({
    width: { size: w, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
    margins: { top: 90, bottom: 90, left: 140, right: 140 },
    shading: fill ? { type: ShadingType.CLEAR, fill, color: "auto" } : undefined,
    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: COL.border }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COL.border }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
    children: [new Paragraph({ bidirectional: ar, alignment: align, spacing: { after: 0, line: 264 , lineRule: LineRuleType.AUTO},
      children: Array.isArray(children) ? children : [run(children, { bold: bold || header, size: header ? 17 : 19, color: header ? COL.navy : COL.ink })] })],
  });
  const fleetTable = () => {
    const w = [Math.round(CONTENT * 0.3), Math.round(CONTENT * 0.22), Math.round(CONTENT * 0.2)]; w.push(CONTENT - w[0] - w[1] - w[2]);
    const rows = T.table.rows.map((r, i) => new TableRow({ children: [
      tableCell(r[0], { w: w[0], fill: i % 2 ? COL.paper : null, bold: true }),
      tableCell([new TextRun({ text: "\u2066" + r[1] + "\u2069", font: MONO, size: 18, color: COL.ink })], { w: w[1], fill: i % 2 ? COL.paper : null }),
      tableCell([pill(r[2][0], r[2][1])], { w: w[2], fill: i % 2 ? COL.paper : null }),
      tableCell([new TextRun({ text: r[3], font: MONO, size: 18, color: COL.onv })], { w: w[3], fill: i % 2 ? COL.paper : null }),
    ] }));
    return new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: w, layout: TableLayoutType.FIXED, visuallyRightToLeft: ar,
      rows: [new TableRow({ tableHeader: true, children: T.table.head.map((h, i) => tableCell(h, { w: w[i], fill: COL.tint, header: true })) }), ...rows] });
  };
  const figure = (file, caption) => [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 }, children: [new ImageRun({ type: "png", data: img(file),
      transformation: { width: 600, height: Math.round(600 * 780 / 1880) }, altText: { title: caption, description: caption, name: caption } })] }),
    p(caption, { style: "Caption" }),
  ];
  const callout = (text) => p(text, { style: "Callout" });
  const kv = (rows) => new Table({ width: { size: CONTENT, type: WidthType.DXA }, columnWidths: [2600, CONTENT - 2600], layout: TableLayoutType.FIXED, visuallyRightToLeft: ar,
    borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COL.border }, insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
    rows: rows.map(([k, v]) => new TableRow({ children: [
      new TableCell({ width: { size: 2600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 0, right: 120 }, children: [p(k, { run: { size: 17, color: COL.muted, bold: true }, spacing: { after: 0 } })] }),
      new TableCell({ width: { size: CONTENT - 2600, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 0, right: 0 }, children: [p(v, { run: { size: 20, color: COL.ink }, spacing: { after: 0 } })] }),
    ] })) });

  // ── document body ─────────────────────────────────────────────────────────
  let firstHeader, children;
  if (kind === "document") {
    const cover = new ImageRun({ type: "jpg", data: img("cover-a4.jpg"), transformation: { width: 794, height: 1123 },
      floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 0 },
        behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } },
      altText: { title: "Cover background", description: "Fleetana particle texture", name: "Cover background" } });
    firstHeader = new Header({ children: [new Paragraph({ alignment: ar ? AlignmentType.RIGHT : AlignmentType.LEFT, children: [cover, logoRun(48)] })] });
    children = [
      p("", { spacing: { before: 2600 } }),
      p(T.cover.eyebrow, { style: "Eyebrow" }),
      p(T.cover.title, { style: "Title" }),
      p(T.cover.subtitle, { style: "Subtitle" }),
      p("", { spacing: { before: 2400 } }),
      kv(T.cover.meta),
      new Paragraph({ children: [new PageBreak()] }),
      p(T.body.h1a, { heading: HeadingLevel.HEADING_1 }),
      p(T.body.lead, { style: "Lead" }),
      p(T.body.p1),
      p(T.body.h2a, { heading: HeadingLevel.HEADING_2 }),
      p(T.body.p2),
      ...T.body.bullets.map(b => p(b, { numbering: { reference: "bullets", level: 0 } })),
      callout(T.body.callout),
      p(T.body.h2b, { heading: HeadingLevel.HEADING_2 }),
      p(T.body.p3),
      ...T.body.steps.map(b => p(b, { numbering: { reference: "steps", level: 0 } })),
      p(T.body.h3, { heading: HeadingLevel.HEADING_3 }),
      p(T.body.p4),
      fleetTable(),
      p(T.table.caption, { style: "Caption", spacing: { before: 80 } }),
      ...figure(ar ? "ui/ar/ui-reminders.png" : "ui/en/ui-reminders.png", T.body.figure),
      p(T.body.h1b, { heading: HeadingLevel.HEADING_1 }),
      p(T.body.p5),
      kv(T.styles),
      p(T.body.dataLabel, { spacing: { before: 240, after: 60 }, run: { size: 17, color: COL.muted, bold: true } }),
      new Paragraph({ style: "Data", bidirectional: false, alignment: ar ? AlignmentType.RIGHT : AlignmentType.LEFT, children: [new TextRun({ text: T.body.data, font: MONO })] }),
      p("", {}),
      p(T.body.closing, { spacing: { before: 240, after: 0 } }),
      p(T.body.sigName, { run: { bold: true, size: 22 }, spacing: { after: 0 } }),
      p(T.body.sigRole, { run: { color: COL.onv }, spacing: { after: 0 } }),
      p("fleetana.sa", { run: { color: COL.accent, rightToLeft: false } }),
    ];
  } else {
    // letterhead: logo + address strip on page 1, small logo after
    firstHeader = new Header({ children: [
      new Paragraph({ alignment: ar ? AlignmentType.RIGHT : AlignmentType.LEFT, spacing: { after: 80 }, children: [logoRun(40)] }),
      p(T.letter.address, { run: { size: 16, color: COL.muted }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COL.border, space: 8 } }, spacing: { after: 0 } }),
    ] });
    children = [
      p(T.letter.date, { spacing: { before: 360, after: 360 }, run: { color: COL.onv } }),
      ...T.letter.to.map((l, i) => p(l, { spacing: { after: 0 }, run: i === 0 ? { bold: true } : { color: COL.onv } })),
      p("", {}),
      p(T.letter.subject, { style: "LetterSubject" }),
      p(T.letter.salutation),
      ...T.letter.body.map(b => p(b)),
      p(T.letter.closing, { spacing: { before: 240, after: 600 } }),
      p(T.letter.name, { run: { bold: true, size: 22 }, spacing: { after: 0 } }),
      p(T.letter.role, { run: { color: COL.onv }, spacing: { after: 0 } }),
      p("fleetana.sa", { run: { color: COL.accent, rightToLeft: false } }),
    ];
  }

  const lineBody = ar ? 360 : 324;   // 1.5 vs 1.35 — Arabic needs more leading
  const doc = new Document({
    creator: "Fleetana", title: kind === "document" ? T.cover.title : T.letter.subject, description: "Fleetana brand template",
    styles: {
      default: {
        document: { run: { font: BODY, size: 21, color: COL.ink, rightToLeft: ar }, paragraph: { spacing: { line: lineBody, lineRule: LineRuleType.AUTO, after: 140 } } },
        title: { run: { font: HEAD, size: 60, bold: true, color: COL.black, rightToLeft: ar }, paragraph: { spacing: { after: 120, line: 276 , lineRule: LineRuleType.AUTO} } },
        heading1: { run: { font: HEAD, size: 40, bold: true, color: COL.black, rightToLeft: ar }, paragraph: { spacing: { before: 420, after: 160, line: 276 , lineRule: LineRuleType.AUTO}, keepNext: true } },
        heading2: { run: { font: HEAD, size: 30, bold: true, color: COL.black, rightToLeft: ar }, paragraph: { spacing: { before: 300, after: 100, line: 276 , lineRule: LineRuleType.AUTO}, keepNext: true } },
        heading3: { run: { font: BODY, size: 22, bold: true, color: COL.accent, rightToLeft: ar }, paragraph: { spacing: { before: 240, after: 80 }, keepNext: true } },
      },
      paragraphStyles: [
        { id: "Subtitle", name: "Subtitle", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: HEAD, size: 32, bold: true, color: COL.accent }, paragraph: { spacing: { after: 240, line: 300 , lineRule: LineRuleType.AUTO} } },
        { id: "Eyebrow", name: "Eyebrow", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: BODY, size: 18, bold: true, color: COL.accent, characterSpacing: ar ? 0 : 30 }, paragraph: { spacing: { after: 160 } } },
        { id: "Lead", name: "Lead", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: BODY, size: 25, color: COL.onv }, paragraph: { spacing: { after: 200, line: ar ? 380 : 340 , lineRule: LineRuleType.AUTO} } },
        { id: "Caption", name: "Caption", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: BODY, size: 17, color: COL.muted }, paragraph: { spacing: { after: 240 } } },
        { id: "Callout", name: "Callout", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: BODY, size: 23, bold: true, color: COL.navy },
          paragraph: { shading: { type: ShadingType.CLEAR, fill: COL.tint, color: "auto" }, spacing: { before: 200, after: 240, line: ar ? 380 : 330 , lineRule: LineRuleType.AUTO}, indent: { left: 0, right: 0 },
            border: { top: { style: BorderStyle.SINGLE, size: 36, color: COL.tint, space: 8 }, left: { style: BorderStyle.SINGLE, size: 36, color: COL.tint, space: 10 },
              bottom: { style: BorderStyle.SINGLE, size: 36, color: COL.tint, space: 8 }, right: { style: BorderStyle.SINGLE, size: 36, color: COL.tint, space: 10 } } } },
        { id: "Data", name: "Data", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: MONO, size: 19, color: COL.ink, rightToLeft: false } },
        { id: "LetterSubject", name: "Letter Subject", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: HEAD, size: 26, bold: true, color: COL.black }, paragraph: { spacing: { after: 200 } } },
      ],
    },
    numbering: { config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.START,
        style: { run: { color: COL.blue, bold: true }, paragraph: { indent: { start: 400, hanging: 260 } } } }] },
      { reference: "steps", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START,
        style: { run: { color: COL.accent, bold: true }, paragraph: { indent: { start: 400, hanging: 300 } } } }] },
    ] },
    sections: [{
      properties: { page: { size: A4, margin: { top: 1700, bottom: 1300, left: MARGIN, right: MARGIN, header: 640, footer: 560 } }, titlePage: true },
      headers: { default: header, first: firstHeader },
      footers: { default: footer, first: kind === "document" ? new Footer({ children: [new Paragraph({ children: [] })] }) : footer },
      children,
    }],
  });
  return doc;
}

// ── copy (EN written for EN, AR drafted natively) ───────────────────────────
const TEXT = {
  en: {
    page: "Page", of: "of",
    cover: { eyebrow: "PROPOSAL", title: "Document title in two lines at most", subtitle: "One line on what this document is for",
      meta: [["Prepared for", "Client name"], ["Prepared by", "Name, Role · Fleetana"], ["Date", "DD/MM/YYYY"], ["Reference", "FL-2026-001"]] },
    body: {
      h1a: "Summary",
      lead: "Lead paragraph. Say the point of the whole document in two or three sentences. A busy reader may stop here.",
      p1: "Body text is Inter 10.5 pt in Ink. Write in the second person, keep sentences short, and use numbers we can prove instead of adjectives. Replace this text with your own; every style you see here is in the Styles gallery.",
      h2a: "Heading 2 for a sub-section",
      p2: "Use bullets for parallel items. Keep each one to a line where you can:",
      bullets: ["Service reminders by km, engine hours or date, whichever comes first", "Fuel economy on every full fill with an odometer reading", "Istimara, insurance and Fahes listed 30 days before they expire"],
      callout: "Callout: use it once or twice per document for the one thing the reader must remember.",
      h2b: "Numbered steps",
      p3: "Use numbers when order matters:",
      steps: ["Add your vehicles, drivers and their document dates.", "Log fuel and service as it happens, from any device.", "Open Home to see what is due, overdue or expiring."],
      h3: "Heading 3 · a small labelled block",
      p4: "Tables use a Tint header row, hairline rules and Paper banding. Plates, IDs and dates are set in IBM Plex Mono. Status uses the app's colours, never brand blue.",
      figure: "Figure 1 · Service reminders in Fleetana. Product screens are our illustrations; demo data must look like demo data.",
      h1b: "Styles in this template",
      p5: "Pick styles from the gallery instead of formatting by hand, so every Fleetana document looks the same.",
      dataLabel: "Data style",
      data: "WO-000123 · \u20664271 ح ط ر\u2069 · 21/10/2026 · 89,420 km",
      closing: "Regards,", sigName: "Full name", sigRole: "Role, Fleetana",
    },
    table: { head: ["Vehicle", "Plate", "Status", "Next service"], caption: "Table 1 · Example fleet. Copy this table to keep the house style.",
      rows: [["Toyota Hilux 2022", "4271 ح ط ر", ["Active", "good"], "90,000 km"], ["Toyota Hiace 2021", "8834 ب ن م", ["Due soon", "warn"], "01/11/2026"],
        ["Isuzu NPR 2020", "1902 د ك ل", ["In shop", "muted"], "1,200 h"], ["Toyota Coaster 2019", "3150 ر ي د", ["Overdue", "bad"], "15/10/2026"]] },
    styles: [["Title", "Cover title, Hanken Grotesk 30 pt"], ["Subtitle", "Cover line under the title, Accent Blue"], ["Eyebrow", "Document type above the title"],
      ["Heading 1 – 3", "Section, sub-section and labelled block"], ["Lead", "Opening paragraph of a section"], ["Normal", "Body text, Inter 10.5 pt"],
      ["Callout", "The one thing to remember (Tint panel)"], ["Caption", "Under tables and figures"], ["Data", "Plates, IDs, odometers (IBM Plex Mono)"]],
    letter: {
      address: "Fleetana · [Street, District, City] · CR [number] · VAT [number] · fleetana.sa",
      date: "DD/MM/YYYY", to: ["Recipient name", "Role, Company", "City, Saudi Arabia"],
      subject: "Subject: one line that says what this letter is about",
      salutation: "Dear [Name],",
      body: ["Start with the point. One short paragraph per idea, written in the second person.", "Use numbers instead of adjectives, and only numbers we can stand behind. Say what happens next and who does it.", "Replace this text with your own. The letterhead header and footer repeat on every page."],
      closing: "Regards,", name: "Full name", role: "Role, Fleetana",
    },
  },
  ar: {
    page: "صفحة", of: "من",
    cover: { eyebrow: "عرض", title: "عنوان المستند في سطرين على الأكثر", subtitle: "سطر واحد يوضح الغرض من هذا المستند",
      meta: [["مُعدّ لـ", "اسم الجهة"], ["إعداد", "الاسم، المسمى الوظيفي · فليتانا"], ["التاريخ", "DD/MM/YYYY"], ["المرجع", "FL-2026-001"]] },
    body: {
      h1a: "الملخص",
      lead: "الفقرة الافتتاحية. اكتب خلاصة المستند كله في جملتين أو ثلاث، فالقارئ المشغول قد يتوقف هنا.",
      p1: "النص الأساسي بخط IBM Plex Sans Arabic بحجم 10.5 نقطة. خاطِب القارئ مباشرة، واجعل الجمل قصيرة، واستخدم أرقامًا يمكن إثباتها بدل الصفات. استبدل هذا النص بنصك، فكل نمط تراه هنا موجود في معرض الأنماط.",
      h2a: "عنوان فرعي من المستوى الثاني",
      p2: "استخدم النقاط للعناصر المتوازية، واجعل كل عنصر في سطر واحد قدر الإمكان:",
      bullets: ["تذكيرات الصيانة بالكيلومترات أو ساعات التشغيل أو التاريخ، أيّها أسبق", "معدل استهلاك لكل تعبئة كاملة مسجّل معها العداد", "الاستمارة والتأمين والفحص الدوري تظهر قبل انتهائها بـ30 يومًا"],
      callout: "فقرة بارزة: استخدمها مرة أو مرتين في المستند للفكرة التي يجب أن يتذكرها القارئ.",
      h2b: "خطوات مرقّمة",
      p3: "استخدم الأرقام عندما يكون الترتيب مهمًا:",
      steps: ["أضف مركباتك وسائقيك وتواريخ وثائقهم.", "سجّل الوقود والصيانة عند حدوثها، من أي جهاز.", "افتح الصفحة الرئيسية لترى المستحق والمتأخر وما سينتهي قريبًا."],
      h3: "عنوان من المستوى الثالث · كتلة معنونة",
      p4: "الجداول بصف عناوين بلون فاتح، وخطوط رفيعة، وتظليل متناوب. اللوحات والأرقام المرجعية والتواريخ بخط IBM Plex Mono. والحالات بألوان التطبيق، لا باللون الأزرق.",
      figure: "شكل 1 · تذكيرات الصيانة في فليتانا. شاشات المنتج هي رسوماتنا التوضيحية، والبيانات التجريبية يجب أن تبدو تجريبية.",
      h1b: "الأنماط في هذا القالب",
      p5: "اختر الأنماط من المعرض بدل التنسيق اليدوي، لتبدو كل مستندات فليتانا متشابهة.",
      dataLabel: "نمط البيانات",
      data: "WO-000123 · \u20664271 ح ط ر\u2069 · 21/10/2026 · 89,420 km",
      closing: "مع خالص التحية،", sigName: "الاسم الكامل", sigRole: "المسمى الوظيفي، فليتانا",
    },
    table: { head: ["المركبة", "اللوحة", "الحالة", "الصيانة القادمة"], caption: "جدول 1 · أسطول تجريبي. انسخ هذا الجدول للحفاظ على نمط فليتانا.",
      rows: [["Toyota Hilux 2022", "4271 ح ط ر", ["نشط", "good"], "90,000 km"], ["Toyota Hiace 2021", "8834 ب ن م", ["قارب الاستحقاق", "warn"], "01/11/2026"],
        ["Isuzu NPR 2020", "1902 د ك ل", ["في الورشة", "muted"], "1,200 h"], ["Toyota Coaster 2019", "3150 ر ي د", ["متأخر", "bad"], "15/10/2026"]] },
    styles: [["Title", "عنوان الغلاف، 30 نقطة"], ["Subtitle", "السطر تحت العنوان، بالأزرق"], ["Eyebrow", "نوع المستند فوق العنوان"],
      ["Heading 1 – 3", "القسم والقسم الفرعي والكتلة المعنونة"], ["Lead", "الفقرة الافتتاحية للقسم"], ["Normal", "النص الأساسي، 10.5 نقطة"],
      ["Callout", "الفكرة التي يجب تذكرها"], ["Caption", "تحت الجداول والأشكال"], ["Data", "اللوحات والأرقام المرجعية والعداد"]],
    letter: {
      address: "فليتانا · [الشارع، الحي، المدينة] · س.ت [الرقم] · الرقم الضريبي [الرقم] · fleetana.sa",
      date: "DD/MM/YYYY", to: ["اسم المستلم", "المسمى الوظيفي، الجهة", "المدينة، المملكة العربية السعودية"],
      subject: "الموضوع: سطر واحد يوضح موضوع الخطاب",
      salutation: "السيد/ة [الاسم] المحترم/ة،",
      body: ["ابدأ بالمقصود مباشرة. فقرة قصيرة لكل فكرة، بخطاب مباشر للقارئ.", "استخدم الأرقام بدل الصفات، وفقط الأرقام التي يمكن إثباتها. وضّح الخطوة التالية ومن يقوم بها.", "استبدل هذا النص بنصك. رأس الخطاب وتذييله يتكرران في كل صفحة."],
      closing: "مع خالص التحية،", name: "الاسم الكامل", role: "المسمى الوظيفي، فليتانا",
    },
  },
};

// docx → dotx: same package, template content type
async function toDotx(buf) {
  const zip = await JSZip.loadAsync(buf);
  const ct = await zip.file("[Content_Types].xml").async("string");
  zip.file("[Content_Types].xml", ct.replace("wordprocessingml.document.main+xml", "wordprocessingml.template.main+xml"));
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

(async () => {
  for (const kind of ["document", "letterhead"]) for (const lang of ["en", "ar"]) {
    const name = `Fleetana-${kind === "document" ? "Document" : "Letterhead"}-${lang.toUpperCase()}`;
    const buf = await Packer.toBuffer(build(lang, kind));
    fs.writeFileSync(path.join(__dirname, `${name}.docx`), buf);
    fs.writeFileSync(path.join(__dirname, `${name}.dotx`), await toDotx(buf));
    console.log("wrote", name);
  }
})();
