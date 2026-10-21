"""Original 15 s score for the reel, synthesized from scratch (numpy only).
120 BPM, every hit is placed on the same timeline the visuals cut on.
usage: python3 score.py showreel.wav
"""
import sys, wave
import numpy as np

SR = 48000
DUR = 15.0
N = int(SR * DUR)
rs = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N); VERB = np.zeros(N)
t_all = np.arange(N) / SR


def place(buf, sig, t0, gain=1.0, pan=0.0, verb=0.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    lg, rg = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    L[i:i + len(sig)] += sig * lg; R[i:i + len(sig)] += sig * rg
    if verb: VERB[i:i + len(sig)] += sig * verb


def tt(d): return np.arange(int(d * SR)) / SR
def fft_filter(x, lo=0.0, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))
def onepole_sweep(x, cut):  # time-varying lowpass, cut: array of Hz
    y = np.zeros_like(x); s = 0.0
    a = 1 - np.exp(-2 * np.pi * cut / SR)
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y
def saw(freq, d, detune=(0,)):
    t = tt(d); return sum(2 * ((t * freq * (1 + c)) % 1) - 1 for c in detune) / len(detune)

# ── instruments ────────────────────────────────────────────────────────────
def kick(d=0.45, hard=1.0):
    t = tt(d); f = 45 + 140 * np.exp(-t * 30 * hard)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(2.2 * np.sin(ph) * np.exp(-t * 7)) + 0.4 * rs.standard_normal(len(t)) * np.exp(-t * 300)
def clap():
    t = tt(0.3); n = fft_filter(rs.standard_normal(len(t)), 900, 5000)
    env = sum(np.exp(-np.maximum(t - o, 0) * 60) * (t >= o) for o in (0, 0.01, 0.022)) * 0.6 + np.exp(-t * 14) * 0.7
    return n * env * 0.9
def hat(d=0.05, open_=False):
    t = tt(0.25 if open_ else d); n = fft_filter(rs.standard_normal(len(t)), 7000)
    return n * np.exp(-t * (14 if open_ else 90))
def snare(pitch=1.0):
    t = tt(0.18); n = fft_filter(rs.standard_normal(len(t)), 1500, 9000) * np.exp(-t * 28)
    return n * 0.8 + np.sin(2 * np.pi * 190 * pitch * t) * np.exp(-t * 35) * 0.6
def crash(d=2.0):
    t = tt(d); return fft_filter(rs.standard_normal(len(t)), 3500) * np.exp(-t * 2.6) * 0.5
def sub_boom(d=2.0):
    t = tt(d); f = 30 + 60 * np.exp(-t * 6)
    return np.tanh(1.6 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 2.2)
def blip(f, d=0.06, shape="sine"):
    t = tt(d); w = np.sin(2 * np.pi * f * t) if shape == "sine" else np.sign(np.sin(2 * np.pi * f * t))
    return w * np.exp(-t * 60) * np.minimum(1, t * 2000)
def whoosh(d=0.35, up=True):
    t = tt(d); n = rs.standard_normal(len(t))
    cut = (300 + 7000 * (t / d) ** 2) if up else (7000 * (1 - t / d) ** 2 + 300)
    env = np.sin(np.pi * t / d) ** 2
    return onepole_sweep(n, cut) * env * 1.6
def fm_bell(f, d=1.6):
    t = tt(d); idx = 3 * np.exp(-t * 3)
    return np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 3.5 * t)) * np.exp(-t * 2.5) * np.minimum(1, t * 500)

