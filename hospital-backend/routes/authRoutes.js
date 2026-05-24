import express from 'express'
import { register, login, getMe, logout } from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login',    login)

// Protected routes
router.get('/me',      protect, getMe)
router.post('/logout', protect, logout)

export default router
