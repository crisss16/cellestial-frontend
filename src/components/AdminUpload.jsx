import { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./AdminUpload.css";

function AdminUpload() {

    console.log("TEST CLOUD NAME:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleUpload = async () => {
        // Citim variabilele de mediu în interiorul funcției
        const cloudName = "dneprwaix";
        const uploadPreset = "cellestial_unsigned";
        const folder = "cellestial/photos";

        console.log("Using manual config:", { cloudName, uploadPreset });

        // Verificăm dacă variabilele sunt încărcate
        if (!cloudName || !uploadPreset) {
            console.error("Cloudinary Config Missing:", { cloudName, uploadPreset });
            setMsg("Eroare: Configurația Cloudinary lipsește în fișierul .env!");
            return;
        }

        if (!file || !title || !price) {
            setMsg("Te rugăm să completezi toate câmpurile obligatorii.");
            return;
        }

        setLoading(true);
        setMsg("");

        try {
            // 1. Încărcare imagine pe Cloudinary
            const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", uploadPreset);
            if (folder) fd.append("folder", folder);

            const res = await fetch(endpoint, { method: "POST", body: fd });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error?.message || "Cloudinary upload failed");
            }

            // 2. Salvare date în Firestore
            await addDoc(collection(db, "photos"), {
                title: title.trim(),
                price: Number(price) || 0,
                description: description.trim(),
                url: data.secure_url,
                publicId: data.public_id,
                createdAt: serverTimestamp(),
                ownerUid: auth.currentUser?.uid || null,
                ownerEmail: auth.currentUser?.email || null,
            });

            setMsg("✨ Opera de artă a fost încărcată cu succes!");
            
            // Resetare formular
            setFile(null);
            setPreview(null);
            setTitle("");
            setDescription("");
            setPrice("");
        } catch (e) {
            console.error("Upload Error:", e);
            setMsg(`❌ Eroare: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-container">
                <div className="upload-header">
                    <h2>Upload to Gallery</h2>
                    <p>Adaugă o piesă nouă în colecția ta celestială</p>
                </div>

                <div className="upload-grid">
                    {/* Partea Stângă: Preview Imagine */}
                    <div className="upload-dropzone">
                        {preview ? (
                            <div className="preview-box">
                                <img src={preview} alt="Preview" />
                                <button 
                                    className="remove-btn" 
                                    onClick={() => { setFile(null); setPreview(null); }}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <label className="file-label">
                                <div className="upload-icon">📸</div>
                                <span>Selectează sau trage imaginea aici</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                    hidden 
                                />
                            </label>
                        )}
                    </div>

                    {/* Partea Dreaptă: Formular */}
                    <div className="upload-form">
                        <div className="input-group">
                            <label>Titlu lucrare</label>
                            <input 
                                type="text" 
                                placeholder="ex: Midnight Nebula" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                        </div>

                        <div className="input-group">
                            <label>Preț (€)</label>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)} 
                            />
                        </div>

                        <div className="input-group">
                            <label>Descriere</label>
                            <textarea 
                                placeholder="Spune povestea acestei creații..." 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </div>

                        <button 
                            className="upload-btn" 
                            onClick={handleUpload} 
                            disabled={loading}
                        >
                            {loading ? "Se procesează..." : "Publică în Galerie"}
                        </button>

                        {msg && (
                            <p className={`status-msg ${msg.includes('succes') ? 'success' : 'error'}`}>
                                {msg}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUpload;