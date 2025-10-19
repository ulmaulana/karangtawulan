// scripts/apply-karangtawulan-schema.js
import fs from "fs";
import { Client } from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum di-set");
  process.exit(1);
}

const sql = fs.readFileSync("supabase/karangtawulan-new-tables.sql", "utf8");
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    await client.query("begin");
    await client.query(sql);
    await client.query("commit");

    console.log("✓ Karangtawulan schema applied successfully");
    console.log("New tables created: packages, accommodations, accessories, nearby, leads");
  } catch (e) {
    await client.query("rollback").catch(() => {});
    console.error("✗ Failed to apply schema");
    console.error(e.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
