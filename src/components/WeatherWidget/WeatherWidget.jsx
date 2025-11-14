import React from 'react';
import { motion } from 'framer-motion';
import './WeatherWidget.css';

const WeatherWidget = ({ weather, cityName }) => {
  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Sunny': '🌞'
    };
    return icons[condition] || '🌤️';
  };

  return (
    <motion.div
      className="weather-widget"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="weather-glow"></div>
      <div className="weather-content">
        <div className="widget-header">
          <span className="widget-icon">🌤️</span>
          <h3 className="widget-title">Weather Conditions</h3>
        </div>

        <div className="weather-main">
          <motion.div
            className="weather-icon"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {getWeatherIcon(weather.condition)}
          </motion.div>
          <div className="weather-temp">
            <span className="temp-value">{weather.temp}°</span>
            <span className="temp-unit">C</span>
          </div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">Condition</span>
            <span className="detail-value">{weather.condition}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{weather.humidity}%</span>
          </div>
          {weather.windSpeed && (
            <div className="detail-item">
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{weather.windSpeed} km/h</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
