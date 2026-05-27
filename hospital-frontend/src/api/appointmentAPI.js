import api from './axios.js'

export const bookAppointmentAPI       = (data)       => api.post('/appointments', data)
export const getMyAppointmentsAPI     = ()            => api.get('/appointments/my')
export const getDoctorAppointmentsAPI = (params)     => api.get('/appointments/doctor', { params })
export const cancelAppointmentAPI     = (id, data)   => api.put(`/appointments/${id}/cancel`, data)
export const completeAppointmentAPI   = (id, data)   => api.put(`/appointments/${id}/complete`, data)