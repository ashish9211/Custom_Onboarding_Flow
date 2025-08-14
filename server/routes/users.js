const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ _id: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new user (email + password)
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    // ✅ Send frontend-friendly shape
    res.status(201).json({
      id: newUser._id.toString(), // make sure it's a string
      email: newUser.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user onboarding data by user ID (partial updates)
router.patch('/:id', async (req, res) => {
  const allowedFields = [
    'about_me',
    'birthdate',
    'address_street',
    'address_city',
    'address_state',
    'address_zip',
  ];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Keep responses consistent
    res.json({
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      ...updates,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;