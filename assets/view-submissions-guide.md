# 📊 How to View Design Submissions in Supabase

## 🎯 Accessing Your Custom T-Shirt Requests

### **Method 1: Supabase Dashboard (Recommended)**

#### **Step 1: Go to Your Supabase Dashboard**
1. Visit: `https://supabase.com/dashboard`
2. Select your project: `hcoujifzjntwfdnxtnxx`

#### **Step 2: View Requests in Table Editor**
1. **Navigate to**: `Table Editor` (left sidebar)
2. **Select Table**: `custom_tshirt_requests`
3. **View All Submissions**: You'll see all submitted requests in a table format

#### **Step 3: View Individual Request Details**
- **Click on any row** to see the full request details
- **Customer Information**: Name, email, phone, message
- **Design Data**: Position, size, rotation, colors (JSON format)
- **Image URLs**: Links to uploaded designs and generated mockups
- **Status**: Current status (pending, reviewing, approved, etc.)
- **Timestamps**: When the request was created and last updated

### **Method 2: View Mockup Images**

#### **Option A: Direct Image Links**
1. In the table, look for the `mockup_image_url` column
2. **Click the URL** - it will open the generated mockup image in a new tab
3. **Save/Download** the image for your records

#### **Option B: Storage Browser**
1. **Navigate to**: `Storage` (left sidebar)
2. **Select Bucket**: `mockup-previews`
3. **Browse Files**: All generated mockups are stored here
4. **Download**: Click on any file to download it

### **Method 3: Query Requests with SQL**

#### **View All Pending Requests**
```sql
SELECT 
  id,
  customer_name,
  customer_email,
  status,
  created_at,
  design_data,
  mockup_image_url
FROM custom_tshirt_requests 
WHERE status = 'pending'
ORDER BY created_at DESC;
```

#### **View Recent Submissions**
```sql
SELECT 
  id,
  customer_name,
  customer_email,
  phone,
  status,
  created_at,
  design_data->'position' as position_data,
  design_data->'color' as tshirt_color
FROM custom_tshirt_requests 
ORDER BY created_at DESC 
LIMIT 10;
```

#### **View Requests with Images**
```sql
SELECT 
  customer_name,
  customer_email,
  mockup_image_url,
  design_image_url,
  status
FROM custom_tshirt_requests 
WHERE mockup_image_url IS NOT NULL
ORDER BY created_at DESC;
```

## 🖼️ Understanding the Image Data

### **Design Data Structure**
The `design_data` column contains JSON with:
```json
{
  "position": {
    "top": 20,
    "left": 30,
    "width": 40,
    "height": 50,
    "rotation": 0
  },
  "view": "front",
  "color": "#ffffff",
  "canvas_size": { "width": 2000, "height": 2000 },
  "has_uploaded_design": true
}
```

### **Image URLs**
- **`design_image_url`**: Original uploaded design file
- **`mockup_image_url`**: Generated composite showing design on t-shirt

## 📱 Mobile-Friendly Viewing

### **Using Supabase Mobile App**
1. Download the Supabase mobile app
2. Log in with your account
3. Navigate to your project
4. View requests on the go

## 🔄 Managing Request Status

### **Update Request Status**
```sql
UPDATE custom_tshirt_requests 
SET status = 'reviewing', 
    admin_notes = 'Design looks great, proceeding with production',
    updated_at = NOW()
WHERE id = 'c5c9a494-5736-4387-9db0-58f724559de4';
```

### **Available Status Values**
- `pending` - New submission
- `reviewing` - Under review
- `approved` - Approved for production
- `in_progress` - Currently being made
- `completed` - Finished and ready
- `rejected` - Not approved

## 📧 Export Data for Customer Communication

### **Get Customer Contact Info**
```sql
SELECT 
  customer_name,
  customer_email,
  customer_phone,
  status,
  created_at
FROM custom_tshirt_requests 
WHERE status IN ('pending', 'reviewing');
```

### **Generate Customer List**
```sql
SELECT 
  customer_name,
  customer_email,
  COUNT(*) as total_requests
FROM custom_tshirt_requests 
GROUP BY customer_name, customer_email
ORDER BY total_requests DESC;
```

## 🎨 Design Specifications for Production

### **Get Design Details**
```sql
SELECT 
  customer_name,
  design_data->'position' as placement,
  design_data->'color' as tshirt_color,
  design_data->'view' as design_view,
  design_image_url,
  mockup_image_url
FROM custom_tshirt_requests 
WHERE status = 'approved';
```

## 📊 Analytics and Insights

### **Daily Submission Count**
```sql
SELECT 
  DATE(created_at) as submission_date,
  COUNT(*) as total_submissions
FROM custom_tshirt_requests 
GROUP BY DATE(created_at)
ORDER BY submission_date DESC;
```

### **Popular T-Shirt Colors**
```sql
SELECT 
  design_data->>'color' as tshirt_color,
  COUNT(*) as popularity
FROM custom_tshirt_requests 
WHERE design_data->>'color' IS NOT NULL
GROUP BY design_data->>'color'
ORDER BY popularity DESC;
```

## 🚀 Quick Actions

### **Mark Request as Completed**
```sql
UPDATE custom_tshirt_requests 
SET status = 'completed',
    admin_notes = 'Delivered to customer',
    updated_at = NOW()
WHERE id = 'YOUR_REQUEST_ID_HERE';
```

### **Get All Pending Requests for Today**
```sql
SELECT * FROM custom_tshirt_requests 
WHERE status = 'pending' 
AND DATE(created_at) = CURRENT_DATE
ORDER BY created_at ASC;
```

---

## 🎯 Summary

You can view all design submissions in your Supabase dashboard under:
- **Table Editor** → `custom_tshirt_requests`
- **Storage** → `mockup-previews` (for images)
- **SQL Editor** (for custom queries)

Each submission includes:
- ✅ Customer contact information
- ✅ Design specifications and positioning
- ✅ Generated mockup images
- ✅ Original uploaded design files
- ✅ Request status and timestamps
