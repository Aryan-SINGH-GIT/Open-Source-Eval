import React from 'react';
import { motion } from 'framer-motion';
import './WasteWidget.css';

const WasteWidget = ({ data }) => {
  return (
    <motion.div
      className="waste-widget"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="widget-header">
        <span className="widget-icon">♻️</span>
        <h3 className="widget-title">Waste Management</h3>
      </div>

      <div className="waste-main">
        <div className="waste-stat-large">
          <span className="waste-value">{data.collected}</span>
          <span className="waste-unit">tons</span>
          <p className="waste-label">Collected Today</p>
        </div>
      </div>

      <div className="waste-grid">
        <div className="waste-card">
          <div className="waste-card-icon">📊</div>
          <div className="waste-card-content">
            <span className="waste-card-value">{data.recycled}%</span>
            <span className="waste-card-label">Recycled</span>
          </div>
        </div>
        <div className="waste-card">
          <div className="waste-card-icon">🚛</div>
          <div className="waste-card-content">
            <span className="waste-card-value">Next</span>
            <span className="waste-card-label">{data.nextCollection}</span>
          </div>
        </div>
      </div>

      <div className="recycling-progress">
        <div className="progress-label">Recycling Rate</div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${data.recycled}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <span className="progress-text">{data.recycled}%</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WasteWidget;
