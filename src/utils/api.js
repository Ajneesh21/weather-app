export async function getWeatherData(location) {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=5&aqi=no&alerts=no`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}
