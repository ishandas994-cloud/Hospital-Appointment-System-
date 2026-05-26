import mongoose from 'mongoose'

// A patient can leave ONE review per doctor (enforced by unique index below)

const reviewSchema = new mongoose.Schema({
  doctor: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Doctor',
    required: true
  },
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Patient',
    required: true
  },
  appointment: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Appointment',
    required: true   // Review is only allowed for a completed appointment
  },
  rating: {
    type:     Number,
    required: [true, 'Rating is required'],
    min:      1,
    max:      5
  },
  comment: {
    type:      String,
    trim:      true,
    maxlength: 500
  }
}, { timestamps: true })

// One patient can review one doctor only once
reviewSchema.index({ doctor: 1, patient: 1 }, { unique: true })

// After saving a review, auto-update doctor's average rating
reviewSchema.post('save', async function () {
  const Doctor = (await import('./Doctor.js')).default
  const reviews = await this.constructor.find({ doctor: this.doctor })

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  await Doctor.findByIdAndUpdate(this.doctor, {
    rating:       Math.round(avg * 10) / 10,  // round to 1 decimal
    totalReviews: reviews.length
  })
})

export default mongoose.model('Review', reviewSchema)
