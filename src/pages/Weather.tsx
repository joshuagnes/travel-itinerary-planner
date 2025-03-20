import React, { useEffect, useRef, useState } from 'react';
import '../index.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

interface WeatherData {
  humidity: number;
  windSpeed: string;
  windDirection: string;
  temperature: number;
  feelsLike: number;
  description: string;
  location: string;
  icon: string;
  pressure: number;
  visibility: string;
  sunrise: string;
  sunset: string;
}

const Weather: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const allIcons: { [key: string]: string } = {
    '01d': clear_icon,
    '01n': clear_icon,
    '02d': cloud_icon,
    '02n': cloud_icon,
    '03d': cloud_icon,
    '03n': cloud_icon,
    '04d': drizzle_icon,
    '04n': drizzle_icon,
    '09d': rain_icon,
    '09n': rain_icon,
    '10d': rain_icon,
    '10n': rain_icon,
    '13d': snow_icon,
    '13n': snow_icon,
  };

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const formatTime = (timestamp: number, timezoneOffset: number): string => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const fetchWeather = async (city: string): Promise<WeatherData | null> => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      return {
        humidity: data.main.humidity,
        windSpeed: data.wind.speed.toFixed(2),
        windDirection: getWindDirection(data.wind.deg),
        temperature: Math.floor(data.main.temp),
        feelsLike: Math.floor(data.main.feels_like),
        description: data.weather[0].description,
        location: data.name,
        icon: icon,
        pressure: data.main.pressure,
        visibility: (data.visibility / 1000).toFixed(1),
        sunrise: formatTime(data.sys.sunrise, data.timezone),
        sunset: formatTime(data.sys.sunset, data.timezone),
      };
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error);
      return null;
    }
  };

  const loadDefaultCities = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const cities = ['London', 'New York', 'Tokyo', 'Sydney', 'Paris'];
    const weatherPromises = cities.map((city) => fetchWeather(city));
    const results = await Promise.all(weatherPromises);
    setWeatherData(results.filter((data): data is WeatherData => data !== null));
    setLoading(false);
  };

  const search = async (city: string): Promise<void> => {
    if (!city) {
      alert('Enter City Name');
      return;
    }
    setLoading(true);
    setError(null);
    const data = await fetchWeather(city);
    if (data) {
      setWeatherData([data, ...weatherData.slice(0, 4)]);
    } else {
      setError('City not found or failed to fetch data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDefaultCities();
  }, []);

  return (
    <div className="app">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && search(inputValue)
          }
        />
        {inputValue && (
          <img
            src={clear_icon}
            alt="clear"
            onClick={() => {
              setInputValue('');
              inputRef.current?.focus();
            }}
          />
        )}
        <img
          src={search_icon}
          alt="search"
          onClick={() => search(inputValue)}
        />
      </div>

      {loading ? (
        <p className="text-white text-xl text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-400 text-xl text-center">{error}</p>
      ) : weatherData.length > 0 ? (
        <div className="weather-grid">
          {weatherData.map((cityData, index) => (
            <div key={index} className="weather-card">
              <img
                src={cityData.icon}
                alt="weather"
                className="weather-icon"
              />
              <p className="temperature">{cityData.temperature}°C</p>
              <p className="description capitalize">{cityData.description}</p>
              <p className="location">{cityData.location}</p>
              <div className="weather-date">
                <div className="col">
                  <img src={humidity_icon} alt="humidity" />
                  <div>
                    <span>Humidity</span>
                    <p>{cityData.humidity}%</p>
                  </div>
                </div>
                <div className="col">
                  <img src={wind_icon} alt="wind" />
                  <div>
                    <span>Wind</span>
                    <p>
                      {cityData.windSpeed} Km/h ({cityData.windDirection})
                    </p>
                  </div>
                </div>
              </div>
              <div className="weather-details">
                <div className="col">
                  <span>Pressure</span>
                  <p>{cityData.pressure} hPa</p>
                </div>
                <div className="col">
                  <span>Visibility</span>
                  <p>{cityData.visibility} km</p>
                </div>
              </div>
              <div className="sun-times">
                <div className="col">
                  <span>Sunrise</span>
                  <p>{cityData.sunrise}</p>
                </div>
                <div className="col">
                  <span>Sunset</span>
                  <p>{cityData.sunset}</p>
                </div>
              </div>
              <p className="feels-like">Feels like: {cityData.feelsLike}°C</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white text-xl text-center">No data available</p>
      )}
    </div>
  );
};

export default Weather;