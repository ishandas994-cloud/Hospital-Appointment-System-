import { useEffect, useState } from 'react'
import { getAllAppointmentsAPI } from '../../api/adminAPI.js'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [filter,       setFilter]       = useState('all')
  const [search,       setSearch]       = useState('')

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter !== 'all') params.status = filter
      const res = await getAllAppointmentsAPI(params)
      setAppointments(res.data.appointments || [])
    } catch {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [filter])

  const statusClass = {
    pending:   'badge-pending',
    confirmed: 'badge-confirmed',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
  }

  const filtered = appointments.filter(a =>
    a.patient?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.doctor?.user?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          All Appointments
        </h1>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient or doctor name..."
            className="input flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {['all', 'confirmed', 'completed', 'cancelled', 'pending'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-slate-500 mb-4">
          {filtered.length} appointment(s) found
        </p>

        {/* Table */}
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-500">No appointments found</p>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Patient</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Doctor</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Specialization</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Date & Time</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Reason</th>
                    <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(apt => (
                    <tr
                      key={apt._id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      {/* Patient */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">
                          {apt.patient?.user?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {apt.patient?.user?.email}
                        </p>
                      </td>

                      {/* Doctor */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">
                          Dr. {apt.doctor?.user?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {apt.doctor?.user?.email}
                        </p>
                      </td>

                      {/* Specialization */}
                      <td className="py-3 px-4 text-slate-600">
                        {apt.doctor?.specialization || 'N/A'}
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-4 text-slate-600">
                        {apt.slot?.date ? (
                          <>
                            <p>{format(new Date(apt.slot.date), 'dd MMM yyyy')}</p>
                            <p className="text-xs text-slate-400">
                              {apt.slot.startTime} – {apt.slot.endTime}
                            </p>
                          </>
                        ) : 'N/A'}
                      </td>

                      {/* Reason */}
                      <td className="py-3 px-4 text-slate-600 max-w-xs">
                        <p className="line-clamp-2">{apt.reason}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={statusClass[apt.status] || 'badge-pending'}>
                          {apt.status}
                        </span>
                        {apt.cancelledBy && (
                          <p className="text-xs text-slate-400 mt-1">
                            by {apt.cancelledBy}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}