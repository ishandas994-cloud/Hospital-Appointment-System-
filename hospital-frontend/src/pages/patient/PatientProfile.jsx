import React from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getPatientProfileAPI, updatePatientProfileAPI } from '../../api/patientAPI.js'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import toast from 'react-hot-toast'

export default function PatientProfile() {
  const { register, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    getPatientProfileAPI()
      .then(r => {
        const p = r.data.patient
        reset({
          name:        p.user?.name        || '',
          phone:       p.user?.phone       || '',
          dateOfBirth: p.dateOfBirth?.slice(0, 10) || '',
          gender:      p.gender            || '',
          bloodGroup:  p.bloodGroup        || '',
          'address.street':  p.address?.street  || '',
          'address.city':    p.address?.city    || '',
          'address.state':   p.address?.state   || '',
          'address.pincode': p.address?.pincode || '',
          'emergencyContact.name':     p.emergencyContact?.name     || '',
          'emergencyContact.phone':    p.emergencyContact?.phone    || '',
          'emergencyContact.relation': p.emergencyContact?.relation || '',
        })
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await updatePatientProfileAPI(data)
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
          My Profile
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Personal Information */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input {...register('name')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input {...register('phone')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                <input {...register('dateOfBirth')} type="date" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                <select {...register('gender')} className="input">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Blood Group</label>
                <select {...register('bloodGroup')} className="input">
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700">Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Street</label>
                <input {...register('address.street')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                <input {...register('address.city')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <input {...register('address.state')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Pincode</label>
                <input {...register('address.pincode')} className="input" />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700">Emergency Contact</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input {...register('emergencyContact.name')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input {...register('emergencyContact.phone')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Relation</label>
                <input
                  {...register('emergencyContact.relation')}
                  placeholder="Father, Spouse, Sibling..."
                  className="input"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}