# Layout, Illustration and Motion (v2)

These rules were proven in the launch films, the first 9 Instagram posts, the first 3 LinkedIn posts and the templates.

## Surfaces
- **Backgrounds:** Paper `#F7F9FB` and Tint `#E8F2FF`. On a grid of posts, alternate them as a checkerboard.
- **Cards:** White, 1.5 px `#D9D9D9` border, 18–24 px radius (about 12–16 pt in Office), and a soft shadow of 0 18 40 at 12% Ink. Cards hold product UI, documents and data.
- **Texture:** the landing page's particle network (dots linked when close, in `#0051D5` at up to 28%). Keep it subtle. It is the only texture.
- **Glow:** a radial Fleetana Blue at 14–18% behind the logo on end cards only.

## Grid
| Canvas | Margins | Logo | Footer |
|---|---|---|---|
| 1080×1350 post | 80 px | 30 px tall, top-left (RTL top-right) | `fleetana.sa` bottom-left in Muted; "Swipe →" bottom-right on carousel covers |
| 1080×1920 reel | 70–80 px | centred, 44 px | none. Text stays inside y 250–1540 (platform UI covers the rest). Reel covers keep the title inside the centre 3:4 (y 240–1680). |
| 1920×1080 video | 90–110 px | centred on the end card | none |
| 13.33×7.5 in slide | 0.6 in | 0.3 in tall, top-left | slide number + `fleetana.sa` in Muted |
| A4 document | 22 mm | 10 mm tall, header left | `fleetana.sa` left, page number right, hairline above |

Carousel slides carry a mono counter (`2 / 6`) top-right (RTL top-left). One message per slide or post.

## Product UI as illustration
Our strongest images are our own screens, simplified and enlarged:
- the vehicle table
- service reminders with status pills
- the fuel log with the amber "Low" flag
- the fuel chart with its average line and dashed 70% line
- the inspection checklist where a failed item opens an issue
- document expiry cards
- the work order with VAT lines
- the light fleet map with app-coloured pins
- driver-performance bars

Rules:
- **Readable on a phone.** UI text is at least 20 px on a 1080 canvas. Scale cards to about 1.3× rather than shrinking text.
- **Demo data looks like demo data:**
  - plates: `4271 ح ط ر`, `8834 ب ن م`, `1902 د ك ل`
  - vehicles: Toyota Hilux, Hiace, Coaster, Isuzu NPR
  - Arabic driver names: full names (فيصل العتيبي)
  - dates: DD/MM/YYYY
  - money: SAR 1,234.00 in UI
- Show the app's own labels in each language (`lib/i18n`). In Arabic, UI tables keep the app's Latin units (`km/L`, `SAR`) because that is what the app shows. Explanatory graphics and captions use كم، لتر، كم/لتر، دقيقة.

## Illustration
- **Vehicles:** flat side views of a pickup, a van and a box truck. White body with a soft grey gradient, a Fleetana Blue livery stripe and dark glass. Shown moving with wheel spokes and a slight bob, or parked with exhaust puffs to mean "engine on".
- **Riyadh:** Kingdom Centre (tapering tower with the parabolic void and sky bridge) and Al Faisaliah (pyramid with the globe), plus simple block buildings. Draw them as low-contrast silhouettes behind a road.
- **Icons:** Lucide-style, 2 px stroke, round caps, in Accent Blue on a 14% Fleetana Blue circle. Set: truck, wrench, fuel, clipboard, check, calendar, pin, shield, chart, users, alert, bell, box, camera, arrow.
- **Never:** stock photos of "customers", 3D clip-art, emoji, or decorative stripes and underlines.

## Motion
- **Ease:** `cubic-bezier(0.16, 1, 0.3, 1)`, the site's `hero-fade-in`, for nearly everything. Use expo in-out for scene changes.
- **Type:** rises line by line from behind a mask, with a 0.1–0.25 s stagger. The payoff line lands last, in Accent Blue.
- **Proof push-in:** when a slide's proof is small UI (a "Low" pill, a "Fail", a total), push the camera in about 1.3× on it, with a solid caption column so text never overlaps UI.
- **Counters:** odometers roll mechanically and numbers count up quickly (0.6–1.0 s), then hold.
- **Logo:** chevron-first build, then a hold of at least 2.5 s. The end-card URL holds at least 2 s.
- **Pacing:** cut on the music's grid. Allow about 3 words per second of on-screen copy, and at least 1.2 s on each payoff line.
- **Sound:** original music, synthesized (no stock). Use soft UI sounds on events: a pop for a flag, ticks for counters, a thud for a stamp, a chime for the logo.
- **Light versions** are the default for social. Dark versions exist for the launch films only.
