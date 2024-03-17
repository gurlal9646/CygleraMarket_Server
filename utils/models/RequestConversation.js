const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestConversationSchema = new Schema({
  requestId: {
    type: String,
    required: true,
  },
  conversationId:{
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  message:{
    type: String,
    required: true,
  },
  timeStamp:{
    type: Date,
        default: Date.now,
        required: true
  }
});

const RequestConversation = mongoose.model(
  "requestForApproval",
  requestConversationSchema,
  "RequestConversation"
);

module.exports = { RequestConversation };
