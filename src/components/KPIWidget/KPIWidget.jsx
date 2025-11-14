import React from 'react';
import { motion } from 'framer-motion';
import './KPIWidget.css';

const KPIWidget = ({ title, value, icon, trend, color }) => {
  return (
    <motion.div
      className={`kpi-widget kpi-${color}`}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="kpi-glow"></div>
      <div className="kpi-content">
        <div className="kpi-header">
          <span className="kpi-icon">{icon}</span>
          <span className={`kpi-trend ${trend.startsWith('+') ? 'positive' : 'negative'}`}>
            {trend}
          </span>
        </div>
        <h3 className="kpi-title">{title}</h3>
        <motion.div
          className="kpi-value"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {value}
        </motion.div>
      </div>
      <div className="kpi-border"></div>
    </motion.div>
  );
};

export default KPIWidget;
