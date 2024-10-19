require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const reelsRoutes = require('./routes/reels');
const vfxsRoutes = require('./routes/vfxs');
const reelsDetailsRoutes = require('./routes/reelsDetails');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// API Routes
app.use('/api/reels', reelsRoutes);
app.use('/api/reels-details', reelsDetailsRoutes);
app.use('/api/vfx', vfxsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
