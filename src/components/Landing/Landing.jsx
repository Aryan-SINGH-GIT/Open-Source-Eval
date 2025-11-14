import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Landing.css';

const AnimatedSphere = ({ position, color, speed }) => {
  return (
    <Sphere args={[1, 100, 200]} position={position} scale={2}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.5}
        speed={speed}
        roughness={0}
      />
    </Sphere>
  );
};

const FloatingScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#a855f7" intensity={2} />
      <AnimatedSphere position={[0, 0, 0]} color="#6366f1" speed={1.5} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const features = [
    {
      icon: '🌤️',
      title: 'Weather Conditions',
      description: 'Real-time weather monitoring with temperature, humidity, and forecasts for better city planning'
    },
    {
      icon: '🌿',
      title: 'Air Quality',
      description: 'Track air quality index (AQI) and pollution levels to ensure healthy living conditions'
    },
    {
      icon: '🚦',
      title: 'Traffic Congestion',
      description: 'Monitor traffic flow and congestion patterns to optimize transportation infrastructure'
    },
    {
      icon: '⚡',
      title: 'Energy Usage',
      description: 'Analyze energy consumption patterns and promote sustainable power management'
    },
    {
      icon: '♻️',
      title: 'Waste Management',
      description: 'Track waste collection, recycling rates, and optimize disposal systems'
    }
  ];

  return (
    <div className="landing-container" ref={containerRef}>
      {/* Hero Section */}
      <motion.section className="hero-section" style={{ opacity, scale }}>
        <div className="hero-canvas">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <FloatingScene />
          </Canvas>
        </div>

        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Smart City Data Insights
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore our Smart City Data Dashboard for real-time, actionable insights.
            Empowering citizens, officials, researchers, and planners with intuitive
            data visualizations for sustainable urban living and informed decisions.
          </motion.p>

          <motion.button
            className="cta-button"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
          >
            Get Started
          </motion.button>
        </div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Powerful Features
        </motion.h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-canvas">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
            <Sphere args={[2, 100, 200]} scale={1.5}>
              <MeshDistortMaterial
                color="#a855f7"
                attach="material"
                distort={0.6}
                speed={2}
                roughness={0.2}
              />
            </Sphere>
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
          </Canvas>
        </div>

        <motion.div
          className="stats-content"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="stats-title">Trusted by Cities Worldwide</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Cities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2M+</div>
              <div className="stat-label">Data Points</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="cta-title">Ready to Transform Your City?</h2>
          <p className="cta-description">
            Join hundreds of cities using our platform to make data-driven decisions
          </p>
          <motion.button
            className="cta-button-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth')}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
