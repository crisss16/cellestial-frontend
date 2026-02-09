import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Success.css";

export default function Success() {
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
            console.error("Download error:", error);
            alert("Nu s-a putut descărca imaginea automat. Încearcă Click Dreapta -> Save As.");
        }
    };

    return (
        <div className="page-container success-page">
            <div className="success-card">
                <div className="success-icon">✨</div>
                <h1>Plată Confirmată!</h1>
                <p>Mulțumim pentru achiziție. Arta ta digitală este gata pentru descărcare.</p>

                <div className="download-list">
                    {cart.map((item) => (
                        <div key={item.id} className="download-item">
                            <img src={item.url} alt={item.title} />
                            <div className="download-info">
                                <h4>{item.title}</h4>
                                <button 
                                    className="download-btn-action" 
                                    onClick={() => downloadImage(item.url, item.title)}
                                >
                                    Download High-Res
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <Link to="/gallery" className="back-home-btn" onClick={clearCart}>
                    Înapoi la Galerie
                </Link>
            </div>
        </div>
    );
}