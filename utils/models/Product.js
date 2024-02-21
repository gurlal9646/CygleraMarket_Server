const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productId: {
        type: Number,
        required: true
    },
    sellerId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 1
    },
    expiryDate: {
        type: Date,
        default: null,
        required: true
    },
    storageConditions: {
        type: String,
        required: true
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

const Product = mongoose.model('product', productSchema, 'Product');

module.exports = { Product };
