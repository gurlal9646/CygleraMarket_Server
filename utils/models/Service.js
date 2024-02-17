const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    serviceId: Number,
    sellerId: Number,
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
    
    createdAt: {
        type: Date,
        default: Date.now // Set default value to the current date
    },
    createdBy: {
        type: Number,
        default: null
    },
    updatedAt: {
        type: Date,
        default: null // Set default value to null
    },
    updatedBy: {
        type: Number,
        default: null // Set default value to null
    }
});

const Service = mongoose.model('service', serviceSchema, 'Service');

module.exports = { Service };
