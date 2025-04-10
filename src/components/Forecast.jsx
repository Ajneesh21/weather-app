import { Box, Typography, Grid, Slide } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ForecastCard = styled(Box)(({ theme, idx }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: 16,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-8px)',
        background: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    },
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    animation: `fadeIn 0.5s ease-in-out ${idx * 0.1}s both`,
    '@keyframes fadeIn': {
        '0%': {
            opacity: 0,
            transform: 'translateY(20px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
}));

export default function Forecast({ data, condition }) {
    if (!data || !data.forecast) return null;

    const { forecastday } = data.forecast;

    return (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={500}>
            <Box>
                <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                        mb: 3,
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                >
                    Weekly Forecast
                </Typography>

                <Grid container spacing={2}>
                    {forecastday.map((day, idx) => {
                        const date = new Date(day.date);
                        const isToday = idx === 0;
                        const dayName = isToday
                            ? 'Today'
                            : date.toLocaleDateString('en-US', { weekday: 'short' });
                        const monthDay = date.toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short'
                        });

                        // Calculate temperature difference for animation
                        const tempDiff = Math.round(day.day.maxtemp_c - day.day.mintemp_c);

                        return (
                            <Grid item xs={6} sm={4} md={3} key={day.date}>
                                <ForecastCard idx={idx}>
                                    {isToday && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: '0 0 8px 0',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            TODAY
                                        </Box>
                                    )}

                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'white',
                                            mb: 0.5,
                                        }}
                                    >
                                        {dayName}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(255,255,255,0.8)',
                                            mb: 1.5
                                        }}
                                    >
                                        {monthDay}
                                    </Typography>

                                    <Box sx={{
                                        position: 'relative',
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        my: 1,
                                    }}>
                                        <img
                                            src={day.day.condition.icon.replace('64x64', '128x128')}
                                            alt={day.day.condition.text}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))',
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'rgba(255,255,255,0.9)',
                                            textAlign: 'center',
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            mb: 1,
                                        }}
                                    >
                                        {day.day.condition.text}
                                    </Typography>

                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mr: 2,
                                        }}>
                                            <ArrowUpwardIcon
                                                sx={{
                                                    color: '#ff5722',
                                                    fontSize: '1rem',
                                                    mr: 0.5,
                                                }}
                                            />
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                }}
                                            >
                                                {Math.round(day.day.maxtemp_c)}°
                                            </Typography>
                                        </Box>

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <ArrowDownwardIcon
                                                sx={{
                                                    color: '#2196f3',
                                                    fontSize: '1rem',
                                                    mr: 0.5,
                                                }}
                                            />
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.8)',
                                                }}
                                            >
                                                {Math.round(day.day.mintemp_c)}°
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Additional weather info */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        mt: 2,
                                        pt: 1,
                                        borderTop: '1px solid rgba(255,255,255,0.2)',
                                    }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Rain
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'white' }}>
                                                {day.day.daily_chance_of_rain}%
                                            </Typography>
                                        </Box>

                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                Humidity
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'white' }}>
                                                {day.day.avghumidity}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ForecastCard>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Add a beautiful credit line */}
                <Typography
                    variant="caption"
                    sx={{
                        textAlign: 'center',
                        display: 'block',
                        mt: 4,
                        color: 'rgba(255,255,255,0.7)',
                    }}
                >
                    Weather data powered by WeatherAPI
                </Typography>
            </Box>
        </Slide>
    );
}