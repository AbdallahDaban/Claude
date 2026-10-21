#!/bin/bash
# Render all six films (EN + AR) with their scores.
set -e
cd "$(dirname "$0")"
mkdir -p out
for n in 1 2 3; do
  node render.mjs "film$n.html" "out/fleetana-film$n-en.mp4" "audio/film$n.wav"
  node render.mjs "film$n.html?lang=ar" "out/fleetana-film$n-ar.mp4" "audio/film$n.wav"
done
ls -la out
