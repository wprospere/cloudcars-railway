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
  throw new Error("Missing DATABASE_URL / MYSQL_URL / MYSQL_PUBLIC_URL");
}


(async () => {
  console.log("🔌 Connecting to database...");

  const conn = await mysql.createConnection(url);

  console.log("📄 Creating driver_documents table (if missing)...");

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS \`driver_documents\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`driverApplicationId\` int NOT NULL,
      \`type\` enum('LICENSE_FRONT','LICENSE_BACK','BADGE','PLATING','INSURANCE','MOT') NOT NULL,
      \`fileUrl\` text NOT NULL,
      \`status\` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
      \`expiryDate\` date NULL,
      \`rejectionReason\` text NULL,
      \`uploadedAt\` timestamp NOT NULL DEFAULT (now()),
      \`reviewedAt\` timestamp NULL,
      \`reviewedBy\` varchar(320) NULL,
      CONSTRAINT \`driver_documents_id\` PRIMARY KEY(\`id\`)
    );
  `);

  const [rows] = await conn.query(
    "SHOW TABLES LIKE 'driver_documents';"
  );

  console.log("✅ Table check result:", rows);

  await conn.end();
  console.log("🎉 Done");
})().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
