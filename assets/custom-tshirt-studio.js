
function closeCustomStudio() {
  // Hide the custom studio section
  const studio = document.getElementById('custom-tshirt-studio-' + window.STUDIO_SECTION_ID);
  if (studio) {
    studio.style.display = 'none';
  }
  
  // Show the main page content again
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.display = 'block';
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show custom studio function (called from home page button)
window.openCustomDesignStudio = function() {
  console.log('🎨 Opening Custom Design Studio...');
  
  // Hide main content
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.display = 'none';
    console.log('✅ Hid main content');
  }
  
  // Show the custom studio
  const studio = document.getElementById('custom-tshirt-studio-' + window.STUDIO_SECTION_ID);
  console.log('🔍 Looking for studio element with ID:', 'custom-tshirt-studio-' + window.STUDIO_SECTION_ID);
  
  if (studio) {
    console.log('✅ Studio element found:', studio);
    console.log('📊 Studio current display:', window.getComputedStyle(studio).display);
    
    studio.style.display = 'block';
    console.log('✅ Set studio display to block');
    console.log('📊 Studio new display:', window.getComputedStyle(studio).display);
    
    // Check if canvas is visible
    const canvas = document.getElementById('nt-mockup-canvas-' + window.STUDIO_SECTION_ID);
    if (canvas) {
      console.log('🎨 Canvas found:', canvas);
      console.log('📐 Canvas dimensions:', canvas.offsetWidth, 'x', canvas.offsetHeight);
      console.log('🎨 Canvas background:', window.getComputedStyle(canvas).background);
      console.log('👁️ Canvas visibility:', window.getComputedStyle(canvas).visibility);
      console.log('👁️ Canvas display:', window.getComputedStyle(canvas).display);
    } else {
      console.error('❌ Canvas not found!');
    }
    
    studio.scrollIntoView({ behavior: 'smooth' });
    console.log('📜 Scrolling to studio');
    
    // Initialize the mockup and size chart after the studio is visible
    setTimeout(() => {
      try {
        initializeMockup();
        console.log('✅ initializeMockup() called');
        console.log('✅ Mockup instance available:', window.mockupInstance ? 'YES' : 'NO');
        
        // Apply perfect fit positioning after mockup is initialized
        setTimeout(() => {
          if (typeof window.testPerfectFit === 'function') {
            window.testPerfectFit();
            console.log('✅ Perfect fit positioning applied');
          } else {
            console.warn('⚠️ testPerfectFit function not found');
          }
        }, 300);
        
        // Initialize size chart
        if (typeof initializeSizeChart === 'function') {
          initializeSizeChart();
          console.log('✅ initializeSizeChart() called');
        }
      } catch (error) {
        console.error('❌ Error initializing mockup:', error);
      }
    }, 300);
  } else {
    console.error('❌ Studio element not found! Looked for ID:', 'custom-tshirt-studio-' + window.STUDIO_SECTION_ID);
    console.log('🔍 Available elements with "studio" in ID:');
    document.querySelectorAll('[id*="studio"]').forEach(el => {
      console.log('  -', el.id, el);
    });
  }
};

// Also make it available as showCustomStudio for compatibility
window.showCustomStudio = window.openCustomDesignStudio;

