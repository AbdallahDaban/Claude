# Fleetana launch films: brief, process and final scripts

There are three films, each in English and Arabic, so six videos in total. They are in `out/`.

| File | Format | Use it for |
|---|---|---|
| `fleetana-film1-{en,ar}.mp4` | 40 s · 1920×1080 · 60 fps | Launch hero: website header, LinkedIn, YouTube, events |
| `fleetana-film2-{en,ar}.mp4` | 30 s · 1920×1080 · 60 fps | Cost story: sales follow-ups, LinkedIn, X, pre-roll |
| `fleetana-film3-{en,ar}.mp4` | 20 s · 1080×1920 · 60 fps | Vertical social: Snapchat, TikTok, Reels, Shorts, WhatsApp Status |

Every frame is drawn in code, and the music and sound design are original, synthesized from scratch. There is no stock footage and no samples, so there are no licensing questions.

## Ground rules

1. **The code is the source of truth.** Every feature shown exists in `fleetana-master`.
   - Colors, fonts and the logo come from `app/globals.css`, `app/layout.tsx` and `public/*.svg`.
   - UI labels are the app's own strings from `lib/i18n/*`.
   - The brand guide (AI-drafted) was used only where the code is silent, for example the voice rules.
2. **No invented numbers.** The code has no customer savings data, so the films show *mechanisms* that save money. Every number on screen is one of two things:
   - **A product rule, quoted from the code:**
     - a fuel fill is flagged below 70% of the vehicle's 30-day average (`lib/fuel-economy.ts`)
     - VAT is 15%
     - documents warn 30 days ahead
     - service is due by km, engine hours or date
     - driver-score bands (`lib/telematics/driver-score.ts`)
   - **Plainly in-app example data:** plates, fuel logs, a work order.
3. **No landing-page claims the code doesn't back.** The films avoid sub-second latency, route optimisation, engine diagnostics and predictive maintenance.
4. **GPS features are tagged "Requires a GPS tracker".** This covers the live map, idle time and driver scores, because they depend on staff-provisioned GT06 trackers.

## Process: brainstorm, critique, improve

