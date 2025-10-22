// ============================================================================
// Custom T-Shirt Requests API
// ============================================================================
// JavaScript API for handling custom t-shirt design requests
// Includes image upload, database operations, and email notifications

window.NewThriftsCustomRequests = {
  
  // ============================================================================
  // CORE FUNCTIONS
  // ============================================================================

  /**
   * Submit a custom t-shirt request
   * @param {Object} requestData - The request data
   * @returns {Promise<Object>} - Success/error result
   */
  async submitCustomRequest(requestData) {
    try {
      const supabase = await this.ensureSupabaseReady();
      
      // Insert request into database
      const { data, error } = await supabase
        .from('custom_tshirt_requests')
        .insert([{
          customer_email: requestData.customer_email,
          customer_name: requestData.customer_name,
          customer_phone: requestData.customer_phone,
          customer_message: requestData.customer_message,
          design_image_url: requestData.design_image_url,
          mockup_image_url: requestData.mockup_image_url,
          design_data: requestData.design_data,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Custom request saved to database:', data);
      
      return {
        success: true,
        requestId: data.id,
        data: data
      };

    } catch (error) {
      console.error('❌ Error saving custom request:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Upload image to Supabase Storage
   * @param {string} imageDataUrl - Base64 or blob URL of the image
   * @param {string} bucket - Storage bucket name
   * @param {string} filename - Optional custom filename
   * @returns {Promise<string>} - Public URL of uploaded image
   */
  async uploadImageToStorage(imageDataUrl, bucket, filename = null) {
    try {
      const supabase = await this.ensureSupabaseReady();
      
      // Convert data URL to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Generate unique filename if not provided
      if (!filename) {
        const extension = blob.type.split('/')[1] || 'png';
        filename = `custom-${bucket}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${extension}`;
      }
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, blob, {
          contentType: blob.type,
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filename);

      console.log(`✅ Image uploaded to ${bucket}:`, publicUrl);
      return publicUrl;

    } catch (error) {
      console.error(`❌ Error uploading to ${bucket}:`, error);
      throw error;
    }
  },

  /**
   * Generate composite mockup image from canvas
   * @param {HTMLCanvasElement} canvas - Canvas with rendered mockup
   * @returns {Promise<string>} - Public URL of uploaded mockup
   */
  async generateAndUploadMockup(canvas) {
    try {
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      
      // Upload to mockup-previews bucket
      const mockupUrl = await this.uploadImageToStorage(dataUrl, 'mockup-previews');
      
      return mockupUrl;

    } catch (error) {
      console.error('❌ Error generating mockup:', error);
      throw error;
    }
  },

  // ============================================================================
  // ADMIN FUNCTIONS
  // ============================================================================

  /**
   * Get all custom requests (admin function)
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Array of requests
   */
  async getAllRequests(options = {}) {
    try {
      const supabase = await this.ensureSupabaseReady();
      
      const { 
        status = null, 
        limit = 50, 
        offset = 0,
        orderBy = 'created_at',
        ascending = false 
      } = options;

      let query = supabase
        .from('custom_tshirt_requests')
        .select('*')
        .order(orderBy, { ascending })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        requests: data,
        count: data.length
      };

    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Update request status (admin function)
   * @param {string} requestId - Request ID
   * @param {string} status - New status
   * @param {string} adminNotes - Optional admin notes
   * @returns {Promise<Object>} - Success/error result
   */
  async updateRequestStatus(requestId, status, adminNotes = null) {
    try {
      const supabase = await this.ensureSupabaseReady();
      
      const updateData = { status, updated_at: new Date().toISOString() };
      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { data, error } = await supabase
        .from('custom_tshirt_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Request status updated:', data);
      
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('❌ Error updating request status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get request statistics
   * @returns {Promise<Object>} - Statistics object
   */
  async getRequestStats() {
    try {
      const supabase = await this.ensureSupabaseReady();
      
      const { data, error } = await supabase.rpc('get_request_stats');

      if (error) throw error;

      return {
        success: true,
        stats: data[0]
      };

    } catch (error) {
      console.error('❌ Error fetching request stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get requests by status
   * @param {string} status - Request status to filter by
   * @returns {Promise<Object>} - Array of requests
   */
  async getRequestsByStatus(status) {
    try {
      const supabase = await this.ensureSupabaseReady();
      
      const { data, error } = await supabase.rpc('get_requests_by_status', {
        request_status: status
      });

      if (error) throw error;

      return {
        success: true,
        requests: data
      };

    } catch (error) {
      console.error('❌ Error fetching requests by status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Ensure Supabase client is ready
   * @returns {Promise<Object>} - Supabase client
   */
  async ensureSupabaseReady() {
    // Check for global Supabase client first
    if (window.supabaseClient) {
      console.log('✅ Using global Supabase client');
      return window.supabaseClient;
    }
    
    // Try to initialize Supabase client if not available
    if (window.SupabaseClient) {
      console.log('🔄 Initializing Supabase client...');
      const supabaseClient = new window.SupabaseClient();
      const client = await supabaseClient.init();
      if (client) {
        console.log('✅ Supabase client initialized successfully');
        return client;
      }
    }
    
    throw new Error('Supabase client not found. Please ensure supabase-config.js is loaded.');
  },

  /**
   * Validate request data
   * @param {Object} requestData - Request data to validate
   * @returns {Object} - Validation result
   */
  validateRequestData(requestData) {
    const errors = [];

    if (!requestData.customer_name || requestData.customer_name.trim().length < 2) {
      errors.push('Customer name is required and must be at least 2 characters');
    }

    if (!requestData.customer_email || !this.isValidEmail(requestData.customer_email)) {
      errors.push('Valid email address is required');
    }

    if (!requestData.customer_message || requestData.customer_message.trim().length < 10) {
      errors.push('Customer message is required and must be at least 10 characters');
    }

    if (requestData.customer_phone && !this.isValidPhone(requestData.customer_phone)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} - Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number
   * @param {string} phone - Phone to validate
   * @returns {boolean} - Is valid phone
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Format request ID for display
   * @param {string} requestId - Full request ID
   * @returns {string} - Shortened display ID
   */
  formatRequestId(requestId) {
    return requestId ? `${requestId.substring(0, 8)}...` : 'Unknown';
  },

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // ============================================================================
  // UI HELPER FUNCTIONS
  // ============================================================================

  /**
   * Show success notification
   * @param {string} message - Success message
   * @param {string} requestId - Optional request ID
   */
  showSuccessNotification(message, requestId = null) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
      z-index: 10001;
      max-width: 400px;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 24px;">✅</div>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">${message}</div>
          ${requestId ? `<div style="font-size: 12px; opacity: 0.9;">Request ID: ${this.formatRequestId(requestId)}</div>` : ''}
        </div>
      </div>
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  },

  /**
   * Show error notification
   * @param {string} message - Error message
   */
  showErrorNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #ef4444, #dc2626);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
      z-index: 10001;
      max-width: 400px;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 24px;">❌</div>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Error</div>
          <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Custom Requests API initialized');
  console.log('📧 Email notifications will be sent to: shopping@newthrifts.com');
  console.log('🗄️ Storage buckets: design-uploads, mockup-previews');
});

