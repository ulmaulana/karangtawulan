// Simple in-memory rate limiter (untuk production, gunakan Redis)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Cleanup expired entries setiap 1 menit
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000);

export interface RateLimitOptions {
  windowMs: number; // Time window dalam milidetik
  max: number; // Maksimal requests per window
}

export function rateLimit(identifier: string, options: RateLimitOptions): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  
  // Initialize atau reset jika expired
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + options.windowMs,
    };
  }
  
  // Increment count
  store[key].count++;
  
  const allowed = store[key].count <= options.max;
  const remaining = Math.max(0, options.max - store[key].count);
  
  return {
    allowed,
    remaining,
    resetTime: store[key].resetTime,
  };
}

// Helper untuk mendapatkan IP address
export function getClientIp(request: Request): string {
  // Check for forwarded IP (dari reverse proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback
  return 'unknown';
}
