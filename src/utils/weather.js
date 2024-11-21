import axios from 'axios';
import logger from '../config/logger.js';
import redisClient from '../config/redis.js';

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

export async function getWeather(zipCode, countryCode, date, lang = 'es') {
  try {
    const { latitude, longitude } = await getLatituteLongitude(zipCode, countryCode);

    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=${lang}`;
    const parsedDate = getNearest3HourInterval(date);

    const cacheKey = `weather-forecast:${zipCode},${countryCode},${parsedDate}`;

    const cachedForecast = await redisClient.get(cacheKey);
    if (cachedForecast) return JSON.parse(cachedForecast);

    const response = await axios.get(url);
    logger.info(`Weather data fetched for ${zipCode}, ${countryCode}`);
    cacheForecast(zipCode, countryCode, response.data);
    const forecast = response.data.list.find((item) => item.dt_txt === parsedDate);
    return forecast;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Error getting weather data:', ${error.message}`);
      if (error.response) {
        logger.error(`Error response: ${error.response.data}`);
      }
    } else {
      logger.error(`Unexpected error: ${error.message}`);
    }
    throw error;
  }
}

function cacheForecast(zipCode, countryCode, forecast) {
  const forecastList = forecast.list
  const today = new Date();

  for (let i = 0; i < forecastList.length; i++) {
    const date = forecastList[i].dt_txt;
    const cacheKey = `weather-forecast:${zipCode},${countryCode},${date}`;
    forecastList[i].cachedAt = today.toISOString();
    const expirationTime = 60 * 60 * 24;
    redisClient.set(cacheKey, JSON.stringify(forecastList[i]), 'EX', expirationTime);
  }
}

function getNearest3HourInterval(date) {
  const dateCopy = new Date(date);
  dateCopy.setHours(dateCopy.getHours() + 3 - (dateCopy.getHours() % 3));
  dateCopy.setMinutes(0);
  dateCopy.setSeconds(0);

  let dateFormatted = dateCopy.toISOString().split('T')[0];
  dateFormatted += ' ' + dateCopy.toTimeString().split(' ')[0];

  return dateFormatted;
}
