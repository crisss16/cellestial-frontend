import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
    const navigate = useNavigate();
    const {cart, updateQuantity, removeFromCart, cartTotal} = useCart();

    return (
        <div className="cart-page-container">
            <header className="cart-header">
                <span className="cart-tag">Your Selection</span>
                <h1 className="cart-title">Shopping Cart</h1>
            </header>

            {cart.length === 0 ? (
                <div className="cart-empty-state">
                    <div className="empty-icon">🛍️</div>
                    <p>Your cart is looking a bit light.</p>
                    <Link to="/gallery" className="btn-return">Continue Exploring</Link>
                </div>
            ) : (
                <div className="cart-grid">
                    {/* Lista de produse */}
                    <div className="cart-items-section">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item-modern">
                                <div className="cart-item-image">
                                    <img src={item.url} alt={item.title} />
                                </div>

                                <div className="cart-item-info">
                                    <div className="item-header">
                                        <h3>{item.title}</h3>
                                        <button className="delete-icon-btn" onClick={() => removeFromCart(item.id)}>
                                            ✕
                                        </button>
                                    </div>
                                    <p className="item-category">Digital Art Print</p>
                                    
                                    <div className="item-footer">
                                        <div className="quantity-control">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <p className="item-subtotal">{(item.price * item.quantity).toFixed(2)} €</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Sumar Comandă */}
                    <aside className="cart-summary-card">
                        <h2>Order Summary</h2>
                        <div className="summary-details">
                            <div className="summary-line">
                                <span>Subtotal</span>
                                <span>{cartTotal} €</span>
                            </div>
                            <div className="summary-line">
                                <span>Shipping</span>
                                <span className="free-shipping">FREE</span>
                            </div>
                            <hr />
                            <div className="summary-line total">
                                <span>Total</span>
                                <span>{cartTotal} €</span>
                            </div>
                        </div>

                        <button className="checkout-btn-pro" onClick={() => navigate("/checkout")}>
                            Secure Checkout
                        </button>
                        
                        <div className="secure-badges">
                            <span>🔒 Secure Payment</span>
                            <span>✨ Satisfaction Guaranteed</span>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}