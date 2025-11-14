/**
 * API Services
 * 
 * Clean API service layer - all API calls are defined here.
 * As an API developer, you can modify endpoints and logic here without touching UI code.
 */

import { API_CONFIG } from './api.config.js';
import { fetchWithRetry, handleAPIError } from './api.utils.js';

/**
 * Air Quality API Service
 */
export const airQualityService = {
  /**
   * Geocode city name to get coordinates
   * @param {string} cityName - Name of the city
   * @param {string} country - Country name (default: 'India')
   * @returns {Promise<Object>} Location data with lat/lng
   */
  geocodeCity: async (cityName, country = 'India') => {
    try {
      const params = new URLSearchParams({
        name: `${cityName}, ${country}`,
        count: '1',
        language: 'en',
        format: 'json'
      });

      const url = `${API_CONFIG.AIR_QUALITY.GEOCODING_URL}?${params.toString()}`;
      
      const response = await fetchWithRetry(
        url,
        {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        },
        API_CONFIG.AIR_QUALITY.RETRY_ATTEMPTS,
        API_CONFIG.AIR_QUALITY.TIMEOUT
      );

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`City "${cityName}" not found`);
      }

      const location = data.results[0];
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        country: location.country,
        admin1: location.admin1 || ''
      };
    } catch (error) {
      const apiError = handleAPIError(error, 'Geocoding');
      throw new Error(apiError.message);
    }
  },

  /**
   * Get current air quality for coordinates
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<Object>} Air quality data
   */
  getCurrentAirQuality: async (latitude, longitude) => {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: ['us_aqi', 'pm10', 'pm2_5', 'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone', 'dust'].join(','),
        timezone: 'auto'
      });

      const url = `${API_CONFIG.AIR_QUALITY.BASE_URL}?${params.toString()}`;
      
      const response = await fetchWithRetry(
        url,
        {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        },
        API_CONFIG.AIR_QUALITY.RETRY_ATTEMPTS,
        API_CONFIG.AIR_QUALITY.TIMEOUT
      );

      const data = await response.json();
      
      if (!data.current) {
        throw new Error('No air quality data available');
      }

      return {
        aqi: data.current.us_aqi,
        timestamp: data.current.time,
        pollutants: [
          { code: 'PM2.5', value: data.current.pm2_5, units: 'μg/m³' },
          { code: 'PM10', value: data.current.pm10, units: 'μg/m³' },
          { code: 'O₃', value: data.current.ozone, units: 'μg/m³' },
          { code: 'NO₂', value: data.current.nitrogen_dioxide, units: 'μg/m³' },
          { code: 'SO₂', value: data.current.sulphur_dioxide, units: 'μg/m³' },
          { code: 'CO', value: data.current.carbon_monoxide, units: 'μg/m³' },
          { code: 'Dust', value: data.current.dust, units: 'μg/m³' }
        ].filter(p => p.value !== null && p.value !== undefined)
      };
    } catch (error) {
      const apiError = handleAPIError(error, 'Air Quality');
      throw new Error(apiError.message);
    }
  },

  /**
   * Get air quality by city name (convenience method)
   * @param {string} cityName - Name of the city
   * @returns {Promise<Object>} Air quality data with location
   */
  getAirQualityByCity: async (cityName) => {
    const location = await airQualityService.geocodeCity(cityName);
    const airQuality = await airQualityService.getCurrentAirQuality(location.latitude, location.longitude);
    
    return {
      ...airQuality,
      location: {
        name: location.name,
        country: location.country,
        admin1: location.admin1,
        latitude: location.latitude,
        longitude: location.longitude
      }
    };
  }
};

/**
 * Energy API Service
 */

// State per capita consumption data (kWh per year) - cached for fast access
const STATE_PER_CAPITA_DATA = {
  'Maharashtra': 1200, 'Delhi': 1500, 'Karnataka': 1100, 'Telangana': 1000,
  'Tamil Nadu': 1300, 'West Bengal': 900, 'Gujarat': 1400, 'Rajasthan': 800,
  'Uttar Pradesh': 700, 'Madhya Pradesh': 750, 'Andhra Pradesh': 950, 'Bihar': 600,
  'Punjab': 1100, 'Haryana': 1200, 'Jammu and Kashmir': 700, 'Chandigarh': 1500
};

