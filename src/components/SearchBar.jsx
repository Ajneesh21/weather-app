import React, { useState } from 'react';
import { Paper, InputBase, IconButton, Box, Zoom } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function SearchBar({ onSearch }) {
    const [location, setLocation] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (location.trim()) {
            onSearch(location);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    onSearch(`${latitude},${longitude}`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location. Please enter a city manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser. Please enter a city manually.");
        }
    };

    return (
        <Zoom in={true} timeout={500}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 4,
                width: '100%',
                maxWidth: 550,
                mx: 'auto'
            }}>
                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        borderRadius: 5,
                        boxShadow: isFocused ?
                            '0 8px 16px rgba(0, 0, 0, 0.2)' :
                            '0 4px 12px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        border: isFocused ? '2px solid #2196f3' : '2px solid transparent',
                    }}
                    onSubmit={handleSubmit}
                    elevation={isFocused ? 8 : 4}
                >
                    <InputBase
                        sx={{
                            ml: 2,
                            flex: 1,
                            fontSize: '1.1rem',
                            '&::placeholder': {
                                opacity: 0.7,
                            }
                        }}
                        placeholder="Search for a city..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <IconButton
                        onClick={getCurrentLocation}
                        sx={{
                            p: '10px',
                            '&:hover': {
                                color: '#2196f3'
                            }
                        }}
                    >
                        <LocationOnIcon />
                    </IconButton>
                    <IconButton
                        type="submit"
                        sx={{
                            p: '12px',
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '0 20px 20px 0',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            }
                        }}
                    >
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </Box>
        </Zoom>
    );
}