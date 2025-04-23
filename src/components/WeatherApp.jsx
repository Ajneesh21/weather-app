"use client";

import { useState, useEffect } from 'react';
import { getWeatherData } from '../utils/api';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import WeatherMap from './WeatherMap';
import WeatherCharts from './WeatherCharts';
import WeatherAlerts from './WeatherAlerts';
import {
    Container, Box, Typography, CircularProgress, Alert,
    useMediaQuery, CssBaseline, Fade, Grid, Paper, Tabs, Tab,
    SwipeableDrawer, IconButton, useTheme, Divider
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CloudIcon from '@mui/icons-material/CloudSync';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: { backgroundImage: 'none' }
            },
        },
    },
});

export default function WeatherApp() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Allow user to toggle dark mode
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
    const theme = getTheme(mode);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const fetchWeather = async (location) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getWeatherData(location);
            setWeatherData(data);
            // Update browser title with location
            document.title = `Weather: ${data.location.name}, ${data.location.country}`;
        } catch (err) {
            setError('Failed to fetch weather data. Please check the city name and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initialize with default location on mount
    useEffect(() => {
        fetchWeather('Bangalore');
    
        return () => { };
    }, []);



    // Determine background gradient based on time of day and weather condition
    const getBackgroundGradient = () => {
        if (!weatherData) return 'linear-gradient(to bottom, #4b6cb7, #182848)';

        const hour = new Date().getHours();
        const condition = weatherData.current.condition.text.toLowerCase();

        if (condition.includes('rain') || condition.includes('drizzle')) {
            return 'linear-gradient(to bottom, #616161, #212121)';
        } else if (condition.includes('snow')) {
            return 'linear-gradient(to bottom, #E3F2FD, #90CAF9)';
        } else if (condition.includes('cloud')) {
            return hour >= 6 && hour < 20
                ? 'linear-gradient(to bottom, #5C6BC0, #9FA8DA)'
                : 'linear-gradient(to bottom, #303F9F, #1A237E)';
        } else if (hour >= 5 && hour < 10) {
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

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* Background box */}
            {weatherData ? (
                <Box
                    id="weather-bg"
                    sx={{
                        minHeight: '100vh',
                        width: '100vw',
                        background: getBackgroundGradient(),
                        position: 'fixed',
                        top: '0',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1,
                        backgroundSize: 'cover',
                    }}
                />):(
                <Box
                    id="weather-bg"
                    sx={{
                        minHeight: '100vh',
                        width: '100vw',
                        background: theme.palette.background.default,
                        position: 'fixed',
                        top: '0',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1,
                        backgroundSize: 'cover',
                    }}
                />)}
            {/* Display loading indicator if data is not loaded */}
            {!weatherData && !error && (<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100vw', minHeight: 'calc(100vh - 100px)' }}>
                    <Typography variant="h5" >
                        Fetching weather...
                    </Typography>
                    <CircularProgress />

                </Box>
            )}



            {/* Mobile drawer */}
            <SwipeableDrawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 280,
                        backgroundImage: getBackgroundGradient(),
                        color: 'white',
                        padding: 2
                    }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <CloudIcon sx={{ mr: 1 }} /> Weather App
                        </Typography>
                        <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', mb: 2 }} />

                    {weatherData && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 1 }}>
                                CURRENT LOCATION
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {weatherData.location.name}, {weatherData.location.country}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 1 }}>
                        SAVED LOCATIONS
                    </Typography>
                    {['New York', 'Tokyo', 'Paris', 'Sydney'].map((city) => (
                        <Box
                            key={city}
                            sx={{
                                py: 1.5,
                                px: 2,
                                borderRadius: 2,
                                mb: 1,
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    cursor: 'pointer'
                                }
                            }}
                            onClick={() => {
                                fetchWeather(city);
                                setDrawerOpen(false);
                            }}
                        >
                            <Typography variant="body1">{city}</Typography>
                        </Box>
                    ))}

                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', my: 2 }} />

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }}
                    >
                        <Typography variant="body2">
                            {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </Typography>
                        <IconButton onClick={toggleColorMode} sx={{ color: 'white' }}>
                            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Box>
                </Box>
            </SwipeableDrawer>

            <Box
                component="main"
                sx={{
                    minHeight: '100vh',
                    position: 'relative',
                    pt: { xs: 2, sm: 4 },
                    overflowY:'auto',
                    pb: 6
                }}
            >
                <Container maxWidth="xl">
                    {/* Header */}
                    {weatherData && (<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                sx={{
                                    mr: 1,
                                    color: 'white',
                                    display: { sm: 'flex', md: 'none' }
                            }}
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Fade in={true} timeout={1000}>
                                <Box display="flex" alignItems="center">
                                    <CloudIcon sx={{ fontSize: 36, mr: 1, color: 'white' }} />
                                    <Typography
                                        variant="h4"
                                        component="h1"
                                        color="white"
                                        sx={{
                                            fontWeight: 700,
                                            display: { xs: 'none', sm: 'block' }
                                        }}
                                    >
                                        Weather Forecast
                                    </Typography>
                                </Box>
                            </Fade>
                        </Box>

                        <IconButton
                            onClick={toggleColorMode}
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                }
                            }}
                        >
                            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Box>)}

                    {/* Search Bar */}
                    {weatherData && (<Box sx={{ mb: 4, maxWidth: { xs: '100%', md: '70%', lg: '50%' }, mx: 'auto' }}>
                        <SearchBar onSearch={fetchWeather} />
                    </Box>)}

                    {error && (
                      <Box sx={{ mt: 3}}>
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
                      </Box>
                         )}

                    {weatherData && (
                        <Fade in={true} timeout={800}>
                            <Box>
                                {/* Desktop layout - side by side */}
                                <Grid container spacing={3}>
                                    {/* Left sidebar - visible on desktop */}
                                    <Grid item md={3} lg={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                                        <Paper
                                            sx={{
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: 4,
                                                p: 2,
                                                height: '100%',
                                                color: 'white',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                Saved Locations
                                            </Typography>
                                            {['New York', 'Tokyo', 'Paris', 'Sydney'].map((city) => (
                                                <Box
                                                    key={city}
                                                    sx={{
                                                        py: 1.5,
                                                        px: 2,
                                                        borderRadius: 2,
                                                        mb: 1,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                                            cursor: 'pointer'
                                                        }
                                                    }}
                                                    onClick={() => fetchWeather(city)}
                                                >
                                                    <Typography variant="body1">{city}</Typography>
                                                </Box>
                                            ))}

                                            {/* Weather facts section */}
                                            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                                                Weather Facts
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                                    Did You Know?
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                    Lightning strikes the Earth 8.6 million times per day
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                                    Air Quality 
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                    {weatherData.current.air_quality?.['us-epa-index'] ?
                                                        `AQI: ${weatherData.current.air_quality?.['us-epa-index']}` :
                                                        'AQI data not available'}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    {/* Main content */}
                                    <Grid item xs={12} md={9} lg={7}>
                                        {/* Current weather card */}
                                        <CurrentWeather data={weatherData} condition={condition} />

                                        {/* Tab navigation */}
                                        <Paper
                                            sx={{
                                                borderRadius: 4,
                                                mb: 3,
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                color: 'white',
                                            }}
                                        >
                                            <Tabs
                                                value={tabValue}
                                                onChange={handleTabChange}
                                                variant="fullWidth"
                                                textColor="inherit"
                                                sx={{
                                                    '& .MuiTabs-indicator': {
                                                        backgroundColor: 'white',
                                                    },
                                                }}
                                            >
                                                <Tab label="Forecast" />
                                                <Tab label="Hourly" />
                                                <Tab label="Details" />
                                            </Tabs>
                                        </Paper>

                                        {/* Tab content */}
                                        <Box role="tabpanel" hidden={tabValue !== 0}>
                                            {tabValue === 0 && <Forecast data={weatherData} condition={condition} />}
                                        </Box>

                                        <Box role="tabpanel" hidden={tabValue !== 1}>
                                            {tabValue === 1 && <WeatherCharts data={weatherData} />}
                                        </Box>

                                        <Box role="tabpanel" hidden={tabValue !== 2}>
                                            {tabValue === 2 && <WeatherAlerts data={weatherData} />}
                                        </Box>
                                    </Grid>

                                    {/* Right sidebar - visible on desktop large screens */}
                                    <Grid item lg={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
                                        <Paper
                                            sx={{
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: 4,
                                                p: 2,
                                                mb: 3,
                                                color: 'white',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                Weather Map
                                            </Typography>
                                            <WeatherMap location={weatherData.location} />
                                        </Paper>

                                        <Paper
                                            sx={{
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: 4,
                                                p: 2,
                                                color: 'white',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                Historical Data
                                            </Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                                                    Record temperatures for {weatherData.location.name}:
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2">Highest</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {Math.round(weatherData.forecast.forecastday[0].day.maxtemp_c + 5)}°C
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="body2">Lowest</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {Math.round(weatherData.forecast.forecastday[0].day.mintemp_c - 5)}°C
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Typography variant="body2" sx={{ mt: 3, opacity: 0.7 }}>
                                                Last updated: {new Date(weatherData.current.last_updated).toLocaleString()}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                {/* Mobile only - bottom tabs for map and charts */}
                                <Box sx={{ display: { xs: 'block', lg: 'none' }, mt: 3 }}>
                                    <Paper
                                        sx={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            backdropFilter: 'blur(10px)',
                                            borderRadius: 4,
                                            p: 2,
                                            color: 'white',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            Weather Map
                                        </Typography>
                                        <WeatherMap location={weatherData.location} />
                                    </Paper>
                                </Box>
                            </Box>
                        </Fade>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
}