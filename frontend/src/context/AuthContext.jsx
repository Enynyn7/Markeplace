import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Contexto de autenticación global.
 * Provee: user, login, logout, register, isAuthenticated, loading
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const STORAGE_KEY = 'udlap_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true mientras se carga del storage

  // Rehidratar sesión desde localStorage al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Realiza login contra POST /auth/login
   * @returns {Promise<object>} datos del usuario
   * @throws {Error} con mensaje de error si falla
   */
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || `Error ${res.status}`)
    }

    setUser(data.user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
    return data.user
  }

  /**
   * Registra un nuevo usuario en POST /auth/register
   * @returns {Promise<object>} datos del usuario creado
   */
  const register = async ({ email, password, firstName, lastName, phone }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName, phone }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || `Error ${res.status}`)
    }

    // Después del registro iniciamos sesión automáticamente
    setUser(data.user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
    return data.user
  }

  /** Cierra la sesión */
  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Hook para consumir el contexto */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
