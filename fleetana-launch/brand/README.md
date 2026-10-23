# Fleetana brand kit (v2)

Built from the shipped product code and the launch films, social posts and templates. Everything is light.

| Folder | What's inside |
|---|---|
| `fleetana-brand/` + `fleetana-brand.skill` | The updated brand guidelines as a Claude skill. Upload the `.skill` file to replace the org's current `fleetana-brand` skill. |
| `templates/word/` | Document template (cover page, headings, callouts, tables, figures) and Letterhead, in EN and AR. Use the `.dotx` files as Word templates; the `.docx` files are samples. |
| `templates/powerpoint/` | Template with 16 sample slides for company profiles, pitches and proposals, in EN and AR. Use the `.potx` files as templates; the `.pptx` files are samples. |
| `signature/` | Animated email banner (GIF/MP4, EN/AR, plus Outlook versions) and `signature-generator.html` for employees. |
| `assets/` | Logos, covers, textures, icons and product UI cards for use in documents and decks. |

## Before you use the templates
Install the brand fonts on each computer, from `../fonts/`: Hanken Grotesk, Inter and IBM Plex Sans Arabic. If the fonts are missing, Word and PowerPoint fall back to Arial.

## Signature setup (once, by the web team)
1. Upload `fleetana-signature-en.gif`, `fleetana-signature-ar.gif` and their `-outlook.gif` versions to `https://fleetana.sa/email/`.
2. Share `signature-generator.html` with employees. Each employee fills in their details and clicks **Copy signature**.

## Rebuilding
- Word: `node templates/word/build_word.js`
- PowerPoint: `node templates/powerpoint/build_pptx.js`
- Signature: `film5.html`, rendered with `render.mjs`, then `signature/make_gif.py`.
