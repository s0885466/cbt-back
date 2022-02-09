const mongoose = require('mongoose');
const MODEL_NAMES = require('./model-names');
const DEFAULT_ROLE = 'USER';

const roleSchema = new mongoose.Schema({
  value: { type: String, default: DEFAULT_ROLE, unique: true },
});

module.exports = mongoose.model(MODEL_NAMES.ROLE, roleSchema);
