import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

export default function About() {
    return (
        <div className="about-container">
            {/* Secțiunea Hero */}
            <section className="about-hero-section">
                <div className="hero-blur-circle"></div>
                <span className="about-subtitle">Behind the Lens</span>
                <h1 className="about-title">Our Cosmic Journey</h1>
                <p className="about-lead">Discovering the hidden beauty of the microscopic universe.</p>
            </section>

            {/* Povestea Noastră */}
            <section className="about-content-block">
                <div className="glass-card main-story">
                    <p>
                        Bine ați venit la <strong>Cellestial</strong>, destinația dvs. de top pentru picturi uimitoare cu celule la microscop! Suntem pasionați de frumusețea și complexitatea lumii microscopice și ne dedicăm să aducem aceste imagini fascinante în atenția publicului larg.
                    </p>
                    <p>
                        Echipa noastră este formată din cercetători și artiști talentați care colaborează pentru a crea piese de artă de înaltă calitate. Folosind tehnici avansate de microscopie și echipamente de ultimă generație, reușim să surprindem detalii incredibile care dezvăluie frumusețea ascunsă a vieții.
                    </p>
                </div>
            </section>

            {/* Features cu design nou */}
            <section className="about-features">
                <div className="feature-item">
                    <div className="feat-icon">✨</div>
                    <h3>Calitate Premium</h3>
                   {/* <p>Imprimare de înaltă rezoluție pe materiale atent selecționate.</p> */}
                </div>
                <div className="feature-item">
                    <div className="feat-icon">🧬</div>
                    <h3>Artă & Știință</h3>
                    <p>Fiecare piesă este o ilustrație autentică a vieții celulare.</p>
                </div>
                <div className="feature-item">
                    <div className="feat-icon">🚀</div>
                    <h3>Downloadare Instantanee</h3>
                   {/* <h3>Expediere Promptă</h3> */}
                   {/*<p>Ambalare sigură și livrare rapidă oriunde în lume.</p>*/}
                </div>
            </section>

            {/* Secțiunea Owner */}
            <section className="owner-section">
                <div className="owner-card">
                    <div className="owner-image-wrapper">
                        {/*<div className="owner-img-circle"></div>*/}
                    </div>
                    <div className="owner-info">
                        <span className="founder-label">Founder & Visionary</span>
                        <h2>Lumea în viziunea mea</h2>
                        <p>
                            Sunt pasionată de fuziunea dintre știință și estetică. Am creat <strong>Cellestial</strong> pentru a împărtăși frumusețea lumii microscopice prin picturi captivante. Fiecare imagine este o fereastră către universul invizibil, dezvăluind detalii uimitoare și culori vibrante.
                        </p>
                        <p className="owner-signature">Vă mulțumesc că explorați Cellestial alături de mine!</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <div className="about-final-cta">
                <h3>Ready to decorate your space?</h3>
                <Link to="/gallery" className="cta-button-pro">Explore the Collection</Link>
            </div>
        </div>
        
    );
}