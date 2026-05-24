import Patient from '../models/Patient.js'
import User    from '../models/User.js'

// ─────────────────────────────────────────────────
// GET /api/v1/patients/profile
// Patient only — get own profile
// ─────────────────────────────────────────────────
export const getPatientProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id })
      .populate('user', 'name email phone profilePhoto')

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' })
    }

    res.json({ success: true, patient })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// PUT /api/v1/patients/profile
// Patient only — update own profile
// ─────────────────────────────────────────────────
export const updatePatientProfile = async (req, res, next) => {
  try {
    const { name, phone, dateOfBirth, gender,
            bloodGroup, address, medicalHistory, emergencyContact } = req.body

    // Update name/phone in User collection if provided
    if (name || phone) {
      await User.findByIdAndUpdate(req.user._id, { name, phone })
    }

    // Update patient-specific fields
    const patient = await Patient.findOneAndUpdate(
      { user: req.user._id },
      { $set: { dateOfBirth, gender, bloodGroup, address, medicalHistory, emergencyContact } },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone profilePhoto')

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' })
    }

    res.json({ success: true, message: 'Profile updated successfully', patient })
  } catch (error) {
    next(error)
  }
}
