import React, { useState } from 'react';
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import "./Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return setError("Please fill in all fields.");
        
        setError("");
        setLoading(true);

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            // Verificăm rolul, dar redirecționăm pe toată lumea la Home
            // Adminul va folosi butonul din Navbar pentru Upload
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    role: user.email === "admin@cellestial.com" ? "admin" : "user",
                    createdAt: new Date()
                });
            }

            // REZOLVARE: Trimitem utilizatorul la Home indiferent de rol
            navigate("/"); 
            
        } catch (err) {
            console.error("LOGIN ERROR:", err.code);
            const friendlyMessages = {
                "auth/user-not-found": "No user found with this email.",
                "auth/wrong-password": "Incorrect password.",
                "auth/invalid-email": "Please enter a valid email address."
            };
            setError(friendlyMessages[err.code] || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your details to access your gallery</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="input-field">
                        <label>Email Address</label>
                        <input 
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label>Password</label>
                        <input 
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="auth-error-msg">⚠️ {error}</div>}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Create one now</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;