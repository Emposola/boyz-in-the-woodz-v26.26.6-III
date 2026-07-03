// Security utilities for BOYZ IN THE WOODZ

// Sanitize user input before using dangerouslySetInnerHTML
export const sanitizeHTML = (html) => {
  if (!html) return ''
  // Basic sanitization - remove script tags
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

// Validate URLs to prevent open redirects
export const isValidRedirectUrl = (url) => {
  if (!url) return false
  // Only allow relative paths or same domain
  const allowedDomains = ['boyzinthewoodz.com', 'localhost']
  try {
    const urlObj = new URL(url)
    return allowedDomains.some(domain => urlObj.hostname.includes(domain))
  } catch {
    // If it's a relative path, it's safe
    return url.startsWith('/') && !url.startsWith('//')
  }
}

// Check if content is safe for display
export const isSafeContent = (content) => {
  if (!content) return true
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /onclick=/i,
    /onmouseover=/i
  ]
  return !dangerousPatterns.some(pattern => pattern.test(content))
}

// Log security events
export const logSecurityEvent = (event, data = {}) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics or monitoring service
    console.warn(`[SECURITY] ${event}:`, data)
  }
}