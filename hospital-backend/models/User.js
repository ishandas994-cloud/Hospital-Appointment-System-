import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Name is required'],
    trim:     true
  },
  email: {
    type:      String,
    required:  [true, 'Email is required'],
    unique:    true,
    lowercase: true,
    trim:      true
  },
  password: {
    type:      String,
    required:  [true, 'Password is required'],
    minlength: 6,
    select:    false   // never returned in queries by default
  },
  role: {
    type:    String,
    enum:    ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  phone: {
    type: String,
    trim: true
  },
  profilePhoto: {
    type:    String,
    default: ''
  },
  isActive: {
    type:    Boolean,
    default: true
  }
}, { timestamps: true })

// ── Hash password before saving ───────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// ── Method: compare entered password with hashed ──
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema)
