import Appointment from '../models/Appointment.js'
import Slot        from '../models/Slot.js'
import Patient     from '../models/Patient.js'
import Doctor      from '../models/Doctor.js'
import { sendEmail }          from '../utils/sendEmail.js'
import { appointmentSchema }  from '../utils/validators.js'

// ─────────────────────────────────────────────────
// POST /api/v1/appointments
// Patient only — book an appointment
// Flow: validate → check slot free → create appointment → mark slot booked → send email
// ─────────────────────────────────────────────────
export const bookAppointment = async (req, res, next) => {
  try {
    // Step 1: Validate request body
    const { error } = appointmentSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message })
    }

    const { doctorId, slotId, reason } = req.body

    // Step 2: Check if slot exists and is available
    const slot = await Slot.findById(slotId)
    if (!slot)          return res.status(404).json({ success: false, message: 'Slot not found' })
    if (slot.isBooked)  return res.status(400).json({ success: false, message: 'This slot is already booked' })
    if (slot.isBlocked) return res.status(400).json({ success: false, message: 'This slot is not available' })

    // Step 3: Get patient profile
    const patient = await Patient.findOne({ user: req.user._id })
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' })

    // Step 4: Create the appointment
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor:  doctorId,
      slot:    slotId,
      reason,
      status:  'confirmed'
    })

    // Step 5: Mark slot as booked so no one else can take it
    await Slot.findByIdAndUpdate(slotId, { isBooked: true })

    // Step 6: Populate for a rich response
    const populated = await Appointment.findById(appointment._id)
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
      .populate('slot')

    // Step 7: Send confirmation email (non-blocking)
    await sendEmail({
      to:      req.user.email,
      subject: '✅ Appointment Confirmed — MediCare Hospital',
      html: `
        <h2>Your appointment is confirmed!</h2>
        <p><strong>Date:</strong>   ${new Date(slot.date).toDateString()}</p>
        <p><strong>Time:</strong>   ${slot.startTime} – ${slot.endTime}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please arrive 10 minutes early.</p>
      `
    })

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: populated
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// GET /api/v1/appointments/my
// Patient only — get all my appointments
// ─────────────────────────────────────────────────
export const getMyAppointments = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id })
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' })

    const appointments = await Appointment.find({ patient: patient._id })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name profilePhoto' } })
      .populate('slot')
      .sort({ createdAt: -1 })

    res.json({ success: true, count: appointments.length, appointments })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// GET /api/v1/appointments/doctor
// Doctor only — get all appointments assigned to me
// ─────────────────────────────────────────────────
export const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id })
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })

    const { status } = req.query
    let filter = { doctor: doctor._id }
    if (status) filter.status = status

    const appointments = await Appointment.find(filter)
      .populate({ path: 'patient', populate: { path: 'user', select: 'name email phone' } })
      .populate('slot')
      .sort({ createdAt: -1 })

    res.json({ success: true, count: appointments.length, appointments })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// PUT /api/v1/appointments/:id/cancel
// Patient, Doctor, or Admin — cancel an appointment
// Also frees up the slot so others can book it
// ─────────────────────────────────────────────────
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' })
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Appointment is already cancelled' })
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment' })
    }

    appointment.status       = 'cancelled'
    appointment.cancelledBy  = req.user.role
    appointment.cancelReason = req.body.reason || ''
    await appointment.save()

    // Free the slot back up
    await Slot.findByIdAndUpdate(appointment.slot, { isBooked: false })

    res.json({ success: true, message: 'Appointment cancelled successfully' })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// PUT /api/v1/appointments/:id/complete
// Doctor only — mark appointment as completed and add notes
// ─────────────────────────────────────────────────
export const completeAppointment = async (req, res, next) => {
  try {
    const { notes, prescription } = req.body

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', notes: notes || '', prescription: prescription || '' },
      { new: true }
    )

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' })
    }

    res.json({ success: true, message: 'Appointment marked as completed', appointment })
  } catch (error) {
    next(error)
  }
}
