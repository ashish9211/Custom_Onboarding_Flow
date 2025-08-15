const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const asyncHandler = require('../utils/asyncHandler');

// Get all users
router.get('/', userController.getAllUsers);

// Signup
router.post('/signup', userController.signup);

// Login
router.post('/login', userController.login);

// Update user
router.patch('/:id', userController.updateUser);

module.exports = router;


