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

router.post('/delete', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) {
      return res.json({ success: true, message: 'Skipped non-cloudinary image' });
    }
    
    // Extract public ID from Cloudinary URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const publicId = `${folder}/${filename.split('.')[0]}`;
    
    const { cloudinary } = await import('../config/cloudinary.js');
    await cloudinary.uploader.destroy(publicId);
    
    res.json({ success: true, message: 'Image deleted from Cloudinary' });
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    res.status(500).json({ success: false, message: 'Server error during delete' });
  }
});

export default router;
