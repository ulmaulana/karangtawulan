import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkUsers() {
  try {
    console.log("🔍 Checking users in database...\n");

    const result = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.name,
        u."email_verified",
        u."created_at",
        COUNT(a.id) as account_count
      FROM "user" u
      LEFT JOIN "account" a ON u.id = a."user_id"
      GROUP BY u.id, u.email, u.name, u."email_verified", u."created_at"
      ORDER BY u."created_at" DESC
    `);

    if (result.rows.length === 0) {
      console.log("❌ No users found in database!");
      console.log("\n💡 You need to create a user first. Run: npm run db:seed");
    } else {
      console.log(`✅ Found ${result.rows.length} user(s):\n`);
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email Verified: ${user.email_verified}`);
        console.log(`   Has Password: ${user.account_count > 0 ? "Yes" : "No"}`);
        console.log(`   Created: ${user.created_at}`);
        console.log("");
      });
    }

    // Check sessions
    const sessionsResult = await pool.query(`
      SELECT COUNT(*) as count FROM "session"
    `);
    console.log(`📊 Active sessions: ${sessionsResult.rows[0].count}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await pool.end();
  }
}

checkUsers();
