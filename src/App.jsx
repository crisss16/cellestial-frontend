import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Gallery from './components/Gallery.jsx'
import Favorites from './components/Favorites.jsx'
import AdminUpload from './components/AdminUpload.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import AdminRoute from "./components/AdminRoute.jsx"
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx'
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import UserProfile from './pages/UserProfile.jsx'
import Success from './components/Success.jsx'
import './App.css'

function App() {
  return (
    <CartProvider>
      <Navbar />

      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

         {/* <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
          /> */}

          <Route path="/payment-success" element={<Success />} />
         

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/checkout" element={
            
            <Checkout />
           
           } />

          <Route
            path="/upload"
            element={
              <AdminRoute>
                <AdminUpload />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;
