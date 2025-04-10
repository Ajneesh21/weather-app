import React, { useState } from 'react';
import styles from '../styles/SearchBar.module.css';

export default function SearchBar({ onSearch }) {
    const [location, setLocation] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (location.trim()) {
            onSearch(location);
        }
    };

    return (
        <form className={styles.searchContainer} onSubmit={handleSubmit}>
            <input
                type="text"
                className={styles.locationInput}
                placeholder="Enter city name"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
                Search
            </button>
        </form>
    );
}