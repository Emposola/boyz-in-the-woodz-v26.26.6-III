// src/api/supabaseClient.js
// Supabase API Client - Complete migration from supabase
import { supabase } from '@/lib/supabase';

// Helper function to build filters and queries
const buildQuery = (tableName, filters, sort, limit) => {
  let query = supabase.from(tableName).select('*');

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        query = query.in(key, value);
      } else if (value !== null && value !== undefined) {
        query = query.eq(key, value);
      }
    });
  }

  if (sort) {
    const direction = sort.startsWith('-') ? 'desc' : 'asc';
    const field = sort.replace(/^-/, '');
    query = query.order(field, { ascending: direction === 'asc' });
  }

  if (limit) query = query.limit(limit);

  return query;
};

// Create a generic entity wrapper
const createEntity = (tableName) => ({
  filter: async (filters, sort, limit) => {
    try {
      const query = buildQuery(tableName, filters, sort, limit);
      const { data, error } = await query;
      if (error) {
        console.error(`Error filtering ${tableName}:`, error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error(`Error in filter for ${tableName}:`, err);
      return [];
    }
  },

  get: async (id) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error(`Error getting ${tableName}:`, error);
        return null;
      }
      return data;
    } catch (err) {
      console.error(`Error in get for ${tableName}:`, err);
      return null;
    }
  },

  create: async (data) => {
    try {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(data)
        .select();
      if (error) {
        console.error(`Error creating ${tableName}:`, error);
        return null;
      }
      return result?.[0] || null;
    } catch (err) {
      console.error(`Error in create for ${tableName}:`, err);
      return null;
    }
  },

  update: async (id, updateData) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', id)
        .select();
      if (error) {
        console.error(`Error updating ${tableName}:`, error);
        return null;
      }
      return data?.[0] || null;
    } catch (err) {
      console.error(`Error in update for ${tableName}:`, err);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) {
        console.error(`Error deleting from ${tableName}:`, error);
        return false;
      }
      return true;
    } catch (err) {
      console.error(`Error in delete for ${tableName}:`, err);
      return false;
    }
  },

  subscribe: (callback) => {
    const subscription = supabase
      .from(tableName)
      .on('*', (payload) => {
        callback(payload);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
});

// Export the API client
export const api = {
  auth: {
    me: async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
          return null;
        }
        return user;
      } catch (err) {
        console.error('Error in me:', err);
        return null;
      }
    },

    logout: async () => {
      try {
        await supabase.auth.signOut();
        window.location.href = '/auth/signin';
      } catch (err) {
        console.error('Error logging out:', err);
      }
    },

    redirectToLogin: (returnUrl) => {
      const redirect = returnUrl || window.location.pathname;
      window.location.href = `/auth/signin?redirect=${encodeURIComponent(redirect)}`;
    }
  },

  entities: {
    // Product entity
    Product: createEntity('products'),

    // Appointment entity
    Appointment: createEntity('appointments'),

    // Barber entity
    Barber: createEntity('barbers'),

    // BlogPost entity
    BlogPost: createEntity('blog_posts'),

    // Event entity
    Event: createEntity('events'),

    // JournalPost entity (uses blog_posts table)
    JournalPost: createEntity('blog_posts'),

    // LoyaltyTransaction entity
    LoyaltyTransaction: createEntity('loyalty_transactions'),

    // Order entity
    Order: createEntity('orders'),

    // RetreatApplication entity
    RetreatApplication: createEntity('retreat_applications'),

    // Service entity
    Service: createEntity('services'),

    // Location entity
    Location: createEntity('locations'),

    // BarberReview entity
    BarberReview: createEntity('barber_reviews'),

    // StudioSession entity
    StudioSession: createEntity('studio_sessions'),

    // WaitlistQueue entity
    WaitlistQueue: createEntity('waitlist_queue'),

    // Wishlist entity
    Wishlist: createEntity('wishlists'),

    // BrotherConnection entity
    BrotherConnection: createEntity('brother_connections'),

    // User entity (profiles table)
    User: createEntity('profiles')
  }
};

// For backward compatibility - also export as 'supabaseClient' 
export const supabaseClient = api;

// Default export for convenience
export default api;