import { useState } from 'react'
import WeatherCard from './components/WeatherCard'
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
        <p>Real-time Weather Data</p>
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

      <WeatherCard city={city} />

      <div className="quick-cities">
        <p>Quick Select:</p>
        <button onClick={() => setCity('Mumbai')}>Mumbai</button>
        <button onClick={() => setCity('Delhi')}>Delhi</button>
        <button onClick={() => setCity('Bangalore')}>Bangalore</button>
        <button onClick={() => setCity('Kolkata')}>Kolkata</button>
      </div>
    </div>
  )
}

export default App
