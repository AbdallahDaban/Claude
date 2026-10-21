// Export a Fleetana film: renders every frame headlessly on parallel pages and pipes PNGs into ffmpeg.
//   node render.mjs <film.html> <out.mp4> [audio.wav]
//   node render.mjs --stills <film.html> <dir> <frame> [frame...]
// Each film page exposes window.FILM = {w, h, fps, frames}, window.ready (Promise) and window.frame(n) -> dataURL.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const WORKERS = 4;
const stills = process.argv[2] === "--stills";
const [film, target, ...rest] = process.argv.slice(stills ? 3 : 2);
const [filmFile, query] = film.split("?");
const url = "file://" + path.resolve(filmFile) + "?render" + (query ? "&" + query : "");

const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
async function page() {
  const p = await browser.newPage({ viewport: { width: 1920, height: 1920 } });
  p.on("pageerror", e => { console.error("PAGE ERROR", e); process.exit(1); });
  p.on("console", m => { if (m.type() === "error") console.error("console:", m.text()); });
  await p.goto(url); await p.evaluate(() => window.ready); return p;
}
const grab = async (p, n) => Buffer.from((await p.evaluate(n => window.frame(n), n)).split(",")[1], "base64");

if (stills) {
  mkdirSync(target, { recursive: true });
  const p = await page();
  for (const f of rest.map(Number)) writeFileSync(path.join(target, `f${String(f).padStart(4, "0")}.png`), await grab(p, f));
  await browser.close(); process.exit(0);
}

const pages = await Promise.all(Array.from({ length: WORKERS }, page));
const { fps, frames } = await pages[0].evaluate(() => window.FILM);
const audio = rest[0];
const args = ["-y", "-loglevel", "error", "-framerate", String(fps), "-f", "image2pipe", "-c:v", "png", "-i", "-"];
if (audio) args.push("-i", audio);
args.push("-vf", "format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-maxrate", "30M", "-bufsize", "60M",
  "-profile:v", "high", "-r", String(fps));
if (audio) args.push("-c:a", "aac", "-b:a", "256k", "-shortest");
args.push("-movflags", "+faststart", target);
const ff = spawn("ffmpeg", args, { stdio: ["pipe", "inherit", "inherit"] });

const done = new Map(); let next = 0;
const flush = async () => {
  while (done.has(next)) {
    const buf = done.get(next); done.delete(next);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (++next % (fps * 5) === 0) console.error(`${film}: ${next}/${frames}`);
  }
};
await Promise.all(pages.map(async (p, w) => {
  for (let f = w; f < frames; f += WORKERS) {
    while (f - next > 40) await new Promise(r => setTimeout(r, 10));
    done.set(f, await grab(p, f)); await flush();
  }
}));
await flush();
ff.stdin.end();
await new Promise(r => ff.on("close", r));
await browser.close();
