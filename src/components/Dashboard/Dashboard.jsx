import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureCard from '../../components/FeatureCard/FeatureCard';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';
import AirQualityWidget from '../../components/AirQualityWidget/AirQualityWidget';
import TrafficWidget from '../../components/TrafficWidget/TrafficWidget';
import EnergyWidget from '../../components/EnergyWidget/EnergyWidget';
import WasteWidget from '../../components/WasteWidget/WasteWidget';
import './Dashboard.css';

const Dashboard = () => {
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setLoading(true);
      // Simulate API call - Replace with actual API call later
      setTimeout(() => {
        setSelectedCity(searchCity);
        // Mock API response
        setCityData({
          cityName: searchCity,
          weather: {
            temp: 22 + Math.floor(Math.random() * 10),
            condition: ['Clear', 'Cloudy', 'Rainy', 'Sunny'][Math.floor(Math.random() * 4)],
            humidity: 60 + Math.floor(Math.random() * 20),
            windSpeed: 10 + Math.floor(Math.random() * 15)
          },
          airQuality: {
            aqi: 30 + Math.floor(Math.random() * 70),
            status: 'Good',
            pm25: 15 + Math.floor(Math.random() * 20),
            pm10: 25 + Math.floor(Math.random() * 30)
          },
          traffic: {
            congestionLevel: 40 + Math.floor(Math.random() * 40),
            avgSpeed: 35 + Math.floor(Math.random() * 25),
            incidents: Math.floor(Math.random() * 5)
          },
          energy: {
            usage: 1200 + Math.floor(Math.random() * 300),
            renewable: 35 + Math.floor(Math.random() * 20),
            peak: 1500 + Math.floor(Math.random() * 200)
          },
          waste: {
            collected: 450 + Math.floor(Math.random() * 100),
            recycled: 30 + Math.floor(Math.random() * 15),
            nextCollection: 'Tomorrow, 6:00 AM'
          }
        });
        setLoading(false);
      }, 1000);
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
