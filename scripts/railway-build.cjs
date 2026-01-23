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

// What we WANT
const expectedIndex = path.join(clientDir, "dist", "index.html");

console.log("=== RAILWAY BUILD DEBUG ===");
console.log("cwd:", cwd);
console.log("node:", process.version);

console.log("\nBefore build:");
console.log("client contents:", safeList(clientDir));

run("pnpm -v");
run("pnpm exec vite -v");

console.log("\n== CLEAN DIST ==");
try {
  fs.rmSync(path.join(clientDir, "dist"), { recursive: true, force: true });
} catch {}
console.log("client/dist after rm:", safeList(path.join(clientDir, "dist")));

console.log("\n== VITE BUILD (run inside /client) ==");
run("pnpm exec vite build", { cwd: clientDir });

console.log("\nAfter Vite build:");
console.log("client contents:", safeList(clientDir));
console.log("client/dist contents:", safeList(path.join(clientDir, "dist")));

console.log("\nIndex check:");
console.log("expectedIndex:", expectedIndex, "exists:", exists(expectedIndex));

if (!exists(expectedIndex)) {
  console.error("\n❌ Build failed: expected client/dist/index.html not found.");
  process.exit(1);
}

console.log("\n✅ Found client/dist/index.html");

// Marker file to prove build ran
fs.writeFileSync(path.join(clientDir, "dist", "BUILD_MARKER.txt"), new Date().toISOString());

console.log("\n== ESBUILD SERVER ==");
run(
  "pnpm exec esbuild server/railway-server.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/railway-server.js"
);

console.log("\n✅ BUILD DONE");
