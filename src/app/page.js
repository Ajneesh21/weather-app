import WeatherApp from '../components/WeatherApp';
import styles from '../styles/page.module.css';

export default function Home() {
    return (
        <main className={styles.container}>
            <WeatherApp />
            <footer className={styles.footer}>
                <p>Powered by <a href="https://www.weatherapi.com/" target="_blank" rel="noopener noreferrer">WeatherAPI.com</a></p>
            </footer>
        </main>
    );
}