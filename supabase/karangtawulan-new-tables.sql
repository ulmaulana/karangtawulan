-- Create only new tables that don't exist yet
-- Existing tables (ticket_prices, tour_guides, vendors, gallery_images) will be reused

-- Packages table - Paket wisata (100K, 190K, 250K)
CREATE TABLE IF NOT EXISTS "packages" (
	"id" text PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"harga" integer NOT NULL,
	"pax_min" integer NOT NULL,
	"pax_max" integer NOT NULL,
	"durasi_jam" integer NOT NULL,
	"facilities" jsonb NOT NULL,
	"notes" text,
	"dp_percent" integer DEFAULT 50 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Accommodations table - Vila, penginapan, camping
CREATE TABLE IF NOT EXISTS "accommodations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"distance_km" numeric(5, 2),
	"price_from_idr" integer,
	"facilities" jsonb,
	"contact" text,
	"photo_url" text,
	"rules" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Accessories table - Aksesori yang bisa disewa/dibeli
CREATE TABLE IF NOT EXISTS "accessories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price_idr" integer NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"photo_url" text,
	"short_desc" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Nearby places table
CREATE TABLE IF NOT EXISTS "nearby" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"distance_km" numeric(5, 2),
	"uniqueness" text,
	"activities" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Leads table - Capture form submissions
CREATE TABLE IF NOT EXISTS "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"payload" jsonb NOT NULL,
	"user_agent" text,
	"ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
