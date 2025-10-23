# 📧 Email Notification Setup Guide

This guide explains how to set up **free** email notifications for custom t-shirt requests.

## 🆓 Free Email Options

### Option 1: EmailJS (Recommended - Free Tier)
**Free tier:** 200 emails/month

1. **Sign up at [EmailJS](https://www.emailjs.com/)**
2. **Connect your email service:**
   - Gmail, Outlook, Yahoo, or any SMTP service
3. **Create email template:**
   ```html
   Subject: New Custom T-Shirt Request #{{request_id}}
   
   Hi {{admin_name}},
   
   A new custom t-shirt request has been submitted:
   
   Customer: {{customer_name}}
   Email: {{customer_email}}
   Phone: {{customer_phone}}
   Message: {{customer_message}}
   
   Design Details:
   - Color: {{design_color}}
   - Size: {{design_size}}
   - Has Uploaded Design: {{has_uploaded_design}}
   
   View Request: {{supabase_url}}/requests/{{request_id}}
   
   Design Image: {{design_image_url}}
   Mockup Image: {{mockup_image_url}}
   
   Best regards,
   NewThrifts System
   ```

4. **Get your credentials:**
   - Service ID
   - Template ID
   - Public Key

### Option 2: Supabase Edge Functions + Resend (Free)
**Free tier:** 3,000 emails/month

1. **Sign up at [Resend](https://resend.com/)**
2. **Create Edge Function** (see below)
3. **Deploy to Supabase**

### Option 3: Webhook + Zapier (Free Tier)
**Free tier:** 100 tasks/month

1. **Create webhook in Supabase**
2. **Connect to Zapier**
3. **Set up email trigger**

---

## 🚀 Quick Setup with EmailJS (Recommended)

### Step 1: Update JavaScript Files

Add EmailJS integration to `supabase-custom-requests.js`:

```javascript
// Add to window.NewThriftsCustomRequests object
emailConfig: {
  serviceId: 'your_service_id',
  templateId: 'your_template_id',
  publicKey: 'your_public_key',
  adminEmail: 'shopping@newthrifts.com'
},

async sendEmailNotification(requestData) {
  try {
    // Load EmailJS
    if (!window.emailjs) {
      await this.loadEmailJS();
    }

    const templateParams = {
      request_id: requestData.requestId,
      admin_name: 'NewThrifts Team',
      customer_name: requestData.customer_name,
      customer_email: requestData.customer_email,
      customer_phone: requestData.customer_phone || 'Not provided',
      customer_message: requestData.customer_message,
      design_color: requestData.design_data?.color || 'Unknown',
      design_size: requestData.design_data?.size || 'Unknown',
      has_uploaded_design: requestData.design_image_url ? 'Yes' : 'No',
      design_image_url: requestData.design_image_url || 'No design uploaded',
      mockup_image_url: requestData.mockup_image_url || 'No mockup generated',
      supabase_url: 'https://your-project.supabase.co'
    };

    await window.emailjs.send(
      this.emailConfig.serviceId,
      this.emailConfig.templateId,
      templateParams,
      this.emailConfig.publicKey
    );

    console.log('✅ Email notification sent successfully');
    return { success: true };

  } catch (error) {
    console.error('❌ Error sending email notification:', error);
    return { success: false, error: error.message };
  }
},

async loadEmailJS() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      window.emailjs.init(this.emailConfig.publicKey);
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
```

### Step 2: Update Form Submission

In `interactive-mockup.liquid`, modify the form submission:

```javascript
// After successful database insert
if (result.success) {
  // Send email notification
  const emailResult = await window.NewThriftsCustomRequests.sendEmailNotification({
    ...formData,
    requestId: result.requestId,
    design_image_url: designImageUrl,
    mockup_image_url: mockupImageUrl
  });

  if (emailResult.success) {
    console.log('✅ Email notification sent');
  } else {
    console.warn('⚠️ Email notification failed:', emailResult.error);
  }

  // Show success message
  requestLoading.style.display = 'none';
  requestSuccess.style.display = 'block';
  requestId.textContent = `Request ID: ${result.requestId}`;
}
```

---

## 🔧 Alternative: Supabase Edge Function + Resend

### Step 1: Create Edge Function

Create `supabase/functions/send-request-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { requestData } = await req.json()
    
    // Send email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'notifications@newthrifts.com',
        to: ['shopping@newthrifts.com'],
        subject: `New Custom T-Shirt Request #${requestData.requestId}`,
        html: `
          <h2>New Custom T-Shirt Request</h2>
          <p><strong>Customer:</strong> ${requestData.customer_name}</p>
          <p><strong>Email:</strong> ${requestData.customer_email}</p>
          <p><strong>Phone:</strong> ${requestData.customer_phone || 'Not provided'}</p>
          <p><strong>Message:</strong> ${requestData.customer_message}</p>
          <p><strong>Design Color:</strong> ${requestData.design_data?.color}</p>
          <p><strong>Size:</strong> ${requestData.design_data?.size}</p>
          ${requestData.design_image_url ? `<p><strong>Design:</strong> <a href="${requestData.design_image_url}">View Design</a></p>` : ''}
          ${requestData.mockup_image_url ? `<p><strong>Mockup:</strong> <a href="${requestData.mockup_image_url}">View Mockup</a></p>` : ''}
        `
      })
    })

    if (!emailResponse.ok) {
      throw new Error('Failed to send email')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

### Step 2: Deploy Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your-project-ref

# Deploy function
supabase functions deploy send-request-email
```

### Step 3: Call from JavaScript

```javascript
async sendEmailNotification(requestData) {
  try {
    const response = await fetch('https://your-project.supabase.co/functions/v1/send-request-email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requestData })
    })

    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error)
    }

    return { success: true }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return { success: false, error: error.message }
  }
}
```

---

## 📋 Testing Email Notifications

### Test with EmailJS
```javascript
// Test in browser console
window.NewThriftsCustomRequests.sendEmailNotification({
  requestId: 'test-123',
  customer_name: 'Test User',
  customer_email: 'test@example.com',
  customer_message: 'Test request',
  design_data: { color: 'black', size: 'M' }
}).then(console.log)
```

### Test with Edge Function
```javascript
// Test in browser console
fetch('https://your-project.supabase.co/functions/v1/send-request-email', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-anon-key',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    requestData: {
      requestId: 'test-123',
      customer_name: 'Test User',
      customer_email: 'test@example.com'
    }
  })
}).then(r => r.json()).then(console.log)
```

---

## 🔧 Troubleshooting

### Common Issues:

1. **EmailJS not loading:**
   - Check network tab for script loading errors
   - Verify public key is correct

2. **Edge function timeout:**
   - Increase timeout in Supabase dashboard
   - Check function logs

3. **Email not received:**
   - Check spam folder
   - Verify email service configuration
   - Check Resend/EmailJS dashboard for delivery status

### Debug Mode:
```javascript
// Enable debug logging
window.NewThriftsCustomRequests.debug = true;
```

---

## 💡 Pro Tips

1. **Use EmailJS for simplicity** - easiest to set up
2. **Use Edge Functions for scale** - better for high volume
3. **Add email templates** - professional looking emails
4. **Include request links** - easy access to Supabase dashboard
5. **Set up auto-replies** - confirm receipt to customers

---

## 📞 Support

Need help? Check:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Resend Documentation](https://resend.com/docs)

