import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkAuth() {
  try {
    console.log("🔐 Checking authentication setup...\n");

    // Check account table for password
    const accountResult = await pool.query(`
      SELECT
        a.id,
        a."account_id",
        a."provider_id",
        a."user_id",
        CASE WHEN a.password IS NOT NULL THEN 'SET' ELSE 'NOT SET' END as password_status,
        LENGTH(a.password) as password_length,
        u.email
      FROM "account" a
      JOIN "user" u ON a."user_id" = u.id
      WHERE a."provider_id" = 'credential'
    `);

    if (accountResult.rows.length === 0) {
      console.log("❌ No credential accounts found!");
      console.log("💡 This means no users have passwords set up for email/password login.");
    } else {
      console.log("✅ Credential accounts:\n");
      accountResult.rows.forEach((acc, index) => {
        console.log(`${index + 1}. ${acc.email}`);
        console.log(`   Password: ${acc.password_status}`);
        console.log(`   Password Length: ${acc.password_length || "N/A"}`);
        console.log(`   Provider: ${acc.provider_id}`);
        console.log("");
      });
    }

    // Check sessions
    const sessionsResult = await pool.query(`
      SELECT
        s.id,
        s."user_id",
        s."expires_at",
        s."created_at",
        u.email,
        CASE WHEN s."expires_at" > NOW() THEN 'ACTIVE' ELSE 'EXPIRED' END as status
      FROM "session" s
      JOIN "user" u ON s."user_id" = u.id
      ORDER BY s."created_at" DESC
      LIMIT 5
    `);

    console.log("\n📊 Recent sessions:\n");
    if (sessionsResult.rows.length === 0) {
      console.log("No sessions found.");
    } else {
      sessionsResult.rows.forEach((sess, index) => {
        console.log(`${index + 1}. ${sess.email}`);
        console.log(`   Status: ${sess.status}`);
        console.log(`   Expires: ${sess.expires_at}`);
        console.log(`   Created: ${sess.created_at}`);
        console.log("");
      });
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

checkAuth();
