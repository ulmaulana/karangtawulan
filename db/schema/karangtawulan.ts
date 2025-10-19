import { pgTable, text, timestamp, boolean, integer, numeric, jsonb } from "drizzle-orm/pg-core";

// NEW TABLES - These will be created

// Packages table - Paket wisata (100K, 190K, 250K)
export const packages = pgTable("packages", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    nama: text("nama").notNull(),
    harga: integer("harga").notNull(),
    paxMin: integer("pax_min").notNull(),
    paxMax: integer("pax_max").notNull(),
    durasiJam: integer("durasi_jam").notNull(),
    facilities: jsonb("facilities").$type<string[]>().notNull(),
    notes: text("notes"),
    dpPercent: integer("dp_percent").notNull().default(50),
    published: boolean("published").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Accommodations table - Vila, penginapan, camping
export const accommodations = pgTable("accommodations", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    type: text("type").notNull(), // vila, penginapan, camping
    distanceKm: numeric("distance_km", { precision: 5, scale: 2 }),
    priceFromIdr: integer("price_from_idr"),
    facilities: jsonb("facilities").$type<string[]>(),
    contact: text("contact"),
    photoUrl: text("photo_url"),
    rules: text("rules"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Accessories table - Aksesori yang bisa disewa/dibeli
export const accessories = pgTable("accessories", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    priceIdr: integer("price_idr").notNull(),
    stock: integer("stock").notNull().default(0),
    photoUrl: text("photo_url"),
    shortDesc: text("short_desc"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Nearby places table
export const nearby = pgTable("nearby", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    distanceKm: numeric("distance_km", { precision: 5, scale: 2 }),
    uniqueness: text("uniqueness"),
    activities: text("activities"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Leads table - Capture form submissions
export const leads = pgTable("leads", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    kind: text("kind").notNull(), // booking, akomodasi, aksesori, kontak
    payload: jsonb("payload").notNull(),
    userAgent: text("user_agent"),
    ip: text("ip"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// EXISTING TABLES - Just type definitions for existing tables in database
// These will not be created, only used for type safety

// Using existing ticket_prices table
export const ticketPrices = pgTable("ticket_prices", {
    id: text("id").primaryKey(),
    category: text("category").notNull(),
    priceIdr: integer("price_idr"),
    note: text("note"),
    published: boolean("published"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

// Using existing tour_guides table
export const tourGuides = pgTable("tour_guides", {
    id: text("id").primaryKey(),
    name: text("name"),
    experienceYears: integer("experience_years"),
    area: text("area"),
    rateNote: text("rate_note"),
    whatsapp: text("whatsapp"),
    languages: jsonb("languages").$type<string[]>(),
    photoUrl: text("photo_url"),
    published: boolean("published"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

// Using existing vendors table
export const vendors = pgTable("vendors", {
    id: text("id").primaryKey(),
    name: text("name"),
    owner: text("owner"),
    highlightMenu: text("highlight_menu"),
    priceRange: text("price_range"),
    locationShort: text("location_short"),
    contact: text("contact"),
    published: boolean("published"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});

// Using existing gallery_images table
export const galleryImages = pgTable("gallery_images", {
    id: text("id").primaryKey(),
    url: text("url"),
    category: text("category"),
    credit: text("credit"),
    takenAt: timestamp("taken_at"),
    published: boolean("published"),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
});
