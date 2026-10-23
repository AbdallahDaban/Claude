// Export every brand asset PNG (transparent) for both languages where text appears.  node render_assets.mjs brand/assets
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
const out = process.argv[2] || "brand/assets";
const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage();
page.on("pageerror", e => { console.error("PAGE ERROR", e); process.exit(1); });
const load = async (asset, lang) => { await page.goto("file://" + path.resolve("assets.html") + `?render&theme=light&lang=${lang}&asset=${asset}`); await page.evaluate(() => window.ready); };
await load("logo-blue", "en");
const list = await page.evaluate(() => window.ASSET_LIST);
for (const name of list) for (const lang of name.startsWith("ui-") ? ["en", "ar"] : ["en"]) {
  await load(name, lang);
  const dir = name.startsWith("ui-") ? path.join(out, "ui", lang) : name.startsWith("icon-") ? path.join(out, "icons") : out;
  mkdirSync(dir, { recursive: true });
  const b64 = (await page.evaluate(() => window.frame(0))).split(",")[1];
  writeFileSync(path.join(dir, `${name}.png`), Buffer.from(b64, "base64"));
}
console.log(list.length, "assets");
await browser.close();