**Brainstorm.** Seven concepts were considered:
- **Kept:** "off spreadsheets" (the app's own CTA), "where the money leaks", and a vertical social cut.
- **Rejected:**
  - a fake "real customer" day-in-the-life (dishonest without footage)
  - a savings calculator (no data behind it)
  - AI and predictive hype (absent from the code)

**Critique round 1: scripts.** Two reviewers worked in parallel: a launch strategist fact-checking every line against the code, and a native Arabic copywriter.

What changed:
- "Service on time" became **"Service due by km, hours or date"**. Reminders don't push notifications, so the app tells you service is due but doesn't make it happen.
- The warranty beat no longer says "143 days left". The app only shows *N days left* when 30 days or fewer remain, so it now shows **"active until 14/03/2027"** and **"Check before you pay"**. There is no claims workflow.
- **The price was removed from the films.** The SAR 299 plan excludes inspections and work orders, which the films show.
- The fuel flag is the app's **amber "Low" badge**, not red. The footnote **"Log the odometer. We flag the rest."** keeps it honest: only full fills with an odometer reading get an economy figure.
- A driver-performance beat was added, which is strong for school and passenger fleets.
- "2 trucks" became **"2 vehicles"**, because one of them is a Hilux pickup.

**Critique round 2: rendered frames.** Two reviewers again: a senior art director, and a native Arabic editor with an RTL specialist eye.

Art direction:
- Film 1 opened with 8 s of no message. It now has the hook **"Your fleet runs on spreadsheets, receipts and memory."** and a tighter logo.
- The proof moments (Low, Fail, totals, Overdue) were unreadable on a phone. Camera push-ins now hit each one, with a dark caption column.
- Film 2's URL was on screen for about 0.1 s. The leaks were re-timed onto the 100 BPM grid, and the end card now holds for about 2.5 s.
- Film 2 headlines now use one fixed size, back cards no longer clip their text, the chart labels are clear of the threshold line, and the odometer and card are aligned.
- The Saudi scene was spaced out so the Kingdom Centre and Al Faisaliah silhouettes read, and the chips got contrast.
- Smaller fixes: the map legend matches the pins, a stray spreadsheet column letter is gone, and Film 3's hook now pays off in the CTA ("spreadsheets").

Arabic:
- **"تُعلَّم / مُعلَّمة" (flagged)** reads as "is taught" without vowel marks. It is now the app's own term, **غير معتادة**, with captions like "تنبيه فوري" and "رصدناها".
- **فليتانا is treated as masculine**, as in the app, so the line became **"صُمّم للأساطيل السعودية."**
- **Initials such as "عمر ك."** rendered as "عمرك" ("your age"), so the drivers now have full family names.
- **Plates** are isolated so they never split around Latin text, the checklist prop is right-to-left, the sticky note uses "حوالي 85,000 كم", and the percent sign is ٪.
- **"البلاغات المُنشأة"** is ambiguous, because منشأة means "organization" in the app. It became **"بلاغات جديدة"**.
- **Units:** UI mockups keep "km/L" and "SAR" exactly as the app's Arabic interface shows them, since code is truth. Film graphics and captions use كم, دقيقة and كم/لتر.

## Final scripts (English)

**Film 1 — "Off spreadsheets" (40 s).**
- **0–5:** Spreadsheet chaos, a sticky note ("Oil change? ~85,000 km") and a chat ("Istimara expired??"). On screen: *Your fleet runs on spreadsheets, receipts and memory.*
- **5–7:** Everything collapses into the mark, then the wordmark appears.
- **7.2:** *Your whole fleet. One place.*
- **9.6–32.7:** The product tour, one module per musical bar (3.3 s each), with a push-in on each beat's proof:
  1. *Every plate, driver and document date.*
  2. *Service due by km, hours or date.*
  3. *Odd fill-ups get flagged.*
  4. *Failed check? Issue opened.*
  5. *Parts, labour, 15% VAT. Totalled.*
  6. *Istimara, Fahes, insurance. 30 days' notice.*
  7. *Moving, idle, parked. And how they drive.* (Requires a GPS tracker)
- **32.7:** *Built for Saudi fleets.* Chips: Istimara · Fahes · Insurance · SAR + 15% VAT · km & engine hours · العربية. Fleet vehicles drive past a Riyadh skyline.
- **35.3:** Logo · *Get your fleet off spreadsheets.* · fleetana.sa

**Film 2 — "Where the money leaks" (30 s).**
- **Hook:** Receipts rain down. *Where does your fleet's money go?*
- **01 Fuel:** a bar chart of the last five fills against the average and the 70% line. *5.9 km/L. Your usual: 9.2.* → **Flagged.**
- **02 Service:** an odometer rolls past 90,000 and the reminder flips to Overdue. → **Know before it breaks.**
- **03 Papers:** Istimara counts down to 12 days. → **Renew before it lapses.**
- **04 Idling:** an amber pin and an idle timer, with a truck sitting with its engine running. → **See it, then fix it.** (Requires a GPS tracker)
- **05 Warranty:** an "active until" stamp lands on the work order line. → **Check before you pay.**
- **End:** the five icons converge into the logo. *Find the leaks. Fix them.* · fleetana.sa

**Film 3 — vertical (20 s).**
- **Hook:** *Fleet still on spreadsheets and WhatsApp?*
- **Story cards:**
  1. *Fuel fill flagged.*
  2. *Service overdue: 2 vehicles.*
  3. *Istimara: 12 days left.*
  4. *Failed check → issue opened.*
- **End:** *Get your fleet off spreadsheets.* · fleetana.sa

The Arabic scripts are in `strings.js` (the `ar` block). They were written natively, not translated.

## Flagged for your team, found in the code while doing this

- The landing page claims things the code doesn't do: "sub-second latency", route optimisation, engine diagnostics and predictive maintenance (`lib/i18n/messages-en.ts`). The FAQ says "no hardware to install", but GPS needs trackers.
- The pricing page's Enterprise CTA points to `sales@fleetana.com`, while the rest of the site uses `@fleetana.sa`.
- The Arabic warranty string `daysLeftMany` reads "متبقي {n} يوم". It should be يومًا.
- The landing hero stats "98.4%", "-14%" and "+8%" are hard-coded decoration, not measured data.

## Rebuild
```
python3 score.py        # music → audio/
./render_all.sh         # six mp4s → out/
```
To preview in a browser, open `film1.html` (add `?lang=ar` for Arabic) and click the canvas to play it with sound.
