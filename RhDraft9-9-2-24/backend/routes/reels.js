// routes/reels.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Reel = require('../models/reel');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all reels
router.get('/', async (req, res) => {
  try {
    const reels = await Reel.find();
    res.json(reels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new reel entry (only one reel per category)
router.post('/', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'poster', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, background, category } = req.body;

    // Check if a reel already exists for this category
    let existingReel = await Reel.findOne({ category });
    if (existingReel) {
      return res.status(400).json({ message: 'A reel already exists for this category' });
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

    // Upload poster to Cloudinary (if provided)
    let posterResult = null;
    if (req.files.poster) {
      posterResult = await new Promise((resolve, reject) => {
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
    }

    // Create a new Reel entry
    const newReel = new Reel({
      title,
      description,
      background,
      video: videoResult.secure_url,
      poster: posterResult ? posterResult.secure_url : '',
      category,
    });

    // Save to the database
    const savedReel = await newReel.save();
    res.status(201).json(savedReel);
  } catch (err) {
    console.error('Error uploading video or saving Reel:', err);
    res.status(500).json({ message: 'Error uploading video or saving Reel' });
  }
});

// PUT: Update an existing reel entry by category
router.put('/:category', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'poster', maxCount: 1 }]), async (req, res) => {
  try {
    const { category } = req.params;
    const { title, description, background } = req.body;

    // Find the existing reel by category
    const reel = await Reel.findOne({ category });
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found for this category' });
    }

    // Update title, description, and background if provided
    reel.title = title || reel.title;
    reel.description = description || reel.description;
    reel.background = background || reel.background;

    // Update video if a new one is uploaded
    if (req.files && req.files.video) {
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
      reel.video = videoResult.secure_url;
    }

    // Update poster if a new one is uploaded
    if (req.files && req.files.poster) {
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
      reel.poster = posterResult.secure_url;
    }

    const updatedReel = await reel.save();
    res.json(updatedReel);
  } catch (err) {
    console.error('Error updating reel:', err);
    res.status(400).json({ message: err.message });
  }
});


// DELETE: Remove a reel by category
router.delete('/:category', async (req, res) => {
  try {
    const reel = await Reel.findOne({ category: req.params.category });
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    await reel.deleteOne();
    res.json({ message: 'Reel deleted' });
  } catch (err) {
    console.error('Error deleting reel:', err);
    res.status(500).json({ message: 'Error deleting reel' });
  }
});


module.exports = router;