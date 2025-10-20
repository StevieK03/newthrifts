-- ============================================================================
-- SIZE CHART SYSTEM FOR CUSTOM T-SHIRTS
-- ============================================================================
-- Stores size measurements and helps users choose the right size
-- ============================================================================

-- ============================================================================
-- 1. SIZE_CHARTS - Master size chart with measurements
-- ============================================================================
CREATE TABLE IF NOT EXISTS size_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type TEXT NOT NULL, -- 't-shirt', 'hoodie', 'tank-top'
  color TEXT NOT NULL, -- 'black', 'white', 'all'
  size_code TEXT NOT NULL, -- 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'
  
  -- Measurements in centimeters
  garment_length DECIMAL(5,2) NOT NULL, -- 衣长
  bust_width DECIMAL(5,2) NOT NULL, -- 胸宽
  shoulder_width DECIMAL(5,2) NOT NULL, -- 肩宽
  sleeve_length DECIMAL(5,2) NOT NULL, -- 袖长
  
  -- Additional info
  measurement_unit TEXT DEFAULT 'cm',
  margin_of_error DECIMAL(3,1) DEFAULT 1.5, -- ±1-3cm error
  notes TEXT,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_size_variant UNIQUE(product_type, color, size_code)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_size_charts_product_type ON size_charts(product_type);
