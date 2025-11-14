const API_KEY = import.meta.env.VITE_TRAFFIC_API_KEY;
const BASE_URL = import.meta.env.VITE_TRAFFIC_API_BASE_URL;

// Major city coordinates for traffic data
const CITY_COORDINATES = {
  Mumbai: { lat: 19.0760, lon: 72.8777 },
  Delhi: { lat: 28.7041, lon: 77.1025 },
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  London: { lat: 51.5074, lon: -0.1278 },
  'New York': { lat: 40.7128, lon: -74.0060 },
  Tokyo: { lat: 35.6762, lon: 139.6503 },
  Paris: { lat: 48.8566, lon: 2.3522 }
};

/**
 * Get traffic flow data for a city (REAL-TIME from TomTom API)
 * @param {string} city - City name
 * @returns {Promise<Object>} Traffic data
 */
export const getTrafficFlow = async (city) => {
  const coords = CITY_COORDINATES[city];
  
  if (!coords) {
    throw new Error(`Traffic data not available for ${city}. Try: Mumbai, Delhi, Bangalore, Kolkata, London`);
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
    
    return {
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
  const coords = CITY_COORDINATES[city];
  
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
