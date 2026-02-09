import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Success.css"; // Folosește stilul de la pasul anterior

export default function PaymentSuccess() {
    const { cart, clearCart } = useCart();

    const downloadImage = async (imageUrl, fileName) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Eroare la download:", error);
            alert("Te rugăm să folosești click dreapta -> Salvează imaginea.");
        }
    };

    return (
        <div className="page-container success-page">
            <div className="success-card fade-in">
                <div className="success-icon">🎨</div>
                <h1>Plată Reușită!</h1>
                <p>Mulțumim! Arta ta "Cellestial" este gata de descărcat.</p>

                <div className="download-list">
                    {cart.map((item) => (
                        <div key={item.id} className="download-item">
                            <img src={item.url} alt={item.title} width="60" />
                            <div className="item-details">
                                <strong>{item.title}</strong>
                                <button onClick={() => downloadImage(item.url, item.title)} className="download-btn-action">
                                    Download JPEG
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <Link to="/gallery" className="back-home-btn" onClick={() => clearCart()}>
                    Închide și revino la Galerie
                </Link>
            </div>
        </div>
    );
}