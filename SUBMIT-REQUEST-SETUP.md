# 🚀 Submit Request Setup Guide

This guide will help you set up the email functionality for the Submit Request feature in your Custom T-Shirt Designer.

## 📧 What Gets Sent

When a customer submits a design request, an email is automatically sent to **shopping@newthrifts.com** containing:

- Customer Information (Name, Email, Phone, T-Shirt Size)
- Design Details (Text, Color, Font, Size, Rotation)
- T-Shirt Color (Black or White)
- Special Instructions/Message
- **Design Preview Image** (captured screenshot of the mockup)
- Submission Date & Time

---

## ⚙️ Setup Instructions (EmailJS - FREE)

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Click **"Sign Up"** and create a free account
3. Verify your email address

**Free Tier Includes:**
- ✅ 200 emails per month
- ✅ File attachments support
- ✅ Email templates
- ✅ Multiple email services

---

### Step 2: Connect Your Email Service

1. In EmailJS dashboard, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (Recommended - easiest setup)
   - Outlook
   - Yahoo
   - Or any SMTP service
4. Click **"Connect Account"** and follow the authorization steps
5. **Copy your Service ID** (e.g., `service_abc1234`)

---

### Step 3: Create Email Template

1. Go to **"Email Templates"** in the EmailJS dashboard
2. Click **"Create New Template"**
3. Name it: `"T-Shirt Design Request"`
4. Use this template content:

```
Subject: 🎨 New T-Shirt Design Request from {{customer_name}}

Hello NewThrifts Team,

You have received a new custom t-shirt design request!

════════════════════════════════════════
CUSTOMER INFORMATION
════════════════════════════════════════
Name: {{customer_name}}
Email: {{customer_email}}
Phone: {{customer_phone}}
T-Shirt Size: {{tshirt_size}}

════════════════════════════════════════
DESIGN DETAILS
════════════════════════════════════════
T-Shirt Color: {{tshirt_color}}
Design Text: {{design_text}}
Text Color: {{text_color}}
Font Family: {{font_family}}
Font Size: {{font_size}}
Rotation: {{rotation}}
Has Uploaded Image: {{has_uploaded_image}}

════════════════════════════════════════
SPECIAL INSTRUCTIONS
════════════════════════════════════════
{{customer_message}}

════════════════════════════════════════
DESIGN PREVIEW
════════════════════════════════════════
<img src="{{design_preview}}" alt="Design Preview" style="max-width: 600px; border: 2px solid #ddd; border-radius: 8px;">

════════════════════════════════════════
Submitted: {{submission_date}}

Please reply to the customer at: {{customer_email}}
```

5. **Copy your Template ID** (e.g., `template_xyz7890`)

---

### Step 4: Get Your User ID

1. Go to **"Account"** in the EmailJS dashboard
2. Under **"API Keys"**, copy your **Public Key (User ID)**
3. It looks like: `user_abcd1234efgh5678`

---

### Step 5: Update Your Code

Open `newthrifts2/sections/custom-tshirt-studio.liquid` and find these three lines:

```javascript
// Line ~1714
emailjs.init('YOUR_EMAILJS_USER_ID'); // ⚠️ REPLACE THIS

// Lines ~1767-1768
const result = await emailjs.send(
    'YOUR_SERVICE_ID',  // ⚠️ REPLACE WITH YOUR EMAILJS SERVICE ID
    'YOUR_TEMPLATE_ID', // ⚠️ REPLACE WITH YOUR EMAILJS TEMPLATE ID
    emailData
);
```

**Replace with your actual values:**

```javascript
// Replace with your User ID from Step 4
emailjs.init('user_abcd1234efgh5678');

// Replace with your Service ID (Step 2) and Template ID (Step 3)
const result = await emailjs.send(
    'service_abc1234',  // Your Service ID
    'template_xyz7890', // Your Template ID
    emailData
);
```

---

### Step 6: Test It!

1. Save your changes
2. Deploy to Shopify: `shopify theme push --allow-live`
3. Go to your designer page
4. Create a test design
5. Click **"🚀 Submit Your Design Request"**
6. Fill in the customer form
7. Click **"Submit Request"**
8. Check `shopping@newthrifts.com` for the email!

---

## 🎯 Email Template Variables Reference

Use these variables in your EmailJS template:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{customer_name}}` | Customer's full name | John Doe |
| `{{customer_email}}` | Customer's email | john@example.com |
| `{{customer_phone}}` | Phone number | (555) 123-4567 |
| `{{tshirt_size}}` | Selected t-shirt size | L |
| `{{tshirt_color}}` | T-shirt color | White |
| `{{customer_message}}` | Special instructions | Please use eco-friendly ink |
| `{{design_text}}` | Text on design | YOUR DESIGN HERE |
| `{{text_color}}` | Color hex code | #000000 |
| `{{font_family}}` | Font name | Arial |
| `{{font_size}}` | Size percentage | 100% |
| `{{rotation}}` | Rotation angle | 0° |
| `{{has_uploaded_image}}` | Image uploaded? | Yes/No |
| `{{design_preview}}` | Base64 image data | (Full mockup image) |
| `{{submission_date}}` | Submission timestamp | 10/21/2025, 3:45:00 PM |

---

## 🔧 Troubleshooting

### ❌ Email not sending?

1. **Check browser console** for errors
2. Verify all three IDs are correct (User ID, Service ID, Template ID)
3. Make sure you connected your email service in EmailJS
4. Check your EmailJS quota (200 emails/month on free plan)

### ❌ Design preview not showing?

The preview is embedded as a base64 image. Make sure your email client supports HTML emails and images.

### ❌ Getting "401 Unauthorized" error?

Your User ID is incorrect. Double-check it in your EmailJS Account settings.

### ❌ Getting "404 Template not found" error?

Your Template ID or Service ID is incorrect. Verify them in EmailJS dashboard.

---

## 🎨 Customization

### Change recipient email:

In `custom-tshirt-studio.liquid`, find:

```javascript
to_email: 'shopping@newthrifts.com',
```

Replace with your desired email address.

### Add CC or BCC:

In your EmailJS template settings, you can add CC/BCC recipients.

### Customize the form:

Edit the form fields in the `customerInfoForm` section of `custom-tshirt-studio.liquid`.

---

## 💡 Tips

- **Test with different designs** to ensure all cases work
- **Set up email filters** in shopping@newthrifts.com to organize requests
- **Monitor your EmailJS quota** - upgrade if you need more than 200/month
- **Save the template IDs** somewhere safe for future reference

---

## 📞 Need Help?

- EmailJS Documentation: [https://www.emailjs.com/docs](https://www.emailjs.com/docs)
- EmailJS Support: [https://www.emailjs.com/support](https://www.emailjs.com/support)

---

**You're all set! 🎉**

Your customers can now submit their custom t-shirt designs directly to your email!

