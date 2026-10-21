# Fleetana launch films: creative brief, brainstorm and scripts

## Ground rules (in priority order)
1. **The code is the source of truth.** Every feature a film shows exists in `fleetana-master`. Colors, fonts and logo come from `app/globals.css`, `app/layout.tsx` and `public/*.svg`.
2. **No invented numbers.** The code has no customer savings data. The films show *mechanisms* that save money. Every on-screen number is either a product rule from the code or plainly in-app example data:
   - The fuel flag fires below 70% of a vehicle's 30-day average.
   - VAT is 15%.
   - Documents are flagged 30 days before expiry.
   - Service is due on km, engine hours or date, whichever comes first.
   - The map refreshes about every 10 s.
   - Plans cost SAR 299 / SAR 899.
3. **Don't repeat landing-page claims the code doesn't back:** sub-second latency, route optimisation, engine diagnostics and predictive maintenance.
4. **GPS features need a tracker.** The live map, idling time and driver scores all depend on staff-provisioned GT06 trackers, so every tracker scene carries a "With a GPS tracker" tag.
5. **Use the brand guide where the code is silent.** Its voice rules apply: plain, short, second person, no hype words. So do Saudi formats: plates with Arabic letters, SAR, km, DD/MM/YYYY.

## Visual identity, taken from the code
- **Colors.** Brand blue `#2A89FA`. The dark "Deep Space" theme is base `#0F172A` with cards `#1E293B` and borders `#334155`, plus the marketing gradient `#0F172A` → `#060E20`.
- **Map pins** use the app's own colors: moving green `#16A34A`, idling amber `#D97706`, parked slate `#475569`, no signal grey `#94A3B8`. The brand blue is never used for vehicle state.
- **Type.** Hanken Grotesk for marketing headlines, Inter for UI, IBM Plex Sans Arabic for Arabic.
- **Motion signature.** The landing page's kinetic background (particle network plus vertical data streams), made deterministic. The house ease is `cubic-bezier(0.16, 1, 0.3, 1)` from `hero-fade-in`.

## Brainstorm: concepts considered

| # | Concept | Verdict |
|---|---|---|
| A | **"Off spreadsheets":** chaos (cells, receipts, sticky notes) is pulled into one Fleetana workspace | ✅ Film 1. This is the product's own CTA. |
| B | **"Where the money leaks":** a riyal counter that keeps draining, with each leak plugged by a real feature | ✅ Film 2. This is the cost story you asked for. |
| C | **Vertical "three checks before Sunday":** a fast phone-first social cut | ✅ Film 3. Snapchat, TikTok and Reels are where Saudi SMB owners scroll. |
| D | A day in the life of a supervisor, with an actor and voiceover | ❌ Needs footage and a VO actor. A fake "real customer" would be dishonest. |
| E | Savings calculator ("save 23%!") | ❌ No real data to back any percentage. |
| F | AI and predictive-maintenance hype | ❌ Absent from the code, and banned by the brand voice. |
| G | Truck "hero shots" with a cinematic 3D road | ⚠️ Partially folded into Film 1 and Film 2 as illustrated vehicles. |

## Film 1: "Off spreadsheets" (launch hero, 40 s, 16:9)

| Time | Picture | Words |
|---|---|---|
| 0–5 | Cold open, dark. Spreadsheet cells, fuel receipts, a sticky note ("Oil change? ~85,000 km"), a chat bubble ("Istimara expired??") and a paper checklist pile up and jitter. | *Your fleet runs on spreadsheets, receipts and memory.* |
| 5–8 | Everything is pulled into one point and the Fleetana mark assembles from two chevrons. The kinetic background breathes in. Wordmark. | — |
| 8–11 | Headline | *One place for everything that touches your fleet.* |
| 11–29 | Product tour: six 3 s beats, a tilted UI panel per module, rendered in the app's dark tokens | **Vehicles:** every vehicle, plate, driver and document date. **Service:** reminders by km, engine hours or date, whichever comes first. **Fuel:** every fill-up logged, and the ones that don't add up flagged. **Inspections:** a failed check opens an issue automatically. **Work orders:** parts, labour and 15% VAT, totalled in SAR. **Live map** (with a GPS tracker): moving, idling, parked, at a glance. |
| 29–34 | "Built for Saudi fleets" chips: Istimara · Fahes · Insurance · SAR + VAT · km · العربية | *Built for Saudi fleets.* |
| 34–40 | End card: logo, CTA, price | *Get your fleet off spreadsheets.* · fleetana.sa · *Plans from SAR 299 / month* |

## Film 2: "Where the money leaks" (cost film, 30 s, 16:9)

| Time | Picture | Words |
|---|---|---|
| 0–3 | A large SAR figure ticking down. | *Fleets lose money quietly.* |
| 3–8 | **Fuel.** A fuel log; one fill-up drops to 5.9 km/L against an average of 9.2. A red flag snaps on. | *Fuel that doesn't add up gets flagged.* (Rule: below 70% of the 30-day average) |
| 8–13 | **Service.** An odometer rolls 89,420 → 90,000; the pill goes Upcoming → Due soon → Overdue. | *Service on time, before small jobs turn into big repairs.* |
| 13–18 | **Papers.** Istimara, insurance and Fahes cards count down; "Expires in 12 days". | *Renew before the fine, not after.* |
| 18–22 | **Idling** (GPS tracker). A map pin turns amber and an idle timer climbs. | *See which engines run while vehicles stand still.* |
| 22–25 | **Warranty.** A work order line with the stamp "Under warranty · 143 days left". | *Don't pay for repairs still under warranty.* |
| 25–30 | All five flags stack into the logo. | *Find the leaks. Fix them.* · Fleetana · fleetana.sa |

## Film 3: vertical social (20 s, 9:16)

| Time | Picture | Words |
|---|---|---|
| 0–2 | Hook. Big type. | *Still running your fleet on spreadsheets?* |
| 2–16 | Phone-sized cards fly up, ~3.5 s each: Fuel flag · Service overdue · Istimara expiring · Failed inspection → issue opened | — |
| 16–20 | Logo, CTA | *Get your fleet off spreadsheets.* · from SAR 299/month |

Each film renders in English and in natively drafted Arabic (right-to-left layout, Arabic UI strings taken from `lib/i18n/messages-ar.ts`). Music is original, synthesized per film.
