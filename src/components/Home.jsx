import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    return (
        <div className="home-hero">
            <div className="home-content">
                <span className="home-tagline">Digital Art & Cosmic Visions</span>
                <h1 className="home-title">Cellestial</h1>
                <p className="home-subtitle">
                    Discover unique masterpieces born from the intersection of technology and the stars.
                </p>
                
                <div className="home-actions">
                    <Link className="btn-primary-home" to="/gallery">
                        Explore Gallery
                    </Link>
                    <Link className="btn-secondary-home" to="/about">
                        Our Story
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;