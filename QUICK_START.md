# 🚀 Quick Start - Supabase Migration

**Start here!** This is your 5-minute setup guide.

---

## Step 1: Database Setup (3 minutes)

1. Open Supabase: https://supabase.com/dashboard
2. Select project: `pgwcfazhwuzxcqbqbjat`
3. Go to **SQL Editor**
4. Click **New Query**
5. **Copy & paste** everything from file: `supabase_schema.sql`
6. Click **Run**
7. ✅ Wait for completion

**Done!** All 14 tables created.

---

## Step 2: Local Setup (2 minutes)

1. **Create `.env.local` in project root** with this content:
   ```
   VITE_SUPABASE_URL=https://pgwcfazhwuzxcqbqbjat.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_mAxPnJ72mvOq2csXs0Q_UA_qGjxjNPI
   ```

2. **Install & Run:**
   ```bash
   npm install
   npm run dev
   ```

3. Open: http://localhost:5173

**Done!** App is running!

---

## Step 3: Test It (5 minutes)

Try these actions:
- [ ] Sign up with new email
- [ ] Sign in
- [ ] View products
- [ ] Book appointment
- [ ] Create blog post
- [ ] Check real-time (open in 2 windows)

**All working?** ✅ You're good to go!

---

## Optional: Migrate Data from Base44 (15 minutes)

If you have existing data:

```bash
# Set your Base44 credentials
export BASE44_API_URL="https://your-app.base44.app"
export BASE44_API_KEY="your-api-key"

# Run migration
node scripts/migrate-from-base44.js
```

**Done!** Check Supabase to verify data.

---

## Next Steps

For full documentation, see:
- **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)** - Executive summary
- **[SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md)** - Detailed guide
- **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Verification checklist

---

## Build for Production

```bash
npm run build
npm run preview  # Test production build

# Deploy the "dist" folder to your hosting
```

---

**Status:** ✅ Ready to deploy!

Questions? Check the full documentation files.
