import UsersList from "../../features/users/UsersList";
import RegistrationForm from "../../features/registration/RegistrationForm";
import {Header} from "../../components/header/Header";
import styles from "./HomePage.module.scss";
import imageHeader from "./assets/image-header-body.png";
import React from "react";

export default function HomePage() {
    return (
        <>
            <Header />

            <main className={styles.container}>
                <section className={styles.hero}>
                    <div className={styles.blockImage}>
                        <img src={imageHeader} alt="Field" className={styles.heroImage} />
                    </div>
                    <div className={styles.blockHeroText}>
                        <div className={styles.heroText}>
                            <h1>Test assignment for front-end developer</h1>
                            <p>What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS with a vast understanding of User design thinking as they'll be building web interfaces with accessibility in mind. They should also be excited to learn, as the world of Front-End Development keeps evolving.</p>
                        </div>
                        <a href="#sign-up-form">Sign up</a>
                    </div>
                </section>

                <UsersList />

                <RegistrationForm />
            </main>
        </>
    );
}
