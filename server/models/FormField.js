const mongoose = require('mongoose');

// Each field represents an input type our wizard supports
const formFieldSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['text', 'textarea', 'date', 'address', 'group'] // add 'group'
  },
  fields: { type: [this], default: undefined } // optional nested fields
});

module.exports = mongoose.model('FormField', formFieldSchema);
