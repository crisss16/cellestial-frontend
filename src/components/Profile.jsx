import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom'; 
import {auth, db} from '../firebase';
import {updateProfile, onAuthStateChanged} from 'firebase/auth';
import {doc, updateDoc, setDoc, serverTimestamp} from "firebase/firestore";
import "./Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
        if (u) {
            setUser(u);
        }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) {
        return <div className="profile-loading">Loading profile...</div>;
    }
    if(!user) {
        return <Navigate to="/login" replace />;
    }

    const uploadAvatar = async (file) => {
        if(!file) return;

        setUploading(true);

        try {

        const formData = new FormData();
        formData.append("avatar", file);

        const res = await fetch("https://cellestial-api.onrender.com/", {
          method: "POST",
          body: formData,
     });

        const data = await res.json();

        if(!data.url) throw new Error("Upload failed");

        await setDoc(
            doc(db, "users", auth.currentUser.uid),
            {
                photoURL: data.url,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        await updateProfile(auth.currentUser, {
    photoURL: data.url
});

        setUser({ ...auth.currentUser, photoURL: data.url });

    } catch(err) {
        console.error(err);
        alert("Avatar upload failed.");
    } finally {
        setUploading(false);
    }
    };
       
    return (
        <div className="profile-page">
            <h2>My Profile</h2>

            <label className="avatar-wrapper">

            <img
              src={user.photoURL || "/avatar-placeholder.png"}
              key={user.photoURL}
              className="profile-avatar"
              alt="avatar"
            />
            <input
              type="file"
              accept="image/*"
              hidden 
              onChange={(e) => uploadAvatar(e.target.files[0])}
              disabled={uploading}
            />
            <span className="avatar-overlay">
                {uploading ? "Uploading..." : "Change Avatar"}
            </span>
            </label>

            <div className="profile-info">
            <p><strong>Email: </strong>{user.email}</p>
            <p><strong>User ID: </strong>{user.uid}</p>
            </div>
        </div>
    );
}

export default Profile;