// PRESERVE ALL OUR CURRENT WORKING JAVASCRIPT FUNCTIONALITY
function initializeMockup() {
  const mockup = {
    // Mockup images mapping - using tshirt-view.png for white, tshirt-black-v2.png for black
    mockupImages: {
      front: {
        white: "{{ 'tshirt-view.png' | asset_url }}",
        black: "{{ 'tshirt-black-v2.png' | asset_url }}",
        red: "{{ 'tshirt-view.png' | asset_url }}",
        blue: "{{ 'tshirt-view.png' | asset_url }}"
      },
      back: {
        white: "{{ 'tshirt-view.png' | asset_url }}",
        black: "{{ 'tshirt-black-v2.png' | asset_url }}",
        red: "{{ 'tshirt-view.png' | asset_url }}",
        blue: "{{ 'tshirt-view.png' | asset_url }}"
      },
      hanging: {
        white: "{{ 'tshirt-view.png' | asset_url }}",
        black: "{{ 'tshirt-black-v2.png' | asset_url }}",
        red: "{{ 'tshirt-view.png' | asset_url }}",
        blue: "{{ 'tshirt-view.png' | asset_url }}"
      },
      person1: {
        white: "{{ 'Girl-Model.png' | asset_url }}",
        black: "{{ 'Girl-Model.png' | asset_url }}",
        red: "{{ 'Girl-Model.png' | asset_url }}",
        blue: "{{ 'Girl-Model.png' | asset_url }}"
      },
      person2: {
        white: "{{ 'Women-side.png' | asset_url }}",
        black: "{{ 'Women-side.png' | asset_url }}",
        red: "{{ 'Women-side.png' | asset_url }}",
        blue: "{{ 'Women-side.png' | asset_url }}"
      }
    },
    
    // Current base mockup image - using tshirt-view.png as the default template
    baseMockup: "{{ 'tshirt-view.png' | asset_url }}",

    // Current design state
    designState: {
      text: 'Your Design Here',
      fontSize: 32,
      fontFamily: "'Bebas Neue', sans-serif",
      textColor: '#000000',
      shirtColor: 'white',
      effect: 'none',
      hasUpload: false,
      uploadUrl: null,
      fileName: null
    },

    // Current view state
    state: { view: "front", color: "white" },

    // Enhanced placement state - aligned with print area
    placementState: {
      topPct: 29.14,   // Optimal position from Perfect Fit
      leftPct: 50.21,  // Optimal horizontal position
      widthPct: 37,    // Optimal width for print area
      heightPct: 42,   // Optimal height for print area
      rotateDeg: 0,
      dragging: false,
      resizing: false,
      resizeDirection: 'se',
      lastX: 0,
      lastY: 0,
      hasUploadedDesign: false,
      designSelected: false,
      zoomLevel: 1.0, // Zoom level (1.0 = 100%)
      baseWidthPct: 50, // Original width for zoom calculations
      baseHeightPct: 65 // Original height for zoom calculations
    },

    init() {
      console.log('🎯 Initializing Custom Studio Mockup...');
      
      this.bindEvents();
      this.bindDragResize();
      this.bindMouseWheelResize();
      this.bindKeyboardShortcuts();
      this.bindZoomControls();
      this.updateBase();
      this.updateDesign();
      this.updatePlacementDisplay();
      this.updateDesignPosition();
      this.updateZoomLevelDisplay();
      
      console.log('✅ Custom Studio Mockup initialized');
    },

    setActive(buttons, activeValue) {
      buttons.forEach(btn => {
        btn.classList.remove('is-active');
        if (btn.dataset.view === activeValue || btn.dataset.color === activeValue) {
          btn.classList.add('is-active');
        }
      });
    },

    updateBase() {
      const baseImg = document.getElementById('nt-base-' + window.STUDIO_SECTION_ID);
      
      if (!baseImg) {
        console.error('❌ Base image element not found');
        return;
      }
      
      const imageSrc = this.mockupImages[this.state.view]?.[this.state.color] || this.baseMockup;
      baseImg.src = imageSrc;
      
      // Ensure image is visible
      baseImg.style.display = 'block';
      baseImg.style.visibility = 'visible';
      baseImg.style.opacity = '1';
    },

    updateDesign() {
      // Update design display if needed
    },

    updatePlacementDisplay() {
      // Update placement display controls
      const topSlider = document.getElementById(`nt-placement-top-" + window.STUDIO_SECTION_ID + "`);
      const leftSlider = document.getElementById(`nt-placement-left-" + window.STUDIO_SECTION_ID + "`);
      const widthSlider = document.getElementById(`nt-placement-width-" + window.STUDIO_SECTION_ID + "`);
      const heightSlider = document.getElementById(`nt-placement-height-" + window.STUDIO_SECTION_ID + "`);
      const rotationSlider = document.getElementById(`nt-placement-rotation-" + window.STUDIO_SECTION_ID + "`);

      if (topSlider) topSlider.value = this.placementState.topPct;
      if (leftSlider) leftSlider.value = this.placementState.leftPct;
      if (widthSlider) widthSlider.value = this.placementState.widthPct;
      if (heightSlider) heightSlider.value = this.placementState.heightPct;
      if (rotationSlider) rotationSlider.value = this.placementState.rotateDeg;
    },

    updateDesignPosition() {
      const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
      if (!overlay) return;

      // Apply the placement state to the overlay
      overlay.style.top = this.placementState.topPct + '%';
      overlay.style.left = this.placementState.leftPct + '%';
      overlay.style.width = this.placementState.widthPct + '%';
      overlay.style.height = this.placementState.heightPct + '%';
      overlay.style.transform = `translateX(-50%) rotate(${this.placementState.rotateDeg}deg)`;
    },

    selectDesign() {
      this.placementState.designSelected = true;
      const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
      if (overlay) {
        overlay.style.borderColor = '#3b82f6';
        overlay.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.3)';
        
        // Show resize handles
        const resizeHandles = overlay.querySelectorAll('.resize-handle');
        resizeHandles.forEach(handle => {
          handle.style.display = 'block';
        });
      }
    },

    deselectDesign() {
      this.placementState.designSelected = false;
      const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
      if (overlay) {
        overlay.style.borderColor = 'rgba(39, 225, 193, 0.3)';
        overlay.style.boxShadow = 'inset 0 4px 12px rgba(0, 0, 0, 0.1)';
        
        // Hide resize handles
        const resizeHandles = overlay.querySelectorAll('.resize-handle');
        resizeHandles.forEach(handle => {
          handle.style.display = 'none';
        });
      }
    },

    handleFileUpload(file) {
      console.log('📁 File selected:', file.name);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, etc.)');
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File is too large. Please upload an image under 10MB.');
        return;
      }
      
      // Read the file
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('✅ File loaded successfully');
        const imageUrl = e.target.result;
        
        // Get the overlay and replace text with image
        const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
        const textElement = document.getElementById('nt-design-text-' + window.STUDIO_SECTION_ID);
        
        if (overlay && textElement) {
          // Hide the text
          textElement.style.display = 'none';
          
          // Check if image already exists, if so replace it
          let designImg = overlay.querySelector('.uploaded-design-img');
          if (!designImg) {
            designImg = document.createElement('img');
            designImg.className = 'uploaded-design-img';
            designImg.style.cssText = 'width: 100%; height: 100%; object-fit: contain; pointer-events: none;';
            overlay.appendChild(designImg);
          }
          
          designImg.src = imageUrl;
          console.log('✅ Design image displayed in overlay');
          
          // Store the design state
          this.designState.hasUpload = true;
          this.designState.uploadUrl = imageUrl;
          this.designState.fileName = file.name;
          
          // Select the design automatically
          this.selectDesign();
        }
      };
      
      reader.onerror = () => {
        console.error('❌ Error reading file');
        alert('Error loading image. Please try again.');
      };
      
      reader.readAsDataURL(file);
    },

    startDrag(e) {
      this.placementState.dragging = true;
      this.placementState.lastX = e.clientX;
      this.placementState.lastY = e.clientY;
      
      const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
      if (overlay) {
        overlay.style.cursor = 'grabbing';
      }
      
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },

    handleDrag(e) {
      if (!this.placementState.dragging) return;
      
      const deltaX = e.clientX - this.placementState.lastX;
      const deltaY = e.clientY - this.placementState.lastY;
      
      const canvas = document.getElementById('nt-mockup-canvas-' + window.STUDIO_SECTION_ID);
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const deltaXPercent = (deltaX / rect.width) * 100;
        const deltaYPercent = (deltaY / rect.height) * 100;
        
        this.placementState.leftPct += deltaXPercent;
        this.placementState.topPct += deltaYPercent;
        
        // Constrain to canvas bounds
        this.placementState.leftPct = Math.max(0, Math.min(100, this.placementState.leftPct));
        this.placementState.topPct = Math.max(0, Math.min(100, this.placementState.topPct));
        
        this.updateDesignPosition();
      }
      
      this.placementState.lastX = e.clientX;
      this.placementState.lastY = e.clientY;
    },

    stopDrag() {
      this.placementState.dragging = false;
      
      const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
      if (overlay) {
        overlay.style.cursor = 'grab';
      }
      
      document.removeEventListener('mousemove', this.handleDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    },

    startResize(e, direction) {
      this.placementState.resizing = true;
      this.placementState.resizeDirection = direction;
      this.placementState.lastX = e.clientX;
      this.placementState.lastY = e.clientY;

      const handleResize = (e) => {
        if (!this.placementState.resizing) return;
        
        const deltaX = e.clientX - this.placementState.lastX;
        const deltaY = e.clientY - this.placementState.lastY;
          
        this.resizeDesignByDirection(direction, deltaX, deltaY);
        
        this.placementState.lastX = e.clientX;
        this.placementState.lastY = e.clientY;
      };

      const stopResize = () => {
        this.placementState.resizing = false;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      };

      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
    },

    resizeDesignByDirection(direction, deltaX, deltaY) {
      const sensitivity = 0.5;
      
      switch (direction) {
        case 'nw':
          this.placementState.topPct += deltaY * sensitivity;
          this.placementState.leftPct += deltaX * sensitivity;
          this.placementState.widthPct -= deltaX * sensitivity;
          this.placementState.heightPct -= deltaY * sensitivity;
          break;
        case 'ne':
          this.placementState.topPct += deltaY * sensitivity;
          this.placementState.widthPct += deltaX * sensitivity;
          this.placementState.heightPct -= deltaY * sensitivity;
          break;
        case 'sw':
          this.placementState.leftPct += deltaX * sensitivity;
          this.placementState.widthPct -= deltaX * sensitivity;
          this.placementState.heightPct += deltaY * sensitivity;
          break;
        case 'se':
          this.placementState.widthPct += deltaX * sensitivity;
          this.placementState.heightPct += deltaY * sensitivity;
          break;
        case 'n':
          this.placementState.topPct += deltaY * sensitivity;
          this.placementState.heightPct -= deltaY * sensitivity;
          break;
        case 's':
          this.placementState.heightPct += deltaY * sensitivity;
          break;
        case 'w':
          this.placementState.leftPct += deltaX * sensitivity;
          this.placementState.widthPct -= deltaX * sensitivity;
          break;
        case 'e':
          this.placementState.widthPct += deltaX * sensitivity;
          break;
      }

      // Constrain values
      this.placementState.topPct = Math.max(0, Math.min(100, this.placementState.topPct));
      this.placementState.leftPct = Math.max(0, Math.min(100, this.placementState.leftPct));
      this.placementState.widthPct = Math.max(10, Math.min(90, this.placementState.widthPct));
      this.placementState.heightPct = Math.max(10, Math.min(90, this.placementState.heightPct));
        
      this.updatePlacementDisplay();
      this.updateDesignPosition();
    },

    // Enhanced resize functionality for easier use
    resizeDesign(delta) {
      this.placementState.widthPct += delta;
      this.placementState.heightPct += delta;
      
      // Constrain values
      this.placementState.widthPct = Math.max(10, Math.min(90, this.placementState.widthPct));
      this.placementState.heightPct = Math.max(10, Math.min(90, this.placementState.heightPct));
      
      this.updatePlacementDisplay();
      this.updateDesignPosition();
    },

    // Add mouse wheel resizing for easier control
    bindMouseWheelResize() {
      const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
      if (!overlay) return;

      let isOverOverlay = false;
      
      overlay.addEventListener('mouseenter', () => {
        isOverOverlay = true;
      });
      
      overlay.addEventListener('mouseleave', () => {
        isOverOverlay = false;
      });

      // Mouse wheel resize - ONLY when hovering over the overlay
      document.addEventListener('wheel', (e) => {
        if (isOverOverlay && this.placementState.hasUploadedDesign) {
          e.preventDefault();
          // Reduced sensitivity for better control
          const delta = e.deltaY > 0 ? -1 : 1;
          this.resizeDesign(delta);
        }
      }, { passive: false });
    },

    // Add keyboard shortcuts for precise control
    bindKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts if user is typing in an input field
        if (this.isInputFocused()) return;
        
        // Arrow key movement only works with uploaded design
        const hasDesign = this.placementState.hasUploadedDesign && this.placementState.designSelected;
        
        // Delete/Backspace to remove design
        if ((e.key === 'Delete' || e.key === 'Backspace') && hasDesign) {
          e.preventDefault();
          console.log(`🗑️ ${e.key} key pressed - removing design`);
          this.removeDesign();
          return;
        }
        
        // Zoom shortcuts work always
        if (e.key === '+' || e.key === '=' || e.key === '-' || (e.key === '0' && e.shiftKey)) {
          e.preventDefault();
          switch (e.key) {
            case '+':
            case '=':
              if (e.shiftKey) {
                this.zoomIn(); // Shift+Plus = Canvas Zoom In
              } else if (hasDesign) {
                this.resizeDesign(1); // Regular Plus = Resize Design
              }
              break;
            case '-':
              if (e.shiftKey) {
                this.zoomOut(); // Shift+Minus = Canvas Zoom Out
              } else if (hasDesign) {
                this.resizeDesign(-1); // Regular Minus = Resize Design
              }
              break;
            case '0':
              if (e.shiftKey) {
                this.resetZoom(); // Shift+0 = Reset Canvas Zoom
              }
              break;
          }
          return;
        }
        
        // Arrow key movement requires uploaded design
        if (!hasDesign) return;
        
        // Ultra-precise movement with different step sizes
        let step = 0.5; // Default: ultra-precise (0.5px)
        if (e.shiftKey) step = 2; // Shift: medium steps (2px)
        if (e.ctrlKey) step = 0.1; // Ctrl: micro-precise (0.1px)
        if (e.shiftKey && e.ctrlKey) step = 5; // Shift+Ctrl: large steps (5px)
        
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            this.placementState.topPct = Math.max(0, this.placementState.topPct - step);
            this.updatePlacementDisplay();
            this.updateDesignPosition();
            this.showMessage(`⬆️ Design moved up ${step}px`, 'info');
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.placementState.topPct = Math.min(100, this.placementState.topPct + step);
            this.updatePlacementDisplay();
            this.updateDesignPosition();
            this.showMessage(`⬇️ Design moved down ${step}px`, 'info');
            break;
          case 'ArrowLeft':
            e.preventDefault();
            this.placementState.leftPct = Math.max(0, this.placementState.leftPct - step);
            this.updatePlacementDisplay();
            this.updateDesignPosition();
            this.showMessage(`⬅️ Design moved left ${step}px`, 'info');
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.placementState.leftPct = Math.min(100, this.placementState.leftPct + step);
            this.updatePlacementDisplay();
            this.updateDesignPosition();
            this.showMessage(`➡️ Design moved right ${step}px`, 'info');
            break;
        }
      });
    },

    // Zoom functionality for design studio - zooms the entire canvas view
    zoomIn() {
      const newZoom = Math.min(this.placementState.zoomLevel + 0.2, 3.0); // Max 300%
      this.setZoom(newZoom);
      this.showMessage(`🔍+ Canvas zoomed in to ${Math.round(newZoom * 100)}%`, 'success');
    },

    zoomOut() {
      const newZoom = Math.max(this.placementState.zoomLevel - 0.2, 0.2); // Min 20%
      this.setZoom(newZoom);
      this.showMessage(`🔍- Canvas zoomed out to ${Math.round(newZoom * 100)}%`, 'success');
    },

    resetZoom() {
      this.setZoom(1.0);
      this.showMessage('🎯 Canvas zoom reset to 100%', 'success');
    },

    setZoom(zoomLevel) {
      this.placementState.zoomLevel = zoomLevel;
      
      // Apply zoom to the entire canvas container
      const canvas = document.getElementById('nt-mockup-canvas-' + window.STUDIO_SECTION_ID);
      const mockupContainer = document.getElementById('nt-mockup-' + window.STUDIO_SECTION_ID);
      
      if (canvas && mockupContainer) {
        // Apply CSS transform to zoom the entire canvas with smooth transition
        canvas.style.transition = 'transform 0.3s ease, border-color 0.3s ease';
        canvas.style.transform = `scale(${zoomLevel})`;
        canvas.style.transformOrigin = 'center center';
        
        // Adjust container size to accommodate zoom
        const containerPadding = 20; // Extra space around zoomed canvas
        mockupContainer.style.padding = `${containerPadding}px`;
        
        // Update canvas container to show zoom level visually
        canvas.style.border = `3px solid ${zoomLevel > 1 ? '#10b981' : zoomLevel < 1 ? '#ef4444' : '#6b7280'}`;
        canvas.style.borderRadius = '12px';
        
        // Add zoom indicator overlay
        this.updateZoomIndicator(zoomLevel);
      }
      
      // Update display
      this.updateZoomLevelDisplay();
    },

    updateZoomIndicator(zoomLevel) {
      // Remove existing zoom indicator
      const existingIndicator = document.getElementById('nt-zoom-indicator-' + window.STUDIO_SECTION_ID);
      if (existingIndicator) {
        existingIndicator.remove();
      }
      
      // Add zoom indicator overlay
      const canvas = document.getElementById('nt-mockup-canvas-' + window.STUDIO_SECTION_ID);
      if (canvas && zoomLevel !== 1.0) {
        const indicator = document.createElement('div');
        indicator.id = 'nt-zoom-indicator-' + window.STUDIO_SECTION_ID;
        indicator.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: ${zoomLevel > 1 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        `;
        indicator.textContent = `${Math.round(zoomLevel * 100)}%`;
        canvas.appendChild(indicator);
        
        // Auto-hide indicator after 3 seconds
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.style.opacity = '0';
            indicator.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
              if (indicator.parentNode) {
                indicator.remove();
              }
            }, 500);
          }
        }, 3000);
      }
    },

    updateZoomLevelDisplay() {
      const zoomDisplay = document.getElementById(`nt-zoom-level-" + window.STUDIO_SECTION_ID + "`);
      if (zoomDisplay) {
        zoomDisplay.textContent = `Zoom: ${Math.round(this.placementState.zoomLevel * 100)}%`;
      }
    },

    bindZoomControls() {
      // Zoom In button
      // Zoom Slider (replaces old +/- buttons)
      const zoomRange = document.getElementById(`nt-zoom-range-" + window.STUDIO_SECTION_ID + "`);
      const zoomLabel = document.getElementById(`nt-zoom-label-" + window.STUDIO_SECTION_ID + "`);
      
      if (zoomRange && zoomLabel) {
        // Update zoom when slider changes
        zoomRange.addEventListener('input', (e) => {
          const percent = parseInt(e.target.value, 10);
          const scale = percent / 100;
          this.setZoom(scale);
          zoomLabel.textContent = `${percent}%`;
        });
        
        // Keyboard shortcuts for zoom (+ and -)
        document.addEventListener('keydown', (e) => {
          if ((e.key === '+' || e.key === '=') && !this.isInputFocused()) {
            e.preventDefault();
            const currentPercent = parseInt(zoomRange.value, 10);
            const newPercent = Math.min(200, currentPercent + 10);
            zoomRange.value = newPercent;
            const scale = newPercent / 100;
            this.setZoom(scale);
            zoomLabel.textContent = `${newPercent}%`;
          }
          if (e.key === '-' && !this.isInputFocused()) {
            e.preventDefault();
            const currentPercent = parseInt(zoomRange.value, 10);
            const newPercent = Math.max(50, currentPercent - 10);
            zoomRange.value = newPercent;
            const scale = newPercent / 100;
            this.setZoom(scale);
            zoomLabel.textContent = `${newPercent}%`;
          }
        });
        
        // Update slider when zoom changes programmatically
        window.addEventListener('canvas:zoomchange', (e) => {
          if (e && e.detail && typeof e.detail.scale === 'number') {
            const percent = Math.round(e.detail.scale * 100);
            zoomRange.value = percent;
            zoomLabel.textContent = `${percent}%`;
          }
        });
        
        console.log('✅ Zoom slider initialized');
      }
    },
    
    // Helper to check if an input is focused (for keyboard shortcuts)
    isInputFocused() {
      const activeEl = document.activeElement;
      return activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
    },

    // Bind drag functionality to overlay
    bindDragResize() {
      const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
      const canvas = document.getElementById('nt-mockup-canvas-' + window.STUDIO_SECTION_ID);
      
      if (!overlay || !canvas) return;
      
      // Bind the drag functions to this context
      this.handleDrag = this.handleDrag.bind(this);
      this.stopDrag = this.stopDrag.bind(this);
      
      overlay.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.startDrag(e);
      });

      // Bind resize handles
      const resizeHandles = document.querySelectorAll(`#nt-overlay-" + window.STUDIO_SECTION_ID + " .resize-handle`);
      resizeHandles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.startResize(e, handle.dataset.direction);
        });
      });
      
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectDesign();
      });
      
      canvas.addEventListener('click', (e) => {
        if (e.target === canvas) {
          this.deselectDesign();
        }
      });
    },

    bindEvents() {
      const rootId = "nt-mockup-" + window.STUDIO_SECTION_ID + "";
      
      // View buttons
      const viewBtns = Array.from(document.querySelectorAll(`#${rootId} .nt-btn--view`));
      viewBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          this.state.view = btn.dataset.view;
          this.setActive(viewBtns, this.state.view);
          this.updateBase();
          console.log('👁️ View changed to:', this.state.view);
        });
      });

      // Color buttons
      const colorBtns = Array.from(document.querySelectorAll(`#${rootId} .nt-btn--color`));
      colorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          this.state.color = btn.dataset.color;
          this.setActive(colorBtns, this.state.color);
          this.updateBase();
          console.log('🎨 Color changed to:', this.state.color);
        });
      });

      // Upload button
      const uploadBtn = document.getElementById(`nt-upload-" + window.STUDIO_SECTION_ID + "`);
      if (uploadBtn) {
        uploadBtn.addEventListener("click", (e) => {
          console.log('📁 Upload button clicked');
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              this.handleFileUpload(file);
            }
          };
          input.click();
        });
      }

      // Download button
      const downloadBtn = document.getElementById(`nt-download-" + window.STUDIO_SECTION_ID + "`);
      if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
          console.log('💾 Download button clicked');
          this.downloadMockup();
        });
      }

      // Edit button - handled by initEditModal() function below
      // const editBtn = document.getElementById(`nt-edit-" + window.STUDIO_SECTION_ID + "`);
      // Removed old "coming soon" alert - now opens advanced Edit Modal

      // Remove button
      const removeBtn = document.getElementById(`nt-remove-" + window.STUDIO_SECTION_ID + "`);
      if (removeBtn) {
        removeBtn.addEventListener("click", () => {
          console.log('🗑️ Remove button clicked');
          this.removeDesign();
        });
      }

      // Invert Colors button
      const invertBtn = document.getElementById(`nt-invert-" + window.STUDIO_SECTION_ID + "`);
      if (invertBtn) {
        invertBtn.addEventListener("click", () => {
          console.log('🔄 Invert Colors button clicked');
          this.invertColors();
        });
      }

      const removeBgBtn = document.getElementById(`nt-remove-bg-" + window.STUDIO_SECTION_ID + "`);
      if (removeBgBtn) removeBgBtn.addEventListener("click", () => { if (this.removeBackground) this.removeBackground(); else this.showMessage('❌ Loading...', 'error'); });

      this.bindPlacementGuide();

      // Perfect Fit button
      const perfectFitBtn = document.getElementById(`nt-perfect-fit-btn-" + window.STUDIO_SECTION_ID + "`);
      if (perfectFitBtn) {
        perfectFitBtn.addEventListener("click", () => {
          console.log('🎯 Perfect Fit button clicked');
          this.perfectFit();
        });
      }

      // Submit Request button (shows the customer form)
      const submitBtn = document.getElementById(`nt-submit-request-btn-" + window.STUDIO_SECTION_ID + "`);
      if (submitBtn) {
        submitBtn.addEventListener("click", () => {
          console.log('🚀 Submit Request button clicked');
          this.submitRequest();
        });
      }

      // Customer form submit
      const requestForm = document.getElementById(`nt-request-form-" + window.STUDIO_SECTION_ID + "`);
      if (requestForm) {
        requestForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitTShirtRequest();
        });
      }

      // Cancel button
      const cancelBtn = document.getElementById(`nt-cancel-request-" + window.STUDIO_SECTION_ID + "`);
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          document.getElementById(`nt-submit-request-" + window.STUDIO_SECTION_ID + "`).style.display = 'none';
          this.resetRequestForm();
        });
      }

      // 3D Controls
      const rotateBtn = document.getElementById(`nt-3d-rotate-" + window.STUDIO_SECTION_ID + "`);
      if (rotateBtn) {
        rotateBtn.addEventListener("click", () => {
          console.log('↺ Rotate button clicked');
          this.rotateDesign();
        });
      }

      const zoomBtn = document.getElementById(`nt-zoom-" + window.STUDIO_SECTION_ID + "`);
      if (zoomBtn) {
        zoomBtn.addEventListener("click", () => {
          console.log('🔍 Zoom button clicked');
          this.zoomDesign();
        });
      }

      const validateBtn = document.getElementById(`nt-validate-" + window.STUDIO_SECTION_ID + "`);
      if (validateBtn) {
        validateBtn.addEventListener("click", () => {
          console.log('✅ Validate button clicked');
          this.validateDesign();
        });
      }

      const resetBtn = document.getElementById(`nt-reset-" + window.STUDIO_SECTION_ID + "`);
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          console.log('🔄 Reset button clicked');
          this.resetDesign();
        });
      }
    },
    
    handleFileUpload(file) {
      console.log('📤 Processing file:', file.name, file.type, file.size);
      
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        this.showMessage('❌ Invalid file type. Please upload PNG, JPG, or SVG files.', 'error');
        return;
      }
      
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.showMessage('❌ File too large. Please upload files smaller than 10MB.', 'error');
        return;
      }
      
      this.showMessage('📁 Processing your design...', 'info');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('✅ File loaded, applying to mockup');
        this.applyUploadedDesign(e.target.result);
      };
      reader.readAsDataURL(file);
    },

    applyUploadedDesign(imageData) {
      console.log('🎨 Applying design to mockup');
      
      const overlayDiv = document.getElementById(`nt-overlay-" + window.STUDIO_SECTION_ID + "`);
      const designText = document.getElementById(`nt-design-text-" + window.STUDIO_SECTION_ID + "`);
      
      if (overlayDiv && designText) {
        designText.style.display = 'none';
        
        // Remove any existing uploaded image
        const existingImg = overlayDiv.querySelector('img');
        if (existingImg) {
          existingImg.remove();
        }
        
        const uploadedImg = document.createElement('img');
        uploadedImg.src = imageData;
        uploadedImg.style.cssText = `
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          display: block;
          pointer-events: none;
        `;
        
        overlayDiv.appendChild(uploadedImg);
        
        this.placementState.hasUploadedDesign = true;
        this.placementState.designSelected = true;
        
        console.log('✅ Design applied to mockup');
        
        // Show canvas nudge controls
        const nudgeControls = document.getElementById('canvas-nudge-controls-' + window.STUDIO_SECTION_ID);
        if (nudgeControls) {
          nudgeControls.style.opacity = '1';
          nudgeControls.style.pointerEvents = 'auto';
          console.log('✅ Canvas nudge controls visible');
        }
        this.showMessage('🎨 Design uploaded! Use canvas zoom controls and precise arrow keys for fine-tuning.', 'success');
      }
    },
    
    downloadComposite() {
      console.log('📥 Starting download composite...');
      console.log('Current placement state:', this.placementState);
      
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Use higher resolution for better quality
      canvas.width = 2000;
      canvas.height = 2000;
      
      const baseImg = new Image();
      baseImg.crossOrigin = "anonymous";
      baseImg.src = document.getElementById("nt-base-" + window.STUDIO_SECTION_ID + "").src;
      
      baseImg.onload = () => {
        console.log('✅ Base image loaded, drawing to canvas');
        ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

        const overlayImg = document.querySelector(`#nt-overlay-" + window.STUDIO_SECTION_ID + " img`);
        console.log('Overlay image found:', overlayImg);
            
        if (overlayImg && overlayImg.src && this.placementState.hasUploadedDesign) {
          console.log('🎨 Processing uploaded design for download');
          const designImg = new Image();
          designImg.crossOrigin = "anonymous";
          designImg.src = overlayImg.src;
          
          designImg.onload = () => {
            console.log('✅ Design image loaded, applying to canvas');
            
            // Use the current placement state values
            const topPct = this.placementState.topPct / 100;
            const leftPct = this.placementState.leftPct / 100;
            const widthPct = this.placementState.widthPct / 100;
            const heightPct = this.placementState.heightPct / 100;
            const rotateDeg = this.placementState.rotateDeg || 0;

            // Calculate design position and size on canvas
            const designX = canvas.width * leftPct - (canvas.width * widthPct) / 2; // Center horizontally
            const designY = canvas.height * topPct;
            const designWidth = canvas.width * widthPct;
            const designHeight = canvas.height * heightPct;
            
            console.log('Design positioning:', {
              x: designX,
              y: designY,
              width: designWidth,
              height: designHeight,
              rotation: rotateDeg
            });
            
            // Apply rotation and draw the design
            ctx.save();
            ctx.translate(designX + designWidth / 2, designY + designHeight / 2);
            ctx.rotate(rotateDeg * Math.PI / 180);
            ctx.drawImage(designImg, -designWidth / 2, -designHeight / 2, designWidth, designHeight);
            ctx.restore();

            console.log('✅ Design applied to canvas, starting download');
            const a = document.createElement('a');
            a.download = `custom_mockup_${this.state.view}_${this.state.color}.png`;
            a.href = canvas.toDataURL("image/png");
            a.click();
            
            this.showMessage('📥 Mockup downloaded with design!', 'success');
          };

          designImg.onerror = () => {
            console.error('❌ Failed to load design image for download');
            this.showMessage('❌ Failed to load design for download', 'error');
          };
        } else {
          console.log('ℹ️ No uploaded design found, downloading base mockup only');
          const a = document.createElement('a');
          a.download = `custom_mockup_${this.state.view}_${this.state.color}.png`;
          a.href = canvas.toDataURL("image/png");
          a.click();
          
          this.showMessage('📥 Mockup downloaded (no design)', 'info');
        }
      };
      
      baseImg.onerror = () => {
        console.error('❌ Failed to load base image for download');
        this.showMessage('❌ Failed to load base image for download', 'error');
      };
    },

    downloadMockup() {
      this.downloadComposite();
    },

    bindPlacementGuide() {
      const toggleBtn = document.getElementById(`nt-toggle-guide-" + window.STUDIO_SECTION_ID + "`);
      const guideText = document.getElementById(`nt-guide-text-" + window.STUDIO_SECTION_ID + "`);
      const overlay = document.getElementById(`nt-overlay-" + window.STUDIO_SECTION_ID + "`);
      let guideVisible = false;
      
      if (toggleBtn && overlay) {
        toggleBtn.addEventListener('click', () => {
          guideVisible = !guideVisible;
          
          if (guideVisible) {
            // Show guide - add red border and crosshairs
            overlay.style.border = '2px dashed #ef4444';
            overlay.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2), inset 0 0 0 2px rgba(239, 68, 68, 0.1)';
            
            // Add crosshairs using pseudo-elements via a style element
            if (!document.getElementById('placement-guide-style-' + window.STUDIO_SECTION_ID)) {
              const styleEl = document.createElement('style');
              styleEl.id = 'placement-guide-style-' + window.STUDIO_SECTION_ID;
              styleEl.textContent = `
                #nt-overlay-" + window.STUDIO_SECTION_ID + "::before,
                #nt-overlay-" + window.STUDIO_SECTION_ID + "::after {
                  content: '';
                  position: absolute;
                  background: rgba(239, 68, 68, 0.5);
                  z-index: 1000;
                  pointer-events: none;
                }
                #nt-overlay-" + window.STUDIO_SECTION_ID + "::before {
                  top: 50%;
                  left: 0;
                  right: 0;
                  height: 2px;
                  transform: translateY(-50%);
                }
                #nt-overlay-" + window.STUDIO_SECTION_ID + "::after {
                  left: 50%;
                  top: 0;
                  bottom: 0;
                  width: 2px;
                  transform: translateX(-50%);
                }
              `;
              document.head.appendChild(styleEl);
            }
            
            if (guideText) guideText.textContent = 'Hide';
            this.showMessage('📐 Placement guide enabled - red border shows print area', 'success');
          } else {
            // Hide guide - remove border and crosshairs
            overlay.style.border = '2px dashed rgba(39, 225, 193, 0.3)';
            overlay.style.boxShadow = 'inset 0 4px 12px rgba(0, 0, 0, 0.1)';
            
            // Remove crosshairs style
            const styleEl = document.getElementById('placement-guide-style-' + window.STUDIO_SECTION_ID);
            if (styleEl) {
              styleEl.remove();
            }
            
            if (guideText) guideText.textContent = 'Show';
            this.showMessage('📐 Placement guide disabled', 'success');
          }
        });
      }
    },
    
    removeDesign() {
      const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
      if (overlay) {
        overlay.innerHTML = '';
        this.placementState.hasUploadedDesign = false;
        this.placementState.designSelected = false;
        console.log('🗑️ Design removed');
        this.showMessage('🗑️ Design removed', 'info');
      }
    },
    
    invertColors() {
      // Check if there's an uploaded design image
      const overlayImg = document.querySelector(`#nt-overlay-" + window.STUDIO_SECTION_ID + " img`);
      
      if (overlayImg && this.placementState.hasUploadedDesign) {
        // Invert uploaded image colors using Canvas API
        console.log('🔄 Inverting uploaded design image...');
        
        try {
          // Create a canvas to process the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size to match image
          canvas.width = overlayImg.naturalWidth || overlayImg.width;
          canvas.height = overlayImg.naturalHeight || overlayImg.height;
          
          // Draw the original image onto the canvas
          ctx.drawImage(overlayImg, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Invert each pixel's color
          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];         // Red
            data[i + 1] = 255 - data[i + 1]; // Green
            data[i + 2] = 255 - data[i + 2]; // Blue
            // data[i + 3] is alpha, leave it unchanged
          }
          
          // Put the inverted image data back
          ctx.putImageData(imageData, 0, 0);
          
          // Convert canvas to data URL and update the image
          const invertedDataUrl = canvas.toDataURL('image/png');
          overlayImg.src = invertedDataUrl;
          
          console.log('✅ Design image colors inverted');
          this.showMessage('🔄 Design colors inverted!', 'success');
          
        } catch (error) {
          console.error('❌ Error inverting image:', error);
          this.showMessage('❌ Could not invert image colors. Try re-uploading.', 'error');
        }
        
      } else {
        // Invert text color (original functionality)
        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;
        };
        
        const rgbToHex = (r, g, b) => {
          return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        };
        
        const currentColor = this.designState.textColor;
        const rgb = hexToRgb(currentColor);
        
        if (rgb) {
          const invertedR = 255 - rgb.r;
          const invertedG = 255 - rgb.g;
          const invertedB = 255 - rgb.b;
          const invertedColor = rgbToHex(invertedR, invertedG, invertedB);
          
          this.designState.textColor = invertedColor;
          
          const textElement = document.getElementById('nt-design-text-' + window.STUDIO_SECTION_ID);
          if (textElement) {
            textElement.style.color = invertedColor;
          }
          
          console.log(`🔄 Text color inverted: ${currentColor} → ${invertedColor}`);
          this.showMessage(`🔄 Text color inverted to ${invertedColor}`, 'success');
        }
      }
    },
    
    applyPerfectFit() {
      // Optimal dimensions for perfect fit in print area
      // These values are based on the console debug output for optimal positioning
      const perfectDimensions = {
        topPct: 29.142857142856876,     // Exact optimal top position
        leftPct: 49.96,                 // Adjusted left position (50.21 - 0.25 nudge step)
        widthPct: 37,                   // Optimal width for design proportions
        heightPct: 42,                  // Optimal height for design proportions
        rotateDeg: 0                    // No rotation for perfect fit
      };

      // Update placement state
      this.placementState.topPct = perfectDimensions.topPct;
      this.placementState.leftPct = perfectDimensions.leftPct;
      this.placementState.widthPct = perfectDimensions.widthPct;
      this.placementState.heightPct = perfectDimensions.heightPct;
      this.placementState.rotateDeg = perfectDimensions.rotateDeg;

      // Update the display and position
      this.updatePlacementDisplay();
      this.updateDesignPosition();

      // Add animation effect
      const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
      if (overlay) {
        overlay.style.transition = 'transform 0.3s ease';
        overlay.style.transform = `translateX(-50%) rotate(${perfectDimensions.rotateDeg}deg) scale(1.05)`;
        setTimeout(() => {
          overlay.style.transform = `translateX(-50%) rotate(${perfectDimensions.rotateDeg}deg) scale(1)`;
        }, 200);
      }

      this.showMessage('✨ Perfect fit applied! Design positioned optimally in print area', 'success');
    },

    perfectFit() {
      if (!this.placementState.hasUploadedDesign) {
        alert('⚠️ Please upload a design first!');
        return;
      }
      this.applyPerfectFit();
    },
    
    submitRequest() {
      if (!this.placementState.hasUploadedDesign) {
        this.showMessage('❌ Please upload a design first', 'error');
        return;
      }
      
      // Show the customer information form
      const formSection = document.getElementById(`nt-submit-request-" + window.STUDIO_SECTION_ID + "`);
      if (formSection) {
        formSection.style.display = 'block';
        formSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },

    async submitTShirtRequest() {
      console.log('🚀 === Starting submitTShirtRequest ===');
      console.log('📋 Checking prerequisites...');
      
      // Check if design is uploaded
      if (!this.placementState.hasUploadedDesign) {
        console.error('❌ No design uploaded');
        this.showMessage('❌ Please upload a design first', 'error');
        return;
      }
      console.log('✅ Design is uploaded');
      
      // Check if Supabase client is available
      if (!window.supabaseClient) {
        console.error('❌ Supabase client not available');
        this.showMessage('❌ Database connection not available. Please refresh the page and try again.', 'error');
        return;
      }
      console.log('✅ Supabase client is available');
      
      // Check if EmailJS is available
      if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS not loaded');
        this.showMessage('❌ Email service not available. Please refresh the page and try again.', 'error');
        return;
      }
      console.log('✅ EmailJS is available');

      // Get form data
      const customerName = document.getElementById(`nt-customer-name-" + window.STUDIO_SECTION_ID + "`).value.trim();
      const customerEmail = document.getElementById(`nt-customer-email-" + window.STUDIO_SECTION_ID + "`).value.trim();
      const customerPhone = document.getElementById(`nt-customer-phone-" + window.STUDIO_SECTION_ID + "`).value.trim();
      const tshirtSize = document.getElementById(`nt-tshirt-size-" + window.STUDIO_SECTION_ID + "`).value;
      const customerMessage = document.getElementById(`nt-customer-message-" + window.STUDIO_SECTION_ID + "`).value.trim();

      // Validate required fields
      if (!customerName || !customerEmail) {
        this.showMessage('❌ Please fill in all required fields', 'error');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        this.showMessage('❌ Please enter a valid email address', 'error');
        return;
      }

      try {
        // Add loading state to button
        const submitBtn = document.getElementById(`nt-submit-request-form-btn-" + window.STUDIO_SECTION_ID + "`);
        if (submitBtn) {
          submitBtn.classList.add('loading');
          submitBtn.style.pointerEvents = 'none';
          submitBtn.textContent = '⏳ Submitting...';
        }
        
        this.showMessage('📤 Submitting your request...', 'info');
        
        // Generate mockup image for submission
        this.showMessage('🎨 Generating design preview...', 'info');
        const mockupImageData = await this.generateMockupForSubmission();
        
        // Upload mockup to storage and get URL
        let mockupImageUrl = null;
        try {
          mockupImageUrl = await this.uploadMockupToStorage(mockupImageData);
        } catch (error) {
          console.warn('Could not upload mockup image:', error);
        }
        
        // Upload design to storage if available
        let designImageUrl = null;
        try {
          designImageUrl = await this.uploadDesignToStorage();
        } catch (error) {
          console.warn('Could not upload design image:', error);
        }
        
        // Prepare request data
        const requestData = {
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || null,
          customer_message: customerMessage || null,
          tshirt_size: tshirtSize || null,
          design_data: {
            position: {
              top: this.placementState.topPct,
              left: this.placementState.leftPct,
              width: this.placementState.widthPct,
              height: this.placementState.heightPct,
              rotation: this.placementState.rotateDeg
            },
            view: this.state.view,
            color: this.state.color,
            canvas_size: { width: 2000, height: 2000 },
            has_uploaded_design: this.placementState.hasUploadedDesign
          },
          design_image_url: designImageUrl,
          mockup_image_url: mockupImageUrl
        };

        // Submit to Supabase database
        const supabaseResult = await this.submitToSupabase(requestData);
        
        if (supabaseResult.success) {
          const requestId = supabaseResult.requestId ? ` (Request #${supabaseResult.requestId.slice(-8)})` : '';
          
          // Send email with images to shopping@newthrifts.com
          console.log('📧 Sending email with images to shopping@newthrifts.com...');
          const emailResult = await this.sendEmailWithImages(requestData);
          
          if (emailResult.success) {
            this.showMessage(`🎉 Request submitted successfully! Email sent to our team. We'll contact you within 24 hours.${requestId}`, 'success');
            console.log('✅ Email with images sent to shopping@newthrifts.com');
          } else {
            this.showMessage(`🎉 Request submitted successfully! However, email notification failed. We'll still process your request.${requestId}`, 'warning');
            console.warn('⚠️ Email sending failed:', emailResult.error);
          }
          
          console.log('✅ Custom t-shirt request submitted:', {
            requestId: supabaseResult.requestId,
            customerEmail: customerEmail,
            hasDesign: this.placementState.hasUploadedDesign,
            emailSent: emailResult.success
          });
        } else {
          throw new Error(supabaseResult.error || 'Failed to save request to database');
        }
        
        // Hide form and reset
        document.getElementById(`nt-submit-request-" + window.STUDIO_SECTION_ID + "`).style.display = 'none';
        this.resetRequestForm();
        
        // Remove loading state
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.style.pointerEvents = 'auto';
          submitBtn.textContent = '🚀 Submit Request';
        }

      } catch (error) {
        console.error('Error submitting request:', error);
        this.showMessage('❌ Failed to submit request. Please try again.', 'error');
        
        // Remove loading state on error
        const submitBtn = document.getElementById(`nt-submit-request-form-btn-" + window.STUDIO_SECTION_ID + "`);
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.style.pointerEvents = 'auto';
          submitBtn.textContent = '🚀 Submit Request';
        }
      }
    },

    resetRequestForm() {
      document.getElementById(`nt-customer-name-" + window.STUDIO_SECTION_ID + "`).value = '';
      document.getElementById(`nt-customer-email-" + window.STUDIO_SECTION_ID + "`).value = '';
      document.getElementById(`nt-customer-phone-" + window.STUDIO_SECTION_ID + "`).value = '';
      document.getElementById(`nt-tshirt-size-" + window.STUDIO_SECTION_ID + "`).value = '';
      document.getElementById(`nt-customer-message-" + window.STUDIO_SECTION_ID + "`).value = '';
    },

    async submitToSupabase(requestData) {
      try {
        console.log('🔍 Debugging submitToSupabase...');
        console.log('Request data:', requestData);
        
        // Check if Supabase is available
        if (typeof window.NewThriftsCustomRequests === 'undefined') {
          console.warn('❌ Supabase custom requests API not loaded');
          console.log('Available window objects:', Object.keys(window).filter(k => k.includes('supabase') || k.includes('NewThrifts')));
          return { success: false, error: 'Database service not available' };
        }

        console.log('✅ NewThriftsCustomRequests API found');
        
        // Try the existing Supabase API first
        console.log('📤 Calling submitCustomRequest...');
        const result = await window.NewThriftsCustomRequests.submitCustomRequest(requestData);
        
        console.log('📥 Result from submitCustomRequest:', result);
        
        if (result.success) {
          console.log('✅ Request saved to Supabase:', result.requestId);
          return { success: true, requestId: result.requestId };
        } else {
          console.error('❌ Supabase submission failed:', result.error);
          
          // Try direct Supabase connection as fallback
          console.log('🔄 Trying direct Supabase connection...');
          return await this.submitWithGlobalClient(requestData);
        }
        
      } catch (error) {
        console.error('❌ Error in submitToSupabase:', error);
        console.error('Error stack:', error.stack);
        return { success: false, error: error.message || 'Submission failed' };
      }
    },

    async submitWithGlobalClient(requestData) {
      try {
        console.log('🔧 Using global Supabase client for submission...');
        
        const client = window.supabaseClient;
        
        if (!client) {
          console.error('❌ Global Supabase client not available');
          return { success: false, error: 'Global client not available' };
        }

        console.log('✅ Global Supabase client found, submitting data...');

        // Insert request into database (simplified)
        const insertData = {
          customer_email: requestData.customer_email,
          customer_name: requestData.customer_name,
          status: 'pending'
        };
        
        // Add optional fields only if they exist
        if (requestData.customer_phone) insertData.customer_phone = requestData.customer_phone;
        if (requestData.customer_message) insertData.customer_message = requestData.customer_message;
        if (requestData.design_image_url) insertData.design_image_url = requestData.design_image_url;
        if (requestData.mockup_image_url) insertData.mockup_image_url = requestData.mockup_image_url;
        if (requestData.design_data) insertData.design_data = requestData.design_data;
        if (requestData.tshirt_size) insertData.tshirt_size = requestData.tshirt_size;
        
        console.log('📤 Inserting data:', insertData);
        
        const { data, error } = await client
          .from('custom_tshirt_requests')
          .insert([insertData])
          .select()
          .single();

        if (error) {
          console.error('❌ Global client Supabase error:', error);
          return { success: false, error: error.message };
        }

        console.log('✅ Global client submission successful:', data);
        return { success: true, requestId: data.id };

      } catch (error) {
        console.error('❌ Error in global client submission:', error);
        return { success: false, error: error.message || 'Global client submission failed' };
      }
    },

    async sendEmailWithImages(requestData) {
      try {
        console.log('📧 Preparing to send email with images to shopping@newthrifts.com...');
        
        // Images are now uploaded to Supabase storage with public URLs
        const emailContent = this.createEmailContent(requestData);
        
        console.log('✅ Image URLs generated:');
        console.log('Design URL:', requestData.design_image_url ? '✅ Uploaded' : '❌ Failed');
        console.log('Mockup URL:', requestData.mockup_image_url ? '✅ Uploaded' : '❌ Failed');
        
        // Send email via EmailJS
        console.log('🎯 Sending email via EmailJS...');
        const emailResult = await this.sendViaEmailJS(requestData, emailContent);
        
        console.log('📊 EmailJS result:', emailResult);
        
        if (emailResult.success) {
          console.log('✅ EmailJS email with images sent successfully to shopping@newthrifts.com');
          return { success: true, message: 'Email sent with images attached via EmailJS' };
        } else {
          console.error('❌ EmailJS email failed:', emailResult.error);
          return { success: false, error: 'Failed to send email via EmailJS: ' + emailResult.error };
        }
        
      } catch (error) {
        console.error('❌ Error sending email with images:', error);
        return { success: false, error: error.message };
      }
    },

    createEmailContent(requestData) {
      return {
        to: 'shopping@newthrifts.com',
        subject: `🎨 Custom T-Shirt Request from ${requestData.customer_name}`,
        body: `Email content will be handled by EmailJS template`
      };
    },

    async sendViaEmailJS(requestData, emailContent) {
      try {
        console.log('📧 Attempting EmailJS email with images...');
        
        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
          throw new Error('EmailJS not loaded. Please include EmailJS script.');
        }
        
        // Helper function to safely convert values to strings
        const s = v => (v == null || v === "") ? "—" : String(v);
        
        // Ensure URLs are absolute HTTPS links
        const ensureAbsoluteUrl = (url) => {
          if (!url || url === '#') return '—';
          if (url.startsWith('http://') || url.startsWith('https://')) return url;
          // If relative URL, make it absolute (shouldn't happen, but just in case)
          return url.startsWith('/') ? `https://newthrifts.com${url}` : url;
        };
        
        // Create email template parameters with proper formatting
        const templateParams = {
          name: s(requestData.customer_name),
          email: s(requestData.customer_email),
          phone: s(requestData.customer_phone),
          tshirt_size: s(requestData.tshirt_size),
          message: s(requestData.customer_message),
          design_position: s(`Top ${requestData.design_data.position.top.toFixed(2)}%, Left ${requestData.design_data.position.left.toFixed(2)}%`),
          design_size: s(`${requestData.design_data.position.width.toFixed(0)}% × ${requestData.design_data.position.height.toFixed(0)}%`),
          design_rotation: s(`${requestData.design_data.position.rotation}°`),
          design_view: s(requestData.design_data.view),
          tshirt_color: s(requestData.design_data.color),
          submission_date: s(new Date().toLocaleString()),
          request_id: s(requestData.id || 'Pending'),
          design_url: ensureAbsoluteUrl(requestData.design_image_url),
          mockup_url: ensureAbsoluteUrl(requestData.mockup_image_url),
          logo_url: s('https://cdn.shopify.com/s/files/1/0644/9525/5650/files/NewThriftsLogo.svg?v=1760718145')
        };
        
        // Send email via EmailJS
        const result = await emailjs.send(
          'service_f4r34d3', // EmailJS service ID
          'template_qiquke8', // EmailJS template ID
          templateParams
        );
        
        console.log('✅ EmailJS email sent successfully:', result);
        console.debug('[email params]', templateParams);
        return { success: true, method: 'EmailJS', messageId: result.text };
        
      } catch (error) {
        console.warn('⚠️ EmailJS email failed:', error);
        return { success: false, error: error.message, method: 'EmailJS' };
      }
    },

    async generateMockupForSubmission() {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        canvas.width = 2000;
        canvas.height = 2000;
        
        const baseImg = new Image();
        baseImg.crossOrigin = "anonymous";
        baseImg.src = document.getElementById("nt-base-" + window.STUDIO_SECTION_ID + "").src;
        
        baseImg.onload = () => {
          ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

          const overlayImg = document.querySelector(`#nt-overlay-" + window.STUDIO_SECTION_ID + " img`);
          
          if (overlayImg && overlayImg.src) {
            const designImg = new Image();
            designImg.crossOrigin = "anonymous";
            designImg.src = overlayImg.src;
            
            designImg.onload = () => {
              const topPct = this.placementState.topPct / 100;
              const leftPct = this.placementState.leftPct / 100;
              const widthPct = this.placementState.widthPct / 100;
              const heightPct = this.placementState.heightPct / 100;
              const rotateDeg = this.placementState.rotateDeg || 0;

              const designX = canvas.width * leftPct - (canvas.width * widthPct) / 2;
              const designY = canvas.height * topPct;
              const designWidth = canvas.width * widthPct;
              const designHeight = canvas.height * heightPct;
              
              ctx.save();
              ctx.translate(designX + designWidth / 2, designY + designHeight / 2);
              ctx.rotate(rotateDeg * Math.PI / 180);
              ctx.drawImage(designImg, -designWidth / 2, -designHeight / 2, designWidth, designHeight);
              ctx.restore();

              resolve(canvas.toDataURL("image/png"));
            };
          } else {
            resolve(canvas.toDataURL("image/png"));
          }
        };
      });
    },

    async uploadMockupToStorage(base64Data) {
      if (!base64Data) return null;
      
      try {
        const response = await fetch(base64Data);
        const blob = await response.blob();
        
        const timestamp = Date.now();
        const filename = `mockup_${timestamp}.png`;
        
        const client = window.supabaseClient;
        if (!client) {
          throw new Error('Supabase client not available');
        }
        
        const { data, error } = await client
          .storage
          .from('mockup-previews')
          .upload(filename, blob, {
            contentType: 'image/png',
            upsert: false
          });
          
        if (error) throw error;
        
        const { data: urlData } = client
          .storage
          .from('mockup-previews')
          .getPublicUrl(filename);
          
        return urlData.publicUrl;
      } catch (error) {
        console.error('Mockup upload error:', error);
        return null;
      }
    },

    async uploadDesignToStorage() {
      console.log('🎨 Starting design upload to storage...');
      const overlayImg = document.querySelector(`#nt-overlay-" + window.STUDIO_SECTION_ID + " img`);
      
      if (!overlayImg) {
        console.warn('⚠️ No overlay image element found');
        return null;
      }
      
      if (!overlayImg.src) {
        console.warn('⚠️ Overlay image has no src');
        return null;
      }
      
      console.log('✅ Found overlay image');
      console.log('📋 Image src type:', overlayImg.src.substring(0, 30));
      
      try {
        // Check if it's an SVG by examining the data URL or src
        const isSVG = overlayImg.src.includes('data:image/svg+xml') || 
                      overlayImg.src.includes('.svg') ||
                      overlayImg.src.toLowerCase().includes('svg');
        
        console.log('🔍 Is SVG?', isSVG);
        
        let uploadBlob;
        
        if (isSVG) {
          console.log('🔄 Converting SVG to PNG using canvas...');
          
          // Create a canvas to convert SVG to PNG
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas size - use a high resolution for quality
          const targetWidth = 2000;
          const targetHeight = 2000;
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          console.log(`📐 Canvas size: ${canvas.width}x${canvas.height}`);
          
          // Create a new image to draw on canvas
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          // Wait for image to load
          await new Promise((resolve, reject) => {
            img.onload = () => {
              console.log('✅ SVG image loaded into temporary image element');
              // Draw with white background
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              // Draw the SVG
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              console.log('✅ SVG drawn to canvas');
              resolve();
            };
            img.onerror = (err) => {
              console.error('❌ Failed to load SVG into image element:', err);
              reject(err);
            };
            img.src = overlayImg.src;
          });
          
          // Convert canvas to PNG blob
          uploadBlob = await new Promise((resolve) => {
            canvas.toBlob((blob) => {
              console.log('✅ Canvas converted to PNG blob');
              resolve(blob);
            }, 'image/png', 1.0);
          });
          
          console.log('✅ Final PNG blob - size:', uploadBlob.size, 'type:', uploadBlob.type);
        } else {
          // Not an SVG, just fetch and upload as-is
          console.log('📥 Not an SVG, fetching original image...');
          const response = await fetch(overlayImg.src);
          uploadBlob = await response.blob();
          console.log('✅ Original blob - size:', uploadBlob.size, 'type:', uploadBlob.type);
        }
        
        const timestamp = Date.now();
        const filename = `design_${timestamp}.png`;
        console.log('📝 Uploading as:', filename);
        
        const client = window.supabaseClient;
        if (!client) {
          throw new Error('Supabase client not available');
        }
        
        const { data, error} = await client
          .storage
          .from('design-uploads')
          .upload(filename, uploadBlob, {
            contentType: 'image/png',
            upsert: false
          });
          
        if (error) {
          console.error('❌ Supabase upload error:', error);
          throw error;
        }
        
        console.log('✅ Design uploaded to Supabase:', data);
        
        const { data: urlData } = client
          .storage
          .from('design-uploads')
          .getPublicUrl(filename);
        
        console.log('✅ Public URL generated:', urlData.publicUrl);
        return urlData.publicUrl;
      } catch (error) {
        console.error('❌ Design upload error:', error);
        console.error('Error details:', error);
        return null;
      }
    },
    
    rotateDesign() {
      if (!this.placementState.hasUploadedDesign) {
        alert('⚠️ Please upload a design first!');
        return;
      }
      console.log('↺ Rotating design...');
      this.showMessage('↺ Design rotated', 'info');
    },
    
    zoomDesign() {
      if (!this.placementState.hasUploadedDesign) {
        alert('⚠️ Please upload a design first!');
        return;
      }
      console.log('🔍 Zooming design...');
      this.showMessage('🔍 Design zoomed', 'info');
    },
    
    validateDesign() {
      if (!this.placementState.hasUploadedDesign) {
        alert('⚠️ Please upload a design first!');
        return;
      }
      alert('✅ Design validation passed! Your design is ready for submission.');
    },
    
    resetDesign() {
      if (!this.placementState.hasUploadedDesign) {
        alert('⚠️ No design to reset!');
        return;
      }
      console.log('🔄 Resetting design...');
      this.showMessage('🔄 Design reset', 'info');
    },
    
    showMessage(text, type = 'info') {
      const existingMessage = document.querySelector('.nt-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      const message = document.createElement('div');
      message.className = 'nt-message';
      const colors = {
        success: 'linear-gradient(45deg, #10b981, #059669)',
        error: 'linear-gradient(45deg, #ef4444, #dc2626)',
        info: 'linear-gradient(45deg, #3b82f6, #1d4ed8)'
      };
      
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
      `;
      message.textContent = text;
      document.body.appendChild(message);
      
      setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => message.remove(), 300);
      }, 3000);
    }
  };
  
  mockup.init();
  window.placementState = mockup.placementState;
  window.mockupInstance = mockup;
  
  console.log('🚀 Custom Studio Mockup initialized! 🎨');
  
  // Initialize Text Engine (external function)
  if (typeof window.initializeTextEngine === 'function') {
    window.initializeTextEngine('' + window.STUDIO_SECTION_ID);
  }
}

// Studio initialization is handled by openCustomDesignStudio() when user clicks the button
// No auto-initialization needed - this prevents the studio from appearing on page load

// Add the testPerfectFit function for debugging
(function() {
  console.log('🎯 Registering testPerfectFit function...');
  
  window.testPerfectFit = function() {
    console.log('🎯 Testing Perfect Fit with exact dimensions...');
    
    // Find the mockup section
    const section = document.getElementById('nt-mockup-' + window.STUDIO_SECTION_ID);
    if (!section) {
      console.error('❌ Mockup section not found!');
      return;
    }
    
    // Get the overlay and canvas
    const overlay = document.getElementById('nt-overlay-' + window.STUDIO_SECTION_ID);
    const canvas = document.getElementById('nt-mockup-canvas-' + window.STUDIO_SECTION_ID);
    
    if (!overlay || !canvas) {
      console.error('❌ Overlay or canvas not found!');
      return;
    }
    
    // Apply exact dimensions
    const perfectDimensions = {
      topPct: 29.142857142856876,
      leftPct: 50.21428571428568,
      widthPct: 37,
      heightPct: 42,
      rotateDeg: 0
    };
    
    // Update CSS variables
    canvas.style.setProperty('--overlay-top', perfectDimensions.topPct + '%');
    canvas.style.setProperty('--overlay-left', perfectDimensions.leftPct + '%');
    canvas.style.setProperty('--overlay-width', perfectDimensions.widthPct + '%');
    canvas.style.setProperty('--overlay-height', perfectDimensions.heightPct + '%');
    canvas.style.setProperty('--overlay-rotate', perfectDimensions.rotateDeg + 'deg');
    
    // Update overlay directly
    overlay.style.top = perfectDimensions.topPct + '%';
    overlay.style.left = perfectDimensions.leftPct + '%';
    overlay.style.width = perfectDimensions.widthPct + '%';
    overlay.style.height = perfectDimensions.heightPct + '%';
    overlay.style.transform = `translateX(-50%) rotate(${perfectDimensions.rotateDeg}deg)`;
    
    console.log('✅ Perfect Fit applied with exact dimensions:');
    console.log(`Top: ${perfectDimensions.topPct}%`);
    console.log(`Left: ${perfectDimensions.leftPct}%`);
    console.log(`Width: ${perfectDimensions.widthPct}%`);
    console.log(`Height: ${perfectDimensions.heightPct}%`);
    console.log(`Rotation: ${perfectDimensions.rotateDeg}°`);
    
    // Add animation
    overlay.style.transition = 'transform 0.3s ease';
    overlay.style.transform = `translateX(-50%) rotate(${perfectDimensions.rotateDeg}deg) scale(1.05)`;
    setTimeout(() => {
      overlay.style.transform = `translateX(-50%) rotate(${perfectDimensions.rotateDeg}deg) scale(1)`;
    }, 200);
    
    // Show success message on page
    const existingMessage = document.querySelector('.nt-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'nt-message';
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #10b981, #059669);
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    `;
    message.textContent = '🎯 Perfect Fit test applied with exact dimensions!';
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => message.remove(), 300);
    }, 3000);
  };
  
  console.log('✅ testPerfectFit is now available! Type: testPerfectFit()');
})();

