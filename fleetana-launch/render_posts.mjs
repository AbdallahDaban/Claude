// Render every social post/slide to PNG (always light), EN + AR, and build the LinkedIn PDF.
//   node render_posts.mjs [outDir]
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
const out = process.argv[2] || "social";
const POSTS = ["ig1cover", "ig2", "ig3", "ig4cover", "ig5", "ig6", "ig7cover", "ig8", "ig9", "li2"];
const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
page.on("pageerror", e => { console.error("PAGE ERROR", e); process.exit(1); });
for (const lang of ["en", "ar"]) {
  const dir = path.join(out, lang); mkdirSync(dir, { recursive: true });
  for (const post of POSTS) {
    const url = (slide) => "file://" + path.resolve("posts.html") + `?render&theme=light&lang=${lang}&post=${post}&slide=${slide}`;
    await page.goto(url(1)); await page.evaluate(() => window.ready);
    const n = await page.evaluate(() => window.POSTDEF.slides);
    for (let s = 1; s <= n; s++) {
      if (s > 1) { await page.goto(url(s)); await page.evaluate(() => window.ready); }
      const b64 = (await page.evaluate(() => window.frame(0))).split(",")[1];
      const name = n > 1 ? `${post}-${String(s).padStart(2, "0")}.png` : `${post}.png`;
      writeFileSync(path.join(dir, name), Buffer.from(b64, "base64"));
    }
    console.error(`${lang} ${post}: ${n}`);
  }
}
await browser.close();
