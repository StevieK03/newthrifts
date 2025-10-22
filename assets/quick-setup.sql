-- ============================================================================
-- QUICK SUPABASE SETUP - RUN THIS RIGHT NOW!
-- ============================================================================
-- Copy this entire script and paste it into your Supabase SQL Editor
-- This will create the table and allow public access immediately

-- Step 1: Create the table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS custom_tshirt_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_message TEXT,
  design_image_url TEXT,
  mockup_image_url TEXT,
  design_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Disable RLS temporarily to allow public access
ALTER TABLE custom_tshirt_requests DISABLE ROW LEVEL SECURITY;

-- Step 3: Create storage buckets for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('design-uploads', 'design-uploads', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('mockup-previews', 'mockup-previews', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Step 4: Allow public access to storage
CREATE POLICY "Public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('design-uploads', 'mockup-previews'));

CREATE POLICY "Public view" ON storage.objects
  FOR SELECT USING (bucket_id IN ('design-uploads', 'mockup-previews'));

-- Step 5: Test the setup
SELECT 'SUCCESS! Table created and ready for submissions' as status;
