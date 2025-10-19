CREATE TABLE "accessories" (
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
--> statement-breakpoint
CREATE TABLE "accommodations" (
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
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"category" text NOT NULL,
	"credit" text,
	"taken_at" timestamp,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guides" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"experience_years" integer NOT NULL,
	"area" text NOT NULL,
	"rate_note" text,
	"whatsapp" text,
	"languages" jsonb NOT NULL,
	"photo_url" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"payload" jsonb NOT NULL,
	"user_agent" text,
	"ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nearby" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"distance_km" numeric(5, 2),
	"uniqueness" text,
	"activities" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packages" (
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
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"price_idr" integer NOT NULL,
	"note" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"owner" text,
	"highlight_menu" text,
	"price_range" text,
	"location_short" text,
	"contact" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
