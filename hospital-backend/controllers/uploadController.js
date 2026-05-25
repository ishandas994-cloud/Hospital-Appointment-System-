import User   from '../models/User.js'
import Doctor from '../models/Doctor.js'
import cloudinary from '../config/cloudinary.js'

// ─────────────────────────────────────────────────
// POST /api/v1/upload/profile-photo
// Protected — any logged-in user can upload their photo
// Multer (upload middleware) runs BEFORE this controller
// The file is already uploaded to Cloudinary by the time we get here
// ─────────────────────────────────────────────────
export const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    // req.file.path is the Cloudinary URL set by multer-storage-cloudinary
    const imageUrl = req.file.path

    // Save URL to user's profilePhoto field
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: imageUrl },
      { new: true }
    ).select('-password')

    res.json({
      success:  true,
      message:  'Profile photo uploaded successfully',
      imageUrl,
      user
    })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────────
// DELETE /api/v1/upload/profile-photo
// Protected — remove profile photo, revert to default
// ─────────────────────────────────────────────────
export const deleteProfilePhoto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (user.profilePhoto) {
      // Extract public_id from Cloudinary URL to delete it
      // URL format: https://res.cloudinary.com/<cloud>/image/upload/v123/<public_id>.jpg
      const urlParts  = user.profilePhoto.split('/')
      const fileName  = urlParts[urlParts.length - 1]
      const publicId  = `hospital/profiles/${fileName.split('.')[0]}`

      await cloudinary.uploader.destroy(publicId)
    }

    await User.findByIdAndUpdate(req.user._id, { profilePhoto: '' })

    res.json({ success: true, message: 'Profile photo removed' })
  } catch (error) {
    next(error)
  }
}
