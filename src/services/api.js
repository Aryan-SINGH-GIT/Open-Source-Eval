/**
 * API Layer - Main Export
 * 
 * This file provides a clean interface for UI components.
 * All API logic is in api.services.js
 * Configuration is in api.config.js
 * Utilities are in api.utils.js
 * 
 * As an API developer, you should modify:
 * - api.config.js for endpoints and settings
 * - api.services.js for API call logic
 * - api.utils.js for common utilities
 */

import { airQualityService, energyService } from './api.services.js';

// Re-export services with legacy names for backward compatibility with existing UI
export const airQualityAPI = {
  geocodeCity: airQualityService.geocodeCity,
  getCurrentAirQuality: airQualityService.getCurrentAirQuality,
  getAirQualityByCity: airQualityService.getAirQualityByCity
};

// Energy API - includes business logic for city-level calculations
export const energyAPI = {
  // Get Electrical Energy Sales data (state-wise)
  getEnergySalesData: energyService.getEnergySalesData,

  // Get Per Capita Consumption data
  getPerCapitaConsumption: energyService.getPerCapitaConsumption,

  // Get current energy generation and consumption data (national)
  getEnergyData: async () => {
    try {
      const salesData = await energyService.getEnergySalesData('India');
      const perCapitaData = await energyService.getPerCapitaConsumption('India');
      
      return energyAPI.transformEnergyData({
        sales: salesData,
        perCapita: perCapitaData
      });
    } catch (error) {
      console.error('Energy API Error:', error);
      throw new Error(`Failed to fetch energy data: ${error.message}`);
    }
  },

  // Transform energy data to a consistent format
  transformEnergyData: (data, cityName = null, cityPopulation = null) => {
    if (data && typeof data === 'object') {
      const sales = data.sales || data.salesData || data.energySales || data;
      const perCapita = data.perCapita || data.perCapitaData || data.consumptionPerCapita || {};
      
      // Calculate city-level consumption if city data is provided
      let cityConsumption = null;
      if (cityName && cityPopulation && perCapita.value) {
        // City consumption = per capita consumption (kWh) * city population (in thousands) / 1000
        // Result is in GWh (Gigawatt-hours)
        // Example: 1500 kWh × 11034 (thousands) / 1000 = 16,551 GWh
        cityConsumption = (perCapita.value * cityPopulation) / 1000;
      }

      const stateSales = sales.state || sales.stateName || sales.region || null;
      const totalSales = sales.total || sales.totalSales || sales.energySales || sales.value || null;
      const perCapitaValue = perCapita.value || perCapita.consumption || perCapita.kwh || null;

      return {
        timestamp: data.timestamp || sales.timestamp || perCapita.timestamp || new Date().toISOString(),
        totalGeneration: null,
        totalConsumption: totalSales || cityConsumption,
        cityConsumption: cityConsumption,
        peakDemand: null,
        frequency: null,
        perCapitaConsumption: perCapitaValue,
        stateSales: totalSales,
        stateName: stateSales,
        regions: data.regions || sales.regions || [],
        sourceBreakdown: {},
        lastUpdated: data.lastUpdated || sales.lastUpdated || perCapita.lastUpdated || new Date().toISOString()
      };
    }
    
    return {
      timestamp: new Date().toISOString(),
      totalGeneration: null,
      totalConsumption: null,
      cityConsumption: null,
      peakDemand: null,
      frequency: null,
      perCapitaConsumption: null,
      stateSales: null,
      stateName: null,
      regions: [],
      sourceBreakdown: {},
      lastUpdated: new Date().toISOString()
    };
  },

  // Get energy data by city (using state data + per capita calculation)
  // Optimized: Parallel API calls and fast fallback
  getEnergyDataByCity: async (cityName, stateName) => {
    // Get city population immediately (synchronous, no API call)
    const cityPopulation = energyAPI.getCityPopulation(cityName);
    
    try {
      // OPTIMIZATION: Make API calls in parallel instead of sequentially
      const [salesData, perCapitaData] = await Promise.all([
        energyService.getEnergySalesData(stateName),
        energyService.getPerCapitaConsumption(stateName)
      ]);
      
      const transformedData = energyAPI.transformEnergyData({
        sales: salesData,
        perCapita: perCapitaData
      }, cityName, cityPopulation);
      
      transformedData.isEstimated = salesData.estimated || perCapitaData.estimated || false;
      transformedData.dataSource = salesData.estimated || perCapitaData.estimated 
        ? 'Estimated based on state averages' 
        : 'CEA API';
      
      return transformedData;
    } catch (error) {
      // Fast fallback: Calculate from estimated per capita data
      const perCapitaData = await energyService.getPerCapitaConsumption(stateName);
      
      if (perCapitaData.value && cityPopulation) {
        const cityConsumption = (perCapitaData.value * cityPopulation) / 1000;
        
        return {
          timestamp: new Date().toISOString(),
          totalConsumption: cityConsumption,
          cityConsumption: cityConsumption,
          perCapitaConsumption: perCapitaData.value,
          stateName: stateName,
          isEstimated: true,
          dataSource: 'Estimated calculation',
          lastUpdated: new Date().toISOString()
        };
      }
      
      throw new Error(`Unable to calculate energy data for ${cityName}. ${error.message}`);
    }
  },

  // Get approximate city population (for calculation)
  getCityPopulation: (cityName) => {
    const cityPopulations = {
      'Mumbai': 12478, 'Delhi': 11034, 'Bangalore': 8443, 'Hyderabad': 6993,
      'Chennai': 7088, 'Kolkata': 4486, 'Pune': 3124, 'Ahmedabad': 5570,
      'Jaipur': 3071, 'Surat': 4467, 'Lucknow': 2815, 'Kanpur': 2767,
      'Nagpur': 2405, 'Indore': 1996, 'Thane': 1841, 'Bhopal': 1798,
      'Visakhapatnam': 1728, 'Patna': 1683, 'Vadodara': 1671, 'Ghaziabad': 1648,
      'Ludhiana': 1618, 'Agra': 1584, 'Nashik': 1486, 'Faridabad': 1404,
      'Meerut': 1305, 'Rajkot': 1286, 'Varanasi': 1198, 'Srinagar': 1180,
      'Amritsar': 1132, 'Chandigarh': 1055,
      // Common variations
      'New Delhi': 11034, 'Bombay': 12478, 'Bengaluru': 8443, 'Madras': 7088,
      'Calcutta': 4486, 'Baroda': 1671
    };
    
    // Try exact match first
    if (cityPopulations[cityName]) {
      return cityPopulations[cityName];
    }
    
    // Try case-insensitive match
    const normalizedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
    if (cityPopulations[normalizedCity]) {
      return cityPopulations[normalizedCity];
    }
    
    // Try finding a match ignoring case
    const cityKey = Object.keys(cityPopulations).find(
      key => key.toLowerCase() === cityName.toLowerCase()
    );
    
    return cityKey ? cityPopulations[cityKey] : 1000;
  }
};
