import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { forgotPasswordAPI } from '../../api/authAPI.js'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await forgotPasswordAPI(data)
      setSent(true)
      toast.success('Reset link sent if email is registered!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-800">Forgot Password</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your email and we'll send a reset link</p>
        </div>

        {sent ? (
          <div className="text-center p-6 bg-green-50 rounded-2xl">
            <p className="text-4xl mb-3">📧</p>
            <p className="font-semibold text-green-700">Check your email!</p>
            <p className="text-sm text-slate-500 mt-2">
              If your email is registered, you'll receive a reset link shortly.
            </p>
            <Link to="/login" className="btn-primary inline-block mt-4 py-2 px-6">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
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

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <Link to="/login" className="block text-center text-sm text-slate-500 hover:text-primary-600">
              ← Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}