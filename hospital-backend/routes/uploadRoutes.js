import express from 'express'
import { uploadProfilePhoto, deleteProfilePhoto } from '../controllers/uploadController.js'
import { protect }    from '../middlewares/authMiddleware.js'
import { upload }     from '../config/cloudinary.js'

const router = express.Router()

// upload.single('photo') = multer middleware, runs before controller
// 'photo' must match the field name in FormData from frontend
router.post('/profile-photo',   protect, upload.single('photo'), uploadProfilePhoto)
router.delete('/profile-photo', protect,                         deleteProfilePhoto)

export default router
