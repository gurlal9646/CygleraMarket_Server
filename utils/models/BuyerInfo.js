const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyerSchema = new Schema({
    buyerId: Number,
    firstName: String,
    lastName: String,
    email:String,
    countryCode:String,
    phoneNumber:String,
    companyName:String,
    category:String,
    status: String,
    companySize: String,
    businessNumber: String,
    streetAddress: String,
    city: String,
    state: String,
    country:String,
    postalCode: String,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now, // Set default value to the current date
      },
      createdBy: {
        type: Number,
        default: null,
      },
      updatedAt: {
        type: Date,
        default: null, // Set default value to null
      },
      updatedBy: {
        type: Number,
        default: null, // Set default value to null
      },
  });
  
const Buyer = mongoose.model('buyer', buyerSchema,'Buyer');

module.exports = {Buyer} ;