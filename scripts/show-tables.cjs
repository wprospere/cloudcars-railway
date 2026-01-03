require("dotenv").config();
const mysql = require("mysql2/promise");

(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Missing DATABASE_URL");

  const c = await mysql.createConnection(url);
  const [rows] = await c.query("SHOW TABLES;");
  console.table(rows);
  await c.end();
})().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
