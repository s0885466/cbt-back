const mongoose = require('mongoose');
const { Schema } = mongoose;
const MODEL_NAMES = require('./model-names');

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: [{ type: String, ref: 'Role', required: true }],
});

module.exports = mongoose.model(MODEL_NAMES.USER, userSchema);