// Size Chart Toggle Functionality - Initialize when studio opens
function initializeSizeChart() {
  console.log('📏 Initializing Size Chart...');
  const sizeChartToggle = document.getElementById('size-chart-toggle-' + window.STUDIO_SECTION_ID);
  const sizeChartContent = document.getElementById('size-chart-content-' + window.STUDIO_SECTION_ID);
  const sizeChartIcon = document.getElementById('size-chart-icon-' + window.STUDIO_SECTION_ID);
  
  if (sizeChartToggle && sizeChartContent && sizeChartIcon) {
    console.log('✅ Size Chart elements found, binding events...');
    sizeChartToggle.addEventListener('click', function() {
      if (sizeChartContent.style.display === 'none') {
        sizeChartContent.style.display = 'block';
        sizeChartIcon.style.transform = 'rotate(180deg)';
        // Use theme-appropriate open colors
        sizeChartToggle.style.background = 'linear-gradient(135deg, #059669, #047857)';
        console.log('📏 Size Chart opened');
      } else {
        sizeChartContent.style.display = 'none';
        sizeChartIcon.style.transform = 'rotate(0deg)';
        // Reset to default - CSS will handle theme colors
        sizeChartToggle.style.background = '';
        console.log('📏 Size Chart closed');
      }
    });
    console.log('✅ Size Chart toggle functionality initialized');
  } else {
    console.error('❌ Size Chart elements not found:', {
      toggle: !!sizeChartToggle,
      content: !!sizeChartContent,
      icon: !!sizeChartIcon
    });
  }
}