# ── timeline ───────────────────────────────────────────────────────────────
A, F_, C, G = 110.0, 87.31, 130.81, 98.0
# 0–2 ident
place(L, blip(1760, 0.12), 0.05, 0.35, 0, 0.4)
place(L, kick(0.6, 0.7), 0.44, 0.9); place(L, crash(1.6), 0.44, 0.35, 0, 0.3)
place(L, whoosh(0.5), 0.36, 0.5)
for i in range(6): place(L, blip(2400 + i * 180, 0.04), 0.55 + i * 0.045, 0.22, (i - 2.5) / 3, 0.3)
for i in range(16): place(L, blip(5200, 0.015, "sq"), 0.9 + i * 0.028, 0.05, 0.4)
place(L, whoosh(0.32), 1.68, 0.8, -0.3)
# drone under the ident
d = tt(2.0); drone = (np.sin(2 * np.pi * 55 * d) + 0.5 * np.sin(2 * np.pi * 82.4 * d)) * np.minimum(1, d / 0.8) * np.exp(-np.maximum(d - 1.6, 0) * 8)
place(L, drone, 0, 0.18)

# 2–3 word hits
for i, w in enumerate([2.0, 2.25, 2.5, 2.75]):
    place(L, kick(0.35), w, 0.9); place(L, blip([880, 1175, 1320, 1760][i], 0.08, "sq"), w, 0.08, 0, 0.3)
place(L, crash(), 3.0, 0.4, 0, 0.2)
place(L, whoosh(0.3), 3.72, 0.7, 0.3)

# groove 3–9.5
beats = np.arange(3.0, 9.5, 0.5)
for b in beats: place(L, kick(), b, 0.95)
for b in np.arange(3.5, 9.5, 1.0): place(L, clap(), b, 0.55, 0, 0.35)
for i, h in enumerate(np.arange(3.0, 12.0, 0.125)):
    if 9.875 <= h < 10.0: continue
    place(L, hat(), h, 0.16 if i % 2 else 0.07, 0.35 if i % 4 < 2 else -0.35)
place(L, whoosh(0.4, False), 5.6, 0.4); place(L, sub_boom(1.2), 6.0, 0.5); place(L, crash(1.4), 6.0, 0.3, 0, 0.3)
place(L, whoosh(0.4), 7.4, 0.5, 0.2)
# particles shimmer: a run of blips across the CRAFT reveal
for i in range(24): place(L, blip(1200 * 2 ** (rs.integers(0, 12) / 12), 0.05), 6.05 + i * 0.03, 0.06, rs.uniform(-0.8, 0.8), 0.5)

# build 8–10: snare roll + riser
roll = list(np.arange(8.0, 9.0, 0.25)) + list(np.arange(9.0, 9.5, 0.125)) + list(np.arange(9.5, 9.875, 0.0625))
for k, r in enumerate(roll): place(L, snare(1 + k * 0.04), r, 0.25 + 0.5 * k / len(roll), 0, 0.2)
rd = 1.875; rt = tt(rd)
riser = onepole_sweep(rs.standard_normal(len(rt)), 200 + 9000 * (rt / rd) ** 3) * (rt / rd) ** 2 * 1.2
riser += np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * rt / rd)) / SR) * (rt / rd) ** 3 * 0.2
place(L, riser, 8.0, 0.55, 0, 0.3)

# drop 10–12
for b in np.arange(10.0, 12.0, 0.5): place(L, kick(0.45, 1.3), b, 1.0)
for b in np.arange(10.5, 12.0, 1.0): place(L, clap(), b, 0.6, 0, 0.3)
place(L, sub_boom(2.2), 10.0, 0.9); place(L, crash(2.4), 10.0, 0.5, 0, 0.4)
arp = [A * 4, A * 4 * 1.189, A * 4 * 1.498, A * 8, A * 4 * 1.498, A * 4 * 1.189]
for i, a in enumerate(np.arange(10.0, 11.875, 0.125)):
    t = tt(0.12); n = np.sign(np.sin(2 * np.pi * arp[i % 6] * t)) * np.exp(-t * 25)
    place(L, fft_filter(n, 0, 4000), a, 0.07, -0.5 if i % 2 else 0.5, 0.5)
rev = tt(0.25); place(L, fft_filter(rs.standard_normal(len(rev)), 2500) * (rev / 0.25) ** 3, 11.75, 0.6)

