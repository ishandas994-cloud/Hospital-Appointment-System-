import express from 'express'
import { getPatientProfile, updatePatientProfile } from '../controllers/patientController.js'
import { protect }        from '../middlewares/authMiddleware.js'
import { authorizeRoles } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.get('/profile', protect, authorizeRoles('patient'), getPatientProfile)
router.put('/profile', protect, authorizeRoles('patient'), updatePatientProfile)

export default router
