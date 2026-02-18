export const WEATHER_CONFIG = {
  // Replace this with your WeatherAPI key
  API_KEY: 'b5af4386499f4306bf283243251109',
  
  // API endpoints
  API_URL: 'https://api.weatherapi.com/v1/forecast.json',
  
  // Default settings
  UNITS: 'metric', // metric, imperial
  LANGUAGE: 'en',
  
  // Geolocation settings
  GEOLOCATION_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5 minutes
  }
};
