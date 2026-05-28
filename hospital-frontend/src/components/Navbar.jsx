import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { logoutAPI } from '../api/authAPI.js'
import toast from 'react-hot-toast'
import { useState } from 'react'
import React from "react";

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const location         = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try { await logoutAPI() } catch {}
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const navLinks = {
    patient: [
      { to: '/patient/dashboard',    label: 'Dashboard' },
      { to: '/patient/doctors',      label: 'Find Doctors' },
      { to: '/patient/appointments', label: 'Appointments' },
      { to: '/patient/profile',      label: 'Profile' },
    ],
    doctor: [
      { to: '/doctor/dashboard',    label: 'Dashboard' },
      { to: '/doctor/slots',        label: 'Manage Slots' },
      { to: '/doctor/appointments', label: 'Appointments' },
      { to: '/doctor/profile',      label: 'Profile' },
    ],
    admin: [
      { to: '/admin/dashboard',    label: 'Dashboard' },
      { to: '/admin/doctors',      label: 'Doctors' },
      { to: '/admin/users',        label: 'Users' },
      { to: '/admin/appointments', label: 'Appointments' },
    ],
  }

  const links = user ? navLinks[user.role] || [] : []

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-display font-bold text-xl text-primary-900">MediCare</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-outline text-sm py-1.5 px-4">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="btn-outline text-sm py-1.5 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Register</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="w-5 h-0.5 bg-slate-600 mb-1" />
              <div className="w-5 h-0.5 bg-slate-600 mb-1" />
              <div className="w-5 h-0.5 bg-slate-600" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm text-slate-600 hover:text-primary-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}