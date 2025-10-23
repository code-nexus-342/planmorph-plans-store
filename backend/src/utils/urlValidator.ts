/**
 * Custom URL Validator
 * 
 * This utility provides additional URL validation to mitigate
 * the validator.js CVE-2025-56200 vulnerability.
 * 
 * Use this for critical URL validation (OAuth redirects, CORS origins, etc.)
 */

/**
 * Validates if a string is a valid HTTP/HTTPS URL
 * 
 * This implementation uses the native URL constructor for validation
 * and adds additional checks to prevent bypass attacks.
 * 
 * @param urlString - The URL string to validate
 * @param options - Optional validation options
 * @returns true if valid, false otherwise
 */
export function isValidHttpUrl(
  urlString: string,
  options?: {
    allowHttp?: boolean;
    allowLocalhost?: boolean;
    requireTLD?: boolean;
  }
): boolean {
  const {
    allowHttp = true,
    allowLocalhost = true,
    requireTLD = false,
  } = options || {};

  try {
    // Basic validation
    if (!urlString || typeof urlString !== 'string') {
      return false;
    }

    // Check for multiple protocol delimiters (vulnerability mitigation)
    const protocolCount = (urlString.match(/:\//g) || []).length;
    if (protocolCount !== 1) {
      return false;
    }

    // Use native URL constructor for parsing
    const url = new URL(urlString);

    // Validate protocol
    const allowedProtocols = allowHttp ? ['http:', 'https:'] : ['https:'];
    if (!allowedProtocols.includes(url.protocol)) {
      return false;
    }

    // Validate hostname exists
    if (!url.hostname) {
      return false;
    }

    // Check localhost if not allowed
    if (!allowLocalhost) {
      const localhostPatterns = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
      if (localhostPatterns.some(pattern => url.hostname.includes(pattern))) {
        return false;
      }
    }

    // Check for TLD if required
    if (requireTLD && !allowLocalhost) {
      const parts = url.hostname.split('.');
      const lastPart = parts[parts.length - 1];
      if (parts.length < 2 || !lastPart || lastPart.length < 2) {
        return false;
      }
    }

    // Additional security checks
    if (url.username || url.password) {
      // Some attacks use credentials in URLs
      return false;
    }

    return true;
  } catch (error) {
    // URL constructor throws TypeError for invalid URLs
    return false;
  }
}

/**
 * Validates if a URL matches a whitelist of allowed domains
 * 
 * @param urlString - The URL to validate
 * @param allowedDomains - Array of allowed domains (e.g., ['example.com', 'localhost:3000'])
 * @returns true if URL's hostname matches whitelist
 */
export function isWhitelistedUrl(
  urlString: string,
  allowedDomains: string[]
): boolean {
  try {
    const url = new URL(urlString);
    const hostname = url.host; // includes port

    return allowedDomains.some(domain => {
      // Exact match
      if (hostname === domain) return true;
      
      // Subdomain match (e.g., api.example.com matches *.example.com)
      if (domain.startsWith('*.')) {
        const baseDomain = domain.substring(2);
        return hostname.endsWith('.' + baseDomain) || hostname === baseDomain;
      }
      
      return false;
    });
  } catch {
    return false;
  }
}

/**
 * Sanitizes a URL by removing potentially dangerous components
 * 
 * @param urlString - The URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(urlString: string): string | null {
  try {
    const url = new URL(urlString);
    
    // Remove credentials
    url.username = '';
    url.password = '';
    
    // Ensure safe protocol
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }
    
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Validates OAuth redirect URIs
 * 
 * @param redirectUri - The redirect URI to validate
 * @param allowedUris - Array of allowed redirect URIs
 * @returns true if valid
 */
export function isValidOAuthRedirect(
  redirectUri: string,
  allowedUris: string[]
): boolean {
  // Must be an exact match for OAuth security
  return allowedUris.includes(redirectUri);
}

/**
 * Example usage:
 * 
 * // Basic validation
 * isValidHttpUrl('https://example.com') // true
 * isValidHttpUrl('javascript:alert(1)') // false
 * isValidHttpUrl('http://evil.com://good.com') // false
 * 
 * // Production URL validation (no http, no localhost)
 * isValidHttpUrl('http://localhost:3000', { 
 *   allowHttp: false, 
 *   allowLocalhost: false 
 * }) // false
 * 
 * // Whitelist validation
 * isWhitelistedUrl('https://api.example.com', ['*.example.com']) // true
 * isWhitelistedUrl('https://evil.com', ['example.com']) // false
 * 
 * // OAuth redirect validation
 * isValidOAuthRedirect(
 *   'http://localhost:5000/api/v1/auth/google/callback',
 *   ['http://localhost:5000/api/v1/auth/google/callback']
 * ) // true
 */
