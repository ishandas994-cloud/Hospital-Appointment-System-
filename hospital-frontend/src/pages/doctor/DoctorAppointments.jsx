import React from 'react'
import { useEffect, useState } from 'react'
import { getDoctorAppointmentsAPI, cancelAppointmentAPI, completeAppointmentAPI } from '../../api/appointmentAPI.js'
import Navbar from '../../components/Navbar.jsx'
import AppointmentCard from '../../components/AppointmentCard.jsx'
import Spinner from '../../components/Spinner.jsx'
import toast from 'react-hot-toast'

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [filter,       setFilter]       = useState('all')
  const [modal,        setModal]        = useState(null)
  const [notes,        setNotes]        = useState('')
  const [prescription, setPrescription] = useState('')
  const [completing,   setCompleting]   = useState(false)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await getDoctorAppointmentsAPI()
      setAppointments(res.data.appointments || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAppointments() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      await cancelAppointmentAPI(id, { reason: 'Cancelled by doctor' })
      toast.success('Appointment cancelled')
      fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await completeAppointmentAPI(modal._id, { notes, prescription })
      toast.success('Appointment marked as completed!')
      setModal(null)
      setNotes('')
      setPrescription('')
      fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete')
    } finally {
      setCompleting(false)
    }
  }

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          Appointments
        </h1>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-500">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(apt => (
              <AppointmentCard
                key={apt._id}
                appointment={apt}
                showDoctor={false}
                onCancel={handleCancel}
                onComplete={() => { setModal(apt); setNotes(''); setPrescription('') }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Complete appointment modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-display font-bold text-lg mb-1">
              Complete Appointment
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Patient: {modal.patient?.user?.name}
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Consultation Notes
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Patient diagnosis, observations..."
                  className="input resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Prescription
                </label>
                <textarea
                  value={prescription}
                  onChange={e => setPrescription(e.target.value)}
                  rows={3}
                  placeholder="Medicines, dosage, instructions..."
                  className="input resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setModal(null)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={completing}
                className="btn-primary flex-1"
              >
                {completing ? 'Saving...' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}