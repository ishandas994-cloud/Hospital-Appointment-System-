import mongoose from 'mongoose'

// A Slot = one time block a doctor is available on a specific date
// e.g. Dr. Sharma -> 2024-08-10 -> 09:00 to 09:30

const slotSchema = new mongoose.Schema({
  doctor: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Doctor',
    required: true
  },
  date: {
    type:     Date,
    required: true
  },
  startTime: {
    type:     String,   // "09:00"
    required: true
  },
  endTime: {
    type:     String,   // "09:30"
    required: true
  },
  isBooked: {
    type:    Boolean,
    default: false      // true when a patient books this slot
  },
  isBlocked: {
    type:    Boolean,
    default: false      // doctor can manually block a slot (holiday, break)
  }
}, { timestamps: true })

// Prevent duplicate slots: same doctor cannot have 2 slots at same date+time
slotSchema.index({ doctor: 1, date: 1, startTime: 1 }, { unique: true })

export default mongoose.model('Slot', slotSchema)
