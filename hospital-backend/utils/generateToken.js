import jwt from 'jsonwebtoken'

// Generates a signed JWT with the user's _id inside
// The frontend stores this token and sends it with every request

export const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}
