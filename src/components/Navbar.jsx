import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [dbAvatar, setDbAvatar] = useState(""); 
    const navigate = useNavigate();

    const isAdmin = user?.email === "admin@cellestial.com";

    useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
        setUser(u);
        if (u) {
            // 1. Încercăm să luăm poza direct din obiectul de Auth (cea mai rapidă metodă)
            if (u.photoURL) {
                setDbAvatar(u.photoURL);
            }

            // 2. Ascultăm documentul corect din Firestore pentru actualizări live
            // Am schimbat calea ca să fie users/{uid}, nu users/{uid}/profile/info
            const userRef = doc(db, "users", u.uid);
            const unsubDoc = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Folosim photoURL pentru consistență cu UserProfile.js
                    setDbAvatar(data.photoURL || u.photoURL || "");
                }
            }, (err) => {
                console.error("Navbar Firestore Error:", err);
            });

            return () => unsubDoc();
        } else {
            setDbAvatar("");
        }
    });
    return () => unsubAuth();
}, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const closeDropdown = () => setProfileOpen(false);
        window.addEventListener("click", closeDropdown);
        return () => window.removeEventListener("click", closeDropdown);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setMenuOpen(false);
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : "transparent"}`}>
            {/* BURGER (LEFT) */}
            <div className={`burger ${menuOpen ? "toggle" : ""}`} onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
            }}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </div>

            <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
                Cellestial
            </Link>

            <div className="nav-left desktop-only">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
            </div>

            <div className="nav-right desktop-only">
                <Link to="/favorites" className="nav-icon">❤️</Link>
                {/*<Link to="/cart" className="nav-icon">🛒</Link>*/}

                {!user ? (
                    <div className="auth-buttons">
                        <Link to="/login" className="btn-log">Login</Link>
                        <Link to="/signup" className="btn-sign">Sign Up</Link>
                    </div>
                ) : (
                    <div className="profile-menu-container">
                        <div className="nav-profile-trigger" onClick={(e) => {
                            e.stopPropagation();
                            setProfileOpen(!profileOpen);
                        }}>
                            <img 
                                src={dbAvatar || 'https://via.placeholder.com/150'} 
                                alt="profile" 
                                className={`nav-avatar-img ${isAdmin ? "admin-border" : ""}`}
                            />
                        </div>

                        {profileOpen && (
                            <div className="nav-dropdown fade-in" onClick={(e) => e.stopPropagation()}>
                                <div className="dropdown-user-info">
                                    <p className="user-email-label">{user.email}</p>
                                    {isAdmin && <span className="admin-badge">ADMIN MODE</span>}
                                </div>
                                <hr />
                                {isAdmin ? (
                                    <>
                                        <Link to="/admin-dashboard" className="dropdown-item admin-item" onClick={() => setProfileOpen(false)}>📊 Dashboard</Link>
                                        <Link to="/upload" className="dropdown-item admin-item" onClick={() => setProfileOpen(false)}>📤 Upload Art</Link>
                                    </>
                                ) : (
                                    <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>👤 My Profile</Link>
                                )}
                                <button className="dropdown-item logout-item" onClick={handleLogout}>🛑 Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {menuOpen && (
                <div 
                    className="nav-overlay" 
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}

            {/* MOBILE SIDEBAR (LEFT) */}
            <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
                <div className="mobile-nav-links">
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
                    <hr />
                    {isAdmin && (
                        <>
                            <p className="mobile-section-label">Administration</p>
                            <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                            <Link to="/upload" onClick={() => setMenuOpen(false)}>📤 Upload Art</Link>
                            <hr />
                        </>
                    )}
                    <Link to="/favorites" onClick={() => setMenuOpen(false)}>Favorites ❤️</Link>
                    {/*<Link to="/cart" onClick={() => setMenuOpen(false)}>Cart 🛒</Link>*/}
                    {user ? (
                        <>
                            {!isAdmin && <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>}
                            <button className="mobile-logout" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <div className="mobile-auth">
                            <Link to="/login" className="btn-log" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="btn-sign" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
