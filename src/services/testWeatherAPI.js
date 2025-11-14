/**
 * Test file for Weather API
 * Run this to verify API is working correctly
 */

import { getCurrentWeather, getWeatherForecast, getWeatherByCoordinates } from './weatherAPI';

// Test 1: Get current weather for Mumbai
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

// Test 2: Get weather forecast
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

// Test 3: Get weather by coordinates (Mumbai coordinates)
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

// Run all tests
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

// Uncomment to run tests when importing this file
// runAllTests();
