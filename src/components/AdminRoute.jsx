import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AdminRoute = ({ children }) => {
  const [status, setStatus] = useState({ loading: true, isAdmin: false });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "admin@cellestial.com") {
        setStatus({ loading: false, isAdmin: true });
      } else {
        setStatus({ loading: false, isAdmin: false });
      }
    });
    return () => unsub();
  }, []);

  if (status.loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Checking permissions...</p>
      </div>
    );
  }

  return status.isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;