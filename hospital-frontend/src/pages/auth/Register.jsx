import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { registerAPI } from '../../api/authAPI.js'
import toast from 'react-hot-toast'
import { useState } from 'react'

const specializations = [
  'General Physician','Cardiologist','Dermatologist','Neurologist',
  'Orthopedic','Pediatrician','Gynecologist','Psychiatrist',
  'ENT Specialist','Ophthalmologist'
]

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'patient' } })
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [loading, setLoading] = useState(false)
  const role = watch('role')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await registerAPI(data)
      login(res.data.user, res.data.token)
      toast.success('Account created successfully!')
      const redirects = {
        patient: '/patient/dashboard',
        doctor:  '/doctor/dashboard'
      }
      navigate(redirects[res.data.user.role] || '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-lg p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join MediCare today</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {['patient', 'doctor'].map(r => (
            <label
              key={r}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                role === r
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                {...register('role')}
                type="radio"
                value={r}
                className="hidden"
              />
              <span className="text-lg">{r === 'patient' ? '🧑‍⚕️' : '👨‍⚕️'}</span>
              <span className={`text-sm font-semibold capitalize ${
                role === r ? 'text-primary-700' : 'text-slate-600'
              }`}>
                {r}
              </span>
            </label>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="John Doe"
                className="input"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input
                {...register('phone')}
                placeholder="9999999999"
                className="input"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern:  { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
              })}
              type="email"
              placeholder="you@example.com"
              className="input"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              {...register('password', {
                required:  'Password is required',
                minLength: { value: 6, message: 'Min 6 characters' }
              })}
              type="password"
              placeholder="Min 6 characters"
              className="input"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Doctor specific fields */}
          {role === 'doctor' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                Doctor Details
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Specialization</label>
                  <select {...register('specialization', { required: role === 'doctor' })} className="input">
                    <option value="">Select...</option>
                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Qualification</label>
                  <input
                    {...register('qualification')}
                    placeholder="MBBS, MD..."
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Experience (yrs)</label>
                  <input
                    {...register('experience')}
                    type="number"
                    min="0"
                    placeholder="5"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Fee (₹)</label>
                  <input
                    {...register('consultationFee')}
                    type="number"
                    min="0"
                    placeholder="500"
                    className="input"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Your account needs admin approval before appearing in listings.
              </p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}