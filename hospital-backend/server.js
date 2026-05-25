import express      from 'express'
import dotenv       from 'dotenv'
import cors         from 'cors'
import cookieParser from 'cookie-parser'
import morgan       from 'morgan'
import helmet       from 'helmet'
import rateLimit    from 'express-rate-limit'
import { connectDB } from './config/db.js'
import logger        from './utils/logger.js'

import authRoutes        from './routes/authRoutes.js'
import doctorRoutes      from './routes/doctorRoutes.js'
import patientRoutes     from './routes/patientRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import adminRoutes       from './routes/adminRoutes.js'
import reviewRoutes      from './routes/reviewRoutes.js'
import uploadRoutes      from './routes/uploadRoutes.js'

dotenv.config()

const app = express()

// ── Security headers (helmet) ─────────────────────
app.use(helmet())

// ── CORS ──────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))

// ── Body parsers ──────────────────────────────────
app.use(express.json())
app.use(cookieParser())

// ── HTTP request logger ───────────────────────────
app.use(morgan('dev'))

// ── Global rate limiter ───────────────────────────
// Max 100 requests per 15 min per IP (all routes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message:  { success: false, message: 'Too many requests, please try again later' }
})
app.use(globalLimiter)

// ── Strict limiter for auth routes ────────────────
// Max 10 login/register attempts per 15 min (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { success: false, message: 'Too many auth attempts, please try again in 15 minutes' }
})

// ── Routes ────────────────────────────────────────
app.use('/api/v1/auth',         authLimiter, authRoutes)
app.use('/api/v1/doctors',      doctorRoutes)
app.use('/api/v1/patients',     patientRoutes)
app.use('/api/v1/appointments', appointmentRoutes)
app.use('/api/v1/admin',        adminRoutes)
app.use('/api/v1/reviews',      reviewRoutes)
app.use('/api/v1/upload',       uploadRoutes)

// ── Health check ──────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Hospital API is running 🏥' })
})

// ── 404 handler ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// ── Global error handler ──────────────────────────
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl })

  let statusCode = err.statusCode || 500
  let message    = err.message    || 'Internal Server Error'

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    message    = `${field} already exists`
    statusCode = 400
  }

  if (err.name === 'ValidationError') {
    message    = Object.values(err.errors).map(e => e.message).join(', ')
    statusCode = 400
  }

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
  logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})
