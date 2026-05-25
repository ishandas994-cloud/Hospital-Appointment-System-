// ─────────────────────────────────────────────────
// SEED SCRIPT — run once to create first admin user
// Usage: node scripts/createAdmin.js
// ─────────────────────────────────────────────────

import dotenv   from 'dotenv'
import mongoose from 'mongoose'
import User     from '../models/User.js'

dotenv.config()

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Check if admin already exists
    const existing = await User.findOne({ role: 'admin' })
    if (existing) {
      console.log('⚠️  Admin already exists:', existing.email)
      process.exit(0)
    }

    // Create admin — password hashed by pre-save hook in User model
    const admin = await User.create({
      name:     'Hospital Admin',
      email:    'admin@hospital.com',
      password: 'Admin@123',
      role:     'admin',
      phone:    '9999999999',
      isActive: true
    })

    console.log('✅ Admin created successfully!')
    console.log('   Email   :', admin.email)
    console.log('   Password: Admin@123')
    console.log('   ⚠️  Change the password after first login!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createAdmin()
