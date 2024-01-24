const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  name: { type: String, required: true },
  value: { type: Number, default: 1 },
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = {Counter};