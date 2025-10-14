/**
 * NEWTHRIFTS DESIGN SYSTEM - Supabase Helper Functions
 * =====================================================
 * Easy-to-use functions for custom t-shirt designs, gallery, and analytics
 */

// ============================================================================
// CUSTOM DESIGNS - Save and manage user designs
// ============================================================================

/**
 * Save a new custom design
 * @param {Object} designData - The design configuration
 * @param {string} designData.name - Name of the design
 * @param {Object} designData.canvas - Canvas/SVG data
 * @param {string} designData.previewUrl - Preview image URL
 * @param {string} designData.baseColor - Base t-shirt color
 * @param {string} designData.size - T-shirt size
 * @param {boolean} designData.isPublic - Make design public?
 * @param {Array} designData.tags - Tags for categorization
 * @returns {Object} Saved design or error
 */
async function saveCustomDesign(designData) {
  try {
    const { data: userData } = await window.supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User must be logged in to save designs');
    }

    const { data, error } = await window.supabase
      .from('custom_designs')
      .insert([{
        user_id: userData.user.id,
        design_name: designData.name,
        design_data: designData.canvas,
        preview_image_url: designData.previewUrl,
        base_color: designData.baseColor || '#ffffff',
        size: designData.size || 'M',
        is_public: designData.isPublic || false,
        tags: designData.tags || [],
        shopify_product_id: designData.productId,
        shopify_variant_id: designData.variantId
      }])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Design saved:', data);
    return { success: true, design: data };
  } catch (error) {
    console.error('❌ Error saving design:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all designs for current user
 * @param {Object} options - Query options
 * @param {boolean} options.publicOnly - Only public designs
 * @param {number} options.limit - Max results
 * @returns {Array} User's designs
 */
async function getUserDesigns(options = {}) {
  try {
    const { data: userData } = await window.supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User must be logged in');
    }

    let query = window.supabase
      .from('custom_designs')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (options.publicOnly) {
      query = query.eq('is_public', true);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, designs: data };
  } catch (error) {
    console.error('❌ Error fetching designs:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing design
 * @param {string} designId - Design ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated design or error
 */
async function updateDesign(designId, updates) {
  try {
    const { data, error } = await window.supabase
      .from('custom_designs')
      .update(updates)
      .eq('id', designId)
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Design updated:', data);
    return { success: true, design: data };
  } catch (error) {
    console.error('❌ Error updating design:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a design
 * @param {string} designId - Design ID
 * @returns {Object} Success status
 */
async function deleteDesign(designId) {
  try {
    const { error } = await window.supabase
      .from('custom_designs')
      .delete()
      .eq('id', designId);

    if (error) throw error;

    console.log('✅ Design deleted');
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting design:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// DESIGN GALLERY - Browse and interact with public designs
// ============================================================================

/**
 * Get popular designs from gallery
 * @param {Object} options - Query options
 * @param {number} options.limit - Max results (default 20)
 * @param {string} options.sortBy - Sort field (likes, views, created_at)
 * @returns {Array} Gallery designs
 */
async function getGalleryDesigns(options = {}) {
  try {
    const limit = options.limit || 20;
    const sortBy = options.sortBy || 'likes_count';

    const { data, error } = await window.supabase
      .from('design_gallery')
      .select(`
        *,
        custom_designs!inner(design_name, preview_image_url, tags, base_color)
      `)
      .order(sortBy, { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, designs: data };
  } catch (error) {
    console.error('❌ Error fetching gallery:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add design to public gallery
 * @param {string} designId - Custom design ID
 * @param {Object} galleryData - Gallery metadata
 * @returns {Object} Gallery entry or error
 */
async function addToGallery(designId, galleryData = {}) {
  try {
    const { data: userData } = await window.supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User must be logged in');
    }

    // First, make the design public
    await window.supabase
      .from('custom_designs')
      .update({ is_public: true })
      .eq('id', designId);

    // Then add to gallery
    const { data, error } = await window.supabase
      .from('design_gallery')
      .insert([{
        custom_design_id: designId,
        user_id: userData.user.id,
        title: galleryData.title,
        description: galleryData.description
      }])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Added to gallery:', data);
    return { success: true, galleryItem: data };
  } catch (error) {
    console.error('❌ Error adding to gallery:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Like a design in the gallery
 * @param {string} designId - Design ID
 * @param {string} galleryId - Gallery ID
 * @returns {Object} Like status
 */
async function likeDesign(designId, galleryId) {
  try {
    const { data: userData } = await window.supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User must be logged in to like designs');
    }

    const { data, error } = await window.supabase
      .from('design_likes')
      .insert([{
        design_id: designId,
        gallery_id: galleryId,
        user_id: userData.user.id
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation - already liked
        return { success: false, error: 'Already liked this design' };
      }
      throw error;
    }

    console.log('✅ Design liked');
    return { success: true, like: data };
  } catch (error) {
    console.error('❌ Error liking design:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Unlike a design
 * @param {string} designId - Design ID
 * @returns {Object} Unlike status
 */
async function unlikeDesign(designId) {
  try {
    const { data: userData } = await window.supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User must be logged in');
    }

    const { error } = await window.supabase
      .from('design_likes')
      .delete()
      .eq('design_id', designId)
      .eq('user_id', userData.user.id);

    if (error) throw error;

    console.log('✅ Design unliked');
    return { success: true };
  } catch (error) {
    console.error('❌ Error unliking design:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Increment view count for a design
 * @param {string} galleryId - Gallery ID
 */
async function incrementDesignViews(galleryId) {
  try {
    const { error } = await window.supabase.rpc('increment', {
      row_id: galleryId,
      table_name: 'design_gallery',
      column_name: 'views_count'
    });

    if (error) console.error('Error incrementing views:', error);
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

// ============================================================================
// DESIGN TEMPLATES - Get pre-made templates
// ============================================================================

/**
 * Get design templates
 * @param {Object} options - Query options
 * @param {string} options.category - Filter by category
 * @param {boolean} options.premiumOnly - Only premium templates
 * @returns {Array} Design templates
 */
async function getDesignTemplates(options = {}) {
  try {
    let query = window.supabase
      .from('design_templates')
      .select('*')
      .eq('is_active', true)
      .order('usage_count', { ascending: false });

    if (options.category) {
      query = query.eq('category', options.category);
    }

    if (options.premiumOnly) {
      query = query.eq('is_premium', true);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, templates: data };
  } catch (error) {
    console.error('❌ Error fetching templates:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Use a template (increment usage count)
 * @param {string} templateId - Template ID
 */
async function useTemplate(templateId) {
  try {
    await window.supabase
      .from('design_templates')
      .update({ usage_count: window.supabase.sql`usage_count + 1` })
      .eq('id', templateId);
  } catch (error) {
    console.error('Error tracking template usage:', error);
  }
}

// ============================================================================
// PRODUCT INTERACTIONS - Track user engagement
// ============================================================================

/**
 * Track product interaction
 * @param {Object} interaction - Interaction data
 * @param {string} interaction.productId - Shopify product ID
 * @param {string} interaction.type - Interaction type (view, quick_view, add_to_cart, etc.)
 * @param {Object} interaction.metadata - Additional data
 */
async function trackProductInteraction(interaction) {
  try {
    const { data: userData } = await window.supabase.auth.getUser();
    const sessionId = localStorage.getItem('session_id') || generateSessionId();

    const { error } = await window.supabase
      .from('product_interactions')
      .insert([{
        user_id: userData.user?.id || null,
        session_id: sessionId,
        shopify_product_id: interaction.productId,
        product_title: interaction.productTitle,
        interaction_type: interaction.type,
        variant_id: interaction.variantId,
        variant_title: interaction.variantTitle,
        price: interaction.price,
        metadata: interaction.metadata || {}
      }]);

    if (error) throw error;

    console.log(`📊 Tracked: ${interaction.type} for product ${interaction.productId}`);
  } catch (error) {
    console.error('❌ Error tracking interaction:', error);
  }
}

/**
 * Get product analytics
 * @param {string} productId - Shopify product ID
 * @returns {Object} Product analytics
 */
async function getProductAnalytics(productId) {
  try {
    const { data, error } = await window.supabase
      .from('product_interactions')
      .select('interaction_type, created_at')
      .eq('shopify_product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate stats
    const stats = {
      total_views: data.filter(i => i.interaction_type === 'view').length,
      quick_views: data.filter(i => i.interaction_type === 'quick_view').length,
      add_to_cart: data.filter(i => i.interaction_type === 'add_to_cart').length,
      wishlist: data.filter(i => i.interaction_type === 'wishlist').length,
      purchases: data.filter(i => i.interaction_type === 'purchase').length
    };

    stats.conversion_rate = stats.total_views > 0 
      ? ((stats.purchases / stats.total_views) * 100).toFixed(2) 
      : 0;

    return { success: true, stats, rawData: data };
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ORDER CUSTOMIZATIONS - Link designs to Shopify orders
// ============================================================================

/**
 * Save order customization when order is placed
 * @param {Object} orderData - Order information
 * @returns {Object} Saved order customization
 */
async function saveOrderCustomization(orderData) {
  try {
    const { data: userData } = await window.supabase.auth.getUser();

    const { data, error } = await window.supabase
      .from('order_customizations')
      .insert([{
        shopify_order_id: orderData.orderId,
        shopify_line_item_id: orderData.lineItemId,
        shopify_order_number: orderData.orderNumber,
        user_id: userData.user?.id || null,
        custom_design_id: orderData.designId,
        customization_data: orderData.designSnapshot,
        product_title: orderData.productTitle,
        variant_title: orderData.variantTitle,
        quantity: orderData.quantity,
        price: orderData.price,
        order_status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Order customization saved:', data);
    return { success: true, orderCustomization: data };
  } catch (error) {
    console.error('❌ Error saving order customization:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user's order history with customizations
 * @returns {Array} Order history
 */
async function getUserOrders() {
  try {
    const { data: userData } = await window.supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('User must be logged in');
    }

    const { data, error } = await window.supabase
      .from('order_customizations')
      .select(`
        *,
        custom_designs(design_name, preview_image_url)
      `)
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, orders: data };
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateSessionId() {
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('session_id', sessionId);
  return sessionId;
}

// ============================================================================
// EXPORT FUNCTIONS (Make them globally available)
// ============================================================================

window.NewThriftsDesigns = {
  // Custom Designs
  saveCustomDesign,
  getUserDesigns,
  updateDesign,
  deleteDesign,
  
  // Gallery
  getGalleryDesigns,
  addToGallery,
  likeDesign,
  unlikeDesign,
  incrementDesignViews,
  
  // Templates
  getDesignTemplates,
  useTemplate,
  
  // Analytics
  trackProductInteraction,
  getProductAnalytics,
  
  // Orders
  saveOrderCustomization,
  getUserOrders
};

console.log('✅ NewThrifts Design System loaded! Access via: window.NewThriftsDesigns');

