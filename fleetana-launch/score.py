"""Original music + sound design for the Fleetana launch films (numpy only, no samples).
Each film's grid is locked to its cut points so beats land on scene changes.
usage: python3 score.py            -> writes audio/film1.wav, audio/film2.wav, audio/film3.wav
"""
import os, wave
import numpy as np

SR = 48000


def tt(d): return np.arange(int(d * SR)) / SR
def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
def fft_filter(x, lo=0.0, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))
def onepole(x, cut):
    cut = np.broadcast_to(cut, x.shape); a = 1 - np.exp(-2 * np.pi * cut / SR)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s += a[i] * (x[i] - s); y[i] = s
    return y


class Mix:
    def __init__(self, dur, seed):
        self.N = int(dur * SR); self.dur = dur
        self.L = np.zeros(self.N); self.R = np.zeros(self.N); self.V = np.zeros(self.N)
        self.duck = np.ones(self.N); self.rs = np.random.default_rng(seed)
    def put(self, sig, t0, g=1.0, pan=0.0, verb=0.0):
        i = int(t0 * SR)
        if i >= self.N or i + len(sig) <= 0: return
        if i < 0: sig = sig[-i:]; i = 0
        sig = sig[: self.N - i] * g
        self.L[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 - pan)); self.R[i:i + len(sig)] += sig * np.sqrt(0.5 * (1 + pan))
        if verb: self.V[i:i + len(sig)] += sig * verb
    def sidechain(self, t0, depth=0.4):
        i = int(t0 * SR); k = tt(0.35)
        if i < self.N: self.duck[i:i + len(k)] *= (1 - depth * np.exp(-k * 14))[: self.N - i]
    def write(self, path, fade_in=0.02, fade_out=1.0):
        n = self.rs.standard_normal; irt = tt(2.2)
        ir = fft_filter(n(len(irt)) * np.exp(-irt * 2.6), 250, 7000); ir /= np.abs(ir).sum() / 10
        conv = lambda x, h: np.fft.irfft(np.fft.rfft(x, 2 * self.N) * np.fft.rfft(h, 2 * self.N), 2 * self.N)[: self.N]
        wl, wr = conv(self.V, ir), conv(self.V, np.roll(ir, 700))
        t = tt(self.dur)[: self.N]
        env = np.clip(t / fade_in, 0, 1) * np.clip((self.dur - t) / fade_out, 0, 1) ** 1.3
        mix = np.stack([self.L * self.duck + wl * 0.3, self.R * self.duck + wr * 0.3], 1) * env[:, None]
        mix = np.tanh(mix / np.max(np.abs(mix)) * 1.35); mix = mix / np.max(np.abs(mix)) * 0.89
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with wave.open(path, "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
        print("wrote", path)


# ── instruments ─────────────────────────────────────────────────────────────
def kick(rs, d=0.4, punch=1.0):
    t = tt(d); f = 46 + 110 * np.exp(-t * 32 * punch)
    return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8)) + 0.25 * rs.standard_normal(len(t)) * np.exp(-t * 400)
def snap(rs):
    t = tt(0.2); return fft_filter(rs.standard_normal(len(t)), 1200, 7000) * (np.exp(-t * 40) + 0.4 * np.exp(-np.maximum(t - 0.012, 0) * 50) * (t > 0.012))
def hat(rs, d=0.05):
    t = tt(d); return fft_filter(rs.standard_normal(len(t)), 8000) * np.exp(-t * 80)
def shaker(rs):
    t = tt(0.09); return fft_filter(rs.standard_normal(len(t)), 5000, 12000) * np.sin(np.pi * t / 0.09) ** 2
