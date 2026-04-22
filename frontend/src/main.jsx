import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tickets from './pages/Tickets'
import Products from './pages/Products'
import Marketplace from './pages/Marketplace'
import Support from './pages/Support'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import PreLogin from './pages/PreLogin'

import './index.css'

// Layout con Navbar y Footer
function AppLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Layout sin Navbar (para PreLogin y Login)
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
      <Routes>
        <Route element={<BlankLayout />}>
          <Route path="/" element={<PreLogin />} />
          <Route path="/login" element={<Login />} />
        </Route>
        
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/boletos" element={<Tickets />} />
          <Route path="/boletos/:id" element={<Tickets />} />
          <Route path="/productos/:id" element={<Products />} />
          <Route path="/soporte" element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
