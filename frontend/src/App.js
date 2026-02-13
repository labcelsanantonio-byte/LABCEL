import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";

// Pages
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Customizer from "./pages/Customizer";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import MyOrders from "./pages/MyOrders";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthCallback from "./components/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Create axios instance with credentials
export const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Cart context
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function AppRouter() {
  const location = useLocation();
  
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  // Check URL fragment for session_id synchronously during render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<Catalog />} />
      <Route path="/personalizar" element={<Customizer />} />
      <Route path="/personalizar/:productId" element={<Customizer />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/rastrear" element={<TrackOrder />} />
      <Route path="/rastrear/:orderId" element={<TrackOrder />} />
      <Route path="/terminos" element={<Terms />} />
      <Route path="/privacidad" element={<Privacy />} />
      
      {/* Protected Routes */}
      <Route path="/mis-pedidos" element={
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/productos" element={
        <ProtectedRoute requireAdmin>
          <AdminProducts />
        </ProtectedRoute>
      } />
      <Route path="/admin/pedidos" element={
        <ProtectedRoute requireAdmin>
          <AdminOrders />
        </ProtectedRoute>
      } />
      <Route path="/admin/usuarios" element={
        <ProtectedRoute requireAdmin>
          <AdminUsers />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <AppRouter />
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" richColors closeButton />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
