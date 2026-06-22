// src/lib/supabaseUtils.js
// Utility functions for common Supabase operations
import { supabase } from './supabase';

/**
 * Fetch user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User profile or null
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile:', error);
  }
  return data || null;
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated profile or null
 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
  }
  return data || null;
}

/**
 * Get user's loyalty points
 * @param {string} userId - User ID
 * @returns {Promise<number>} Total loyalty points
 */
export async function getUserLoyaltyPoints(userId) {
  const { data, error } = await supabase
    .from('loyalty_transactions')
    .select('points_amount')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching loyalty points:', error);
    return 0;
  }
  
  return data.reduce((sum, transaction) => sum + transaction.points_amount, 0);
}

/**
 * Add loyalty transaction
 * @param {string} userId - User ID
 * @param {number} points - Points to add/subtract
 * @param {string} type - Transaction type (earned, redeemed, etc.)
 * @param {string} description - Transaction description
 * @returns {Promise<Object|null>} Created transaction or null
 */
export async function addLoyaltyTransaction(userId, points, type, description) {
  const { data, error } = await supabase
    .from('loyalty_transactions')
    .insert({
      user_id: userId,
      points_amount: points,
      transaction_type: type,
      description: description
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating loyalty transaction:', error);
  }
  return data || null;
}

/**
 * Get user's appointments
 * @param {string} userId - User ID
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<Array>} Appointments
 */
export async function getUserAppointments(userId, status = null) {
  let query = supabase
    .from('appointments')
    .select('*, barber:barber_id(name, phone)')
    .eq('user_id', userId)
    .order('start_time', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching appointments:', error);
  }
  return data || [];
}

/**
 * Create a new appointment
 * @param {Object} appointmentData - Appointment details
 * @returns {Promise<Object|null>} Created appointment or null
 */
export async function createAppointment(appointmentData) {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating appointment:', error);
  }
  return data || null;
}

/**
 * Cancel appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<boolean>} Success status
 */
export async function cancelAppointment(appointmentId) {
  const { error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId);
  
  if (error) {
    console.error('Error cancelling appointment:', error);
    return false;
  }
  return true;
}

/**
 * Get available barbers
 * @returns {Promise<Array>} Active barbers
 */
export async function getAvailableBarbers() {
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .eq('active', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching barbers:', error);
  }
  return data || [];
}

/**
 * Get barber details with reviews
 * @param {string} barberId - Barber ID
 * @returns {Promise<Object|null>} Barber with reviews
 */
export async function getBarberDetails(barberId) {
  const { data: barber, error: barberError } = await supabase
    .from('barbers')
    .select('*')
    .eq('id', barberId)
    .single();
  
  if (barberError) {
    console.error('Error fetching barber:', barberError);
    return null;
  }
  
  const { data: reviews, error: reviewsError } = await supabase
    .from('barber_reviews')
    .select('*')
    .eq('barber_id', barberId)
    .eq('approved', true)
    .order('created_date', { ascending: false });
  
  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
  }
  
  return {
    ...barber,
    reviews: reviews || []
  };
}

/**
 * Get active products
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Products
 */
export async function getProducts(filters = {}) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true);
  
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.featured) {
    query = query.eq('featured', true);
  }
  
  const { data, error } = await query.order('created_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching products:', error);
  }
  return data || [];
}

/**
 * Get product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object|null>} Product or null
 */
export async function getProductById(productId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching product:', error);
  }
  return data || null;
}

/**
 * Get active events
 * @param {string} type - Filter by type (optional)
 * @returns {Promise<Array>} Events
 */
export async function getActiveEvents(type = null) {
  let query = supabase
    .from('events')
    .select('*, location:location_id(name, address)')
    .eq('active', true)
    .gte('end_date', new Date().toISOString())
    .order('start_date', { ascending: true });
  
  if (type) {
    query = query.eq('type', type);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching events:', error);
  }
  return data || [];
}

/**
 * Get published blog posts
 * @param {number} limit - Limit results
 * @returns {Promise<Array>} Blog posts
 */
export async function getPublishedBlogPosts(limit = 10) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching blog posts:', error);
  }
  return data || [];
}

/**
 * Get blog post by slug
 * @param {string} slug - Post slug
 * @returns {Promise<Object|null>} Blog post or null
 */
export async function getBlogPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching blog post:', error);
  }
  return data || null;
}

/**
 * Subscribe to real-time product updates
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribeToProducts(callback) {
  const subscription = supabase
    .from('products')
    .on('*', (payload) => {
      callback(payload);
    })
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to real-time appointments
 * @param {string} userId - User ID
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribeToUserAppointments(userId, callback) {
  const subscription = supabase
    .from('appointments')
    .on('*', (payload) => {
      if (payload.new?.user_id === userId || payload.old?.user_id === userId) {
        callback(payload);
      }
    })
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Get waitlist position
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Waitlist entry or null
 */
export async function getWaitlistPosition(userId) {
  const { data, error } = await supabase
    .from('waitlist_queue')
    .select('*')
    .eq('user_id', userId)
    .order('created_date', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching waitlist position:', error);
  }
  return data || null;
}

/**
 * Add to waitlist
 * @param {Object} entry - Waitlist entry data
 * @returns {Promise<Object|null>} Created entry or null
 */
export async function addToWaitlist(entry) {
  const { data, error } = await supabase
    .from('waitlist_queue')
    .insert(entry)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding to waitlist:', error);
  }
  return data || null;
}

/**
 * Remove from waitlist
 * @param {string} waitlistId - Waitlist entry ID
 * @returns {Promise<boolean>} Success status
 */
export async function removeFromWaitlist(waitlistId) {
  const { error } = await supabase
    .from('waitlist_queue')
    .delete()
    .eq('id', waitlistId);
  
  if (error) {
    console.error('Error removing from waitlist:', error);
    return false;
  }
  return true;
}

/**
 * Get app settings
 * @returns {Promise<Object|null>} App settings
 */
export async function getAppSettings() {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching app settings:', error);
  }
  return data || { app_name: 'BOYZ IN THE WOODZ' };
}

export default {
  getUserProfile,
  updateUserProfile,
  getUserLoyaltyPoints,
  addLoyaltyTransaction,
  getUserAppointments,
  createAppointment,
  cancelAppointment,
  getAvailableBarbers,
  getBarberDetails,
  getProducts,
  getProductById,
  getActiveEvents,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  subscribeToProducts,
  subscribeToUserAppointments,
  getWaitlistPosition,
  addToWaitlist,
  removeFromWaitlist,
  getAppSettings
};
