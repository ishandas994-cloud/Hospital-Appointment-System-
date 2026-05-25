import mongoose from 'mongoose'

// Stores a short-lived token when user requests password reset
// Token is deleted once used OR after 15 minutes (TTL index)

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true
  },
  token: {
    type:     String,
    required: true
    // This is a hashed version of the token — never store raw token in DB
  },
  expiresAt: {
    type:    Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    index:   { expires: 0 }  // MongoDB TTL — auto-deletes this doc when expiresAt passes
  }
}, { timestamps: true })

export default mongoose.model('PasswordReset', passwordResetSchema)
