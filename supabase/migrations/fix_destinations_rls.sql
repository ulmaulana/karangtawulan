-- Fix RLS policies for destinations table
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can manage destinations" ON public.destinations;

-- Policy: Allow service role (API) to manage all destinations
CREATE POLICY "Service role can manage destinations"
  ON public.destinations
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Allow anon to insert/update/delete (for admin panel)
CREATE POLICY "Anon can manage destinations"
  ON public.destinations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Keep the public read policy for published destinations
-- (Already exists, no need to recreate)
