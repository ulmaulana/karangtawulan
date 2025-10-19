// scripts/apply-schema.js
import fs from "fs";
import { Client } from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum di-set");
  process.exit(1);
}

const sql = fs.readFileSync("supabase/schema.sql", "utf8");
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await client.connect();
    await client.query("begin");
    await client.query(sql);      // jalankan seluruh schema sekaligus
    await client.query("commit");
    console.log("Schema terpasang");
  } catch (e) {
    await client.query("rollback").catch(() => {});
    console.error("Gagal memasang schema");
    console.error(e.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