def pluck(rs, f, d=0.6, bright=0.5):
    n = int(SR / f); buf = rs.uniform(-1, 1, n) * 0.8; out = np.zeros(int(d * SR))
    buf = fft_filter(np.tile(buf, 3), 0, 2000 + 6000 * bright)[:n]
    for i in range(len(out)):
        j = i % n; out[i] = buf[j]; buf[j] = 0.5 * (buf[j] + buf[(j + 1) % n]) * 0.996
    return out * np.minimum(1, tt(d) * 400)
def pad(chord, d, bright=1800, detune=(-0.007, 0, 0.006), attack=0.6):
    t = tt(d); sig = 0
    for n in chord:
        for c in detune: sig = sig + (2 * ((t * midi(n) * (1 + c)) % 1) - 1)
    sig = fft_filter(sig / (len(chord) * len(detune)), 120, bright)
    return sig * np.minimum(1, t / attack) * np.minimum(1, (d - t) / 0.4)
def bass(n, d, cut=420):
    t = tt(d); f = midi(n)
    s = 0.7 * np.sin(2 * np.pi * f * t) + 0.3 * fft_filter(2 * ((t * f) % 1) - 1, 0, cut)
    return np.tanh(1.4 * s) * np.minimum(1, t * 300) * np.minimum(1, (d - t) / 0.03)
def blip(f, d=0.08, up=1.0):
    t = tt(d); ph = 2 * np.pi * np.cumsum(f * (1 + (up - 1) * t / d)) / SR
    return np.sin(ph) * np.exp(-t * 40) * np.minimum(1, t * 2000)
def click(rs):
    t = tt(0.02); return fft_filter(rs.standard_normal(len(t)), 2500, 9000) * np.exp(-t * 300)
def whoosh(rs, d=0.5, up=True):
    t = tt(d); x = t / d; cut = 300 + 7000 * (x ** 2 if up else (1 - x) ** 2)
    return onepole(rs.standard_normal(len(t)), cut) * np.sin(np.pi * x) ** 2 * 1.4
def riser(rs, d=1.5):
    t = tt(d); x = t / d
    return onepole(rs.standard_normal(len(t)), 200 + 8000 * x ** 3) * x ** 2 + 0.15 * np.sin(2 * np.pi * np.cumsum(180 * 2 ** (2 * x)) / SR) * x ** 3
def impact(rs, d=2.0):
    t = tt(d); f = 32 + 55 * np.exp(-t * 7)
    return np.tanh(1.5 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 2.5) + fft_filter(rs.standard_normal(len(t)), 2000) * np.exp(-t * 6) * 0.3
def chime(f, d=2.4):
    t = tt(d); idx = 2.2 * np.exp(-t * 4)
    return np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 2.0 * t)) * np.exp(-t * 1.8) * np.minimum(1, t * 600)
def thud(rs):
    t = tt(0.35); return np.sin(2 * np.pi * np.cumsum(90 + 120 * np.exp(-t * 40)) / SR) * np.exp(-t * 14) + fft_filter(rs.standard_normal(len(t)), 300, 3000) * np.exp(-t * 30) * 0.5
def ping(f=1568):  # two-note chat notification
    return np.concatenate([blip(f, 0.1), blip(f * 1.335, 0.18)])


