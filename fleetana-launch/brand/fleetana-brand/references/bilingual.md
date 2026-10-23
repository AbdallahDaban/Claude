# Fleetana Bilingual System (v2)

Arabic and English are equal. Neither is the source of truth, and neither is a translation of the other. Draft Arabic natively from the brief, then check it against the app's terms.

## The name
**فليتانا** is a transliteration of Fleetana (fleet + نا, "our fleet"). It keeps the possessive audible and stays trademarkable. Don't use أسطولنا.

The app treats Fleetana as **masculine**, for example "صُمّم فليتانا…" and "يُظهر فليتانا". Agree verbs with it: صُمّم للأساطيل السعودية.

## Register
Clear written Arabic that a supervisor reads without effort and a procurement officer accepts. Not stiff MSA, and not Gulf dialect. Dialect is allowed only inside props such as chat bubbles ("الاستمارة خلصت؟").

## Glossary: use the app's own terms (`lib/i18n/messages-ar.ts`, `domains/*-ar.ts`)
| English | Arabic | Note |
|---|---|---|
| Home (dashboard) | الرئيسية | The app has no "لوحة التحكم" |
| Vehicles | المركبات | |
| Service & PM | الصيانة والوقاية | Nav label. The page title is تذكيرات الصيانة. |
| Fuel tracking / Fuel | متابعة الوقود / الوقود | |
| Inspections | الفحوصات | |
| Issues | البلاغات | |
| Work orders | أوامر العمل | Not أوامر الشغل, which appears in marketing copy only |
| Fleet map | خريطة الأسطول | |
| Driver performance | أداء السائقين | |
| Istimara | الاستمارة | |
| Fahes | الفحص الدوري | Not plain فحص, which clashes with الفحوصات |
| Insurance | التأمين | |
| Active / In shop / Out of service | نشط / في الورشة / خارج الخدمة | |
| Upcoming / Due soon / Overdue | قادم / قارب الاستحقاق / متأخر | |
| Moving / Idle / Parked / No signal | يتحرك / خامل / متوقف / لا توجد إشارة | Map labels. In prose: تتحرك، أو متوقفة والمحرك يعمل. |
| Idle time | وقت الخمول | |
| Low (fuel flag) | منخفض | |
| Pass / Fail | ناجح / فاشل | |
| Requires a GPS tracker | يتطلب جهاز تتبع | Not "مع جهاز تتبع", which reads as "comes with" |
| odd / unusual fill-up | تعبئة غير معتادة | Not "غير منطقية" ("illogical") |
| flagged | تظهر بعلامة «منخفض» / تُعلَّم بـ«منخفض» | Unvowelled تعلّم reads as "learns". Never تنبيه for on-screen-only signals. |
| new issues · 1 | بلاغات جديدة · 1 | Not البلاغات المُنشأة (منشأة = organisation) |

## Numbers, units, dates
- **Digits:** Western 0–9 everywhere, as the app does (`toLocaleString("en-US")`).
- **Percent:** ٪ (U+066A) in Arabic text, for example 70٪ and 15٪.
- **Money:**
  - UI: "SAR 1,150.00", with Latin SAR as the app shows.
  - Prose: ريال.
  - Don't use the new riyal symbol (U+20C1) yet; most fonts lack it.
- **Units:**
  - UI tables keep the app's Latin `km/L`, `L` and `km`.
  - Captions and explanatory graphics use كم، لتر، كم/لتر، ساعة، دقيقة. Write حوالي 85,000 كم, not "~85,000 كم".
- **Dates:** DD/MM/YYYY.
- **Plates:** digits plus Arabic letters ("4271 ح ط ر"). Wrap them as an isolated LTR run (U+2066 … U+2069) so they never split around Latin text.
- **People:** use full Arabic names in demo data (فيصل العتيبي). Initials like "عمر ك." join into "عمرك" ("your age").

## Layout
- Use true RTL (`dir="rtl"`). Mirror the layout: the logo moves top-right, captions sit on the right, and chart time runs right to left. **Never mirror the logo, plates, numbers or vehicle illustrations that carry text.**
- Arrows follow reading direction (بند فاشل ← بلاغ جديد).
- Use about 15% more leading than Latin.
- The language switch shows the target language in its own script ("English" on the Arabic page, "العربية" on the English one). Never use flags.
- When both wordmarks appear together, give them equal prominence.

## Sample copy in both languages
| EN | AR |
|---|---|
| Get your fleet off spreadsheets. | أخرج أسطولك من جداول البيانات. |
| Your whole fleet. One place. | أسطولك كله. في مكان واحد. |
| Built for Saudi fleets. | صُمّم للأساطيل السعودية. |
| Odd fill-ups get flagged. | تعبئة غير معتادة؟ تظهر بعلامة «منخفض». |
| Service due by km, hours or date. | مواعيد الصيانة بالكيلومترات، أو ساعات التشغيل، أو التاريخ. |
| Istimara, Fahes, insurance. Listed 30 days ahead. | الاستمارة والتأمين والفحص الدوري. تظهر قبل انتهائها بـ30 يومًا. |
| Failed check? Issue opened. | بند فاشل؟ يُفتح بلاغ تلقائيًا. |
