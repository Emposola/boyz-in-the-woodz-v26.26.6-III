# Production Deployment Guide

**Project:** BOYZ IN THE WOODZ v26.5.17  
**Backend:** Supabase  
**Frontend:** React + Vite

---

## Pre-Deployment Checklist

### Code Quality
- [ ] Run `npm run lint` - No errors
- [ ] Run `npm run typecheck` - No errors
- [ ] All tests passing
- [ ] Code reviewed
- [ ] No console errors in development

### Environment & Configuration
- [ ] `.env.local` configured with development credentials
- [ ] `.env.example` created as template
- [ ] `supabase_schema.sql` executed in Supabase
- [ ] Supabase Auth redirect URLs configured
- [ ] No Base44 references remaining

### Testing
- [ ] Sign up/login works
- [ ] All main features tested
- [ ] Real-time updates working
- [ ] Responsive design checked
- [ ] No broken links

### Documentation
- [ ] README.md updated
- [ ] Setup guide prepared
- [ ] API documentation ready
- [ ] Deployment instructions documented

---

## Deployment Steps

### 1. Build Application

```bash
# Install latest dependencies
npm install

# Run all checks
npm run lint
npm run typecheck

# Build for production
npm run build

# Test production build locally
npm run preview
```

**Expected Output:**
```
✓ 1234 modules transformed
dist/index.html                    42.12 kB
dist/assets/index-abc123.js      1234.56 kB
✓ built in 12.34s
```

### 2. Prepare Deployment Environment

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Option D: Traditional Hosting
1. Upload `dist/` folder to your server
2. Configure web server (nginx/Apache) to serve `dist/index.html` for all routes
3. Set environment variables on server

### 3. Configure Environment Variables

**Set these on your hosting platform:**

```
VITE_SUPABASE_URL=https://pgwcfazhwuzxcqbqbjat.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_mAxPnJ72mvOq2csXs0Q_UA_qGjxjNPI
VITE_APP_NAME=BOYZ IN THE WOODZ
VITE_APP_ENVIRONMENT=production
```

### 4. Update Supabase Configuration

**In Supabase Dashboard:**

1. Go to **Authentication > URL Configuration**
2. Add redirect URLs:
   - `https://yourdomain.com/login`
   - `https://yourdomain.com/auth/callback`
   - `https://www.yourdomain.com/login`
   - `https://www.yourdomain.com/auth/callback`

3. Configure email templates (optional)
4. Set up email provider (if not using Supabase defaults)

### 5. Setup SSL/HTTPS

**Recommended providers:**
- Let's Encrypt (free)
- CloudFlare (free/paid)
- AWS Certificate Manager (free for AWS)

### 6. Configure Database Backups

**In Supabase Dashboard:**

1. Go to **Project Settings > Backups**
2. Enable automated backups
3. Set backup frequency (daily recommended)
4. Test restore process

### 7. Setup Monitoring & Logging

**Options:**
- Supabase Dashboard (built-in)
- Sentry (error tracking)
- LogRocket (session replay)
- Datadog (full monitoring)
- New Relic (APM)

### 8. Performance Optimization

**Enable CDN for assets:**
- CloudFlare
- AWS CloudFront
- Bunny CDN
- Cloudinary (for images)

**Optimize images:**
- WebP format conversion
- Lazy loading
- Responsive images
- Compression

---

## Post-Deployment Verification

### Functionality Testing
- [ ] Homepage loads
- [ ] Authentication works
- [ ] Can create account
- [ ] Can sign in
- [ ] All pages load
- [ ] Forms submit correctly
- [ ] Real-time updates work
- [ ] Mobile responsive

### Performance Testing

```bash
# Test with Lighthouse
npm install -g lighthouse
lighthouse https://yourdomain.com
```

**Targets:**
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Security Testing
- [ ] HTTPS enabled
- [ ] No mixed content (HTTP/HTTPS)
- [ ] Security headers configured
- [ ] CORS configured correctly
- [ ] No sensitive data in client code

### Monitoring Setup
- [ ] Error tracking enabled
- [ ] Analytics tracking working
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Alert notifications working

---

## Maintenance & Updates

### Regular Tasks

**Daily:**
- Monitor error logs
- Check uptime status
- Review user feedback

**Weekly:**
- Review performance metrics
- Check database size
- Review security logs

**Monthly:**
- Update dependencies
- Review and optimize slow queries
- Backup verification
- Performance analysis

### Update Process

```bash
# Check for outdated packages
npm outdated

# Update dependencies safely
npm update

# Update major versions (careful!)
npm install package@latest

# Test everything
npm run lint
npm run typecheck
npm run build

# Deploy when ready
npm run build
# Upload dist/ to production
```

---

## Troubleshooting Production Issues

### Issue: 404 on page reload
**Cause:** SPA routing not configured  
**Solution:** Configure server to serve `index.html` for all routes

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Issue: Slow performance
**Solutions:**
- Enable gzip compression
- Use CDN for assets
- Optimize images
- Enable browser caching
- Review Supabase performance metrics

### Issue: CORS errors
**Solution:** Check Supabase CORS settings
- Go to Supabase > Project Settings
- Add your domain to allowed origins

### Issue: Real-time not working
**Cause:** WebSocket blocked by firewall  
**Solution:**
- Check firewall rules
- Test WebSocket connection
- Contact hosting provider

### Issue: Database connection slow
**Solutions:**
- Add connection pooling
- Optimize slow queries (check Supabase logs)
- Increase database resources
- Add indexes on frequently queried columns

---

## Database Optimization

### Check Slow Queries

**In Supabase:**
1. Go to **SQL Editor**
2. Run: `SELECT * FROM pg_stat_statements ORDER BY mean_time DESC`
3. Identify slow queries
4. Add indexes

### Add Index

```sql
CREATE INDEX idx_table_column ON public.table(column);
```

### Monitor Connections

```sql
SELECT * FROM pg_stat_activity;
```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly set
- [ ] API keys secured (not in code)
- [ ] Environment variables secret
- [ ] Database backups enabled
- [ ] Monitoring alerts active
- [ ] Rate limiting enabled (if applicable)
- [ ] Input validation on server
- [ ] OWASP practices followed

---

## Rollback Plan

If something goes wrong:

1. **Immediate:**
   - Switch to previous version (if using CI/CD)
   - Restore from database backup
   - Update DNS to previous server

2. **Investigation:**
   - Check error logs
   - Review recent changes
   - Check Supabase logs

3. **Recovery:**
   - Fix the issue
   - Test in staging
   - Redeploy to production

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com

---

## Contact & Support

For issues or questions:
1. Check documentation first
2. Review error logs
3. Check Supabase dashboard
4. Contact hosting provider if infrastructure issue

**Emergency Contact:** [Your emergency contact info]

---

**Deployment Status:** ✅ Ready  
**Last Updated:** 2026-06-16
