#!/bin/bash
# Instagram reels (always light): Film 2 vertical cut + the live-map reel, EN + AR.
set -e
cd "$(dirname "$0")"
mkdir -p out
for lang in en ar; do
  node render.mjs "film2.html?format=vertical&theme=light&lang=$lang" "out/fleetana-reel-leaks-$lang-light.mp4" audio/film2.wav
  node render.mjs "film4.html?theme=light&lang=$lang" "out/fleetana-reel-map-$lang-light.mp4" audio/film4.wav
done
