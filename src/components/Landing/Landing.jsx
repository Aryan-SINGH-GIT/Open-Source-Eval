import React, { useRef, useMemo, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import './Landing.css';

const AnimatedSphere = React.memo(({ position, color, speed }) => {
  return (
    <Sphere args={[1, 64, 128]} position={position} scale={2}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.5}
        speed={speed}
        roughness={0}
      />
    </Sphere>
  );
});

AnimatedSphere.displayName = 'AnimatedSphere';

const FloatingScene = React.memo(() => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} color="#a855f7" intensity={2} />
      <AnimatedSphere position={[0, 0, 0]} color="#6366f1" speed={1.5} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} enableRotate={false} />
    </>
  );
});

FloatingScene.displayName = 'FloatingScene';

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeWidget, setActiveWidget] = useState(0);
  const [demoCity, setDemoCity] = useState('');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const features = useMemo(() => [
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
  ], []);

  const demoWidgets = useMemo(() => [
    { icon: '🌤️', title: 'Weather', value: '24°C', label: 'Clear Sky', color: '#60a5fa' },
    { icon: '🌿', title: 'Air Quality', value: '42', label: 'Good', color: '#10b981' },
    { icon: '🚦', title: 'Traffic', value: '65%', label: 'Moderate', color: '#f59e0b' },
    { icon: '⚡', title: 'Energy', value: '1.2MW', label: 'Active', color: '#a855f7' },
    { icon: '♻️', title: 'Waste', value: '78%', label: 'Collected', color: '#ec4899' }
  ], []);

  const howItWorksSteps = useMemo(() => [
    {
      step: '01',
      icon: '🔍',
      title: 'Search Any City',
      description: 'Enter any city name to access real-time data from trusted sources'
    },
    {
      step: '02',
      icon: '📊',
      title: 'View Live Data',
      description: 'Explore comprehensive dashboards with weather, traffic, air quality and more'
    },
    {
      step: '03',
      icon: '💡',
      title: 'Make Decisions',
      description: 'Use data-driven insights to optimize city planning and resource allocation'
    }
  ], []);

  const useCases = useMemo(() => [
    {
      icon: '👨‍💼',
      title: 'City Officials',
      description: 'Optimize resource allocation and improve public services',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
    },
    {
      icon: '🏘️',
      title: 'Citizens',
      description: 'Stay informed about your city\'s environment and conditions',
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)'
    },
    {
      icon: '📊',
      title: 'Researchers',
      description: 'Access comprehensive urban data for analysis and studies',
      gradient: 'linear-gradient(135deg, #10b981, #14b8a6)'
    },
    {
      icon: '🏗️',
      title: 'Urban Planners',
      description: 'Data-driven insights for sustainable city development',
      gradient: 'linear-gradient(135deg, #f59e0b, #f97316)'
    }
  ], []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveWidget((prev) => (prev + 1) % demoWidgets.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [demoWidgets.length]);

  const handleDemoSearch = (e) => {
    e.preventDefault();
    if (demoCity.trim()) {
      navigate('/auth');
    }
  };

  return (
    <div className="landing-container" ref={containerRef}>
      {/* Hero Section */}
      <motion.section className="hero-section" style={{ opacity, scale }}>
        <div className="hero-canvas">
          <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
            <Suspense fallback={null}>
              <FloatingScene />
            </Suspense>
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
            Monitor real-time city data from weather to traffic, air quality to energy usage.
            Empowering citizens, officials, researchers, and planners with live insights
            for smarter, more sustainable urban living.
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
            Check Your City Data
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

      {/* Live Demo Preview Section */}
      <section className="demo-section">
        <motion.div
          className="demo-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">See It In Action</h2>
          <p className="section-description">
            Real-time data visualization from cities around the world
          </p>

          <div className="demo-preview">
            <div className="demo-widgets-container">
              <AnimatePresence mode="wait">
                {demoWidgets.map((widget, index) => (
                  index === activeWidget && (
                    <motion.div
                      key={widget.title}
                      className="demo-widget"
                      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="demo-widget-icon">{widget.icon}</div>
                      <div className="demo-widget-value" style={{ color: widget.color }}>
                        {widget.value}
                      </div>
                      <div className="demo-widget-title">{widget.title}</div>
                      <div className="demo-widget-label">{widget.label}</div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            <div className="demo-indicators">
              {demoWidgets.map((widget, index) => (
                <motion.div
                  key={index}
                  className={`demo-indicator ${index === activeWidget ? 'active' : ''}`}
                  onClick={() => setActiveWidget(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <form className="demo-search-form" onSubmit={handleDemoSearch}>
              <input
                type="text"
                className="demo-search-input"
                placeholder="Try searching your city..."
                value={demoCity}
                onChange={(e) => setDemoCity(e.target.value)}
              />
              <motion.button
                type="submit"
                className="demo-search-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Now →
              </motion.button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>
        <motion.p
          className="section-description"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Get started in three simple steps
        </motion.p>

        <div className="steps-container">
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={index}
              className="step-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="step-number">{step.step}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < howItWorksSteps.length - 1 && (
                <div className="step-connector">→</div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Who Benefits?
        </motion.h2>
        <motion.p
          className="section-description"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Empowering diverse stakeholders with actionable insights
        </motion.p>

        <div className="use-cases-grid">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              className="use-case-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              style={{ background: useCase.gradient }}
            >
              <div className="use-case-icon">{useCase.icon}</div>
              <h3 className="use-case-title">{useCase.title}</h3>
              <p className="use-case-description">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="data-sources-section">
        <motion.div
          className="data-sources-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Powered by Trusted Sources</h2>
          <p className="section-description">
            Real-time data from reliable APIs and verified sources
          </p>

          <div className="data-badges">
            <motion.div
              className="data-badge"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="badge-icon">🌐</span>
              <span className="badge-text">OpenWeather API</span>
            </motion.div>
            <motion.div
              className="data-badge"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <span className="badge-icon">📡</span>
              <span className="badge-text">Real-time Updates</span>
            </motion.div>
            <motion.div
              className="data-badge"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <span className="badge-icon">🔒</span>
              <span className="badge-text">Secure & Reliable</span>
            </motion.div>
            <motion.div
              className="data-badge"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <span className="badge-icon">🌍</span>
              <span className="badge-text">500+ Cities</span>
            </motion.div>
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
          <h2 className="cta-title">Ready to Explore Your City?</h2>
          <p className="cta-description">
            Access real-time data for any city around the world
          </p>
          <div className="cta-buttons">
            <motion.button
              className="cta-button-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
            >
              Check Your City Now
            </motion.button>
            <motion.button
              className="cta-button-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
            >
              View Live Demo
            </motion.button>
          </div>
          <p className="cta-note">✨ Explore any city • Real-time data updates</p>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
