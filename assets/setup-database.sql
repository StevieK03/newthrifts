-- ============================================================================
-- QUICK DATABASE SETUP FOR NEWTHRIFTS CUSTOM T-SHIRT REQUESTS
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to create the required table
-- Copy and paste this entire script into the SQL Editor and click "Run"

-- ============================================================================
-- 1. CREATE THE MAIN TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS custom_tshirt_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Customer Information
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional if logged in
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_message TEXT,
  
  -- Design Data
  design_image_url TEXT, -- Original uploaded design
  mockup_image_url TEXT, -- Generated composite mockup
  design_data JSONB DEFAULT '{}', -- Position, size, rotation, color, etc.
  
  -- Request Management
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'in_progress', 'completed', 'rejected')),
  admin_notes TEXT,
  estimated_completion_date DATE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (customer_phone IS NULL OR customer_phone ~* '^[\+]?[0-9\s\-\(\)]{10,}$')
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_tshirt_requests(status);
CREATE INDEX IF NOT EXISTS idx_custom_requests_created_at ON custom_tshirt_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_requests_email ON custom_tshirt_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_custom_requests_user_id ON custom_tshirt_requests(user_id);

-- ============================================================================
-- 3. SET UP ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS
ALTER TABLE custom_tshirt_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert requests (for public submissions)
CREATE POLICY "Allow public insert" ON custom_tshirt_requests
  FOR INSERT WITH CHECK (true);

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own requests" ON custom_tshirt_requests
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Admins can view all requests (you'll need to set up admin role)
CREATE POLICY "Admins can view all" ON custom_tshirt_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================================================
-- 4. CREATE STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets for design uploads and mockups
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('design-uploads', 'design-uploads', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('mockup-previews', 'mockup-previews', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. SET UP STORAGE POLICIES
-- ============================================================================

-- Policy: Anyone can upload design files
CREATE POLICY "Public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'design-uploads');

CREATE POLICY "Public uploads mockups" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'mockup-previews');

-- Policy: Anyone can view uploaded files
CREATE POLICY "Public view" ON storage.objects
  FOR SELECT USING (bucket_id IN ('design-uploads', 'mockup-previews'));

-- ============================================================================
-- 6. VERIFICATION QUERY
-- ============================================================================

-- Run this to verify everything is set up correctly:
SELECT 
  'Table created successfully' as status,
  COUNT(*) as existing_records
FROM custom_tshirt_requests;

-- Check buckets
SELECT 
  'Storage buckets created' as status,
  name,
  public,
  file_size_limit
FROM storage.buckets 
WHERE id IN ('design-uploads', 'mockup-previews');

-- ============================================================================
-- SETUP COMPLETE! 
-- ============================================================================
-- Your database is now ready to receive custom t-shirt requests.
-- You can view requests in the Supabase dashboard under the "Table Editor" tab.
