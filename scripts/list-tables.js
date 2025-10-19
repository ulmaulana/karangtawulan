// scripts/list-tables.js
import { Client } from "pg";
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const q = `
  select table_name
  from information_schema.tables
  where table_schema='public'
  order by 1
`;
(async () => {
  await client.connect();
  const { rows } = await client.query(q);
  console.log(rows.map(r => r.table_name).join("\n"));
  await client.end();
})();
