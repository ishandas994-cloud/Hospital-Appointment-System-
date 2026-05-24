import User        from '../models/User.js'
import Doctor      from '../models/Doctor.js'
import Patient     from '../models/Patient.js'
import Appointment from '../models/Appointment.js'

// ─────────────────────────────────────────────────
// GET /api/v1/admin/dashboard
// Admin only — overview stats + recent appointments
// ─────────────────────────────────────────────────
export const getDashboard = async (req, res, next) => {
  try {
    // Run all 4 counts in parallel for speed
    const [totalDoctors, totalPatients, totalAppointments, pendingDoctors] = await Promise.all([
      Doctor.countDocuments({ isApproved: true }),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Doctor.countDocuments({ isApproved: false })
    ])

    // Appointment breakdown by status
    const [confirmed, completed, cancelled] = await Promise.all([
      Appointment.countDocuments({ status: 'confirmed' }),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'cancelled' })
    ])

    // Last 5 appointments for quick view
    const recentAppointments = await Appointment.find()
      .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
      .populate({ path: 'doctor',  populate: { path: 'user', select: 'name' } })
      .populate('slot')
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      success: true,
      stats: {
        totalDoctors, totalPatients, totalAppointments, pendingDoctors,
        appointmentStatus: { confirmed, completed, cancelled }
      },
      recentAppointments
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// GET /api/v1/admin/doctors/pending
// Admin only — list doctors waiting for approval
// ─────────────────────────────────────────────────
export const getPendingDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ isApproved: false })
      .populate('user', 'name email phone createdAt')

    res.json({ success: true, count: doctors.length, doctors })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// PUT /api/v1/admin/doctors/:id/approve
// Admin only — approve a doctor so they appear in listings
// ─────────────────────────────────────────────────
export const approveDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('user', 'name email')

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' })
    }

    res.json({ success: true, message: 'Doctor approved successfully', doctor })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// PUT /api/v1/admin/doctors/:id/reject
// Admin only — reject a doctor application
// ─────────────────────────────────────────────────
export const rejectDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user')
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })

    // Deactivate their user account too
    await User.findByIdAndUpdate(doctor.user._id, { isActive: false })

    res.json({ success: true, message: 'Doctor application rejected' })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// GET /api/v1/admin/users
// Admin only — list all users
// ─────────────────────────────────────────────────
export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query
    let filter = {}
    if (role) filter.role = role

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })

    res.json({ success: true, count: users.length, users })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// PUT /api/v1/admin/users/:id/toggle
// Admin only — activate / deactivate a user
// ─────────────────────────────────────────────────
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    // Don't allow deactivating another admin
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot deactivate an admin account' })
    }

    user.isActive = !user.isActive
    await user.save()

    res.json({
      success:  true,
      message:  `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// GET /api/v1/admin/appointments
// Admin only — all appointments with full details
// ─────────────────────────────────────────────────
export const getAllAppointments = async (req, res, next) => {
  try {
    const { status } = req.query
    let filter = {}
    if (status) filter.status = status

    const appointments = await Appointment.find(filter)
      .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
      .populate({ path: 'doctor',  populate: { path: 'user', select: 'name email' } })
      .populate('slot')
      .sort({ createdAt: -1 })

    res.json({ success: true, count: appointments.length, appointments })
  } catch (error) {
    next(error)
  }
}
