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
  throw new Error("Missing DATABASE_URL / MYSQL_URL");
}

(async () => {
  console.log("🔌 Connecting to database...");
  const conn = await mysql.createConnection(url);

  console.log("🚗 Creating driver_vehicles table (if missing)...");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS \`driver_vehicles\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`driverApplicationId\` int NOT NULL,

      \`registration\` varchar(32) NOT NULL,
      \`make\` varchar(64) NOT NULL,
      \`model\` varchar(64) NOT NULL,
      \`colour\` varchar(32) NOT NULL,

      \`year\` varchar(8),
      \`plateNumber\` varchar(64),
      \`capacity\` varchar(8),

      \`createdAt\` timestamp NOT NULL DEFAULT (now()),
      \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT \`driver_vehicles_id\` PRIMARY KEY (\`id\`)
    );
  `);

  const [rows] = await conn.query(
    "SHOW TABLES LIKE 'driver_vehicles';"
  );

  console.log("✅ Table check result:", rows);

  await conn.end();
  console.log("🎉 Done");
})().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
