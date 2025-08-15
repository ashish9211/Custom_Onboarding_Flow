const User = require('../models/User');
const OnboardingProgress = require('../models/OnboardingProgress');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcryptjs');


// GET /api/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await require('../models/User').find();
  res.json(users.map(u => u.toJSON())); // hides passwords automatically
});

// POST /api/users/signup
exports.signup = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ error: 'Email already exists' });

  const user = new User({ email, password });
  await user.save();

  // Initialize onboarding progress
  await OnboardingProgress.create({ userId: user._id, currentStep: 0, completedSteps: [] });

  res.status(201).json({ id: user._id.toString(), email: user.email });
});

// POST /api/users/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Optionally generate JWT here
  res.json({ id: user._id.toString(), email: user.email });
});

// PATCH /api/users/:id
exports.updateUser = asyncHandler(async (req, res) => {
  const allowedFields = ['aboutMe', 'birthdate', 'address'];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No valid fields provided' });

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user.toJSON());
});