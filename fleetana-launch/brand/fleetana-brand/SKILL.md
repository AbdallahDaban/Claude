---
name: fleetana-brand
description: Fleetana's brand system (v2, Oct 2026), taken from the shipped product and proven in the launch films, social posts, Word/PowerPoint templates and email signature. Covers the light-first visual system, colors, typography, logo, layout and motion, voice, claim rules, and Arabic/English bilingual rules for the Saudi fleet-management product (fleetana.sa). Use this skill whenever producing anything that carries the Fleetana name or will be seen by a Fleetana customer, partner, investor or employee, including slide decks, pitch decks, company profiles, proposals, Word documents, reports, letters, social posts, reels, videos, email signatures, product mockups, UI components, landing pages, emails and Arabic copy. Also use it when the user mentions Fleetana, فليتانا, fleetana.sa, "our brand", "our colors", "on-brand", "brand guidelines", or asks for anything customer-facing for the fleet product, even if they do not say the word "brand". When in doubt on a Fleetana task, load this skill.
---

# Fleetana Brand System (v2)

Fleetana is fleet management for Saudi businesses that run 10 to 50 vehicles: delivery, construction, distribution and passenger transport. It keeps vehicles, service, fuel, inspections, issues and work orders in one workspace, in Arabic and English. The people who read our material are owners and operations managers. They pay the fuel and repair bills and read on phones, often outdoors.

Personality: **practical, plainspoken, reliable.** When a choice is unclear, pick the plainer one.

## Order of authority
1. **The shipped product code is the source of truth** for features, colors, fonts, UI labels and Arabic terms. That means `app/globals.css`, `app/layout.tsx`, `lib/i18n/*` and `public/fleetana-*.svg` in `fleetana-master`.
2. This skill is second.
3. Where the code and this skill disagree, follow the code and flag the difference.

## The five rules that matter most
1. **Light first.** Everything external is light: social, documents, decks, signatures and video. The dark "Deep Space" palette is the product's dark mode. Use it only when showing the product in dark mode.
2. **Show the product, never invent it.** Illustrate with real Fleetana screens and plainly fake demo data: Saudi plates, DD/MM/YYYY dates, SAR, km. Every feature shown must ship in the code. → `references/product-truth.md`
3. **Numbers come from the code, not from marketing.** Use the 70% fuel rule, 15% VAT, 30-day expiry window and the driver-score formula. Never use a savings percentage or a customer count we can't prove.
4. **Say what the product does, with the right verb.** It *flags*, *shows* and *lists*. It only *notifies* for urgent issues and work orders awaiting approval. GPS features always say **"Requires a GPS tracker"**.
5. **Arabic is equal, not translated.** Draft it natively, use the app's own terms, and treat فليتانا as masculine. → `references/bilingual.md`

## Color: the six used most
Full palette, pills and contrast: `references/color.md`. Tokens: `assets/fleetana-tokens.css`.

| Token | Hex | Use |
|---|---|---|
| Fleetana Blue | `#2A89FA` | Logo, fills, icons, charts, large shapes. Not for text under 24 px on white (3.47:1). |
| Accent Blue | `#0051D5` | Blue *text*: the payoff line of a headline, links, eyebrows. |
| Black | `#000000` | Headlines on light. |
| Ink | `#0F172A` | Body and UI text. |
| Paper | `#F7F9FB` | Default background. |
| Tint | `#E8F2FF` | Alternate background, active states, icon circles. |

Supporting colors: white cards `#FFFFFF`, border `#D9D9D9`, secondary text `#45464D`, muted `#64748B`.

Vehicle state uses the app's map-pin colors, never brand blue: Moving `#16A34A`, Idle `#D97706`, Parked `#475569`, No signal `#94A3B8`. Faults and critical items are `#EF4444`. No signal is grey, not red.

## Typography
→ `references/typography.md`
- **Hanken Grotesk 700** for headlines. Tight tracking.
- **Inter** for UI and body text.
- **IBM Plex Sans Arabic** for all Arabic.
- **IBM Plex Mono** for plates, odometers, IDs and dates in tables.

The signature headline is two lines: the statement in black, then the payoff in Accent Blue.
> Your whole fleet.
> **One place.**

## Logo
→ `references/logo.md`. Files are in `assets/`.

The lockup is the chevron **F** plus the drawn letters **LEETANA**.
- Use the SVG or PNG only. Never retype it in a font, never mirror it, and never recolor it outside Fleetana Blue, white or black.
- It sits top-left in LTR layouts and top-right in RTL ones.
- In Arabic contexts, set فليتانا in IBM Plex Sans Arabic 600 under or beside the lockup until a drawn Arabic wordmark exists.

## Layout, illustration and motion
→ `references/layout-and-motion.md`
- **Cards:** white on Paper or Tint, with a 1.5 px `#D9D9D9` border, an 18–24 px radius and a soft shadow.
- **Texture:** the landing page's particle network is the only one, and it stays subtle.
- **Icons:** 2 px line icons in Accent Blue inside 14% Fleetana Blue circles.
- **Illustration:** flat white fleet vehicles with a blue stripe, and Riyadh skyline silhouettes (Kingdom Centre, Al Faisaliah) at low contrast.
- **Motion:** the site's ease, `cubic-bezier(0.16, 1, 0.3, 1)`. Type rises in line by line; the logo builds chevron-first; the end card holds at least 2.5 s.
- **Never:** decorative stripes, accent underlines under titles, gradients on the logo, or stock imagery of people pretending to be customers.

## Voice
→ `references/voice.md`
1. Say the thing, then stop.
2. Name the vehicle, not the asset.
3. Numbers over adjectives, and only numbers we can prove.
4. Second person.
5. Errors explain and instruct.

No emoji and no exclamation marks.

**Banned:** leverage, seamless, cutting-edge, next-generation, revolutionary, AI-powered, real-time, robust, empower, unlock, game-changing, best-in-class, orchestration, supply chain network, fleet matrix.

## Applications
→ `references/applications.md` covers specs for:
- Instagram and LinkedIn: grid system, carousels, reel covers, captions
- Word and PowerPoint templates
- The email signature and its animation
- Launch videos

The templates themselves live in the launch repo (`fleetana-launch/brand/templates`).

## Before shipping anything
- [ ] Is it light? Dark only if it's showing the product's dark mode.
- [ ] Does every feature shown exist in the code? Are GPS features tagged?
- [ ] Is any verb overstating ("alerts", "real-time", "predicts", "optimises")?
- [ ] Is any number invented? Is any price shown without being asked for?
- [ ] Any blue text under 24 px on white? Use `#0051D5`.
- [ ] Was the Arabic drafted natively, with app terms, Western digits, ٪ and plates isolated LTR?
- [ ] Is the logo from the file, unmirrored, top-left (LTR) or top-right (RTL)?
