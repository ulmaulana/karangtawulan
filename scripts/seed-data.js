// scripts/seed-data.js
import { Client } from "pg";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum di-set");
  process.exit(1);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const seedData = async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    // Seed Packages
    console.log("\nSeeding packages...");
    await client.query(`
      INSERT INTO packages (id, nama, harga, pax_min, pax_max, durasi_jam, facilities, notes, dp_percent, published, sort_order)
      VALUES
        ('pkg-1', 'Paket 100K', 100000, 1, 10, 3, '["Tiket masuk", "Guide lokal", "Spot foto terbaik", "Dokumentasi HP"]', 'Cocok untuk solo traveler atau grup kecil', 50, true, 1),
        ('pkg-2', 'Paket 190K', 190000, 5, 20, 5, '["Tiket masuk", "Guide berpengalaman", "Spot foto premium", "Dokumentasi DSLR", "Snack & minuman", "Merchandise"]', 'Paket paling populer! Include dokumentasi profesional', 50, true, 2),
        ('pkg-3', 'Paket 250K', 250000, 10, 30, 6, '["Tiket masuk", "Guide profesional", "All spot foto", "Dokumentasi DSLR + Drone", "Makan siang", "Snack & minuman", "Merchandise eksklusif", "Akses VIP"]', 'Paket premium dengan fasilitas lengkap', 50, true, 3)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("✓ Packages seeded");

    // Seed Accommodations
    console.log("\nSeeding accommodations...");
    await client.query(`
      INSERT INTO accommodations (id, name, type, distance_km, price_from_idr, facilities, contact, published)
      VALUES
        ('acc-1', 'Vila Karangtawulan', 'vila', 0.5, 1500000, '["6 kamar tidur", "2 kamar mandi", "Ruang tamu luas", "Dapur lengkap", "View pantai", "Parkir luas"]', '62822187388810', true),
        ('acc-2', 'Penginapan Sunset View', 'penginapan', 1.2, 300000, '["Kamar AC", "WiFi", "TV", "Kamar mandi dalam"]', '62822187388811', true),
        ('acc-3', 'Homestay Pantai Indah', 'penginapan', 2.0, 250000, '["Kamar bersih", "Kasur nyaman", "Sarapan", "Dekat pantai"]', '62822187388812', true),
        ('acc-4', 'Camping Ground Karangtawulan', 'camping', 0.2, 50000, '["Area camping luas", "Toilet bersih", "Mushola", "Warung", "Listrik", "Api unggun"]', '62822187388813', true)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("✓ Accommodations seeded");

    // Seed Accessories
    console.log("\nSeeding accessories...");
    await client.query(`
      INSERT INTO accessories (id, name, price_idr, stock, short_desc, published)
      VALUES
        ('acs-1', 'Tenda Camping 4 Orang', 75000, 10, 'Tenda berkualitas untuk 4 orang', true),
        ('acs-2', 'Matras Camping', 15000, 20, 'Matras empuk dan nyaman', true),
        ('acs-3', 'Sleeping Bag', 25000, 15, 'Sleeping bag hangat', true),
        ('acs-4', 'Pelampung', 20000, 25, 'Pelampung aman untuk berenang', true),
        ('acs-5', 'Kamera Underwater', 100000, 5, 'Sewa kamera underwater untuk foto di air', true),
        ('acs-6', 'Payung Pantai', 30000, 12, 'Payung besar untuk teduh', true),
        ('acs-7', 'Kursi Lipat', 15000, 20, 'Kursi lipat praktis', true),
        ('acs-8', 'Cooler Box', 35000, 8, 'Cooler box untuk minum dingin', true)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("✓ Accessories seeded");

    // Seed Nearby Places
    console.log("\nSeeding nearby places...");
    await client.query(`
      INSERT INTO nearby (id, name, distance_km, uniqueness, activities, published)
      VALUES
        ('nrb-1', 'Pantai Cimedang', 5.5, 'Pantai dengan pasir hitam dan ombak tenang', 'Berenang, surfing pemula, kuliner seafood', true),
        ('nrb-2', 'Kampung Naga', 15.0, 'Kampung adat yang masih mempertahankan tradisi Sunda', 'Wisata budaya, fotografi, edukasi', true),
        ('nrb-3', 'Situ Gede', 8.3, 'Danau dengan pemandangan pegunungan yang indah', 'Berperahu, memancing, piknik', true)
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("✓ Nearby places seeded");

    console.log("\n✅ All seed data inserted successfully!");
    console.log("\nNote: Some tables use existing data (ticket_prices, tour_guides, vendors, gallery_images).");
    console.log("You may need to add data to those tables manually via Supabase dashboard or direct SQL.");

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
};

seedData();
