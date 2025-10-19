import pg from "pg";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { randomUUID } from "crypto";

const { Pool } = pg;
const scryptAsync = promisify(scrypt);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    console.log("👤 Creating admin user...\n");

    const email = "admin@karangtawulan.com";
    const password = "admin123"; // CHANGE THIS!
    const name = "Administrator";

    // Check if user already exists
    const checkUser = await pool.query(
      'SELECT id, email FROM "user" WHERE email = $1',
      [email]
    );

    if (checkUser.rows.length > 0) {
      console.log(`⚠️  User ${email} already exists!`);
      console.log(`   User ID: ${checkUser.rows[0].id}\n`);

      // Check if has credential account
      const checkAccount = await pool.query(
        'SELECT id FROM "account" WHERE "user_id" = $1 AND "provider_id" = \'credential\'',
        [checkUser.rows[0].id]
      );

      if (checkAccount.rows.length > 0) {
        console.log("✅ User already has a password set up.");
        console.log("\n💡 Try logging in with:");
        console.log(`   Email: ${email}`);
        console.log(`   Password: admin123 (if you haven't changed it)\n`);
      } else {
        console.log("⚠️  User exists but has no password!");
        console.log("   Adding credential account...\n");

        const hashedPassword = await hashPassword(password);
        const accountId = randomUUID();

        await pool.query(
          `INSERT INTO "account" (id, "account_id", "provider_id", "user_id", password, "created_at", "updated_at")
           VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())`,
          [accountId, email, checkUser.rows[0].id, hashedPassword]
        );

        console.log("✅ Credential account created!");
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}\n`);
      }

      await pool.end();
      return;
    }

    // Create new user
    const userId = randomUUID();
    const hashedPassword = await hashPassword(password);

    await pool.query(
      `INSERT INTO "user" (id, email, name, "email_verified", "created_at", "updated_at")
       VALUES ($1, $2, $3, true, NOW(), NOW())`,
      [userId, email, name]
    );

    console.log("✅ User created!");
    console.log(`   ID: ${userId}`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${name}\n`);

    // Create credential account
    const accountId = randomUUID();
    await pool.query(
      `INSERT INTO "account" (id, "account_id", "provider_id", "user_id", password, "created_at", "updated_at")
       VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())`,
      [accountId, email, userId, hashedPassword]
    );

    console.log("✅ Credential account created!");
    console.log("\n🎉 Admin user setup complete!\n");
    console.log("📝 Login credentials:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log("\n⚠️  IMPORTANT: Change this password after first login!\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

createAdminUser();
