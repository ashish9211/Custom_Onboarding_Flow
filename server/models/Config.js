const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  page2Components: {
    type: [String], 
    default: []
  },
  page3Components: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Config', configSchema);