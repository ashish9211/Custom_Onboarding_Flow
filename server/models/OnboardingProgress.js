
//Optional:  to implement JWT auth
const mongoose = require('mongoose');

const onboardingProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentStep: { type: Number, default: 0 },
  completedSteps: { type: [Number], default: [] }
}, { timestamps: true });

onboardingProgressSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('OnboardingProgress', onboardingProgressSchema);