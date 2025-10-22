// ============================================================================
// RESEND EMAIL SETUP - Open Source Email with File Attachments
// ============================================================================
// Resend.com provides free email service with file attachment support

window.ResendEmail = {
  
  /**
   * Send email with image attachments via Resend API
   */
  async sendEmailWithImages(requestData) {
    try {
      console.log('📧 Sending email with images via Resend...');
      
      // Convert images to base64 for email attachment
      const designImageBase64 = await this.convertImageToBase64(requestData.design_image_url);
      const mockupImageBase64 = await this.convertImageToBase64(requestData.mockup_image_url);
      
      // Create email payload
      const emailPayload = {
        from: 'noreply@newthrifts.com', // You can use your domain or a verified email
        to: ['shopping@newthrifts.com'],
        subject: `🎨 Custom T-Shirt Request from ${requestData.customer_name}`,
        html: this.createHtmlEmail(requestData),
        text: this.createTextEmail(requestData),
        attachments: []
      };
      
      // Add design image attachment
      if (designImageBase64) {
        emailPayload.attachments.push({
          filename: `design_${requestData.customer_name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`,
          content: designImageBase64.split(',')[1], // Remove data:image/png;base64, prefix
          encoding: 'base64'
        });
      }
      
      // Add mockup image attachment
      if (mockupImageBase64) {
        emailPayload.attachments.push({
          filename: `mockup_${requestData.customer_name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`,
          content: mockupImageBase64.split(',')[1], // Remove data:image/png;base64, prefix
          encoding: 'base64'
        });
      }
      
      // Send via Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_RESEND_API_KEY', // Replace with your Resend API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Resend email sent successfully:', result);
        return { success: true, messageId: result.id };
      } else {
        const error = await response.text();
        throw new Error(`Resend error: ${response.status} - ${error}`);
      }
      
    } catch (error) {
      console.error('❌ Resend email failed:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Convert image URL to base64 for email attachment
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
  },

  /**
   * Create HTML email content
   */
  createHtmlEmail(requestData) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <h2 style="color: #333; border-bottom: 3px solid #ff4fa3; padding-bottom: 10px; margin-top: 0;">
            🎨 New Custom T-Shirt Request
          </h2>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #27e1c1;">
            <h3 style="color: #333; margin-top: 0;">👤 Customer Details</h3>
            <p><strong>Name:</strong> ${requestData.customer_name}</p>
            <p><strong>Email:</strong> ${requestData.customer_email}</p>
            <p><strong>Phone:</strong> ${requestData.customer_phone || 'Not provided'}</p>
            <p><strong>T-Shirt Size:</strong> ${requestData.tshirt_size || 'Not specified'}</p>
          </div>
          
          <div style="background: #fff; border-left: 4px solid #ff4fa3; padding: 15px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">💬 Customer Message</h3>
            <p style="font-style: italic; background: #f9f9f9; padding: 10px; border-radius: 4px;">
              ${requestData.customer_message || 'No special instructions provided'}
            </p>
          </div>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🎨 Design Specifications</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Position:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">Top ${requestData.design_data.position.top}%, Left ${requestData.design_data.position.left}%</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Size:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${requestData.design_data.position.width}% × ${requestData.design_data.position.height}%</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Rotation:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${requestData.design_data.position.rotation}°</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>View:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${requestData.design_data.view}</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>T-Shirt Color:</strong></td>
                <td style="padding: 8px;">${requestData.design_data.color}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fffacd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px dashed #ffa500;">
            <h3 style="color: #333; margin-top: 0;">📎 Attachments</h3>
            <p>✅ <strong>Original Design Image</strong> - See attached file</p>
            <p>✅ <strong>Generated Mockup Preview</strong> - See attached file</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 0;">
              <em>Images are attached to this email for your review and production.</em>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              📅 <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
              🆔 <strong>Request ID:</strong> ${requestData.id || 'Pending'}<br>
              🌐 <strong>Source:</strong> NewThrifts Custom T-Shirt Designer
            </p>
          </div>
          
        </div>
      </div>
    `;
  },

  /**
   * Create plain text email content
   */
  createTextEmail(requestData) {
    return `
New Custom T-Shirt Request from ${requestData.customer_name}

CUSTOMER DETAILS:
- Name: ${requestData.customer_name}
- Email: ${requestData.customer_email}
- Phone: ${requestData.customer_phone || 'Not provided'}
- T-Shirt Size: ${requestData.tshirt_size || 'Not specified'}

CUSTOMER MESSAGE:
${requestData.customer_message || 'No special instructions provided'}

DESIGN SPECIFICATIONS:
- Position: Top ${requestData.design_data.position.top}%, Left ${requestData.design_data.position.left}%
- Size: ${requestData.design_data.position.width}% × ${requestData.design_data.position.height}%
- Rotation: ${requestData.design_data.position.rotation}°
- View: ${requestData.design_data.view}
- T-Shirt Color: ${requestData.design_data.color}

ATTACHMENTS:
- Original Design Image (attached)
- Generated Mockup Preview (attached)

Submitted: ${new Date().toLocaleString()}
Request ID: ${requestData.id || 'Pending'}
Source: NewThrifts Custom T-Shirt Designer
    `;
  }
};

// ============================================================================
// SETUP INSTRUCTIONS
// ============================================================================

/*
SETUP RESEND.COM (FREE):

1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address
4. Get your API key from the dashboard
5. Replace 'YOUR_RESEND_API_KEY' in the code above
6. Optionally, add your domain for custom "from" address

FREE TIER INCLUDES:
- 3,000 emails per month
- File attachments support
- API access
- Webhooks
- Email analytics

EXAMPLE API KEY:
re_123456789_abcdefghijklmnopqrstuvwxyz

USAGE:
ResendEmail.sendEmailWithImages(requestData);
*/
