import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot, setDoc, serverTimestamp, collection, query, orderBy } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth'; // Necesar pentru a actualiza avatarul global
import "./UserProfile.css";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [activeTab, setActiveTab] = useState('overview');
    
    const [downloads, setDownloads] = useState([]); // Schimbat din orders în downloads
    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // 1. Gestionarea Autentificării
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return () => unsub();
    }, []);

    // 2. Încărcare date Profil și Istoric Descărcări
    useEffect(() => {
        if (!user) return;

        // Ascultăm schimbările pe documentul principal al userului
        const userRef = doc(db, "users", user.uid);
        const unsubUser = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setAvatarUrl(data.photoURL || ''); // Folosim photoURL (consecvent cu restul app)
                setDisplayName(data.displayName || '');
                setBio(data.bio || '');
            }
        });

        // Ascultăm sub-colecția de descărcări
        const q = query(
            collection(db, "users", user.uid, "downloads"),
            orderBy("downloadedAt", "desc")
        );
        const unsubDownloads = onSnapshot(q, (snap) => {
            setDownloads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (error) => {
            console.error("Eroare la încărcarea descărcărilor:", error);
        });

        return () => {
            unsubUser();
            unsubDownloads();
        };
    }, [user]);

   const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);

    try {
        const formData = new FormData();
        formData.append("avatar", file);

        const res = await fetch("https://cellestial-api.onrender.com", {
            method: "POST",
            body: formData,
        });
        const data = await res.json();

        if (data.url) {
            // 1. Update în Firestore
            await setDoc(doc(db, "users", user.uid), { photoURL: data.url }, { merge: true });
            
            // 2. Update în Firebase AUTH (asta vede Navbar-ul)
            await updateProfile(auth.currentUser, { photoURL: data.url });
            
            // 3. REÎNCĂRCARE DATE AUTH
            await auth.currentUser.reload(); 
            
            // 4. Update State local
            setAvatarUrl(data.url);
            
            // 5. Trimite un semnal către Navbar
            window.dispatchEvent(new Event("storage")); 
        }
    } catch (err) {
        alert("Eroare: " + err.message);
    } finally {
        setUploadingAvatar(false);
    }
};

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const ref = doc(db, "users", user.uid);
            await setDoc(ref, {
                photoURL: avatarUrl,
                displayName,
                bio,
                updatedAt: serverTimestamp(),
            }, { merge: true });
            
            await updateProfile(auth.currentUser, { displayName: displayName });
            
            setActiveTab('overview');
            alert("Profile saved!");
        } catch (error) {
            alert("Failed to save profile: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    if (!user) return <div className="loading-screen"><h2>Please log in...</h2></div>;

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <div className="sidebar-profile-info">
                    <img src={avatarUrl || 'https://via.placeholder.com/150'} alt="User" />
                    <h3>{displayName || 'User'}</h3>
                </div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                        Overview
                    </button>
                    <button className={activeTab === 'edit' ? 'active' : ''} onClick={() => setActiveTab('edit')}>
                        Edit Profile
                    </button>
                    <button className={activeTab === 'downloads' ? 'active' : ''} onClick={() => setActiveTab('downloads')}>
                        My Downloads
                    </button>
                </nav>
            </aside>

            <main className="dashboard-content">
                {activeTab === 'overview' && (
                    <div className="content-view fade-in">
                        <div className="welcome-header">
                            <h2>{getGreeting()}, {displayName || 'Explorer'}! ✨</h2>
                            <p>Welcome to Cellestial Universe.</p>
                        </div>

                        <div className="stats-row">
                            <div className="stat-card clickable" onClick={() => setActiveTab('downloads')}>
                                <span className="stat-icon">📥</span>
                                <div className="stat-info">
                                    <span className="stat-value">{downloads.length}</span>
                                    <span className="stat-label">Total Downloads</span>
                                </div>
                                <div className="stat-arrow">→</div>
                            </div>
                            <div className="stat-card">
                                <span className="stat-icon">📅</span>
                                <div className="stat-info">
                                    <span className="stat-value">2026</span>
                                    <span className="stat-label">Registration Year</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-hero-card">
                            <div className="profile-hero-bg"></div>
                            <div className="profile-hero-content">
                                <div className="hero-avatar-wrapper">
                                    <img src={avatarUrl || 'https://via.placeholder.com/150'} alt="Avatar" />
                                </div>
                                <div className="hero-text">
                                    <h3 className="hero-name">{displayName || 'Anonymous Explorer'}</h3>
                                    <p className="hero-email">{user.email}</p>
                                    <div className="hero-bio-quote">
                                        <p>{bio || "No bio added yet. Share your cosmic vision!"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'edit' && (
                    <div className="content-edit fade-in">
                        <h2>Edit Profile</h2>
                        <div className="edit-form-wrapper">
                            <div className="avatar-edit-part">
                                <img src={avatarUrl || 'https://via.placeholder.com/150'} alt="Preview" />
                                <label className="avatar-upload-btn">
                                    {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                                    <input type="file" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <div className="inputs-part">
                                <label>Display Name</label>
                                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="How shall we call you?" />
                                <label>Bio</label>
                                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="4" placeholder="Tell us your story..." />
                                <button className="save-btn" onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'downloads' && (
                    <div className="content-orders fade-in">
                        <h2>My Downloads</h2>
                        {downloads.length === 0 ? (
                            <div className="empty-state">
                                <p>No digital art collected yet.</p>
                                <button className="shop-btn" onClick={() => window.location.href = '/gallery'}>Explore Gallery</button>
                            </div>
                        ) : (
                            <div className="downloads-grid">
                                {downloads.map(item => (
                                    <div key={item.id} className="download-mini-card">
                                        <img src={item.url} alt={item.title} />
                                        <div className="mini-card-info">
                                            <h4>{item.title}</h4>
                                            <a href={item.url} download target="_blank" rel="noreferrer">Redownload</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserProfile;