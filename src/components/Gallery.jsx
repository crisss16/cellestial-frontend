import React, { useEffect, useState } from "react";
import { setDoc, deleteDoc, doc, collection, onSnapshot, query, orderBy, serverTimestamp, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useCart } from "../context/CartContext";
// IMPORTĂ ACEASTĂ LINIE:
import Masonry from "react-masonry-css"; 
import "./Gallery.css";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const { addToCart } = useCart();

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    const favRef = collection(db, "users", user.uid, "favorites");
    const unsub = onSnapshot(favRef, (snap) => {
      setFavorites(snap.docs.map((d) => d.id));
    });
    return () => unsub();
  }, [user]);

  const toggleFavorite = async (e, photo) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to add favorites.");
      return;
    }
    const favRef = doc(db, "users", user.uid, "favorites", photo.id);
    try {
      if (favorites.includes(photo.id)) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, { ...photo, createdAt: new Date() });
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm("Delete this masterpiece?")) return;
    try {
      await deleteDoc(doc(db, "photos", id));
    } catch (err) { console.error(err); }
  };

  // Configurația pentru coloane
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
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
      console.error("Error downloading image:", error);
      alert("Failed to download image.");
    }
  }

  const recordDownload = async (photo) => {
  if (!auth.currentUser) {
    console.log("User not logged in, download not recorded.");
    return;
  }

  try {
    await addDoc(collection(db, "users", auth.currentUser.uid, "downloads"), {
      photoId: photo.id,
      title: photo.title || "Untitled",
      url: photo.url,
      downloadedAt: serverTimestamp() // Folosește timpul serverului pentru ordine corectă
    });
    
    // Opțional: arată o notificare
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 3000);
  } catch (error) {
    console.error("Error recording download:", error);
  }
};

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Celestial Collection</h2>
        <p>Discover unique digital art for your space</p>
      </div>

      {/* MODIFICARE AICI: Folosim componenta Masonry în loc de div simplu */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {photos.map((p, i) => (
          <div key={p.id} className="masonry-item" onClick={() => setSelectedIndex(i)}>
            <div className="image-wrapper">
              <img src={p.url} alt={p.title} loading="lazy" />
              
              <div className="image-overlay">
                {user?.email === "admin@cellestial.com" && (
                  <button className="admin-delete" onClick={(e) => handleDelete(e, p.id)} type="button">
                    ✕
                  </button>
                )}
                
                <button 
                  className={`favorite-trigger ${favorites.includes(p.id) ? "active" : ""}`}
                  onClick={(e) => toggleFavorite(e, p)}
                >
                  {favorites.includes(p.id) ? "❤️" : "🤍"}
                </button>
                
                <div className="overlay-info">
                  <h4>{p.title}</h4>
                  <span>{p.price} €</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Masonry>

      {/* MODAL SECTION */}
      {selectedPhoto && (
        <div className="modal-backdrop" onClick={() => setSelectedIndex(null)}>
          <div className="modern-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedIndex(null)}>✕</button>
            
            <div className="modal-layout">
              <div className="modal-image-section">
                <img src={selectedPhoto.url} alt={selectedPhoto.title} />
              </div>
              
              <div className="modal-details-section">
                <div>
                  <span className="category-tag">Digital Art</span>
                  <h1>{selectedPhoto.title}</h1>
                  <p className="description">{selectedPhoto.description}</p>
                  <div className="price-tag">{selectedPhoto.price} €</div>
                </div>

                <div className="modal-actions">
               {/* Înlocuim Add to Cart cu Download */}
                 <button 
                  className="buy-button" // Păstrăm clasa pentru stil, sau schimbăm în download-button
                  onClick={() => {
                                downloadImage(selectedPhoto.url, selectedPhoto.title); // Descarcă poza
                                recordDownload(selectedPhoto); // Trimite info către Firestore pentru profil
                                 }}
                                 >
                                  ✨ Download Masterpiece
                  </button>
                  <button 
                    className={`fav-action ${favorites.includes(selectedPhoto.id) ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(e, selectedPhoto)}
                  >
                    {favorites.includes(selectedPhoto.id) ? "🤍 Added in Favorites" : "❤️ Add to Favorites"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirm && <div className="toast-notification">✨ Downloading started...</div>}
    </div>
  );
}

export default Gallery;