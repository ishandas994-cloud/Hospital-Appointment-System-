import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    unique:   true
  },
  specialization: {
    type:     String,
    required: [true, 'Specialization is required'],
    trim:     true
    // e.g. Cardiologist, Dermatologist, General Physician
  },
  qualification: {
    type:     String,
    required: [true, 'Qualification is required']
    // e.g. MBBS, MD, MS
  },
  experience: {
    type:     Number,
    required: [true, 'Experience in years is required'],
    min:      0
  },
  consultationFee: {
    type:     Number,
    required: [true, 'Consultation fee is required'],
    min:      0
  },
  bio: {
    type:      String,
    maxlength: 500
  },
  availableDays: {
    type:    [String],
    enum:    ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    default: []
  },
  isApproved: {
    type:    Boolean,
    default: false   // Admin must approve before doctor shows in listings
  },
  rating: {
    type:    Number,
    default: 0,
    min:     0,
    max:     5
  },
  totalReviews: {
    type:    Number,
    default: 0
  }
}, { timestamps: true })

export default mongoose.model('Doctor', doctorSchema)
