const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    sellerId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    companySize: {
        type: String,
        required: true
    },
    businessNumber: {
        type: String,
        required: true
    },
    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    password: {
        type: String
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
  }
});

const Seller = mongoose.model('seller', sellerSchema, 'Seller');

module.exports = { Seller };
