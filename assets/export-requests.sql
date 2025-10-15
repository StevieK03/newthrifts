-- ============================================================================
-- EXPORT CUSTOM T-SHIRT REQUESTS - DOWNLOAD ALL DATA
-- ============================================================================
-- Run this query in Supabase SQL Editor to get all request data for download

-- ============================================================================
-- COMPLETE EXPORT QUERY
-- ============================================================================
-- This query exports all request data in a format suitable for CSV/Excel

SELECT 
  -- Request Identification
  id as "Request ID",
  created_at as "Submission Date",
  updated_at as "Last Updated",
  status as "Status",
  admin_notes as "Admin Notes",
  
  -- Customer Information
  customer_name as "Customer Name",
  customer_email as "Email Address",
  customer_phone as "Phone Number",
  customer_message as "Special Instructions",
  
  -- Design Information
  design_data->>'view' as "T-Shirt View",
  design_data->>'color' as "T-Shirt Color",
  design_data->'position'->>'top' as "Design Top Position (%)",
  design_data->'position'->>'left' as "Design Left Position (%)",
  design_data->'position'->>'width' as "Design Width (%)",
  design_data->'position'->>'height' as "Design Height (%)",
  design_data->'position'->>'rotation' as "Design Rotation (degrees)",
  design_data->>'has_uploaded_design' as "Has Uploaded Design",
  
  -- File URLs
  design_image_url as "Original Design URL",
  mockup_image_url as "Generated Mockup URL",
  
  -- Formatted JSON for advanced users
  design_data as "Complete Design Data (JSON)"
  
FROM custom_tshirt_requests 
ORDER BY created_at DESC;

-- ============================================================================
-- CUSTOMER CONTACT LIST EXPORT
-- ============================================================================
-- Use this query to get just customer contact information

SELECT 
  customer_name as "Name",
  customer_email as "Email",
  customer_phone as "Phone",
  COUNT(*) as "Total Requests",
  MAX(created_at) as "Latest Request Date",
  STRING_AGG(DISTINCT status, ', ') as "All Statuses"
FROM custom_tshirt_requests 
GROUP BY customer_name, customer_email, customer_phone
ORDER BY "Total Requests" DESC, "Latest Request Date" DESC;

-- ============================================================================
-- PENDING REQUESTS EXPORT
-- ============================================================================
-- Use this query to get only pending requests that need attention

SELECT 
  id as "Request ID",
  customer_name as "Customer Name",
  customer_email as "Email",
  customer_phone as "Phone",
  created_at as "Submission Date",
  customer_message as "Special Instructions",
  design_data->>'color' as "T-Shirt Color",
  design_data->>'view' as "T-Shirt View",
  design_image_url as "Design Image",
  mockup_image_url as "Mockup Image"
FROM custom_tshirt_requests 
WHERE status = 'pending'
ORDER BY created_at ASC;

-- ============================================================================
-- PRODUCTION-READY REQUESTS
-- ============================================================================
-- Use this query to get approved requests ready for production

SELECT 
  id as "Request ID",
  customer_name as "Customer Name",
  customer_email as "Email",
  customer_phone as "Phone",
  created_at as "Order Date",
  design_data->>'color' as "T-Shirt Color",
  design_data->>'view' as "Design View",
  design_data->'position' as "Design Placement",
  design_image_url as "Design File",
  mockup_image_url as "Production Mockup",
  customer_message as "Production Notes"
FROM custom_tshirt_requests 
WHERE status IN ('approved', 'in_progress')
ORDER BY created_at ASC;

-- ============================================================================
-- ANALYTICS EXPORT
-- ============================================================================
-- Use this query for business analytics and reporting

SELECT 
  DATE(created_at) as "Date",
  COUNT(*) as "Total Requests",
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as "Pending",
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as "Approved",
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as "Completed",
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as "Rejected",
  COUNT(DISTINCT customer_email) as "Unique Customers"
FROM custom_tshirt_requests 
GROUP BY DATE(created_at)
ORDER BY "Date" DESC;

-- ============================================================================
-- DESIGN SPECIFICATIONS EXPORT
-- ============================================================================
-- Use this query to get detailed design specifications for production

SELECT 
  id as "Request ID",
  customer_name as "Customer",
  design_data->>'color' as "T-Shirt Color",
  design_data->>'view' as "Design View",
  design_data->'position'->>'top' as "Top Position (%)",
  design_data->'position'->>'left' as "Left Position (%)",
  design_data->'position'->>'width' as "Width (%)",
  design_data->'position'->>'height' as "Height (%)",
  design_data->'position'->>'rotation' as "Rotation (deg)",
  design_data->'canvas_size'->>'width' as "Canvas Width (px)",
  design_data->'canvas_size'->>'height' as "Canvas Height (px)",
  design_image_url as "Design File URL",
  mockup_image_url as "Mockup URL"
FROM custom_tshirt_requests 
WHERE status IN ('approved', 'in_progress')
ORDER BY created_at ASC;

-- ============================================================================
-- CUSTOMER COMMUNICATION EXPORT
-- ============================================================================
-- Use this query to get customer data for email campaigns

SELECT 
  customer_name as "Name",
  customer_email as "Email",
  customer_phone as "Phone",
  id as "Request ID",
  status as "Current Status",
  created_at as "Submission Date",
  CASE 
    WHEN status = 'pending' THEN 'Thank you for your submission! We are reviewing your design.'
    WHEN status = 'reviewing' THEN 'Your design is under review. We will contact you soon.'
    WHEN status = 'approved' THEN 'Great news! Your design has been approved and is in production.'
    WHEN status = 'completed' THEN 'Your custom t-shirt is ready!'
    ELSE 'Thank you for your business!'
  END as "Suggested Message"
FROM custom_tshirt_requests 
WHERE status IN ('pending', 'reviewing', 'approved', 'completed')
ORDER BY created_at DESC;
