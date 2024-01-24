const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accessInfoSchema = new Schema({
    accessInfoId: Number,
    email:String,
    password: String,
    isLocked: {
        type: Boolean,
        default: false
      },
      buyerId: {
        type: Number,
        default: 0
      },
      sellerId: {
        type: Number,
        default: 0
      },
      roleId: {
        type: Number,
        default: 0
      },
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
  
const AccessInfo = mongoose.model('accessInfo', accessInfoSchema,'AccessInfo');

module.exports = {AccessInfo} ;