// Export: renders every frame headlessly (parallel pages) and pipes PNGs to ffmpeg.
// usage: node render.mjs out.mp4 [audio.wav]      |   node render.mjs --stills dir f1 f2 ...
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const url = "file://" + path.join(here, "reel.html") + "?render";
const TOTAL = 900, WORKERS = 4;

const browser = await chromium.launch({ args: ["--disable-gpu-vsync", "--force-color-profile=srgb"] });
async function page() {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on("pageerror", e => { console.error("PAGE ERROR", e); process.exit(1); });
  await p.goto(url); await p.evaluate(() => window.ready); return p;
}
const grab = async (p, n) => Buffer.from((await p.evaluate(n => window.frame(n), n)).split(",")[1], "base64");

if (process.argv[2] === "--stills") {
  const dir = process.argv[3]; mkdirSync(dir, { recursive: true });
  const p = await page();
  for (const f of process.argv.slice(4).map(Number)) writeFileSync(path.join(dir, `f${String(f).padStart(3, "0")}.png`), await grab(p, f));
  await browser.close(); process.exit(0);
}

const [outFile, audio] = process.argv.slice(2);
const args = ["-y", "-framerate", "60", "-f", "image2pipe", "-c:v", "png", "-i", "-"];
if (audio) args.push("-i", audio);
args.push("-vf", "noise=alls=3:allf=t,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-tune", "grain", "-maxrate", "40M", "-bufsize", "80M",
  "-profile:v", "high", "-r", "60");
if (audio) args.push("-c:a", "aac", "-b:a", "320k", "-shortest");
args.push("-movflags", "+faststart", outFile);
const ff = spawn("ffmpeg", args, { stdio: ["pipe", "inherit", "inherit"] });

const pages = await Promise.all(Array.from({ length: WORKERS }, page));
const done = new Map(); let next = 0;
const flush = async () => {
  while (done.has(next)) {
    const buf = done.get(next); done.delete(next);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    next++;
    if (next % 60 === 0) console.error(`frame ${next}/${TOTAL}`);
  }
};
await Promise.all(pages.map(async (p, w) => {
  for (let f = w; f < TOTAL; f += WORKERS) {
    while (f - next > 40) await new Promise(r => setTimeout(r, 10)); // bound memory
    done.set(f, await grab(p, f)); await flush();
  }
}));
await flush();
ff.stdin.end();
await new Promise(r => ff.on("close", r));
await browser.close();
