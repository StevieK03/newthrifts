-- ============================================================================
-- Custom T-Shirt Requests System
-- ============================================================================
-- This migration creates tables and functions for handling custom t-shirt design requests
-- Includes storage buckets, email notifications, and admin management

-- ============================================================================
-- 1. STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets for design uploads and mockups
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('design-uploads', 'design-uploads', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('mockup-previews', 'mockup-previews', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. MAIN TABLE: custom_tshirt_requests
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
-- 3. INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_tshirt_requests(status);
CREATE INDEX IF NOT EXISTS idx_custom_requests_created_at ON custom_tshirt_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_requests_email ON custom_tshirt_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_custom_requests_user_id ON custom_tshirt_requests(user_id);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE custom_tshirt_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own requests
CREATE POLICY "Users can insert their own requests" ON custom_tshirt_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can view their own requests
CREATE POLICY "Users can view their own requests" ON custom_tshirt_requests
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can update their own pending requests
CREATE POLICY "Users can update their own pending requests" ON custom_tshirt_requests
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Policy: Service role can do everything (for admin access)
CREATE POLICY "Service role full access" ON custom_tshirt_requests
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- 5. STORAGE POLICIES
-- ============================================================================

-- Policy: Anyone can upload design images
CREATE POLICY "Public uploads for designs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'design-uploads');

-- Policy: Anyone can upload mockup images
CREATE POLICY "Public uploads for mockups" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'mockup-previews');

-- Policy: Anyone can view uploaded files
CREATE POLICY "Public view uploads" ON storage.objects
  FOR SELECT USING (bucket_id IN ('design-uploads', 'mockup-previews'));

-- ============================================================================
-- 6. TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_custom_requests_updated_at
  BEFORE UPDATE ON custom_tshirt_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. EMAIL NOTIFICATION FUNCTION
-- ============================================================================

-- Function to send email notification (using Supabase Edge Functions)
CREATE OR REPLACE FUNCTION notify_custom_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into a notifications table that can be picked up by Edge Functions
  INSERT INTO public.email_notifications (
    type,
    recipient_email,
    subject,
    template_data
  ) VALUES (
    'custom_tshirt_request',
    'shopping@newthrifts.com',
    'New Custom T-Shirt Request #' || NEW.id,
    jsonb_build_object(
      'request_id', NEW.id,
      'customer_name', NEW.customer_name,
      'customer_email', NEW.customer_email,
      'customer_phone', NEW.customer_phone,
      'customer_message', NEW.customer_message,
      'design_image_url', NEW.design_image_url,
      'mockup_image_url', NEW.mockup_image_url,
      'design_data', NEW.design_data,
      'created_at', NEW.created_at
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create email notifications table for Edge Functions
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_data JSONB DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications table
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can manage notifications
CREATE POLICY "Service role manages notifications" ON email_notifications
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger to send email on new request
CREATE TRIGGER trigger_notify_custom_request
  AFTER INSERT ON custom_tshirt_requests
  FOR EACH ROW EXECUTE FUNCTION notify_custom_request();

-- ============================================================================
-- 8. HELPER FUNCTIONS
-- ============================================================================

-- Function to get request statistics
CREATE OR REPLACE FUNCTION get_request_stats()
RETURNS TABLE (
  total_requests BIGINT,
  pending_requests BIGINT,
  completed_requests BIGINT,
  this_month_requests BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_requests,
    COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW())) as this_month_requests
  FROM custom_tshirt_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get requests by status
CREATE OR REPLACE FUNCTION get_requests_by_status(request_status TEXT DEFAULT 'pending')
RETURNS TABLE (
  id UUID,
  customer_name TEXT,
  customer_email TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  design_image_url TEXT,
  mockup_image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ctr.id,
    ctr.customer_name,
    ctr.customer_email,
    ctr.status,
    ctr.created_at,
    ctr.design_image_url,
    ctr.mockup_image_url
  FROM custom_tshirt_requests ctr
  WHERE ctr.status = request_status
  ORDER BY ctr.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. VIEWS FOR ADMIN DASHBOARD
-- ============================================================================

-- View: Recent requests with all details
CREATE OR REPLACE VIEW recent_custom_requests AS
SELECT 
  ctr.*,
  EXTRACT(EPOCH FROM (NOW() - ctr.created_at)) / 3600 as hours_ago,
  CASE 
    WHEN ctr.status = 'pending' AND ctr.created_at < NOW() - INTERVAL '24 hours' THEN 'urgent'
    WHEN ctr.status = 'pending' AND ctr.created_at < NOW() - INTERVAL '12 hours' THEN 'warning'
    ELSE 'normal'
  END as priority
FROM custom_tshirt_requests ctr
ORDER BY 
  CASE 
    WHEN ctr.status = 'pending' THEN 0
    WHEN ctr.status = 'reviewing' THEN 1
    WHEN ctr.status = 'approved' THEN 2
    WHEN ctr.status = 'in_progress' THEN 3
    WHEN ctr.status = 'completed' THEN 4
    WHEN ctr.status = 'rejected' THEN 5
  END,
  ctr.created_at DESC;

-- ============================================================================
-- 10. SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- Insert sample request for testing (uncomment if needed)
/*
INSERT INTO custom_tshirt_requests (
  customer_email,
  customer_name,
  customer_phone,
  customer_message,
  design_image_url,
  mockup_image_url,
  design_data,
  status
) VALUES (
  'test@example.com',
  'John Doe',
  '+1-555-0123',
  'I need a custom t-shirt with my company logo',
  'https://example.com/design.png',
  'https://example.com/mockup.png',
  '{"color": "black", "size": "L", "position": {"x": 50, "y": 30}, "rotation": 0}',
  'pending'
);
*/

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Custom T-Shirt Requests system created successfully!';
  RAISE NOTICE '📧 Email notifications will be sent to: shopping@newthrifts.com';
  RAISE NOTICE '🗄️ Storage buckets created: design-uploads, mockup-previews';
  RAISE NOTICE '📊 Use get_request_stats() function to view statistics';
  RAISE NOTICE '👀 Use recent_custom_requests view for admin dashboard';
END $$;
