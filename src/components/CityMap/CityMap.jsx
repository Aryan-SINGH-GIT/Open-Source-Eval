import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import './CityMap.css';

const Building = ({ position, height, color }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial
        color={hovered ? '#00d9ff' : color}
        emissive={hovered ? '#00d9ff' : color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
    </mesh>
  );
};

const CityScene = () => {
  const buildings = [];
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    const height = Math.random() * 3 + 1;
    const color = ['#0066ff', '#00d9ff', '#9d4edd'][Math.floor(Math.random() * 3)];
    buildings.push({ position: [x, height / 2, z], height, color });
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[15, 15, 15]} />
      <OrbitControls enableZoom={true} enablePan={true} />

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d9ff" />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#9d4edd" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0a0e27"
          emissive="#00d9ff"
          emissiveIntensity={0.1}
        />
      </mesh>

      {buildings.map((building, i) => (
        <Building key={i} {...building} />
      ))}
    </>
  );
};

const CityMap = () => {
  const [activeLayer, setActiveLayer] = useState('3d');

  return (
    <motion.div
      className="city-map-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="map-header">
        <h2 className="map-title">City Overview</h2>
        <div className="map-controls">
          <button
            className={`map-btn ${activeLayer === '3d' ? 'active' : ''}`}
            onClick={() => setActiveLayer('3d')}
          >
            3D View
          </button>
          <button
            className={`map-btn ${activeLayer === 'heat' ? 'active' : ''}`}
            onClick={() => setActiveLayer('heat')}
          >
            Heat Map
          </button>
        </div>
      </div>

      <div className="map-canvas">
        <Canvas>
          <CityScene />
        </Canvas>
      </div>

      <div className="map-pins">
        <div className="pin-item">
          <span className="pin-dot traffic"></span>
          <span>Traffic Alert</span>
        </div>
        <div className="pin-item">
          <span className="pin-dot emergency"></span>
          <span>Emergency</span>
        </div>
        <div className="pin-item">
          <span className="pin-dot energy"></span>
          <span>Energy Hub</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CityMap;
