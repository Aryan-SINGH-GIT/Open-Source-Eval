import React from 'react';
import { motion } from 'framer-motion';
import './AirQualityWidget.css';

const AirQualityWidget = ({ data }) => {
  const getQualityColor = (aqi) => {
    if (aqi <= 50) return '#00ff88';
    if (aqi <= 100) return '#ffd700';
    if (aqi <= 150) return '#ff9500';
    return '#ff4757';
  };

  const percentage = Math.min((data.aqi / 200) * 100, 100);

  return (
    <motion.div
      className="air-quality-widget"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="air-quality-content">
        <div className="widget-header">
          <span className="widget-icon">🌿</span>
          <h3 className="widget-title">Air Quality Index</h3>
        </div>

        <div className="aqi-display">
          <motion.div
            className="aqi-circle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg viewBox="0 0 100 100" className="aqi-svg">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(0, 217, 255, 0.1)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getQualityColor(data.aqi)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - percentage / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div className="aqi-value">
              <span className="aqi-number">{data.aqi}</span>
              <span className="aqi-label">AQI</span>
            </div>
          </motion.div>
        </div>

        <div className="aqi-status" style={{ color: getQualityColor(data.aqi) }}>
          <span className="status-dot" style={{ background: getQualityColor(data.aqi) }}></span>
          {data.status}
        </div>
      </div>
    </motion.div>
  );
};

export default AirQualityWidget;
