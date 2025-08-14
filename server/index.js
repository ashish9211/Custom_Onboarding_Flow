require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./routes/users');
const configRouter = require('./routes/config');

const app = express();
app.use(cors());
app.use(express.json());

// Debug log
console.log('Starting server...');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');

  // Start server only after DB connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/users', usersRouter);
app.use('/api/config', configRouter);

app.get('/', (req, res) => res.send('Server is running...'));