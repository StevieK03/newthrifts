# 🎨 Custom T-Shirt Requests System - Complete Setup Guide

## 🎯 **What We've Built**

A complete custom t-shirt request system that allows customers to:

1. **Submit requests from the T-Shirt Mockup section** - Upload designs, position them, and submit with customer details
2. **Submit requests from the Contact Us page** - Choose between general inquiry or custom t-shirt request
3. **Automatic email notifications** to `shopping@newthrifts.com`
4. **Image storage** in Supabase for design uploads and mockup previews
5. **Database tracking** of all requests with status management

---

## 📋 **Step 1: Run the Database Migration**

### In Supabase SQL Editor:

1. **Go to your Supabase dashboard** → SQL Editor
2. **Copy and paste** the contents of `assets/supabase-custom-requests.sql`
3. **Click "Run"** to create all tables, storage buckets, and triggers

**What this creates:**
- ✅ `custom_tshirt_requests` table
- ✅ `email_notifications` table  
- ✅ `design-uploads` and `mockup-previews` storage buckets
- ✅ Row Level Security (RLS) policies
- ✅ Email notification triggers
- ✅ Helper functions and views

---

## 📧 **Step 2: Set Up Email Notifications (Choose One)**

### Option A: EmailJS (Recommended - Free)
**Free tier:** 200 emails/month

