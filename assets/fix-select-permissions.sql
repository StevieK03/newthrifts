-- ============================================================================
-- FIX SELECT PERMISSIONS - RUN THIS NOW!
-- ============================================================================
-- This will ensure you can read/view the data in the table

-- Step 1: Make sure RLS is completely disabled
ALTER TABLE custom_tshirt_requests DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant full access to the public role (for anonymous users)
GRANT ALL ON custom_tshirt_requests TO anon;
GRANT ALL ON custom_tshirt_requests TO authenticated;

-- Step 3: Grant usage on the schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 4: Test that SELECT works
SELECT 
  customer_name,
  customer_email,
  status,
  created_at
FROM custom_tshirt_requests 
ORDER BY created_at DESC 
LIMIT 5;

SELECT 'SUCCESS! SELECT permissions are now working' as status;
