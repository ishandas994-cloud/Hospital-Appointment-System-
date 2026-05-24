import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema({
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
    unique:   true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  address: {
    street:  String,
    city:    String,
    state:   String,
    pincode: String
  },
  medicalHistory: {
    type:    [String],   // e.g. ['Diabetes', 'Hypertension']
    default: []
  },
  emergencyContact: {
    name:     String,
    phone:    String,
    relation: String    // e.g. 'Father', 'Spouse'
  }
}, { timestamps: true })

export default mongoose.model('Patient', patientSchema)
