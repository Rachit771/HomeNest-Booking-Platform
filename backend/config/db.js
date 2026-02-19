const mongoose = require('mongoose');

require('dotenv').config();

const DB = process.env.MONGO_URI;


const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log('DB connected');
  } catch (err) {
    console.error('Error while connecting', err);
    process.exit(1);
  }
};

module.exports = { connectDB, DB };
