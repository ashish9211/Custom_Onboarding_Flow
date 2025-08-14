const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  about_me: String,
  birthdate: String,
  address_street: String,
  address_city: String,
  address_state: String,
  address_zip: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);