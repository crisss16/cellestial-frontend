import React, { useEffect, useState } from "react";
import { collection, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase"; // Atenție la literă: firebase vs Firebase
import { onAuthStateChanged } from "firebase/auth";
import { useCart } from "../context/CartContext";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const favRef = collection(db, "users", user.uid, "favorites");
    const unsub = onSnapshot(favRef, (snap) => {
      setFavorites(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  const showAddToCartPopup = () => {
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 2000);
  };

  const downloadImage = async (imageUrl, title) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title || "celestial-art"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Nu s-a putut descărca imaginea direct. Încearcă Click Dreapta -> Save Image As.");
  }
};

  if (!user) {
    return (
      <div className="fav-empty-state">
        <div className="empty-content">
          <span>❤️</span>
          <h2>Your Collection Awaits</h2>
          <p>Please log in to view and manage your favorite masterpieces.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fav-page-container">
      <div className="fav-header">
        <h1>Private Collection</h1>
        <p>{favorites.length} pieces saved to your favorites</p>
      </div>

      {favorites.length === 0 ? (
        <div className="fav-empty-state">
          <p>Your gallery is empty. Explore the universe and save what you love.</p>
        </div>
      ) : (
        <div className="fav-modern-grid">
          {favorites.map((photo) => (
            <div key={photo.id} className="fav-art-card" onClick={() => setSelectedPhoto(photo)}>
              <div className="fav-image-box">
                <img src={photo.url} alt={photo.title} loading="lazy" />
                <div className="fav-card-overlay">
                   <span>View Details</span>
                </div>
              </div>
              <div className="fav-card-details">
                <h4>{photo.title}</h4>
                <p className="fav-card-price">{photo.price} €</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL PROFESIONAL (Oglindește Gallery) --- */}
      {/* --- MODAL PROFESIONAL --- */}
{selectedPhoto && (
  <div className="modal-backdrop" onClick={() => setSelectedPhoto(null)}>
    <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close-btn" onClick={() => setSelectedPhoto(null)}>✕</button>
      
      <div className="modal-layout">
        <div className="modal-image-side">
          <img src={selectedPhoto.url} alt={selectedPhoto.title} />
        </div>
        
        <div className="modal-info-side">
          <div className="modal-text">
            <span className="modal-tag">Saved Masterpiece</span>
            <h2>{selectedPhoto.title}</h2>
            <p className="modal-desc">{selectedPhoto.description || "Digital artwork from the Celestial Collection."}</p>
            {/* Putem ascunde prețul dacă vrei să fie complet free */}
            <div className="modal-price">Free Collection</div>
          </div>

          <div className="modal-footer-actions">
            <div className="main-actions">
              {/* BUTONUL DE DOWNLOAD NOU */}
              <button 
                className="buy-btn" 
                onClick={() => downloadImage(selectedPhoto.url, selectedPhoto.title)}
              >
                ✨ Download Masterpiece
              </button>
            </div>
            
            <button className="remove-fav-btn" onClick={async () => {
                const favRef = doc(db, "users", user.uid, "favorites", selectedPhoto.id);
                await deleteDoc(favRef);
                setSelectedPhoto(null);
              }}
            >
              🗑️ Remove from Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {showConfirm && <div className="toast-notif">✨ Added to your cart!</div>}
    </div>
  );
}

export default Favorites;