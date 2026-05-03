import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'
import BottomNav from './components/BottomNav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tickets from './pages/Tickets'
import Products from './pages/Products'
import Marketplace from './pages/Marketplace'
import Support from './pages/Support'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import PreLogin from './pages/PreLogin'
import Register from './pages/Register'
import RecoverPassword from './pages/RecoverPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import CreateListing from './pages/CreateListing'
import Payments from './pages/Payments'
import MyPurchases from './pages/MyPurchases'
import MyListings from './pages/MyListings'
import Settings from './pages/Settings'

import './index.css'

// Layout principal protegido con navegación inferior fija
function AppLayout() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null // Espera rehidratación de sesión

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <main>
        <Outlet />
      </main>
      <BottomNav />
      <Footer />
    </>
  )
}

// Layout sin Navbar (PreLogin, Login, Register)
function BlankLayout() {
  return (
    <main>
      <Outlet />
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas sin navbar (acceso público) */}
          <Route element={<BlankLayout />}>
            <Route path="/" element={<PreLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recover-password" element={<RecoverPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Rutas protegidas con navbar */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/publicar" element={<CreateListing />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/transactions" element={<MyPurchases />} />
            <Route path="/listings" element={<MyListings />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/boletos" element={<Tickets />} />
            <Route path="/boletos/:id" element={<Tickets />} />
            <Route path="/productos/:id" element={<Products />} />
            <Route path="/soporte" element={<Support />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/notificaciones" element={<Notifications />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
