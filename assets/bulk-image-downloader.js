// ============================================================================
// BULK IMAGE DOWNLOADER - Download Actual PNG/SVG/JPG Files
// ============================================================================
// This script downloads actual image files from Supabase storage URLs

window.BulkImageDownloader = {
  
  /**
   * Download all images from submitted requests
   */
  async downloadAllImages() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      // Get all requests with image URLs
      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('id, customer_name, design_image_url, mockup_image_url, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('📸 Starting bulk download of', data.length, 'requests...');

      let downloadCount = 0;
      let errorCount = 0;

      // Download images for each request
      for (let i = 0; i < data.length; i++) {
        const request = data[i];
        const requestId = request.id.slice(-8); // Short ID for filename
        const customerName = request.customer_name.replace(/[^a-zA-Z0-9]/g, '_'); // Clean filename
        
        console.log(`📥 Downloading images for request ${i + 1}/${data.length}: ${request.customer_name}`);

        try {
          // Download design image if it exists
          if (request.design_image_url) {
            const designFilename = `${customerName}_${requestId}_design.${this.getFileExtension(request.design_image_url)}`;
            await this.downloadImageFile(request.design_image_url, designFilename);
            downloadCount++;
          }

          // Download mockup image if it exists
          if (request.mockup_image_url) {
            const mockupFilename = `${customerName}_${requestId}_mockup.${this.getFileExtension(request.mockup_image_url)}`;
            await this.downloadImageFile(request.mockup_image_url, mockupFilename);
            downloadCount++;
          }

          // Small delay to prevent overwhelming the browser
          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (imageError) {
          console.warn(`⚠️ Could not download images for ${request.customer_name}:`, imageError);
          errorCount++;
        }
      }

      console.log(`✅ Bulk download complete!`);
      console.log(`📊 Downloaded: ${downloadCount} images`);
      console.log(`❌ Errors: ${errorCount} images`);
      
      alert(`✅ Bulk download complete!\n📊 Downloaded: ${downloadCount} images\n❌ Errors: ${errorCount} images`);

    } catch (error) {
      console.error('❌ Error in bulk download:', error);
      alert('Failed to download images: ' + error.message);
    }
  },

  /**
   * Download only mockup images
   */
  async downloadMockupImagesOnly() {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('id, customer_name, mockup_image_url, created_at')
        .not('mockup_image_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('📸 Starting mockup image download of', data.length, 'requests...');

      let downloadCount = 0;

      for (let i = 0; i < data.length; i++) {
        const request = data[i];
        const requestId = request.id.slice(-8);
        const customerName = request.customer_name.replace(/[^a-zA-Z0-9]/g, '_');

        try {
          const mockupFilename = `${customerName}_${requestId}_mockup.${this.getFileExtension(request.mockup_image_url)}`;
          await this.downloadImageFile(request.mockup_image_url, mockupFilename);
          downloadCount++;

          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (imageError) {
          console.warn(`⚠️ Could not download mockup for ${request.customer_name}:`, imageError);
        }
      }

      console.log(`✅ Mockup download complete! Downloaded: ${downloadCount} images`);
      alert(`✅ Mockup download complete!\n📊 Downloaded: ${downloadCount} mockup images`);

    } catch (error) {
      console.error('❌ Error downloading mockups:', error);
      alert('Failed to download mockups: ' + error.message);
    }
  },

  /**
   * Download images for specific request
   */
  async downloadRequestImages(requestId) {
    try {
      const client = window.supabaseClient;
      if (!client) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await client
        .from('custom_tshirt_requests')
        .select('id, customer_name, design_image_url, mockup_image_url')
        .eq('id', requestId)
        .single();

      if (error) throw error;

      const shortId = data.id.slice(-8);
      const customerName = data.customer_name.replace(/[^a-zA-Z0-9]/g, '_');

      console.log(`📥 Downloading images for ${data.customer_name} (${shortId})`);

      let downloadCount = 0;

      // Download design image
      if (data.design_image_url) {
        const designFilename = `${customerName}_${shortId}_design.${this.getFileExtension(data.design_image_url)}`;
        await this.downloadImageFile(data.design_image_url, designFilename);
        downloadCount++;
      }

      // Download mockup image
      if (data.mockup_image_url) {
        const mockupFilename = `${customerName}_${shortId}_mockup.${this.getFileExtension(data.mockup_image_url)}`;
        await this.downloadImageFile(data.mockup_image_url, mockupFilename);
        downloadCount++;
      }

      console.log(`✅ Downloaded ${downloadCount} images for ${data.customer_name}`);
      alert(`✅ Downloaded ${downloadCount} images for ${data.customer_name}`);

    } catch (error) {
      console.error('❌ Error downloading request images:', error);
      alert('Failed to download request images: ' + error.message);
    }
  },

  /**
   * Download individual image file
   */
  async downloadImageFile(imageUrl, filename) {
    try {
      // Handle base64 data URLs
      if (imageUrl.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Handle regular URLs
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      console.log(`✅ Downloaded: ${filename}`);

    } catch (error) {
      console.error(`❌ Failed to download ${filename}:`, error);
      throw error;
    }
  },

  /**
   * Get file extension from URL
   */
  getFileExtension(url) {
    // Handle base64 data URLs
    if (url.startsWith('data:')) {
      const mimeType = url.split(',')[0].split(':')[1].split(';')[0];
      switch (mimeType) {
        case 'image/png': return 'png';
        case 'image/jpeg': return 'jpg';
        case 'image/jpg': return 'jpg';
        case 'image/svg+xml': return 'svg';
        case 'image/gif': return 'gif';
        case 'image/webp': return 'webp';
        default: return 'png';
      }
    }

    // Handle regular URLs
    const urlPath = url.split('?')[0]; // Remove query parameters
    const extension = urlPath.split('.').pop().toLowerCase();
    
    // Validate extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'];
    return validExtensions.includes(extension) ? extension : 'png';
  }
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Download all images (design + mockup) from all requests
// BulkImageDownloader.downloadAllImages();

// Download only mockup images from all requests
// BulkImageDownloader.downloadMockupImagesOnly();

// Download images for specific request
// BulkImageDownloader.downloadRequestImages('c5c9a494-5736-4387-9db0-58f724559de4');
