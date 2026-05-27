import api from './axios.js'

export const getPatientProfileAPI    = ()     => api.get('/patients/profile')
export const updatePatientProfileAPI = (data) => api.put('/patients/profile', data)
export const createReviewAPI         = (data) => api.post('/reviews', data)
export const deleteReviewAPI         = (id)   => api.delete(`/reviews/${id}`)