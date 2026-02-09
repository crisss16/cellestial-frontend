import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import "./Checkout.css";

const stripePromise = loadStripe("pk_test_51Sc5LfHHAB0A0BuUQSjUCerudUkeYMwlaOrFwmi4T2tEp989u6H0mtcWDWVIWhak4RaKsSSVge9hz1gCqfisc6y400P2ZuF9Jr");

export default function Checkout() {
    const { cart, cartTotal } = useCart();
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoadingUser(false);
        });
        return () => unsub();
    }, []);

   const handlePayment = async () => {
    try {
        const res = await fetch("http://127.0.0.1:5000/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart })
        });

        const data = await res.json();

        if (res.ok && data.url) {
            // REDIRECȚIONARE DIRECTĂ CĂTRE STRIPE
            window.location.href = data.url;
        } else {
            alert("Eroare: " + (data.error || "Nu s-a putut genera link-ul de plată."));
        }
    } catch (err) {
        console.error("Payment Error:", err);
        alert("Eroare de conexiune la server.");
    }
};

    if (loadingUser) return <div className="page-container center"><div className="loader"></div></div>;

    if (!user) {
        return (
            <div className="page-container checkout-auth-error">
                <div className="error-card">
                    <h1>🔒 Authentication Required</h1>
                    <p>Trebuie să fii autentificat pentru a finaliza comanda.</p>
                    <Link className="btn-primary" to="/login">Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container checkout-view">
            <header className="checkout-header">
                <h1>Finalizează Comanda</h1>
                <p>Verifică selecția ta înainte de plată</p>
            </header>

            {cart.length === 0 ? (
                <div className="empty-checkout">
                    <p>Coșul tău este gol.</p>
                    <Link to="/gallery" className="btn-secondary">Înapoi la Galerie</Link>
                </div>
            ) : (
                <div className="checkout-grid">
                    <div className="checkout-items-list">
                        {cart.map(item => (
                            <div key={item.id} className="checkout-item-card">
                                <img src={item.url} alt={item.title} />
                                <div className="item-info">
                                    <h4>{item.title}</h4>
                                    <p>{item.quantity} x {item.price} €</p>
                                </div>
                                <div className="item-subtotal">
                                    {(item.price * item.quantity).toFixed(2)} €
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="checkout-summary-sidebar">
                        <div className="summary-box">
                            <h3>Sumar Comandă</h3>
                            <div className="summary-row">
                                <span>Produse ({cart.length})</span>
                                <span>{cartTotal.toFixed(2)} €</span>
                            </div>
                            <div className="summary-row">
                                <span>Livrare Digitală</span>
                                <span className="free-text">GRATUIT</span>
                            </div>
                            <div className="summary-total-row">
                                <span>Total de plată</span>
                                <span>{cartTotal.toFixed(2)} €</span>
                            </div>
                            
                            <button className="pay-btn-premium" onClick={handlePayment}>
                                Plătește în Siguranță
                            </button>
                            
                            <p className="secure-text">
                                🛡️ Plată procesată securizat prin Stripe. 
                                Vei primi link-urile de download imediat după confirmare.
                            </p>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}