def groove(m, start, end, beat, prog, bars_per_chord=1, beats_per_bar=4, root_oct=36, energy=1.0, arp=True, hats=True):
    """Kick/snap/hats/bass/pad/pluck-arp over [start, end) on a beat grid."""
    rs = m.rs; bar = beat * beats_per_bar
    n_bars = int(np.ceil((end - start) / bar))
    for b in range(n_bars):
        t0 = start + b * bar; chord = prog[(b // bars_per_chord) % len(prog)]
        if t0 >= end: break
        if b % bars_per_chord == 0:
            pd = min(bar * bars_per_chord, end - t0)
            m.put(pad([root_oct + 24 + c for c in chord], pd + 0.3, bright=1600 + 1200 * energy), t0, 0.16, 0, 0.5)
        for k in range(beats_per_bar):
            tb = t0 + k * beat
            if tb >= end: break
            m.put(kick(rs, punch=1.0 + 0.3 * energy), tb, 0.75 * energy); m.sidechain(tb, 0.35 * energy)
            if k % 2 == 1: m.put(snap(rs), tb, 0.32 * energy, 0, 0.25)
            m.put(bass(root_oct + chord[0], beat * 0.5), tb + beat * 0.5, 0.42)
            if hats:
                m.put(hat(rs), tb + beat * 0.5, 0.12, 0.3); m.put(shaker(rs), tb + beat * 0.25, 0.05, -0.4); m.put(shaker(rs), tb + beat * 0.75, 0.05, -0.4)
            if arp:
                for q in range(2):
                    note = root_oct + 36 + chord[(k * 2 + q) % len(chord)] + (12 if (k * 2 + q) % 5 == 4 else 0)
                    m.put(pluck(rs, midi(note), 0.5, 0.35 + 0.3 * energy), tb + q * beat * 0.5, 0.11, 0.5 if q else -0.5, 0.45)


# Uplifting, calm-confident progression (D major): Dmaj9 – Bm7 – Gmaj7 – A6
PROG = [[2, 9, 14, 16, 18], [-1, 9, 14, 17, 21], [-5, 11, 14, 18, 23], [-3, 9, 13, 16, 18]]


def film1():
    m = Mix(40.0, 11); rs = m.rs
    TOUR, BEAT_S, SAUDI, END = 9.6, 3.3, 32.7, 35.3          # film1.js timeline (one module per bar)
    beat = BEAT_S / 4
    # 0–5 chaos: clock ticks, paper drops, chat ping, tension drone, riser into the collapse
    for i in range(int(4.9 / 0.375)): m.put(click(rs), 0.1 + i * 0.375, 0.25 + 0.15 * (i % 2), 0.3)
    d = tt(5.0); m.put(fft_filter(np.sin(2 * np.pi * 73.4 * d) + 0.5 * np.sin(2 * np.pi * 110 * d * 1.003), 0, 600) * np.minimum(1, d / 1.5), 0, 0.22)
    for t0 in (0.0, 0.25, 0.45, 0.7, 0.95): m.put(whoosh(rs, 0.3), t0, 0.35, (t0 - 0.5))
    m.put(ping(), 2.2, 0.35, 0.2, 0.3)
    m.put(riser(rs, 1.4), 3.65, 0.6, 0, 0.2); m.put(whoosh(rs, 0.5), 4.55, 0.7)
    # 5.0 logo: impact + chime chord
    m.put(impact(rs), 5.0, 0.8); m.put(pad([50, 57, 62, 66, 69], 2.6, bright=2400, attack=0.05), 5.0, 0.38, 0, 0.6)
    for f, p in ((midi(74), -0.3), (midi(78), 0.3), (midi(81), 0)): m.put(chime(f), 5.05, 0.12, p, 0.6)
    for k in range(3): m.put(kick(rs, punch=0.5), 6.0 + k * 0.4, 0.22)
    # 7.2 headline: pad + soft pulse into the tour
    m.put(pad([50, 57, 62, 64, 69], 2.6, bright=1400), 7.1, 0.18, 0, 0.5)
    for k in range(3): m.put(kick(rs, punch=0.6), TOUR - 3 * beat + k * beat, 0.35)
    m.put(riser(rs, 0.9), TOUR - 0.9, 0.35)
    groove(m, TOUR, SAUDI, beat, PROG, energy=0.85)
    for k in range(7): m.put(whoosh(rs, 0.35), TOUR + k * BEAT_S - 0.15, 0.3, 0.4 * (-1) ** k)
    # in-scene UI sounds (offsets match film1.js CONTENT timings)
    m.put(blip(880, 0.08, 1.4), TOUR + BEAT_S + 1.7, 0.15)                               # overdue flip
    m.put(blip(660, 0.1, 1.3), TOUR + 2 * BEAT_S + 1.35, 0.18); m.put(blip(990, 0.1), TOUR + 2 * BEAT_S + 1.45, 0.12)
    m.put(thud(rs), TOUR + 3 * BEAT_S + 1.0, 0.3); m.put(ping(1318), TOUR + 3 * BEAT_S + 1.55, 0.25)
    for k in range(10): m.put(click(rs), TOUR + 4 * BEAT_S + 0.6 + k * 0.08, 0.12)
    # Saudi: lift (big pad, passing vehicles); end chord + chime
    m.put(pad([47, 54, 59, 62, 66], SAUDI - END + 3.2 + (END - SAUDI), bright=2600), SAUDI, 0.2, 0, 0.6)
    groove(m, SAUDI, END, beat, [PROG[2], PROG[3]], energy=0.6, arp=True, hats=False)
    m.put(whoosh(rs, 1.4), SAUDI + 0.3, 0.4, -0.6); m.put(whoosh(rs, 1.4), SAUDI + 1.1, 0.35, 0.6)
    m.put(impact(rs, 2.5), END, 0.55); m.put(pad([50, 57, 62, 66, 69, 74], 40.0 - END, bright=2200, attack=0.1), END, 0.4, 0, 0.7)
    for f, p in ((midi(74), -0.3), (midi(78), 0.3), (midi(81), 0), (midi(86), 0)): m.put(chime(f, 3.0), END + 0.05, 0.11, p, 0.7)
    for k in range(8): m.put(pluck(rs, midi([74, 78, 81, 86][k % 4]), 0.8, 0.4), END + 0.8 + k * 0.375, 0.08, 0.4 * (-1) ** k, 0.6)
    m.write("audio/film1.wav", fade_out=1.6)


def film2():
    m = Mix(30.0, 22); rs = m.rs; beat = 0.6
    L = [3.0, 7.8, 12.6, 17.4, 21.6, 26.4]                    # film2.js LEAKS
    # 0–3 hook: receipts falling (paper whooshes), low pulse, riser into leak 1
    for i in range(16): m.put(whoosh(rs, 0.25 + rs.uniform(0, 0.2)), rs.uniform(0, 2.4), 0.18, rs.uniform(-0.8, 0.8))
    d = tt(3.0); m.put(fft_filter(np.sin(2 * np.pi * 61.7 * d), 0, 400) * np.minimum(1, d / 0.8), 0, 0.3)
    for k in range(5): m.put(kick(rs, punch=0.5), 0.6 + k * beat, 0.3)
    m.put(riser(rs, 1.2), 1.8, 0.5)
    # minor-ish tension during the leaks (B minor colour), resolve to D major at the end card
    prog = [[-1, 9, 14, 17, 21], [-5, 11, 14, 18, 23], [2, 9, 14, 16, 18], [-3, 9, 13, 16, 18]]
    groove(m, L[0], L[5], beat, prog, energy=0.9)
    for t0 in L[:5]: m.put(impact(rs, 0.8), t0, 0.35); m.put(whoosh(rs, 0.4), t0 - 0.3, 0.35)
    m.put(blip(660, 0.12, 1.4), L[0] + 2.3, 0.22); m.put(blip(990, 0.12), L[0] + 2.4, 0.15)     # Low flag
    for k in range(18): m.put(click(rs), L[1] + 0.6 + k * 0.09, 0.1, 0.4)                       # odometer
    m.put(blip(440, 0.12, 0.7), L[1] + 1.95, 0.25)                                              # overdue
    for k in range(10): m.put(click(rs), L[2] + 1.0 + k * 0.1, 0.12, -0.3)                      # countdown
    for k in range(6): m.put(hat(rs, 0.12) * 0.6, L[3] + 0.6 + k * 0.4, 0.15, 0.6)             # exhaust puffs
    m.put(thud(rs), L[4] + 0.95, 0.5)                                                           # warranty stamp
    m.put(riser(rs, 1.0), L[5] - 1.0, 0.45)
    m.put(impact(rs, 2.4), L[5], 0.6); m.put(pad([50, 57, 62, 66, 69, 74], 30.0 - L[5], bright=2400, attack=0.08), L[5], 0.3, 0, 0.7)
    for f, p in ((midi(74), -0.3), (midi(78), 0.3), (midi(81), 0)): m.put(chime(f, 2.6), L[5] + 0.9, 0.12, p, 0.7)
    m.write("audio/film2.wav", fade_out=1.0)


def film3():
    m = Mix(20.0, 33); rs = m.rs; beat = 3.4 / 6
    # hook: chat pings stacking up
    m.put(whoosh(rs, 0.3), 0.0, 0.4)
    for i in range(3): m.put(ping(1568 - i * 120), 0.4 + i * 0.28, 0.3, (i - 1) * 0.5)
    for k in range(4): m.put(kick(rs, punch=0.7), 0.1 + k * beat, 0.45)
    m.put(riser(rs, 0.9), 1.5, 0.45)
    groove(m, 2.4, 16.0, beat, PROG, beats_per_bar=6, energy=1.0)
    for i, t0 in enumerate((2.4, 5.8, 9.2, 12.6)): m.put(whoosh(rs, 0.35), t0 - 0.15, 0.45, 0.4 * (-1) ** i)
    m.put(blip(660, 0.12, 1.4), 2.4 + 1.2, 0.22)                                   # Low
    m.put(blip(440, 0.12, 0.7), 5.8 + 0.35, 0.2); m.put(blip(440, 0.12, 0.7), 5.8 + 0.6, 0.2)
    for k in range(9): m.put(click(rs), 9.2 + 0.4 + k * 0.13, 0.13)                # countdown
    m.put(thud(rs), 12.6 + 1.0, 0.35); m.put(ping(1318), 12.6 + 1.5, 0.3)          # fail + issue
    m.put(impact(rs, 2.4), 16.0, 0.6); m.put(pad([50, 57, 62, 66, 69, 74], 4.0, bright=2400, attack=0.08), 16.0, 0.22, 0, 0.7)
    for f, p in ((midi(74), -0.3), (midi(78), 0.3), (midi(81), 0)): m.put(chime(f, 2.6), 16.1, 0.12, p, 0.7)
    m.write("audio/film3.wav", fade_out=1.0)


def film4():
    m = Mix(15.0, 44); rs = m.rs; beat = 0.5
    m.put(whoosh(rs, 0.3), 0.0, 0.35)
    for k in range(4): m.put(kick(rs, punch=0.7), 0.2 + k * beat, 0.4)
    m.put(riser(rs, 0.8), 1.4, 0.4)
    groove(m, 2.2, 11.8, beat, PROG, energy=0.9)
    for i in range(8): m.put(blip(1046 + 120 * i, 0.06), 2.4 + i * 0.08, 0.08, (i % 2) * 0.6 - 0.3, 0.3)   # pins landing
    m.put(blip(660, 0.12, 1.3), 3.8, 0.18)                                                                     # idle label
    m.put(whoosh(rs, 0.4), 6.6, 0.4)
    for k in range(8): m.put(click(rs), 7.1 + k * 0.1, 0.12)                                                   # scores counting
    m.put(impact(rs, 2.4), 11.8, 0.6); m.put(pad([50, 57, 62, 66, 69, 74], 3.2, bright=2400, attack=0.08), 11.8, 0.3, 0, 0.7)
    for f, p in ((midi(74), -0.3), (midi(78), 0.3), (midi(81), 0)): m.put(chime(f, 2.4), 11.9, 0.12, p, 0.7)
    m.write("audio/film4.wav", fade_out=0.9)


if __name__ == "__main__":
    film1(); film2(); film3(); film4()
