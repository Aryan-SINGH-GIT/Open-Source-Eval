import { useState, useEffect } from 'react';
import { getTrafficFlow, calculateCongestion } from '../services/trafficAPI';
import './TrafficCard.css';

const TrafficCard = ({ city = 'Mumbai' }) => {
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTraffic();
  }, [city]);

  const fetchTraffic = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrafficFlow(city);
      setTraffic(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="traffic-card loading">Loading traffic data...</div>;
  }

  if (error) {
    return (
      <div className="traffic-card error">
        <p>Error: {error}</p>
        <button onClick={fetchTraffic}>Retry</button>
      </div>
    );
  }

  if (!traffic) {
    return null;
  }

  const congestion = calculateCongestion(traffic.currentSpeed, traffic.freeFlowSpeed);
  const delayMinutes = Math.round((traffic.currentTravelTime - traffic.freeFlowTravelTime) / 60);

  return (
    <div className="traffic-card">
      <div className="traffic-header">
        <h2>🚦 Traffic in {traffic.city}</h2>
        <button onClick={fetchTraffic} className="refresh-btn">🔄</button>
      </div>

      <div className="traffic-main">
        <div className="congestion-indicator" style={{ borderColor: congestion.color }}>
          <div className="congestion-icon">{congestion.icon}</div>
          <div className="congestion-level" style={{ color: congestion.color }}>
            {congestion.level}
          </div>
          <div className="congestion-percentage">{congestion.percentage}% of normal speed</div>
        </div>
      </div>

      <div className="traffic-details">
        <div className="detail-item">
          <span className="label">Current Speed</span>
          <span className="value">{traffic.currentSpeed} km/h</span>
        </div>
        <div className="detail-item">
          <span className="label">Normal Speed</span>
          <span className="value">{traffic.freeFlowSpeed} km/h</span>
        </div>
        <div className="detail-item">
          <span className="label">Delay</span>
          <span className="value">{delayMinutes > 0 ? `+${delayMinutes} min` : 'No delay'}</span>
        </div>
        <div className="detail-item">
          <span className="label">Road Status</span>
          <span className="value">{traffic.roadClosure ? '🚫 Closed' : '✅ Open'}</span>
        </div>
      </div>

      <div className="traffic-footer">
        <small>Last updated: {new Date(traffic.timestamp).toLocaleTimeString()}</small>
      </div>
    </div>
  );
};

export default TrafficCard;
