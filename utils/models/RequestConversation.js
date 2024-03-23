const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestConversationSchema = new Schema({
  requestId: {
    type: String,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
    unique: true,
  },
  buyerId: {
    type: String,
    default :'',
    
  },
  sellerId: {
    type: String,
    default :'',
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000 // Example: limit message to 1000 characters
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// Ensure that either buyerId or sellerId is present
requestConversationSchema.path('buyerId').validate(function(value) {
  return this.buyerId || this.sellerId;
}, 'Either buyerId or sellerId must be present.');

// Ensure that only one of buyerId or sellerId is present
requestConversationSchema.path('sellerId').validate(function(value) {
  return !this.buyerId || this.sellerId;
}, 'Either buyerId or sellerId must be present, not both.');

const RequestConversation = mongoose.model(
  "RequestConversation",
  requestConversationSchema,
  "RequestConversation"
);

module.exports = { RequestConversation };
