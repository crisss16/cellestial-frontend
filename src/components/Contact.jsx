import React, { useState } from "react"; // Adaugă useState
import { db } from "../firebase"; // Importă baza de date
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import "./Contact.css";

export default function Contact() {
    // State pentru formular
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            // Trimitem datele către colecția "messages"
            await addDoc(collection(db, "messages"), {
                ...formData,
                sentAt: serverTimestamp(), // Adăugăm data trimiterii
                status: "unread" // Util pentru a le gestiona ulterior
            });

            alert('Mesajul tău a fost salvat în baza de date! ✨');
            
            // Resetăm formularul
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error("Error saving message:", error);
            alert("A apărut o eroare. Te rugăm să încerci mai târziu.");
        } finally {
            setSending(false);
        }
    };

    // Funcție pentru a actualiza state-ul la fiecare tastare
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="contact-container">
            {/* Header Secțiune */}
            <header className="contact-header">
                <span className="contact-tag">Get in Touch</span>
                <h1>Contact Us</h1>
                <p>Ai o întrebare, o idee sau vrei să colaborăm? Scrie-ne oricând.</p>
            </header>

            <div className="contact-wrapper">
                {/* Partea Stângă: Info Carduri */}
                <aside className="contact-sidebar">
                    <div className="info-box">
                        <div className="icon-circle">📧</div>
                        <div>
                            <span>Email Us (Available soon) </span>
                            <a href="mailto:hello@cellestial.com">
                                <h4>hello@cellestial.com</h4>
                            </a>
                        </div>
                    </div>

                    <div className="info-box">
                        <div className="icon-circle">📍</div>
                        <div>
                            <span>Location</span>
                            <h4>Cluj, România</h4>
                        </div>
                    </div>

                    <div className="info-box">
                        <div className="icon-circle">📞</div>
                        <div>
                            <span>Phone (Available soon)</span>
                            <a href="tel:+40712345678">
                                <h4>+40 712 345 678</h4>
                            </a>
                        </div>
                    </div>

                    <div className="social-links-wrapper">
                        <p>Follow our journey (soon):</p>
                        <div className="social-icons">
                            <a href="#facebook" className="social-link">Facebook </a>
                            <a href="#instagram" className="social-link"> Instagram </a>
                            <a href="#twitter" className="social-link"> Twitter</a>
                        </div>
                    </div>
                </aside>

                {/* Partea Dreaptă: Formular */}
                <main className="contact-form-card">
    <h2>Send a Message</h2>
    <form className="modern-form" onSubmit={handleSubmit}>
        <div className="form-row">
            <div className="input-group">
                <label>Full Name</label>
                <input 
                    type="text" 
                    name="name" // ADAUGĂ NAME
                    value={formData.name} // ADAUGĂ VALUE
                    onChange={handleChange} // ADAUGĂ ONCHANGE
                    placeholder="John Doe" 
                    required 
                />
            </div>
            <div className="input-group">
                <label>Email Address</label>
                <input 
                    type="email" 
                    name="email" // ADAUGĂ NAME
                    value={formData.email} // ADAUGĂ VALUE
                    onChange={handleChange} // ADAUGĂ ONCHANGE
                    placeholder="john@example.com" 
                    required 
                />
            </div>
        </div>
        <div className="input-group">
            <label>Subject</label>
            <input 
                type="text" 
                name="subject" // ADAUGĂ NAME
                value={formData.subject} // ADAUGĂ VALUE
                onChange={handleChange} // ADAUGĂ ONCHANGE
                placeholder="How can we help?" 
                required 
            />
        </div>
        <div className="input-group">
            <label>Message</label>
            <textarea 
                name="message" // ADAUGĂ NAME
                value={formData.message} // ADAUGĂ VALUE
                onChange={handleChange} // ADAUGĂ ONCHANGE
                placeholder="Tell us more about your ideas..." 
                required
            ></textarea>
        </div>
        <button type="submit" className="contact-submit-btn" disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
        </button>
    </form>
</main>
            </div>
     
            {/* Secțiune Hartă */}
            <section className="map-section">
                <div className="map-card">
                   <iframe
    title="Cellestial Location"
    src="https://www.google.com/maps?q=Piata+Unirii+Cluj-Napoca&output=embed"
    width="100%"
    height="450"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
></iframe>
                </div>
            </section>

            <footer className="contact-footer-minimal">
                <p>© {new Date().getFullYear()} Cellestial Art Studio. All rights reserved.</p>
                <p>Powered by <a href="https://pathologic.ro">Pathologic</a></p>
            </footer>
        </div>
    );
}