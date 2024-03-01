const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  contractId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  itemId: {
    type: Number,
    required: true,
  },
  sellerId: {
    type: Number,
    required: true,
  },
  buyerId: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: null,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  createdBy: {
    type: Number,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  updatedBy: {
    type: Number,
    default: null,
  },
});

const Contract = mongoose.model("contract", contractSchema, "Contract");

module.exports = { Contract };
