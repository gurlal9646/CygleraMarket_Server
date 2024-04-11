const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accessInfoSchema = new Schema({
  accessInfoId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isLocked: {
    type: Boolean,
    default: false,
    required: true,
  },
  buyerId: {
    type: String,
    default: "",
  },
  sellerId: {
    type: String,
    default: "",
  },
  roleId: {
    type: Number,
    default: 0,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
    required: true,
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

const AccessInfo = mongoose.model("accessInfo", accessInfoSchema, "AccessInfo");

module.exports = { AccessInfo };
