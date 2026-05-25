import express from 'express'
import { register, login, getMe, logout }                         from '../controllers/authController.js'
import { forgotPassword, resetPassword, changePassword }          from '../controllers/passwordController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Public
router.post('/register',        register)
router.post('/login',           login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',  resetPassword)

// Protected
router.get('/me',               protect, getMe)
router.post('/logout',          protect, logout)
router.put('/change-password',  protect, changePassword)

export default router
