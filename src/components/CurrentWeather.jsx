import { Card, CardContent, Typography, Grid, Box, Divider, Chip } from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CompressIcon from '@mui/icons-material/Compress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';

const GlassCard = styled(Card)(({ theme, condition }) => ({
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    },
    position: 'relative',
    color: '#fff',
    '&::before': condition === 'rainy' ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,123,255,0.1))',
        pointerEvents: 'none',
    } : {},
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: 16,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    transition: 'transform 0.2s ease, background 0.2s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        background: 'rgba(255, 255, 255, 0.2)',
    }
}));

export default function CurrentWeather({ data, condition }) {
    if (!data) return null;

    const { location, current } = data;
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Determine time of day for styling
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 20;

    return (
        <GlassCard condition={condition} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ position: 'relative' }}>
                    <Chip
                        label={current.is_day ? "Day" : "Night"}
                        color={current.is_day ? "warning" : "primary"}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            fontWeight: 'bold',
                        }}
                    />

                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {location.name}, {location.country}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                            {date}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                        mb: 4,
                        mt: 4,
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: { sm: 4 },
                            mb: { xs: 2, sm: 0 }
                        }}>
                            <img
                                src={current.condition.icon.replace('64x64', '128x128')}
                                alt={current.condition.text}
                                style={{
                                    width: 120,
                                    height: 120,
                                    filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.3))',
                                    animation: condition === 'clear' ? 'pulse 2s infinite' : 'none',
                                }}
                            />
                            <Typography
                                variant="h1"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    ml: 2,
                                    fontSize: { xs: '3.5rem', sm: '4.5rem' },
                                    background: 'linear-gradient(45deg, #fff, #ccc)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                }}
                            >
                                {Math.round(current.temp_c)}°
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="h5"
                                component="div"
                                sx={{
                                    fontWeight: 'medium',
                                    mb: 1,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                }}
                            >
                                {current.condition.text}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Feels like {Math.round(current.feelslike_c)}°C
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />

                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}>
                            <InfoItem>
                                <OpacityIcon sx={{ fontSize: 28, mb: 1, color: '#4fc3f7' }} />
                                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                                    Humidity
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {current.humidity}%
                                </Typography>
                            </InfoItem>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                            <InfoItem>
                                <AirIcon sx={{ fontSize: 28, mb: 1, color: '#90caf9' }} />
                                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                                    Wind Speed
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {current.wind_kph} km/h
                                </Typography>
                            </InfoItem>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                            <InfoItem>
                                <ThermostatIcon sx={{ fontSize: 28, mb: 1, color: '#ef5350' }} />
                                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                                    Feels Like
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {Math.round(current.feelslike_c)}°C
                                </Typography>
                            </InfoItem>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                            <InfoItem>
                                <WbSunnyIcon sx={{ fontSize: 28, mb: 1, color: '#ffb74d' }} />
                                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                                    UV Index
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {current.uv}
                                </Typography>
                            </InfoItem>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                            <InfoItem>
                                <CompressIcon sx={{ fontSize: 28, mb: 1, color: '#ce93d8' }} />
                                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                                    Pressure
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {current.pressure_mb} mb
                                </Typography>
                            </InfoItem>
                        </Grid>

                        <Grid item xs={6} sm={4}>
                            <InfoItem>
                                <VisibilityIcon sx={{ fontSize: 28, mb: 1, color: '#b0bec5' }} />
                                <Typography variant="body2" sx={{ mb: 0.5, opacity: 0.9 }}>
                                    Visibility
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {current.vis_km} km
                                </Typography>
                            </InfoItem>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </GlassCard>
    );
}