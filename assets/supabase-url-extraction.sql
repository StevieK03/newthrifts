-- ============================================================================
-- EXTRACT MOCKUP URLs FROM SUPABASE SQL EDITOR
-- ============================================================================
-- Run these queries directly in your Supabase SQL Editor to extract URLs

-- ============================================================================
-- 1. EXTRACT ALL MOCKUP URLs (Plain List)
-- ============================================================================
-- This query returns just the mockup URLs, one per line

SELECT mockup_image_url 
FROM custom_tshirt_requests 
WHERE mockup_image_url IS NOT NULL 
ORDER BY created_at DESC;

-- ============================================================================
-- 2. EXTRACT URLs WITH CUSTOMER INFO
-- ============================================================================
-- This query returns URLs with customer details

SELECT 
  customer_name as "Customer Name",
  customer_email as "Email",
  mockup_image_url as "Mockup URL",
  created_at as "Submitted Date",
  status as "Status"
FROM custom_tshirt_requests 
WHERE mockup_image_url IS NOT NULL 
ORDER BY created_at DESC;

-- ============================================================================
-- 3. EXTRACT URLs AS CSV FORMAT
-- ============================================================================
-- This query is perfect for exporting as CSV

SELECT 
  id as "Request ID",
  customer_name as "Customer Name",
  customer_email as "Email",
  status as "Status",
  created_at as "Submitted Date",
  mockup_image_url as "Mockup URL",
  design_image_url as "Design URL"
FROM custom_tshirt_requests 
WHERE mockup_image_url IS NOT NULL 
ORDER BY created_at DESC;

-- ============================================================================
-- 4. EXTRACT PENDING REQUEST URLs
-- ============================================================================
-- This query gets only pending requests with mockup URLs

SELECT 
  customer_name as "Customer Name",
  customer_email as "Email",
  mockup_image_url as "Mockup URL",
  created_at as "Submitted Date"
FROM custom_tshirt_requests 
WHERE status = 'pending' 
  AND mockup_image_url IS NOT NULL 
ORDER BY created_at ASC;

-- ============================================================================
-- 5. EXTRACT URLs WITH REQUEST ID
-- ============================================================================
-- This query includes the request ID for easy reference

SELECT 
  id as "Request ID",
  LEFT(id, 8) as "Short ID",
  customer_name as "Customer Name",
  mockup_image_url as "Mockup URL"
FROM custom_tshirt_requests 
WHERE mockup_image_url IS NOT NULL 
ORDER BY created_at DESC;

-- ============================================================================
-- 6. EXTRACT URLs FOR SPECIFIC DATE RANGE
-- ============================================================================
-- This query gets URLs from a specific date range (last 7 days)

SELECT 
  customer_name as "Customer Name",
  mockup_image_url as "Mockup URL",
  created_at as "Submitted Date"
FROM custom_tshirt_requests 
WHERE mockup_image_url IS NOT NULL 
  AND created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- ============================================================================
-- 7. EXTRACT URLs BY STATUS
-- ============================================================================
-- This query groups URLs by request status

SELECT 
  status as "Status",
  COUNT(*) as "Count",
  STRING_AGG(mockup_image_url, '|') as "Mockup URLs"
FROM custom_tshirt_requests 
WHERE mockup_image_url IS NOT NULL 
GROUP BY status
ORDER BY COUNT(*) DESC;

-- ============================================================================
-- 8. EXTRACT URLs WITH DESIGN SPECIFICATIONS
-- ============================================================================
-- This query includes design data for production

SELECT 
  customer_name as "Customer Name",
  mockup_image_url as "Mockup URL",
  design_data->>'color' as "T-Shirt Color",
  design_data->>'view' as "Design View",
  design_data->'position' as "Design Position",
  created_at as "Submitted Date"
FROM custom_tshirt_requests 
WHERE mockup_image_url IS NOT NULL 
ORDER BY created_at DESC;

-- ============================================================================
-- 9. EXPORT FOR CUSTOMER COMMUNICATION
-- ============================================================================
-- This query is perfect for emailing customers their mockups

SELECT 
  customer_name as "Name",
  customer_email as "Email",
  mockup_image_url as "Mockup URL",
  status as "Status",
  CASE 
    WHEN status = 'pending' THEN 'Your design is being reviewed'
    WHEN status = 'approved' THEN 'Your design has been approved!'
    WHEN status = 'completed' THEN 'Your custom t-shirt is ready!'
    ELSE 'Thank you for your submission'
  END as "Message"
FROM custom_tshirt_requests 
WHERE mockup_image_url IS NOT NULL 
ORDER BY created_at DESC;

-- ============================================================================
-- 10. QUICK URL COUNT
-- ============================================================================
-- This query shows how many requests have mockup URLs

SELECT 
  COUNT(*) as "Total Requests",
  COUNT(mockup_image_url) as "Requests with Mockups",
  COUNT(*) - COUNT(mockup_image_url) as "Requests without Mockups"
FROM custom_tshirt_requests;

-- ============================================================================
-- HOW TO USE THESE QUERIES
-- ============================================================================
-- 1. Go to your Supabase SQL Editor
-- 2. Copy and paste any query above
-- 3. Click "Run" to execute
-- 4. Click "Export" button (top right) to download results
-- 5. Choose CSV or JSON format

-- TIP: Use query #1 for plain URL list, query #3 for complete data export
