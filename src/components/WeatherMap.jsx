import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function WeatherMap({ location }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulate loading effect for the map
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [location]);

    // Build OpenStreetMap URL
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.lon-0.1}%2C${location.lat-0.1}%2C${location.lon+0.1}%2C${location.lat+0.1}&layer=mapnik&marker=${location.lat}%2C${location.lon}`;

    // Handle errors
    const handleMapError = () => {
        setError("Failed to load map. Please try again later.");
        setIsLoading(false);
    };

    return (
        <Box sx={{ position: 'relative', height: 250, borderRadius: 2, overflow: 'hidden' }}>
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        zIndex: 1
                    }}
                >
                    <CircularProgress size={40} sx={{ color: 'white' }} />
                </Box>
            )}

            {error ? (
                <Box
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 2
                    }}
                >
                    <Typography variant="body2" color="error">
                        {error}
                    </Typography>
                </Box>
            ) : (
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={mapUrl}
                    style={{ border: 0, borderRadius: 8 }}
                    onError={handleMapError}
                    title={`Map of ${location.name}, ${location.country}`}
                />
            )}
        </Box>
    );
}