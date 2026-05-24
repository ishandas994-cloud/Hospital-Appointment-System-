import express from 'express'
import {
  getAllDoctors, getDoctorById, updateDoctorProfile,
  createSlots, getDoctorSlots, toggleBlockSlot
} from '../controllers/doctorController.js'
import { protect }          from '../middlewares/authMiddleware.js'
import { authorizeRoles }   from '../middlewares/roleMiddleware.js'

const router = express.Router()

// Public
router.get('/',           getAllDoctors)
router.get('/:id',        getDoctorById)
router.get('/:id/slots',  getDoctorSlots)

// Doctor only
router.put('/profile',                protect, authorizeRoles('doctor'), updateDoctorProfile)
router.post('/slots',                 protect, authorizeRoles('doctor'), createSlots)
router.put('/slots/:slotId/block',    protect, authorizeRoles('doctor'), toggleBlockSlot)

export default router
