import { createLogger, format, transports } from 'winston'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Winston logger — replaces console.log in production
// Logs go to: console (dev) + logs/error.log + logs/combined.log (prod)

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',

  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),

  transports: [
    // Error-only log file
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level:    'error'
    }),
    // All logs combined
    new transports.File({
      filename: path.join(__dirname, '../logs/combined.log')
    })
  ]
})

// In development — also print pretty colored logs to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(({ timestamp, level, message, stack }) =>
        `${timestamp} [${level}]: ${stack || message}`
      )
    )
  }))
}

export default logger
