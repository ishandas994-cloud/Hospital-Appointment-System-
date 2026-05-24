import express from 'express'
import {
  bookAppointment, getMyAppointments, getDoctorAppointments,
  cancelAppointment, completeAppointment
} from '../controllers/appointmentController.js'
import { protect }        from '../middlewares/authMiddleware.js'
import { authorizeRoles } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.post('/',            protect, authorizeRoles('patient'),                    bookAppointment)
router.get('/my',           protect, authorizeRoles('patient'),                    getMyAppointments)
router.get('/doctor',       protect, authorizeRoles('doctor'),                     getDoctorAppointments)
router.put('/:id/cancel',   protect, authorizeRoles('patient','doctor','admin'),   cancelAppointment)
router.put('/:id/complete', protect, authorizeRoles('doctor'),                     completeAppointment)

export default router
