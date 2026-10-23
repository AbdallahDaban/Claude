# Applications (v2)

The working files are in the launch repo `fleetana-launch/`. Every one is generated from code, so it can be rebuilt in either language.

## Social
**Instagram feed: 1080×1350 (4:5)**
- Single images and carousels use the layout grid. The grid thumbnail crops to 3:4, so keep text 80 px or more from the sides.
- **First-9 grid system:** reels in the right column, carousels in the middle, single images on the left. Paper and Tint alternate as a checkerboard. Don't pin posts until the first 9 are up.
- **Carousels:** 4–7 slides.
  - Slide 1 is a hook headline plus one proof visual, with "Swipe →".
  - Middle slides carry one claim each, with its UI.
  - The last slide is the logo, the CTA ("Get your fleet off spreadsheets.") and a black URL button.
- **Reels:** 1080×1920, 15–30 s, original music. Upload a custom cover with the title inside the centre 3:4.

**LinkedIn**
- Native video (16:9 film), document posts (PDF of 1080×1350 pages), and single images (1080×1350).
- A brand-new company page gets little reach, so founders post and the page reshares.

## Word (`brand/templates/word`)
- **Format:** A4, with a cover page on the particle texture.
- **Header:** logo left (right in Arabic). **Footer:** `fleetana.sa` and the page number, with a hairline above.
- **Styles:**
  - Title, Subtitle (Accent Blue), Heading 1–3, Normal (Inter 10.5 pt)
  - Caption, Quote / Callout (Tint panel), List Bullet / Number
  - Data (Plex Mono) and the "Fleetana Table" style (Tint header, hairline borders, Paper banding)
- **Language versions:** English (LTR) and Arabic (RTL, IBM Plex Sans Arabic as the complex-script font).

## PowerPoint (`brand/templates/powerpoint`)
- **Format:** 16:9 (13.33×7.5 in), all light.
- **Layouts:**
  - Cover, Section divider (Tint), Title only
  - Title + content, Two column, Stats, Cards ×3 with icons
  - Product screen, Process, Table, Quote, Closing
- **Example decks:** a company profile, a pitch and a proposal, built from real product facts.
- **Language versions:** English and Arabic (RTL).

## Email signature (`brand/signature`)
- **Layout:**
  - Name: Arial 16 px bold, `#0F172A`.
  - Role: 13 px, `#45464D`.
  - Optional phone and email lines, then `fleetana.sa` in `#0051D5`.
  - Then the animated banner.
  - Arabic name and role are optional, as a second RTL block.
- **Animation:** 480×120 shown (960×240 file), 4.6 s, plays **once** and holds on the logo.
  1. A white pickup drives in.
  2. A scan line sweeps it, and check points pop on lights, tyres and brakes (an inspection, not diagnostics).
  3. The car folds into the chevron F and FLEETANA builds.
- **Outlook (Windows desktop) shows only the first frame of a GIF.** Use `fleetana-signature-{en,ar}-outlook.gif`, whose first frame is the finished logo.
- **Hosting:** host the four GIFs (`fleetana-signature-{en,ar}.gif` and their `-outlook` versions) on fleetana.sa, e.g. `https://fleetana.sa/email/`; email clients block local or attached images in signatures. Generate each employee's signature with `signature-generator.html`.

## Video
- **16:9 films** (40 s hero, 30 s cost story) and **9:16 reels** (15–30 s).
- 60 fps H.264, AAC 256 kbps, with original synthesized music.
- Each film has light and dark versions; light is the default for social.
- End cards hold the logo and URL for at least 2 s.
