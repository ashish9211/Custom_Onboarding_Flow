const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/, // e.g. "step-2", "profile-details"
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
      min: 0,
    },

    // Dynamic components, any string allowed
    components: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { _id: false }
);

const OnboardingConfigSchema = new mongoose.Schema(
  {
    pages: {
      type: [PageSchema],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'OnboardingConfig must define at least one page.',
      },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'onboarding_configs',
  }
);

// Indexes
OnboardingConfigSchema.index({ isActive: 1 });
OnboardingConfigSchema.index({ 'pages.key': 1 }, { sparse: true });

// Uniqueness checks
OnboardingConfigSchema.pre('validate', function (next) {
  const keys = this.pages.map((p) => p.key);
  const orders = this.pages.map((p) => p.order);

  const dupKey = keys.find((k, i) => keys.indexOf(k) !== i);
  if (dupKey) return next(new Error(`Duplicate page.key "${dupKey}" detected.`));

  const dupOrder = orders.find((o, i) => orders.indexOf(o) !== i);
  if (dupOrder !== undefined) return next(new Error(`Duplicate page.order "${dupOrder}" detected.`));

  next();
});

// JSON output formatting
OnboardingConfigSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    return ret;
  },
});
OnboardingConfigSchema.set('toObject', { virtuals: true, versionKey: false });

module.exports = mongoose.model('OnboardingConfig', OnboardingConfigSchema);