export const energyService = {
  /**
   * Get Electrical Energy Sales data for a state
   * @param {string} stateName - Name of the state
   * @returns {Promise<Object>} Energy sales data
   */
  getEnergySalesData: async (stateName) => {
    // Fast path: Skip API attempts if fast fail is enabled (CEA APIs always CORS block)
    if (API_CONFIG.ENERGY.FAST_FAIL && API_CONFIG.ENERGY.FALLBACK_ENABLED) {
      return {
        state: stateName,
        estimated: true,
        message: 'Using estimated data - CEA API blocked by CORS policy (expected behavior)'
      };
    }

    // Try only the most likely endpoint (optimization: don't try all 3)
    const endpoint = `${API_CONFIG.ENERGY.BASE_URL}${API_CONFIG.ENERGY.ENDPOINTS.ENERGY_SALES}?state=${encodeURIComponent(stateName)}`;
    
    try {
      const response = await fetchWithRetry(
        endpoint,
        {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'cors',
          credentials: 'omit'
        },
        API_CONFIG.ENERGY.RETRY_ATTEMPTS,
        API_CONFIG.ENERGY.TIMEOUT
      );

      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          return data;
        }
      }
    } catch (err) {
      // CORS errors are expected - fail fast
      if (err.code === 'CORS_ERROR' || 
          err.message.includes('CORS') || 
          err.message.includes('Failed to fetch') ||
          err.message.includes('Access-Control-Allow-Origin')) {
        // Immediately return fallback instead of trying more endpoints
        if (API_CONFIG.ENERGY.FALLBACK_ENABLED) {
          return {
            state: stateName,
            estimated: true,
            message: 'Using estimated data - CEA API blocked by CORS policy'
          };
        }
      }
    }

    // Return estimated structure if API fails
    if (API_CONFIG.ENERGY.FALLBACK_ENABLED) {
      return {
        state: stateName,
        estimated: true,
        message: 'Using estimated data - CEA API not accessible'
      };
    }
    
    throw new Error('Electrical Energy Sales API not accessible');
  },

  /**
   * Get Per Capita Consumption data for a state
   * Optimized: Returns cached/estimated data immediately if fast fail is enabled
   * @param {string} stateName - Name of the state
   * @returns {Promise<Object>} Per capita consumption data
   */
  getPerCapitaConsumption: async (stateName) => {
    // Fast path: Return estimated data immediately (CEA APIs always CORS block)
    // This makes the app load instantly instead of waiting for failed API calls
    if (API_CONFIG.ENERGY.FAST_FAIL && API_CONFIG.ENERGY.FALLBACK_ENABLED) {
      return {
        value: STATE_PER_CAPITA_DATA[stateName] || 1000,
        state: stateName,
        estimated: true,
        unit: 'kWh'
      };
    }

    // Try only the most likely endpoint (optimization)
    const endpoint = `${API_CONFIG.ENERGY.BASE_URL}${API_CONFIG.ENERGY.ENDPOINTS.PER_CAPITA_CONSUMPTION}?state=${encodeURIComponent(stateName)}`;
    
    try {
      const response = await fetchWithRetry(
        endpoint,
        {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          mode: 'cors',
          credentials: 'omit'
        },
        API_CONFIG.ENERGY.RETRY_ATTEMPTS,
        API_CONFIG.ENERGY.TIMEOUT
      );

      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          return data;
        }
      }
    } catch (err) {
      // CORS errors are expected - fail fast to fallback
      if (err.code === 'CORS_ERROR' || 
          err.message.includes('CORS') || 
          err.message.includes('Failed to fetch') ||
          err.message.includes('Access-Control-Allow-Origin')) {
        // Immediately return fallback
        if (API_CONFIG.ENERGY.FALLBACK_ENABLED) {
          return {
            value: STATE_PER_CAPITA_DATA[stateName] || 1000,
            state: stateName,
            estimated: true,
            unit: 'kWh'
          };
        }
      }
    }

    // Fallback to estimated per capita values
    if (API_CONFIG.ENERGY.FALLBACK_ENABLED) {
      return {
        value: STATE_PER_CAPITA_DATA[stateName] || 1000,
        state: stateName,
        estimated: true,
        unit: 'kWh'
      };
    }
    
    throw new Error('Per Capita Consumption API not accessible');
  }
};

