-- Create destinations table
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  distance_from_karangtawulan VARCHAR(50),
  travel_time VARCHAR(50),
  highlights TEXT[],
  photo_url TEXT,
  published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for performance
CREATE INDEX idx_destinations_published ON public.destinations(published);
CREATE INDEX idx_destinations_sort_order ON public.destinations(sort_order);

-- Enable RLS
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published destinations
CREATE POLICY "Public can view published destinations"
  ON public.destinations
  FOR SELECT
  USING (published = true);

-- Policy: Allow authenticated users to manage all destinations (for admin)
CREATE POLICY "Authenticated users can manage destinations"
  ON public.destinations
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO public.destinations (name, description, distance_from_karangtawulan, travel_time, highlights, published, sort_order)
VALUES 
  (
    'Sungai Cimedang',
    'Sungai Cimedang merupakan destinasi wisata alam yang menawarkan suasana segar dengan aliran sungai jernih. Cocok untuk aktivitas piknik, berenang, atau sekadar bersantai menikmati pemandangan alam.',
    '5 km',
    '15 menit',
    ARRAY['Berenang di sungai jernih', 'Piknik di tepi sungai', 'Foto spot alami', 'Menikmati udara segar pegunungan'],
    true,
    1
  ),
  (
    'Pantai Madasari',
    'Pantai Madasari adalah destinasi pantai yang terkenal dengan pemandangan sunset yang memukau. Pantai ini memiliki pasir hitam vulkanik dan ombak yang cocok untuk berselancar.',
    '12 km',
    '25 menit',
    ARRAY['Sunset yang memukau', 'Berselancar', 'Pantai pasir hitam', 'Kuliner seafood segar', 'Camping di pinggir pantai'],
    true,
    2
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_destinations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER set_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION update_destinations_updated_at();

COMMENT ON TABLE public.destinations IS 'Stores destination information for nearby tourist spots';
