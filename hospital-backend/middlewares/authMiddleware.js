import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// protect — verifies JWT token from Authorization header
// Usage: router.get('/profile', protect, handler)

export const protect = async (req, res, next) => {
  try {
    let token

    // Token comes as: Authorization: Bearer <token>
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided'
      })
    }

    // Verify token signature + expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the logged-in user to req so controllers can use req.user
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' })
    }

    if (!req.user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated' })
    }

    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired' })
  }
}
