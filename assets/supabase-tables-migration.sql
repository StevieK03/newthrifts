-- ============================================================================
-- NEWTHRIFTS DATABASE TABLES - ESSENTIAL 5
-- ============================================================================
-- Created for: Custom T-shirt Design & E-commerce Platform
-- Tables: custom_designs, order_customizations, product_interactions, 
--         design_templates, design_gallery
-- ============================================================================

-- ============================================================================
-- 1. CUSTOM_DESIGNS - Store user-created t-shirt designs
-- ============================================================================
CREATE TABLE IF NOT EXISTS custom_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  design_name TEXT NOT NULL,
  design_data JSONB NOT NULL, -- SVG/canvas data, colors, positions
  preview_image_url TEXT,
  base_color TEXT DEFAULT '#ffffff',
  size TEXT DEFAULT 'M',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  shopify_product_id TEXT,
  shopify_variant_id TEXT,
  tags TEXT[] DEFAULT '{}',
  views_count INTEGER DEFAULT 0,
  copies_count INTEGER DEFAULT 0
);

-- Indexes for custom_designs
CREATE INDEX IF NOT EXISTS idx_custom_designs_user_id ON custom_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_designs_created_at ON custom_designs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_designs_is_public ON custom_designs(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_custom_designs_shopify_product ON custom_designs(shopify_product_id);
CREATE INDEX IF NOT EXISTS idx_custom_designs_tags ON custom_designs USING GIN(tags);

-- RLS Policies for custom_designs
ALTER TABLE custom_designs ENABLE ROW LEVEL SECURITY;

-- Users can view their own designs
CREATE POLICY "Users can view own designs" ON custom_designs
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view public designs
CREATE POLICY "Anyone can view public designs" ON custom_designs
  FOR SELECT USING (is_public = true);

-- Users can insert their own designs
CREATE POLICY "Users can create designs" ON custom_designs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own designs
CREATE POLICY "Users can update own designs" ON custom_designs
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own designs
CREATE POLICY "Users can delete own designs" ON custom_designs
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_custom_designs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER custom_designs_updated_at
  BEFORE UPDATE ON custom_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_custom_designs_updated_at();

-- ============================================================================
-- 2. ORDER_CUSTOMIZATIONS - Link Shopify orders to custom designs
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_order_id TEXT NOT NULL,
  shopify_line_item_id TEXT,
  shopify_order_number TEXT,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  custom_design_id UUID REFERENCES custom_designs(id) ON DELETE SET NULL,
  customization_data JSONB, -- Snapshot of design at order time
  product_title TEXT,
  variant_title TEXT,
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10, 2),
  order_status TEXT DEFAULT 'pending', -- pending, processing, fulfilled, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  fulfilled_at TIMESTAMPTZ,
  
  CONSTRAINT unique_line_item UNIQUE(shopify_order_id, shopify_line_item_id)
);

-- Indexes for order_customizations
CREATE INDEX IF NOT EXISTS idx_order_customizations_shopify_order ON order_customizations(shopify_order_id);
CREATE INDEX IF NOT EXISTS idx_order_customizations_user_id ON order_customizations(user_id);
CREATE INDEX IF NOT EXISTS idx_order_customizations_design_id ON order_customizations(custom_design_id);
CREATE INDEX IF NOT EXISTS idx_order_customizations_created_at ON order_customizations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_customizations_status ON order_customizations(order_status);

-- RLS Policies for order_customizations
ALTER TABLE order_customizations ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON order_customizations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders (via webhook/api)
CREATE POLICY "Users can create orders" ON order_customizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 3. PRODUCT_INTERACTIONS - Track detailed product engagement
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  shopify_product_id TEXT NOT NULL,
  product_title TEXT,
  interaction_type TEXT NOT NULL, -- 'view', 'quick_view', 'add_to_cart', 'wishlist', 'remove_from_cart', 'purchase'
  variant_id TEXT,
  variant_title TEXT,
  price DECIMAL(10, 2),
  metadata JSONB, -- Extra data like color, size, source page, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (interaction_type IN ('view', 'quick_view', 'add_to_cart', 'wishlist', 'remove_from_cart', 'purchase', 'remove_from_wishlist'))
);

