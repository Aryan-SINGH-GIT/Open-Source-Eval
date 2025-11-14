import { useState, useEffect } from 'react';
import { getCurrentWeather } from '../services/weatherAPI';
import './WeatherCard.css';

const WeatherCard = ({ city = 'Mumbai' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCurrentWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="weather-card loading">Loading weather data...</div>;
  }

  if (error) {
    return (
      <div className="weather-card error">
        <p>Error: {error}</p>
        <button onClick={fetchWeather}>Retry</button>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{weather.city}, {weather.country}</h2>
        <button onClick={fetchWeather} className="refresh-btn">🔄</button>
      </div>
      
      <div className="weather-main">
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="weather-icon"
        />
        <div className="temperature">{weather.temperature}°C</div>
        <div className="description">{weather.description}</div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="label">Feels Like</span>
          <span className="value">{weather.feelsLike}°C</span>
        </div>
        <div className="detail-item">
          <span className="label">Humidity</span>
          <span className="value">{weather.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="label">Wind Speed</span>
          <span className="value">{weather.windSpeed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="label">Pressure</span>
          <span className="value">{weather.pressure} hPa</span>
        </div>
      </div>

      <div className="weather-footer">
        <small>Last updated: {new Date(weather.timestamp).toLocaleTimeString()}</small>
      </div>
    </div>
  );
};

export default WeatherCard;
