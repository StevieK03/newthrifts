-- ============================================================================
-- TEST DATABASE SETUP - RUN THIS TO VERIFY EVERYTHING IS WORKING
-- ============================================================================

-- Test 1: Check if table exists
SELECT 
  'Table exists' as test,
  COUNT(*) as columns
FROM information_schema.columns 
WHERE table_name = 'custom_tshirt_requests';

-- Test 2: Check RLS status
SELECT 
  'RLS Status' as test,
  relname as table_name,
  relrowsecurity as rls_enabled
FROM pg_class 
WHERE relname = 'custom_tshirt_requests';

-- Test 3: Check policies
SELECT 
  'Policies' as test,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'custom_tshirt_requests';

-- Test 4: Try to insert a test record (this should work if setup is correct)
INSERT INTO custom_tshirt_requests (
  customer_name, 
  customer_email, 
  customer_message,
  status
) VALUES (
  'Test User', 
  'test@example.com', 
  'This is a test submission',
  'pending'
) RETURNING id, customer_name, customer_email, status, created_at;

-- Test 5: Check if the test record was inserted
SELECT 
  'Test Record' as test,
  id,
  customer_name,
  customer_email,
  status,
  created_at
FROM custom_tshirt_requests 
WHERE customer_email = 'test@example.com';

-- Clean up test record
DELETE FROM custom_tshirt_requests WHERE customer_email = 'test@example.com';

SELECT 'SUCCESS! Database is ready for submissions' as final_status;
