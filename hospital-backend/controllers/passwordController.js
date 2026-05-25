import crypto           from 'crypto'
import bcrypt           from 'bcryptjs'
import User             from '../models/User.js'
import PasswordReset    from '../models/PasswordReset.js'
import { sendEmail }    from '../utils/sendEmail.js'

// ─────────────────────────────────────────────────
// POST /api/v1/auth/forgot-password
// Public — user enters email, gets reset link
// ─────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const user = await User.findOne({ email })

    // SECURITY: always return same response whether email exists or not
    // This prevents attackers from knowing which emails are registered
    if (!user) {
      return res.json({
        success: true,
        message: 'If this email is registered, a reset link has been sent'
      })
    }

    // Step 1: Generate a random raw token
    const rawToken = crypto.randomBytes(32).toString('hex')

    // Step 2: Hash the token before saving to DB
    // Why? If DB is leaked, hashed token is useless to attacker
    const hashedToken = await bcrypt.hash(rawToken, 10)

    // Step 3: Delete any existing reset token for this user
    await PasswordReset.deleteMany({ userId: user._id })

    // Step 4: Save hashed token to DB
    await PasswordReset.create({
      userId: user._id,
      token:  hashedToken
    })

    // Step 5: Send raw token in email link (NOT the hashed one)
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}&id=${user._id}`

    await sendEmail({
      to:      user.email,
      subject: '🔐 Password Reset Request — MediCare Hospital',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}" style="background:#2563eb;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;display:inline-block;margin:10px 0">
          Reset Password
        </a>
        <p>This link expires in <strong>15 minutes</strong>.</p>
        <p>If you didn't request this, ignore this email. Your password won't change.</p>
        <hr/>
        <small>Or copy this URL: ${resetLink}</small>
      `
    })

    res.json({
      success: true,
      message: 'If this email is registered, a reset link has been sent'
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// POST /api/v1/auth/reset-password
// Public — user submits new password with token from email
// Body: { token, userId, newPassword }
// ─────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { token, userId, newPassword } = req.body

    if (!token || !userId || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token, userId and newPassword are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }

    // Step 1: Find the reset record for this user
    const resetRecord = await PasswordReset.findOne({ userId })
    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired' })
    }

    // Step 2: Compare submitted raw token with stored hashed token
    const isValid = await bcrypt.compare(token, resetRecord.token)
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired' })
    }

    // Step 3: Update user's password (pre-save hook will hash it)
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.password = newPassword
    await user.save()  // triggers bcrypt hash in pre-save hook

    // Step 4: Delete the used reset token
    await PasswordReset.deleteMany({ userId })

    res.json({ success: true, message: 'Password reset successful. You can now login.' })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// PUT /api/v1/auth/change-password
// Protected — logged-in user changes their own password
// Body: { currentPassword, newPassword }
// ─────────────────────────────────────────────────
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' })
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password')

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
}
