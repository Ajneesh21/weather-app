import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import WaterIcon from '@mui/icons-material/Water';
import AirIcon from '@mui/icons-material/Air';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

const GlassCard = styled(Paper)(({ theme }) => ({
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
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3)
}));

export default function WeatherAlerts({ data }) {
    const { current, forecast } = data;

    // Define weather alert thresholds
    const highWindThreshold = 30; // km/h
    const highTempThreshold = 30; // Celsius
    const lowTempThreshold = 5; // Celsius
    const highUVThreshold = 7; // UV index
    const highRainChanceThreshold = 60; // %

    // Check for current conditions that might need alerts
    const alerts = [];

    if (current.wind_kph >= highWindThreshold) {
        alerts.push({
            type: 'wind',
            severity: 'warning',
            icon: <AirIcon />,
            title: 'High Wind Alert',
            description: `Strong winds of ${Math.round(current.wind_kph)} km/h. Secure loose objects outdoors.`
        });
    }

    if (current.temp_c >= highTempThreshold) {
        alerts.push({
            type: 'temperature',
            severity: 'warning',
            icon: <WbSunnyIcon />,
            title: 'High Temperature Alert',
            description: `Current temperature is ${Math.round(current.temp_c)}°C. Stay hydrated and avoid prolonged sun exposure.`
        });
    }

    if (current.temp_c <= lowTempThreshold) {
        alerts.push({
            type: 'temperature',
            severity: 'info',
            icon: <WbSunnyIcon />,
            title: 'Low Temperature Alert',
            description: `Current temperature is ${Math.round(current.temp_c)}°C. Bundle up and stay warm.`
        });
    }

    if (current.uv >= highUVThreshold) {
        alerts.push({
            type: 'uv',
            severity: 'warning',
            icon: <WbSunnyIcon />,
            title: 'High UV Index',
            description: `UV Index of ${current.uv}. Use sunscreen and protective clothing when outdoors.`
        });
    }

    // Check forecast for tomorrow
    const tomorrowForecast = forecast.forecastday[1]?.day;
    if (tomorrowForecast && tomorrowForecast.daily_chance_of_rain >= highRainChanceThreshold) {
        alerts.push({
            type: 'rain',
            severity: 'info',
            icon: <WaterDropIcon />,
            title: 'Rain Tomorrow',
            description: `${tomorrowForecast.daily_chance_of_rain}% chance of rain tomorrow. Consider bringing an umbrella.`
        });
    }

    // Create fake thunderstorm alert for demonstration (usually this would come from a weather alerts API)
    if (Math.random() > 0.7) {
        alerts.push({
            type: 'storm',
            severity: 'error',
            icon: <ThunderstormIcon />,
            title: 'Thunderstorm Watch',
            description: 'Potential for thunderstorms in the next 24-48 hours. Stay informed and prepare for possible strong winds and lightning.'
        });
    }

    // Get color based on severity
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'error': return '#f44336';
            case 'warning': return '#ff9800';
            case 'info': return '#2196f3';
            default: return '#2196f3';
        }
    };

    return (
        <Box>
            <GlassCard>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Detailed Weather Conditions
                </Typography>

                <List sx={{ width: '100%' }}>
                    <ListItem>
                        <ListItemIcon sx={{ color: 'white' }}>
                            <WaterDropIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Humidity"
                            secondary={`${current.humidity}%`}
                            secondaryTypographyProps={{ color: 'white' }}
                        />
                    </ListItem>
                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

                    <ListItem>
                        <ListItemIcon sx={{ color: 'white' }}>
                            <AirIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Wind"
                            secondary={`${current.wind_kph} km/h, ${current.wind_dir}`}
                            secondaryTypographyProps={{ color: 'white' }}
                        />
                    </ListItem>
                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

                    <ListItem>
                        <ListItemIcon sx={{ color: 'white' }}>
                            <CompareArrowsIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Pressure"
                            secondary={`${current.pressure_mb} hPa`}
                            secondaryTypographyProps={{ color: 'white' }}
                        />
                    </ListItem>
                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

                    <ListItem>
                        <ListItemIcon sx={{ color: 'white' }}>
                            <VisibilityIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Visibility"
                            secondary={`${current.vis_km} km`}
                            secondaryTypographyProps={{ color: 'white' }}
                        />
                    </ListItem>
                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

                    <ListItem>
                        <ListItemIcon sx={{ color: 'white' }}>
                            <WbSunnyIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="UV Index"
                            secondary={current.uv}
                            secondaryTypographyProps={{ color: 'white' }}
                        />
                    </ListItem>
                </List>
            </GlassCard>

            {alerts.length > 0 && (
                <GlassCard>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Weather Alerts & Notifications
                    </Typography>

                    {alerts.map((alert, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 2,
                                mb: 2,
                                borderRadius: 2,
                                backgroundColor: `${getSeverityColor(alert.severity)}22`,
                                border: `1px solid ${getSeverityColor(alert.severity)}44`,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ mr: 1, color: getSeverityColor(alert.severity) }}>
                                    {alert.icon}
                                </Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {alert.title}
                                </Typography>
                                <Box sx={{ ml: 'auto' }}>
                                    <Chip
                                        size="small"
                                        label={alert.severity.toUpperCase()}
                                        sx={{
                                            backgroundColor: getSeverityColor(alert.severity),
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Typography variant="body2">
                                {alert.description}
                            </Typography>
                        </Box>
                    ))}
                </GlassCard>
            )}

            <GlassCard>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Astronomical Data
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            Sunrise
                        </Typography>
                        <Typography variant="h6">
                            {forecast.forecastday[0].astro.sunrise}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            Sunset
                        </Typography>
                        <Typography variant="h6">
                            {forecast.forecastday[0].astro.sunset}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            Moon Phase
                        </Typography>
                        <Typography variant="h6">
                            {forecast.forecastday[0].astro.moon_phase}
                        </Typography>
                    </Box>
                </Box>
            </GlassCard>
        </Box>
    );
}