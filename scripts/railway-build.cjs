/* scripts/railway-build.cjs */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(cmd) {
  console.log(`\n$ ${cmd}\n`);
  execSync(cmd, { stdio: "inherit" });
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

// Common “wrong place” we saw earlier
const nestedIndex = path.join(clientDir, "client", "dist", "index.html");

console.log("=== RAILWAY BUILD DEBUG ===");
console.log("cwd:", cwd);
console.log("node:", process.version);

console.log("\nBefore build:");
console.log("client contents:", safeList(clientDir));

run("pnpm -v");
run("pnpm exec vite -v");

console.log("\n== VITE BUILD (root=client, outDir=dist) ==");
run("pnpm exec vite build --root client --outDir dist");

console.log("\nAfter Vite build:");
console.log("client contents:", safeList(clientDir));
console.log("client/dist contents:", safeList(path.join(clientDir, "dist")));
console.log("client/client contents:", safeList(path.join(clientDir, "client")));
console.log("client/client/dist contents:", safeList(path.join(clientDir, "client", "dist")));

console.log("\nIndex checks:");
console.log("expectedIndex:", expectedIndex, "exists:", exists(expectedIndex));
console.log("nestedIndex:", nestedIndex, "exists:", exists(nestedIndex));

if (!exists(expectedIndex)) {
  console.error("\n❌ Build failed: expected client/dist/index.html not found.");
  console.error("If nestedIndex exists, your output is going to client/client/dist instead.");
  process.exit(1);
}

console.log("\n✅ Found client/dist/index.html");

console.log("\n== ESBUILD SERVER ==");
run(
  "pnpm exec esbuild server/railway-server.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/railway-server.js"
);

console.log("\n✅ BUILD DONE");
