import React from 'react'
import { useEffect, useState } from 'react'
import { getPendingDoctorsAPI, approveDoctorAPI, rejectDoctorAPI } from '../../api/adminAPI.js'
import { getAllDoctorsAPI } from '../../api/doctorAPI.js'
import Navbar from '../../components/Navbar.jsx'
import Spinner from '../../components/Spinner.jsx'
import toast from 'react-hot-toast'

export default function ManageDoctors() {
  const [pendingDoctors,  setPendingDoctors]  = useState([])
  const [approvedDoctors, setApprovedDoctors] = useState([])
  const [loading,         setLoading]         = useState(true)
  const [tab,             setTab]             = useState('pending')
  const [actionId,        setActionId]        = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        getPendingDoctorsAPI(),
        getAllDoctorsAPI()
      ])
      setPendingDoctors(pendingRes.data.doctors   || [])
      setApprovedDoctors(approvedRes.data.doctors || [])
    } catch {
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleApprove = async (id) => {
    setActionId(id)
    try {
      await approveDoctorAPI(id)
      toast.success('Doctor approved successfully!')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve')
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async (id) => {
    if (!confirm('Reject this doctor application?')) return
    setActionId(id)
    try {
      await rejectDoctorAPI(id)
      toast.success('Doctor rejected')
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject')
    } finally {
      setActionId(null)
    }
  }

  const doctors = tab === 'pending' ? pendingDoctors : approvedDoctors

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          Manage Doctors
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('pending')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === 'pending'
                ? 'bg-amber-500 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300'
            }`}
          >
            ⏳ Pending Approvals
            {pendingDoctors.length > 0 && (
              <span className="ml-2 bg-white/30 px-1.5 py-0.5 rounded-full text-xs">
                {pendingDoctors.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('approved')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-green-300'
            }`}
          >
            ✅ Approved Doctors
            <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
              {approvedDoctors.length}
            </span>
          </button>
        </div>

        {/* Doctor list */}
        {loading ? <Spinner /> : doctors.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">
              {tab === 'pending' ? '🎉' : '👨‍⚕️'}
            </p>
            <p className="text-slate-500">
              {tab === 'pending'
                ? 'No pending approvals — all caught up!'
                : 'No approved doctors yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map(doctor => (
              <div key={doctor._id} className="card">
                <div className="flex items-start justify-between gap-4">

                  {/* Doctor info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      {doctor.user?.profilePhoto ? (
                        <img
                          src={doctor.user.profilePhoto}
                          className="w-12 h-12 rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-primary-700">
                          {doctor.user?.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-slate-800">
                        Dr. {doctor.user?.name}
                      </h3>
                      <p className="text-sm text-primary-600 font-medium">
                        {doctor.specialization}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="text-xs text-slate-500">
                          📧 {doctor.user?.email}
                        </span>
                        <span className="text-xs text-slate-500">
                          🎓 {doctor.qualification}
                        </span>
                        <span className="text-xs text-slate-500">
                          💼 {doctor.experience} yrs experience
                        </span>
                        <span className="text-xs text-slate-500">
                          💰 ₹{doctor.consultationFee} fee
                        </span>
                      </div>
                      {doctor.user?.phone && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          📱 {doctor.user.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {tab === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(doctor._id)}
                          disabled={actionId === doctor._id}
                          className="btn-primary text-sm py-1.5 px-4"
                        >
                          {actionId === doctor._id ? '...' : '✅ Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(doctor._id)}
                          disabled={actionId === doctor._id}
                          className="btn-danger text-sm py-1.5 px-4"
                        >
                          {actionId === doctor._id ? '...' : '❌ Reject'}
                        </button>
                      </>
                    ) : (
                      <span className="badge-completed">Approved</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}