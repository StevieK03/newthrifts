# 🚀 Supabase Integration for Shopify Theme

This guide will help you set up Supabase with your Shopify theme to add powerful features like user authentication, wishlists, analytics, and real-time functionality.

## 📋 Prerequisites

- A Supabase account ([sign up here](https://supabase.com))
- Your Shopify theme files
- Basic knowledge of HTML, CSS, and JavaScript

## 🛠️ Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `newthrifts-shopify`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### Step 2: Configure Supabase Settings

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** and **anon public** key
3. Update the configuration in `assets/supabase-config.js`:

```javascript
// Replace these with your actual values
this.supabaseUrl = 'https://your-project-id.supabase.co';
this.supabaseKey = 'your-anon-key-here';
```

### Step 3: Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `assets/supabase-schema.sql`
3. Click **Run** to execute the schema

This will create:
- User profiles table
- Wishlist functionality
- Analytics events tracking
- Product reviews system
- Notifications system
- Cart session tracking

### Step 4: Configure Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure the following settings:

#### Site URL
```
https://your-shopify-store.myshopify.com
```

#### Redirect URLs
```
https://your-shopify-store.myshopify.com/*
https://your-shopify-store.myshopify.com/account
https://your-shopify-store.myshopify.com/cart
```

#### Email Templates (Optional)
Customize the email templates for:
- Confirm signup
- Reset password
- Magic link

### Step 5: Enable Row Level Security (RLS)

The database schema includes RLS policies, but you should verify they're enabled:

1. Go to **Authentication** → **Policies**
2. Ensure all tables have RLS enabled
3. Review the policies to match your requirements

### Step 6: Add Sections to Your Theme

Add these sections to your Shopify theme:

#### Authentication Section
```liquid
{% section 'supabase-auth' %}
```

#### Wishlist Section
```liquid
{% section 'supabase-wishlist' %}
```

### Step 7: Configure Environment Variables

Create a `.env` file in your project root (for development):

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**Note**: For production, update the values directly in `assets/supabase-config.js`

## 🎯 Features Included

### 🔐 User Authentication
- **Sign Up/Sign In**: Email and password authentication
- **User Profiles**: Extended user data storage
- **Session Management**: Automatic session handling
- **Password Reset**: Built-in password recovery

### ❤️ Wishlist System
- **Save Products**: Add items to personal wishlist
- **Remove Items**: Easy removal from wishlist
- **Product Details**: Store product information
- **User-Specific**: Each user has their own wishlist

### 📊 Analytics & Tracking
- **Event Tracking**: Track user interactions
- **Page Views**: Monitor page visits
- **User Behavior**: Understand customer journey
- **Custom Events**: Track specific actions

### 🔔 Notifications
- **Real-time Updates**: Instant notifications
- **User-Specific**: Personalized notifications
- **Multiple Types**: Various notification categories
- **Read Status**: Track notification status

### 🛒 Cart Enhancement
- **Abandoned Cart**: Track incomplete purchases
- **Cart Recovery**: Email reminders
- **Session Storage**: Persistent cart data
- **Analytics**: Cart abandonment insights

## 🚀 Usage Examples

### Adding to Wishlist
```javascript
// Add product to wishlist
const { data, error } = await window.supabaseClient.insert('wishlist', {
  shopify_product_id: '123456789',
  product_title: 'Amazing T-Shirt',
  product_price: 29.99,
  product_image_url: 'https://example.com/image.jpg'
});
```

### Tracking Analytics
```javascript
// Track user interaction
await window.supabaseClient.trackEvent('product_viewed', {
  product_id: '123456789',
  product_title: 'Amazing T-Shirt',
  category: 'clothing'
});
```

### User Authentication
```javascript
// Sign up new user
const { data, error } = await window.supabaseClient.signUp(
  'user@example.com',
  'password123',
  { full_name: 'John Doe' }
);

// Sign in existing user
const { data, error } = await window.supabaseClient.signIn(
  'user@example.com',
  'password123'
);
```

## 🔧 Customization

### Styling
All components include comprehensive CSS with:
- **Dark Mode Support**: Automatic theme switching
- **Responsive Design**: Mobile-first approach
- **Custom Animations**: Smooth transitions
- **Brand Colors**: Easy color customization

### Functionality
- **Modular Design**: Use only what you need
- **Event System**: Custom event handling
- **Error Handling**: Graceful error management
- **Loading States**: User feedback during operations

## 🛡️ Security Considerations

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Admin functions are properly secured

### API Keys
- Use environment variables for sensitive data
- Never commit API keys to version control
- Rotate keys regularly

### Data Validation
- Client-side validation for UX
- Server-side validation for security
- Input sanitization and validation

## 📱 Mobile Support

All components are fully responsive and include:
- **Touch Gestures**: Mobile-optimized interactions
- **Responsive Layout**: Adapts to all screen sizes
- **Performance**: Optimized for mobile devices
- **Accessibility**: Screen reader support

## 🔍 Troubleshooting

### Common Issues

#### "Supabase client not initialized"
- Ensure `supabase-config.js` is loaded
- Check your Supabase URL and key
- Verify network connectivity

#### "Authentication failed"
- Check your Supabase project settings
- Verify redirect URLs are configured
- Ensure RLS policies are correct

#### "Database connection error"
- Verify your database is running
- Check your connection string
- Ensure proper permissions

### Debug Mode
Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('supabase-debug', 'true');
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Shopify Theme Development](https://shopify.dev/themes)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🤝 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Check your browser console for errors
4. Verify your configuration settings

## 🎉 Next Steps

After setup, consider adding:
- **Product Reviews**: Customer feedback system
- **Recommendations**: AI-powered suggestions
- **Live Chat**: Real-time customer support
- **Advanced Analytics**: Detailed reporting
- **A/B Testing**: Feature experimentation

---

**Happy coding! 🚀**


