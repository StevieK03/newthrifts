// ============================================================================
// EXTRACT MOCKUP URLs FROM SUBMITTED REQUESTS
// ============================================================================
// JavaScript functions to extract and download mockup image URLs

window.ExtractMockupUrls = {
  
  /**
   * Extract all mockup URLs from submitted requests
   */
  async extractAllMockupUrls() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('id, customer_name, customer_email, mockup_image_url, created_at')
        .not('mockup_image_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('📸 Found', data.length, 'requests with mockup URLs');

      // Create array of mockup URLs with metadata
      const mockupUrls = data.map(request => ({
        requestId: request.id,
        shortId: request.id.slice(-8),
        customerName: request.customer_name,
        customerEmail: request.customer_email,
        mockupUrl: request.mockup_image_url,
        submittedDate: request.created_at
      }));

      // Display URLs in console
      console.log('📋 Mockup URLs extracted:');
      mockupUrls.forEach((item, index) => {
        console.log(`${index + 1}. ${item.customerName} (${item.shortId}):`);
        console.log(`   URL: ${item.mockupUrl}`);
        console.log(`   Date: ${item.submittedDate}`);
        console.log('---');
      });

      // Create downloadable text file with URLs
      const urlList = mockupUrls.map(item => 
        `${item.customerName} (${item.shortId})\n${item.mockupUrl}\nSubmitted: ${item.submittedDate}\n`
      ).join('\n');

      this.downloadFile(urlList, 'mockup-urls.txt', 'text/plain');

      console.log('✅ Extracted', mockupUrls.length, 'mockup URLs');
      alert(`✅ Extracted ${mockupUrls.length} mockup URLs and saved to file!`);

      return mockupUrls;

    } catch (error) {
      console.error('❌ Error extracting mockup URLs:', error);
      alert('Failed to extract mockup URLs: ' + error.message);
    }
  },

  /**
   * Extract mockup URLs for pending requests only
   */
  async extractPendingMockupUrls() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('id, customer_name, customer_email, mockup_image_url, created_at')
        .eq('status', 'pending')
        .not('mockup_image_url', 'is', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('📸 Found', data.length, 'pending requests with mockup URLs');

      const pendingUrls = data.map(request => ({
        requestId: request.id,
        shortId: request.id.slice(-8),
        customerName: request.customer_name,
        customerEmail: request.customer_email,
        mockupUrl: request.mockup_image_url,
        submittedDate: request.created_at
      }));

      // Display URLs in console
      console.log('📋 Pending Mockup URLs:');
      pendingUrls.forEach((item, index) => {
        console.log(`${index + 1}. ${item.customerName} (${item.shortId}):`);
        console.log(`   URL: ${item.mockupUrl}`);
        console.log('---');
      });

      // Create downloadable text file
      const urlList = pendingUrls.map(item => 
        `${item.customerName} (${item.shortId})\n${item.mockupUrl}\nSubmitted: ${item.submittedDate}\n`
      ).join('\n');

      this.downloadFile(urlList, 'pending-mockup-urls.txt', 'text/plain');

      console.log('✅ Extracted', pendingUrls.length, 'pending mockup URLs');
      alert(`✅ Extracted ${pendingUrls.length} pending mockup URLs!`);

      return pendingUrls;

    } catch (error) {
      console.error('❌ Error extracting pending mockup URLs:', error);
      alert('Failed to extract pending mockup URLs: ' + error.message);
    }
  },

  /**
   * Extract mockup URLs as CSV format
   */
  async extractMockupUrlsAsCSV() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('id, customer_name, customer_email, mockup_image_url, created_at, status')
        .not('mockup_image_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert to CSV format
      const csvHeaders = 'Request ID,Short ID,Customer Name,Email,Status,Submitted Date,Mockup URL';
      const csvRows = data.map(request => {
        const shortId = request.id.slice(-8);
        return `"${request.id}","${shortId}","${request.customer_name}","${request.customer_email}","${request.status}","${request.created_at}","${request.mockup_image_url}"`;
      });

      const csv = [csvHeaders, ...csvRows].join('\n');
      this.downloadFile(csv, 'mockup-urls.csv', 'text/csv');

      console.log('✅ Extracted', data.length, 'mockup URLs as CSV');
      alert(`✅ Extracted ${data.length} mockup URLs as CSV!`);

    } catch (error) {
      console.error('❌ Error extracting mockup URLs as CSV:', error);
      alert('Failed to extract mockup URLs: ' + error.message);
    }
  },

  /**
   * Extract just the URLs (plain text list)
   */
  async extractJustUrls() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('mockup_image_url')
        .not('mockup_image_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const urls = data.map(item => item.mockup_image_url);
      
      // Display URLs in console
      console.log('📋 Mockup URLs (plain list):');
      urls.forEach((url, index) => {
        console.log(`${index + 1}. ${url}`);
      });

      // Create downloadable text file with just URLs
      const urlList = urls.join('\n');
      this.downloadFile(urlList, 'mockup-urls-only.txt', 'text/plain');

      console.log('✅ Extracted', urls.length, 'mockup URLs (plain list)');
      alert(`✅ Extracted ${urls.length} mockup URLs (plain list)!`);

      return urls;

    } catch (error) {
      console.error('❌ Error extracting URLs:', error);
      alert('Failed to extract URLs: ' + error.message);
    }
  },

  /**
   * Extract URLs for specific request
   */
  async extractUrlForRequest(requestId) {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('id, customer_name, mockup_image_url, design_image_url')
        .eq('id', requestId)
        .single();

      if (error) throw error;

      console.log('📋 URLs for request', requestId, ':');
      console.log('Customer:', data.customer_name);
      console.log('Design URL:', data.design_image_url);
      console.log('Mockup URL:', data.mockup_image_url);

      // Copy mockup URL to clipboard if available
      if (data.mockup_image_url) {
        await navigator.clipboard.writeText(data.mockup_image_url);
        console.log('📋 Mockup URL copied to clipboard');
        alert('Mockup URL copied to clipboard!');
      }

      return {
        requestId: data.id,
        customerName: data.customer_name,
        designUrl: data.design_image_url,
        mockupUrl: data.mockup_image_url
      };

    } catch (error) {
      console.error('❌ Error extracting URL for request:', error);
      alert('Failed to extract URL: ' + error.message);
    }
  },

  /**
   * Download file helper function
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
  }
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Extract all mockup URLs with customer info
// ExtractMockupUrls.extractAllMockupUrls();

// Extract only pending request mockup URLs
// ExtractMockupUrls.extractPendingMockupUrls();

// Extract as CSV format
// ExtractMockupUrls.extractMockupUrlsAsCSV();

// Extract just the URLs (plain list)
// ExtractMockupUrls.extractJustUrls();

// Extract URL for specific request
// ExtractMockupUrls.extractUrlForRequest('c5c9a494-5736-4387-9db0-58f724559de4');
