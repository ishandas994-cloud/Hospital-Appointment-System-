import Doctor from '../models/Doctor.js'
import User   from '../models/User.js'
import Slot   from '../models/Slot.js'
import { slotSchema } from '../utils/validators.js'

// ─────────────────────────────────────────────────
// GET /api/v1/doctors
// Public — list all approved doctors (with search/filter)
// ─────────────────────────────────────────────────
export const getAllDoctors = async (req, res, next) => {
  try {
    const { specialization, search } = req.query
    let filter = { isApproved: true }

    // Filter by specialization
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' }
    }

    // Search by doctor name (search users first, then filter doctors)
    if (search) {
      const matchingUsers = await User.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id')
      filter.user = { $in: matchingUsers.map(u => u._id) }
    }

    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone profilePhoto')
      .sort({ rating: -1 })

    res.json({ success: true, count: doctors.length, doctors })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// GET /api/v1/doctors/:id
// Public — single doctor details
// ─────────────────────────────────────────────────
export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone profilePhoto')

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' })
    }

    res.json({ success: true, doctor })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// PUT /api/v1/doctors/profile
// Doctor only — update own profile
// ─────────────────────────────────────────────────
export const updateDoctorProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body

    // Update name/phone in User collection
    if (name || phone) {
      await User.findByIdAndUpdate(req.user._id, { name, phone })
    }

    // Update doctor-specific fields
    const allowedFields = ['specialization', 'qualification', 'experience',
                           'consultationFee', 'bio', 'availableDays']
    const updates = {}
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field]
    })

    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone profilePhoto')

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' })
    }

    res.json({ success: true, message: 'Profile updated successfully', doctor })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// POST /api/v1/doctors/slots
// Doctor only — create available time slots for a date
// Body: { date: "2024-08-10", slots: [{ startTime: "09:00", endTime: "09:30" }] }
// ─────────────────────────────────────────────────
export const createSlots = async (req, res, next) => {
  try {
    const { error } = slotSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message })
    }

    const doctor = await Doctor.findOne({ user: req.user._id })
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' })
    }

    const { date, slots } = req.body

    const slotsToCreate = slots.map(s => ({
      doctor:    doctor._id,
      date:      new Date(date),
      startTime: s.startTime,
      endTime:   s.endTime
    }))

    // ordered: false — insert as many as possible, skip duplicates
    const created = await Slot.insertMany(slotsToCreate, { ordered: false })

    res.status(201).json({
      success: true,
      message: `${created.length} slots created successfully`,
      slots:   created
    })
  } catch (error) {
    // Ignore duplicate key errors (slot already exists)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Some slots already exist for this time' })
    }
    next(error)
  }
}

// ─────────────────────────────────────────────────
// GET /api/v1/doctors/:id/slots?date=2024-08-10
// Public — get available (unbooked) slots for a doctor
// ─────────────────────────────────────────────────
export const getDoctorSlots = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' })
    }

    let filter = {
      doctor:    doctor._id,
      isBooked:  false,
      isBlocked: false
    }

    // Filter by specific date if provided
    if (req.query.date) {
      const d = new Date(req.query.date)
      filter.date = {
        $gte: new Date(d.setHours(0, 0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59, 999))
      }
    }

    const slots = await Slot.find(filter).sort({ date: 1, startTime: 1 })

    res.json({ success: true, count: slots.length, slots })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// PUT /api/v1/doctors/slots/:slotId/block
// Doctor only — block/unblock a specific slot
// ─────────────────────────────────────────────────
export const toggleBlockSlot = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id })
    const slot   = await Slot.findOne({ _id: req.params.slotId, doctor: doctor._id })

    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' })
    }

    slot.isBlocked = !slot.isBlocked
    await slot.save()

    res.json({
      success: true,
      message: `Slot ${slot.isBlocked ? 'blocked' : 'unblocked'}`,
      slot
    })
  } catch (error) {
    next(error)
  }
}
