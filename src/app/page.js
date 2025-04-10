import WeatherApp from '../components/WeatherApp';
import styles from '../styles/page.module.css';

export default function Home() {
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Weather App</h1>
            <WeatherApp />
            <footer className={styles.footer}>
                <p>Powered by <a href="https://www.weatherapi.com/" target="_blank" rel="noopener noreferrer">WeatherAPI.com</a></p>
            </footer>
        </main>
    );
}