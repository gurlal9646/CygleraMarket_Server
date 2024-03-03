const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    serviceId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
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

const Service = mongoose.model('service', serviceSchema, 'Service');

module.exports = { Service };
