// City population data (in millions)
const CITY_DATA = {
  Mumbai: { population: 20.4, wastePerPerson: 0.5 },
  Delhi: { population: 30.3, wastePerPerson: 0.6 },
  Bangalore: { population: 12.8, wastePerPerson: 0.45 },
  Kolkata: { population: 14.9, wastePerPerson: 0.5 },
  London: { population: 9.0, wastePerPerson: 1.2 },
  'New York': { population: 8.3, wastePerPerson: 1.8 },
  Tokyo: { population: 14.0, wastePerPerson: 0.8 },
  Paris: { population: 2.2, wastePerPerson: 1.1 }
};

/**
 * Calculate waste data based on current time and city
 * @param {string} city - City name
 * @returns {Object} Waste management data
 */
const calculateWasteData = (city) => {
  const cityInfo = CITY_DATA[city] || { population: 10, wastePerPerson: 0.5 };
  
  // Get current time
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Calculate base daily waste (in tons)
  // Population is in thousands, wastePerPerson is in kg/day
  // Formula: (population in thousands × 1000 people × wastePerPerson kg) / 1000 = tons
  const dailyWaste = cityInfo.population * cityInfo.wastePerPerson; // tons
  
  // Time-based collection progress
  let collectionProgress = 0;
  let binFillLevel = 0;
  let collectionStatus = '';
  
  if (hour >= 0 && hour < 6) {
    // Night: 95-100% collected, bins recently emptied
    collectionProgress = 0.95 + (hour / 6) * 0.05;
    binFillLevel = 20 + Math.random() * 15;
    collectionStatus = 'Night collection completed';
  } else if (hour >= 6 && hour < 12) {
    // Morning: 25-50% collected, bins filling up
    collectionProgress = 0.25 + ((hour - 6) / 6) * 0.25;
    binFillLevel = 35 + ((hour - 6) / 6) * 30;
    collectionStatus = 'Morning collection in progress';
  } else if (hour >= 12 && hour < 18) {
    // Afternoon: 50-75% collected
    collectionProgress = 0.50 + ((hour - 12) / 6) * 0.25;
    binFillLevel = 65 + ((hour - 12) / 6) * 20;
    collectionStatus = 'Afternoon collection active';
  } else {
    // Evening: 75-95% collected, peak waste time
    collectionProgress = 0.75 + ((hour - 18) / 6) * 0.20;
    binFillLevel = 85 + Math.random() * 10;
    collectionStatus = 'Peak waste generation time';
  }
  
  // Weekend adjustment (more waste on weekends)
  const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.15 : 1.0;
  
  // Calculate collected waste
  const collectedToday = Math.round(dailyWaste * collectionProgress * weekendMultiplier);
  
  // Recycling rate (varies by city development)
  const baseRecyclingRate = cityInfo.wastePerPerson > 1.0 ? 35 : 25; // Developed cities recycle more
  const recyclingRate = baseRecyclingRate + Math.floor(Math.random() * 10);
  const recycledAmount = Math.round(collectedToday * (recyclingRate / 100));
  
  // Calculate next collection time
  const nextCollection = new Date();
  if (hour >= 18) {
    nextCollection.setDate(nextCollection.getDate() + 1);
    nextCollection.setHours(6, 0, 0, 0);
  } else if (hour < 6) {
    nextCollection.setHours(6, 0, 0, 0);
  } else {
    nextCollection.setHours(18, 0, 0, 0);
  }
  
  return {
    collectedToday,
    recycledAmount,
    recyclingRate,
    binFillLevel: Math.round(binFillLevel),
    dailyTarget: Math.round(dailyWaste * weekendMultiplier),
    collectionProgress: Math.round(collectionProgress * 100),
    collectionStatus,
    nextCollection: nextCollection.toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    timestamp: now.toISOString()
  };
};

/**
 * Get waste management data for a city
 * @param {string} city - City name
 * @returns {Promise<Object>} Waste data
 */
export const getWasteData = async (city) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!CITY_DATA[city]) {
    throw new Error(`Waste data not available for ${city}. Try: Mumbai, Delhi, Bangalore, Kolkata, London`);
  }
  
  const wasteData = calculateWasteData(city);
  
  console.log('♻️ Waste Management Data for', city, ':', wasteData);
  
  return {
    city,
    ...wasteData
  };
};

/**
 * Get waste breakdown by type
 * @param {string} city - City name
 * @returns {Promise<Object>} Waste breakdown
 */
export const getWasteBreakdown = async (city) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const wasteData = calculateWasteData(city);
  
  return {
    organic: Math.round(wasteData.collectedToday * 0.45),
    plastic: Math.round(wasteData.collectedToday * 0.20),
    paper: Math.round(wasteData.collectedToday * 0.15),
    metal: Math.round(wasteData.collectedToday * 0.10),
    glass: Math.round(wasteData.collectedToday * 0.05),
    other: Math.round(wasteData.collectedToday * 0.05)
  };
};

/**
 * Get available cities for waste data
 * @returns {Array<string>} List of cities
 */
export const getAvailableCities = () => {
  return Object.keys(CITY_DATA);
};
