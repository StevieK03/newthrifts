# 📧 EmailJS Setup Guide - Browser-Compatible Email with Attachments

## 🎯 **Problem Solved**
The Resend API has CORS restrictions that prevent direct browser calls. EmailJS is designed for browser use and supports file attachments.

## 🔧 **Quick Setup**

### **Step 1: Create EmailJS Account**
1. **Go to [EmailJS.com](https://www.emailjs.com)**
2. **Sign up for free account**
3. **Verify your email**

### **Step 2: Create Email Service**
1. **Go to "Email Services"** in dashboard
2. **Click "Add New Service"**
3. **Choose your email provider** (Gmail recommended)
4. **Connect your email account** (shopping@newthrifts.com)
5. **Get your Service ID** (e.g., `service_abc123`)

### **Step 3: Create Email Template**
1. **Go to "Email Templates"** in dashboard
2. **Click "Create New Template"**
3. **Use this template:**

```
Subject: 🎨 Custom T-Shirt Request from {{customer_name}}

New Custom T-Shirt Request from {{customer_name}}

Customer Details:
- Name: {{customer_name}}
- Email: {{customer_email}}
- Phone: {{customer_phone}}
- T-Shirt Size: {{tshirt_size}}

Message:
{{customer_message}}

Design Specifications:
- Position: {{design_position}}
- Size: {{design_size}}
- Rotation: {{design_rotation}}
- View: {{design_view}}
- T-Shirt Color: {{tshirt_color}}

Attachments:
- Original Design Image: {{design_image}}
- Generated Mockup Preview: {{mockup_image}}

Submitted: {{submission_date}}
Request ID: {{request_id}}
```

4. **Get your Template ID** (e.g., `template_xyz789`)

### **Step 4: Get User ID**
1. **Go to "Account"** in dashboard
2. **Copy your User ID** (e.g., `user_123456`)

### **Step 5: Update Code**
**File:** `newthrifts2/layout/theme.liquid`
**Line:** ~208

**Replace:**
```javascript
emailjs.init('YOUR_EMAILJS_USER_ID');
```

**With:**
```javascript
emailjs.init('YOUR_ACTUAL_USER_ID');
```

**File:** `newthrifts2/sections/interactive-mockup.liquid`
**Lines:** ~3224-3227

**Replace:**
```javascript
const result = await emailjs.send(
  'service_newthrifts', // Replace with your EmailJS service ID
  'template_tshirt_request', // Replace with your EmailJS template ID
  templateParams
);
```

**With:**
```javascript
const result = await emailjs.send(
  'YOUR_SERVICE_ID', // Your actual service ID
  'YOUR_TEMPLATE_ID', // Your actual template ID
  templateParams
);
```

## 📋 **Example Configuration**

### **Your EmailJS Settings:**
- **User ID**: `user_abc123def456`
- **Service ID**: `service_gmail_newthrifts`
- **Template ID**: `template_tshirt_request`
- **Email**: `shopping@newthrifts.com`

### **Updated Code:**
```javascript
// In theme.liquid
emailjs.init('user_abc123def456');

// In interactive-mockup.liquid
const result = await emailjs.send(
  'service_gmail_newthrifts',
  'template_tshirt_request',
  templateParams
);
```

## 🚀 **Test the Setup**

1. **Upload a design** in your t-shirt customizer
2. **Fill out the form** with test data
3. **Click "Submit Request"**
4. **Check console** for: `✅ EmailJS email sent successfully`
5. **Check** `shopping@newthrifts.com` for the email

## 💡 **Benefits of EmailJS**

- ✅ **Browser-compatible** - No CORS issues
- ✅ **File attachments** - Supports base64 images
- ✅ **Free tier** - 200 emails/month
- ✅ **Easy setup** - No backend required
- ✅ **Multiple providers** - Gmail, Outlook, etc.

## 🛠️ **Troubleshooting**

### **EmailJS not loaded:**
- Check if EmailJS script is loaded in browser
- Verify User ID is correct

### **Service not found:**
- Check Service ID is correct
- Verify email service is connected

### **Template not found:**
- Check Template ID is correct
- Verify template exists in dashboard

### **Images not showing:**
- EmailJS supports base64 images
- Check if images are being converted properly

## 📊 **Free Tier Limits**

- **200 emails/month** (free)
- **File attachments** supported
- **Multiple templates** supported
- **API access** included

## ✅ **Current Status**

**✅ Ready to use!** The system is configured for EmailJS with file attachments.

**Just need to:**
1. Set up EmailJS account
2. Create email service and template
3. Update the User ID, Service ID, and Template ID in the code

**Your custom t-shirt requests will now send emails with image attachments via EmailJS!** 🎉📧