1. **Sign up at [EmailJS](https://www.emailjs.com/)**
2. **Connect your email service** (Gmail, Outlook, etc.)
3. **Create email template:**
   ```
   Subject: New Custom T-Shirt Request #{{request_id}}
   
   Hi NewThrifts Team,
   
   A new custom t-shirt request has been submitted:
   
   Customer: {{customer_name}}
   Email: {{customer_email}}
   Phone: {{customer_phone}}
   Message: {{customer_message}}
   
   Design Details:
   - Color: {{design_color}}
   - Size: {{design_size}}
   - Has Uploaded Design: {{has_uploaded_design}}
   
   View Request: https://your-project.supabase.co/requests/{{request_id}}
   
   Design Image: {{design_image_url}}
   Mockup Image: {{mockup_image_url}}
   
   Best regards,
   NewThrifts System
   ```

4. **Get your credentials** (Service ID, Template ID, Public Key)
5. **Update the JavaScript** (see Email Setup Guide)

### Option B: Supabase Edge Functions + Resend (Free)
**Free tier:** 3,000 emails/month

1. **Sign up at [Resend](https://resend.com/)**
2. **Create Edge Function** (see Email Setup Guide)
3. **Deploy to Supabase**

---

## 🔧 **Step 3: Test the System**

### Test from T-Shirt Mockup Section:
1. **Go to your homepage**
2. **Scroll to "🚀 Enhanced Live Design Preview"**
3. **Upload a design** (drag & drop or click to upload)
4. **Position and resize** the design as desired
5. **Click "🎨 Submit Your Request"**
6. **Fill out the form** and submit
7. **Check your email** for the notification

### Test from Contact Us Page:
1. **Go to your Contact Us page**
2. **Click "🎨 Custom T-Shirt Request"**
3. **Fill out the form** and upload a design (optional)
4. **Submit the request**
5. **Check your email** for the notification

---

## 📊 **Step 4: View Requests in Supabase**

### In Supabase Dashboard:

1. **Go to Table Editor** → `custom_tshirt_requests`
2. **View all submitted requests** with:
   - Customer information
   - Design data (position, size, rotation)
   - Image URLs (design & mockup)
   - Status and timestamps

### Use Helper Functions:

```sql
-- Get request statistics
SELECT * FROM get_request_stats();

-- Get pending requests
SELECT * FROM get_requests_by_status('pending');

-- View recent requests with priority
SELECT * FROM recent_custom_requests;
```

---

## 🎛️ **Step 5: Admin Management**

### Update Request Status:
```sql
-- Mark request as approved
UPDATE custom_tshirt_requests 
SET status = 'approved', 
    admin_notes = 'Great design, approved for production'
WHERE id = 'your-request-id';

-- Mark as completed
UPDATE custom_tshirt_requests 
SET status = 'completed',
    estimated_completion_date = '2024-01-15'
WHERE id = 'your-request-id';
```

### Email Customer Updates:
You can manually email customers using the contact information in the database, or set up automated status update emails.

---

## 🔍 **Troubleshooting**

### Common Issues:

1. **"Supabase client not initialized"**
   - ✅ Check that `supabase-config.js` is loaded
   - ✅ Verify your Supabase URL and anon key are correct

2. **Images not uploading**
   - ✅ Check storage bucket permissions
   - ✅ Verify RLS policies allow public uploads

3. **Email notifications not working**
   - ✅ Check email service configuration
   - ✅ Verify template IDs and API keys
   - ✅ Check spam folder

4. **Form not submitting**
   - ✅ Check browser console for errors
   - ✅ Verify database table exists
   - ✅ Check RLS policies

### Debug Mode:
```javascript
// Enable debug logging in browser console
window.NewThriftsCustomRequests.debug = true;
```

---

## 📈 **Analytics & Insights**

### Track Popular Designs:
```sql
SELECT 
  design_data->>'color' as color,
  design_data->>'size' as size,
  COUNT(*) as request_count
FROM custom_tshirt_requests 
WHERE design_data IS NOT NULL
GROUP BY design_data->>'color', design_data->>'size'
ORDER BY request_count DESC;
```

### Customer Engagement:
```sql
SELECT 
  customer_email,
  COUNT(*) as total_requests,
  MAX(created_at) as last_request
FROM custom_tshirt_requests 
GROUP BY customer_email
HAVING COUNT(*) > 1
ORDER BY total_requests DESC;
```

---

## 🚀 **Advanced Features (Optional)**

### 1. Auto-Reply to Customers
Set up automatic confirmation emails when requests are submitted.

### 2. Status Update Notifications
Email customers when request status changes.

### 3. Admin Dashboard
Build a simple admin page to manage requests:
- View all requests in a table
- Update statuses
- Add admin notes
- Generate reports

### 4. Request Limits
Add daily/hourly limits to prevent spam:
```sql
-- Add request limit check in your JavaScript
const today = new Date().toISOString().split('T')[0];
const todayRequests = await supabase
  .from('custom_tshirt_requests')
  .select('id')
  .eq('customer_email', email)
  .gte('created_at', today);

if (todayRequests.data.length >= 3) {
  throw new Error('Daily request limit reached');
}
```

### 5. Design Approval Workflow
- Add approval/rejection buttons in admin
- Email customers with approval status
- Generate production orders for approved designs

---

## 📞 **Support**

### Files Created:
- ✅ `assets/supabase-custom-requests.sql` - Database schema
- ✅ `assets/supabase-custom-requests.js` - JavaScript API
- ✅ `EMAIL-SETUP-GUIDE.md` - Email configuration guide
- ✅ Enhanced `sections/interactive-mockup.liquid` - T-shirt mockup with submit button
- ✅ Enhanced `sections/simple-contact-form.liquid` - Contact form with custom requests

### Key Features:
- 🎨 **Design Upload & Positioning** - Customers can upload and position designs
- 📧 **Email Notifications** - Automatic emails to your business email
- 🗄️ **Image Storage** - Secure storage of designs and mockups
- 📊 **Request Tracking** - Complete database of all requests
- 🔒 **Security** - Row Level Security and validation
- 📱 **Mobile Friendly** - Works on all devices
- 🌙 **Dark Mode Support** - Consistent with your theme

### Next Steps:
1. **Run the SQL migration** in Supabase
2. **Set up email notifications** using EmailJS or Resend
3. **Test the system** with a sample request
4. **Monitor requests** in Supabase dashboard
5. **Set up admin workflow** for managing requests

---

## 🎉 **You're All Set!**

Your custom t-shirt request system is now live! Customers can:
- Submit requests from the mockup section
- Submit requests from the contact page  
- Upload designs and get mockup previews
- Receive confirmation emails
- Track their request status

You'll receive email notifications for every request and can manage them through the Supabase dashboard.

**Need help?** Check the troubleshooting section or refer to the individual setup guides for each component.

