import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getDoctorAppointmentsAPI } from '../../api/appointmentAPI.js'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import { format } from 'date-fns'

export default function DoctorDashboard() {
  const { user }   = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    getDoctorAppointmentsAPI()
      .then(r => setAppointments(r.data.appointments || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const today     = format(new Date(), 'yyyy-MM-dd')
  const todayApts = appointments.filter(a =>
    a.slot?.date?.slice(0, 10) === today && a.status === 'confirmed'
  )
  const total     = appointments.length
  const completed = appointments.filter(a => a.status === 'completed').length
  const pending   = appointments.filter(a => a.status === 'confirmed').length

  const stats = [
    { label: 'Today',     value: todayApts.length, color: 'text-blue-600',  bg: 'bg-blue-50'  },
    { label: 'Total',     value: total,            color: 'text-slate-700', bg: 'bg-slate-50' },
    { label: 'Completed', value: completed,        color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending',   value: pending,          color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Hello, Dr. {user?.name?.split(' ')[0]} 👨‍⚕️
          </h1>
          <p className="text-slate-500 mt-1">Here's your practice overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className={`card ${s.bg} text-center`}>
              <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-slate-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/doctor/slots"
            className="card bg-primary-600 text-white hover:bg-primary-700 transition-colors text-center"
          >
            <p className="text-3xl mb-2">🗓️</p>
            <h3 className="font-display font-semibold">Manage Slots</h3>
          </Link>
          <Link
            to="/doctor/appointments"
            className="card bg-accent-500 text-white hover:bg-accent-600 transition-colors text-center"
          >
            <p className="text-3xl mb-2">📋</p>
            <h3 className="font-display font-semibold">Appointments</h3>
          </Link>
          <Link
            to="/doctor/profile"
            className="card bg-purple-600 text-white hover:bg-purple-700 transition-colors text-center"
          >
            <p className="text-3xl mb-2">👤</p>
            <h3 className="font-display font-semibold">My Profile</h3>
          </Link>
        </div>

        {/* Today's appointments */}
        <div className="card">
          <h2 className="font-display font-semibold text-slate-800 mb-4">
            Today's Appointments
          </h2>
          {loading ? <Spinner /> : todayApts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🏖️</p>
              <p className="text-slate-500">No appointments today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayApts.map(apt => (
                <div
                  key={apt._id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {apt.patient?.user?.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {apt.slot?.startTime} – {apt.slot?.endTime}
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5 line-clamp-1">
                      {apt.reason}
                    </p>
                  </div>
                  <span className="badge-confirmed">Confirmed</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}