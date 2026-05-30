import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { getMyAppointmentsAPI } from '../../api/appointmentAPI.js'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import { format } from 'date-fns'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyAppointmentsAPI()
      .then(r => setAppointments(r.data.appointments || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const upcoming  = appointments.filter(a => a.status === 'confirmed')
  const completed = appointments.filter(a => a.status === 'completed')
  const cancelled = appointments.filter(a => a.status === 'cancelled')

  const stats = [
    { label: 'Upcoming',  value: upcoming.length,  color: 'bg-blue-50 text-blue-700',   link: '/patient/appointments' },
    { label: 'Completed', value: completed.length, color: 'bg-green-50 text-green-700', link: '/patient/appointments' },
    { label: 'Cancelled', value: cancelled.length, color: 'bg-red-50 text-red-700',     link: '/patient/appointments' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's your health dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(s => (
            <Link
              key={s.label}
              to={s.link}
              className={`card text-center hover:shadow-md transition-shadow ${s.color}`}
            >
              <p className="text-3xl font-display font-bold">{s.value}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link
            to="/patient/doctors"
            className="card bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <p className="text-2xl mb-2">🔍</p>
            <h3 className="font-display font-semibold text-lg">Find a Doctor</h3>
            <p className="text-primary-100 text-sm mt-1">
              Browse specialists and book appointments
            </p>
          </Link>
          <Link
            to="/patient/appointments"
            className="card bg-accent-500 text-white hover:bg-accent-600 transition-colors"
          >
            <p className="text-2xl mb-2">📋</p>
            <h3 className="font-display font-semibold text-lg">My Appointments</h3>
            <p className="text-green-100 text-sm mt-1">
              View and manage your appointments
            </p>
          </Link>
        </div>

        {/* Upcoming appointments */}
        <div className="card">
          <h2 className="font-display font-semibold text-slate-800 mb-4">
            Upcoming Appointments
          </h2>
          {loading ? <Spinner /> : upcoming.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-slate-500">No upcoming appointments</p>
              <Link to="/patient/doctors" className="btn-primary inline-block mt-4 py-2">
                Book Now
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 3).map(apt => (
                <div key={apt._id} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-800">Dr. {apt.doctor?.user?.name}</p>
                    <p className="text-sm text-primary-600">{apt.doctor?.specialization}</p>
                    {apt.slot && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {format(new Date(apt.slot.date), 'dd MMM yyyy')} at {apt.slot.startTime}
                      </p>
                    )}
                  </div>
                  <span className="badge-confirmed">Confirmed</span>
                </div>
              ))}
              {upcoming.length > 3 && (
                <Link
                  to="/patient/appointments"
                  className="block text-center text-sm text-primary-600 hover:underline pt-2"
                >
                  View all {upcoming.length} appointments →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}