import { useRef, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Chart from 'chart.js/auto';

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

export default function WeatherCharts({ data }) {
    const temperatureChartRef = useRef(null);
    const humidityChartRef = useRef(null);

    useEffect(() => {
        if (!data || !data.forecast || !data.forecast.forecastday[0].hour) return;

        const hourlyData = data.forecast.forecastday[0].hour;
        const hours = hourlyData.map(h => new Date(h.time).getHours() + ':00');
        const temps = hourlyData.map(h => h.temp_c);
        const humidity = hourlyData.map(h => h.humidity);
        const feelsLike = hourlyData.map(h => h.feelslike_c);

        // Temperature Chart
        if (temperatureChartRef.current) {
            const tempCtx = temperatureChartRef.current.getContext('2d');

            // Destroy old chart if it exists
            if (temperatureChartRef.current.chart) {
                temperatureChartRef.current.chart.destroy();
            }

            temperatureChartRef.current.chart = new Chart(tempCtx, {
                type: 'line',
                data: {
                    labels: hours,
                    datasets: [
                        {
                            label: 'Temperature (°C)',
                            data: temps,
                            borderColor: '#FF9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            tension: 0.4,
                            borderWidth: 2,
                            fill: true,
                            pointBackgroundColor: '#FF9800',
                            pointRadius: 3,
                            pointHoverRadius: 5
                        },
                        {
                            label: 'Feels Like (°C)',
                            data: feelsLike,
                            borderColor: '#F44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.0)',
                            tension: 0.4,
                            borderWidth: 2,
                            borderDash: [5, 5],
                            pointBackgroundColor: '#F44336',
                            pointRadius: 2,
                            pointHoverRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: 'white',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                callback: function(value) {
                                    return value + '°C';
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                maxRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: 12
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        }

        // Humidity Chart
        if (humidityChartRef.current) {
            const humidityCtx = humidityChartRef.current.getContext('2d');

            // Destroy old chart if it exists
            if (humidityChartRef.current.chart) {
                humidityChartRef.current.chart.destroy();
            }

            humidityChartRef.current.chart = new Chart(humidityCtx, {
                type: 'line',
                data: {
                    labels: hours,
                    datasets: [
                        {
                            label: 'Humidity (%)',
                            data: humidity,
                            borderColor: '#2196F3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            tension: 0.4,
                            borderWidth: 2,
                            fill: true,
                            pointBackgroundColor: '#2196F3',
                            pointRadius: 3,
                            pointHoverRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: 'white',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                callback: function(value) {
                                    return value + '%';
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.7)',
                                maxRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: 12
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        }

        // Cleanup on unmount
        return () => {
            if (temperatureChartRef.current?.chart) {
                temperatureChartRef.current.chart.destroy();
            }
            if (humidityChartRef.current?.chart) {
                humidityChartRef.current.chart.destroy();
            }
        };
    }, [data]);

    return (
        <Box>
            <GlassCard>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Hourly Temperature Forecast
                </Typography>
                <Box sx={{ height: 300, position: 'relative' }}>
                    <canvas ref={temperatureChartRef} />
                </Box>
            </GlassCard>

            <GlassCard>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Hourly Humidity Forecast
                </Typography>
                <Box sx={{ height: 250, position: 'relative' }}>
                    <canvas ref={humidityChartRef} />
                </Box>
            </GlassCard>

            <GlassCard>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Hourly Details
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                    <Box sx={{ display: 'flex', minWidth: 800 }}>
                        {data.forecast.forecastday[0].hour
                            .filter((_, index) => index % 2 === 0) // Show every other hour to save space
                            .map((hour) => (
                                <Box
                                    key={hour.time}
                                    sx={{
                                        textAlign: 'center',
                                        p: 1.5,
                                        minWidth: 100,
                                        borderRight: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        {new Date(hour.time).getHours()}:00
                                    </Typography>
                                    <Box sx={{ my: 1 }}>
                                        <img
                                            src={hour.condition.icon}
                                            alt={hour.condition.text}
                                            style={{ width: 40, height: 40 }}
                                        />
                                    </Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        {Math.round(hour.temp_c)}°
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                        {hour.wind_kph} km/h
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                        {hour.chance_of_rain}% 💧
                                    </Typography>
                                </Box>
                            ))}
                    </Box>
                </Box>
            </GlassCard>
        </Box>
    );
}