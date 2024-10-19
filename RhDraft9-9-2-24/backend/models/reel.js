// models/reel.js
const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  background: { type: String, required: true },
  video: { type: String, required: true },
  poster: { type: String, required: false },
  category: { type: String, required: true, unique: true, enum: ['products', 'feedback', 'general environment', 'educational', 'service'] },
});

module.exports = mongoose.model('Reel', reelSchema);