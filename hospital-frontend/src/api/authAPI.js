import api from './axios.js'

export const registerAPI       = (data) => api.post('/auth/register', data)
export const loginAPI          = (data) => api.post('/auth/login', data)
export const getMeAPI          = ()     => api.get('/auth/me')
export const logoutAPI         = ()     => api.post('/auth/logout')
export const forgotPasswordAPI = (data) => api.post('/auth/forgot-password', data)
export const resetPasswordAPI  = (data) => api.post('/auth/reset-password', data)
export const changePasswordAPI = (data) => api.put('/auth/change-password', data)