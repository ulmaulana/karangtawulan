// Rate Limiter untuk Vercel dengan KV (Redis)
// Install: npm install @vercel/kv
// Note: Package ini hanya diperlukan saat deploy ke Vercel

// Conditional import untuk avoid error di development
let kv: any;
try {
  kv = require('@vercel/kv').kv;
} catch (error) {
  // Fallback untuk development (akan use in-memory rate limiter)
  console.warn('Vercel KV not available, using fallback rate limiter');
  kv = null;
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export async function rateLimitVercel(
  identifier: string, 
  options: RateLimitOptions
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const resetTime = now + options.windowMs;
  
  // Jika KV tidak tersedia (development), return allowed
  if (!kv) {
    console.warn('Vercel KV not configured - rate limiting disabled in development');
    return {
      allowed: true,
      remaining: options.max,
      resetTime,
    };
  }
  
  try {
    // Increment counter dengan expiry
    const count = await kv.incr(key);
    
    // Set TTL hanya jika ini first request
    if (count === 1) {
      await kv.expire(key, Math.ceil(options.windowMs / 1000));
    }
    
    const allowed = count <= options.max;
    const remaining = Math.max(0, options.max - count);
    
    return {
      allowed,
      remaining,
      resetTime,
    };
  } catch (error) {
    // Fallback: allow jika Redis down (graceful degradation)
    console.error('Rate limit error:', error);
    return {
      allowed: true,
      remaining: options.max,
      resetTime,
    };
  }
}

// Helper untuk mendapatkan IP address
export function getClientIp(request: Request): string {
  // Vercel provides IP in these headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}
