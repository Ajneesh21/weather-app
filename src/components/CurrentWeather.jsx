import styles from '@/styles/Weather.module.css';

export default function CurrentWeather({ data }) {
    if (!data) return <div>Loading...</div>;

    const { location, current } = data;
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className={styles.weatherCard}>
            <h2 className={styles.location}>{location.name}, {location.country}</h2>
            <div className={styles.date}>{date}</div>
            <div className={styles.weatherInfo}>
                <img
                    className={styles.weatherIcon}
                    src={current.condition.icon}
                    alt={current.condition.text}
                />
                <div className={styles.temperature}>{Math.round(current.temp_c)}°C</div>
            </div>
            <div className={styles.description}>{current.condition.text}</div>
            <div className={styles.details}>
                <div className={styles.detail}>
                    <span>Humidity</span>
                    <span>{current.humidity}%</span>
                </div>
                <div className={styles.detail}>
                    <span>Wind</span>
                    <span>{current.wind_kph} km/h</span>
                </div>
                <div className={styles.detail}>
                    <span>Feels Like</span>
                    <span>{Math.round(current.feelslike_c)}°C</span>
                </div>
            </div>
        </div>
    );
}
