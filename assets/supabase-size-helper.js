/**
 * NEWTHRIFTS SIZE CHART HELPER
 * =============================
 * Functions to work with size charts and recommendations
 */

// ============================================================================
// SIZE CHART FUNCTIONS
// ============================================================================

/**
 * Ensure Supabase client is ready
 */
async function ensureSupabaseReady() {
  if (!window.supabaseClient) {
    throw new Error('Supabase client not found. Please ensure supabase-config.js is loaded.');
  }
  
  const client = await window.supabaseClient.getClient();
  if (!client) {
    throw new Error('Supabase client initialization failed');
  }
  
  return client;
}

/**
 * Get size chart for a specific product and color
 * @param {string} productType - Product type (default: 't-shirt')
 * @param {string} color - Color (default: 'black')
 * @returns {Array} Size chart data
 */
async function getSizeChart(productType = 't-shirt', color = 'black') {
  try {
    const supabase = await ensureSupabaseReady();
    
    const { data, error } = await supabase
      .from('size_charts')
      .select('*')
      .eq('product_type', productType)
      .eq('color', color)
      .eq('is_active', true)
      .order('size_code', { ascending: true });

    if (error) throw error;

    return { success: true, sizes: data };
  } catch (error) {
    console.error('❌ Error fetching size chart:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all available sizes for a product type
 * @param {string} productType - Product type
 * @returns {Array} Available sizes
 */
async function getAvailableSizes(productType = 't-shirt') {
  try {
    const supabase = await ensureSupabaseReady();
    
    const { data, error } = await supabase
      .from('size_charts')
      .select('size_code, color')
      .eq('product_type', productType)
      .eq('is_active', true);

    if (error) throw error;

    // Group by size_code
    const sizes = [...new Set(data.map(item => item.size_code))];
    
    return { success: true, sizes: sizes.sort() };
  } catch (error) {
    console.error('❌ Error fetching available sizes:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get size recommendation based on user measurements
 * @param {Object} measurements - User measurements
 * @param {number} measurements.height - Height in cm
 * @param {number} measurements.weight - Weight in kg
 * @param {string} measurements.fitPreference - 'tight', 'regular', 'loose', 'oversized'
 * @returns {Object} Recommended size
 */
async function getRecommendedSize(measurements) {
  try {
    const supabase = await ensureSupabaseReady();
    const { height, weight, fitPreference = 'regular' } = measurements;

    const { data, error } = await supabase
      .rpc('get_recommended_size', {
        user_height: height,
        user_weight: weight,
        preferred_fit: fitPreference
      });

    if (error) throw error;

    if (data && data.length > 0) {
      return { 
        success: true, 
        recommendation: data[0],
        message: `We recommend size ${data[0].size_code} based on your measurements`
      };
    } else {
      return { 
        success: false, 
        message: 'No recommendation found for these measurements. Please refer to the size chart.'
      };
    }
  } catch (error) {
    console.error('❌ Error getting size recommendation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get complete size guide with recommendations
 * @returns {Array} Complete size guide
 */
async function getCompleteSizeGuide() {
  try {
    const supabase = await ensureSupabaseReady();
    
    const { data, error } = await supabase
      .from('complete_size_guide')
      .select('*');

    if (error) throw error;

    return { success: true, guide: data };
  } catch (error) {
    console.error('❌ Error fetching size guide:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Display size chart in a modal or section
 * @param {string} containerId - ID of container element
 * @param {string} productType - Product type
 * @param {string} color - Color
 */
async function displaySizeChart(containerId, productType = 't-shirt', color = 'black') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  const result = await getSizeChart(productType, color);
  
  if (!result.success) {
    container.innerHTML = '<p>Error loading size chart</p>';
    return;
  }

  const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const sortedSizes = result.sizes.sort((a, b) => {
    return sizeOrder.indexOf(a.size_code) - sizeOrder.indexOf(b.size_code);
  });

  const html = `
    <div class="size-chart-container">
      <h3>📏 Size Chart - ${productType.charAt(0).toUpperCase() + productType.slice(1)} (${color.charAt(0).toUpperCase() + color.slice(1)})</h3>
      <p class="size-chart-note">
        <small>
          ⚠️ Flat measurement, ±${sortedSizes[0]?.margin_of_error || '1-3'}cm margin of error.<br>
          Due to individual body differences, please choose carefully.<br>
          Slight color differences may occur due to lighting and printing.
        </small>
      </p>
      <div class="size-chart-table-wrapper">
        <table class="size-chart-table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Length (cm)<br><small>衣长</small></th>
              <th>Bust (cm)<br><small>胸宽</small></th>
              <th>Shoulder (cm)<br><small>肩宽</small></th>
              <th>Sleeve (cm)<br><small>袖长</small></th>
            </tr>
          </thead>
          <tbody>
            ${sortedSizes.map(size => `
              <tr>
                <td><strong>${size.size_code}</strong></td>
                <td>${size.garment_length}</td>
                <td>${size.bust_width}</td>
                <td>${size.shoulder_width}</td>
                <td>${size.sleeve_length}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Create size selector dropdown
 * @param {string} containerId - ID of container element
 * @param {string} productType - Product type
 * @param {Function} onChange - Callback when size changes
 */
async function createSizeSelector(containerId, productType = 't-shirt', onChange) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  const result = await getAvailableSizes(productType);
  
  if (!result.success) {
    container.innerHTML = '<p>Error loading sizes</p>';
    return;
  }

  const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const sortedSizes = result.sizes.sort((a, b) => {
    return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
  });

  const html = `
    <div class="size-selector">
      <label for="size-select">Select Size:</label>
      <select id="size-select" class="size-select-dropdown">
        <option value="">Choose a size</option>
        ${sortedSizes.map(size => `
          <option value="${size}">${size}</option>
        `).join('')}
      </select>
      <button type="button" id="size-guide-btn" class="size-guide-btn">
        📏 Size Guide
      </button>
    </div>
  `;

  container.innerHTML = html;

  // Add event listener
  const select = document.getElementById('size-select');
  if (select && onChange) {
    select.addEventListener('change', (e) => onChange(e.target.value));
  }

  // Add size guide button handler
  const guideBtn = document.getElementById('size-guide-btn');
  if (guideBtn) {
    guideBtn.addEventListener('click', () => {
      showSizeGuideModal(productType);
    });
  }
}

/**
 * Show size guide in a modal
 * @param {string} productType - Product type
 * @param {string} color - Color (optional)
 */
function showSizeGuideModal(productType = 't-shirt', color = 'black') {
  // Create modal
  const modalId = 'size-guide-modal';
  let modal = document.getElementById(modalId);
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'size-guide-modal';
    modal.innerHTML = `
      <div class="size-guide-modal-content">
        <button class="size-guide-close" onclick="document.getElementById('${modalId}').style.display='none'">&times;</button>
        <div id="size-guide-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.style.display = 'flex';
  displaySizeChart('size-guide-content', productType, color);
}

/**
 * Size recommendation wizard
 * @param {string} containerId - Container ID
 * @param {Function} onComplete - Callback with recommended size
 */
function createSizeRecommendationWizard(containerId, onComplete) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const html = `
    <div class="size-wizard">
      <h4>🎯 Find Your Perfect Size</h4>
      <form id="size-wizard-form">
        <div class="form-group">
          <label for="height">Height (cm):</label>
          <input type="number" id="height" name="height" min="140" max="220" required>
        </div>
        <div class="form-group">
          <label for="weight">Weight (kg):</label>
          <input type="number" id="weight" name="weight" min="30" max="150" required>
        </div>
        <div class="form-group">
          <label for="fit">Preferred Fit:</label>
          <select id="fit" name="fit" required>
            <option value="regular">Regular Fit</option>
            <option value="tight">Tight Fit</option>
            <option value="loose">Loose Fit</option>
            <option value="oversized">Oversized</option>
          </select>
        </div>
        <button type="submit" class="size-wizard-submit">Get Recommendation</button>
      </form>
      <div id="size-wizard-result" style="display:none;"></div>
    </div>
  `;

  container.innerHTML = html;

  const form = document.getElementById('size-wizard-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const measurements = {
      height: parseInt(document.getElementById('height').value),
      weight: parseInt(document.getElementById('weight').value),
      fitPreference: document.getElementById('fit').value
    };

    const result = await getRecommendedSize(measurements);
    const resultDiv = document.getElementById('size-wizard-result');
    
    if (result.success) {
      resultDiv.innerHTML = `
        <div class="size-recommendation-success">
          <h5>✅ Recommended Size: ${result.recommendation.size_code}</h5>
          <p>${result.message}</p>
          <p><small>${result.recommendation.reason}</small></p>
        </div>
      `;
      resultDiv.style.display = 'block';
      
      if (onComplete) {
        onComplete(result.recommendation.size_code);
      }
    } else {
      resultDiv.innerHTML = `
        <div class="size-recommendation-error">
          <p>⚠️ ${result.message || 'Could not find a recommendation'}</p>
          <p><small>Please refer to the size chart manually.</small></p>
        </div>
      `;
      resultDiv.style.display = 'block';
    }
  });
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

window.NewThriftsSizes = {
  getSizeChart,
  getAvailableSizes,
  getRecommendedSize,
  getCompleteSizeGuide,
  displaySizeChart,
  createSizeSelector,
  showSizeGuideModal,
  createSizeRecommendationWizard
};

console.log('✅ NewThrifts Size System loaded! Access via: window.NewThriftsSizes');

