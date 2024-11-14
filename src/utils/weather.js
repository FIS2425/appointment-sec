import axios from 'axios';
import logger from '../config/logger.js';

const API_KEY = process.env.OPEN_WEATHER_API_KEY;

export async function getLatituteLongitude(zipCode, countryCode) {
  const url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const { lat, lon } = response.data;
    return { latitude: lat, longitude: lon };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Error getting location data:', ${error.message}`);
      if (error.response) {
        logger.error(`Error response: ${error.response.data}`);
      }
    } else {
      logger.error(`Unexpected error: ${error.message}`);
    }
  }
}

export async function getWeather(latitude, longitude, lang = 'es') {
  const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=${lang}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Error getting weather data:', ${error.message}`);
      if (error.response) {
        logger.error(`Error response: ${error.response.data}`);
      }
    } else {
      logger.error(`Unexpected error: ${error.message}`);
    }
  }
}
