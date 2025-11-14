/**
 * API Configuration File
 * 
 * This file contains all API endpoints and configuration.
 * As an API developer, you only need to modify this file to update endpoints.
 */

export const API_CONFIG = {
  // Air Quality API (Open-Meteo)
  AIR_QUALITY: {
    BASE_URL: 'https://air-quality-api.open-meteo.com/v1/air-quality',
    GEOCODING_URL: 'https://geocoding-api.open-meteo.com/v1/search',
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3
  },

  // Energy API (CEA - Central Electricity Authority)
  // NOTE: CEA APIs block browser requests due to CORS policy.
  // This is expected behavior. The app automatically uses estimated data when CORS blocks occur.
  ENERGY: {
    BASE_URL: 'https://cea.nic.in/api',
    ENDPOINTS: {
      ENERGY_SALES: '/electrical-energy-sales',
      PER_CAPITA_CONSUMPTION: '/per-capita-consumption',
      REALTIME: '/realtime',
      GENERATION: '/generation',
      CONSUMPTION: '/consumption'
    },
    TIMEOUT: 3000, // 3 seconds - fast fail for CORS (reduced from 15s)
    RETRY_ATTEMPTS: 1, // Reduced from 3 - CORS errors won't succeed on retry
    FALLBACK_ENABLED: true, // Use estimated data if API fails (recommended: true for CEA APIs)
    FAST_FAIL: true, // Skip API attempts if we know CORS will block (optimization)
    // CORS_PROXY: 'https://cors-anywhere.herokuapp.com/' // Optional: Uncomment to use CORS proxy
  }
};

/**
 * API Response Formats
 * Define expected response structures for type safety
 */
export const API_RESPONSE_FORMATS = {
  AIR_QUALITY: {
    aqi: 'number',
    timestamp: 'string',
    pollutants: 'array',
    location: 'object'
  },
  ENERGY: {
    totalConsumption: 'number',
    cityConsumption: 'number',
    perCapitaConsumption: 'number',
    stateSales: 'number',
    timestamp: 'string'
  }
};

