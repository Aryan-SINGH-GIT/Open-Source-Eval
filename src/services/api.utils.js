/**
 * API Utility Functions
 * 
 * Common utilities for API calls - error handling, retries, etc.
 * This keeps API logic clean and reusable.
 */

/**
 * Fetch with timeout and CORS error detection
 */
export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      redirect: 'follow' // Follow redirects automatically
    });
    clearTimeout(timeoutId);
    
    // Check for redirect status codes
    if (response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) {
      // If redirected, the fetch API follows it automatically, but we log it
      console.warn(`API redirected: ${url} -> ${response.url}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Detect CORS errors specifically
    if (error.message.includes('CORS') || 
        error.message.includes('Access-Control-Allow-Origin') ||
        error.message.includes('Failed to fetch') ||
        error.name === 'TypeError') {
      const corsError = new Error('CORS_ERROR');
      corsError.message = `CORS policy blocked request to ${url}. The API server does not allow browser requests.`;
      corsError.code = 'CORS_ERROR';
      corsError.originalError = error;
      throw corsError;
    }
    
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

/**
 * Retry fetch with exponential backoff
 * Note: CORS errors are not retried as they will always fail
 */
export const fetchWithRetry = async (
  url,
  options = {},
  maxRetries = 3,
  timeout = 10000
) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout);
      
      // Handle redirects (301, 302, etc.)
      if (response.status >= 300 && response.status < 400) {
        // Fetch API follows redirects automatically, but we check the final status
        if (response.ok) {
          return response;
        }
        throw new Error(`Redirect error: ${response.status} ${response.statusText}`);
      }
      
      if (response.ok) {
        return response;
      }
      
      // If 4xx error, don't retry
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status} ${response.statusText}`);
      }
      
      // Server errors (5xx) can be retried
      lastError = new Error(`Server error: ${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
      
      // Don't retry CORS errors - they will always fail
      if (error.code === 'CORS_ERROR' || error.message.includes('CORS')) {
        throw error; // Immediately throw CORS errors
      }
      
      // Don't retry client errors (4xx)
      if (error.message.includes('Client error')) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        // Exponential backoff: wait 2^attempt seconds
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Handle API errors consistently
 */
export const handleAPIError = (error, context = 'API') => {
  // CORS errors
  if (error.code === 'CORS_ERROR' || 
      error.message.includes('CORS') || 
      error.message.includes('Access-Control-Allow-Origin') ||
      error.message.includes('Failed to fetch')) {
    return {
      error: 'CORS error',
      message: `The ${context} API does not allow browser requests due to CORS policy. ` +
               `This is expected for CEA APIs. The app will use estimated data instead.`,
      code: 'CORS_ERROR',
      canUseFallback: true
    };
  }
  
  // Redirect errors
  if (error.message.includes('Redirect error') || error.message.includes('301') || error.message.includes('302')) {
    return {
      error: 'Redirect error',
      message: `The ${context} API endpoint has been moved. Please update the endpoint URL.`,
      code: 'REDIRECT_ERROR',
      canUseFallback: true
    };
  }
  
  // Timeout errors
  if (error.message.includes('timeout')) {
    return {
      error: 'Timeout error',
      message: 'API request timed out. Please try again.',
      code: 'TIMEOUT_ERROR',
      canUseFallback: true
    };
  }
  
  // Network errors
  if (error.message.includes('Network') || error.message.includes('network')) {
    return {
      error: 'Network error',
      message: 'Unable to connect to API. Check your internet connection.',
      code: 'NETWORK_ERROR',
      canUseFallback: true
    };
  }
  
  return {
    error: 'API error',
    message: error.message || 'An unexpected error occurred',
    code: 'API_ERROR',
    canUseFallback: true,
    originalError: error
  };
};

/**
 * Validate API response structure
 */
export const validateResponse = (data, expectedFormat) => {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid response format' };
  }
  
  // Basic validation - can be extended
  for (const key in expectedFormat) {
    if (expectedFormat[key] === 'number' && typeof data[key] !== 'number') {
      return { valid: false, error: `Missing or invalid ${key}` };
    }
  }
  
  return { valid: true };
};

