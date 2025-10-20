# 📧 Open Source Email Solutions with File Attachments

## 🎯 **Problem Solved**
Formspree's free plan doesn't support file attachments, but these open-source alternatives do!

## 🔧 **Available Solutions**

### **Option 1: Resend (Recommended - Easiest)**
- ✅ **Free tier**: 3,000 emails/month
- ✅ **File attachments supported**
- ✅ **Simple API setup**
- ✅ **Professional email service**

### **Option 2: EmailJS**
- ✅ **Free tier**: 200 emails/month
- ✅ **File attachments supported**
- ✅ **No backend required**
- ✅ **Multiple email providers**

### **Option 3: Custom Webhook**
- ✅ **Complete control**
- ✅ **Free to host**
- ✅ **Any email service**
- ✅ **Unlimited emails**

---

## 🚀 **Option 1: Resend Setup (Recommended)**

### **Step 1: Sign Up**
1. **Go to [Resend.com](https://resend.com)**
2. **Sign up for free account**
3. **Verify your email**

### **Step 2: Get API Key**
1. **Go to API Keys** in dashboard
2. **Create new API key**
3. **Copy the key** (starts with `re_`)

### **Step 3: Update Code**
**File:** `newthrifts2/sections/interactive-mockup.liquid`
**Line:** ~3367

**Replace:**
```javascript
'Authorization': 'Bearer YOUR_RESEND_API_KEY',
```

**With:**
```javascript
'Authorization': 'Bearer re_123456789_abcdefghijklmnopqrstuvwxyz',
```

### **Step 4: Test**
1. **Upload a design**
2. **Submit a request**
3. **Check `shopping@newthrifts.com`**

---

## 📧 **Option 2: EmailJS Setup**

### **Step 1: Sign Up**
1. **Go to [EmailJS.com](https://www.emailjs.com)**
2. **Create free account**
3. **Verify email**

### **Step 2: Create Email Service**
1. **Go to Email Services**
2. **Add Gmail/Outlook/etc.**
3. **Connect your email account**
4. **Get Service ID** (e.g., `service_abc123`)

### **Step 3: Create Email Template**
1. **Go to Email Templates**
2. **Create new template**
3. **Use these variables:**
   ```
   {{to_email}} - shopping@newthrifts.com
   {{customer_name}} - Customer name
   {{customer_email}} - Customer email
   {{design_image}} - Base64 design image
   {{mockup_image}} - Base64 mockup image
   ```
4. **Get Template ID** (e.g., `template_xyz789`)

### **Step 4: Get User ID**
1. **Go to Account**
2. **Copy User ID** (e.g., `user_123456`)

### **Step 5: Update Code**
**File:** `newthrifts2/sections/interactive-mockup.liquid`
**Add this line at the top:**
```javascript
// Initialize EmailJS
emailjs.init('YOUR_USER_ID');
```

**Update the sendViaEmailJS function:**
```javascript
const result = await emailjs.send(
  'YOUR_SERVICE_ID', // Replace with your service ID
  'YOUR_TEMPLATE_ID', // Replace with your template ID
  templateParams
);
```

---

## 🔗 **Option 3: Custom Webhook Setup**

### **Step 1: Choose Backend**
- **Node.js + Express** (easiest)
- **Python + Flask** (simple)
- **PHP** (traditional)
- **Serverless** (Vercel/Netlify)

### **Step 2: Create Backend**
**Example Node.js code:**
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

app.post('/webhook/email', async (req, res) => {
  try {
    const { to, subject, customer, design, attachments } = req.body;
    
    // Create email attachments
    const emailAttachments = [];
    
    if (attachments.design_image) {
      emailAttachments.push({
        filename: `design_${customer.name}_${Date.now()}.png`,
        content: attachments.design_image.split(',')[1],
        encoding: 'base64'
      });
    }
    
    if (attachments.mockup_image) {
      emailAttachments.push({
        filename: `mockup_${customer.name}_${Date.now()}.png`,
        content: attachments.mockup_image.split(',')[1],
        encoding: 'base64'
      });
    }
    
    // Send email
    await transporter.sendMail({
      from: 'noreply@newthrifts.com',
      to: to,
      subject: subject,
      html: `
        <h2>Custom T-Shirt Request</h2>
        <p><strong>Customer:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <p><strong>Message:</strong> ${customer.message}</p>
        <p><strong>Design:</strong> ${design.view} - ${design.color}</p>
      `,
      attachments: emailAttachments
    });
    
    res.json({ success: true, message: 'Email sent successfully' });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### **Step 3: Deploy Backend**
- **Vercel** (serverless)
- **Netlify** (serverless)
- **Heroku** (traditional)
- **DigitalOcean** (VPS)

### **Step 4: Update Code**
**File:** `newthrifts2/sections/interactive-mockup.liquid`
**Line:** ~3364

**Replace:**
```javascript
const response = await fetch('YOUR_WEBHOOK_URL', {
```

**With:**
```javascript
const response = await fetch('https://your-app.vercel.app/webhook/email', {
```

---

## 🎯 **Quick Start (Resend)**

**Fastest way to get started:**

1. **Sign up at [Resend.com](https://resend.com)**
2. **Get your API key** (starts with `re_`)
3. **Update line ~3367** in `interactive-mockup.liquid`:
   ```javascript
   'Authorization': 'Bearer YOUR_RESEND_API_KEY',
   ```
4. **Test by submitting a request**

---

## 📊 **Comparison**

| Service | Free Tier | Attachments | Setup Difficulty | Reliability |
|---------|-----------|-------------|------------------|-------------|
| **Resend** | 3,000/month | ✅ | Easy | High |
| **EmailJS** | 200/month | ✅ | Medium | High |
| **Webhook** | Unlimited | ✅ | Hard | Medium |
| **Formspree** | 50/month | ❌ | Easy | High |

---

## 🔍 **Testing**

### **Test Email Sending:**
1. **Upload a design** in your t-shirt customizer
2. **Fill out the form** with test data
3. **Click "Submit Request"**
4. **Check console** for success/error messages
5. **Check `shopping@newthrifts.com`** for the email

### **Test Image Attachments:**
1. **Verify images are attached** to the email
2. **Check image quality** and format
3. **Test with different image types** (PNG, JPG, SVG)

---

## 🛠️ **Troubleshooting**

### **Email Not Sending:**
- Check API key is correct
- Verify email service is connected
- Check console for error messages
- Test with simple email first

### **Images Not Attaching:**
- Check base64 conversion is working
- Verify image URLs are accessible
- Test with smaller images first
- Check email service attachment limits

### **Wrong Email Address:**
- Update `shopping@newthrifts.com` in the code
- Look for `to: ['shopping@newthrifts.com']` in email functions

---

## ✅ **Current Status**

**✅ Ready to use!** The system now supports multiple email services with file attachments.

**Choose your preferred option:**
1. **Resend** (recommended for ease)
2. **EmailJS** (good for multiple providers)
3. **Custom Webhook** (maximum control)

**Your custom t-shirt requests will now automatically email the design images to your team!** 🎉📧
