const express = require('express');
const ReelDetails = require('../models/reelDetails'); // Adjust the path if needed
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all reels for a specific category
router.get('/:category', async (req, res) => {
  try {
    const reelsDetails = await ReelDetails.findOne({ category: req.params.category });
    if (!reelsDetails) {
      return res.status(404).json({ message: 'No videos found for this category' });
    }
    res.json(reelsDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new video for a specific category
router.post('/', upload.single('video'), async (req, res) => {
  const { category } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Video file is missing' });
  }

  try {
    let reelDetails = await ReelDetails.findOne({ category });

    // Upload video to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'video' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    const videoUrl = result.secure_url;

    if (reelDetails) {
      // If category exists, add new video
      reelDetails.videos.push(videoUrl);
    } else {
      // If not, create a new category and add video
      reelDetails = new ReelDetails({
        category,
        videos: [videoUrl],
      });
    }

    const savedReelDetails = await reelDetails.save();
    res.status(201).json(savedReelDetails);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a specific video from a category
router.delete('/:category', async (req, res) => {
  const { category } = req.params;
  const { video } = req.body; // Video URL to delete

  try {
    let reelDetails = await ReelDetails.findOne({ category });

    if (!reelDetails) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the video index and remove it
    const videoIndex = reelDetails.videos.indexOf(video);
    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Video not found in this category' });
    }

    // Delete the video from Cloudinary
    const publicId = video.split('/').pop().split('.')[0]; // Extract publicId from URL
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

    // Remove video from MongoDB
    reelDetails.videos.splice(videoIndex, 1);
    await reelDetails.save();

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update a video in a specific category (replace an existing video)
router.put('/:category', upload.single('video'), async (req, res) => {
  const { category } = req.params;
  const { oldVideoUrl } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'New video file is missing' });
  }

  try {
    let reelDetails = await ReelDetails.findOne({ category });

    if (!reelDetails) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find index of old video
    const videoIndex = reelDetails.videos.indexOf(oldVideoUrl);
    if (videoIndex === -1) {
      return res.status(404).json({ message: 'Old video not found in this category' });
    }

    // Upload new video to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'video' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(req.file.buffer);
    });

    const newVideoUrl = result.secure_url;

    // Replace old video with new video
    reelDetails.videos[videoIndex] = newVideoUrl;
    await reelDetails.save();

    // Delete old video from Cloudinary
    const publicId = oldVideoUrl.split('/').pop().split('.')[0]; // Extract publicId from URL
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

    res.status(200).json({ message: 'Video updated successfully', reelDetails });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
