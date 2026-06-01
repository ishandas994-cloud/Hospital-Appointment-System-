import React from 'react'
import { useEffect, useState } from 'react'
import { getMyAppointmentsAPI, cancelAppointmentAPI } from '../../api/appointmentAPI.js'
import { createReviewAPI } from '../../api/patientAPI.js'
import Navbar from '../../components/Navbar.jsx'
import AppointmentCard from '../../components/AppointmentCard.jsx'
import StarRating from '../../components/StarRating.jsx'
import Spinner from '../../components/Spinner.jsx'
import toast from 'react-hot-toast'

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [filter,       setFilter]       = useState('all')
  const [reviewModal,  setReviewModal]  = useState(null)
  const [rating,       setRating]       = useState(0)
  const [comment,      setComment]      = useState('')
  const [submitting,   setSubmitting]   = useState(false)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await getMyAppointmentsAPI()
      setAppointments(res.data.appointments || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAppointments() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    try {
      await cancelAppointmentAPI(id, { reason: 'Cancelled by patient' })
      toast.success('Appointment cancelled')
      fetchAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    }
  }

  const handleReviewSubmit = async () => {
    if (!rating) return toast.error('Please select a rating')
    setSubmitting(true)
    try {
      await createReviewAPI({
        appointmentId: reviewModal._id,
        rating,
        comment
      })
      toast.success('Review submitted!')
      setReviewModal(null)
      setRating(0)
      setComment('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
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
          My Appointments
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

        {/* Appointment list */}
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-500">No appointments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(apt => (
              <div key={apt._id}>
                <AppointmentCard
                  appointment={apt}
                  onCancel={handleCancel}
                />
                {apt.status === 'completed' && (
                  <div className="mt-2 ml-1">
                    <button
                      onClick={() => setReviewModal(apt)}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      ⭐ Leave a review for Dr. {apt.doctor?.user?.name}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-display font-bold text-lg mb-1">
              Rate Your Experience
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Dr. {reviewModal.doctor?.user?.name}
            </p>
            <StarRating value={rating} onChange={setRating} />
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience (optional)..."
              rows={3}
              className="input mt-4 resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setReviewModal(null); setRating(0); setComment('') }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={submitting}
                className="btn-primary flex-1"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}