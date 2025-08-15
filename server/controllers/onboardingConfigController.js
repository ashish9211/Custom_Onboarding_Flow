const OnboardingConfig = require('../models/OnboardingConfig');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/config
exports.getConfig = asyncHandler(async (req, res) => {
  const config = await OnboardingConfig.findOne();
  if (!config) {
    return res.status(404).json({ error: 'Onboarding config not found' });
  }

  res.json({ pages: config.pages });
});

// POST /api/config
// Create or update config dynamically
exports.updateConfig = asyncHandler(async (req, res) => {
  const { pages } = req.body;

  if (!Array.isArray(pages) || pages.length === 0) {
    return res.status(400).json({ error: 'Pages must be a non-empty array' });
  }

  let config = await OnboardingConfig.findOne();
  if (!config) {
    config = new OnboardingConfig({ pages });
  } else {
    config.pages = pages;
  }

  await config.save();
  res.json(config);
});
