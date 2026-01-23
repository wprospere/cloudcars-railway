#!/bin/sh
set -eu

echo "RUN BUILD $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "PWD=$(pwd)"
echo "NODE=$(node -v)"
echo "PNPM=$(pnpm -v)"

rm -rf dist

echo "== VITE BUILD =="
pnpm exec vite build --outDir dist/client

if [ ! -f dist/client/index.html ]; then
  echo "MISSING dist/client/index.html"
  exit 1
fi
echo "FOUND dist/client/index.html"

echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" > dist/BUILD_MARKER.txt

echo "== ESBUILD SERVER =="
pnpm exec esbuild server/railway-server.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/railway-server.js

echo "BUILD DONE"
