import express from 'express'
import {
  getDashboard, getPendingDoctors, approveDoctor, rejectDoctor,
  getAllUsers, toggleUserStatus, getAllAppointments
} from '../controllers/adminController.js'
import { protect }        from '../middlewares/authMiddleware.js'
import { authorizeRoles } from '../middlewares/roleMiddleware.js'

const router = express.Router()

// All admin routes are protected — apply middleware once here
router.use(protect, authorizeRoles('admin'))

router.get('/dashboard',           getDashboard)
router.get('/doctors/pending',     getPendingDoctors)
router.put('/doctors/:id/approve', approveDoctor)
router.put('/doctors/:id/reject',  rejectDoctor)
router.get('/users',               getAllUsers)
router.put('/users/:id/toggle',    toggleUserStatus)
router.get('/appointments',        getAllAppointments)

export default router
