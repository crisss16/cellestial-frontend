import React, { useState } from 'react';
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import "./Auth.css";

export default function Signup() {
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault(); // Previne refresh-ul paginii
        setError("");

        // Validări
        if (!fullName.trim()) return setError("Te rugăm să introduci numele complet.");
        if (!email.trim()) return setError("Te rugăm să introduci adresa de email.");
        if (password.length < 6) return setError("Parola trebuie să aibă cel puțin 6 caractere.");
        if (password !== confirmPass) return setError("Parolele nu coincid.");
        if (!acceptTerms) return setError("Trebuie să accepți termenii și condițiile.");

        setLoading(true);

        try {
            // 1. Creare utilizator în Firebase Auth
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            // 2. Creare document utilizator în Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName: fullName.trim(),
                dob: dob || null,
                phone: phone || null,
                email: email.toLowerCase().trim(),
                photoURL: "",
                role: "user",
                createdAt: serverTimestamp() // Folosește timpul serverului pentru precizie
            });

            navigate("/gallery");
        } catch (err) {
            console.error(err);
            // Traducem câteva erori comune de la Firebase
            if (err.code === 'auth/email-already-in-use') {
                setError("Acest email este deja utilizat.");
            } else {
                setError("Înregistrarea a eșuat: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join the Celestial art community</p>
                </div>

                {error && <div className="auth-error-box">{error}</div>}

                <form onSubmit={handleSignup} className="auth-form">
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label>Date of Birth</label>
                            <input 
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Phone (optional)</label>
                            <input 
                                type="tel"
                                placeholder="07xx xxx xxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
            
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input 
                            type="password"
                            placeholder="Repeat password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            required
                        />
                    </div>

                    <label className="terms-checkbox">
                        <input 
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                        />
                        <span>I accept the <a href="#terms">Terms and Conditions</a></span>
                    </label>

                    <button 
                        type="submit" 
                        className="auth-btn" 
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Log In</Link></p>
                </div>
            </div>
        </div>
    );
}