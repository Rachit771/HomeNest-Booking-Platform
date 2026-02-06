const mongoose = require('mongoose');

const DB =
  'mongodb+srv://sharmarachit554_db_user:VQto3C7C1YTWVC1N@rachitdb.mxslh19.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Rachitdb';

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
