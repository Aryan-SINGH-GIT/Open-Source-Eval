import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureCard from '../../components/FeatureCard/FeatureCard';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';
import AirQualityWidget from '../../components/AirQualityWidget/AirQualityWidget';
import TrafficWidget from '../../components/TrafficWidget/TrafficWidget';
import EnergyWidget from '../../components/EnergyWidget/EnergyWidget';
import WasteWidget from '../../components/WasteWidget/WasteWidget';
import DataVisualization from '../DataVisualization/DataVisualization';
import { airQualityAPI, energyAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper function to get AQI status from AQI value
  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Helper function to transform energy API data to widget format
  const transformEnergyData = (energyData) => {
    // Convert GWh/year to MW (average power)
    // Formula: 1 GWh/year = 1,000,000 kWh/year
    // Average power = 1,000,000 kWh / 8,760 hours = 114.16 kW = 0.11416 MW
    // So: MW = GWh/year × 0.11416
    // The API returns cityConsumption in GWh per year
    let consumptionMW = 1200; // Default fallback
    
    if (energyData.cityConsumption) {
      // Convert GWh/year to MW: (GWh/year × 1,000,000 kWh/GWh) / (8,760 hours/year) = GWh/year × 0.11416
      consumptionMW = Math.round(energyData.cityConsumption * 0.11416);
    } else if (energyData.totalConsumption) {
      consumptionMW = Math.round(energyData.totalConsumption * 0.11416);
    }

    // Renewable percentage - not available from API, use estimated value based on Indian average
    const renewablePercentage = 35 + Math.floor(Math.random() * 15); // 35-50% range
    
    // Peak load - estimate as 1.2x of current consumption
    const peakLoad = Math.round(consumptionMW * 1.2);

    return {
      usage: consumptionMW,
      renewable: renewablePercentage,
      peak: peakLoad
    };
  };

  const features = [
    {
      icon: '🌤️',
      title: 'Weather Conditions',
      description: 'Real-time weather monitoring with temperature, humidity, and forecasts for better city planning.'
    },
    {
      icon: '🌿',
      title: 'Air Quality',
      description: 'Track air quality index (AQI) and pollution levels to ensure healthy living conditions.'
    },
    {
      icon: '🚦',
      title: 'Traffic Congestion',
      description: 'Monitor traffic flow and congestion patterns to optimize transportation infrastructure.'
    },
    {
      icon: '⚡',
      title: 'Energy Usage',
      description: 'Analyze energy consumption patterns and promote sustainable power management.'
    },
    {
      icon: '♻️',
      title: 'Waste Management',
      description: 'Track waste collection, recycling rates, and optimize disposal systems.'
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setLoading(true);
      try {
        // Import the weather, traffic, and waste APIs
        const { getCurrentWeather } = await import('../../services/weatherAPI');
        const { getTrafficFlow, getTrafficIncidents, getFallbackTrafficData } = await import('../../services/trafficAPI');
        const { getWasteData } = await import('../../services/wasteAPI');

        // Fetch all data in parallel for better performance
        const [weatherData, airQualityData, trafficDataResult, trafficIncidentsResult] = await Promise.allSettled([
          getCurrentWeather(searchCity),
          airQualityAPI.getAirQualityByCity(searchCity),
          getTrafficFlow(searchCity).catch(() => null),
          getTrafficIncidents(searchCity).catch(() => null)
        ]);

        // Extract weather data
        let weather = null;
        if (weatherData.status === 'fulfilled') {
          weather = {
            temp: weatherData.value.temperature,
            condition: weatherData.value.description,
            humidity: weatherData.value.humidity,
            windSpeed: weatherData.value.windSpeed,
            feelsLike: weatherData.value.feelsLike,
            pressure: weatherData.value.pressure
          };
        } else {
          throw new Error('Failed to fetch weather data');
        }

        // Extract air quality data
        let airQuality = null;
        let stateName = null;
        if (airQualityData.status === 'fulfilled') {
          const aqData = airQualityData.value;
          airQuality = {
            aqi: aqData.aqi || 0,
            status: getAQIStatus(aqData.aqi || 0),
            pm25: aqData.pollutants?.find(p => p.code === 'PM2.5')?.value || 0,
            pm10: aqData.pollutants?.find(p => p.code === 'PM10')?.value || 0
          };
          // Extract state name from location for energy API
          stateName = aqData.location?.admin1 || null;
        } else {
          console.warn('Air quality data not available, using fallback');
          airQuality = {
            aqi: 50,
            status: 'Moderate',
            pm25: 20,
            pm10: 30
          };
        }

        // Extract traffic data
        let traffic = null;
        let trafficData = null;
        let incidentsCount = 0;

        // Get traffic flow data (real API or fallback)
        if (trafficDataResult.status === 'fulfilled' && trafficDataResult.value) {
          trafficData = trafficDataResult.value;
        } else {
          console.warn('Traffic API not available, using city-specific fallback data');
          trafficData = getFallbackTrafficData(searchCity);
        }

        // Get traffic incidents count
        if (trafficIncidentsResult.status === 'fulfilled' && trafficIncidentsResult.value) {
          incidentsCount = trafficIncidentsResult.value.incidentCount || 0;
        } else if (trafficData.isFallback && trafficData.incidents !== undefined) {
          // Use fallback incidents from the pattern
          incidentsCount = trafficData.incidents;
        } else {
          // Default fallback
          incidentsCount = 5;
        }

        // Calculate congestion level correctly
        // Congestion = 100 - (currentSpeed / freeFlowSpeed) * 100
        // When speed is low, congestion is high
        let congestionLevel = 50; // Default
        if (trafficData.freeFlowSpeed > 0 && trafficData.currentSpeed > 0) {
          const speedRatio = trafficData.currentSpeed / trafficData.freeFlowSpeed;
          // Congestion is inverse of speed ratio
          congestionLevel = Math.round((1 - speedRatio) * 100);
          // Clamp between 0 and 100
          congestionLevel = Math.max(0, Math.min(100, congestionLevel));
        }

        traffic = {
          congestionLevel,
          avgSpeed: trafficData.currentSpeed || 30,
          incidents: incidentsCount,
          freeFlowSpeed: trafficData.freeFlowSpeed || 55,
          delay: trafficData.currentTravelTime && trafficData.freeFlowTravelTime
            ? Math.round((trafficData.currentTravelTime - trafficData.freeFlowTravelTime) / 60)
            : 0
        };

        // Fetch energy data using state name from air quality location
        let energy = null;
        try {
          // Map common city names to their states for better matching
          const cityToStateMap = {
            'Delhi': 'Delhi',
            'New Delhi': 'Delhi',
            'Mumbai': 'Maharashtra',
            'Bombay': 'Maharashtra',
            'Bangalore': 'Karnataka',
            'Bengaluru': 'Karnataka',
            'Hyderabad': 'Telangana',
            'Chennai': 'Tamil Nadu',
            'Madras': 'Tamil Nadu',
            'Kolkata': 'West Bengal',
            'Calcutta': 'West Bengal',
            'Pune': 'Maharashtra',
            'Ahmedabad': 'Gujarat',
            'Jaipur': 'Rajasthan',
            'Surat': 'Gujarat',
            'Lucknow': 'Uttar Pradesh',
            'Kanpur': 'Uttar Pradesh',
            'Nagpur': 'Maharashtra',
            'Indore': 'Madhya Pradesh',
            'Thane': 'Maharashtra',
            'Bhopal': 'Madhya Pradesh',
            'Visakhapatnam': 'Andhra Pradesh',
            'Patna': 'Bihar',
            'Vadodara': 'Gujarat',
            'Ghaziabad': 'Uttar Pradesh',
            'Ludhiana': 'Punjab',
            'Agra': 'Uttar Pradesh',
            'Nashik': 'Maharashtra',
            'Faridabad': 'Haryana',
            'Meerut': 'Uttar Pradesh',
            'Rajkot': 'Gujarat',
            'Varanasi': 'Uttar Pradesh',
            'Srinagar': 'Jammu and Kashmir',
            'Amritsar': 'Punjab',
            'Chandigarh': 'Chandigarh'
          };

          // Try to get state name from map first, then from air quality data
          const mappedState = cityToStateMap[searchCity] || cityToStateMap[searchCity.charAt(0).toUpperCase() + searchCity.slice(1).toLowerCase()];
          const finalStateName = mappedState || stateName || searchCity;

          console.log('Energy API - City:', searchCity, 'State:', finalStateName);
          const energyData = await energyAPI.getEnergyDataByCity(searchCity, finalStateName);
          console.log('Energy API Response:', energyData);
          energy = transformEnergyData(energyData);
          console.log('Transformed Energy Data:', energy);
        } catch (error) {
          console.warn('Energy data not available, using fallback:', error);
          energy = {
            usage: 1200,
            renewable: 40,
            peak: 1500
          };
        }

        // Fetch real waste management data
        let wasteData;
        try {
          wasteData = await getWasteData(searchCity);
        } catch (error) {
          console.warn('Waste data not available for this city, using mock data');
          wasteData = {
            collectedToday: 450 + Math.floor(Math.random() * 100),
            recyclingRate: 30 + Math.floor(Math.random() * 15),
            nextCollection: 'Tomorrow, 6:00 AM'
          };
        }

        setSelectedCity(searchCity);
        setCityData({
          cityName: searchCity,
          weather,
          airQuality,
          traffic,
          energy,
          waste: {
            collected: wasteData.collectedToday || 450,
            recycled: wasteData.recyclingRate || 30,
            nextCollection: wasteData.nextCollection || 'Tomorrow, 6:00 AM',
            binFillLevel: wasteData.binFillLevel || 65,
            dailyTarget: wasteData.dailyTarget || 10000,
            collectionProgress: wasteData.collectionProgress || 75,
            collectionStatus: wasteData.collectionStatus || 'Collection in progress'
          }
        });
      } catch (error) {
        console.error('Error fetching city data:', error);
        alert(`Failed to fetch data for ${searchCity}. Please check the city name and try again.`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchCity('');
    setSelectedCity(null);
    setCityData(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className="dashboard-header" variants={itemVariants}>
        <div className="header-content">
          <h1 className="dashboard-title">Smart City Dashboard</h1>
          <p className="dashboard-subtitle">Monitor and analyze city data in real-time</p>
        </div>
      </motion.header>

      <motion.div className="search-section" variants={itemVariants}>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search for a city... (e.g., New York, London, Tokyo)"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            {selectedCity && (
              <button
                type="button"
                className="clear-btn"
                onClick={handleClearSearch}
              >
                ✕
              </button>
            )}
          </div>
          <motion.button
            type="submit"
            className="search-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </motion.button>
        </form>
        {selectedCity && (
          <motion.div
            className="selected-city-badge"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            📍 Showing data for: <strong>{selectedCity}</strong>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedCity ? (
          <motion.div
            key="features"
            className="features-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Available Features
            </motion.h2>
            <motion.p className="section-description" variants={itemVariants}>
              Search for a city to view real-time data and insights
            </motion.p>
            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="data"
            className="data-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="widgets-grid">
              <motion.div variants={itemVariants}>
                <WeatherWidget weather={cityData.weather} cityName={selectedCity} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <AirQualityWidget data={cityData.airQuality} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <TrafficWidget data={cityData.traffic} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <EnergyWidget data={cityData.energy} />
              </motion.div>
              <motion.div variants={itemVariants}>
                <WasteWidget data={cityData.waste} />
              </motion.div>
            </div>

            {/* Data Visualization Section */}
            <motion.div variants={itemVariants}>
              <DataVisualization cityData={cityData} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