-- Indexes for product_interactions
CREATE INDEX IF NOT EXISTS idx_product_interactions_user_id ON product_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_product_interactions_session_id ON product_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_product_interactions_product_id ON product_interactions(shopify_product_id);
CREATE INDEX IF NOT EXISTS idx_product_interactions_type ON product_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_product_interactions_created_at ON product_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_interactions_user_type ON product_interactions(user_id, interaction_type);

-- RLS Policies for product_interactions
ALTER TABLE product_interactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own interactions
CREATE POLICY "Users can view own interactions" ON product_interactions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Anyone can insert interactions (for anonymous tracking)
CREATE POLICY "Anyone can create interactions" ON product_interactions
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 4. DESIGN_TEMPLATES - Pre-made designs users can customize
-- ============================================================================
CREATE TABLE IF NOT EXISTS design_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'Halloween', 'Sports', 'Abstract', 'Quotes', 'Animals', etc.
  subcategory TEXT,
  design_data JSONB NOT NULL,
  preview_url TEXT,
  thumbnail_url TEXT,
  base_color TEXT DEFAULT '#ffffff',
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  difficulty_level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- NULL for admin-created
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'))
);

-- Indexes for design_templates
CREATE INDEX IF NOT EXISTS idx_design_templates_category ON design_templates(category);
CREATE INDEX IF NOT EXISTS idx_design_templates_is_active ON design_templates(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_design_templates_is_premium ON design_templates(is_premium);
CREATE INDEX IF NOT EXISTS idx_design_templates_usage_count ON design_templates(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_design_templates_tags ON design_templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_design_templates_created_at ON design_templates(created_at DESC);

-- RLS Policies for design_templates
ALTER TABLE design_templates ENABLE ROW LEVEL SECURITY;

-- Everyone can view active templates
CREATE POLICY "Anyone can view active templates" ON design_templates
  FOR SELECT USING (is_active = true);

-- Only authenticated users can create templates (if you want user-submitted templates)
CREATE POLICY "Authenticated users can create templates" ON design_templates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own templates
CREATE POLICY "Users can update own templates" ON design_templates
  FOR UPDATE USING (auth.uid() = created_by);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_design_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER design_templates_updated_at
  BEFORE UPDATE ON design_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_design_templates_updated_at();

-- ============================================================================
-- 5. DESIGN_GALLERY - Public gallery of user designs with social features
-- ============================================================================
CREATE TABLE IF NOT EXISTS design_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  custom_design_id UUID REFERENCES custom_designs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  copies_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  featured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_design_gallery UNIQUE(custom_design_id)
);

-- Indexes for design_gallery
CREATE INDEX IF NOT EXISTS idx_design_gallery_user_id ON design_gallery(user_id);
CREATE INDEX IF NOT EXISTS idx_design_gallery_design_id ON design_gallery(custom_design_id);
CREATE INDEX IF NOT EXISTS idx_design_gallery_likes ON design_gallery(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_design_gallery_views ON design_gallery(views_count DESC);
CREATE INDEX IF NOT EXISTS idx_design_gallery_featured ON design_gallery(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_design_gallery_created_at ON design_gallery(created_at DESC);

-- RLS Policies for design_gallery
ALTER TABLE design_gallery ENABLE ROW LEVEL SECURITY;

-- Everyone can view gallery items
CREATE POLICY "Anyone can view gallery" ON design_gallery
  FOR SELECT USING (true);

-- Users can add their public designs to gallery
CREATE POLICY "Users can add to gallery" ON design_gallery
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own gallery items
CREATE POLICY "Users can update own gallery items" ON design_gallery
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own gallery items
CREATE POLICY "Users can delete own gallery items" ON design_gallery
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- BONUS: DESIGN_LIKES - Track who likes which designs
-- ============================================================================
CREATE TABLE IF NOT EXISTS design_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES custom_designs(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES design_gallery(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_design_like UNIQUE(design_id, user_id)
);

-- Indexes for design_likes
CREATE INDEX IF NOT EXISTS idx_design_likes_design_id ON design_likes(design_id);
CREATE INDEX IF NOT EXISTS idx_design_likes_gallery_id ON design_likes(gallery_id);
CREATE INDEX IF NOT EXISTS idx_design_likes_user_id ON design_likes(user_id);

-- RLS Policies for design_likes
ALTER TABLE design_likes ENABLE ROW LEVEL SECURITY;

-- Users can view all likes
CREATE POLICY "Anyone can view likes" ON design_likes
  FOR SELECT USING (true);

-- Users can like designs
CREATE POLICY "Users can like designs" ON design_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can unlike designs
CREATE POLICY "Users can unlike designs" ON design_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger to increment likes_count in design_gallery
CREATE OR REPLACE FUNCTION increment_gallery_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE design_gallery 
  SET likes_count = likes_count + 1 
  WHERE id = NEW.gallery_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER design_likes_increment
  AFTER INSERT ON design_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_gallery_likes();

-- Trigger to decrement likes_count in design_gallery
CREATE OR REPLACE FUNCTION decrement_gallery_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE design_gallery 
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = OLD.gallery_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER design_likes_decrement
  AFTER DELETE ON design_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_gallery_likes();

-- ============================================================================
-- HELPER VIEWS - Useful queries pre-built
-- ============================================================================

-- View: Popular designs in gallery
-- Note: Adjust column names based on your user_profiles table structure
CREATE OR REPLACE VIEW popular_gallery_designs AS
SELECT 
  dg.*,
  cd.design_name,
  cd.preview_image_url,
  cd.tags,
  up.email as creator_email,
  up.id as creator_id
FROM design_gallery dg
JOIN custom_designs cd ON dg.custom_design_id = cd.id
LEFT JOIN user_profiles up ON dg.user_id = up.id
ORDER BY dg.likes_count DESC, dg.views_count DESC;

-- View: User design stats
CREATE OR REPLACE VIEW user_design_stats AS
SELECT 
  user_id,
  COUNT(*) as total_designs,
  SUM(views_count) as total_views,
  SUM(copies_count) as total_copies,
  COUNT(*) FILTER (WHERE is_public = true) as public_designs,
  MAX(created_at) as last_design_created
FROM custom_designs
GROUP BY user_id;

-- View: Product interaction funnel
CREATE OR REPLACE VIEW product_funnel AS
SELECT 
  shopify_product_id,
  product_title,
  COUNT(*) FILTER (WHERE interaction_type = 'view') as views,
  COUNT(*) FILTER (WHERE interaction_type = 'quick_view') as quick_views,
  COUNT(*) FILTER (WHERE interaction_type = 'add_to_cart') as adds_to_cart,
  COUNT(*) FILTER (WHERE interaction_type = 'wishlist') as wishlist_adds,
  COUNT(*) FILTER (WHERE interaction_type = 'purchase') as purchases,
  ROUND(
    COUNT(*) FILTER (WHERE interaction_type = 'purchase')::DECIMAL / 
    NULLIF(COUNT(*) FILTER (WHERE interaction_type = 'view'), 0) * 100, 
    2
  ) as conversion_rate
FROM product_interactions
GROUP BY shopify_product_id, product_title
ORDER BY views DESC;

-- ============================================================================
-- SUCCESS! 🎉
-- ============================================================================
-- All tables created with:
-- ✅ Proper relationships and foreign keys
-- ✅ Row Level Security (RLS) policies
-- ✅ Optimized indexes for performance
-- ✅ Auto-updating timestamps
-- ✅ Data validation constraints
-- ✅ Helpful views for analytics
--
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Verify all tables are created successfully
-- 3. Test RLS policies work correctly
-- 4. Start building the frontend integration!
-- ============================================================================

