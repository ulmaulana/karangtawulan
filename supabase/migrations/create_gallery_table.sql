-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url TEXT,
  category TEXT,
  credit TEXT,
  taken_at TIMESTAMP,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_published ON gallery_images(published);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images(category);

-- Enable RLS (Row Level Security)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read published images
CREATE POLICY "Public can view published images"
ON gallery_images FOR SELECT
USING (published = true);

-- Policy: Allow service role to do everything
CREATE POLICY "Service role full access"
ON gallery_images FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
