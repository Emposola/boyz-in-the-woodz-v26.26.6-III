// src/config/environment.js
// Application Environment Configuration
// All environment variables should be accessed through this file

export const env = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    backendUrl: import.meta.env.VITE_SUPABASE_BACKEND_URL,
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'BOYZ IN THE WOODZ',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },

  // Optional: Analytics and Monitoring
  monitoring: {
    analyticsKey: import.meta.env.VITE_ANALYTICS_KEY,
    errorTrackingKey: import.meta.env.VITE_ERROR_TRACKING_KEY,
  },
};

// Validate required environment variables
export function validateEnvironment() {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n📝 Create .env.local with these variables.');
    console.error('📖 See .env.example for template.');
    throw new Error('Missing required environment variables');
  }

  console.log('✅ Environment variables validated');
}

// Export individual values for convenience
export const {
  supabase,
  app,
  monitoring,
} = env;

export default env;
