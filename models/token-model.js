const mongoose = require('mongoose');

const MODEL_NAMES = require('./model-names');
const UserModel = require('./user-model');

const tokenSchema = new mongoose.Schema({
  refreshToken: { type: String, unique: true, required: true },
  user: { type: mongoose.Types.ObjectId, ref: UserModel, required: true },
});

module.exports = mongoose.model(MODEL_NAMES.TOKEN, tokenSchema);
