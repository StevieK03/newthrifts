# 📧 Email Setup Guide - Send Images to shopping@newthrifts.com

## 🎯 **What This Does**

When someone clicks "Submit Request", the system will:
1. ✅ **Save the request** to your Supabase database
2. ✅ **Send an email** to `shopping@newthrifts.com` 
3. ✅ **Include image attachments** (original design + mockup)
4. ✅ **Include customer details** and design specifications

## 📧 **Email Content**

The email sent to `shopping@newthrifts.com` includes:

### **Customer Information:**
- Name, Email, Phone
- T-Shirt Size
- Customer Message/Special Instructions

### **Design Specifications:**
- Design Position (top/left percentages)
- Design Size (width/height percentages)
- Rotation angle
- T-Shirt View (front/back/side)
- T-Shirt Color

### **Image Attachments:**
- **Original Design Image** (PNG/JPG/SVG)
- **Generated Mockup Preview** (PNG)

## 🔧 **Setup Options**

### **Option 1: Formspree (Recommended - Easy Setup)**

1. **Go to [Formspree.io](https://formspree.io)**
2. **Create a free account**
3. **Create a new form** for custom t-shirt requests
4. **Get your form ID** (looks like `xpwgqgje`)
5. **Update the form ID** in the code:

```javascript
// In interactive-mockup.liquid, line ~3220
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
```

6. **Configure email settings:**
   - **To Email:** `shopping@newthrifts.com`
   - **Subject:** `Custom T-Shirt Request from [Customer Name]`
   - **Reply-To:** Customer's email address

### **Option 2: EmailJS (More Control)**

1. **Go to [EmailJS.com](https://www.emailjs.com)**
2. **Create a free account**
3. **Connect your email service** (Gmail, Outlook, etc.)
4. **Create email templates**
5. **Get Service ID and Template ID**
6. **Update the code** in `email-with-images.js`:

```javascript
const result = await emailjs.send(
  'YOUR_SERVICE_ID', // Replace with your service ID
  'YOUR_TEMPLATE_ID', // Replace with your template ID
  templateParams
);
```

### **Option 3: Resend API (Professional)**

1. **Go to [Resend.com](https://resend.com)**
2. **Create an account**
3. **Get your API key**
4. **Update the code** in `email-with-images.js`:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_RESEND_API_KEY', // Replace with your API key
}
```

### **Option 4: Custom Webhook**

1. **Create a webhook endpoint** on your server
2. **Update the webhook URL** in `email-with-images.js`:

```javascript
const response = await fetch('YOUR_WEBHOOK_URL', { // Replace with your webhook URL
```

## 🚀 **Quick Start (Formspree)**

**Fastest way to get started:**

1. **Sign up at Formspree.io** (free)
2. **Create a new form**
3. **Copy your form ID** (e.g., `xpwgqgje`)
4. **Replace in the code:**
   ```javascript
   // Line ~3220 in interactive-mockup.liquid
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```
5. **Test by submitting a request**

## 📋 **Email Template Example**

The system automatically creates emails like this:

```
Subject: 🎨 Custom T-Shirt Request from John Doe

New Custom T-Shirt Request from John Doe

Customer Details:
- Name: John Doe
- Email: john@example.com
- Phone: (555) 123-4567
- T-Shirt Size: Large

Message:
Please make this design bold and colorful!

Design Specifications:
- Position: Top 25%, Left 50%
- Size: 40% × 35%
- Rotation: 0°
- View: Front
- T-Shirt Color: Navy Blue

Attachments:
- Original Design Image
- Generated Mockup Preview

Submitted: 1/15/2024, 2:30:45 PM
Request ID: Pending
```

## 🔍 **Testing**

1. **Upload a design** in your t-shirt customizer
2. **Fill out the form** with test data
3. **Click "Submit Request"**
4. **Check `shopping@newthrifts.com`** for the email
5. **Verify images are attached**

## 🛠️ **Troubleshooting**

### **Email Not Sending:**
- Check console for error messages
- Verify form ID is correct
- Test with a simple form submission first

### **Images Not Attaching:**
- Check if images are being generated properly
- Verify base64 conversion is working
- Test with smaller images first

### **Wrong Email Address:**
- Update `shopping@newthrifts.com` in the code
- Look for `to: 'shopping@newthrifts.com'` in `createEmailContent()`

## 📊 **Success Messages**

Users will see:
- ✅ **"Email sent to our team"** - Email with images sent successfully
- ⚠️ **"Email notification failed"** - Database saved, but email failed
- ❌ **"Failed to submit request"** - Both database and email failed

## 🎯 **Current Status**

**✅ Ready to use!** The system is already configured to send emails to `shopping@newthrifts.com` with image attachments.

**Just need to:**
1. Set up Formspree account (free)
2. Update the form ID in the code
3. Test with a real submission

**Your custom t-shirt requests will now automatically email the design images to your team!** 🎉📧
