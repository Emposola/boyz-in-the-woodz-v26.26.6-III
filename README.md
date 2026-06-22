# BOYZ IN THE WOODZ - v26.5.17

**Supabase Backend | React Frontend | Vite Build Tool**

## Overview

Welcome to BOYZ IN THE WOODZ - a comprehensive barbershop and lifestyle platform built with React, Vite, and Supabase.

> **Migration Status:** ✅ Fully migrated from Base44 to Supabase

This application provides:
- 💈 Barber appointment booking system
- 🛍️ E-commerce product shop
- 📚 Blog and journal platform
- 🏘️ Community retreat management
- 💳 Loyalty points system
- 👥 User profile management
- 🎥 Live studio sessions
- ⏳ Walk-in waitlist queue

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Supabase account (already configured)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boyz-in-the-woodz-v26.5.17-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env.local file
   echo "VITE_SUPABASE_URL=https://pgwcfazhwuzxcqbqbjat.supabase.co" > .env.local
   echo "VITE_SUPABASE_ANON_KEY=sb_publishable_mAxPnJ72mvOq2csXs0Q_UA_qGjxjNPI" >> .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Application opens at: http://localhost:5173

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run typecheck
```

## Project Structure

```
src/
├── api/
│   └── xxClient.js          # Supabase API client (for sdk compatibility)
├── components/
│   ├── home/                     # Home page components
│   ├── layout/                   # Layout components
│   ├── shared/                   # Shared components
│   └── ui/                       # UI components
├── hooks/
│   └── use-mobile.jsx            # Mobile detection hook
├── lib/
│   ├── AuthContext.jsx           # Authentication context
│   ├── cartContext.jsx           # Shopping cart context
│   ├── supabase.js               # Supabase client
│   ├── supabaseUtils.js          # Database utility functions
│   └── utils.js                  # Utility functions
├── pages/                        # Page components (50+)
├── utils/
│   └── index.ts                  # TypeScript utilities
└── App.jsx                       # Root component
```

## Database Schema

### Tables
- `profiles` - User profiles
- `products` - Product catalog
- `barbers` - Barber information
- `appointments` - Appointment bookings
- `locations` - Business locations
- `blog_posts` - Blog content & journal
- `events` - Events and retreats
- `orders` - Customer orders
- `loyalty_transactions` - Points tracking
- `retreat_applications` - Retreat signups
- `barber_reviews` - Review system
- `studio_sessions` - Live sessions
- `waitlist_queue` - Walk-in queue
- `app_settings` - App configuration

See `supabase_schema.sql` for complete schema definition.

## API Usage

### Getting Started with base44 Client

The application uses a compatibility layer (`SDK` client) that maps to Supabase

### Using Utility Functions

```javascript
import { getProducts, getUserAppointments, addLoyaltyTransaction } from '@/lib/supabaseUtils';

// Query data
const products = await getProducts({ category: 'shirts' });
const appointments = await getUserAppointments(userId);

// Modify data
await addLoyaltyTransaction(userId, 100, 'earned', 'Purchase reward');
```

## Authentication

Email/password authentication via Supabase Auth:

```javascript
import { useAuth } from '@/lib/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, signIn, signUp, logout } = useAuth();
  
  // Use auth state and methods
}
```

## Styling

- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** components for UI elements
- **Custom CSS** in `src/index.css`

## State Management

- **React Context** for global state (Auth, Cart, Pledges)
- **React Query** for server state and caching
- **Local state** for component-level state

## Deployment

### Environment Setup

Set these environment variables in your deployment platform:

```
VITE_SUPABASE_URL=https://pgwcfazhwuzxcqbqbjat.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_mAxPnJ72mvOq2csXs0Q_UA_qGjxjNPI
```

### Build & Deploy

```bash
# Build production bundle
npm run build

# Test production build locally
npm run preview

# Deploy `dist/` folder to your hosting
```

## Documentation

- **[SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md)** - Complete migration guide
- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Migration checklist & status
- **[supabase_schema.sql](./supabase_schema.sql)** - Database schema

## Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend/Database
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **React Router** - Navigation
- **Zustand/Context** - State management

## Performance Features

- ⚡ Server-side rendering optimizations
- 🖼️ Image optimization
- 📦 Code splitting & lazy loading
- 🔄 Real-time database subscriptions
- 💾 Query caching with React Query

## Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Secure authentication with Supabase Auth
- ✅ Environment variables for secrets
- ✅ HTTPS only in production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support & Contact

- **Email:** [support@boyzzinthewoodz.com]
- **Website:** [www.boyzzinthewoodz.com]
- **Support Portal:** [Supabase Dashboard](https://supabase.com/dashboard)

## Migration Notes

This application was **successfully migrated backend



For detailed migration information, see [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md).

---

**Version:** 26.5.17  
**Last Updated:** 2026-06-16  
**Backend:** Supabase  
**Status:** ✅ Production Ready
