import React from 'react';
import { motion } from 'framer-motion';
import './TrafficWidget.css';

const TrafficWidget = ({ data }) => {
  const getCongestionColor = (level) => {
    if (level < 40) return '#00ff88';
    if (level < 70) return '#ffd700';
    return '#ff4757';
  };

  return (
    <motion.div
      className="traffic-widget"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="widget-header">
        <span className="widget-icon">🚦</span>
        <h3 className="widget-title">Traffic Congestion</h3>
      </div>

      <div className="traffic-main">
        <div className="congestion-meter">
          <svg viewBox="0 0 200 120" className="meter-svg">
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(99, 102, 241, 0.2)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={getCongestionColor(data.congestionLevel)}
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * data.congestionLevel) / 100 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="meter-value">
            <span className="value-number">{data.congestionLevel}%</span>
            <span className="value-label">Congestion</span>
          </div>
        </div>
      </div>

      <div className="traffic-stats">
        <div className="stat-item">
          <span className="stat-label">Avg Speed</span>
          <span className="stat-value">{data.avgSpeed} km/h</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Incidents</span>
          <span className="stat-value">{data.incidents}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TrafficWidget;
