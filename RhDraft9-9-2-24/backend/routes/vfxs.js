const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const VFX = require('../models/vfx');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all VFX entries
router.get('/', async (req, res) => {
    try {
        const vfxItems = await VFX.find();
        res.json(vfxItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new VFX entry with video upload to Cloudinary
// POST a new VFX entry with video upload to Cloudinary
router.post('/', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'poster', maxCount: 1 }]), async (req, res) => {
  try {
      if (!req.files || !req.files.video || !req.files.poster) {
          return res.status(400).json({ message: 'Video or poster file missing' });
      }

      // Upload video to Cloudinary
      const videoResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
              { resource_type: 'video' },
              (error, result) => {
                  if (error) {
                      return reject(error);
                  }
                  resolve(result);
              }
          ).end(req.files.video[0].buffer);
      });

      // Upload poster to Cloudinary
      const posterResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
              { resource_type: 'image' },
              (error, result) => {
                  if (error) {
                      return reject(error);
                  }
                  resolve(result);
              }
          ).end(req.files.poster[0].buffer);
      });

      // Create a new VFX entry with the Cloudinary URLs
      const newVFX = new VFX({
          title: req.body.title,
          video: videoResult.secure_url,
          poster: posterResult.secure_url,
      });

      // Save to the database
      const savedVFX = await newVFX.save();
      res.status(201).json(savedVFX);
  } catch (err) {
      console.error('Error uploading video or saving VFX:', err);
      res.status(500).json({ message: 'Error uploading video or saving VFX' });
  }
});

// PUT: Update an existing VFX entry
router.put('/:id', async (req, res) => {
    try {
        const vfxItem = await VFX.findById(req.params.id);
        if (!vfxItem) {
            return res.status(404).json({ message: 'VFX item not found' });
        }

        // Update fields only if they exist in the request
        vfxItem.title = req.body.title || vfxItem.title;
        vfxItem.video = req.body.video || vfxItem.video;

        const updatedVFX = await vfxItem.save();
        res.json(updatedVFX);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove a VFX entry by ID
router.delete('/:id', async (req, res) => {
    try {
        const vfxItem = await VFX.findById(req.params.id);
        if (!vfxItem) {
            return res.status(404).json({ message: 'VFX item not found' });
        }

        await vfxItem.deleteOne();  // Use deleteOne() instead of remove()
        res.json({ message: 'VFX item deleted' });
    } catch (err) {
        console.error('Error deleting VFX:', err);
        res.status(500).json({ message: 'Error deleting VFX' });
    }
});



module.exports = router;
