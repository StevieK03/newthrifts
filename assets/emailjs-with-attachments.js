// ============================================================================
// EMAILJS WITH ATTACHMENTS - Free Email Service with File Support
// ============================================================================
// EmailJS provides free email service with file attachment support

window.EmailJSWithAttachments = {
  
  /**
   * Send email with image attachments via EmailJS
   */
  async sendEmailWithImages(requestData) {
    try {
      console.log('📧 Sending email with images via EmailJS...');
      
      // Check if EmailJS is loaded
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS not loaded. Please include EmailJS script.');
      }
      
      // Convert images to base64 for email attachment
      const designImageBase64 = await this.convertImageToBase64(requestData.design_image_url);
      const mockupImageBase64 = await this.convertImageToBase64(requestData.mockup_image_url);
      
      // Create email template parameters
      const templateParams = {
        to_email: 'shopping@newthrifts.com',
        customer_name: requestData.customer_name,
        customer_email: requestData.customer_email,
        customer_phone: requestData.customer_phone || 'Not provided',
        tshirt_size: requestData.tshirt_size || 'Not specified',
        customer_message: requestData.customer_message || 'No special instructions',
        design_position: `Top ${requestData.design_data.position.top}%, Left ${requestData.design_data.position.left}%`,
        design_size: `${requestData.design_data.position.width}% × ${requestData.design_data.position.height}%`,
        design_rotation: `${requestData.design_data.position.rotation}°`,
        design_view: requestData.design_data.view,
        tshirt_color: requestData.design_data.color,
        submission_date: new Date().toLocaleString(),
        request_id: requestData.id || 'Pending',
        design_image: designImageBase64,
        mockup_image: mockupImageBase64
      };
      
      // Send email via EmailJS
      const result = await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        templateParams
      );
      
      console.log('✅ EmailJS email sent successfully:', result);
      return { success: true, messageId: result.text };
      
    } catch (error) {
      console.error('❌ EmailJS email failed:', error);
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
   * Initialize EmailJS (call this first)
   */
  init(userId) {
    if (typeof emailjs !== 'undefined') {
      emailjs.init(userId);
      console.log('✅ EmailJS initialized');
    } else {
      console.error('❌ EmailJS not loaded');
    }
  }
};

// ============================================================================
// SETUP INSTRUCTIONS
// ============================================================================

/*
SETUP EMAILJS (FREE):

1. Go to https://www.emailjs.com
2. Sign up for a free account
3. Create an email service (Gmail, Outlook, etc.)
4. Create an email template
5. Get your Service ID, Template ID, and User ID

FREE TIER INCLUDES:
- 200 emails per month
- File attachments support
- Email templates
- Multiple email services

STEP-BY-STEP:

1. CREATE EMAIL SERVICE:
   - Go to Email Services
   - Add Gmail/Outlook/etc.
   - Connect your email account
   - Get Service ID (e.g., service_abc123)

2. CREATE EMAIL TEMPLATE:
   - Go to Email Templates
   - Create new template
   - Use variables like {{customer_name}}
   - Get Template ID (e.g., template_xyz789)

3. GET USER ID:
   - Go to Account
   - Copy User ID (e.g., user_123456)

4. UPDATE CODE:
   - Replace YOUR_SERVICE_ID with your service ID
   - Replace YOUR_TEMPLATE_ID with your template ID
   - Replace YOUR_USER_ID with your user ID

EXAMPLE TEMPLATE VARIABLES:
{{to_email}} - shopping@newthrifts.com
{{customer_name}} - Customer name
{{customer_email}} - Customer email
{{design_image}} - Base64 design image
{{mockup_image}} - Base64 mockup image

USAGE:
EmailJSWithAttachments.init('YOUR_USER_ID');
EmailJSWithAttachments.sendEmailWithImages(requestData);
*/
