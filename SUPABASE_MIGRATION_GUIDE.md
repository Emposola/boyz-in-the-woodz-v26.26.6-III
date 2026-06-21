# Supabase Migration Guide - BOYZ IN THE WOODZ

## Overview
This guide walks through the complete migration from Base44 to Supabase for the BOYZ IN THE WOODZ application.

## Prerequisites
- Supabase Account created at https://supabase.com
- Supabase Project initialized
- Project URL: `https://pgwcfazhwuzxcqbqbjat.supabase.co`
- Publishable Key: `sb_publishable_mAxPnJ72mvOq2csXs0Q_UA_qGjxjNPI`
- Node.js and npm installed

## Migration Steps

### 1. Database Schema Setup

**Step 1.1: Run SQL Migrations**
- Open your Supabase dashboard
- Navigate to the SQL Editor
- Copy the entire contents of `supabase_schema.sql`
- Execute in the SQL editor
- Verify all tables are created successfully

Tables created:
- `auth.users` (Supabase built-in)
- `profiles` - User profile information
- `products` - Product catalog
- `barbers` - Barber information
- `appointments` - Booking appointments
- `locations` - Business locations
- `blog_posts` - Blog content & journal posts
- `events` - Events & retreats
- `orders` - Customer orders
- `loyalty_transactions` - Points tracking
- `retreat_applications` - Retreat registrations
- `barber_reviews` - Review system
- `studio_sessions` - Live sessions
- `waitlist_queue` - Walk-in queue system
- `app_settings` - Application configuration

**Step 1.2: Enable Authentication**
- Go to Authentication > Providers
- Enable Email provider (should be enabled by default)
- Configure password reset URL and redirect URLs
- Set Auth Redirect URLs to your application URLs (e.g., `http://localhost:5173/login`, `https://your-domain.com/login`)

### 2. Environment Variables

Create or update `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://pgwcfazhwuzxcqbqbjat.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_mAxPnJ72mvOq2csXs0Q_UA_qGjxjNPI
```

### 3. Update Application Code

✅ **Already Completed:**
- Supabase client configured in `src/lib/supabase.js`
- AuthContext updated for Supabase authentication
- base44Client.js replaced with Supabase-compatible API client

**What Changed:**
- All `base44.entities.*` calls now use Supabase tables
- Filter syntax: `base44.entities.Product.filter({ active: true }, '-created_date', 10)`
- Create: `base44.entities.Product.create({ name: 'Product', price: 99 })`
- Update: `base44.entities.Product.update(id, { price: 89 })`
- Delete: `base44.entities.Product.delete(id)`
- Subscribe to real-time changes: `base44.entities.Product.subscribe(callback)`

### 4. Data Migration (If Migrating from Existing Base44)

**Step 4.1: Export Data from Base44**

Update `scripts/migrate-from-base44.js` with your Base44 API credentials and run:

```bash
node scripts/migrate-from-base44.js
```

**Step 4.2: Manual Data Entry**

If you need to manually enter data:

1. Use Supabase Table Editor:
   - Go to Supabase Dashboard > Data Editor
   - Select each table
   - Add rows manually or import CSV

2. Use the Application UI:
   - Create products via Admin panel
   - Add barbers and appointments
   - Post blog content
   - Register events

### 5. Update Dependencies

**Step 5.1: Remove Base44 Dependencies**

```bash
npm uninstall @base44/sdk @base44/vite-plugin
```

**Step 5.2: Install Supabase (if not already installed)**

```bash
npm install @supabase/supabase-js
```

**Step 5.3: Install/Update Dependencies**

```bash
npm install
```

### 6. Authentication Flow

The authentication flow has been updated:

```javascript
// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'newuser@example.com',
  password: 'password',
  options: { data: { display_name: 'John' } }
});

// Get Current User
const { data: { user } } = await supabase.auth.getUser();

// Logout
await supabase.auth.signOut();
```

### 7. API Usage Examples

**Query/Filter**
```javascript
// Get all active products
const products = await base44.entities.Product.filter({ active: true });

// Get with sorting
const products = await base44.entities.Product.filter(
  { category: 'shirts' },
  '-created_date', // descending
  20 // limit
);

// Get specific product
const product = await base44.entities.Product.get(productId);
```

**Create**
```javascript
const newProduct = await base44.entities.Product.create({
  name: 'New Product',
  price: 49.99,
  description: 'Product description',
  active: true
});
```

**Update**
```javascript
const updated = await base44.entities.Product.update(productId, {
  price: 39.99,
  featured: true
});
```

**Delete**
```javascript
const success = await base44.entities.Product.delete(productId);
```

**Real-time Subscriptions**
```javascript
const unsubscribe = base44.entities.Product.subscribe((payload) => {
  console.log('Product changed:', payload);
  // Handle: INSERT, UPDATE, or DELETE
});

// Cleanup when component unmounts
unsubscribe();
```

### 8. Storage (Optional)

For image uploads to Supabase Storage:

```javascript
// Upload image
const { data, error } = await supabase.storage
  .from('images')
  .upload(`products/${filename}`, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('images')
  .getPublicUrl(`products/${filename}`);
```

### 9. Testing

**Step 9.1: Local Development**

```bash
npm run dev
```

**Step 9.2: Test Authentication**
- Try signing up with a new email
- Sign in with credentials
- Verify user profile is created
- Test logout

**Step 9.3: Test Data Operations**
- Create a product
- Edit a product
- Delete a product
- View orders and transactions
- Book an appointment

**Step 9.4: Test Real-time Features**
- Open app in two browser windows
- Create/edit data in one window
- Verify changes appear in other window

### 10. Building for Production

```bash
npm run build
```

**Step 10.1: Production URL Configuration**

Update authentication redirect URLs in Supabase:
- Go to Authentication > URL Configuration
- Add your production domain URLs

**Step 10.2: Security**
- Never commit `.env.local` to git
- Use environment variables in deployment platform
- Review Row Level Security (RLS) policies
- Set up database backups

### 11. Troubleshooting

**Issue: "Cannot find Supabase table"**
- Solution: Ensure all tables exist in Supabase
- Check table names match exactly (case-sensitive)
- Verify RLS policies allow operations

**Issue: "Authentication fails"**
- Solution: Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Verify redirect URLs in Supabase auth settings
- Clear browser cache/cookies

**Issue: "Data not appearing after creation"**
- Solution: Check RLS policies allow SELECT operations
- Verify user is authenticated
- Check browser console for errors

**Issue: "Real-time updates not working"**
- Solution: Ensure WebSocket is not blocked
- Check browser network tab for subscribe connection
- Verify Supabase real-time is enabled

### 12. Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint
npm run lint:fix

# Type check
npm run typecheck

# Preview production build
npm run preview
```

## File Changes Summary

### Created
- `supabase_schema.sql` - Database schema

### Modified
- `src/api/base44Client.js` - Complete rewrite with Supabase
- `package.json` - Removed base44 dependencies
- `vite.config.js` - Removed base44 plugin

### Already Updated
- `src/lib/supabase.js` - Supabase client
- `src/lib/AuthContext.jsx` - Supabase auth
- All page components - Compatible with new API

## Support & Resources

- Supabase Docs: https://supabase.com/docs
- Supabase GitHub: https://github.com/supabase/supabase
- Supabase Community: https://supabase.com/community

## Migration Complete! ✨

Your application is now fully migrated from Base44 to Supabase. All functionality is preserved while leveraging Supabase's powerful backend infrastructure.
