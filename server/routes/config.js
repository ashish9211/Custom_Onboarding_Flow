const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

// Get config
router.get('/', async (req, res) => {
  try {
    let config = await Config.findOne(); // fetch the first config document
    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }
    res.json({
      page2Components: config.page2Components,
      page3Components: config.page3Components
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update config
router.post('/', async (req, res) => {
  const { page2Components, page3Components } = req.body;

  if (!Array.isArray(page2Components) || !Array.isArray(page3Components)) {
    return res.status(400).json({ error: 'Components must be arrays' });
  }

  try {
    let config = await Config.findOne();
    if (!config) {
      // Create a new config if none exists
      config = new Config({ page2Components, page3Components });
    } else {
      config.page2Components = page2Components;
      config.page3Components = page3Components;
    }
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;