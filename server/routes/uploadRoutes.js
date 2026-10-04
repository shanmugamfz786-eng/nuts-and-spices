import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/', (req, res, next) => {
  console.log('--- Incoming Image Upload Request ---');
  next();
}, upload.single('image'), (req, res) => {
  console.log('--- Upload Success ---', req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // req.file.path contains the cloudinary URL
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: req.file.path
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Server error during upload' });
  }
});

export default router;
