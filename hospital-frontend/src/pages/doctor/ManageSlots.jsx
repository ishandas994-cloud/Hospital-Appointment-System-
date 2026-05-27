import { useEffect, useState } from 'react'
import { createSlotsAPI, getDoctorSlotsAPI } from '../../api/doctorAPI.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import toast from 'react-hot-toast'
import { format, addDays } from 'date-fns'
import axiosInstance from '../../api/axios.js'

const TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','12:00','12:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30'
]

export default function ManageSlots() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [slots,        setSlots]        = useState([])
  const [selected,     setSelected]     = useState([])
  const [loading,      setLoading]      = useState(false)
  const [creating,     setCreating]     = useState(false)
  const [doctorId,     setDoctorId]     = useState(null)

  // Next 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), i)
    return {
      label: format(d, 'EEE dd MMM'),
      value: format(d, 'yyyy-MM-dd')
    }
  })

  // Get doctor's own ID first
  useEffect(() => {
    axiosInstance.get('/doctors')
      .then(r => {
        // find doctor by matching user id
        const doc = r.data.doctors?.find(d => d.user?._id === user?._id)
        if (doc) setDoctorId(doc._id)
      })
      .catch(() => {})
  }, [user])

  const fetchSlots = async () => {
    if (!doctorId) return
    setLoading(true)
    try {
      const res = await getDoctorSlotsAPI(doctorId, selectedDate)
      setSlots(res.data.slots || [])
    } catch {
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSlots() }, [selectedDate, doctorId])

  const toggleSelect = (t) => {
    setSelected(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  const handleCreate = async () => {
    if (selected.length === 0) return toast.error('Select at least one time slot')
    setCreating(true)
    try {
      const slotsPayload = selected.map(t => {
        const [h, m] = t.split(':').map(Number)
        const endHour   = m === 30 ? h + 1 : h
        const endMin    = m === 30 ? '00' : '30'
        const endTime   = `${String(endHour).padStart(2, '0')}:${endMin}`
        return { startTime: t, endTime }
      })
      await createSlotsAPI({ date: selectedDate, slots: slotsPayload })
      toast.success(`${selected.length} slot(s) created!`)
      setSelected([])
      fetchSlots()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create slots')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          Manage Slots
        </h1>

        {/* Date selector */}
        <div className="card mb-4">
          <h2 className="font-semibold text-slate-700 mb-3">Select Date</h2>
          <div className="flex gap-2 flex-wrap">
            {days.map(d => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
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

        {/* Add new slots */}
        <div className="card mb-4">
          <h2 className="font-semibold text-slate-700 mb-1">
            Add Slots for {selectedDate}
          </h2>
          <p className="text-xs text-slate-400 mb-3">
            Click to select time slots, then click Create
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
            {TIME_SLOTS.map(t => (
              <button
                key={t}
                onClick={() => toggleSelect(t)}
                className={`py-2 rounded-xl text-sm font-medium transition-all ${
                  selected.includes(t)
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={handleCreate}
            disabled={creating || selected.length === 0}
            className="btn-primary"
          >
            {creating
              ? 'Creating...'
              : `Create ${selected.length} Slot${selected.length !== 1 ? 's' : ''}`
            }
          </button>
        </div>

        {/* Existing slots */}
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-3">
            Existing Slots for {selectedDate}
          </h2>
          {loading ? <Spinner /> : slots.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No slots created for this date yet
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map(slot => (
                <div
                  key={slot._id}
                  className={`p-3 rounded-xl text-center text-sm ${
                    slot.isBooked
                      ? 'bg-green-100 text-green-700'
                      : slot.isBlocked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <p className="font-medium">{slot.startTime}</p>
                  <p className="text-xs mt-0.5">
                    {slot.isBooked ? 'Booked' : slot.isBlocked ? 'Blocked' : 'Available'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="text-xs text-slate-500">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-slate-500">Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-xs text-slate-500">Blocked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}