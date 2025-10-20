/**
 * Background Remover for Custom T-Shirt Studio
 * Removes solid-color backgrounds from uploaded design images
 */

(function() {
  'use strict';
  
  // Wait for the mockup object to be available
  function initBackgroundRemover() {
    // Find the mockup object (it's initialized in custom-tshirt-studio.liquid)
    const checkMockup = setInterval(() => {
      if (window.mockupInstance) {
        clearInterval(checkMockup);
        attachBackgroundRemover(window.mockupInstance);
      }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => clearInterval(checkMockup), 10000);
  }
  
  function attachBackgroundRemover(mockup) {
    // Add the removeBackground method to the mockup instance
    mockup.removeBackground = function() {
      const img = document.querySelector(`img[src*="blob:"], img[src*="data:image"]`);
      const overlay = document.querySelector('[id*="nt-overlay"] img');
      const targetImg = overlay || img;
      
      if (!targetImg || !this.placementState?.hasUploadedDesign) {
        this.showMessage('❌ Please upload a design first', 'error');
        return;
      }
      
      console.log('✂️ Starting background removal...');
      this.showMessage('✂️ Processing... This may take a moment', 'info');
      
      try {
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match image
        canvas.width = targetImg.naturalWidth || targetImg.width;
        canvas.height = targetImg.naturalHeight || targetImg.height;
        
        // Draw the original image
        ctx.drawImage(targetImg, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Ask user for background color to remove
        const bgColor = prompt(
          'Enter background color to remove:\n\n' +
          'Options:\n' +
          '• "white" (default)\n' +
          '• "black"\n' +
          '• Custom hex like "#FF0000"\n\n' +
          'Leave empty for white:',
          'white'
        );
        
        if (bgColor === null) {
          this.showMessage('❌ Background removal cancelled', 'info');
          return;
        }
        
        // Parse target color
        let targetR = 255, targetG = 255, targetB = 255; // Default white
        
        if (bgColor.toLowerCase() === 'black') {
          targetR = targetG = targetB = 0;
        } else if (bgColor.startsWith('#')) {
          const hex = bgColor.replace('#', '');
          targetR = parseInt(hex.substr(0, 2), 16);
          targetG = parseInt(hex.substr(2, 2), 16);
          targetB = parseInt(hex.substr(4, 2), 16);
        }
        
        // Sensitivity threshold
        const threshold = 40; // Adjust for more/less aggressive removal
        
        // Process each pixel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate color difference (Euclidean distance in RGB space)
          const diff = Math.sqrt(
            Math.pow(r - targetR, 2) +
            Math.pow(g - targetG, 2) +
            Math.pow(b - targetB, 2)
          );
          
          // If color is similar to target, make it transparent
          if (diff < threshold) {
            data[i + 3] = 0; // Fully transparent
          } else if (diff < threshold * 2) {
            // Feather the edges for smoother removal
            const alpha = ((diff - threshold) / threshold) * 255;
            data[i + 3] = Math.min(data[i + 3], alpha);
          }
        }
        
        // Put the processed image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to PNG and update the image
        const processedDataUrl = canvas.toDataURL('image/png');
        targetImg.src = processedDataUrl;
        
        console.log('✅ Background removed successfully');
        this.showMessage('✂️ Background removed! Your design now has a transparent background.', 'success');
        
      } catch (error) {
        console.error('❌ Error removing background:', error);
        this.showMessage('❌ Could not remove background. Try re-uploading your image.', 'error');
      }
    };
    
    console.log('✅ Background remover attached to mockup');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundRemover);
  } else {
    initBackgroundRemover();
  }
  
})();

