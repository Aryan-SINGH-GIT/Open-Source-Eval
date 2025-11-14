const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL;

/**
 * Fetch current weather data for a city
 * @param {string} city - City name (e.g., "Mumbai", "Delhi")
 * @returns {Promise<Object>} Weather data
 */
export const getCurrentWeather = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      timestamp: new Date(data.dt * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Fetch 5-day weather forecast for a city
 * @param {string} city - City name
 * @returns {Promise<Array>} Array of forecast data
 */
export const getWeatherForecast = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Forecast API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data.list.map(item => ({
      date: new Date(item.dt * 1000).toISOString(),
      temperature: Math.round(item.main.temp),
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

/**
 * Fetch weather data by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data
 */
export const getWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      timestamp: new Date(data.dt * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};

// Test functions
export const testCurrentWeather = async () => {
  console.log('🧪 Testing Current Weather API...');
  try {
    const data = await getCurrentWeather('Mumbai');
    console.log('✅ Success:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
};

export const testWeatherForecast = async () => {
  console.log('🧪 Testing Weather Forecast API...');
  try {
    const data = await getWeatherForecast('Delhi');
    console.log('✅ Success: Got', data.length, 'forecast entries');
    console.log('First entry:', data[0]);
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
};

export const testWeatherByCoordinates = async () => {
  console.log('🧪 Testing Weather by Coordinates API...');
  try {
    const data = await getWeatherByCoordinates(19.0760, 72.8777);
    console.log('✅ Success:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
};

export const runAllTests = async () => {
  console.log('🚀 Starting Weather API Tests...\n');
  try {
    await testCurrentWeather();
    console.log('\n');
    await testWeatherForecast();
    console.log('\n');
    await testWeatherByCoordinates();
    console.log('\n');
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
  }
};
