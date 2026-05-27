import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { updateDoctorProfileAPI } from '../../api/doctorAPI.js'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import axiosInstance from '../../api/axios.js'
import toast from 'react-hot-toast'

const DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const SPECS = [
  'General Physician','Cardiologist','Dermatologist','Neurologist',
  'Orthopedic','Pediatrician','Gynecologist','Psychiatrist',
  'ENT Specialist','Ophthalmologist'
]

export default function DoctorProfile() {
  const { register, handleSubmit, reset } = useForm()
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [selectedDays, setSelectedDays] = useState([])

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const meRes     = await axiosInstance.get('/auth/me')
        const doctorRes = await axiosInstance.get('/doctors/profile').catch(() => null)
        const d = doctorRes?.data?.doctor

        reset({
          name:            meRes.data.user?.name            || '',
          phone:           meRes.data.user?.phone           || '',
          specialization:  d?.specialization                || '',
          qualification:   d?.qualification                 || '',
          experience:      d?.experience                    || 0,
          consultationFee: d?.consultationFee               || 0,
          bio:             d?.bio                           || '',
        })
        setSelectedDays(d?.availableDays || [])
      } catch {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await updateDoctorProfileAPI({ ...data, availableDays: selectedDays })
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <><Navbar /><Spinner fullPage /></>

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          Doctor Profile
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Personal Details */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700">Personal Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input {...register('name')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone
                </label>
                <input {...register('phone')} className="input" />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700">Professional Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Specialization
                </label>
                <select {...register('specialization')} className="input">
                  {SPECS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Qualification
                </label>
                <input
                  {...register('qualification')}
                  placeholder="MBBS, MD, MS..."
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Experience (years)
                </label>
                <input
                  {...register('experience')}
                  type="number"
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Consultation Fee (₹)
                </label>
                <input
                  {...register('consultationFee')}
                  type="number"
                  min="0"
                  className="input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={3}
                placeholder="Tell patients about yourself..."
                className="input resize-none"
              />
            </div>
          </div>

          {/* Available Days */}
          <div className="card">
            <h2 className="font-semibold text-slate-700 mb-3">Available Days</h2>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedDays.includes(d)
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Selected: {selectedDays.length === 0 ? 'None' : selectedDays.join(', ')}
            </p>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}