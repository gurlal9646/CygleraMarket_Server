const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productId: Number,
    sellerId:Number,
    name: String,
    description:String,
    price:Number,
    category:String,
    manufacturer:String,
    stockQuantity:Number,
    expiryDate: {
        type: Date,
        default: null, // Set default value to null
    },
    storageConditions: String,
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
  
const Product = mongoose.model('product', productSchema,'Product');

module.exports = {Product} ;