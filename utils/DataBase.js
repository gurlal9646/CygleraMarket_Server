require('dotenv').config();
const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.DB_NAME}`;

let client;

async function connect() {
  try {
    console.log('Connecting to MongoDB with URI:', uri);
  await mongoose.connect(uri);
  return mongoose;
 } catch (e) {
 console.error(e);
  throw e; // Rethrow the error for the caller to handle
 }
}

module.exports = { connect };