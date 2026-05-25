import Review      from '../models/Review.js'
import Appointment from '../models/Appointment.js'
import Doctor      from '../models/Doctor.js'
import Patient     from '../models/Patient.js'

// ─────────────────────────────────────────────────
// POST /api/v1/reviews
// Patient only — leave a review for a completed appointment
// ─────────────────────────────────────────────────
export const createReview = async (req, res, next) => {
  try {
    const { appointmentId, rating, comment } = req.body

    if (!appointmentId || !rating) {
      return res.status(400).json({ success: false, message: 'appointmentId and rating are required' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' })
    }

    // Step 1: Find the appointment and check it belongs to this patient
    const patient = await Patient.findOne({ user: req.user._id })
    const appointment = await Appointment.findById(appointmentId)

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' })
    }

    // Step 2: Only the patient who booked can review
    if (appointment.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only review your own appointments' })
    }

    // Step 3: Only completed appointments can be reviewed
    if (appointment.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'You can only review completed appointments' })
    }

    // Step 4: Create review (unique index prevents duplicate reviews)
    const review = await Review.create({
      doctor:      appointment.doctor,
      patient:     patient._id,
      appointment: appointmentId,
      rating,
      comment:     comment || ''
    })
    // Note: post('save') hook in Review model auto-updates doctor's avg rating

    res.status(201).json({ success: true, message: 'Review submitted successfully', review })
  } catch (error) {
    // Duplicate review
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this doctor' })
    }
    next(error)
  }
}

// ─────────────────────────────────────────────────
// GET /api/v1/reviews/doctor/:doctorId
// Public — get all reviews for a specific doctor
// ─────────────────────────────────────────────────
export const getDoctorReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId })
      .populate({ path: 'patient', populate: { path: 'user', select: 'name profilePhoto' } })
      .sort({ createdAt: -1 })

    res.json({ success: true, count: reviews.length, reviews })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// DELETE /api/v1/reviews/:id
// Patient (own review) or Admin — delete a review
// ─────────────────────────────────────────────────
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' })

    // Allow patient to delete own review, or admin to delete any
    const patient = await Patient.findOne({ user: req.user._id })
    const isOwner = patient && review.patient.toString() === patient._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' })
    }

    await review.deleteOne()

    // Recalculate doctor rating after deletion
    const doctorId = review.doctor
    const remaining = await Review.find({ doctor: doctorId })
    const avg = remaining.length > 0
      ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
      : 0

    await Doctor.findByIdAndUpdate(doctorId, {
      rating:       Math.round(avg * 10) / 10,
      totalReviews: remaining.length
    })

    res.json({ success: true, message: 'Review deleted successfully' })
  } catch (error) {
    next(error)
  }
}
