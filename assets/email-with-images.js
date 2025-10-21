// ============================================================================
// EMAIL WITH IMAGES - Send Image Files to shopping@newthrifts.com
// ============================================================================
// Enhanced email system that sends actual image files as attachments

window.EmailWithImages = {
  
  /**
   * Send email with image attachments to shopping@newthrifts.com
   */
  async sendEmailWithImages(requestData) {
    try {
      console.log('📧 Preparing to send email with images to shopping@newthrifts.com...');
      
      // Convert images to base64 for email attachment
      const designImageBase64 = await this.convertImageToBase64(requestData.design_image_url);
      const mockupImageBase64 = await this.convertImageToBase64(requestData.mockup_image_url);
      
      // Create email content
      const emailContent = this.createEmailContent(requestData);
      
      // Send via multiple methods for reliability
      const results = await Promise.allSettled([
        this.sendViaEmailJS(requestData, emailContent, designImageBase64, mockupImageBase64),
        this.sendViaFormspree(requestData, emailContent, designImageBase64, mockupImageBase64),
        this.sendViaResend(requestData, emailContent, designImageBase64, mockupImageBase64)
      ]);
      
      // Check if any method succeeded
      const success = results.some(result => result.status === 'fulfilled' && result.value?.success);
      
      if (success) {
        console.log('✅ Email with images sent successfully to shopping@newthrifts.com');
        return { success: true, message: 'Email sent with images attached' };
      } else {
        console.error('❌ All email methods failed');
        return { success: false, error: 'Failed to send email with images' };
      }
      
    } catch (error) {
      console.error('❌ Error sending email with images:', error);
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
   * Create email content with customer details
   */
  createEmailContent(requestData) {
    return {
      to: 'shopping@newthrifts.com',
      subject: `🎨 Custom T-Shirt Request from ${requestData.customer_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #ff4fa3; padding-bottom: 10px;">
            🎨 New Custom T-Shirt Request
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">👤 Customer Details</h3>
            <p><strong>Name:</strong> ${requestData.customer_name}</p>
            <p><strong>Email:</strong> ${requestData.customer_email}</p>
            <p><strong>Phone:</strong> ${requestData.customer_phone || 'Not provided'}</p>
            <p><strong>T-Shirt Size:</strong> ${requestData.tshirt_size || 'Not specified'}</p>
          </div>
          
          <div style="background: #fff; border-left: 4px solid #27e1c1; padding: 15px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">💬 Customer Message</h3>
            <p style="font-style: italic;">${requestData.customer_message || 'No special instructions provided'}</p>
          </div>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🎨 Design Specifications</h3>
            <ul style="list-style: none; padding: 0;">
              <li>📐 <strong>Position:</strong> Top ${requestData.design_data.position.top}%, Left ${requestData.design_data.position.left}%</li>
              <li>📏 <strong>Size:</strong> ${requestData.design_data.position.width}% × ${requestData.design_data.position.height}%</li>
              <li>🔄 <strong>Rotation:</strong> ${requestData.design_data.position.rotation}°</li>
              <li>👁️ <strong>View:</strong> ${requestData.design_data.view}</li>
              <li>🎨 <strong>T-Shirt Color:</strong> ${requestData.design_data.color}</li>
            </ul>
          </div>
          
          <div style="background: #fffacd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📎 Attachments</h3>
            <p>✅ Original Design Image</p>
            <p>✅ Generated Mockup Preview</p>
            <p><em>Images are attached to this email for your review.</em></p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              📅 Submitted: ${new Date().toLocaleString()}<br>
              🆔 Request ID: ${requestData.id || 'Pending'}<br>
              🌐 Source: NewThrifts Custom T-Shirt Designer
            </p>
          </div>
        </div>
      `,
      text: `
        New Custom T-Shirt Request from ${requestData.customer_name}
        
        Customer Details:
        - Name: ${requestData.customer_name}
        - Email: ${requestData.customer_email}
        - Phone: ${requestData.customer_phone || 'Not provided'}
        - T-Shirt Size: ${requestData.tshirt_size || 'Not specified'}
        
        Message:
        ${requestData.customer_message || 'No special instructions'}
        
        Design Specifications:
        - Position: Top ${requestData.design_data.position.top}%, Left ${requestData.design_data.position.left}%
        - Size: ${requestData.design_data.position.width}% × ${requestData.design_data.position.height}%
        - Rotation: ${requestData.design_data.position.rotation}°
        - View: ${requestData.design_data.view}
        - T-Shirt Color: ${requestData.design_data.color}
        
        Attachments:
        - Original Design Image
        - Generated Mockup Preview
        
        Submitted: ${new Date().toLocaleString()}
        Request ID: ${requestData.id || 'Pending'}
      `
    };
  },

  /**
   * Send email via EmailJS (if configured)
   * ⭐ UPDATED TO USE SUPABASE URLs INSTEAD OF BASE64
   */
  async sendViaEmailJS(requestData, emailContent, designImageBase64, mockupImageBase64) {
    try {
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS not available');
      }
      
      const templateParams = {
        // Email metadata
        to_email: emailContent.to,
        subject: emailContent.subject,
        
        // Customer details (matching template variable names)
        name: requestData.customer_name,
        email: requestData.customer_email,
        phone: requestData.customer_phone || 'Not provided',
        tshirt_size: requestData.tshirt_size || 'Not specified',
        message: requestData.customer_message || 'No special instructions',
        
        // Design specifications
        design_position: `Top ${requestData.design_data.position.top}%, Left ${requestData.design_data.position.left}%`,
        design_size: `${requestData.design_data.position.width}% × ${requestData.design_data.position.height}%`,
        design_rotation: `${requestData.design_data.position.rotation}°`,
        design_view: requestData.design_data.view,
        tshirt_color: requestData.design_data.color,
        
        // ⭐ USE SUPABASE URLs INSTEAD OF BASE64 - THIS IS THE KEY FIX!
        design_url: requestData.design_image_url,
        mockup_preview_url: requestData.mockup_image_url,
        
        // Logo URL - UPDATE THIS WITH YOUR ACTUAL LOGO URL
        logo_url: 'https://cdn.shopify.com/s/files/1/0624/0424/5697/files/newthrifts-logo.png',
        
        // Metadata
        submission_date: new Date().toLocaleString(),
        request_id: requestData.id || `REQ-${Date.now()}`
      };
      
      console.log('📧 Sending EmailJS with params:', templateParams);
      
      const result = await emailjs.send(
        'service_7q2aokn', // Your EmailJS service ID
        'template_qiquke8', // Your EmailJS template ID
        templateParams
      );
      
      console.log('✅ EmailJS sent successfully:', result);
      return { success: true, method: 'EmailJS' };
      
    } catch (error) {
      console.warn('⚠️ EmailJS failed:', error);
      return { success: false, error: error.message, method: 'EmailJS' };
    }
  },

  /**
   * Send email via Formspree with image data
   */
  async sendViaFormspree(requestData, emailContent, designImageBase64, mockupImageBase64) {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('_to', emailContent.to);
      formData.append('_subject', emailContent.subject);
      formData.append('_replyto', requestData.customer_email);
      formData.append('customer_name', requestData.customer_name);
      formData.append('customer_email', requestData.customer_email);
      formData.append('customer_phone', requestData.customer_phone || '');
      formData.append('tshirt_size', requestData.tshirt_size || '');
      formData.append('customer_message', requestData.customer_message || '');
      formData.append('design_specs', JSON.stringify(requestData.design_data));
      
      // Add HTML content
      formData.append('message_html', emailContent.html);
      formData.append('message_text', emailContent.text);
      
      // Add image data as base64
      if (designImageBase64) {
        formData.append('design_image_base64', designImageBase64);
      }
      if (mockupImageBase64) {
        formData.append('mockup_image_base64', mockupImageBase64);
      }
      
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', { // Replace with your Formspree form ID
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ Formspree sent successfully');
        return { success: true, method: 'Formspree' };
      } else {
        throw new Error(`Formspree error: ${response.status}`);
      }
      
    } catch (error) {
      console.warn('⚠️ Formspree failed:', error);
      return { success: false, error: error.message, method: 'Formspree' };
    }
  },

  /**
   * Send email via Resend API (if configured)
   */
  async sendViaResend(requestData, emailContent, designImageBase64, mockupImageBase64) {
    try {
      const emailPayload = {
        from: 'noreply@newthrifts.com',
        to: [emailContent.to],
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
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
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_RESEND_API_KEY', // Replace with your Resend API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      });
      
      if (response.ok) {
        console.log('✅ Resend sent successfully');
        return { success: true, method: 'Resend' };
      } else {
        throw new Error(`Resend error: ${response.status}`);
      }
      
    } catch (error) {
      console.warn('⚠️ Resend failed:', error);
      return { success: false, error: error.message, method: 'Resend' };
    }
  },

  /**
   * Send email via custom webhook (if configured)
   */
  async sendViaWebhook(requestData, emailContent, designImageBase64, mockupImageBase64) {
    try {
      const webhookData = {
        to: emailContent.to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments: {
          design_image: designImageBase64,
          mockup_image: mockupImageBase64
        },
        customer_data: requestData
      };
      
      const response = await fetch('YOUR_WEBHOOK_URL', { // Replace with your webhook URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_WEBHOOK_TOKEN' // Replace with your webhook token
        },
        body: JSON.stringify(webhookData)
      });
      
      if (response.ok) {
        console.log('✅ Webhook sent successfully');
        return { success: true, method: 'Webhook' };
      } else {
        throw new Error(`Webhook error: ${response.status}`);
      }
      
    } catch (error) {
      console.warn('⚠️ Webhook failed:', error);
      return { success: false, error: error.message, method: 'Webhook' };
    }
  }
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Send email with images to shopping@newthrifts.com
// EmailWithImages.sendEmailWithImages(requestData);
