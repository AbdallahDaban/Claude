// On-screen copy for the launch films, EN + AR.
// UI labels are the app's own strings (lib/i18n/messages-*.ts, lib/i18n/domains/*). Film lines were
// written for each language natively, then checked against the app's terms. Digits stay Western and
// money is "SAR 1,234.00" in UI, matching formatSAR() in lib/service.ts.
const LANG = new URLSearchParams(location.search).get("lang") === "ar" ? "ar" : "en";
const RTL = LANG === "ar";
const S = {
  en: {
    // UI (app strings)
    nav: { home: "Home", vehicles: "Vehicles", service: "Service & PM", fuel: "Fuel tracking", inspections: "Inspections", issues: "Issues", workOrders: "Work orders", map: "Fleet map", drivers: "Driver performance" },
    vehiclesTitle: "Vehicles", colVehicle: "Vehicle", colPlate: "Plate", colDriver: "Driver", colStatus: "Status", colIstimara: "Istimara",
    active: "Active", inShop: "In shop", outOfService: "Out of service",
    remindersTitle: "Service reminders", colTask: "Task", colDueAt: "Due at", colCurrent: "Current", overdue: "Overdue", dueSoon: "Due soon", upcoming: "Upcoming",
    tasks: ["Engine oil & filter", "Brake inspection", "Tyre rotation", "Air filter", "Transmission fluid"],
    fuelTitle: "Fuel", statTotalVolume: "Total volume", statTotalSpend: "Total spend", statAvgUnit: "Avg SAR/L", statAvgEconomy: "Avg fuel economy",
    colDate: "Date", colOdometer: "Odometer", colVolume: "Volume", colCost: "Cost", colEconomy: "Economy", low: "Low",
    anomalyNote: "More than 30% below this vehicle's recent average",
    inspTitle: "Daily pre-trip", inspItems: ["Lights & indicators", "Tyres", "Brakes", "Fluid levels", "Seat belts"], pass: "Pass", fail: "Fail",
    failNote: "Rear left tyre worn", issuesRaised: "Issues raised · 1", issueOpen: "Open",
    woTitle: "WO-000123", inProgress: "In progress", colType: "Type", colDesc: "Description", colQty: "Qty", colUnit: "Unit cost", colLine: "Line total",
    woLines: [["Part", "Brake pad set"], ["Labour", "Brake service"], ["Fee", "Disposal"]], subtotal: "Subtotal", vat: "VAT (15%)", total: "Total",
    homeTitle: "Home", expiringSoon: "Expiring soon", docIstimara: "Istimara", docInsurance: "Insurance", docFahes: "Fahes",
    inDays: n => `in ${n} days`, mapLive: "Live", moving: "Moving", idle: "Idle", parked: "Parked", noSignal: "No signal", idleTime: "Idle time",
    driverPerf: "Driver performance", colScore: "Score", excellent: "Excellent", good: "Good", fair: "Fair",
    warranty: "Warranty", activeUntil: d => `active until ${d}`,
    drivers: ["Faisal A.", "Omar K.", "Saeed M.", "Yousef R.", "Majed T.", "Nasser H."],
    // Film 1
    f1: {
      sticky: ["Oil change?", "~85,000 km"], chat: "Istimara expired??",
      headline: ["Your whole fleet.", "One place."],
      caps: [
        ["Every plate, driver", "and document date."],
        ["Service due by km,", "hours or date."],
        ["Odd fill-ups", "get flagged."],
        ["Failed check?", "Issue opened."],
        ["Parts, labour,", "15% VAT. Totalled."],
        ["Istimara, Fahes, insurance.", "30 days' notice."],
        ["Moving, idle, parked.", "And how they drive."],
      ],
      tracker: "With a GPS tracker",
      saudi: "Built for Saudi fleets.",
      chips: ["Istimara", "Fahes", "Insurance", "SAR + 15% VAT", "km & engine hours", "العربية"],
      cta: "Get your fleet off spreadsheets.",
    },
    f2: {
      hook: ["Where does your", "fleet's money go?"],
      leak: ["Fuel", "Service", "Papers", "Idling", "Warranty"],
      fuel1: "5.9 km/L. Your usual: 9.2.", fuel2: "Flagged.", fuelFoot: "Log the odometer. We flag the rest.",
      svc1: "90,000 km. Service overdue.", svc2: "Know before it breaks.",
      doc1: "Istimara expires in 12 days.", doc2: "Renew before it lapses.",
      idle1: "Engine on. Truck parked.", idle2: "See it, then fix it.",
      war1: "Still under warranty.", war2: "Check before you pay.",
      end: ["Find the leaks.", "Fix them."],
    },
    f3: {
      hook: ["Fleet still in", "Excel and WhatsApp?"],
      cards: [["Fuel fill", "flagged."], ["Service overdue:", "2 vehicles."], ["Istimara:", "12 days left."], ["Failed check →", "issue opened."]],
      cta: ["Get your fleet off", "spreadsheets."],
    },
    url: "fleetana.sa",
  },
  ar: {
    nav: { home: "الرئيسية", vehicles: "المركبات", service: "الصيانة والوقاية", fuel: "متابعة الوقود", inspections: "الفحوصات", issues: "البلاغات", workOrders: "أوامر العمل", map: "خريطة الأسطول", drivers: "أداء السائقين" },
    vehiclesTitle: "المركبات", colVehicle: "المركبة", colPlate: "اللوحة", colDriver: "السائق", colStatus: "الحالة", colIstimara: "الاستمارة",
    active: "نشط", inShop: "في الورشة", outOfService: "خارج الخدمة",
    remindersTitle: "تذكيرات الصيانة", colTask: "المهمة", colDueAt: "الاستحقاق", colCurrent: "الحالي", overdue: "متأخر", dueSoon: "قارب الاستحقاق", upcoming: "قادم",
    tasks: ["زيت المحرك والفلتر", "فحص الفرامل", "تدوير الإطارات", "فلتر الهواء", "زيت ناقل الحركة"],
    fuelTitle: "الوقود", statTotalVolume: "إجمالي الكمية", statTotalSpend: "إجمالي الإنفاق", statAvgUnit: "متوسط ريال/لتر", statAvgEconomy: "متوسط استهلاك الوقود",
    colDate: "التاريخ", colOdometer: "العدّاد", colVolume: "الكمية", colCost: "التكلفة", colEconomy: "الاستهلاك", low: "منخفض",
    anomalyNote: "أقل بأكثر من 30% من متوسط هذه المركبة",
    inspTitle: "فحص ما قبل الرحلة", inspItems: ["الأنوار والإشارات", "الإطارات", "الفرامل", "مستويات السوائل", "أحزمة الأمان"], pass: "ناجح", fail: "فاشل",
    failNote: "تآكل الإطار الخلفي الأيسر", issuesRaised: "البلاغات المُنشأة · 1", issueOpen: "مفتوح",
    woTitle: "WO-000123", inProgress: "قيد التنفيذ", colType: "النوع", colDesc: "الوصف", colQty: "الكمية", colUnit: "سعر الوحدة", colLine: "الإجمالي",
    woLines: [["قطعة", "طقم فحمات فرامل"], ["عمالة", "صيانة الفرامل"], ["رسوم", "التخلص من القطع"]], subtotal: "المجموع الفرعي", vat: "ضريبة القيمة المضافة (15%)", total: "الإجمالي",
    homeTitle: "الرئيسية", expiringSoon: "ينتهي قريباً", docIstimara: "الاستمارة", docInsurance: "التأمين", docFahes: "الفحص الدوري",
    inDays: n => `خلال ${n} يومًا`, mapLive: "مباشر", moving: "يتحرك", idle: "خامل", parked: "متوقف", noSignal: "لا توجد إشارة", idleTime: "وقت الخمول",
    driverPerf: "أداء السائقين", colScore: "التقييم", excellent: "ممتاز", good: "جيد", fair: "مقبول",
    warranty: "الضمان", activeUntil: d => `ساري حتى ${d}`,
    drivers: ["فيصل ع.", "عمر ك.", "سعيد م.", "يوسف ر.", "ماجد ت.", "ناصر ح."],
    f1: {
      sticky: ["تغيير الزيت؟", "~85,000 كم"], chat: "الاستمارة خلصت؟",
      headline: ["أسطولك كله.", "في مكان واحد."],
      caps: [
        ["كل لوحة وسائق،", "وكل تاريخ وثيقة."],
        ["الصيانة بالكيلومتر،", "أو الساعات، أو التاريخ."],
        ["التعبئة غير المنطقية", "تُعلَّم."],
        ["بند فاشل؟", "بلاغ جديد."],
        ["القطع والعمالة والضريبة،", "محسوبة."],
        ["الاستمارة والفحص الدوري والتأمين.", "تنبيه قبل 30 يومًا."],
        ["يتحرك، خامل، متوقف.", "وكيف يقود سائقوك."],
      ],
      tracker: "مع جهاز تتبع",
      saudi: "مصمَّمة للأساطيل السعودية.",
      chips: ["الاستمارة", "الفحص الدوري", "التأمين", "ريال + ضريبة 15%", "كم وساعات التشغيل", "English"],
      cta: "أخرج أسطولك من جداول البيانات.",
    },
    f2: {
      hook: ["أين تذهب", "أموال أسطولك؟"],
      leak: ["الوقود", "الصيانة", "الوثائق", "الخمول", "الضمان"],
      fuel1: "5.9 كم/لتر. معدلك المعتاد 9.2.", fuel2: "مُعلَّمة.", fuelFoot: "سجّل قراءة العداد، والباقي علينا.",
      svc1: "90,000 كم. الصيانة متأخرة.", svc2: "اعرف قبل أن تتعطل.",
      doc1: "الاستمارة تنتهي خلال 12 يومًا.", doc2: "جدّد قبل أن تنتهي.",
      idle1: "المحرك يعمل. والشاحنة واقفة.", idle2: "اعرفها، ثم عالجها.",
      war1: "ما زالت تحت الضمان.", war2: "تحقّق قبل أن تدفع.",
      end: ["اكتشف الهدر،", "وأوقفه."],
    },
    f3: {
      hook: ["ما زال أسطولك على", "الإكسل والواتساب؟"],
      cards: [["تعبئة وقود", "مُعلَّمة."], ["صيانة متأخرة:", "مركبتان."], ["الاستمارة:", "باقي 12 يومًا."], ["بند فاشل ←", "بلاغ جديد."]],
      cta: ["أخرج أسطولك من", "جداول البيانات."],
    },
    url: "fleetana.sa",
  },
}[LANG];

// Example fleet (in-app demo data, not customer data). Saudi plates: digits + Arabic letters.
const FLEET = [
  { model: "Toyota Hilux 2022", plate: "4271 ح ط ر", type: "pickup" },
  { model: "Toyota Hiace 2021", plate: "8834 ب ن م", type: "van" },
  { model: "Isuzu NPR 2020", plate: "1902 د ك ل", type: "truck" },
  { model: "Toyota Hilux 2023", plate: "6647 س ع ا", type: "pickup" },
  { model: "Toyota Coaster 2019", plate: "3150 ر ي د", type: "van" },
  { model: "Toyota Hiace 2022", plate: "7720 ك ه ب", type: "van" },
];
