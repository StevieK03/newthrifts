/**
 * Supabase Configuration for Shopify Theme
 * Handles Supabase client initialization and common operations
 */

class SupabaseClient {
  constructor() {
    // Replace with your actual Supabase project URL and anon key
    this.supabaseUrl = 'https://hcoujifzjntwfdnxtnxx.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjb3VqaWZ6am50d2Zkbnh0bnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDQ3MDYsImV4cCI6MjA3NTUyMDcwNn0.UMV8SUQxL8tHXlORIh8H2dYfO2cm8K9o-lJXcaPyYZE';
    this.client = null;
    this.initialized = false;
  }

  /**
   * Initialize Supabase client
   */
  async init() {
    if (this.initialized) return this.client;
    
    try {
      // Load Supabase client from CDN
      if (typeof window !== 'undefined' && !window.supabase) {
        await this.loadSupabaseScript();
      }
      
      if (window.supabase) {
        this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        this.initialized = true;
        
        // IMPORTANT: Expose the client instance globally for other scripts
        window.supabase = this.client;
        
        console.log('✅ Supabase client initialized');
        return this.client;
      } else {
        throw new Error('Supabase library not loaded');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Supabase:', error);
      return null;
    }
  }

  /**
   * Load Supabase script from CDN
   */
  async loadSupabaseScript() {
    return new Promise((resolve, reject) => {
      if (window.supabase) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = () => {
        console.log('✅ Supabase script loaded');
        resolve();
      };
      script.onerror = () => {
        console.error('❌ Failed to load Supabase script');
        reject(new Error('Failed to load Supabase script'));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Get authenticated client
   */
  async getClient() {
    if (!this.initialized) {
      await this.init();
    }
    return this.client;
  }

  /**
   * User Authentication Methods
   */
  async signUp(email, password, metadata = {}) {
    const client = await this.getClient();
    if (!client) return { error: 'Client not initialized' };

    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            shopify_customer_id: this.getShopifyCustomerId(),
            created_at: new Date().toISOString()
          }
        }
      });
      return { data, error };
    } catch (error) {
      return { error: error.message };
    }
  }

  async signIn(email, password) {
    const client = await this.getClient();
    if (!client) return { error: 'Client not initialized' };

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      return { error: error.message };
    }
  }

  async signOut() {
    const client = await this.getClient();
    if (!client) return { error: 'Client not initialized' };

    try {
      const { error } = await client.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error.message };
    }
  }

  async getCurrentUser() {
    const client = await this.getClient();
    if (!client) return { error: 'Client not initialized' };

    try {
      const { data: { user }, error } = await client.auth.getUser();
      return { user, error };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Database Operations
   */
  async insert(table, data) {
    const client = await this.getClient();
    if (!client) return { error: 'Client not initialized' };

    try {
      const { data: result, error } = await client
        .from(table)
        .insert(data)
        .select();
      return { data: result, error };
    } catch (error) {
      return { error: error.message };
    }
  }

  async select(table, options = {}) {
    const client = await this.getClient();
    if (!client) return { error: 'Client not initialized' };

    try {
      let query = client.from(table).select(options.columns || '*');
      
      if (options.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending });
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      return { error: error.message };
    }
  }

  async update(table, data, where) {
    const client = await this.getClient();
    if (!client) return { error: 'Client not initialized' };

    try {
      let query = client.from(table).update(data);
      
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data: result, error } = await query.select();
      return { data: result, error };
    } catch (error) {
      return { error: error.message };
    }
  }

  async delete(table, where) {
    const client = await this.getClient();
    if (!client) return { error: 'Client not initialized' };

    try {
      let query = client.from(table).delete();
      
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Real-time subscriptions
   */
  async subscribe(table, callback, filter = {}) {
    const client = await this.getClient();
    if (!client) return { error: 'Client not initialized' };

    try {
      let subscription = client
        .channel(`${table}_changes`)
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: table,
            filter: filter.filter || undefined
          }, 
          callback
        )
        .subscribe();

      return { subscription, error: null };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Utility Methods
   */
  getShopifyCustomerId() {
    // Try to get Shopify customer ID from various sources
    if (typeof window !== 'undefined') {
      // Check for Shopify customer object
      if (window.Shopify && window.Shopify.customer) {
        return window.Shopify.customer.id;
      }
      
      // Check for customer data in meta tags
      const customerMeta = document.querySelector('meta[name="shopify-customer-id"]');
      if (customerMeta) {
        return customerMeta.content;
      }
    }
    return null;
  }

  /**
   * Analytics and Tracking
   */
  async trackEvent(eventName, properties = {}) {
    const client = await this.getClient();
    if (!client) {
      console.error('📊 trackEvent: Client not initialized');
      return { error: 'Client not initialized' };
    }

    try {
      const { data, error } = await client
        .from('analytics_events')
        .insert({
          event_name: eventName,
          properties: properties,
          user_id: (await this.getCurrentUser()).user?.id,
          shopify_customer_id: this.getShopifyCustomerId(),
          created_at: new Date().toISOString(),
          page_url: window.location.href,
          user_agent: navigator.userAgent
        });
      
      if (error) {
        console.error('📊 trackEvent: Insert failed', {
          error,
          eventName,
          properties
        });
      }
      
      return { data, error };
    } catch (error) {
      console.error('📊 trackEvent: Exception', {
        error: error.message,
        stack: error.stack,
        eventName
      });
      return { error: error.message };
    }
  }
}

// Create global instance
window.SupabaseClient = SupabaseClient;
window.supabaseClient = new SupabaseClient();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.supabaseClient.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SupabaseClient;
}

