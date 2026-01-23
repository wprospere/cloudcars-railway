/* scripts/railway-build.cjs */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(cmd, opts = {}) {
  console.log(`\n$ ${cmd}${opts.cwd ? `  (cwd=${opts.cwd})` : ""}\n`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

function safeList(p) {
  try {
    return fs.readdirSync(p);
  } catch {
    return null;
  }
}

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

const cwd = process.cwd();
const clientDir = path.join(cwd, "client");

// Vite (per your logs) outputs to /app/dist/public
const expectedIndex = path.join(cwd, "dist", "public", "index.html");
const expectedOutDir = path.join(cwd, "dist", "public");

console.log("=== RAILWAY BUILD DEBUG ===");
console.log("cwd:", cwd);
console.log("node:", process.version);

console.log("\nBefore build:");
console.log("client contents:", safeList(clientDir));
console.log("dist contents:", safeList(path.join(cwd, "dist")));
console.log("dist/public contents:", safeList(expectedOutDir));

run("pnpm -v");
run("pnpm exec vite -v");

// Clean previous output so we know what this build produced
console.log("\n== CLEAN dist/public ==");
try {
  fs.rmSync(expectedOutDir, { recursive: true, force: true });
} catch {}
console.log("dist/public after rm:", safeList(expectedOutDir));

console.log("\n== VITE BUILD (run inside /client) ==");
run("pnpm exec vite build", { cwd: clientDir });

console.log("\nAfter Vite build:");
console.log("dist contents:", safeList(path.join(cwd, "dist")));
console.log("dist/public contents:", safeList(expectedOutDir));
console.log("dist/public/assets contents:", safeList(path.join(expectedOutDir, "assets")));

console.log("\nIndex check:");
console.log("expectedIndex:", expectedIndex, "exists:", exists(expectedIndex));

if (!exists(expectedIndex)) {
  console.error("\n❌ Build failed: expected dist/public/index.html not found.");
  process.exit(1);
}

console.log("\n✅ Found dist/public/index.html");

// Marker file to prove build ran
try {
  fs.writeFileSync(path.join(expectedOutDir, "BUILD_MARKER.txt"), new Date().toISOString());
} catch {}

console.log("\n== ESBUILD SERVER ==");
run(
  "pnpm exec esbuild server/railway-server.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/railway-server.js"
);

console.log("\n✅ BUILD DONE");
