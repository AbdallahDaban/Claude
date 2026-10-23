"""Build the email-signature GIFs from lossless 25 fps PNG frames of film5.html.
Plays ONCE (no loop) and stops on the logo. The -outlook variant puts the finished logo
first, because Outlook for Windows shows only a GIF's first frame.
usage: python3 make_gif.py <frames_dir> <out_prefix>"""
import glob, os, shutil, subprocess, sys, tempfile
from PIL import Image

frames_dir, out = sys.argv[1], sys.argv[2]
frames = sorted(glob.glob(f"{frames_dir}/*.png"))
# ffmpeg two-pass palette: exact colours for the dominant white background, no dithering noise
VF = "split[a][b];[a]palettegen=max_colors=128:stats_mode=full:reserve_transparent=0[p];[b][p]paletteuse=dither=none"

def gif(seq, target):
    with tempfile.TemporaryDirectory() as tmp:
        for i, f in enumerate(seq): shutil.copy(f, os.path.join(tmp, f"{i:04d}.png"))
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-framerate", "25", "-i", os.path.join(tmp, "%04d.png"),
                        "-vf", VF, "-loop", "-1", target], check=True)   # -loop -1: play once

gif(frames, f"{out}.gif")
gif([frames[-1]] + frames, f"{out}-outlook.gif")
Image.open(frames[-1]).convert("RGB").save(f"{out}-still.png")
print(len(frames), "frames")