# montage 12–13.5: stutter hits per cut
for i, c in enumerate(np.arange(12.0, 13.5, 0.25)):
    place(L, kick(0.22, 1.4), c, 0.9)
    g = np.tile(blip(300 * 2 ** (i / 3), 0.02, "sq"), 5)
    place(L, g, c + 0.02, 0.15, (-1) ** i * 0.6, 0.2)
    place(L, hat(0.03), c + 0.125, 0.2)
place(L, whoosh(0.25), 13.27, 0.6)

# end card 13.5
place(L, kick(0.8, 0.9), 13.5, 1.0); place(L, sub_boom(1.5), 13.5, 0.7); place(L, crash(1.5), 13.5, 0.45, 0, 0.5)
for f, p in ((880, -0.2), (1318.5, 0.2), (1760, 0)): place(L, fm_bell(f), 13.56, 0.16, p, 0.7)

# bass + pads (sidechained to the kick grid)
chords = [(2.0, A, [0, 3, 7]), (4.0, F_, [0, 4, 7]), (6.0, C, [0, 4, 7]), (8.0, G, [0, 4, 7]),
          (10.0, A, [0, 3, 7]), (11.0, F_, [0, 4, 7]), (12.0, C, [0, 4, 7]), (12.75, G, [0, 4, 7]), (13.5, A, [0, 3, 7, 14])]
for k, (t0, root, iv) in enumerate(chords):
    t1 = chords[k + 1][0] if k + 1 < len(chords) else 15.0
    if 9.875 <= t0 < 10: continue
    dur = min(t1, 9.875) - t0 if t0 < 9.875 else t1 - t0
    b = saw(root / 2, dur, (0, 0.004)); bt = tt(dur)
    b = onepole_sweep(b, 300 + 500 * np.exp(-(bt % 0.25) * 18)) if t0 >= 3.0 else fft_filter(b, 0, 250)
    place(L, b * np.minimum(1, bt * 200) * np.exp(-np.maximum(bt - dur + 0.02, 0) * 300), t0, 0.32)
    pad = sum(saw(root * 2 ** (i / 12) * 2, dur, (-0.006, 0, 0.007)) for i in iv) / len(iv)
    pad = fft_filter(pad, 150, 2200 if t0 < 10 else 3500) * np.minimum(1, bt / 0.15)
    if t0 >= 13.5: pad *= np.exp(-bt * 1.3)
    place(L, pad, t0, 0.18, 0, 0.6)

# sidechain pump on everything except drums would need buses; approximate on the whole bed instead
duck = np.ones(N)
for b in list(np.arange(3.0, 9.5, 0.5)) + list(np.arange(10.0, 12.0, 0.5)):
    i = int(b * SR); k = tt(0.4); duck[i:i + len(k)] *= 1 - 0.35 * np.exp(-k * 12)
# ── reverb (convolution with decaying noise) ───────────────────────────────
irt = tt(1.8); ir = rs.standard_normal(len(irt)) * np.exp(-irt * 3.2); ir = fft_filter(ir, 200, 6000); ir /= np.abs(ir).sum() / 12
wet = np.fft.irfft(np.fft.rfft(VERB, 2 * N) * np.fft.rfft(ir, 2 * N), 2 * N)[:N]
ir2 = np.roll(ir, 900)
wetR = np.fft.irfft(np.fft.rfft(VERB, 2 * N) * np.fft.rfft(ir2, 2 * N), 2 * N)[:N]
L = L * duck + wet * 0.35; R = R * duck + wetR * 0.35
# silence gap before the drop
gap = (t_all >= 9.875) & (t_all < 10.0); L[gap] *= 0.05; R[gap] *= 0.05
# master: fade, soft clip, normalize
fade = np.clip((15.0 - t_all) / 0.8, 0, 1) ** 1.5
mix = np.stack([L, R], 1) * fade[:, None]
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.6) ; mix = mix / np.max(np.abs(mix)) * 0.89
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", sys.argv[1])
