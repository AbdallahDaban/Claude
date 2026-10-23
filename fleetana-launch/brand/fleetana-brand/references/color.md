# Fleetana Color (v2)

Source: `app/globals.css`, covering the app tokens `:root` and `.dark`, and the marketing tokens `.marketing` and `.dark .marketing`, plus the map pins in `app/(app)/map/fleet-map.tsx`.

## Light: the default for everything external

| Name | Hex | Code token | Use |
|---|---|---|---|
| Fleetana Blue | `#2A89FA` | `--brand`, `--primary`, `--chart-1` | Logo, fills, icons, chart series, large shapes, the in-app primary button |
| Accent Blue | `#0051D5` | `--mk-accent` (light) | All blue **text** on light backgrounds: headline payoff lines, links, eyebrows, step labels |
| Navy | `#1E3A8A` | `--accent-foreground` | Text on Tint: active nav, chip text |
| Black | `#000000` | `--mk-heading` | Headlines |
| Ink | `#0F172A` | `--foreground` | Body text, UI text, tables |
| On-variant | `#45464D` | `--mk-on-variant` | Secondary text, captions, body copy on social |
| Muted | `#64748B` | `--muted-foreground` | Labels, metadata, footers |
| Paper | `#F7F9FB` | `--mk-bg` | Default page and post background |
| Tint | `#E8F2FF` | `--accent` | Alternate background, active state, icon circles (or `#2A89FA` at 14%) |
| Container | `#ECEEF0` | `--mk-container` | Inactive chips, wells |
| White | `#FFFFFF` | `--card` | Cards and document pages |
| Border | `#D9D9D9` | `--border` | Card and table borders. `#E3E4E8` is the marketing hairline. |

Chart ramp, in order: `#2A89FA` → `#60A5FA` → `#1E3A8A` → `#93C5FD` → `#475569`.

**The CTA button** is black (`#000000`) with white text on light marketing surfaces, which is the code's `--mk-btn`. On a product screenshot, the primary button is Fleetana Blue.

## Vehicle and status colors
These colors are the product's operational vocabulary. Brand blue is never a vehicle state.

| State | Dot / pin | Pill bg (on white) | Pill text | Note |
|---|---|---|---|---|
| Moving / Active / Pass | `#16A34A` | `#E3F4E9` | `#15803D` | Green |
| Idle / Due soon / Low | `#D97706` | `#FAECDC` | `#B45309` | Amber. The fuel "Low" flag is amber, not red. |
| Parked | `#475569` | `#ECEEF1` | `#475569` | Slate |
| No signal / Upcoming | `#94A3B8` | `#ECEEF1` | `#475569` | Grey. "Unknown" is not "broken". |
| Fault / Overdue / Fail / Critical | `#EF4444` | `#FDE9E9` | `#B91C1C` | Red is reserved for genuinely wrong things |
| Info / tracker tag | `#2A89FA` | `#E5F1FE` | `#1E3A8A` | Neutral information, never a vehicle state |

Speed bands on a trip replay: ≤100 km/h `#22C55E`, ≤120 `#EAB308`, >120 `#EF4444`.

## Dark "Deep Space": the product's dark mode only
Background `#0F172A`, cards `#1E293B`, borders `#334155`, text `#F8FAFC`, muted `#94A3B8`. The marketing gradient runs from `#0F172A` to `#060E20`. In dark mode, accent text is `#2A89FA` (5.2:1 on `#0F172A`).

Use it only to show the product's dark mode. Social, documents, decks and signatures are light.

## Contrast on white

| Color | Ratio | Verdict |
|---|---|---|
| `#2A89FA` | 3.47:1 | Fills, icons and text 24 px or larger only |
| `#0051D5` | 6.7:1 | Any text size |
| `#1E3A8A` | 10.4:1 | Any text size |
| `#45464D` | 9.4:1 | Any text size |
| `#64748B` | 4.8:1 | Small labels are fine |
| `#0F172A` | 17.9:1 | Any text size |

## Proportion
Roughly 75% light neutrals (Paper, White, Tint), 15% blue, and 10% ink and status color. Blue is the accent that tells the eye where to go.

## Never
- Gradients on the logo or on large brand surfaces (the particle texture is not a gradient)
- Brand blue as a vehicle marker, route line or state
- Red for anything that is not a fault, a failure or an overdue item
- Cream or beige backgrounds
- Decorative color bars, edge stripes or accent underlines
