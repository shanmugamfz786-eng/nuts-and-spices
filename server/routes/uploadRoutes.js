import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const router = express.Router();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  }
});

router.post(
  '/',
  optionalAuthMiddleware,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File too large. Maximum file size is 5MB.' });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      // req.file.path contains the Cloudinary URL
      return res.json({
        success: true,
        message: 'Image uploaded successfully',
        imageUrl: req.file.path
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      return res.status(500).json({ success: false, message: 'Server error during upload' });
    }
  }
);

router.post('/delete', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl || typeof imageUrl !== 'string') {
      return res.status(400).json({ success: false, message: 'imageUrl is required' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    // Validate that the image belongs to OUR cloudinary cloud name and folder
    if (!imageUrl.includes('res.cloudinary.com') || (cloudName && !imageUrl.includes(`/${cloudName}/`))) {
      return res.status(400).json({ success: false, message: 'Refused: Not a valid image URL for this store.' });
    }

    // Safely parse publicId including nested folders
    // Example: https://res.cloudinary.com/<cloud>/image/upload/v12345/nuts_and_spices_products/sample.jpg
    const uploadIdx = imageUrl.indexOf('/upload/');
    if (uploadIdx === -1) {
      return res.status(400).json({ success: false, message: 'Malformed Cloudinary URL' });
    }

    const pathAfterUpload = imageUrl.substring(uploadIdx + 8); // after "/upload/"
    const segments = pathAfterUpload.split('/');
    // Skip version segment (v1234567) if present
    if (segments[0] && /^v\d+$/.test(segments[0])) {
      segments.shift();
    }
    const fullPathWithoutExt = segments.join('/').replace(/\.[^/.]+$/, '');

    // Enforce that publicId is inside our known folder
    if (!fullPathWithoutExt.startsWith('nuts_and_spices_products')) {
      return res.status(403).json({ success: false, message: 'Unauthorized folder destruction request.' });
    }

    const { cloudinary } = await import('../config/cloudinary.js');
    await cloudinary.uploader.destroy(fullPathWithoutExt);

    return res.json({ success: true, message: 'Image deleted from Cloudinary' });
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return res.status(500).json({ success: false, message: 'Server error during delete' });
  }
});

export default router;
