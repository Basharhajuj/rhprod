const mongoose = require('mongoose');

const vfxSchema = new mongoose.Schema({
    title: { type: String, required: true },
    video: { type: String, required: true },
    poster: { type: String, required: true }
});

module.exports = mongoose.model('VFX', vfxSchema);
