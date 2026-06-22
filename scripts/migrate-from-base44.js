// scripts/migrate-from-base44.js
// Complete Data Migration Script from Base44 to Supabase
// Usage: node scripts/migrate-from-base44.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pgwcfazhwuzxcqbqbjat.supabase.co',
  'sb_publishable_mAxPnJ72mvOq2csXs0Q_UA_qGjxjNPI'
);

// ⚠️ UPDATE THESE WITH YOUR BASE44 API DETAILS
const BASE44_API_URL = process.env.BASE44_API_URL || 'https://your-app.base44.app';
const BASE44_API_KEY = process.env.BASE44_API_KEY || 'your-api-key';

// Helper function to make API calls to Base44
async function base44ApiCall(endpoint) {
  try {
    const response = await fetch(`${BASE44_API_URL}/api${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${BASE44_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Base44 API error for ${endpoint}:`, error.message);
    return null;
  }
}

// Migration functions for each entity
async function migrateProducts() {
  console.log('🏪 Migrating Products...');
  try {
    const data = await base44ApiCall('/entities/Product');
    if (!data || !Array.isArray(data)) {
      console.warn('No products to migrate or invalid response');
      return;
    }

    for (const product of data) {
      const { error } = await supabase.from('products').insert({
        id: product.id,
        name: product.name,
        business: product.business,
        category: product.category,
        price: product.price,
        compare_at_price: product.compare_at_price,
        description: product.description,
        image_url: product.image_url,
        images: product.images || [],
        sizes: product.sizes || [],
        inventory: product.inventory || 0,
        proof_badge_text: product.proof_badge_text,
        featured: product.featured || false,
        active: product.active !== false,
        created_date: product.created_date || new Date()
      });
      if (error) console.error('Product insert error:', error);
    }
    console.log(`✅ Migrated ${data.length} products`);
  } catch (error) {
    console.error('❌ Products migration failed:', error);
  }
}

async function migrateBarbers() {
  console.log('💈 Migrating Barbers...');
  try {
    const data = await base44ApiCall('/entities/Barber');
    if (!data || !Array.isArray(data)) {
      console.warn('No barbers to migrate or invalid response');
      return;
    }

    for (const barber of data) {
      const { error } = await supabase.from('barbers').insert({
        id: barber.id,
        name: barber.name,
        email: barber.email,
        phone: barber.phone,
        image_url: barber.image_url,
        bio: barber.bio,
        specialties: barber.specialties || [],
        active: barber.active !== false,
        location_id: barber.location_id,
        created_date: barber.created_date || new Date()
      });
      if (error) console.error('Barber insert error:', error);
    }
    console.log(`✅ Migrated ${data.length} barbers`);
  } catch (error) {
    console.error('❌ Barbers migration failed:', error);
  }
}

async function migrateLocations() {
  console.log('📍 Migrating Locations...');
  try {
    const data = await base44ApiCall('/entities/Location');
    if (!data || !Array.isArray(data)) {
      console.warn('No locations to migrate or invalid response');
      return;
    }

    for (const location of data) {
      const { error } = await supabase.from('locations').insert({
        id: location.id,
        name: location.name,
        address: location.address,
        city: location.city,
        state: location.state,
        zip_code: location.zip_code,
        phone: location.phone,
        email: location.email,
        hours: location.hours || {},
        active: location.active !== false,
        latitude: location.latitude,
        longitude: location.longitude,
        created_date: location.created_date || new Date()
      });
      if (error) console.error('Location insert error:', error);
    }
    console.log(`✅ Migrated ${data.length} locations`);
  } catch (error) {
    console.error('❌ Locations migration failed:', error);
  }
}

async function migrateBlogPosts() {
  console.log('📝 Migrating Blog Posts...');
  try {
    const data = await base44ApiCall('/entities/BlogPost');
    if (!data || !Array.isArray(data)) {
      console.warn('No blog posts to migrate or invalid response');
      return;
    }

    for (const post of data) {
      const { error } = await supabase.from('blog_posts').insert({
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        author_id: post.author_id,
        image_url: post.image_url,
        excerpt: post.excerpt,
        status: post.status || 'draft',
        published: post.published || false,
        featured: post.featured || false,
        category: post.category,
        tags: post.tags || [],
        view_count: post.view_count || 0,
        created_date: post.created_date || new Date(),
        published_at: post.published_at
      });
      if (error) console.error('Blog post insert error:', error);
    }
    console.log(`✅ Migrated ${data.length} blog posts`);
  } catch (error) {
    console.error('❌ Blog posts migration failed:', error);
  }
}

async function migrateEvents() {
  console.log('🎉 Migrating Events...');
  try {
    const data = await base44ApiCall('/entities/Event');
    if (!data || !Array.isArray(data)) {
      console.warn('No events to migrate or invalid response');
      return;
    }

    for (const event of data) {
      const { error } = await supabase.from('events').insert({
        id: event.id,
        title: event.title,
        description: event.description,
        type: event.type,
        start_date: event.start_date,
        end_date: event.end_date,
        location_id: event.location_id,
        image_url: event.image_url,
        capacity: event.capacity,
        registered_count: event.registered_count || 0,
        active: event.active !== false,
        created_date: event.created_date || new Date()
      });
      if (error) console.error('Event insert error:', error);
    }
    console.log(`✅ Migrated ${data.length} events`);
  } catch (error) {
    console.error('❌ Events migration failed:', error);
  }
}

async function migrateAppSettings() {
  console.log('⚙️ Migrating App Settings...');
  try {
    const data = await base44ApiCall('/app-config');
    if (!data) {
      console.warn('No app settings to migrate');
      return;
    }

    const { error } = await supabase.from('app_settings').insert({
      app_name: data.app_name || 'BOYZ IN THE WOODZ',
      app_logo_url: data.app_logo_url,
      theme_color: data.theme_color,
      primary_contact_email: data.primary_contact_email,
      phone: data.phone
    });
    if (error && error.code !== '23505') console.error('App settings insert error:', error);
    console.log('✅ App settings migrated');
  } catch (error) {
    console.error('❌ App settings migration failed:', error);
  }
}

// Main migration function
async function runMigration() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Base44 to Supabase Data Migration Script                ║');
  console.log('║  BOYZ IN THE WOODZ v26.5.17                              ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  if (BASE44_API_URL === 'https://your-app.base44.app' || !BASE44_API_KEY) {
    console.error('❌ ERROR: Base44 API details not configured!');
    console.error('Please set the following environment variables:');
    console.error('  - BASE44_API_URL: Your Base44 app URL');
    console.error('  - BASE44_API_KEY: Your Base44 API key');
    console.error('');
    console.error('Or update them directly in this script.');
    process.exit(1);
  }

  console.log(`📡 Connecting to Base44: ${BASE44_API_URL}`);
  console.log(`🔗 Connecting to Supabase: https://pgwcfazhwuzxcqbqbjat.supabase.co`);
  console.log('');

  try {
    // Run migrations in order
    await migrateAppSettings();
    await migrateLocations();
    await migrateProducts();
    await migrateBarbers();
    await migrateBlogPosts();
    await migrateEvents();
    
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ Migration Complete!                                    ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Note: Users and transactions were not migrated for security.');
    console.log('Please manually add users via the authentication UI.');
  } catch (error) {
    console.error('');
    console.error('╔════════════════════════════════════════════════════════════╗');
    console.error('║  ❌ Migration Error!                                      ║');
    console.error('╚════════════════════════════════════════════════════════════╝');
    console.error('', error);
  }
}

// Run the migration
runMigration();