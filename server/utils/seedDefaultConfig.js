const OnboardingConfig = require('../models/OnboardingConfig');
const FormField = require('../models/FormField');

async function seedDefaultConfig() {
  try {
    // Seed default fields
    const defaultFields = [
      { key: 'aboutMe', label: 'About Me', type: 'textarea' },
      { key: 'birthdate', label: 'Birthdate', type: 'date' },
      { key: 'address', label: 'Address', type: 'group', fields: [
        { key: 'street', label: 'Street', type: 'text' },
        { key: 'city', label: 'City', type: 'text' },
        { key: 'state', label: 'State', type: 'text' },
        { key: 'postalCode', label: 'Postal Code', type: 'text' }
      ]}
    ];

    for (const field of defaultFields) {
      const exists = await FormField.findOne({ key: field.key });
      if (!exists) await FormField.create(field);
    }

    // Seed default onboarding pages if none exist
    const existingConfig = await OnboardingConfig.findOne();
    if (!existingConfig) {
      await OnboardingConfig.create({
        pages: [
          {
            key: 'step-1',
            title: 'Personal Info',
            order: 1,
            components: ['address', 'birthdate'] // <-- use address as one component
          },
          {
            key: 'step-2',
            title: 'Profile',
            order: 2,
            components: ['aboutMe']
          }
        ]
      });
      console.log('✅ Default config and fields seeded');
    } else {
      console.log('ℹ️ Config already exists, skipping seeding.');
    }
  } catch (error) {
    console.error('❌ Error seeding defaults:', error.message);
  }
}

module.exports = seedDefaultConfig;