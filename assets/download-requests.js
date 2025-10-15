// ============================================================================
// DOWNLOAD CUSTOM T-SHIRT REQUESTS
// ============================================================================
// JavaScript functions to download request data from the browser

window.DownloadRequests = {
  
  /**
   * Download all requests as CSV
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

      // Convert to CSV format
      const csv = this.convertToCSV(data);
      
      // Download the file
      this.downloadFile(csv, 'custom-tshirt-requests.csv', 'text/csv');
      
      console.log('✅ Downloaded', data.length, 'requests as CSV');
      
    } catch (error) {
      console.error('❌ Error downloading requests:', error);
      alert('Failed to download requests: ' + error.message);
    }
  },

  /**
   * Download pending requests as CSV
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

      const csv = this.convertToCSV(data);
      this.downloadFile(csv, 'pending-requests.csv', 'text/csv');
      
      console.log('✅ Downloaded', data.length, 'pending requests as CSV');
      
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
   * Download specific request by ID
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

      const json = JSON.stringify(data, null, 2);
      this.downloadFile(json, `request-${requestId}.json`, 'application/json');
      
      console.log('✅ Downloaded request:', requestId);
      
    } catch (error) {
      console.error('❌ Error downloading request:', error);
      alert('Failed to download request: ' + error.message);
    }
  }
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Download all requests as CSV
// DownloadRequests.downloadAllRequestsAsCSV();

// Download pending requests only
// DownloadRequests.downloadPendingRequestsAsCSV();

// Download customer contact list
// DownloadRequests.downloadCustomerListAsCSV();

// Download as JSON
// DownloadRequests.downloadAllRequestsAsJSON();

// Download specific request
// DownloadRequests.downloadRequestById('c5c9a494-5736-4387-9db0-58f724559de4');
