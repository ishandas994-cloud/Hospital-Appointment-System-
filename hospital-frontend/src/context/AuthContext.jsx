import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../api/axios.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  // On app load — if token exists, fetch current user
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) { setLoading(false); return }
      try {
        const res = await axiosInstance.get('/auth/me')
        setUser(res.data.user)
      } catch {
        // Token invalid or expired — clear everything
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [token])

  const login = (userData, tokenValue) => {
    localStorage.setItem('token', tokenValue)
    setToken(tokenValue)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}