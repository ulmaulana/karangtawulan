# 🚀 Vercel Deployment Guide - Security Edition

## Pre-Deployment Checklist

### ✅ 1. Environment Variables
Set di **Vercel Dashboard** > Settings > Environment Variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=your_random_32_character_secret_here
BETTER_AUTH_URL=https://yourapp.vercel.app

# Environment
NODE_ENV=production
```

**Generate secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ✅ 2. Database Setup

**Option A: Vercel Postgres** (Recommended)
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# Di Vercel Dashboard:
# Storage > Create Database > Postgres
# Otomatis set DATABASE_URL
```

**Option B: External Postgres** (Neon, Supabase, etc.)
- Pastikan **SSL/TLS enabled**
- Pastikan **connection pooling** enabled
- Add `?sslmode=require` ke connection string

**Database Connection Pooling:**
```typescript
// db/index.ts - Update untuk serverless
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  max: 1, // Serverless: 1 connection per function
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client);
```

### ✅ 3. Rate Limiting dengan Vercel KV

**Install Vercel KV:**
```bash
npm install @vercel/kv
```

**Enable di Vercel:**
1. Dashboard > Storage > Create KV Database
2. Connect to your project
3. Environment variables auto-added

**Update API routes:**
```typescript
// Ganti import
// import { rateLimit } from '@/lib/rate-limit';  // ❌ Localhost only
import { rateLimitVercel } from '@/lib/rate-limit-vercel';  // ✅ Vercel

// Usage tetap sama
const limit = await rateLimitVercel(`api-patch-${ip}`, { 
  windowMs: 60000, 
  max: 20 
});
```

### ✅ 4. Update CSP untuk Production

**middleware.ts - Production CSP:**
```typescript
// Remove unsafe-eval untuk production
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self'",  // ❌ Remove 'unsafe-eval' di production
  "style-src 'self' 'unsafe-inline'",  // Tailwind needs unsafe-inline
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')
```

### ✅ 5. Security Headers (Auto-enabled di Vercel)

Vercel automatically provides:
- ✅ HTTPS/SSL (free certificate)
- ✅ DDoS protection
- ✅ Edge caching
- ✅ Automatic compression (gzip/brotli)

Your middleware adds:
- ✅ HSTS
- ✅ CSP
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Permissions-Policy

## 📦 Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 2. Deploy via GitHub (Recommended)

**a. Push ke GitHub:**
```bash
git add .
git commit -m "Production ready with security"
git push origin main
```

**b. Connect di Vercel:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)
4. Root Directory: `./`
5. Add environment variables
6. Click **Deploy**

### 3. Deploy via CLI
```bash
# Login
vercel login

# Deploy
vercel --prod

# Follow prompts
```

## 🔒 Post-Deployment Security Checks

### 1. Test Security Headers
```bash
curl -I https://yourapp.vercel.app/dashboard
```

**Check for:**
- ✅ `strict-transport-security`
- ✅ `x-frame-options: DENY`
- ✅ `content-security-policy`
- ✅ `x-content-type-options: nosniff`

**Online Tools:**
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

### 2. Test Rate Limiting
```bash
# Test 21 rapid requests (should get 429 on 21st)
for i in {1..21}; do
  curl -X PATCH https://yourapp.vercel.app/api/packages/test-id
done
```

### 3. Test Authentication
- ✅ Try accessing `/dashboard` without login
- ✅ Verify redirect to login
- ✅ Check session persistence
- ✅ Test logout

### 4. Database Security
```bash
# Check SSL connection
psql $DATABASE_URL

# Should show: SSL connection (protocol: TLSv1.3)
\conninfo
```

### 5. Environment Variables
```bash
# Verify di Vercel Dashboard
# Settings > Environment Variables
# Pastikan tidak ada yang exposed di logs
```

## ⚡ Performance Optimization

### 1. Edge Functions (Optional)
```typescript
// Untuk API yang perlu super fast
export const config = {
  runtime: 'edge',
};
```

### 2. Database Query Optimization
```typescript
// Select only needed columns
const packages = await db.select({
  id: packages.id,
  nama: packages.nama,
  harga: packages.harga,
}).from(packages).where(eq(packages.published, true));
```

### 3. Caching
```typescript
// Vercel automatically caches static assets
// For API, add cache headers if needed
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  },
});
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Error: too many connections

# Solution 1: Use connection pooling
# Solution 2: Use Vercel Postgres (has built-in pooling)
# Solution 3: Use Neon (serverless-friendly)
```

### Rate Limiting Not Working
```bash
# Pastikan Vercel KV enabled
# Check: Dashboard > Storage > KV Database
# Verify KV_URL environment variable set
```

### CORS Issues
```typescript
// middleware.ts - Add CORS if needed
if (request.method === 'OPTIONS') {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://yourdomain.com',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

## 📊 Monitoring

### 1. Vercel Analytics
```bash
# Enable di Dashboard > Analytics
# Provides:
# - Page views
# - API usage
# - Error rates
# - Web Vitals
```

### 2. Error Tracking (Optional)
```bash
# Install Sentry
npm install @sentry/nextjs

# Setup
npx @sentry/wizard@latest -i nextjs
```

### 3. Database Monitoring
```bash
# Neon: Built-in monitoring dashboard
# Supabase: Dashboard > Database > Monitoring
# Vercel Postgres: Dashboard > Storage > Postgres
```

## 🔄 CI/CD (Auto-deploy)

Vercel automatically:
- ✅ Deploys on every `git push`
- ✅ Creates preview deployments for PRs
- ✅ Runs build checks
- ✅ Invalidates cache

**Branch Protection:**
```yaml
# Production: main branch
# Preview: feature branches

# Vercel Dashboard > Settings > Git
# Production Branch: main
```

## 📈 Scaling

Vercel scales automatically:
- ✅ Serverless functions auto-scale
- ✅ Edge network (global CDN)
- ✅ No server management
- ✅ Pay per usage

**Limits (Free Tier):**
- 100GB bandwidth/month
- 100 serverless function invocations/day
- 10GB KV storage

**Upgrade to Pro if needed:**
- Unlimited bandwidth
- Unlimited invocations
- Advanced analytics
- Team collaboration

## 🎯 Security Score

After deployment, your app will have:

**Security Level: ⭐⭐⭐⭐⭐**
- ✅ HTTPS (automatic)
- ✅ SQL Injection protected
- ✅ XSS protected
- ✅ CSRF protected
- ✅ Rate limiting (with KV)
- ✅ Security headers
- ✅ Input validation
- ✅ Secure sessions
- ✅ DDoS protection (Vercel)
- ✅ Edge network

**Test Security:**
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

---
**Deployment Checklist:**
- [ ] Environment variables set
- [ ] Database connected (with SSL)
- [ ] Vercel KV enabled (for rate limiting)
- [ ] CSP updated (remove unsafe-eval)
- [ ] Better Auth configured
- [ ] Test deployment in preview
- [ ] Run security checks
- [ ] Monitor for errors
- [ ] Setup custom domain (optional)
