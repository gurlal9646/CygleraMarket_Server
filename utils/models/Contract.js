const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  contractId: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ["Approved by seller", "Approved by buyer", "Payment Pending","Payment Completed"],
    default: "Approved by seller",
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
