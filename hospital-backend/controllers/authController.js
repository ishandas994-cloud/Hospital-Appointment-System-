import User    from '../models/User.js'
import Patient from '../models/Patient.js'
import Doctor  from '../models/Doctor.js'
import { generateToken }                    from '../utils/generateToken.js'
import { registerSchema, loginSchema }      from '../utils/validators.js'

// ─────────────────────────────────────────────────
// POST /api/v1/auth/register
// Public — creates User + Patient or Doctor profile
// ─────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    // Step 1: Validate request body with Joi
    const { error } = registerSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message })
    }

    const { name, email, password, phone, role,
            specialization, qualification, experience, consultationFee } = req.body

    // Step 2: Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    // Step 3: Create User (password hashed by pre-save hook in model)
    const user = await User.create({ name, email, password, phone, role })

    // Step 4: Create role-specific profile
    if (role === 'patient' || !role) {
      await Patient.create({ user: user._id })
    } else if (role === 'doctor') {
      await Doctor.create({
        user:            user._id,
        specialization:  specialization  || 'General',
        qualification:   qualification   || 'MBBS',
        experience:      experience      || 0,
        consultationFee: consultationFee || 0
      })
    }

    // Step 5: Generate JWT and respond
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// POST /api/v1/auth/login
// Public — returns JWT if credentials match
// ─────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    // Step 1: Validate
    const { error } = loginSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message })
    }

    const { email, password } = req.body

    // Step 2: Find user — include password (select: false in schema hides it by default)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Step 3: Compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Step 4: Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact admin.' })
    }

    // Step 5: Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// GET /api/v1/auth/me
// Protected — returns logged-in user's data
// ─────────────────────────────────────────────────
export const getMe = async (req, res) => {
  // req.user is set by authMiddleware
  res.json({ success: true, user: req.user })
}

// ─────────────────────────────────────────────────
// POST /api/v1/auth/logout
// Protected — client just discards token (stateless JWT)
// ─────────────────────────────────────────────────
export const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' })
}
