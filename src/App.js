import { useState } from 'react'
import WeatherCard from './components/WeatherCard'
import TrafficCard from './components/TrafficCard'
import './App.css'

function App() {
  const [city, setCity] = useState('Mumbai')
  const [inputCity, setInputCity] = useState('')

  const handleCityChange = (e) => {
    e.preventDefault()
    if (inputCity.trim()) {
      setCity(inputCity.trim())
      setInputCity('')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌆 Smart City Dashboard</h1>
        <p>Real-time Weather & Traffic Data</p>
      </header>

      <div className="city-selector">
        <form onSubmit={handleCityChange}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            className="city-input"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="dashboard-grid">
        <WeatherCard city={city} />
        <TrafficCard city={city} />
      </div>

      <div className="quick-cities">
        <p>Quick Select:</p>
        <button onClick={() => setCity('Mumbai')}>Mumbai</button>
        <button onClick={() => setCity('Delhi')}>Delhi</button>
        <button onClick={() => setCity('Bangalore')}>Bangalore</button>
        <button onClick={() => setCity('Kolkata')}>Kolkata</button>
        <button onClick={() => setCity('London')}>London</button>
      </div>
    </div>
  )
}

export default App
