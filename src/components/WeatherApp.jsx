"use client";

import { useState, useEffect } from 'react';
import { getWeatherData } from '../utils/api';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import styles from '../styles/WeatherApp.module.css';

export default function WeatherApp() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async (location) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getWeatherData(location);
            setWeatherData(data);
        } catch (err) {
            setError('Failed to fetch weather data. Please check the city name and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initialize with default location on mount
    useEffect(() => {
        fetchWeather('London');
    }, []);

    return (
        <div className={styles.main}>
            <SearchBar onSearch={fetchWeather} />

            {loading && <p className={styles.loading}>Loading weather data...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {weatherData && !loading && (
                <>
                    <CurrentWeather data={weatherData} />
                    <Forecast data={weatherData} />
                </>
            )}
        </div>
    );
}