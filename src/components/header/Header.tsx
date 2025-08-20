import React from 'react';
import styles from './Header.module.scss';

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <img src="/images/Logo.svg" alt="Logo" />
                <nav className={styles.nav}>
                    <a href="#users">Users</a>
                    <a href="#sign-up-form">Sign up</a>
                </nav>
            </div>
        </header>
    );
};
