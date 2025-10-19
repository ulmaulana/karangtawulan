// XSS Protection & Sanitization helpers

/**
 * Escape HTML untuk mencegah XSS
 * Gunakan untuk output HTML yang tidak dipercaya
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return text.replace(/[&<>"'/]/g, char => htmlEscapeMap[char]);
}

/**
 * Sanitize string untuk SQL (meskipun Drizzle ORM sudah handle ini)
 * Extra layer of protection
 */
export function sanitizeSqlInput(input: string): string {
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Remove atau escape karakter berbahaya
  sanitized = sanitized.replace(/['"\\;]/g, '');
  
  // Limit length
  return sanitized.slice(0, 10000);
}

/**
 * Validate dan sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Hanya allow https dan http
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    // Prevent javascript: protocol
    if (parsed.protocol === 'javascript:') {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize filename untuk upload
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  let safe = filename.replace(/\.\./g, '');
  
  // Only allow alphanumeric, dash, underscore, dan dot
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit length
  return safe.slice(0, 255);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number (Indonesia)
 */
export function isValidPhone(phone: string): boolean {
  // Allow +62 atau 0 prefix, followed by 8-15 digits
  const phoneRegex = /^(\+62|62|0)[0-9]{8,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Sanitize integer input
 */
export function sanitizeInteger(value: unknown, defaultValue = 0, min?: number, max?: number): number {
  const num = parseInt(String(value), 10);
  
  if (isNaN(num)) {
    return defaultValue;
  }
  
  if (min !== undefined && num < min) {
    return min;
  }
  
  if (max !== undefined && num > max) {
    return max;
  }
  
  return num;
}

/**
 * Sanitize array input
 */
export function sanitizeArray<T>(
  value: unknown,
  itemSanitizer: (item: unknown) => T | null,
  maxLength = 100
): T[] {
  if (!Array.isArray(value)) {
    return [];
  }
  
  return value
    .slice(0, maxLength)
    .map(itemSanitizer)
    .filter((item): item is T => item !== null);
}

/**
 * Remove invisible characters dan control characters
 */
export function removeInvisibleChars(text: string): string {
  // Remove control characters except newline, carriage return, tab
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
}
