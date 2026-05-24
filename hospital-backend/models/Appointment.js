import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  patient: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Patient',
    required: true
  },
  doctor: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Doctor',
    required: true
  },
  slot: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Slot',
    required: true
  },
  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
    // Flow: pending -> confirmed -> completed
    //       pending/confirmed -> cancelled
  },
  reason: {
    type:     String,
    required: [true, 'Reason for appointment is required'],
    trim:     true
  },
  notes: {
    type:    String,   // Doctor fills this after consultation
    default: ''
  },
  prescription: {
    type:    String,   // Doctor writes prescription after visit
    default: ''
  },
  cancelledBy: {
    type:    String,
    enum:    ['patient', 'doctor', 'admin', null],
    default: null
  },
  cancelReason: {
    type:    String,
    default: ''
  }
}, { timestamps: true })

export default mongoose.model('Appointment', appointmentSchema)
