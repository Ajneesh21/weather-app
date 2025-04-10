"use client";

import { useState, useEffect } from 'react';
import { getWeatherData } from '../utils/api';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import {
    Container, Box, Typography, CircularProgress, Alert,
    useMediaQuery, CssBaseline, Fade
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CloudIcon from '@mui/icons-material/Cloud';

// Create a custom theme with light/dark mode support
const getTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: mode === 'dark' ? '#90caf9' : '#1976d2',
        },
        secondary: {
            main: mode === 'dark' ? '#f48fb1' : '#d81b60',
        },
        background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 600,
        }
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default function WeatherApp() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Automatically detect preferred color scheme
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = getTheme(prefersDarkMode ? 'dark' : 'light');

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

    // Determine background gradient based on time of day
    const getBackgroundGradient = () => {
        if (!weatherData) return 'linear-gradient(to bottom, #4b6cb7, #182848)';

        const hour = new Date().getHours();

        if (hour >= 5 && hour < 10) {
            return 'linear-gradient(to bottom, #ff9966, #ff5e62)'; // Sunrise
        } else if (hour >= 10 && hour < 17) {
            return 'linear-gradient(to bottom, #1e90ff, #4fc3f7)'; // Day
        } else if (hour >= 17 && hour < 21) {
            return 'linear-gradient(to bottom, #ff9966, #ff5e62)'; // Sunset
        } else {
            return 'linear-gradient(to bottom, #141e30, #243b55)'; // Night
        }
    };

    // Get weather condition to further customize UI
    const getWeatherCondition = () => {
        if (!weatherData) return 'default';
        const condition = weatherData.current.condition.text.toLowerCase();

        if (condition.includes('rain') || condition.includes('drizzle')) return 'rainy';
        if (condition.includes('snow')) return 'snowy';
        if (condition.includes('cloud')) return 'cloudy';
        if (condition.includes('clear') || condition.includes('sunny')) return 'clear';
        return 'default';
    };

    const condition = getWeatherCondition();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: getBackgroundGradient(),
                    pt: 4,
                    pb: 6,
                    transition: 'background 1s ease-in-out',
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Fade in={true} timeout={1000}>
                            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                                <CloudIcon sx={{ fontSize: 40, mr: 1, color: 'white' }} />
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    color="white"
                                    sx={{ fontWeight: 700 }}
                                >
                                    Weather Forecast
                                </Typography>
                            </Box>
                        </Fade>

                        <SearchBar onSearch={fetchWeather} />
                    </Box>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress sx={{ color: 'white' }} />
                        </Box>
                    )}

                    {error && (
                        <Fade in={true}>
                            <Alert
                                severity="error"
                                sx={{
                                    my: 2,
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(211, 47, 47, 0.85)',
                                    color: 'white',
                                    '& .MuiAlert-icon': {
                                        color: 'white'
                                    }
                                }}
                            >
                                {error}
                            </Alert>
                        </Fade>
                    )}

                    {weatherData && !loading && (
                        <Fade in={true} timeout={800}>
                            <Box>
                                <CurrentWeather data={weatherData} condition={condition} />
                                <Forecast data={weatherData} condition={condition} />
                            </Box>
                        </Fade>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
}