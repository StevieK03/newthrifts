// ============================================================================
// WEBHOOK EMAIL ALTERNATIVE - Send to Any Backend Service
// ============================================================================
// Use webhooks to send data to any backend service that supports email

window.WebhookEmail = {
  
  /**
   * Send email data via webhook to your backend
   */
  async sendEmailWithImages(requestData) {
    try {
      console.log('📧 Sending email data via webhook...');
      
      // Convert images to base64 for webhook payload
      const designImageBase64 = await this.convertImageToBase64(requestData.design_image_url);
      const mockupImageBase64 = await this.convertImageToBase64(requestData.mockup_image_url);
      
      // Create webhook payload
      const webhookData = {
        to: 'shopping@newthrifts.com',
        subject: `🎨 Custom T-Shirt Request from ${requestData.customer_name}`,
        customer: {
          name: requestData.customer_name,
          email: requestData.customer_email,
          phone: requestData.customer_phone,
          tshirt_size: requestData.tshirt_size,
          message: requestData.customer_message
        },
        design: {
          position: requestData.design_data.position,
          view: requestData.design_data.view,
          color: requestData.design_data.color
        },
        attachments: {
          design_image: designImageBase64,
          mockup_image: mockupImageBase64
        },
        metadata: {
          request_id: requestData.id,
          submission_date: new Date().toISOString(),
          source: 'NewThrifts Custom T-Shirt Designer'
        }
      };
      
      // Send to webhook endpoint
      const response = await fetch('YOUR_WEBHOOK_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_WEBHOOK_TOKEN' // Optional
        },
        body: JSON.stringify(webhookData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Webhook email sent successfully:', result);
        return { success: true, result: result };
      } else {
        const error = await response.text();
        throw new Error(`Webhook error: ${response.status} - ${error}`);
      }
      
    } catch (error) {
      console.error('❌ Webhook email failed:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Convert image URL to base64 for webhook payload
   */
  async convertImageToBase64(imageUrl) {
    if (!imageUrl) return null;
    
    try {
      // Handle base64 data URLs
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }
      
      // Convert regular URL to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
    } catch (error) {
      console.warn('⚠️ Could not convert image to base64:', error);
      return null;
    }
  }
};

// ============================================================================
// BACKEND EXAMPLES
// ============================================================================

/*
NODE.JS EXPRESS EXAMPLE:

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
    const { to, subject, customer, design, attachments, metadata } = req.body;
    
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
        <p><strong>Position:</strong> Top ${design.position.top}%, Left ${design.position.left}%</p>
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

PYTHON FLASK EXAMPLE:

from flask import Flask, request, jsonify
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import base64

app = Flask(__name__)

@app.route('/webhook/email', methods=['POST'])
def send_email():
    try:
        data = request.json
        to = data['to']
        subject = data['subject']
        customer = data['customer']
        design = data['design']
        attachments = data['attachments']
        
        # Create email
        msg = MIMEMultipart()
        msg['From'] = 'noreply@newthrifts.com'
        msg['To'] = to
        msg['Subject'] = subject
        
        # Add email body
        body = f"""
        Custom T-Shirt Request
        
        Customer: {customer['name']}
        Email: {customer['email']}
        Phone: {customer['phone']}
        Message: {customer['message']}
        
        Design: {design['view']} - {design['color']}
        Position: Top {design['position']['top']}%, Left {design['position']['left']}%
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Add attachments
        if attachments['design_image']:
            image_data = base64.b64decode(attachments['design_image'].split(',')[1])
            image = MIMEImage(image_data)
            image.add_header('Content-Disposition', 'attachment', filename=f"design_{customer['name']}.png")
            msg.attach(image)
        
        if attachments['mockup_image']:
            image_data = base64.b64decode(attachments['mockup_image'].split(',')[1])
            image = MIMEImage(image_data)
            image.add_header('Content-Disposition', 'attachment', filename=f"mockup_{customer['name']}.png")
            msg.attach(image)
        
        # Send email
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login('your-email@gmail.com', 'your-app-password')
        server.send_message(msg)
        server.quit()
        
        return jsonify({'success': True, 'message': 'Email sent successfully'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
*/

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
USAGE:

1. Set up your webhook endpoint (Node.js, Python, PHP, etc.)
2. Replace 'YOUR_WEBHOOK_URL' with your endpoint
3. Optionally add authentication token
4. Call the function:

WebhookEmail.sendEmailWithImages(requestData);

WEBHOOK TESTING:
- Use webhook.site for free testing
- Use ngrok for local development
- Use Vercel/Netlify for serverless functions
*/
