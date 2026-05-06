import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'
import BottomNav from './components/BottomNav'
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

          {/* Rutas protegidas con shell /app */}
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Outlet />}>
              <Route index element={<Dashboard />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="sell" element={<CreateListing />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="tickets/:id" element={<Tickets />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="payments" element={<Payments />} />
              <Route path="transactions" element={<MyPurchases />} />
              <Route path="settings" element={<Settings />} />
              <Route path="support" element={<Support />} />
              <Route path="listings" element={<MyListings />} />
              <Route path="listings/create" element={<CreateListing />} />
              <Route path="listings/edit/:id" element={<CreateListing />} />
              <Route path="products/:id" element={<Products />} />
            </Route>

            {/* Legacy aliases */}
            <Route path="/home" element={<Navigate to="/app" replace />} />
            <Route path="/dashboard" element={<Navigate to="/app" replace />} />
            <Route path="/marketplace" element={<Navigate to="/app/marketplace" replace />} />
            <Route path="/marketplace/publicar" element={<Navigate to="/app/listings/create" replace />} />
            <Route path="/payments" element={<Navigate to="/app/payments" replace />} />
            <Route path="/transactions" element={<Navigate to="/app/transactions" replace />} />
            <Route path="/listings" element={<Navigate to="/app/listings" replace />} />
            <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
            <Route path="/boletos" element={<Navigate to="/app/tickets" replace />} />
            <Route path="/boletos/:id" element={<Tickets />} />
            <Route path="/soporte" element={<Navigate to="/app/support" replace />} />
            <Route path="/perfil" element={<Navigate to="/app/profile" replace />} />
            <Route path="/notificaciones" element={<Navigate to="/app/notifications" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
