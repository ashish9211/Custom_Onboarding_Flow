require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/userRoutes');
const configRoutes = require('./routes/configRoutes');

// Utils
const seedDefaultConfig = require('./utils/seedDefaultConfig');
const asyncHandler = require('./utils/asyncHandler'); // Optional wrapper for async controllers

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.send('Server is running...'));

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Seed default fields & pages if DB is empty
    await seedDefaultConfig();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/config', configRoutes);

// Centralized error handling (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});