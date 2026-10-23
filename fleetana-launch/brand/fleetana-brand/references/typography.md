# Fleetana Typography (v2)

Source: `app/layout.tsx`. It loads Inter (`--font-sans`, the app), Hanken Grotesk (`--font-hanken`, marketing) and IBM Plex Sans Arabic (`--font-arabic`). IBM Plex Mono was added for data in the launch materials. All four are free under the SIL Open Font License, so install them from Google Fonts on every company machine.

| Role | Latin | Arabic | Weight |
|---|---|---|---|
| Headlines, titles, big statements | **Hanken Grotesk** | IBM Plex Sans Arabic | 700 |
| UI, body, captions, tables | **Inter** | IBM Plex Sans Arabic | 400–600 |
| Plates, odometers, IDs (WO-000123), coordinates, table dates | **IBM Plex Mono** | stays Latin, LTR | 500–600 |

## The headline pattern
Two short lines:
- **Line 1:** the fact or statement, in Black `#000000`.
- **Line 2:** the payoff, in Accent Blue `#0051D5`.

Hanken Grotesk 700, tracking −1 to −2 px at display sizes, and leading 1.1–1.15. No period at the end of slide titles. Periods are fine on social headlines when they read as sentences ("Your whole fleet. One place.").

## Sizes

| Surface | Headline | Body | Smallest |
|---|---|---|---|
| Social post (1080 px wide) | 76–112 px | 28–34 px | 22 px (pills, labels) |
| Reel (1080×1920) | 84–104 px | 30 px | 24 px; all text inside y 250–1540 |
| Video 1920×1080 | 72–118 px | 26–38 px | 20 px |
| Slide (13.33×7.5 in) | 36–44 pt titles, 54–72 pt stat callouts | 14–18 pt | 11 pt captions |
| Word document | Title 30 pt · H1 20 pt · H2 15 pt · H3 12 pt | 10.5 pt, leading 1.35 | 8.5 pt captions |
| Email signature | Name 16 px bold | 13 px | 12 px |

## Arabic
- Arabic needs about 15% more leading than Latin. For example, social body text runs at 1.6 against 1.4 for Latin, and Word body at 1.5 against 1.35.
- Never pair Arabic with an unrelated Latin face. Plex Arabic sits with Hanken and Inter in weight and x-height.
- Don't track Arabic (letter-spacing 0).

## Fallbacks
When the brand fonts aren't installed:
- **Office files** (Word and PowerPoint): Hanken Grotesk and Inter fall back to **Arial**, and IBM Plex Sans Arabic falls back to **Segoe UI** (Windows) or **Geeza Pro** (Mac). The templates name the brand fonts, so they render correctly once the fonts are installed.
- **Email clients** can't load web fonts. Signatures use `Arial, Helvetica, sans-serif` for Latin and `Tahoma, Arial` for Arabic.
- **Never** fall back to Times, Calibri, Aptos, Poppins, Cairo or Tajawal.
