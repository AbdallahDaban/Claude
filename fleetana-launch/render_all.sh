#!/bin/bash
# Render all films: 3 films × EN/AR × dark/light.   ./render_all.sh [dark|light|all]
set -e
cd "$(dirname "$0")"
mkdir -p out
themes=${1:-all}; [ "$themes" = all ] && themes="dark light"
for theme in $themes; do
  for n in 1 2 3; do
    for lang in en ar; do
      suffix=""; [ "$theme" = light ] && suffix="-light"
      node render.mjs "film$n.html?lang=$lang&theme=$theme" "out/fleetana-film$n-$lang$suffix.mp4" "audio/film$n.wav"
    done
  done
done
ls -la out
