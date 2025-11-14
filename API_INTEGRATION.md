# 🔌 API Integration Guide

## Overview
This document explains how to integrate the backend API with the Smart City Dashboard frontend.

## Current Implementation
The dashboard currently uses **mock data** for demonstration. Replace the mock API call in `src/pages/Dashboard/Dashboard.jsx` with your actual API.

## API Endpoint Expected

### Search City Data
**Endpoint**: `GET /api/city/{cityName}` or `POST /api/city/search`

**Request Example**:
```javascript
// GET method
fetch(`https://your-api.com/api/city/${cityName}`)

// OR POST method
fetch('https://your-api.com/api/city/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cityName: cityName })
})
```

**Expected Response Format**:
```json
{
  "cityName": "New York",
  "weather": {
    "temp": 25,
    "condition": "Clear",
    "humidity": 65,
    "windSpeed": 12
  },
  "airQuality": {
    "aqi": 45,
    "status": "Good",
    "pm25": 18,
    "pm10": 28
  },
  "traffic": {
    "congestionLevel": 55,
    "avgSpeed": 42,
    "incidents": 3
  },
  "energy": {
    "usage": 1350,
    "renewable": 42,
    "peak": 1650
  },
  "waste": {
    "collected": 520,
    "recycled": 38,
    "nextCollection": "Tomorrow, 6:00 AM"
  }
}
```

## Integration Steps

### 1. Create API Service File
Create `src/store/services/cityApiService.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-api.com';

export const fetchCityData = async (cityName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/city/${cityName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed
        // 'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching city data:', error);
    throw error;
  }
};
```

### 2. Update Dashboard Component
In `src/pages/Dashboard/Dashboard.jsx`, replace the mock API call:

**Find this section** (around line 50):
```javascript
const handleSearch = (e) => {
  e.preventDefault();
  if (searchCity.trim()) {
    setLoading(true);
    // Simulate API call - Replace with actual API call later
    setTimeout(() => {
      setSelectedCity(searchCity);
      // Mock API response
      setCityData({
        // ... mock data
      });
      setLoading(false);
    }, 1000);
  }
};
```

**Replace with**:
```javascript
import { fetchCityData } from '../../store/services/cityApiService';

const handleSearch = async (e) => {
  e.preventDefault();
  if (searchCity.trim()) {
    setLoading(true);
    try {
      const data = await fetchCityData(searchCity);
      setSelectedCity(searchCity);
      setCityData(data);
    } catch (error) {
      console.error('Failed to fetch city data:', error);
      // Show error message to user
      alert('Failed to fetch city data. Please try again.');
    } finally {
      setLoading(false);
    }
  }
};
```

### 3. Environment Variables
Create `.env` file in project root:

```env
REACT_APP_API_URL=https://your-api-domain.com
```

### 4. Error Handling
Add error state to Dashboard:

```javascript
const [error, setError] = useState(null);

// In handleSearch:
try {
  const data = await fetchCityData(searchCity);
  setSelectedCity(searchCity);
  setCityData(data);
  setError(null);
} catch (error) {
  setError('Failed to fetch city data. Please try again.');
  console.error(error);
}

// Display error in UI:
{error && (
  <div className="error-message">
    ⚠️ {error}
  </div>
)}
```

## Data Field Descriptions

### Weather
- `temp`: Temperature in Celsius (number)
- `condition`: Weather condition (string: "Clear", "Cloudy", "Rainy", "Sunny")
- `humidity`: Humidity percentage (number: 0-100)
- `windSpeed`: Wind speed in km/h (number)

### Air Quality
- `aqi`: Air Quality Index (number: 0-500)
- `status`: Quality status (string: "Good", "Moderate", "Unhealthy")
- `pm25`: PM2.5 level (number)
- `pm10`: PM10 level (number)

### Traffic
- `congestionLevel`: Congestion percentage (number: 0-100)
- `avgSpeed`: Average speed in km/h (number)
- `incidents`: Number of traffic incidents (number)

### Energy
- `usage`: Current usage in MW (number)
- `renewable`: Renewable energy percentage (number: 0-100)
- `peak`: Peak load in MW (number)

### Waste
- `collected`: Tons collected (number)
- `recycled`: Recycling percentage (number: 0-100)
- `nextCollection`: Next collection time (string)

## Testing

### Test with Mock Data
Current implementation works with mock data - test the UI flow first.

### Test with Real API
1. Update `API_BASE_URL` in service file
2. Ensure CORS is enabled on backend
3. Test with different city names
4. Handle edge cases (city not found, network errors)

## CORS Configuration
If you encounter CORS errors, your backend needs to allow requests from the frontend:

```javascript
// Backend CORS headers needed:
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Questions?
Contact the frontend team if you need any adjustments to the data structure or additional fields!
