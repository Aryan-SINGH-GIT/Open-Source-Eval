import React from 'react';
import { motion } from 'framer-motion';
import './EnergyWidget.css';

const EnergyWidget = ({ data }) => {
  return (
    <motion.div
      className="energy-widget"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="widget-header">
        <span className="widget-icon">⚡</span>
        <h3 className="widget-title">Energy Usage</h3>
      </div>

      <div className="energy-main">
        <div className="energy-display">
          <span className="energy-value">{data.usage}</span>
          <span className="energy-unit">MW</span>
        </div>
        <p className="energy-subtitle">Current Consumption</p>
      </div>

      <div className="energy-stats">
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <div className="stat-content">
            <span className="stat-label">Renewable</span>
            <span className="stat-value">{data.renewable}%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <span className="stat-label">Peak Load</span>
            <span className="stat-value">{data.peak} MW</span>
          </div>
        </div>
      </div>

      <div className="renewable-bar">
        <div className="bar-label">
          <span>Renewable Energy</span>
          <span>{data.renewable}%</span>
        </div>
        <div className="bar-track">
          <motion.div
            className="bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${data.renewable}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EnergyWidget;
