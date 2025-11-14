import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import './TrafficChart.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{payload[0].payload.hour}</p>
        <p className="tooltip-value">Flow: {payload[0].value.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const TrafficChart = ({ data }) => {
  return (
    <motion.div
      className="traffic-chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-header">
        <h2 className="chart-title">Traffic Flow Analytics</h2>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot"></span>
            Real-time Flow
          </span>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
            <XAxis
              dataKey="hour"
              stroke="#a0aec0"
              style={{ fontSize: '0.85rem', fontFamily: 'Rajdhani' }}
            />
            <YAxis
              stroke="#a0aec0"
              style={{ fontSize: '0.85rem', fontFamily: 'Rajdhani' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="flow"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorFlow)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default TrafficChart;
