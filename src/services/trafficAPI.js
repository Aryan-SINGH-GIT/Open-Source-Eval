const API_KEY = import.meta.env.VITE_TRAFFIC_API_KEY;
const BASE_URL = import.meta.env.VITE_TRAFFIC_API_BASE_URL;

// Major city coordinates for traffic data
const CITY_COORDINATES = {
  Mumbai: { lat: 19.0760, lon: 72.8777 },
  Delhi: { lat: 28.7041, lon: 77.1025 },
  'New Delhi': { lat: 28.7041, lon: 77.1025 },
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Calcutta: { lat: 22.5726, lon: 88.3639 },
  London: { lat: 51.5074, lon: -0.1278 },
  'New York': { lat: 40.7128, lon: -74.0060 },
  Tokyo: { lat: 35.6762, lon: 139.6503 },
  Paris: { lat: 48.8566, lon: 2.3522 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Hyderabad: { lat: 17.3850, lon: 78.4867 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Jaipur: { lat: 26.9124, lon: 75.7873 }
};

// Helper function to find city coordinates (case-insensitive)
const getCityCoordinates = (cityName) => {
  // Try exact match first
  if (CITY_COORDINATES[cityName]) {
    return CITY_COORDINATES[cityName];
  }
  
  // Try case-insensitive match
  const normalizedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
  if (CITY_COORDINATES[normalizedCity]) {
    return CITY_COORDINATES[normalizedCity];
  }
  
  // Try finding a match ignoring case
  const cityKey = Object.keys(CITY_COORDINATES).find(
    key => key.toLowerCase() === cityName.toLowerCase()
  );
  
  return cityKey ? CITY_COORDINATES[cityKey] : null;
};

/**
 * Get traffic flow data for a city (REAL-TIME from TomTom API)
 * @param {string} city - City name
 * @returns {Promise<Object>} Traffic data
 */
export const getTrafficFlow = async (city) => {
  const coords = getCityCoordinates(city);
  
  if (!coords) {
    throw new Error(`Traffic data not available for ${city}. Try: Mumbai, Delhi, Bangalore, Kolkata, London, Chennai, Hyderabad`);
  }

  try {
    const { lat, lon } = coords;
    const zoom = 10;
    
    // TomTom Traffic Flow API - REAL-TIME DATA
    const response = await fetch(
      `${BASE_URL}/flowSegmentData/absolute/${zoom}/json?point=${lat},${lon}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Traffic API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ Traffic API Response for', city, ':', data.flowSegmentData);
    
    const trafficData = {
      city,
      currentSpeed: data.flowSegmentData?.currentSpeed || 0,
      freeFlowSpeed: data.flowSegmentData?.freeFlowSpeed || 0,
      currentTravelTime: data.flowSegmentData?.currentTravelTime || 0,
      freeFlowTravelTime: data.flowSegmentData?.freeFlowTravelTime || 0,
      confidence: data.flowSegmentData?.confidence || 0,
      roadClosure: data.flowSegmentData?.roadClosure || false,
      coordinates: { lat, lon },
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 Processed Traffic Data:', trafficData);
    
    return trafficData;
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    throw error;
  }
};

/**
 * Calculate traffic congestion level
 * @param {number} currentSpeed - Current speed
 * @param {number} freeFlowSpeed - Free flow speed
 * @returns {Object} Congestion info
 */
export const calculateCongestion = (currentSpeed, freeFlowSpeed) => {
  if (freeFlowSpeed === 0) {
    return { level: 'Unknown', percentage: 0, color: '#gray' };
  }

  const percentage = Math.round((currentSpeed / freeFlowSpeed) * 100);
  
  if (percentage >= 80) {
    return { level: 'Light', percentage, color: '#4ade80', icon: '🟢' };
  } else if (percentage >= 50) {
    return { level: 'Moderate', percentage, color: '#fbbf24', icon: '🟡' };
  } else if (percentage >= 30) {
    return { level: 'Heavy', percentage, color: '#fb923c', icon: '🟠' };
  } else {
    return { level: 'Severe', percentage, color: '#ef4444', icon: '🔴' };
  }
};

/**
 * Get traffic incidents for a bounding box
 * @param {string} city - City name
 * @returns {Promise<Object>} Traffic incidents
 */
export const getTrafficIncidents = async (city) => {
  const coords = getCityCoordinates(city);
  
  if (!coords) {
    throw new Error(`Traffic data not available for ${city}`);
  }

  try {
    const { lat, lon } = coords;
    const bbox = `${lon - 0.1},${lat - 0.1},${lon + 0.1},${lat + 0.1}`;
    
    const response = await fetch(
      `https://api.tomtom.com/traffic/services/5/incidentDetails?bbox=${bbox}&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Traffic Incidents API Error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      city,
      incidentCount: data.incidents?.length || 0,
      incidents: data.incidents || [],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching traffic incidents:', error);
    throw error;
  }
};

/**
 * Get available cities for traffic data
 * @returns {Array<string>} List of cities
 */
export const getAvailableCities = () => {
  return Object.keys(CITY_COORDINATES);
};

/**
 * Get fallback traffic data for a city (when API is unavailable)
 * @param {string} city - City name
 * @returns {Object} Fallback traffic data
 */
export const getFallbackTrafficData = (city) => {
  // City-specific fallback data (simulated based on typical traffic patterns)
  const cityTrafficPatterns = {
    'Mumbai': { avgSpeed: 25, freeFlowSpeed: 50, congestion: 50, incidents: 8 },
    'Delhi': { avgSpeed: 30, freeFlowSpeed: 60, congestion: 50, incidents: 12 },
    'Bangalore': { avgSpeed: 28, freeFlowSpeed: 55, congestion: 49, incidents: 6 },
    'Bengaluru': { avgSpeed: 28, freeFlowSpeed: 55, congestion: 49, incidents: 6 },
    'Kolkata': { avgSpeed: 22, freeFlowSpeed: 45, congestion: 51, incidents: 5 },
    'Chennai': { avgSpeed: 32, freeFlowSpeed: 60, congestion: 47, incidents: 4 },
    'Hyderabad': { avgSpeed: 35, freeFlowSpeed: 60, congestion: 42, incidents: 3 },
    'Pune': { avgSpeed: 38, freeFlowSpeed: 60, congestion: 37, incidents: 2 },
    'London': { avgSpeed: 20, freeFlowSpeed: 50, congestion: 60, incidents: 15 },
    'New York': { avgSpeed: 18, freeFlowSpeed: 50, congestion: 64, incidents: 20 },
    'Tokyo': { avgSpeed: 15, freeFlowSpeed: 40, congestion: 63, incidents: 10 },
    'Paris': { avgSpeed: 22, freeFlowSpeed: 50, congestion: 56, incidents: 12 }
  };

  const normalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  const pattern = cityTrafficPatterns[city] || cityTrafficPatterns[normalizedCity] || {
    avgSpeed: 30,
    freeFlowSpeed: 55,
    congestion: 45,
    incidents: 5
  };

  return {
    city,
    currentSpeed: pattern.avgSpeed,
    freeFlowSpeed: pattern.freeFlowSpeed,
    currentTravelTime: Math.round((1000 / pattern.avgSpeed) * 60), // Approximate travel time
    freeFlowTravelTime: Math.round((1000 / pattern.freeFlowSpeed) * 60),
    confidence: 0,
    roadClosure: false,
    timestamp: new Date().toISOString(),
    isFallback: true,
    incidents: pattern.incidents // Include incidents in fallback data
  };
};
