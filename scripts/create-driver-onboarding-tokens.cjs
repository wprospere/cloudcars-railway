require("dotenv").config();
const mysql = require("mysql2/promise");

const url =
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  process.env.MYSQL_PUBLIC_URL ||
  process.env.MYSQLDATABASE_URL ||
  process.env.DATABASE_PRIVATE_URL;

console.log("🔎 Using DB url:", url?.replace(/:\/\/.*?:.*?@/, "://***:***@"));

if (!url) {
  console.error("❌ Error: Missing DATABASE_URL");
  process.exit(1);
}

(async () => {
  const conn = await mysql.createConnection(url);

  console.log("🔑 Creating driver_onboarding_tokens table (if missing)...");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS \`driver_onboarding_tokens\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`driverApplicationId\` int NOT NULL,
      \`tokenHash\` varchar(128) NOT NULL,
      \`expiresAt\` timestamp NOT NULL,
      \`usedAt\` timestamp NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT (now()),
      CONSTRAINT \`driver_onboarding_tokens_id\` PRIMARY KEY (\`id\`)
    );
  `);

  const [rows] = await conn.query("SHOW TABLES LIKE 'driver_onboarding_tokens';");
  console.log("✅ Table check result:", rows);

  await conn.end();
  console.log("🎉 Done");
})().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
