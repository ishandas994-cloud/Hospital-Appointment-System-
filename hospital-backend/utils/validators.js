import Joi from 'joi'

// Joi validates request body BEFORE it hits the database
// If validation fails, we return a 400 immediately — no DB call wasted

export const registerSchema = Joi.object({
  name:            Joi.string().min(2).max(50).required(),
  email:           Joi.string().email().required(),
  password:        Joi.string().min(6).required(),
  phone:           Joi.string().optional(),
  role:            Joi.string().valid('patient', 'doctor').default('patient'),
  // Doctor-specific fields (optional for patients)
  specialization:  Joi.string().optional(),
  qualification:   Joi.string().optional(),
  experience:      Joi.number().min(0).optional(),
  consultationFee: Joi.number().min(0).optional()
})

export const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required()
})

export const appointmentSchema = Joi.object({
  doctorId: Joi.string().required(),
  slotId:   Joi.string().required(),
  reason:   Joi.string().min(5).max(300).required()
})

export const slotSchema = Joi.object({
  date:  Joi.string().required(),   // "2024-08-10"
  slots: Joi.array().items(
    Joi.object({
      startTime: Joi.string().required(),   // "09:00"
      endTime:   Joi.string().required()    // "09:30"
    })
  ).min(1).required()
})
