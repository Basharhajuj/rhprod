const mongoose = require('mongoose');

const reelDetailsSchema = new mongoose.Schema({
  category: { type: String, required: true }, // Category for which the videos are being added
  videos: [{ type: String, required: true }]  // Array of video URLs from Cloudinary
});

module.exports = mongoose.model('ReelDetails', reelDetailsSchema);
