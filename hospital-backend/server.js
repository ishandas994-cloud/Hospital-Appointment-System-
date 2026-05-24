import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { connectDB } from './config/db.js'

import authRoutes        from './routes/authRoutes.js'
import doctorRoutes      from './routes/doctorRoutes.js'
import patientRoutes     from './routes/patientRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import adminRoutes       from './routes/adminRoutes.js'

dotenv.config()

const app = express()

// ── Middlewares ───────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// ── Routes ────────────────────────────────────────
app.use('/api/v1/auth',         authRoutes)
app.use('/api/v1/doctors',      doctorRoutes)
app.use('/api/v1/patients',     patientRoutes)
app.use('/api/v1/appointments', appointmentRoutes)
app.use('/api/v1/admin',        adminRoutes)

// ── Health check ──────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hospital API is running' })
})

// ── Global error handler ──────────────────────────
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message    = err.message    || 'Internal Server Error'

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    message    = `${field} already exists`
    statusCode = 400
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message    = Object.values(err.errors).map(e => e.message).join(', ')
    statusCode = 400
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message    = 'Invalid token'
    statusCode = 401
  }

  res.status(statusCode).json({ success: false, message })
})

// ── Start server ──────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  await connectDB()
  console.log(`🚀 Server running on port ${PORT}`)
})
