import express from 'express'
import { createReview, getDoctorReviews, deleteReview } from '../controllers/reviewController.js'
import { protect }        from '../middlewares/authMiddleware.js'
import { authorizeRoles } from '../middlewares/roleMiddleware.js'

const router = express.Router()

router.post('/',                  protect, authorizeRoles('patient'),         createReview)
router.get('/doctor/:doctorId',   getDoctorReviews)    // public
router.delete('/:id',             protect,                                    deleteReview)

export default router
