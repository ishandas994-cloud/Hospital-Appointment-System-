import api from './axios.js'

export const getAllDoctorsAPI       = (params) => api.get('/doctors', { params })
export const getDoctorByIdAPI       = (id)     => api.get(`/doctors/${id}`)
export const getDoctorSlotsAPI      = (id, date) => api.get(`/doctors/${id}/slots`, { params: { date } })
export const updateDoctorProfileAPI = (data)   => api.put('/doctors/profile', data)
export const createSlotsAPI         = (data)   => api.post('/doctors/slots', data)
export const toggleBlockSlotAPI     = (slotId) => api.put(`/doctors/slots/${slotId}/block`)
export const getDoctorReviewsAPI    = (id)     => api.get(`/reviews/doctor/${id}`)