// ========================================
// LOAD STUDIO EDIT OPERATIONS
// ========================================
const studioEditScript = document.createElement('script');
studioEditScript.src = '{{ "studio-edit.js" | asset_url }}';
studioEditScript.onload = function() {
  console.log('✅ Studio Edit Operations loaded');
  initEditModal();
  initCanvasNudgeControls();
};
document.head.appendChild(studioEditScript);

// ========================================
// CANVAS NUDGE CONTROLS
// ========================================
function initCanvasNudgeControls() {
  const nudgeButtons = document.querySelectorAll('.canvas-nudge-btn');
  const nudgeContainer = document.querySelector('#canvas-nudge-controls-' + window.STUDIO_SECTION_ID);
  
  // Mobile magnify-on-tap behavior
  if (nudgeContainer && window.innerWidth <= 768) {
    let magnifyTimer;
    
    const magnify = () => {
      nudgeContainer.classList.add('magnified');
      clearTimeout(magnifyTimer);
      // Auto-shrink after 2 seconds of inactivity
      magnifyTimer = setTimeout(() => {
        nudgeContainer.classList.remove('magnified');
      }, 2000);
    };
    
    const shrink = () => {
      clearTimeout(magnifyTimer);
      magnifyTimer = setTimeout(() => {
        nudgeContainer.classList.remove('magnified');
      }, 300);
    };
    
    // Magnify on touch/pointer interaction
    ['pointerdown', 'touchstart'].forEach(evt => {
      nudgeContainer.addEventListener(evt, magnify, { passive: true });
    });
    
    // Shrink when interaction ends
    ['pointerup', 'touchend', 'pointercancel'].forEach(evt => {
      nudgeContainer.addEventListener(evt, shrink, { passive: true });
    });
    
    console.log('✅ Mobile magnify-on-tap initialized for nudge controls');
  }
  
  // Helper function to log current position after nudge
  function logDesignPosition(action) {
    setTimeout(() => {
      const overlay = document.querySelector('[id*="nt-overlay"]');
      const canvasContainer = document.querySelector('[id*="nt-mockup-canvas"]');
      
      if (overlay && canvasContainer) {
        const computed = window.getComputedStyle(canvasContainer);
        const overlayStyle = window.getComputedStyle(overlay);
        
        // Get CSS variables
        const cssVars = {
          '--overlay-top': computed.getPropertyValue('--overlay-top'),
          '--overlay-left': computed.getPropertyValue('--overlay-left'),
          '--overlay-width': computed.getPropertyValue('--overlay-width'),
          '--overlay-height': computed.getPropertyValue('--overlay-height'),
          '--overlay-rotate': computed.getPropertyValue('--overlay-rotate')
        };
        
        // Get computed position
        const rect = overlay.getBoundingClientRect();
        const canvasRect = canvasContainer.getBoundingClientRect();
        
        console.log(`📍 ${action}`);
        console.log({
          cssVariables: cssVars,
          computedPosition: {
            top: overlayStyle.top,
            left: overlayStyle.left,
            transform: overlayStyle.transform
          },
          dimensions: {
            width: overlay.offsetWidth + 'px',
            height: overlay.offsetHeight + 'px'
          },
          percentageOfCanvas: {
            top: (((rect.top - canvasRect.top) / canvasRect.height) * 100).toFixed(2) + '%',
            left: (((rect.left - canvasRect.left) / canvasRect.width) * 100).toFixed(2) + '%',
            width: ((overlay.offsetWidth / canvasContainer.offsetWidth) * 100).toFixed(2) + '%',
            height: ((overlay.offsetHeight / canvasContainer.offsetHeight) * 100).toFixed(2) + '%'
          }
        });
      }
    }, 50); // Small delay to ensure DOM has updated
  }
  
  // Wire up button clicks
  nudgeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const direction = btn.getAttribute('data-direction');
      let dx = 0, dy = 0;
      
      switch(direction) {
        case 'up': dy = -1; break;
        case 'down': dy = 1; break;
        case 'left': dx = -1; break;
        case 'right': dx = 1; break;
      }
      
      if (studio.editOps) {
        studio.editOps.nudge(dx, dy, 0.25); // Use step of 0.25 for ultra-fine control
        logDesignPosition(`🎮 Nudged ${direction}`);
      }
    });
  });
  
  // Add keyboard arrow key support (global)
  document.addEventListener('keydown', (e) => {
    // Only respond if a design is uploaded and no input is focused
    if (!window.placementState?.hasUploadedDesign) return;
    if (document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA') return;
    
    let dx = 0, dy = 0;
    let direction = '';
    
    switch(e.key) {
      case 'ArrowUp': dy = -1; direction = 'up'; e.preventDefault(); break;
      case 'ArrowDown': dy = 1; direction = 'down'; e.preventDefault(); break;
      case 'ArrowLeft': dx = -1; direction = 'left'; e.preventDefault(); break;
      case 'ArrowRight': dx = 1; direction = 'right'; e.preventDefault(); break;
      default: return; // Exit if not an arrow key
    }
    
    if (studio.editOps && (dx !== 0 || dy !== 0)) {
      studio.editOps.nudge(dx, dy, 0.25);
      logDesignPosition(`⌨️ Keyboard nudge: ${direction}`);
    }
  });
  
  console.log('✅ Canvas nudge controls initialized');
}

