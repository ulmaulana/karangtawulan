# 🔐 Security Implementation

## Overview
Adminpanel karangtawulan dilengkapi dengan multiple layers of security untuk melindungi dari berbagai attack vectors.

## ✅ Security Features Implemented

### 1. SQL Injection Protection
- ✅ **Drizzle ORM** dengan parameterized queries (automatic)
- ✅ **Input validation** dengan Zod schemas
- ✅ **No dynamic SQL** - semua query melalui ORM
- ✅ **Type-safe** database operations

**Contoh Implementasi:**
```typescript
// ❌ JANGAN INI (vulnerable)
db.execute(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ YA INI (safe - Drizzle ORM)
await db.select().from(packages).where(eq(packages.id, id));
```

### 2. XSS (Cross-Site Scripting) Protection
- ✅ **Content Security Policy (CSP)** headers
- ✅ **Input sanitization** dengan helper functions
- ✅ **HTML escaping** untuk user-generated content
- ✅ **X-XSS-Protection** header
- ✅ **React automatic escaping** (framework level)

**Contoh Implementasi:**
```typescript
import { escapeHtml } from '@/lib/sanitize';

// Escape HTML sebelum render
const safeContent = escapeHtml(userInput);
```

### 3. CSRF Protection
- ✅ **SameSite cookies** (Strict)
- ✅ **Better Auth** framework dengan built-in CSRF protection
- ✅ **Origin checking** untuk API requests
- ⚠️ **Production**: Tambahkan CSRF tokens untuk forms

**Better Auth Configuration:**
```typescript
// better-auth sudah include CSRF protection by default
// Cookies di-set dengan SameSite=Strict
```

### 4. Session & Cookie Security
- ✅ **HttpOnly cookies** - tidak bisa diakses JavaScript
- ✅ **Secure flag** - hanya dikirim via HTTPS
- ✅ **SameSite=Strict** - mencegah CSRF
- ✅ **Session rotation** setelah login
- ✅ **Short-lived sessions** dengan refresh mechanism

**Cookie Configuration:**
```typescript
// Cookies di-set via Better Auth dengan flags:
{
  httpOnly: true,
  secure: true, // production only
  sameSite: 'strict',
  maxAge: 15 * 60 // 15 menit
}
```

### 5. Security Headers
Headers berikut diterapkan via `middleware.ts`:

- ✅ **Strict-Transport-Security** - Force HTTPS
- ✅ **X-Content-Type-Options: nosniff** - Prevent MIME sniffing
- ✅ **X-Frame-Options: DENY** - Prevent clickjacking
- ✅ **Referrer-Policy: strict-origin-when-cross-origin**
- ✅ **Permissions-Policy** - Disable dangerous features
- ✅ **Content-Security-Policy** - Restrict resource loading
- ✅ **X-Powered-By removed** - Hide server info

### 6. Content Security Policy (CSP)
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';  // Dev only
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

**⚠️ Production CSP:**
- Remove `'unsafe-inline'` dan `'unsafe-eval'` dari script-src
- Use nonces atau hashes untuk inline scripts
- Test dengan `Content-Security-Policy-Report-Only` dulu

### 7. Rate Limiting
- ✅ **API rate limiting** - 20 requests/menit untuk updates
- ✅ **Delete rate limiting** - 10 deletes/menit
- ✅ **IP-based tracking**
- ⚠️ **Production**: Gunakan Redis untuk distributed rate limiting

**Implementasi:**
```typescript
const limit = rateLimit(`api-patch-${ip}`, { 
  windowMs: 60000,  // 1 menit
  max: 20           // 20 requests
});
```

### 8. Input Validation
- ✅ **Zod schemas** untuk semua input
- ✅ **Type checking** & length limits
- ✅ **Format validation** (email, URL, phone)
- ✅ **Allowlist-based validation**
- ✅ **Sanitization helpers**

**Validation Schemas:**
- `packageSchema` - Package data
- `accommodationSchema` - Accommodation data  
- `accessorySchema` - Accessory data
- `gallerySchema` - Gallery images
- `leadSchema` - Form submissions

### 9. Authentication & Authorization
- ✅ **Better Auth** framework
- ✅ **Session-based auth** dengan secure cookies
- ✅ **Route protection** via middleware
- ✅ **Role-based access** (jika diperlukan)
- ✅ **Password hashing** (bcrypt/argon2)

## 🚨 Additional Recommendations

### Production Checklist
- [ ] Deploy dengan HTTPS (wajib)
- [ ] Set `NODE_ENV=production`
- [ ] Update CSP: remove `unsafe-inline` dan `unsafe-eval`
- [ ] Setup Redis untuk rate limiting
- [ ] Enable database connection pooling
- [ ] Setup error monitoring (Sentry)
- [ ] Regular security audits
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Setup WAF (Web Application Firewall) jika perlu
- [ ] Database backups regular
- [ ] Implement 2FA untuk admin accounts

### Environment Variables
Pastikan `.env` tidak ter-commit dan berisi:
```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=random_32_char_string
BETTER_AUTH_URL=https://yourdomain.com
NODE_ENV=production
```

### Database Security
- ✅ Drizzle ORM (parameterized queries)
- ✅ Minimum privilege principle
- [ ] Separate read-only user untuk analytics
- [ ] Regular backups
- [ ] Encrypted connections (SSL/TLS)
- [ ] Database firewall rules

### Logging & Monitoring
```typescript
// Log suspicious activities
console.error('Security: Rate limit exceeded', {
  ip,
  endpoint,
  timestamp: new Date()
});
```

## 📚 Security Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Better Auth Docs](https://better-auth.com/)
- [Next.js Security](https://nextjs.org/docs/pages/building-your-application/configuring/security)

## 🐛 Reporting Security Issues
Jika menemukan vulnerability, jangan buat public issue. Email langsung ke security contact.

## 🔄 Security Updates
- Check dependencies: `npm audit`
- Update packages: `npm update`
- Review security advisories regular

