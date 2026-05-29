import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardAPI } from '../../api/adminAPI.js'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardAPI()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <><Navbar /><Spinner fullPage /></>

  const { stats, recentAppointments } = data

  const chartData = [
    { name: 'Confirmed', value: stats.appointmentStatus.confirmed, color: '#3b82f6' },
    { name: 'Completed', value: stats.appointmentStatus.completed, color: '#10b981' },
    { name: 'Cancelled', value: stats.appointmentStatus.cancelled, color: '#ef4444' },
  ]

  const statCards = [
    { label: 'Total Doctors',      value: stats.totalDoctors,      bg: 'bg-blue-50',   color: 'text-blue-700',   link: '/admin/doctors',      icon: '👨‍⚕️' },
    { label: 'Total Patients',     value: stats.totalPatients,     bg: 'bg-green-50',  color: 'text-green-700',  link: '/admin/users',         icon: '🧑‍⚕️' },
    { label: 'Total Appointments', value: stats.totalAppointments, bg: 'bg-purple-50', color: 'text-purple-700', link: '/admin/appointments',  icon: '📋' },
    { label: 'Pending Approvals',  value: stats.pendingDoctors,    bg: 'bg-amber-50',  color: 'text-amber-700',  link: '/admin/doctors',       icon: '⏳' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-slate-800">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Hospital overview and management</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(s => (
            <Link
              key={s.label}
              to={s.link}
              className={`card ${s.bg} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{s.icon}</span>
                {s.label === 'Pending Approvals' && stats.pendingDoctors > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
              <p className={`text-3xl font-display font-bold ${s.color}`}>
                {s.value}
              </p>
              <p className="text-sm text-slate-600 mt-1">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">

          {/* Chart */}
          <div className="card">
            <h2 className="font-display font-semibold text-slate-800 mb-4">
              Appointment Status
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick actions */}
          <div className="card">
            <h2 className="font-display font-semibold text-slate-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin/doctors"
                className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <span className="text-xl">⏳</span>
                <div>
                  <p className="font-semibold text-amber-800 text-sm">
                    Pending Doctor Approvals
                  </p>
                  <p className="text-amber-600 text-xs">
                    {stats.pendingDoctors} doctors waiting for approval
                  </p>
                </div>
              </Link>
              <Link
                to="/admin/appointments"
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <span className="text-xl">📋</span>
                <div>
                  <p className="font-semibold text-blue-800 text-sm">All Appointments</p>
                  <p className="text-blue-600 text-xs">
                    {stats.totalAppointments} total appointments
                  </p>
                </div>
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <span className="text-xl">👥</span>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Manage Users</p>
                  <p className="text-green-600 text-xs">
                    Activate or deactivate accounts
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent appointments table */}
        <div className="card">
          <h2 className="font-display font-semibold text-slate-800 mb-4">
            Recent Appointments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Patient</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Doctor</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Date</th>
                  <th className="text-left py-3 px-2 text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map(apt => (
                  <tr key={apt._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-2 font-medium text-slate-800">
                      {apt.patient?.user?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-slate-600">
                      Dr. {apt.doctor?.user?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-2 text-slate-500">
                      {apt.slot?.date
                        ? format(new Date(apt.slot.date), 'dd MMM yyyy')
                        : 'N/A'
                      }
                    </td>
                    <td className="py-3 px-2">
                      <span className={`badge-${apt.status}`}>{apt.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}