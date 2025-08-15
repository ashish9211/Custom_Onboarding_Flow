const OnboardingConfig = require('../models/OnboardingConfig');
const FormField = require('../models/FormField');
const asyncHandler = require('../utils/asyncHandler');

// GET all fields
exports.getFields = asyncHandler(async (_req, res) => {
  const fields = await FormField.find().sort({ key: 1 });
  res.json(fields);
});

// GET onboarding pages (with field details)
exports.getPages = asyncHandler(async (_req, res) => {
  const config = await OnboardingConfig.findOne();
  if (!config) return res.status(404).json({ error: 'Onboarding config not found' });

  // Populate field info dynamically
  const fields = await FormField.find();
  const fieldMap = {};
  fields.forEach(f => (fieldMap[f.key] = f));

  const pagesWithFieldInfo = config.pages.map(page => ({
    ...page.toObject(),
    components: page.components.map(key => fieldMap[key] || { key, label: key, type: 'text' })
  }));

  res.json({ pages: pagesWithFieldInfo });
});

// POST /api/formConfig - create/update pages
exports.updatePages = asyncHandler(async (req, res) => {
  const { pages } = req.body;
  if (!Array.isArray(pages) || pages.length === 0) {
    return res.status(400).json({ error: 'Pages must be a non-empty array' });
  }

  let config = await OnboardingConfig.findOne();
  if (!config) config = new OnboardingConfig({ pages });
  else config.pages = pages;

  await config.save();
  res.json(config);
});