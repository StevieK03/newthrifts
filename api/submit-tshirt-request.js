// API endpoint for submitting t-shirt requests
// This file should be placed in your Shopify theme's api folder or as a serverless function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_message,
      tshirt_size,
      design_data,
      design_image_url,
      mockup_image_url
    } = req.body;

    // Validate required fields
    if (!customer_name || !customer_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For now, we'll use a simple email service
    // In production, you'd integrate with your Supabase database
    const requestData = {
      id: `req_${Date.now()}`,
      customer_name,
      customer_email,
      customer_phone,
      customer_message,
      tshirt_size,
      design_data,
      design_image_url,
      mockup_image_url,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Send email notification using a free service like EmailJS or Resend
    await sendEmailNotification(requestData);

    // In production, save to Supabase:
    // const { data, error } = await supabase
    //   .from('custom_tshirt_requests')
    //   .insert([requestData]);

    console.log('T-shirt request submitted:', requestData);

    res.status(200).json({ 
      success: true, 
      message: 'Request submitted successfully',
      request_id: requestData.id
    });

  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function sendEmailNotification(requestData) {
  // Using EmailJS (free service) - you'll need to set this up
  // Alternative: Use Resend, SendGrid, or other email services
  
  const emailData = {
    to: 'shopping@newthrifts.com',
    subject: `New Custom T-Shirt Request #${requestData.id}`,
    html: `
      <h2>New Custom T-Shirt Request</h2>
      <p><strong>Request ID:</strong> ${requestData.id}</p>
      <p><strong>Customer:</strong> ${requestData.customer_name}</p>
      <p><strong>Email:</strong> ${requestData.customer_email}</p>
      <p><strong>Phone:</strong> ${requestData.customer_phone || 'Not provided'}</p>
      <p><strong>T-Shirt Size:</strong> ${requestData.tshirt_size || 'Not specified'}</p>
      <p><strong>Message:</strong> ${requestData.customer_message || 'No additional message'}</p>
      
      <h3>Design Details:</h3>
      <p><strong>View:</strong> ${requestData.design_data.view}</p>
      <p><strong>Color:</strong> ${requestData.design_data.color}</p>
      <p><strong>Position:</strong> Top ${requestData.design_data.position.top}%, Left ${requestData.design_data.position.left}%</p>
      <p><strong>Size:</strong> ${requestData.design_data.position.width}% x ${requestData.design_data.position.height}%</p>
      <p><strong>Rotation:</strong> ${requestData.design_data.position.rotation}°</p>
      
      <h3>Images:</h3>
      <p><strong>Design Image:</strong> <a href="${requestData.design_image_url}">View Original Design</a></p>
      <p><strong>Mockup Preview:</strong> <a href="${requestData.mockup_image_url}">View Mockup</a></p>
      
      <p><em>Please review this request and contact the customer within 24 hours.</em></p>
    `
  };

  // For now, just log the email (in production, send actual email)
  console.log('Email notification:', emailData);
  
  // Example with EmailJS:
  // await emailjs.send('service_id', 'template_id', emailData, 'user_id');
  
  return true;
}
