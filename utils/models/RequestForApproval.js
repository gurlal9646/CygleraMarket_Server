const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestForApprovalSchema = new Schema({
  requestId: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    enum: [1, 2, 3],
    default: 1,
    required: true,
  },
  itemUniqueId: {
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  sellerUniqueId: {
    type: String
  },
  sellerId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    default: null,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  price: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
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

const RequestForApproval = mongoose.model(
  "requestForApproval",
  requestForApprovalSchema,
  "RequestForApproval"
);

module.exports = { RequestForApproval };
