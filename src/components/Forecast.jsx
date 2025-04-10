import styles from '@/styles/Weather.module.css';

export default function Forecast({ data }) {
    if (!data || !data.forecast) return null;

    const { forecastday } = data.forecast;

    return (
        <div className={styles.forecastContainer}>
            {forecastday.map((day) => {
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                return (
                    <div key={day.date} className={styles.forecastCard}>
                        <div className={styles.forecastDay}>{dayName}</div>
                        <img
                            className={styles.forecastIcon}
                            src={day.day.condition.icon}
                            alt={day.day.condition.text}
                        />
                        <div className={styles.forecastTemp}>
                            {Math.round(day.day.maxtemp_c)}°/{Math.round(day.day.mintemp_c)}°
                        </div>
                    </div>
                );
            })}
        </div>
    );
}