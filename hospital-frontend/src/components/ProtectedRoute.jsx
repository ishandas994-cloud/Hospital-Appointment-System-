import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Protects a group of routes by role
// If not logged in → redirect to /login
// If wrong role → redirect to their own dashboard

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth()
  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    const dashboards = {
      patient: '/patient/dashboard',
      doctor:  '/doctor/dashboard',
      admin:   '/admin/dashboard'
    }
    return <Navigate to={dashboards[user.role] || '/'} replace />
  }

  return <Outlet />
}