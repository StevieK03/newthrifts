-- Supabase Database Schema for Shopify Integration
-- Run these SQL commands in your Supabase SQL Editor

-- Create analytics_events table for tracking user behavior
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  properties JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shopify_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page_url TEXT,
  user_agent TEXT
);

-- Create user_profiles table for extended user data
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  shopify_customer_id VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shopify_product_id VARCHAR(255) NOT NULL,
  product_title VARCHAR(500),
  product_image_url TEXT,
  product_price DECIMAL(10,2),
  product_variant_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shopify_product_id VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_sessions table for abandoned cart recovery
CREATE TABLE IF NOT EXISTS cart_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  shopify_customer_id VARCHAR(255),
  session_id VARCHAR(255),
  cart_data JSONB DEFAULT '{}',
  total_value DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_shopify_customer_id ON user_profiles(shopify_customer_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_shopify_product_id ON wishlist(shopify_product_id);

CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_shopify_product_id ON product_reviews(shopify_product_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_cart_sessions_user_id ON cart_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_sessions_session_id ON cart_sessions(session_id);

-- Row Level Security Policies

-- Analytics Events: Users can only see their own events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Profiles: Users can only manage their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Wishlist: Users can only manage their own wishlist
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist items" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist items" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- Product Reviews: Users can manage their own reviews
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON product_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications: Users can only see their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Cart Sessions: Users can manage their own cart sessions
ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own cart sessions" ON cart_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart sessions" ON cart_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart sessions" ON cart_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for common operations

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, created_at)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to track analytics events
CREATE OR REPLACE FUNCTION public.track_event(
  event_name TEXT,
  properties JSONB DEFAULT '{}',
  shopify_customer_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.analytics_events (
    event_name,
    properties,
    user_id,
    shopify_customer_id,
    page_url,
    user_agent
  ) VALUES (
    event_name,
    properties,
    auth.uid(),
    shopify_customer_id,
    current_setting('request.headers', true)::json->>'referer',
    current_setting('request.headers', true)::json->>'user-agent'
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's wishlist
CREATE OR REPLACE FUNCTION public.get_user_wishlist()
RETURNS TABLE (
  id UUID,
  shopify_product_id VARCHAR(255),
  product_title VARCHAR(500),
  product_image_url TEXT,
  product_price DECIMAL(10,2),
  product_variant_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.shopify_product_id,
    w.product_title,
    w.product_image_url,
    w.product_price,
    w.product_variant_id,
    w.created_at
  FROM public.wishlist w
  WHERE w.user_id = auth.uid()
  ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add item to wishlist
CREATE OR REPLACE FUNCTION public.add_to_wishlist(
  p_shopify_product_id TEXT,
  p_product_title TEXT DEFAULT NULL,
  p_product_image_url TEXT DEFAULT NULL,
  p_product_price DECIMAL DEFAULT NULL,
  p_product_variant_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  wishlist_id UUID;
BEGIN
  -- Check if item already exists
  SELECT id INTO wishlist_id
  FROM public.wishlist
  WHERE user_id = auth.uid() 
    AND shopify_product_id = p_shopify_product_id
    AND (p_product_variant_id IS NULL OR product_variant_id = p_product_variant_id);
  
  IF wishlist_id IS NOT NULL THEN
    RETURN wishlist_id;
  END IF;
  
  -- Insert new item
  INSERT INTO public.wishlist (
    user_id,
    shopify_product_id,
    product_title,
    product_image_url,
    product_price,
    product_variant_id
  ) VALUES (
    auth.uid(),
    p_shopify_product_id,
    p_product_title,
    p_product_image_url,
    p_product_price,
    p_product_variant_id
  ) RETURNING id INTO wishlist_id;
  
  RETURN wishlist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove item from wishlist
CREATE OR REPLACE FUNCTION public.remove_from_wishlist(p_wishlist_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM public.wishlist
  WHERE id = p_wishlist_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

