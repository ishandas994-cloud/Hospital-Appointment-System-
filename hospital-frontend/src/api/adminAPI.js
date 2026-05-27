import api from './axios.js'

export const getDashboardAPI      = ()       => api.get('/admin/dashboard')
export const getAllUsersAPI        = (params) => api.get('/admin/users', { params })
export const toggleUserStatusAPI  = (id)     => api.put(`/admin/users/${id}/toggle`)
export const getPendingDoctorsAPI = ()       => api.get('/admin/doctors/pending')
export const approveDoctorAPI     = (id)     => api.put(`/admin/doctors/${id}/approve`)
export const rejectDoctorAPI      = (id)     => api.put(`/admin/doctors/${id}/reject`)
export const getAllAppointmentsAPI = (params) => api.get('/admin/appointments', { params })