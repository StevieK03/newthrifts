// ============================================================================
// DOWNLOAD CUSTOM T-SHIRT REQUESTS
// ============================================================================
// JavaScript functions to download request data from the browser

window.DownloadRequests = {
  
  /**
   * Download all requests as CSV with actual image files
   */
  async downloadAllRequestsAsCSV() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select(`
          id,
          created_at,
          updated_at,
          status,
          admin_notes,
          customer_name,
          customer_email,
          customer_phone,
          customer_message,
          design_data,
          design_image_url,
          mockup_image_url
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('📊 Preparing to download', data.length, 'requests with images...');

      // Download images for each request
      for (let i = 0; i < data.length; i++) {
        const request = data[i];
        const requestId = request.id.slice(-8); // Use last 8 characters as filename
        
        try {
          // Download design image
          if (request.design_image_url) {
            await this.downloadImageFile(
              request.design_image_url, 
              `request-${requestId}-design.png`
            );
          }
          
          // Download mockup image
          if (request.mockup_image_url) {
            await this.downloadImageFile(
              request.mockup_image_url, 
              `request-${requestId}-mockup.png`
            );
          }
          
          console.log(`✅ Downloaded images for request ${i + 1}/${data.length}`);
          
        } catch (imageError) {
          console.warn(`⚠️ Could not download images for request ${requestId}:`, imageError);
        }
        
        // Small delay to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Convert to CSV format
      const csv = this.convertToCSV(data);
      
      // Download the CSV file
      this.downloadFile(csv, 'custom-tshirt-requests.csv', 'text/csv');
      
      console.log('✅ Downloaded', data.length, 'requests with images as CSV');
      alert(`✅ Downloaded ${data.length} requests with all image files!`);
      
    } catch (error) {
      console.error('❌ Error downloading requests:', error);
      alert('Failed to download requests: ' + error.message);
    }
  },

  /**
   * Download pending requests as CSV with actual image files
   */
  async downloadPendingRequestsAsCSV() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select(`
          id,
          created_at,
          customer_name,
          customer_email,
          customer_phone,
          customer_message,
          design_data,
          design_image_url,
          mockup_image_url
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('📊 Preparing to download', data.length, 'pending requests with images...');

      // Download images for each pending request
      for (let i = 0; i < data.length; i++) {
        const request = data[i];
        const requestId = request.id.slice(-8);
        
        try {
          // Download design image
          if (request.design_image_url) {
            await this.downloadImageFile(
              request.design_image_url, 
              `pending-${requestId}-design.png`
            );
          }
          
          // Download mockup image
          if (request.mockup_image_url) {
            await this.downloadImageFile(
              request.mockup_image_url, 
              `pending-${requestId}-mockup.png`
            );
          }
          
          console.log(`✅ Downloaded images for pending request ${i + 1}/${data.length}`);
          
        } catch (imageError) {
          console.warn(`⚠️ Could not download images for pending request ${requestId}:`, imageError);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const csv = this.convertToCSV(data);
      this.downloadFile(csv, 'pending-requests.csv', 'text/csv');
      
      console.log('✅ Downloaded', data.length, 'pending requests with images as CSV');
      alert(`✅ Downloaded ${data.length} pending requests with all image files!`);
      
    } catch (error) {
      console.error('❌ Error downloading pending requests:', error);
      alert('Failed to download pending requests: ' + error.message);
    }
  },

  /**
   * Download customer contact list as CSV
   */
  async downloadCustomerListAsCSV() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      // Get unique customers with request counts
      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('customer_name, customer_email, customer_phone, created_at, status');

      if (error) throw error;

      // Group by customer
      const customerMap = new Map();
      data.forEach(request => {
        const key = `${request.customer_email}`;
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            name: request.customer_name,
            email: request.customer_email,
            phone: request.customer_phone,
            totalRequests: 0,
            latestRequest: request.created_at,
            statuses: new Set()
          });
        }
        
        const customer = customerMap.get(key);
        customer.totalRequests++;
        customer.statuses.add(request.status);
        if (new Date(request.created_at) > new Date(customer.latestRequest)) {
          customer.latestRequest = request.created_at;
        }
      });

      // Convert to array
      const customerData = Array.from(customerMap.values()).map(customer => ({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        totalRequests: customer.totalRequests,
        latestRequest: customer.latestRequest,
        allStatuses: Array.from(customer.statuses).join(', ')
      }));

      const csv = this.convertToCSV(customerData);
      this.downloadFile(csv, 'customer-list.csv', 'text/csv');
      
      console.log('✅ Downloaded', customerData.length, 'customers as CSV');
      
    } catch (error) {
      console.error('❌ Error downloading customer list:', error);
      alert('Failed to download customer list: ' + error.message);
    }
  },

  /**
   * Download requests as JSON
   */
  async downloadAllRequestsAsJSON() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const json = JSON.stringify(data, null, 2);
      this.downloadFile(json, 'custom-tshirt-requests.json', 'application/json');
      
      console.log('✅ Downloaded', data.length, 'requests as JSON');
      
    } catch (error) {
      console.error('❌ Error downloading requests as JSON:', error);
      alert('Failed to download requests: ' + error.message);
    }
  },

  /**
   * Convert data array to CSV format
   */
  convertToCSV(data) {
    if (!data || data.length === 0) return '';

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV header row
    const csvHeaders = headers.map(header => `"${header}"`).join(',');
    
    // Create CSV data rows
    const csvRows = data.map(row => {
      return headers.map(header => {
        let value = row[header];
        
        // Handle special data types
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'object') {
          value = JSON.stringify(value);
        } else {
          value = String(value);
        }
        
        // Escape quotes and wrap in quotes
        value = value.replace(/"/g, '""');
        return `"${value}"`;
      }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  },

  /**
   * Download file to user's computer
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  },

  /**
   * Download specific request by ID with actual image files
   */
  async downloadRequestById(requestId) {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) throw error;

      console.log('📊 Downloading request with images:', requestId);

      const shortId = requestId.slice(-8);

      // Download design image
      if (data.design_image_url) {
        await this.downloadImageFile(
          data.design_image_url, 
          `request-${shortId}-design.png`
        );
      }
      
      // Download mockup image
      if (data.mockup_image_url) {
        await this.downloadImageFile(
          data.mockup_image_url, 
          `request-${shortId}-mockup.png`
        );
      }

      // Download JSON data
      const json = JSON.stringify(data, null, 2);
      this.downloadFile(json, `request-${shortId}-data.json`, 'application/json');
      
      console.log('✅ Downloaded request with images:', requestId);
      alert('✅ Downloaded request with all image files!');
      
    } catch (error) {
      console.error('❌ Error downloading request:', error);
      alert('Failed to download request: ' + error.message);
    }
  },

  /**
   * Download actual image file from URL or base64 data
   */
  async downloadImageFile(imageUrl, filename) {
    try {
      let blob;
      
      if (imageUrl.startsWith('data:')) {
        // Handle base64 data URLs
        const response = await fetch(imageUrl);
        blob = await response.blob();
      } else if (imageUrl.startsWith('http')) {
        // Handle regular URLs
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        blob = await response.blob();
      } else {
        throw new Error('Invalid image URL format');
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      console.log('📸 Downloaded image:', filename);
      
    } catch (error) {
      console.error('❌ Error downloading image:', filename, error);
      throw error;
    }
  },

  /**
   * Download all images only (without CSV/JSON data)
   */
  async downloadAllImages() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('id, design_image_url, mockup_image_url, customer_name, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('📸 Preparing to download', data.length, 'requests worth of images...');

      for (let i = 0; i < data.length; i++) {
        const request = data[i];
        const requestId = request.id.slice(-8);
        const customerName = request.customer_name.replace(/[^a-zA-Z0-9]/g, '-');
        const date = new Date(request.created_at).toISOString().split('T')[0];
        
        try {
          // Download design image
          if (request.design_image_url) {
            await this.downloadImageFile(
              request.design_image_url, 
              `${date}-${customerName}-${requestId}-design.png`
            );
          }
          
          // Download mockup image
          if (request.mockup_image_url) {
            await this.downloadImageFile(
              request.mockup_image_url, 
              `${date}-${customerName}-${requestId}-mockup.png`
            );
          }
          
          console.log(`✅ Downloaded images for ${customerName} (${i + 1}/${data.length})`);
          
        } catch (imageError) {
          console.warn(`⚠️ Could not download images for ${customerName}:`, imageError);
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      console.log('✅ Downloaded all images!');
      alert(`✅ Downloaded all images from ${data.length} requests!`);
      
    } catch (error) {
      console.error('❌ Error downloading images:', error);
      alert('Failed to download images: ' + error.message);
    }
  }
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Download all requests as CSV WITH ACTUAL IMAGE FILES
// DownloadRequests.downloadAllRequestsAsCSV();

// Download pending requests WITH IMAGES
// DownloadRequests.downloadPendingRequestsAsCSV();

// Download ONLY images from all requests
// DownloadRequests.downloadAllImages();

// Download specific request WITH IMAGES
// DownloadRequests.downloadRequestById('c5c9a494-5736-4387-9db0-58f724559de4');

// Download customer contact list (no images)
// DownloadRequests.downloadCustomerListAsCSV();

// Download as JSON (no images)
// DownloadRequests.downloadAllRequestsAsJSON();