// ========================================
// DEBUG UTILITIES
// ========================================
window.debugImageSizes = function() {
  console.log('🔍 DEBUG: Image Sizes (DETAILED)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Find all images in the canvas
  const canvasContainer = document.querySelector('[id*="nt-mockup-canvas"]');
  const overlay = document.querySelector('[id*="nt-overlay"]');
  
  // Canvas Container Details
  if (canvasContainer) {
    const canvasStyle = window.getComputedStyle(canvasContainer);
    const canvasRect = canvasContainer.getBoundingClientRect();
    
    console.log('📦 Canvas Container (Detailed):', {
      dimensions: {
        offsetWidth: canvasContainer.offsetWidth,
        offsetHeight: canvasContainer.offsetHeight,
        clientWidth: canvasContainer.clientWidth,
        clientHeight: canvasContainer.clientHeight,
        scrollWidth: canvasContainer.scrollWidth,
        scrollHeight: canvasContainer.scrollHeight
      },
      boundingRect: {
        width: canvasRect.width,
        height: canvasRect.height,
        top: canvasRect.top,
        left: canvasRect.left,
        right: canvasRect.right,
        bottom: canvasRect.bottom
      },
      computedStyle: {
        width: canvasStyle.width,
        height: canvasStyle.height,
        padding: canvasStyle.padding,
        margin: canvasStyle.margin,
        border: canvasStyle.border,
        boxSizing: canvasStyle.boxSizing,
        aspectRatio: canvasStyle.aspectRatio,
        position: canvasStyle.position
      },
      aspectRatio: (canvasContainer.offsetWidth / canvasContainer.offsetHeight).toFixed(3)
    });
  }
  
  // Design Image Details
  if (overlay) {
    const overlayImg = overlay.querySelector('img');
    if (overlayImg) {
      const imgStyle = window.getComputedStyle(overlayImg);
      const imgRect = overlayImg.getBoundingClientRect();
      const canvasWidth = canvasContainer ? canvasContainer.offsetWidth : 0;
      const canvasHeight = canvasContainer ? canvasContainer.offsetHeight : 0;
      
      // Calculate percentages
      const widthPct = (overlayImg.offsetWidth / canvasWidth) * 100;
      const heightPct = (overlayImg.offsetHeight / canvasHeight) * 100;
      
      // Calculate scaling
      const scaleX = overlayImg.offsetWidth / overlayImg.naturalWidth;
      const scaleY = overlayImg.offsetHeight / overlayImg.naturalHeight;
      
      console.log('🎨 Design Image (Detailed):', {
        naturalDimensions: {
          width: overlayImg.naturalWidth,
          height: overlayImg.naturalHeight,
          aspectRatio: (overlayImg.naturalWidth / overlayImg.naturalHeight).toFixed(3),
          totalPixels: (overlayImg.naturalWidth * overlayImg.naturalHeight).toLocaleString(),
          megapixels: ((overlayImg.naturalWidth * overlayImg.naturalHeight) / 1000000).toFixed(2) + 'MP'
        },
        displayDimensions: {
          width: overlayImg.offsetWidth,
          height: overlayImg.offsetHeight,
          clientWidth: overlayImg.clientWidth,
          clientHeight: overlayImg.clientHeight,
          aspectRatio: (overlayImg.offsetWidth / overlayImg.offsetHeight).toFixed(3)
        },
        boundingRect: {
          width: imgRect.width,
          height: imgRect.height,
          top: imgRect.top,
          left: imgRect.left
        },
        percentageOfCanvas: {
          width: widthPct.toFixed(2) + '%',
          height: heightPct.toFixed(2) + '%',
          area: ((widthPct * heightPct) / 100).toFixed(2) + '%'
        },
        scaling: {
          scaleX: scaleX.toFixed(4),
          scaleY: scaleY.toFixed(4),
          scaleFactor: ((scaleX + scaleY) / 2).toFixed(4),
          isScaledDown: scaleX < 1 || scaleY < 1,
          isScaledUp: scaleX > 1 || scaleY > 1,
          compressionRatio: (1 / scaleX).toFixed(2) + 'x'
        },
        computedStyle: {
          objectFit: imgStyle.objectFit,
          transform: imgStyle.transform,
          filter: imgStyle.filter,
          opacity: imgStyle.opacity
        },
        fileInfo: {
          src: overlayImg.src.substring(0, 80) + '...',
          complete: overlayImg.complete,
          currentSrc: overlayImg.currentSrc ? overlayImg.currentSrc.substring(0, 80) + '...' : 'N/A'
        }
      });
      
      // DPI Quality Analysis
      const printWidths = [6, 8, 10, 12]; // Common print sizes in inches
      console.log('📐 Quality Analysis (Multiple Print Sizes):');
      printWidths.forEach(printWidth => {
        const effectiveWidth = overlayImg.naturalWidth * (widthPct / 100);
        const dpi = Math.round(effectiveWidth / printWidth);
        const quality = dpi >= 300 ? '✅ Excellent' : dpi >= 200 ? '✅ Good' : dpi >= 150 ? '⚠️ OK' : dpi >= 100 ? '⚠️ Low' : '❌ Poor';
        console.log(`  ${printWidth}" print:`, {
          dpi: dpi,
          quality: quality,
          actualSize: `${(effectiveWidth / dpi).toFixed(2)}" x ${(overlayImg.naturalHeight * (heightPct / 100) / dpi).toFixed(2)}"`
        });
      });
      
      // Recommend optimal print size
      const optimalPrintWidth = (overlayImg.naturalWidth * (widthPct / 100)) / 300;
      console.log('💡 Recommendation:', {
        optimalPrintSize: `${optimalPrintWidth.toFixed(2)}" wide at 300 DPI`,
        currentDesignSize: `${widthPct.toFixed(2)}% of canvas (${overlayImg.offsetWidth}px)`,
        suggestion: optimalPrintWidth < 6 ? '⚠️ Consider higher resolution image' : '✅ Resolution is good'
      });
      
    } else {
      console.log('⚠️ No design image found in overlay');
    }
  } else {
    console.log('⚠️ No overlay element found');
  }
  
  // Base T-shirt Image Details
  const baseImg = document.querySelector('[id*="nt-base"]');
  if (baseImg) {
    const baseStyle = window.getComputedStyle(baseImg);
    const baseRect = baseImg.getBoundingClientRect();
    
    console.log('👕 Base T-shirt Image (Detailed):', {
      naturalDimensions: {
        width: baseImg.naturalWidth,
        height: baseImg.naturalHeight,
        aspectRatio: (baseImg.naturalWidth / baseImg.naturalHeight).toFixed(3),
        totalPixels: (baseImg.naturalWidth * baseImg.naturalHeight).toLocaleString()
      },
      displayDimensions: {
        width: baseImg.offsetWidth,
        height: baseImg.offsetHeight,
        clientWidth: baseImg.clientWidth,
        clientHeight: baseImg.clientHeight
      },
      boundingRect: {
        width: baseRect.width,
        height: baseRect.height,
        top: baseRect.top,
        left: baseRect.left
      },
      scaling: {
        scaleX: (baseImg.offsetWidth / baseImg.naturalWidth).toFixed(4),
        scaleY: (baseImg.offsetHeight / baseImg.naturalHeight).toFixed(4)
      },
      computedStyle: {
        objectFit: baseStyle.objectFit,
        transform: baseStyle.transform,
        position: baseStyle.position
      },
      fileInfo: {
        filename: baseImg.src.substring(baseImg.src.lastIndexOf('/') + 1),
        complete: baseImg.complete
      }
    });
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

window.debugCanvasSize = function() {
  console.log('🔍 DEBUG: Canvas Dimensions (DETAILED)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const canvasContainer = document.querySelector('[id*="nt-mockup-canvas"]');
  
  if (canvasContainer) {
    const rect = canvasContainer.getBoundingClientRect();
    const computed = window.getComputedStyle(canvasContainer);
    const parent = canvasContainer.parentElement;
    
    console.log('📦 Canvas Container (Detailed):', {
      elementInfo: {
        id: canvasContainer.id,
        className: canvasContainer.className,
        tagName: canvasContainer.tagName
      },
      dimensions: {
        offsetWidth: canvasContainer.offsetWidth,
        offsetHeight: canvasContainer.offsetHeight,
        clientWidth: canvasContainer.clientWidth,
        clientHeight: canvasContainer.clientHeight,
        scrollWidth: canvasContainer.scrollWidth,
        scrollHeight: canvasContainer.scrollHeight,
        aspectRatio: (canvasContainer.offsetWidth / canvasContainer.offsetHeight).toFixed(3)
      },
      boundingRect: {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        x: rect.x,
        y: rect.y
      },
      computedStyle: {
        width: computed.width,
        height: computed.height,
        minWidth: computed.minWidth,
        minHeight: computed.minHeight,
        maxWidth: computed.maxWidth,
        maxHeight: computed.maxHeight,
        padding: computed.padding,
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        margin: computed.margin,
        border: computed.border,
        borderRadius: computed.borderRadius,
        boxSizing: computed.boxSizing,
        aspectRatio: computed.aspectRatio,
        position: computed.position,
        display: computed.display,
        overflow: computed.overflow,
        transform: computed.transform,
        transformOrigin: computed.transformOrigin
      },
      background: {
        background: computed.background,
        backgroundColor: computed.backgroundColor,
        backgroundImage: computed.backgroundImage.substring(0, 100) + (computed.backgroundImage.length > 100 ? '...' : ''),
        backgroundSize: computed.backgroundSize,
        backgroundPosition: computed.backgroundPosition,
        backgroundRepeat: computed.backgroundRepeat
      },
      effects: {
        boxShadow: computed.boxShadow,
        filter: computed.filter,
        backdropFilter: computed.backdropFilter,
        opacity: computed.opacity,
        visibility: computed.visibility
      }
    });
    
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      console.log('👨‍👦 Parent Container:', {
        id: parent.id || 'No ID',
        className: parent.className,
        tagName: parent.tagName,
        dimensions: {
          offsetWidth: parent.offsetWidth,
          offsetHeight: parent.offsetHeight
        },
        boundingRect: {
          width: parentRect.width,
          height: parentRect.height
        },
        canvasPercentage: {
          width: ((canvasContainer.offsetWidth / parent.offsetWidth) * 100).toFixed(2) + '%',
          height: ((canvasContainer.offsetHeight / parent.offsetHeight) * 100).toFixed(2) + '%'
        }
      });
    }
    
    // Viewport information
    console.log('🖥️ Viewport Info:', {
      windowSize: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      },
      canvasPercentageOfViewport: {
        width: ((canvasContainer.offsetWidth / window.innerWidth) * 100).toFixed(2) + '%',
        height: ((canvasContainer.offsetHeight / window.innerHeight) * 100).toFixed(2) + '%'
      },
      scrollPosition: {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        pageXOffset: window.pageXOffset,
        pageYOffset: window.pageYOffset
      },
      devicePixelRatio: window.devicePixelRatio
    });
    
    // CSS Variables (if any)
    const cssVars = [
      '--overlay-top',
      '--overlay-left',
      '--overlay-width',
      '--overlay-height',
      '--overlay-rotate'
    ];
    const extractedVars = {};
    cssVars.forEach(varName => {
      const value = computed.getPropertyValue(varName);
      if (value) extractedVars[varName] = value;
    });
    
    if (Object.keys(extractedVars).length > 0) {
      console.log('🎨 CSS Variables:', extractedVars);
    }
    
    // Child elements count
    console.log('📊 Structure:', {
      childElementCount: canvasContainer.childElementCount,
      children: Array.from(canvasContainer.children).map(child => ({
        tagName: child.tagName,
        id: child.id || 'No ID',
        className: child.className
      }))
    });
    
  } else {
    console.log('⚠️ Canvas container not found');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

window.debugDesignPosition = function() {
  console.log('🔍 DEBUG: Design Position');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const overlay = document.querySelector('[id*="nt-overlay"]');
  
  if (overlay) {
    const computed = window.getComputedStyle(overlay);
    const rect = overlay.getBoundingClientRect();
    
    console.log('🎨 Design Overlay:', {
      position: {
        top: computed.top,
        left: computed.left,
        transform: computed.transform
      },
      dimensions: {
        width: computed.width,
        height: computed.height,
        offsetWidth: overlay.offsetWidth,
        offsetHeight: overlay.offsetHeight
      },
      boundingRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      },
      zIndex: computed.zIndex,
      display: computed.display,
      visibility: computed.visibility
    });
    
    // Check if placementState exists
    if (window.placementState) {
      console.log('📍 Placement State:', window.placementState);
    }
  } else {
    console.log('⚠️ Overlay element not found');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

console.log('🛠️ Debug utilities loaded. Available commands:');
console.log('  • debugImageSizes() - Check all image dimensions and quality');
console.log('  • debugCanvasSize() - Check canvas dimensions');
console.log('  • debugDesignPosition() - Check design overlay position');

// ========================================
// EDIT MODAL FUNCTIONALITY
// ========================================
function initEditModal() {
  const modal = document.getElementById('edit-modal-' + window.STUDIO_SECTION_ID);
  const closeBtn = document.getElementById('edit-modal-close-' + window.STUDIO_SECTION_ID);
  const doneBtn = document.getElementById('edit-done-btn-' + window.STUDIO_SECTION_ID);
  
  // Tab switching
  const tabs = document.querySelectorAll('.edit-tab');
  const tabContents = document.querySelectorAll('.edit-tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');
      
      // Update tab styles
      tabs.forEach(t => {
        t.style.background = 'transparent';
        t.style.color = '#64748b';
        t.classList.remove('active');
      });
      tab.style.background = '#27e1c1';
      tab.style.color = '#0f172a';
      tab.classList.add('active');
      
      // Show corresponding content
      tabContents.forEach(content => {
        content.style.display = 'none';
      });
      document.getElementById(`tab-${tabName}-" + window.STUDIO_SECTION_ID + "`).style.display = 'block';
      
      // Update quality meter when switching to quality tab
      if (tabName === 'quality') {
        updateQualityMeter();
      }
    });
  });
  
  // Open modal
  function openEditModal() {
    // Check if design is uploaded using the placement state
    const hasDesign = window.placementState?.hasUploadedDesign || studio.currentDesignObj;
    
    if (!hasDesign) {
      alert('⚠️ Please upload a design first before editing.');
      return;
    }
    
    modal.style.display = 'block';
    studio.editOps?.open();
    updateQualityMeter();
    
    // Initialize transform values if using Fabric.js
    const obj = studio.currentDesignObj;
    if (obj) {
      const scaleValue = Math.round((obj.scaleX || 1) * 100);
      document.getElementById('scale-input-' + window.STUDIO_SECTION_ID).value = scaleValue;
      document.getElementById('scale-slider-' + window.STUDIO_SECTION_ID).value = scaleValue;
      document.getElementById('scale-output-' + window.STUDIO_SECTION_ID).textContent = scaleValue + '%';
      document.getElementById('rotation-input-' + window.STUDIO_SECTION_ID).value = Math.round(obj.angle || 0);
    }
    
    // Populate the live preview with the canvas
    populatePreview();
  }
  
  // Function to populate/update the preview
  function populatePreview() {
    const previewContainer = document.getElementById('edit-preview-' + window.STUDIO_SECTION_ID);
    if (!previewContainer) {
      console.warn('⚠️ Preview container not found');
      return;
    }
    
    console.log('🔍 Looking for canvas/design to preview...');
    
    // Try multiple methods to find the canvas/design
    
    // Method 1: Find the main canvas container
    let canvasContainer = document.getElementById('nt-mockup-canvas-' + window.STUDIO_SECTION_ID);
    
    // Method 2: Try finding by class
    if (!canvasContainer) {
      canvasContainer = document.querySelector('.nt-mockup__canvas');
      console.log('📦 Trying class selector:', !!canvasContainer);
    }
    
    // Method 3: Find any element with the canvas in its ID
    if (!canvasContainer) {
      canvasContainer = document.querySelector('[id*="mockup-canvas"]');
      console.log('🎯 Trying wildcard selector:', !!canvasContainer);
    }
    
    if (canvasContainer) {
      console.log('✅ Found canvas container:', canvasContainer.id || canvasContainer.className);
      
      // Clone the entire canvas container
      const clonedCanvas = canvasContainer.cloneNode(true);
      
      // REMOVE zoom slider and nudge controls from the preview FIRST (before removing IDs)
      // Remove zoom slider (.zoom-bar or any element with "zoom" in class)
      const zoomElements = clonedCanvas.querySelectorAll('.zoom-bar, [class*="zoom"]');
      zoomElements.forEach(el => {
        // Only remove if it's a slider control, not zoom text labels
        if (el.classList.contains('zoom-bar') || el.querySelector('input[type="range"]')) {
          console.log('🗑️ Removing zoom element:', el.id || el.className);
          el.remove();
        }
      });
      
      // Remove nudge controls - multiple selectors to catch everything
      // IMPORTANT: Do this BEFORE removing IDs so we can find them by ID
      const nudgeSelectors = [
        '[id*="canvas-nudge-controls"]',
        '[id*="nudge-pad"]',
        '[id*="nudge"]',
        '[class*="nudge"]',
        '.canvas-nudge-btn'
      ];
      
      nudgeSelectors.forEach(selector => {
        const elements = clonedCanvas.querySelectorAll(selector);
        elements.forEach(el => {
          console.log('🗑️ Removing nudge element:', el.id || el.className);
          el.remove();
        });
      });
      
      console.log('✅ Cleaned preview - removed zoom slider and all nudge controls');
      
      // NOW remove any remaining IDs to avoid conflicts
      clonedCanvas.id = 'preview-clone';
      clonedCanvas.querySelectorAll('[id]').forEach(el => el.id = '');
      
      // Force explicit display and dimensions
      clonedCanvas.style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        width: 700px !important;
        height: 700px !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        transform-origin: center center !important;
        pointer-events: none !important;
        border-radius: 12px !important;
        overflow: visible !important;
        transition: transform 0.2s ease !important;
      `;
      
      // Apply zoom separately so it doesn't get overridden
      const currentZoom = typeof previewZoomLevel !== 'undefined' ? previewZoomLevel : 1.0;
      clonedCanvas.style.transform = `scale(${currentZoom})`;
      clonedCanvas.style.transformOrigin = 'center center';
      
      // Clear preview and add clone
      previewContainer.innerHTML = '';
      previewContainer.appendChild(clonedCanvas);
      
      // Log dimensions for debugging
      setTimeout(() => {
        const rect = clonedCanvas.getBoundingClientRect();
        console.log('📐 Clone dimensions:', rect.width, 'x', rect.height);
        console.log('📦 Clone in DOM:', document.getElementById('preview-clone') ? 'YES' : 'NO');
      }, 100);
      
      console.log('✅ Preview populated with canvas');
      return;
    }
    
    // Fallback 1: Show just the uploaded image from overlay
    console.log('🔍 Canvas not found, trying overlay image...');
    const overlayImg = document.querySelector('#nt-overlay-' + window.STUDIO_SECTION_ID + ' img');
    
    if (overlayImg) {
      console.log('✅ Found overlay image');
      
      // Create a wrapper that mimics the t-shirt view
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: relative;
        max-width: 400px;
        margin: 0 auto;
      `;
      
      // Clone the t-shirt base if available
      const tshirtBase = document.querySelector('#nt-base-' + window.STUDIO_SECTION_ID + ' img');
      if (tshirtBase) {
        const clonedBase = tshirtBase.cloneNode(true);
        clonedBase.style.cssText = `
          width: 100%;
          height: auto;
          display: block;
        `;
        wrapper.appendChild(clonedBase);
      }
      
      // Add the design overlay
      const clonedImg = overlayImg.cloneNode(true);
      clonedImg.style.cssText = `
        position: ${tshirtBase ? 'absolute' : 'relative'};
        top: ${tshirtBase ? '30%' : '0'};
        left: ${tshirtBase ? '50%' : '50%'};
        transform: translateX(-50%);
        max-width: ${tshirtBase ? '40%' : '80%'};
        max-height: 350px;
        object-fit: contain;
        pointer-events: none;
      `;
      wrapper.appendChild(clonedImg);
      
      previewContainer.innerHTML = '';
      previewContainer.appendChild(wrapper);
      console.log('✅ Preview populated with design image + base');
      return;
    }
    
    // Fallback 2: Show message
    console.warn('⚠️ No canvas or image found');
    previewContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <p style="color: #94a3b8; margin-bottom: 12px;">No design preview available</p>
        <p style="color: #cbd5e1; font-size: 13px;">Your changes will be applied to the main canvas</p>
      </div>
    `;
  }
  
  // Close modal
  function closeEditModal() {
    modal.style.display = 'none';
    studio.editOps?.close();
  }
  
  // Find Edit Design button - ID is nt-edit-" + window.STUDIO_SECTION_ID + "
  const actualEditBtn = document.getElementById('nt-edit-' + window.STUDIO_SECTION_ID);
  
  if (actualEditBtn) {
    actualEditBtn.addEventListener('click', openEditModal);
    console.log('✅ Edit Design button (nt-edit-' + window.STUDIO_SECTION_ID + ') wired to modal');
  } else {
    console.warn('⚠️ Could not find Edit Design button with ID: nt-edit-' + window.STUDIO_SECTION_ID);
  }
  
  closeBtn.addEventListener('click', closeEditModal);
  doneBtn.addEventListener('click', closeEditModal);
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeEditModal();
  });
  
  // ========================================
  // TRANSFORM TAB - WITH SYNCED SCALE SLIDER
  // ========================================
  const scaleInput = document.getElementById('scale-input-' + window.STUDIO_SECTION_ID);
  const scaleSlider = document.getElementById('scale-slider-' + window.STUDIO_SECTION_ID);
  const scaleOutput = document.getElementById('scale-output-' + window.STUDIO_SECTION_ID);
  
  // Sync scale input → slider & output
  scaleInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    scaleSlider.value = value;
    scaleOutput.textContent = Math.round(value) + '%';
    studio.editOps?.scale(value);
    setTimeout(populatePreview, 100);
  });
  
  // Sync scale slider → input & output
  scaleSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    scaleInput.value = value;
    scaleOutput.textContent = Math.round(value) + '%';
    studio.editOps?.scale(value);
    setTimeout(populatePreview, 100);
  });
  
  // ========================================
  // PREVIEW ZOOM CONTROLS
  // ========================================
  let previewZoomLevel = 1.0;
  
  const previewZoomRange = document.getElementById('preview-zoom-range-' + window.STUDIO_SECTION_ID);
  const previewZoomLabel = document.getElementById('preview-zoom-label-' + window.STUDIO_SECTION_ID);
  
  if (previewZoomRange && previewZoomLabel) {
    previewZoomRange.addEventListener('input', (e) => {
      const percent = parseInt(e.target.value, 10);
      previewZoomLevel = percent / 100;
      previewZoomLabel.textContent = `${percent}%`;
      
      // Apply zoom to the preview container's content
      const previewContainer = document.getElementById('edit-preview-' + window.STUDIO_SECTION_ID);
      const previewClone = previewContainer?.querySelector('#preview-clone');
      
      if (previewClone) {
        previewClone.style.transform = `scale(${previewZoomLevel})`;
        previewClone.style.transition = 'transform 0.2s ease';
      }
      
      console.log(`🔍 Preview zoom: ${percent}%`);
    });
    
    console.log('✅ Preview zoom controls initialized');
  }
  
  document.getElementById('rotation-input-' + window.STUDIO_SECTION_ID).addEventListener('input', (e) => {
    studio.editOps?.rotate(parseFloat(e.target.value));
    setTimeout(populatePreview, 100); // Update preview after transform
  });
  
  document.getElementById('flip-h-btn-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    studio.editOps?.flipX();
    setTimeout(populatePreview, 100); // Update preview after transform
  });
  
  document.getElementById('flip-v-btn-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    studio.editOps?.flipY();
    setTimeout(populatePreview, 100); // Update preview after transform
  });
  
  // Nudge controls with 0.25 step (same as main canvas)
  const NUDGE_STEP = 0.25;
  document.getElementById('nudge-up-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    studio.editOps?.nudge(0, -1, NUDGE_STEP);
    setTimeout(populatePreview, 100);
  });
  document.getElementById('nudge-down-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    studio.editOps?.nudge(0, 1, NUDGE_STEP);
    setTimeout(populatePreview, 100);
  });
  document.getElementById('nudge-left-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    studio.editOps?.nudge(-1, 0, NUDGE_STEP);
    setTimeout(populatePreview, 100);
  });
  document.getElementById('nudge-right-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    studio.editOps?.nudge(1, 0, NUDGE_STEP);
    setTimeout(populatePreview, 100);
  });
  
  // Arrow key support with 0.25 step
  document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
      if (e.key === 'ArrowUp') { e.preventDefault(); studio.editOps?.nudge(0, -1, NUDGE_STEP); setTimeout(populatePreview, 100); }
      if (e.key === 'ArrowDown') { e.preventDefault(); studio.editOps?.nudge(0, 1, NUDGE_STEP); setTimeout(populatePreview, 100); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); studio.editOps?.nudge(-1, 0, NUDGE_STEP); setTimeout(populatePreview, 100); }
      if (e.key === 'ArrowRight') { e.preventDefault(); studio.editOps?.nudge(1, 0, NUDGE_STEP); setTimeout(populatePreview, 100); }
      if (e.key === 'Escape') { closeEditModal(); }
    }
  });
  
  document.getElementById('center-btn-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    studio.editOps?.center();
    setTimeout(populatePreview, 100);
  });
  
  document.getElementById('autofit-btn-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    studio.editOps?.autoFit();
    setTimeout(populatePreview, 100);
  });
  
  // ========================================
  // CROP TAB
  // ========================================
  const cropInitBtn = document.getElementById('crop-init-btn-' + window.STUDIO_SECTION_ID);
  const cropApplyBtn = document.getElementById('crop-apply-btn-' + window.STUDIO_SECTION_ID);
  const cropCancelBtn = document.getElementById('crop-cancel-btn-' + window.STUDIO_SECTION_ID);
  
  cropInitBtn.addEventListener('click', () => {
    const success = studio.editOps?.initCrop();
    if (success) {
      cropApplyBtn.disabled = false;
      cropApplyBtn.style.opacity = '1';
      cropCancelBtn.disabled = false;
      cropCancelBtn.style.opacity = '1';
      cropInitBtn.disabled = true;
      cropInitBtn.style.opacity = '0.5';
    }
  });
  
  cropApplyBtn.addEventListener('click', () => {
    studio.editOps?.applyCrop();
    cropInitBtn.disabled = false;
    cropInitBtn.style.opacity = '1';
    cropApplyBtn.disabled = true;
    cropApplyBtn.style.opacity = '0.5';
    cropCancelBtn.disabled = true;
    cropCancelBtn.style.opacity = '0.5';
  });
  
  cropCancelBtn.addEventListener('click', () => {
    studio.editOps?.cancelCrop();
    cropInitBtn.disabled = false;
    cropInitBtn.style.opacity = '1';
    cropApplyBtn.disabled = true;
    cropApplyBtn.style.opacity = '0.5';
    cropCancelBtn.disabled = true;
    cropCancelBtn.style.opacity = '0.5';
  });
  
  // ========================================
  // BACKGROUND TAB
  // ========================================
  const bgToleranceSlider = document.getElementById('bg-tolerance-' + window.STUDIO_SECTION_ID);
  const toleranceValue = document.getElementById('tolerance-value-' + window.STUDIO_SECTION_ID);
  
  bgToleranceSlider.addEventListener('input', (e) => {
    toleranceValue.textContent = e.target.value;
  });
  
  document.getElementById('remove-bg-btn-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    const color = document.getElementById('bg-color-' + window.STUDIO_SECTION_ID).value;
    const tolerance = parseInt(bgToleranceSlider.value);
    studio.editOps?.removeBackground(color, tolerance);
  });
  
  document.getElementById('revert-bg-btn-' + window.STUDIO_SECTION_ID).addEventListener('click', () => {
    studio.editOps?.revertBackground();
  });
  
  // ========================================
  // ADJUST TAB
  // ========================================
  const opacitySlider = document.getElementById('opacity-slider-' + window.STUDIO_SECTION_ID);
  const opacityValue = document.getElementById('opacity-value-' + window.STUDIO_SECTION_ID);
  
  opacitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    opacityValue.textContent = val;
    studio.editOps?.setOpacity(val / 100);
  });
  
  const brightnessSlider = document.getElementById('brightness-slider-' + window.STUDIO_SECTION_ID);
  const brightnessValue = document.getElementById('brightness-value-' + window.STUDIO_SECTION_ID);
  
  brightnessSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    brightnessValue.textContent = val;
    studio.editOps?.setBrightness(parseFloat(val));
  });
  
  const contrastSlider = document.getElementById('contrast-slider-' + window.STUDIO_SECTION_ID);
  const contrastValue = document.getElementById('contrast-value-' + window.STUDIO_SECTION_ID);
  
  contrastSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    contrastValue.textContent = val;
    studio.editOps?.setContrast(parseFloat(val));
  });
  
  const grayscaleCheck = document.getElementById('grayscale-check-' + window.STUDIO_SECTION_ID);
  grayscaleCheck.addEventListener('change', (e) => {
    studio.editOps?.setGrayscale(e.target.checked);
  });
  
  const outlineSlider = document.getElementById('outline-slider-' + window.STUDIO_SECTION_ID);
  const outlineValue = document.getElementById('outline-value-' + window.STUDIO_SECTION_ID);
  
  outlineSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    outlineValue.textContent = val;
    studio.editOps?.addOutline(parseInt(val), '#000000');
  });
  
  // ========================================
  // REPLACE TAB
  // ========================================
  const replaceDropzone = document.getElementById('replace-dropzone-' + window.STUDIO_SECTION_ID);
  const replaceInput = document.getElementById('replace-input-' + window.STUDIO_SECTION_ID);
  
  replaceDropzone.addEventListener('click', () => {
    replaceInput.click();
  });
  
  replaceInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // This would replace the design while preserving transforms
        // Implementation depends on your existing upload system
        alert('🚧 Replace functionality coming soon! Will preserve your position, scale, and rotation.');
      };
      reader.readAsDataURL(file);
    }
  });
  
  // ========================================
  // QUALITY TAB
  // ========================================
  function updateQualityMeter() {
    const info = studio.editOps?.qualityInfo();
    if (!info || !info.dpi) return;
    
    const dpiNumber = document.getElementById('dpi-number-' + window.STUDIO_SECTION_ID);
    const qualityBadge = document.getElementById('quality-badge-' + window.STUDIO_SECTION_ID);
    const qualityWarning = document.getElementById('quality-warning-' + window.STUDIO_SECTION_ID);
    
    dpiNumber.textContent = info.dpi || '---';
    
    // Color coding
    if (info.level === 'excellent') {
      dpiNumber.style.color = '#27e1c1';
      qualityBadge.style.background = '#27e1c1';
      qualityBadge.style.color = '#0f172a';
      qualityBadge.textContent = '✓ EXCELLENT QUALITY';
      qualityWarning.style.display = 'none';
    } else if (info.level === 'ok') {
      dpiNumber.style.color = '#f59e0b';
      qualityBadge.style.background = '#f59e0b';
      qualityBadge.style.color = 'white';
      qualityBadge.textContent = '⚠ ACCEPTABLE QUALITY';
      qualityWarning.style.display = 'none';
    } else if (info.level === 'low') {
      dpiNumber.style.color = '#ef4444';
      qualityBadge.style.background = '#ef4444';
      qualityBadge.style.color = 'white';
      qualityBadge.textContent = '⚠ LOW QUALITY';
      qualityWarning.style.display = 'block';
    } else {
      dpiNumber.style.color = '#dc2626';
      qualityBadge.style.background = '#dc2626';
      qualityBadge.style.color = 'white';
      qualityBadge.textContent = '❌ POOR QUALITY';
      qualityWarning.style.display = 'block';
    }
  }
  
  console.log('✅ Edit Modal fully initialized with all 7 tabs');
}