CREATE INDEX IF NOT EXISTS idx_size_charts_color ON size_charts(color);
CREATE INDEX IF NOT EXISTS idx_size_charts_size_code ON size_charts(size_code);
CREATE INDEX IF NOT EXISTS idx_size_charts_active ON size_charts(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE size_charts ENABLE ROW LEVEL SECURITY;

-- Everyone can read size charts
CREATE POLICY "Anyone can view size charts" ON size_charts
  FOR SELECT USING (is_active = true);

-- Only admins can modify (you can adjust this later)
CREATE POLICY "Admins can manage size charts" ON size_charts
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_size_charts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER size_charts_updated_at
  BEFORE UPDATE ON size_charts
  FOR EACH ROW
  EXECUTE FUNCTION update_size_charts_updated_at();

-- ============================================================================
-- 2. INSERT YOUR SIZE DATA - Black & White T-Shirts
-- ============================================================================

-- Insert size data for BLACK and WHITE t-shirts
INSERT INTO size_charts (product_type, color, size_code, garment_length, bust_width, shoulder_width, sleeve_length, notes) VALUES
-- Black & White T-Shirts - Same measurements
('t-shirt', 'black', 'XXS', 52, 46, 42, 19, 'Extra Extra Small - Black'),
('t-shirt', 'black', 'XS', 54, 48, 43.5, 19, 'Extra Small - Black'),
('t-shirt', 'black', 'S', 56, 50, 45, 20, 'Small - Black'),
('t-shirt', 'black', 'M', 78, 52, 46.5, 20, 'Medium - Black'),
('t-shirt', 'black', 'L', 60, 54, 48, 21, 'Large - Black'),
('t-shirt', 'black', 'XL', 62, 56, 49.5, 21, 'Extra Large - Black'),
('t-shirt', 'black', 'XXL', 64, 58, 51, 22, 'Extra Extra Large - Black'),

('t-shirt', 'white', 'XXS', 52, 46, 42, 19, 'Extra Extra Small - White'),
('t-shirt', 'white', 'XS', 54, 48, 43.5, 19, 'Extra Small - White'),
('t-shirt', 'white', 'S', 56, 50, 45, 20, 'Small - White'),
('t-shirt', 'white', 'M', 78, 52, 46.5, 20, 'Medium - White'),
('t-shirt', 'white', 'L', 60, 54, 48, 21, 'Large - White'),
('t-shirt', 'white', 'XL', 62, 56, 49.5, 21, 'Extra Large - White'),
('t-shirt', 'white', 'XXL', 64, 58, 51, 22, 'Extra Extra Large - White')

ON CONFLICT (product_type, color, size_code) 
DO UPDATE SET
  garment_length = EXCLUDED.garment_length,
  bust_width = EXCLUDED.bust_width,
  shoulder_width = EXCLUDED.shoulder_width,
  sleeve_length = EXCLUDED.sleeve_length,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- ============================================================================
-- 3. SIZE_RECOMMENDATIONS - AI-powered size suggestions
-- ============================================================================
CREATE TABLE IF NOT EXISTS size_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  size_code TEXT NOT NULL,
  
  -- User body measurements (optional - for personalized recommendations)
  height_cm_min INTEGER,
  height_cm_max INTEGER,
  weight_kg_min INTEGER,
  weight_kg_max INTEGER,
  
  -- Fit preference
  fit_type TEXT, -- 'tight', 'regular', 'loose', 'oversized'
  
  -- Recommendation data
  confidence_score DECIMAL(3,2) DEFAULT 0.8, -- 0.0 to 1.0
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert basic size recommendations
INSERT INTO size_recommendations (size_code, height_cm_min, height_cm_max, weight_kg_min, weight_kg_max, fit_type, description) VALUES
('XXS', 145, 155, 35, 45, 'regular', 'Best for petite frames, regular fit'),
('XS', 155, 165, 45, 55, 'regular', 'Best for smaller frames, regular fit'),
('S', 160, 170, 50, 65, 'regular', 'Best for small to medium frames, regular fit'),
('M', 165, 178, 60, 75, 'regular', 'Best for medium frames, regular fit'),
('L', 170, 183, 70, 85, 'regular', 'Best for larger frames, regular fit'),
('XL', 175, 188, 80, 95, 'regular', 'Best for extra large frames, regular fit'),
('XXL', 180, 195, 90, 110, 'regular', 'Best for extra extra large frames, regular fit');

-- Enable RLS
ALTER TABLE size_recommendations ENABLE ROW LEVEL SECURITY;

-- Everyone can read recommendations
CREATE POLICY "Anyone can view size recommendations" ON size_recommendations
  FOR SELECT USING (true);

-- ============================================================================
-- 4. HELPER VIEWS
-- ============================================================================

-- View: Complete size chart with recommendations
CREATE OR REPLACE VIEW complete_size_guide AS
SELECT 
  sc.*,
  sr.height_cm_min,
  sr.height_cm_max,
  sr.weight_kg_min,
  sr.weight_kg_max,
  sr.fit_type,
  sr.description as recommendation
FROM size_charts sc
LEFT JOIN size_recommendations sr ON sc.size_code = sr.size_code
WHERE sc.is_active = true
ORDER BY 
  sc.product_type,
  sc.color,
  CASE sc.size_code
    WHEN 'XXS' THEN 1
    WHEN 'XS' THEN 2
    WHEN 'S' THEN 3
    WHEN 'M' THEN 4
    WHEN 'L' THEN 5
    WHEN 'XL' THEN 6
    WHEN 'XXL' THEN 7
    ELSE 8
  END;

-- View: Size comparison (helps users see differences between sizes)
CREATE OR REPLACE VIEW size_comparison AS
SELECT 
  size_code,
  AVG(garment_length) as avg_length,
  AVG(bust_width) as avg_bust,
  AVG(shoulder_width) as avg_shoulder,
  AVG(sleeve_length) as avg_sleeve
FROM size_charts
WHERE is_active = true
GROUP BY size_code
ORDER BY 
  CASE size_code
    WHEN 'XXS' THEN 1
    WHEN 'XS' THEN 2
    WHEN 'S' THEN 3
    WHEN 'M' THEN 4
    WHEN 'L' THEN 5
    WHEN 'XL' THEN 6
    WHEN 'XXL' THEN 7
    ELSE 8
  END;

-- ============================================================================
-- 5. FUNCTIONS - Size Recommendation Logic
-- ============================================================================

-- Function: Get recommended size based on measurements
CREATE OR REPLACE FUNCTION get_recommended_size(
  user_height INTEGER,
  user_weight INTEGER,
  preferred_fit TEXT DEFAULT 'regular'
)
RETURNS TABLE (
  size_code TEXT,
  confidence DECIMAL,
  reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sr.size_code,
    sr.confidence_score,
    sr.description
  FROM size_recommendations sr
  WHERE 
    user_height BETWEEN sr.height_cm_min AND sr.height_cm_max
    AND user_weight BETWEEN sr.weight_kg_min AND sr.weight_kg_max
    AND sr.fit_type = preferred_fit
  ORDER BY sr.confidence_score DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function: Get size chart for specific product and color
CREATE OR REPLACE FUNCTION get_size_chart(
  p_product_type TEXT DEFAULT 't-shirt',
  p_color TEXT DEFAULT 'black'
)
RETURNS TABLE (
  size TEXT,
  length DECIMAL,
  bust DECIMAL,
  shoulder DECIMAL,
  sleeve DECIMAL,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    size_code,
    garment_length,
    bust_width,
    shoulder_width,
    sleeve_length,
    sc.notes
  FROM size_charts sc
  WHERE 
    sc.product_type = p_product_type
    AND sc.color = p_color
    AND sc.is_active = true
  ORDER BY 
    CASE sc.size_code
      WHEN 'XXS' THEN 1
      WHEN 'XS' THEN 2
      WHEN 'S' THEN 3
      WHEN 'M' THEN 4
      WHEN 'L' THEN 5
      WHEN 'XL' THEN 6
      WHEN 'XXL' THEN 7
      ELSE 8
    END;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SUCCESS! 🎉
-- ============================================================================
-- Size chart system created with:
-- ✅ Complete measurements for black & white t-shirts
-- ✅ Size recommendation engine
-- ✅ Helper views for easy querying
-- ✅ Functions for size suggestions
--
-- Usage examples:
-- 1. Get size chart: SELECT * FROM get_size_chart('t-shirt', 'black');
-- 2. Get recommendation: SELECT * FROM get_recommended_size(175, 70, 'regular');
-- 3. View all sizes: SELECT * FROM complete_size_guide;
-- ============================================================================

