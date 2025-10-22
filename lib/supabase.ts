import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our tables
export type Package = {
  id: string;
  nama: string;
  harga: number;
  pax_min: number;
  pax_max: number;
  durasi_jam: number;
  facilities: string[];
  notes?: string;
  dp_percent: number;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TicketPrice = {
  id: string;
  category: string;
  price_idr?: number;
  note?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TourGuide = {
  id: string;
  name?: string;
  experience_years?: number;
  area?: string;
  rate_note?: string;
  whatsapp?: string;
  languages?: string[];
  photo_url?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Accommodation = {
  id: string;
  name: string;
  type: string;
  distance_km?: string;
  price_from_idr?: number;
  facilities?: string[];
  contact?: string;
  photo_url?: string;
  rules?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Vendor = {
  id: string;
  name?: string;
  owner?: string;
  highlight_menu?: string;
  price_range?: string;
  location_short?: string;
  contact?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Accessory = {
  id: string;
  name: string;
  price_idr: number;
  stock: number;
  photo_url?: string;
  short_desc?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  id: string;
  url?: string;
  category?: string;
  credit?: string;
  taken_at?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Nearby = {
  id: string;
  name: string;
  distance_km?: string;
  uniqueness?: string;
  activities?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  kind: 'booking' | 'akomodasi' | 'aksesori' | 'kontak';
  payload: Record<string, unknown>;
  user_agent?: string;
  ip?: string;
  created_at: string;
};

export type Destination = {
  id: string;
  name: string;
  description: string;
  distance_from_karangtawulan?: string;
  travel_time?: string;
  highlights?: string[];
  photo_url?: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
