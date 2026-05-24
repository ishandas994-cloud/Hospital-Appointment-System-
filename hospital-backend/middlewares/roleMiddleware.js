// authorizeRoles — checks if logged-in user has the required role
// Usage: router.get('/admin', protect, authorizeRoles('admin'), handler)
//        router.post('/book', protect, authorizeRoles('patient', 'admin'), handler)

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — role '${req.user.role}' cannot access this route`
      })
    }
    next()
  }
}
