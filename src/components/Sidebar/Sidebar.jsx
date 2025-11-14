import React from 'react';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: '🏙️', label: 'Dashboard', path: '/' },
    { icon: '🚦', label: 'Traffic', path: '/traffic' },
    { icon: '⚡', label: 'Energy', path: '/energy' },
    { icon: '🌤️', label: 'Weather', path: '/weather' },
    { icon: '🚨', label: 'Safety', path: '/safety' },
    { icon: '📊', label: 'Analytics', path: '/analytics' }
  ];

  return (
    <motion.aside
      className={`sidebar ${isOpen ? 'open' : 'closed'}`}
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="sidebar-header">
        <motion.div
          className="logo-container"
          animate={{ scale: isOpen ? 1 : 0.8 }}
        >
          <div className="logo-3d">🌆</div>
          {isOpen && <h2 className="logo-text">SmartCity</h2>}
        </motion.div>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <motion.a
            key={index}
            href={item.path}
            className="nav-item"
            whileHover={{ x: 5, backgroundColor: 'rgba(0, 217, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </motion.a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <motion.div
          className="status-indicator"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="status-dot"></div>
          {isOpen && <span>System Online</span>}
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
