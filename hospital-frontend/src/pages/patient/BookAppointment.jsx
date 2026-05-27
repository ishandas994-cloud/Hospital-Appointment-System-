import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDoctorByIdAPI, getDoctorSlotsAPI } from '../../api/doctorAPI.js'
import { bookAppointmentAPI } from '../../api/appointmentAPI.js'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import toast from 'react-hot-toast'
import { format, addDays } from 'date-fns'

export default function BookAppointment() {
  const { doctorId } = useParams()
  const navigate     = useNavigate()

  const [doctor,       setDoctor]       = useState(null)
  const [slots,        setSlots]        = useState([])
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [reason,       setReason]       = useState('')
  const [loading,      setLoading]      = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [booking,      setBooking]      = useState(false)

  // Generate next 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i)
    return {
      label: format(d, 'EEE dd'),
      value: format(d, 'yyyy-MM-dd')
    }
  })

  // Fetch doctor info on mount
  useEffect(() => {
    getDoctorByIdAPI(doctorId)
      .then(r => setDoctor(r.data.doctor))
      .catch(() => toast.error('Doctor not found'))
      .finally(() => setLoading(false))
  }, [doctorId])

  // Fetch slots when date changes
  useEffect(() => {
    setSlotsLoading(true)
    setSelectedSlot(null)
    getDoctorSlotsAPI(doctorId, selectedDate)
      .then(r => setSlots(r.data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [doctorId, selectedDate])

  const handleBook = async () => {
    if (!selectedSlot)    return toast.error('Please select a time slot')
    if (!reason.trim())   return toast.error('Please enter reason for visit')

    setBooking(true)
    try {
      await bookAppointmentAPI({ doctorId, slotId: selectedSlot, reason })
      toast.success('Appointment booked successfully!')
      navigate('/patient/appointments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <><Navbar /><Spinner fullPage /></>

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          Book Appointment
        </h1>

        {/* Doctor info card */}
        {doctor && (
          <div className="card mb-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              {doctor.user?.profilePhoto ? (
                <img src={doctor.user.profilePhoto} className="w-14 h-14 rounded-2xl object-cover" />
              ) : (
                <span className="text-2xl font-bold text-primary-700">
                  {doctor.user?.name?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-display font-semibold text-slate-800">
                Dr. {doctor.user?.name}
              </h2>
              <p className="text-sm text-primary-600">{doctor.specialization}</p>
              <p className="text-sm text-slate-500">
                ₹{doctor.consultationFee} consultation fee
              </p>
            </div>
          </div>
        )}

        {/* Step 1 — Select Date */}
        <div className="card mb-4">
          <h3 className="font-semibold text-slate-700 mb-3">
            Step 1 — Select Date
          </h3>
          <div className="flex gap-2 flex-wrap">
            {days.map(d => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDate === d.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — Select Time Slot */}
        <div className="card mb-4">
          <h3 className="font-semibold text-slate-700 mb-3">
            Step 2 — Select Time Slot
          </h3>
          {slotsLoading ? <Spinner /> : slots.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No available slots for this date
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map(slot => (
                <button
                  key={slot._id}
                  onClick={() => setSelectedSlot(slot._id)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    selectedSlot === slot._id
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-700'
                  }`}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 3 — Reason */}
        <div className="card mb-6">
          <h3 className="font-semibold text-slate-700 mb-3">
            Step 3 — Reason for Visit
          </h3>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Describe your symptoms or reason for this appointment..."
            rows={3}
            className="input resize-none"
          />
        </div>

        <button
          onClick={handleBook}
          disabled={booking || !selectedSlot}
          className="btn-primary w-full py-3 text-base"
        >
          {booking ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </div>
    </div>
  )
}