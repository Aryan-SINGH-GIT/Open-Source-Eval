import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChartJsWidget from '../Charts/ChartJsWidget';
import PlotlyWidget from '../Charts/PlotlyWidget';
import D3Widget from '../Charts/D3Widget';
import './DataVisualization.css';

const DataVisualization = ({ cityData }) => {
  const [activeTab, setActiveTab] = useState('chartjs');

  const tabs = [
    { id: 'chartjs', label: 'Simple Chart', icon: '📊' },
    { id: 'plotly', label: 'Plot', icon: '📈' },
    { id: 'd3', label: 'Data Visualization', icon: '🎨' },
    { id: 'all', label: 'All Charts', icon: '📉' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chartjs':
        return <ChartJsWidget cityData={cityData} />;
      case 'plotly':
        return <PlotlyWidget cityData={cityData} />;
      case 'd3':
        return <D3Widget cityData={cityData} />;
      case 'all':
        return (
          <>
            <ChartJsWidget cityData={cityData} />
            <PlotlyWidget cityData={cityData} />
            <D3Widget cityData={cityData} />
          </>
        );
      default:
        return <ChartJsWidget cityData={cityData} />;
    }
  };

  return (
    <motion.div
      className="data-visualization-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="visualization-header">
        <h2 className="visualization-title">
          📊 Data Visualization Dashboard
        </h2>
        <p className="visualization-subtitle">
          Interactive charts and graphs for comprehensive city data analysis
        </p>
      </div>

      <div className="visualization-tabs">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="visualization-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default DataVisualization;
